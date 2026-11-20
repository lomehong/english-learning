/**
 * /v2 对话式学习 · 模型设置存储（纯数据层，不触碰 DOM / 不打日志）。
 *
 * 安全红线：API Key 只写入用户本机 localStorage（约定键），本模块
 * 及页面层不得将其打印到控制台、写入任何仓库文件或上报网络。
 * 读取异常 / 损坏数据一律回退默认值，不抛出、不阻断页面。
 */

/** 存储接缝：含 removeItem（清空语义需要；测试注入假实现） */
export interface V2StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** localStorage 键（沿用 english-learning.*.v1 命名约定） */
export const V2_SETTINGS_KEY = 'english-learning.v2.settings.v1';

/** 模型提供商：GLM / DeepSeek / OpenAI 兼容 */
export type ModelProvider = 'glm' | 'deepseek' | 'openai-compatible';

export interface ModelProviderMeta {
  id: ModelProvider;
  label: string;
  /** 该提供商的默认 Base URL（可编辑覆盖） */
  defaultBaseURL: string;
  /** 该提供商的默认模型名（可编辑覆盖） */
  defaultModel: string;
}

/** 提供商清单（设置弹窗下拉顺序） */
export const MODEL_PROVIDERS: readonly ModelProviderMeta[] = [
  {
    id: 'glm',
    label: 'GLM（智谱）',
    defaultBaseURL: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4-flash',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    defaultBaseURL: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
  },
  {
    id: 'openai-compatible',
    label: 'OpenAI 兼容',
    defaultBaseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
  },
];

/** 默认提供商：列表首项（GLM） */
export const DEFAULT_PROVIDER: ModelProvider = MODEL_PROVIDERS[0]!.id;

export interface V2Settings {
  version: 1;
  provider: ModelProvider;
  baseURL: string;
  /** 仅存本机 localStorage，绝不写入仓库 / 日志 */
  apiKey: string;
  model: string;
}

export function providerMeta(provider: ModelProvider): ModelProviderMeta {
  return MODEL_PROVIDERS.find((p) => p.id === provider) ?? MODEL_PROVIDERS[0]!;
}

/** 默认设置：GLM + 该提供商默认 baseURL / 模型名，API Key 为空 */
export function defaultV2Settings(): V2Settings {
  const meta = providerMeta(DEFAULT_PROVIDER);
  return {
    version: 1,
    provider: meta.id,
    baseURL: meta.defaultBaseURL,
    apiKey: '',
    model: meta.defaultModel,
  };
}

function isModelProvider(value: unknown): value is ModelProvider {
  return typeof value === 'string' && MODEL_PROVIDERS.some((p) => p.id === value);
}

/** 规范化任意输入：字段缺失 / 类型错 / 非法提供商 → 整体回退默认 */
function normalizeSettings(raw: unknown): V2Settings {
  const fallback = defaultV2Settings();
  if (typeof raw !== 'object' || raw === null) return fallback;
  const data = raw as Record<string, unknown>;
  const { provider, baseURL, apiKey, model } = data;
  if (!isModelProvider(provider)) return fallback;
  if (typeof baseURL !== 'string' || baseURL.trim() === '') return fallback;
  if (typeof apiKey !== 'string') return fallback;
  if (typeof model !== 'string' || model.trim() === '') return fallback;
  return {
    version: 1,
    provider,
    baseURL: baseURL.trim(),
    apiKey: apiKey.trim(),
    model: model.trim(),
  };
}

/** 内存回退：无 localStorage 环境（隐私模式等）保持会话内读写一致 */
const memoryStorage = (): V2StorageLike => {
  const memory = new Map<string, string>();
  return {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => void memory.set(k, v),
    removeItem: (k) => void memory.delete(k),
  };
};

/** 默认存储：真实 localStorage；取不到（异常 / 不存在）降级内存实现 */
export function defaultV2Storage(): V2StorageLike {
  try {
    const ls = (globalThis as { localStorage?: V2StorageLike }).localStorage;
    if (ls) return ls;
  } catch {
    /* 隐私模式等场景访问 localStorage 可能抛异常 */
  }
  return memoryStorage();
}

/** 读取设置：空 / 损坏 JSON / 非法数据回退默认，不抛出 */
export function loadV2Settings(storage: V2StorageLike = defaultV2Storage()): V2Settings {
  try {
    return normalizeSettings(JSON.parse(storage.getItem(V2_SETTINGS_KEY) ?? 'null'));
  } catch {
    return defaultV2Settings();
  }
}

/** 保存设置（JSON 字符串写入约定键；写入失败静默不阻断） */
export function saveV2Settings(settings: V2Settings, storage: V2StorageLike = defaultV2Storage()): void {
  try {
    storage.setItem(V2_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* 存储满 / 隐私模式：设置仅本次会话生效 */
  }
}

/** 清空设置（移除约定键，回到默认；之后可重新保存） */
export function clearV2Settings(storage: V2StorageLike = defaultV2Storage()): void {
  try {
    storage.removeItem(V2_SETTINGS_KEY);
  } catch {
    /* 同上：静默降级 */
  }
}

/** 是否已配置 API Key（判定「本地占位回复」分支的唯一条件） */
export function hasApiKey(settings: V2Settings): boolean {
  return settings.apiKey.trim() !== '';
}

/** 页头状态徽标文案：未配置 → 提示占位回复；已配置 → 提供商 · 模型名 */
export function settingsStatusLabel(settings: V2Settings): string {
  if (!hasApiKey(settings)) return '未配置模型 · 本地占位回复';
  return `已配置 ${providerMeta(settings.provider).label} · ${settings.model}`;
}
