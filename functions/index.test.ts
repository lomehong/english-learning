import { describe, it, expect, vi } from 'vitest';
import {
  handleRequest,
  UPSTREAM_WHITELIST,
  MAX_REQUEST_BYTES,
  BASE_URL_HEADER,
} from './index';

/**
 * 同源 LLM 代理（functions/index.ts）单测：
 * - 白名单拒绝 / SSRF 防护：任何非白名单上游（含 IP 直连、内网元数据、
 *   子域伪装、http、userinfo、显式端口、query）都在发起上游 fetch 前被拦下；
 * - BigModel 双规范路径：/api/paas/v4 与 /api/coding/paas/v4 均放行，
 *   其余路径（错误版本、多级、完整端点当 baseUrl 等）一律拒绝；
 * - 网关物理路径：函数名被替换成物理名后实际路径形如 /app-xxx/llm，
 *   任意前缀 + 末段 llm 均放行，末段不是 llm 的一律 404；
 * - 方法 / 路径 / 体积 / 请求体形状校验；
 * - 放行路径：目标 URL 由白名单表整体重建，Authorization 原样转发，
 *   SSE 流式响应透传，Key 全程不落盘（无任何持久化调用点）。
 */

const SITE = 'https://study.example.com';

const VALID_BODY = JSON.stringify({
  model: 'glm-4-flash',
  messages: [{ role: 'user', content: '你好' }],
  stream: true,
});

interface ProxyRequestInit {
  path?: string;
  method?: string;
  baseUrl?: string | null;
  body?: string;
  authorization?: string | null;
}

function proxyRequest(init: ProxyRequestInit = {}): Request {
  const method = init.method ?? 'POST';
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (init.baseUrl !== null) headers[BASE_URL_HEADER] = init.baseUrl ?? 'https://open.bigmodel.cn/api/paas/v4';
  if (init.authorization !== null) headers.authorization = init.authorization ?? 'Bearer sk-test-key';
  // GET/HEAD 请求不允许携带 body（undici 构造约束）
  const body = method === 'GET' || method === 'HEAD' ? undefined : init.body ?? VALID_BODY;
  return new Request(`${SITE}${init.path ?? '/functions/v1/app/llm'}`, { method, headers, body });
}

function sseStream(lines: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const line of lines) controller.enqueue(encoder.encode(line));
      controller.close();
    },
  });
}

const SSE_LINES = [
  'data: {"choices":[{"delta":{"content":"你好"}}]}\n\n',
  'data: [DONE]\n\n',
];

const okSse = (): Response =>
  new Response(sseStream(SSE_LINES), { status: 200, headers: { 'content-type': 'text/event-stream' } });

type FetchMock = ReturnType<typeof vi.fn<(input: string, init?: RequestInit) => Promise<Response>>>;

/* -------------------- 放行路径 -------------------- */

