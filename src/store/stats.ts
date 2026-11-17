import type { PracticeModule } from '../types';
import { UNIT_IDS, type UnitId } from '../data/units';
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
  /** 全单元合计（含旧版本升级前累计的数据） */
  modules: Record<PracticeModule, ModuleStat>;
  /** 按单元细分的练习统计（学习报告「按单元统计」维度；旧数据缺失时视为全 0） */
  units: Record<UnitId, Record<PracticeModule, ModuleStat>>;
}

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'english-learning.stats.v1';

export const PRACTICE_MODULES: readonly PracticeModule[] = ['vocab', 'grammar', 'reading', 'listening'];

function isPracticeModule(value: unknown): value is PracticeModule {
  return typeof value === 'string' && (PRACTICE_MODULES as readonly string[]).includes(value);
}

function emptyModuleTable(): Record<PracticeModule, ModuleStat> {
  const table = {} as Record<PracticeModule, ModuleStat>;
  for (const m of PRACTICE_MODULES) table[m] = { answered: 0, correct: 0 };
  return table;
}

export function emptyStats(): StatsBook {
  const units = {} as Record<UnitId, Record<PracticeModule, ModuleStat>>;
  for (const u of UNIT_IDS) units[u] = emptyModuleTable();
  return { version: STORAGE_VERSION, modules: emptyModuleTable(), units };
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

/** 一张模块统计表：只保留合法模块键，逐项归一化 */
function normalizeModuleTable(value: unknown): Record<PracticeModule, ModuleStat> {
  const table = emptyModuleTable();
  if (typeof value !== 'object' || value === null) return table;
  for (const [key, stat] of Object.entries(value as Record<string, unknown>)) {
    if (isPracticeModule(key)) table[key] = normalizeStat(stat);
  }
  return table;
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
    const parsed = JSON.parse(raw) as {
      version?: number;
      modules?: Record<string, unknown>;
      units?: Record<string, unknown>;
    };
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
    stats.modules = normalizeModuleTable(parsed.modules);
    // units 为新增维度：旧数据缺失时保持全 0（modules 仍保留历史累计）
    if (typeof parsed.units === 'object' && parsed.units !== null) {
      for (const unit of UNIT_IDS) {
        stats.units[unit] = normalizeModuleTable((parsed.units as Record<string, unknown>)[unit]);
      }
    }
    return stats;
  } catch {
    return emptyStats();
  }
}

export function saveStats(stats: StatsBook, storage: StorageLike = defaultStorage()): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function bump(stat: ModuleStat, correct: boolean): ModuleStat {
  return { answered: stat.answered + 1, correct: stat.correct + (correct ? 1 : 0) };
}

/**
 * 记一次作答（纯函数）：同时累加模块总计与所属单元细分，返回新统计。
 * （学习报告既有模块维度也有按单元维度，两处同源更新）
 */
export function recordAnswer(
  stats: StatsBook,
  module: PracticeModule,
  correct: boolean,
  unit: UnitId,
): StatsBook {
  const previous = stats.modules[module] ?? { answered: 0, correct: 0 };
  const unitTable = stats.units[unit] ?? emptyModuleTable();
  const unitPrevious = unitTable[module] ?? { answered: 0, correct: 0 };
  return {
    version: STORAGE_VERSION,
    modules: { ...stats.modules, [module]: bump(previous, correct) },
    units: {
      ...stats.units,
      [unit]: { ...unitTable, [module]: bump(unitPrevious, correct) },
    },
  };
}

/** 便捷写入：读取 → 记一次 → 持久化（页面接线用；测试可注入 storage） */
export function recordAnswerAndSave(
  module: PracticeModule,
  correct: boolean,
  unit: UnitId,
  storage: StorageLike = defaultStorage(),
): void {
  saveStats(recordAnswer(loadStats(storage), module, correct, unit), storage);
}
