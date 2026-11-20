/**
 * v2 模型配置（T1）：OpenAI 兼容端点 + API Key + 模型名，localStorage 持久化。
 *
 * - 接缝：StorageLike 可注入（复用 v1 progress 的存储接缝），测试注入内存实现；
 * - 无 key 降级：apiKey 为空 / 全空白时 hasRemote=false，壳层走离线陪学剧本，
 *   页面始终可用，不因缺 key 白屏；
 * - 读取脏数据（坏 JSON / 字段类型不对）安全回退默认值，不抛异常。
 */

import { defaultStorage, type StorageLike } from '../store/progress';

export interface V2Config {
  version: 1;
  /** OpenAI 兼容服务地址（不含 /chat/completions；默认官方 API） */
  baseUrl: string;
  /** API Key；空串表示未配置（离线陪学模式） */
  apiKey: string;
  /** 模型名 */
  model: string;
}

export const V2_CONFIG_STORAGE_KEY = 'english-learning.v2.config.v1';
export const V2_CONFIG_VERSION = 1;

export const DEFAULT_V2_CONFIG: V2Config = {
  version: 1,
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
};

/** 非空字符串收敛（去首尾空白；undefined / 非串回退默认） */
function strOr(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed === '' ? fallback : trimmed;
}

/** 配置归一化（纯函数）：坏形状 / 缺字段回默认，Key 允许空（=未配置） */
export function normalizeV2Config(value: unknown): V2Config {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_V2_CONFIG };
  const v = value as Record<string, unknown>;
  if (v.version !== V2_CONFIG_VERSION) return { ...DEFAULT_V2_CONFIG };
  return {
    version: V2_CONFIG_VERSION,
    baseUrl: strOr(v.baseUrl, DEFAULT_V2_CONFIG.baseUrl),
    apiKey: typeof v.apiKey === 'string' ? v.apiKey.trim() : '',
    model: strOr(v.model, DEFAULT_V2_CONFIG.model),
  };
}

/** 读取并归一化；坏 JSON / 存取异常安全回退默认，不抛出 */
export function loadV2Config(storage: StorageLike = defaultStorage()): V2Config {
  let raw: string | null = null;
  try {
    raw = storage.getItem(V2_CONFIG_STORAGE_KEY);
  } catch {
    return { ...DEFAULT_V2_CONFIG };
  }
  if (!raw) return { ...DEFAULT_V2_CONFIG };
  try {
    return normalizeV2Config(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_V2_CONFIG };
  }
}

/** 归一化后持久化 */
export function saveV2Config(config: V2Config, storage: StorageLike = defaultStorage()): void {
  storage.setItem(V2_CONFIG_STORAGE_KEY, JSON.stringify(normalizeV2Config(config)));
}

/** 无 key 降级判定（纯函数）：有可用 Key 才启用远程 Agent */
export function hasRemoteAgent(config: V2Config): boolean {
  return config.apiKey !== '';
}

/** chat completions 端点（baseUrl 去尾部斜杠后拼 /chat/completions） */
export function chatCompletionsUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
}

/** 展示用脱敏 Key（首 4 位 + … + 末 2 位；过短则全打码） */
export function maskApiKey(key: string): string {
  if (key === '') return '';
  if (key.length <= 6) return '••••';
  return `${key.slice(0, 4)}…${key.slice(-2)}`;
}