describe('同源 LLM 代理：放行与转发', () => {
  it('白名单上游 open.bigmodel.cn → 固定转发 /api/paas/v4/chat/completions，SSE 流式透传', async () => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const res = await handleRequest(proxyRequest(), { fetchImpl: (i, j) => fetchMock(i, j) });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('text/event-stream');
    expect(await res.text()).toBe(SSE_LINES.join(''));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://open.bigmodel.cn/api/paas/v4/chat/completions');
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers.authorization).toBe('Bearer sk-test-key');
    expect(headers['content-type']).toBe('application/json');
    // 只放行 content-type + authorization：客户端其余头一概不透传
    expect(Object.keys(headers).sort()).toEqual(['authorization', 'content-type']);
    expect(JSON.parse(init.body as string).model).toBe('glm-4-flash');
  });

  it('BigModel coding baseUrl /api/coding/paas/v4 → 固定转发 /api/coding/paas/v4/chat/completions（双规范路径）', async () => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    await handleRequest(
      proxyRequest({ baseUrl: 'https://open.bigmodel.cn/api/coding/paas/v4' }),
      { fetchImpl: (i, j) => fetchMock(i, j) },
    );
    expect(fetchMock.mock.calls[0][0]).toBe('https://open.bigmodel.cn/api/coding/paas/v4/chat/completions');
  });

  it('coding baseUrl 尾斜杠归一化后同样命中规范路径', async () => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    await handleRequest(
      proxyRequest({ baseUrl: 'https://open.bigmodel.cn/api/coding/paas/v4/' }),
      { fetchImpl: (i, j) => fetchMock(i, j) },
    );
    expect(fetchMock.mock.calls[0][0]).toBe('https://open.bigmodel.cn/api/coding/paas/v4/chat/completions');
  });

  it('白名单上游 api.openai.com → 固定转发 /v1/chat/completions（用户配置的路径不参与拼装）', async () => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    await handleRequest(
      proxyRequest({ baseUrl: 'https://api.openai.com/v1' }),
      { fetchImpl: (i, j) => fetchMock(i, j) },
    );
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.openai.com/v1/chat/completions');
  });

  it('函数内规范路径 /llm 与挂载路径等价；尾斜杠归一化', async () => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const a = await handleRequest(proxyRequest({ path: '/llm' }), { fetchImpl: (i, j) => fetchMock(i, j) });
    const b = await handleRequest(proxyRequest({ path: '/llm///' }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each([
    ['/app-a1b2c3d4e5/llm', '网关物理名前缀（无 functions 段）'],
    ['/functions/v1/app-a1b2c3d4e5/llm', '网关物理名前缀（带 functions/v1 段）'],
    ['/some/deeply/nested/prefix/llm', '任意深前缀'],
    ['/app-a1b2c3d4e5/llm/', '物理路径尾斜杠'],
  ])('网关重写后的物理路径 %s（%s）同样放行', async (path) => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const res = await handleRequest(proxyRequest({ path }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://open.bigmodel.cn/api/paas/v4/chat/completions');
  });

  it('上游 4xx（如 Key 无效）状态码与响应体原样透传，不吞错误', async () => {
    const fetchMock: FetchMock = vi.fn(
      async () => new Response('{"error":{"message":"Invalid key"}}', { status: 401, headers: { 'content-type': 'application/json' } }),
    );
    const res = await handleRequest(proxyRequest(), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBe(401);
    expect(await res.text()).toContain('Invalid key');
  });

  it('上游网络不可达 → 502（不暴露内部异常细节）', async () => {
    const fetchMock: FetchMock = vi.fn(async () => {
      throw new TypeError('fetch failed');
    });
    const res = await handleRequest(proxyRequest(), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBe(502);
    expect(await res.text()).toContain('不可达');
  });

  it('无 Authorization 头时不伪造认证头（上游照常转发）', async () => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    await handleRequest(proxyRequest({ authorization: null }), { fetchImpl: (i, j) => fetchMock(i, j) });
    const headers = (fetchMock.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
    expect(headers.authorization).toBeUndefined();
  });
});

/* -------------------- 白名单拒绝 / SSRF 防护 -------------------- */

describe('同源 LLM 代理：白名单拒绝与 SSRF 防护（全部在发起上游 fetch 前拦下）', () => {
  const REJECTED_BASE_URLS: Array<[string, string]> = [
    ['https://evil.example.com/v1', '陌生主机'],
    ['https://bigmodel.cn/api/paas/v4', '相近但不同的官方域名'],
    ['https://open.bigmodel.cn.attacker.com/api/paas/v4', '子域伪装'],
    ['https://open-bigmodel-cn.com/v1', '连字符伪装'],
    ['https://open.bigmodel.cn./api/paas/v4', '尾随点绕过'],
    ['http://open.bigmodel.cn/api/paas/v4', '非 https 明文协议'],
    ['http://127.0.0.1:8080/v1', '回环 IP 直连'],
    ['http://localhost/v1', 'localhost 主机名'],
    ['http://169.254.169.254/latest/meta-data', '云内网元数据端点'],
    ['http://10.0.0.5:9000/v1', '内网 IPv4'],
    ['https://[::1]/v1', 'IPv6 回环'],
    ['https://open.bigmodel.cn:8443/api/paas/v4', '显式端口'],
    ['https://key:secret@open.bigmodel.cn/api/paas/v4', 'userinfo 携带凭据'],
    ['https://open.bigmodel.cn/api/paas/v4?x=1', 'query 参数'],
    ['https://open.bigmodel.cn/api/paas/v4#frag', 'fragment'],
    ['ftp://open.bigmodel.cn/api/paas/v4', '非 http(s) 协议'],
    ['not a url at all', '根本不是 URL'],
  ];

  it.each(REJECTED_BASE_URLS)('拒绝 %s（%s）：4xx 且不发起上游请求', async (baseUrl) => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const res = await handleRequest(proxyRequest({ baseUrl }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await res.text()).not.toContain('sk-test-key'); // 错误体不回显 Key
  });

  it('缺少 x-llm-base-url 头 → 400，不发起上游请求', async () => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const res = await handleRequest(proxyRequest({ baseUrl: null }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['https://open.bigmodel.cn/api/paas/v5', 'BigModel 错误版本号'],
    ['https://open.bigmodel.cn/api/paas', 'BigModel 缺版本段'],
    ['https://open.bigmodel.cn/api/coding/v4', 'coding 路径缺 paas 段'],
    ['https://open.bigmodel.cn/api/coding/paas/v4/extra', '规范路径后多一级'],
    ['https://open.bigmodel.cn/api/paas/v4/chat/completions', '把完整端点当 baseUrl'],
    ['https://open.bigmodel.cn/', '缺路径（裸主机）'],
    ['https://open.bigmodel.cn//api/paas/v4', '双斜杠非常规路径'],
    ['https://api.openai.com/v2', 'OpenAI 错误版本号'],
    ['https://api.openai.com/', 'OpenAI 缺路径'],
  ])('白名单主机的非法路径 %s（%s）→ 4xx 拒绝，不发起上游请求', async (baseUrl) => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const res = await handleRequest(proxyRequest({ baseUrl }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await res.text()).toContain('路径不在白名单内');
  });

  it('白名单表只含约定的两个主机（钉子：新增主机必须改这里）', () => {
    expect(Object.keys(UPSTREAM_WHITELIST).sort()).toEqual(['api.openai.com', 'open.bigmodel.cn']);
  });

  it('BigModel 只允许 /api/paas/v4 与 /api/coding/paas/v4 两种规范路径（钉子）', () => {
    expect(UPSTREAM_WHITELIST['open.bigmodel.cn'].allowedBasePaths).toEqual(['/api/paas/v4', '/api/coding/paas/v4']);
  });
});

/* -------------------- 方法 / 路径 / 体积 / 请求体校验 -------------------- */

describe('同源 LLM 代理：方法 / 路径 / 体积 / 请求体校验', () => {
  it.each(['GET', 'PUT', 'DELETE', 'OPTIONS'] as const)('非 POST 方法 %s → 405 + Allow: POST', async (method) => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const res = await handleRequest(proxyRequest({ method }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBe(405);
    expect(res.headers.get('allow')).toBe('POST');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    '/llm/embeddings',
    '/v1/chat/completions',
    '/functions/v1/app/other',
    '/app-a1b2c3d4e5/llm/extra',
    '/app-a1b2c3d4e5/LLM',
    '/app-a1b2c3d4e5/llmx',
    '/app-a1b2c3d4e5',
    '/',
  ])('路径 %s 末段不是 llm → 404，不发起上游请求', async (path) => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const res = await handleRequest(proxyRequest({ path }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('请求体超 1MB → 413，不发起上游请求', async () => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const bigBody = JSON.stringify({
      model: 'glm-4-flash',
      messages: [{ role: 'user', content: 'x'.repeat(MAX_REQUEST_BYTES) }],
    });
    const res = await handleRequest(proxyRequest({ body: bigBody }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['not-json', '坏 JSON'],
    [JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }), '缺 model'],
    [JSON.stringify({ model: '  ', messages: [{ role: 'user', content: 'hi' }] }), '空 model'],
    [JSON.stringify({ model: 'glm-4-flash' }), '缺 messages'],
    [JSON.stringify({ model: 'glm-4-flash', messages: [] }), '空 messages'],
  ])('请求体 %s（%s）→ 400，不发起上游请求', async (body) => {
    const fetchMock: FetchMock = vi.fn(async () => okSse());
    const res = await handleRequest(proxyRequest({ body }), { fetchImpl: (i, j) => fetchMock(i, j) });
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
