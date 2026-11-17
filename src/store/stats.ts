import type { PracticeModule } from '../types';
import { defaultStorage, type StorageLike } from './progress';

/** 各模块练习统计持久化（localStorage）——接缝：StorageLike 可注入（复用 progress 的存储接缝） */

export interface ModuleStat {
  /** 累计练习（作答/评分）次数 */
  answered: number;
  /** 其中答对次数 */
  correct: number;
}

export interface StatsBook {
  version: 1;
  modules: Record<PracticeModule, ModuleStat>;
}

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'english-learning.stats.v1';

const MODULES: readonly PracticeModule[] = ['vocab', 'grammar', 'reading', 'listening'];

export function emptyStats(): StatsBook {
  const modules = {} as Record<PracticeModule, ModuleStat>;
  for (const m of MODULES) modules[m] = { answered: 0, correct: 0 };
  return { version: STORAGE_VERSION, modules };
}

function isPracticeModule(value: unknown): value is PracticeModule {
  return typeof value === 'string' && (MODULES as readonly string[]).includes(value);
}

/** 单模块脏数据归一化：非有限数字/负数归 0，correct 收敛到不超过 answered */
function normalizeStat(value: unknown): ModuleStat {
  if (typeof value !== 'object' || value === null) return { answered: 0, correct: 0 };
  const v = value as Record<string, unknown>;
  const answered =
    typeof v.answered === 'number' && Number.isFinite(v.answered) ? Math.max(0, Math.floor(v.answered)) : 0;
  const correctRaw =
    typeof v.correct === 'number' && Number.isFinite(v.correct) ? Math.max(0, Math.floor(v.correct)) : 0;
  return { answered, correct: Math.min(correctRaw, answered) };
}

/** 读取并归一化；任何损坏/不兼容数据都安全回退，不抛异常 */
export function loadStats(storage: StorageLike = defaultStorage()): StatsBook {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return emptyStats();
  }
  if (!raw) return emptyStats();

  try {
    const parsed = JSON.parse(raw) as { version?: number; modules?: Record<string, unknown> };
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      parsed.version !== STORAGE_VERSION ||
      typeof parsed.modules !== 'object' ||
      parsed.modules === null
    ) {
      return emptyStats();
    }
    const stats = emptyStats();
    for (const [key, value] of Object.entries(parsed.modules)) {
      if (isPracticeModule(key)) stats.modules[key] = normalizeStat(value);
    }
    return stats;
  } catch {
    return emptyStats();
  }
}

export function saveStats(stats: StatsBook, storage: StorageLike = defaultStorage()): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

/** 记一次作答（纯函数）：累加对应模块的 answered / correct，返回新统计 */
export function recordAnswer(stats: StatsBook, module: PracticeModule, correct: boolean): StatsBook {
  const previous = stats.modules[module] ?? { answered: 0, correct: 0 };
  return {
    version: STORAGE_VERSION,
    modules: {
      ...stats.modules,
      [module]: { answered: previous.answered + 1, correct: previous.correct + (correct ? 1 : 0) },
    },
  };
}

/** 便捷写入：读取 → 记一次 → 持久化（页面接线用；测试可注入 storage） */
export function recordAnswerAndSave(
  module: PracticeModule,
  correct: boolean,
  storage: StorageLike = defaultStorage(),
): void {
  saveStats(recordAnswer(loadStats(storage), module, correct), storage);
}
