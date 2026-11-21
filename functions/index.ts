/**
 * 同源 LLM 代理（/v2 远程模型可用性修复）。
 *
 * 背景：浏览器直连 open.bigmodel.cn 等 OpenAI 兼容端点时，
 * `Authorization` + `Content-Type: application/json` 必然触发 CORS 预检
 * （OPTIONS），而该端点不回 CORS 头 → fetch 直接 TypeError，远程模型整体不可用。
 * 本函数把 chat/completions 挪到服务端同源发起：浏览器只与本站通信。
 *
 * 对外挂载点：POST /functions/v1/app/llm（函数内规范路径 /llm，两种写法等价）。
 * 客户端侧约定见 src/v2/config.ts 的 LLM_PROXY_PATH。
 *
 * 安全边界（本文件的全部职责）：
 * - 只接受 POST；路径只认 /llm 与 /functions/v1/app/llm，其余一律 404；
 * - 请求体上限 1MB，且必须是含非空 model + 非空 messages 的合法 JSON；
 * - 上游只允许白名单主机的 chat/completions；目标 URL 完全由白名单表推导
 *   （协议 / 主机 / 路径固定），客户端任何 URL 细节都不被透传；
 * - SSRF 防护：非 https、显式端口、userinfo、query / fragment、主机名
 *   非白名单精确匹配（IP 直连、内网元数据地址、子域伪装一律拒绝）；
 * - Authorization 只原样转发给白名单上游：不落盘、不打日志、不回显。
 *
 * 运行形态：仅用 Web 标准接口（Request / Response / fetch / URL），
 * Workers / Deno / Node ≥ 18 均可承载。导出 `handleRequest` 供任意服务端
 * 框架适配；`default { fetch }` 供 Workers 风格接入。
 */

/** 白名单上游：主机 → 固定的 chat/completions 路径（BigModel 走 /api/paas/v4） */
export interface UpstreamTarget {
  host: string;
  chatCompletionsPath: string;
}

export const UPSTREAM_WHITELIST: Readonly<Record<string, UpstreamTarget>> = {
  'open.bigmodel.cn': { host: 'open.bigmodel.cn', chatCompletionsPath: '/api/paas/v4/chat/completions' },
  'api.openai.com': { host: 'api.openai.com', chatCompletionsPath: '/v1/chat/completions' },
};

/** 客户端指认上游的请求头：值为用户配置的 OpenAI 兼容 baseUrl，仅取主机名做白名单匹配 */
export const BASE_URL_HEADER = 'x-llm-base-url';

/** 函数内规范路径与平台挂载路径（同一端点的两种写法） */
export const FUNCTION_PATHS: ReadonlySet<string> = new Set(['/llm', '/functions/v1/app/llm']);

/** 请求体字节上限（防超大载荷打爆函数实例） */
export const MAX_REQUEST_BYTES = 1_048_576;

/** 代理内部错误：status 直接映射 HTTP 状态码（不用参数属性语法，兼容 strip-only 运行时） */
class ProxyError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function jsonResponse(status: number, message: string, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ error: { type: 'llm-proxy', message } }), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extraHeaders },
  });
}

/** 路径归一化：去尾部斜杠（/llm/// → /llm；/ → /） */
function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * 由客户端 baseUrl 解析上游目标（SSRF 关卡）：
 * 只认 https、无 userinfo、无显式端口、无 query / fragment、主机名与白名单
 * 精确匹配；命中后目标 URL 由白名单表整体重建（客户端的路径不参与拼装）。
 */
function resolveUpstreamTarget(baseUrl: string | null): URL {
  if (baseUrl === null || baseUrl.trim() === '') {
    throw new ProxyError(400, `缺少 ${BASE_URL_HEADER} 请求头（值为所配置的 OpenAI 兼容 baseUrl）`);
  }
  let parsed: URL;
  try {
    parsed = new URL(baseUrl.trim());
  } catch {
    throw new ProxyError(400, `${BASE_URL_HEADER} 不是合法 URL`);
  }
  if (parsed.protocol !== 'https:') throw new ProxyError(403, '上游仅允许 https 协议');
  if (parsed.username !== '' || parsed.password !== '') throw new ProxyError(403, '上游 URL 不允许携带 userinfo');
  if (parsed.port !== '') throw new ProxyError(403, '上游 URL 不允许显式端口');
  if (parsed.search !== '' || parsed.hash !== '') throw new ProxyError(403, '上游 URL 不允许 query / fragment');
  const target = UPSTREAM_WHITELIST[parsed.hostname];
  if (target === undefined) {
    const allowed = Object.keys(UPSTREAM_WHITELIST).join(' / ');
    throw new ProxyError(403, `上游主机不在白名单内：${parsed.hostname}（允许：${allowed}）`);
  }
  return new URL(`https://${target.host}${target.chatCompletionsPath}`);
}

