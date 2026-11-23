/**
 * /v2 对话历史本地持久化：
 *
 * - 用户与助手消息保存到 localStorage 键 english-learning.v2.history.v1；
 * - 条目形状（与验收 evidence.seedLocalStorage 约定一致）：
 *     [{ role: 'user' | 'assistant', text: string, at: number }, ...]
 * - 恢复：按 at 升序（时间顺序）取最近 HISTORY_MAX_MESSAGES = 50 条；
 * - 恢复提示条文案（restoredBannerText）：「已恢复上次对话（N 条）」，
 *   N 为实际恢复条数（壳层恢复后置顶显示，可关闭）；
 * - 安全降级：坏 JSON / 顶层非数组 → 空列表；非法条目（非对象 / 非法 role /
 *   非字符串 text / 纯空白 text）逐条丢弃；超长 text 截断到上限；at 非有限
 *   数字回退 0；storage 读 / 写抛异常（隐私模式、配额满）一律吞掉不炸页面。
 *
 * 本文件纯函数 + StorageLike 接缝（测试注入内存实现），与 config / seed
 * 同构；不使用 innerHTML / eval。
 */

import { defaultStorage, type StorageLike } from '../store/progress';

/** localStorage 键名（版本化：形状升级时换键，旧数据自然失效） */
export const HISTORY_STORAGE_KEY = 'english-learning.v2.history.v1';

/** 恢复 / 保存上限：最近 50 条 */
export const HISTORY_MAX_MESSAGES = 50;

/** 单条正文截断上限（超长条目降级为截断，防止撑爆 localStorage 配额） */
export const HISTORY_MAX_TEXT_CHARS = 8000;

/** 持久化的对话条目 */
export interface HistoryEntry {
  role: 'user' | 'assistant';
  /** 消息正文（assistant 轮可含 ```component 围栏，恢复后走同一渲染管线） */
  text: string;
  /** 时间戳（ms），排序键 */
  at: number;
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * 原始 unknown → 归一化条目列表（纯函数）：
 * - 顶层不是数组 → 空列表；
 * - 每条：role 只接受 user / assistant（system / tool 等一律丢弃），
 *   text 必须是字符串（纯空白丢弃），超长截断，at 非有限数字回退 0；
 * - 排序：按 at 升序（稳定排序，同刻保持插入顺序），再取最近 50 条。
 */
export function parseHistory(raw: unknown): HistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: HistoryEntry[] = [];
  for (const entry of raw) {
    if (!isObj(entry)) continue;
    if (entry.role !== 'user' && entry.role !== 'assistant') continue;
    if (typeof entry.text !== 'string') continue;
    const text = entry.text.slice(0, HISTORY_MAX_TEXT_CHARS);
    if (text.trim() === '') continue;
    const at = typeof entry.at === 'number' && Number.isFinite(entry.at) ? entry.at : 0;
    out.push({ role: entry.role, text, at });
  }
  out.sort((a, b) => a.at - b.at);
  return out.slice(-HISTORY_MAX_MESSAGES);
}

/** 从 storage 读取并解析；读失败 / 坏 JSON / 空白 → 空列表，不抛异常 */
export function loadChatHistory(storage: StorageLike = defaultStorage()): HistoryEntry[] {
  let raw: string | null = null;
  try {
    raw = storage.getItem(HISTORY_STORAGE_KEY);
  } catch {
    return [];
  }
  if (raw === null || raw.trim() === '') return [];
  try {
    return parseHistory(JSON.parse(raw));
  } catch {
    return [];
  }
}

/** 归一化（排序 + 截断到最近 50 条）后持久化；写失败静默忽略（不影响对话） */
export function saveChatHistory(entries: HistoryEntry[], storage: StorageLike = defaultStorage()): void {
  try {
    storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(parseHistory(entries)));
  } catch {
    /* 配额满 / 隐私模式：放弃本轮持久化即可，页面继续可用 */
  }
}

/** 清空历史（StorageLike 无 removeItem 接缝，写空数组即清空）；失败静默 */
export function clearChatHistory(storage: StorageLike = defaultStorage()): void {
  try {
    storage.setItem(HISTORY_STORAGE_KEY, '[]');
  } catch {
    /* 忽略 */
  }
}

/**
 * 恢复提示条文案：「已恢复上次对话（N 条）」。
 * N = 本次实际恢复的条数（loadChatHistory 已按上限收敛，最大 50）；
 * 纯函数供壳层渲染与单测直接断言。
 */
export function restoredBannerText(count: number): string {
  return `已恢复上次对话（${count} 条）`;
}
