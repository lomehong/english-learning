import type { Card } from '../types';

/** 进度持久化（localStorage）——接缝：StorageLike 可注入 */

export interface Progress {
  version: 1;
  /** key 为 Word.id */
  cards: Record<string, Card>;
}

/** 与 STORAGE_VERSION 保持一致；不兼容版本加载时丢弃重置 */
export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'english-learning.progress.v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** 无 localStorage 环境的内存回退（模块级单例，保证同一会话内读写一致） */
const memoryFallback = (): StorageLike => {
  const memory = new Map<string, string>();
  return {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => void memory.set(k, v),
  };
};

let fallbackInstance: StorageLike | null = null;

export function defaultStorage(): StorageLike {
  // 浏览器环境直接用 localStorage；异常环境降级为内存存储，不阻断页面
  try {
    if (typeof globalThis.localStorage !== 'undefined') return globalThis.localStorage;
  } catch {
    /* 隐私模式等场景可能抛异常 */
  }
  fallbackInstance ??= memoryFallback();
  return fallbackInstance;
}

export function emptyProgress(): Progress {
  return { version: STORAGE_VERSION, cards: {} };
}

function isValidCard(value: unknown): value is Card {
  if (typeof value !== 'object' || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.ease === 'number' &&
    Number.isFinite(c.ease) &&
    typeof c.intervalDays === 'number' &&
    Number.isFinite(c.intervalDays) &&
    typeof c.reps === 'number' &&
    typeof c.lapses === 'number' &&
    typeof c.due === 'number' &&
    Number.isFinite(c.due)
  );
}

/** 读取并归一化；任何损坏/不兼容数据都安全回退，不抛异常 */
export function loadProgress(storage: StorageLike = defaultStorage()): Progress {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return emptyProgress();
  }
  if (!raw) return emptyProgress();

  try {
    const parsed = JSON.parse(raw) as { version?: number; cards?: Record<string, unknown> };
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      parsed.version !== STORAGE_VERSION ||
      typeof parsed.cards !== 'object' ||
      parsed.cards === null
    ) {
      return emptyProgress();
    }
    const cards: Record<string, Card> = {};
    for (const [id, card] of Object.entries(parsed.cards)) {
      if (isValidCard(card) && card.id === id) cards[id] = card;
    }
    return { version: STORAGE_VERSION, cards };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: Progress, storage: StorageLike = defaultStorage()): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