/** 读体并限长：边读边累计字节，超限立即中断（不整包进内存后才校验） */
async function readBodyLimited(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (reader === undefined) return '';
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value === undefined) continue;
    bytes += value.byteLength;
    if (bytes > MAX_REQUEST_BYTES) {
      throw new ProxyError(413, `请求体超过 ${MAX_REQUEST_BYTES} 字节上限`);
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

/** 请求体必须是 chat/completions 形状的合法 JSON（非空 model + 非空 messages） */
function assertChatBody(body: string): void {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new ProxyError(400, '请求体必须是合法 JSON');
  }
  const v = payload as { model?: unknown; messages?: unknown };
  if (typeof v.model !== 'string' || v.model.trim() === '') {
    throw new ProxyError(400, '请求体缺少非空 model 字段');
  }
  if (!Array.isArray(v.messages) || v.messages.length === 0) {
    throw new ProxyError(400, '请求体缺少非空 messages 数组');
  }
}

export interface ProxyDeps {
  /** 上游 fetch（测试注入接缝；缺省用全局 fetch） */
  fetchImpl?: (input: string, init?: RequestInit) => Promise<Response>;
}

/**
 * 代理主入口：校验方法 / 路径 / 体积 / 请求体 / 上游白名单后转发
 * chat/completions，响应（含 SSE 流式 body）原样透传给浏览器。
 */
export async function handleRequest(request: Request, deps: ProxyDeps = {}): Promise<Response> {
  const doFetch = deps.fetchImpl ?? ((input: string, init?: RequestInit) => fetch(input, init));
  try {
    // 1) 路径：本函数只提供 /llm 一个端点
    const pathname = normalizePath(new URL(request.url).pathname);
    if (!FUNCTION_PATHS.has(pathname)) {
      return jsonResponse(404, `未知路径：${pathname}（本函数只提供 POST /llm）`);
    }
    // 2) 方法：只接受 POST
    if (request.method !== 'POST') {
      return jsonResponse(405, `方法不允许：${request.method}（仅 POST）`, { allow: 'POST' });
    }
    // 3) 体积：声明长度预检 + 实读字节硬限
    const declared = Number(request.headers.get('content-length') ?? '0');
    if (Number.isFinite(declared) && declared > MAX_REQUEST_BYTES) {
      throw new ProxyError(413, `请求体超过 ${MAX_REQUEST_BYTES} 字节上限`);
    }
    const body = await readBodyLimited(request);
    // 4) 请求体形状
    assertChatBody(body);
    // 5) 上游白名单 + SSRF 关卡，目标 URL 由白名单表整体重建
    const upstreamUrl = resolveUpstreamTarget(request.headers.get(BASE_URL_HEADER));

    // 6) 转发：仅放行 content-type + Authorization 两个头，其余客户端头一概不透传
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    const authorization = request.headers.get('authorization');
    if (authorization !== null) headers.authorization = authorization;
    let upstream: Response;
    try {
      upstream = await doFetch(upstreamUrl.toString(), { method: 'POST', headers, body });
    } catch {
      throw new ProxyError(502, `上游 ${upstreamUrl.host} 不可达`);
    }

    // 7) 透传响应：保留 content-type 与状态码，body 原样回流（SSE 流式不被缓冲）
    const outHeaders = new Headers({ 'cache-control': 'no-store' });
    const contentType = upstream.headers.get('content-type');
    if (contentType !== null) outHeaders.set('content-type', contentType);
    return new Response(upstream.body, { status: upstream.status, headers: outHeaders });
  } catch (error) {
    if (error instanceof ProxyError) return jsonResponse(error.status, error.message);
    return jsonResponse(500, 'llm-proxy 内部错误');
  }
}

/** Workers / Deno.serve 风格接入 */
export default {
  fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  },
};
