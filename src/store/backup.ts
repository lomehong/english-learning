import type { Card, PracticeModule, WrongEntry } from '../types';
import { UNIT_IDS, type UnitId } from '../data/units';
import {
  defaultStorage,
  loadProgress,
  saveProgress,
  emptyProgress,
  STORAGE_KEY as PROGRESS_KEY,
  type Progress,
  type StorageLike,
} from './progress';
import {
  loadWrongBook,
  saveWrongBook,
  emptyWrongBook,
  STORAGE_KEY as WRONGBOOK_KEY,
  type WrongBook,
} from './wrongbook';
import {
  loadStats,
  saveStats,
  emptyStats,
  PRACTICE_MODULES,
  STORAGE_KEY as STATS_KEY,
  type ModuleStat,
  type StatsBook,
} from './stats';
import {
  loadWritingDrafts,
  saveWritingDrafts,
  emptyWritingDrafts,
  STORAGE_KEY as WRITING_KEY,
  type WritingDrafts,
} from './writing';

/**
 * 学习数据备份（JSON 导出 / 导入）：
 * - 导出：词汇进度 / 错题本 / 写作草稿 / 练习统计四份 localStorage 数据打包；
 * - 导入：与本地数据合并去重（不覆盖、不双算），逐条规则见各 merge 函数。
 */

export const BACKUP_VERSION = 1;

export interface BackupData {
  version: 1;
  app: 'english-learning';
  /** 导出时间（epoch 毫秒；导入校验不强制） */
  exportedAt: number;
  progress: Progress;
  wrongbook: WrongBook;
  writing: WritingDrafts;
  stats: StatsBook;
}

export class BackupFormatError extends Error {}

/** 读取四份存储并打包为备份（字段级清洗复用各 store 的加载归一化） */
export function createBackup(storage: StorageLike = defaultStorage(), now: number = Date.now()): BackupData {
  return {
    version: BACKUP_VERSION,
    app: 'english-learning',
    exportedAt: now,
    progress: loadProgress(storage),
    wrongbook: loadWrongBook(storage),
    writing: loadWritingDrafts(storage),
    stats: loadStats(storage),
  };
}

export function serializeBackup(backup: BackupData): string {
  return JSON.stringify(backup, null, 2);
}

/** 只读内存存储：把已解析的 JSON 分段喂给各 store 的加载器做字段级校验 */
function seedStorage(seed: Record<string, string>): StorageLike {
  return {
    getItem: (k) => seed[k] ?? null,
    setItem: () => {
      /* 备份解析只读，不回写 */
    },
  };
}

/** 解析并校验备份 JSON：顶层结构不合法抛 BackupFormatError，字段级脏数据被安全清洗 */
export function parseBackup(text: string): BackupData {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new BackupFormatError('文件不是合法的 JSON');
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new BackupFormatError('备份文件格式不正确（应为对象）');
  }
  const v = raw as Record<string, unknown>;
  if (v.version !== BACKUP_VERSION) {
    throw new BackupFormatError(`备份版本不支持（${String(v.version)}），当前支持版本 ${BACKUP_VERSION}`);
  }
  for (const field of ['progress', 'wrongbook', 'writing', 'stats'] as const) {
    const value = v[field];
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new BackupFormatError(`备份缺少有效的 ${field} 数据`);
    }
    if (typeof (value as { version?: unknown }).version !== 'number') {
      throw new BackupFormatError(`备份的 ${field} 数据缺少版本号`);
    }
  }

  const seeded = seedStorage({
    [PROGRESS_KEY]: JSON.stringify(v.progress),
    [WRONGBOOK_KEY]: JSON.stringify(v.wrongbook),
    [WRITING_KEY]: JSON.stringify(v.writing),
    [STATS_KEY]: JSON.stringify(v.stats),
  });
  return {
    version: BACKUP_VERSION,
    app: 'english-learning',
    exportedAt:
      typeof v.exportedAt === 'number' && Number.isFinite(v.exportedAt) ? v.exportedAt : Date.now(),
    progress: loadProgress(seeded),
    wrongbook: loadWrongBook(seeded),
    writing: loadWritingDrafts(seeded),
    stats: loadStats(seeded),
  };
}

/* -------------------- 合并去重（纯函数，逐条可测） -------------------- */

/** 词汇卡合并：重复的词取复习次数（reps）更多的一张；次数相同取更早到期的一张 */
export function pickCard(a: Card, b: Card): Card {
  if (a.reps !== b.reps) return a.reps > b.reps ? a : b;
  return a.due <= b.due ? a : b;
}

/** 词汇进度合并：按词 id 去重（本地与备份重复时走 pickCard 规则） */
export function mergeProgress(current: Progress, incoming: Progress): Progress {
  const cards = { ...incoming.cards };
  for (const [id, card] of Object.entries(current.cards)) {
    cards[id] = cards[id] ? pickCard(card, cards[id]) : card;
  }
  return { version: 1, cards };
}

/** 错题条目合并：正文取最近一次答错的记录，次数取两者最大值，时间取较近一次 */
export function mergeWrongEntry(a: WrongEntry, b: WrongEntry): WrongEntry {
  const newer = a.lastWrongAt >= b.lastWrongAt ? a : b;
  return {
    ...newer,
    wrongCount: Math.max(a.wrongCount, b.wrongCount),
    lastWrongAt: Math.max(a.lastWrongAt, b.lastWrongAt),
  };
}

/** 错题本合并：按题目 id 去重（重复条目走 mergeWrongEntry 规则） */
export function mergeWrongBook(current: WrongBook, incoming: WrongBook): WrongBook {
  const entries = { ...incoming.entries };
  for (const [id, entry] of Object.entries(current.entries)) {
    entries[id] = entries[id] ? mergeWrongEntry(entry, entries[id]) : entry;
  }
  return { version: 1, entries };
}

/** 写作草稿合并：同一任务两处都有草稿时，保留更新时间较新的一份 */
export function mergeWritingDrafts(current: WritingDrafts, incoming: WritingDrafts): WritingDrafts {
  const drafts = { ...incoming.drafts };
  for (const [id, draft] of Object.entries(current.drafts)) {
    const other = drafts[id];
    drafts[id] = other ? (other.updatedAt >= draft.updatedAt ? other : draft) : draft;
  }
  return { version: 1, drafts };
}

/**
 * 练习统计合并（去重不双算）：同一模块取记录更完整的一方（answered 更多；
 * 相同则 correct 更多）。模块总计与按单元细分同规则处理。
 */
export function pickStat(a: ModuleStat, b: ModuleStat): ModuleStat {
  if (a.answered !== b.answered) return a.answered > b.answered ? a : b;
  return a.correct >= b.correct ? a : b;
}

function mergeModuleTables(
  current: Record<PracticeModule, ModuleStat>,
  incoming: Record<PracticeModule, ModuleStat>,
): Record<PracticeModule, ModuleStat> {
  const merged = { ...incoming };
  for (const module of PRACTICE_MODULES) {
    const mine = current[module] ?? { answered: 0, correct: 0 };
    const theirs = merged[module] ?? { answered: 0, correct: 0 };
    merged[module] = pickStat(mine, theirs);
  }
  return merged;
}

export function mergeStats(current: StatsBook, incoming: StatsBook): StatsBook {
  const units = {} as Record<UnitId, Record<PracticeModule, ModuleStat>>;
  for (const unit of UNIT_IDS) {
    units[unit] = mergeModuleTables(
      current.units[unit] ?? emptyStats().units[unit],
      incoming.units[unit] ?? emptyStats().units[unit],
    );
  }
  return {
    version: 1,
    modules: mergeModuleTables(current.modules, incoming.modules),
    units,
  };
}

/* -------------------- 导入执行 -------------------- */

export interface ImportSummary {
  /** 词汇进度：本地没有、从备份新增的词 */
  cardsAdded: number;
  /** 词汇进度：本地已有、与备份合并（去重择优）的词 */
  cardsMerged: number;
  /** 错题：从备份新增的题目 */
  wrongAdded: number;
  /** 错题：本地已有、与备份合并去重的题目 */
  wrongMerged: number;
  /** 写作草稿：从备份新增的任务 */
  draftsAdded: number;
  /** 写作草稿：本地已有、与备份合并的任务 */
  draftsMerged: number;
  /** 练习统计：备份替换（更完整）了本地记录的模块数（总计 + 单元细分） */
  statsModulesUpdated: number;
}

function countKeys(before: Record<string, unknown>, after: Record<string, unknown>): { added: number; merged: number } {
  let added = 0;
  let merged = 0;
  for (const key of Object.keys(after)) {
    if (key in before) merged += 1;
    else added += 1;
  }
  return { added, merged };
}

/** 导入备份：读取本地 → 四份各自合并去重 → 持久化，返回导入摘要 */
export function importBackup(backup: BackupData, storage: StorageLike = defaultStorage()): ImportSummary {
  const curProgress = loadProgress(storage);
  const curWrong = loadWrongBook(storage);
  const curDrafts = loadWritingDrafts(storage);
  const curStats = loadStats(storage);

  const nextProgress = mergeProgress(curProgress, backup.progress);
  const nextWrong = mergeWrongBook(curWrong, backup.wrongbook);
  const nextDrafts = mergeWritingDrafts(curDrafts, backup.writing);
  const nextStats = mergeStats(curStats, backup.stats);

  const cards = countKeys(curProgress.cards, nextProgress.cards);
  const wrong = countKeys(curWrong.entries, nextWrong.entries);
  const drafts = countKeys(curDrafts.drafts, nextDrafts.drafts);

  let statsModulesUpdated = 0;
  const tables = [curStats.modules, curStats.units.unit1, curStats.units.unit2];
  const nextTables = [nextStats.modules, nextStats.units.unit1, nextStats.units.unit2];
  for (const module of PRACTICE_MODULES) {
    for (let i = 0; i < tables.length; i += 1) {
      const before = tables[i][module] ?? { answered: 0, correct: 0 };
      const after = nextTables[i][module] ?? { answered: 0, correct: 0 };
      if (after !== before && after.answered !== before.answered) statsModulesUpdated += 1;
    }
  }

  saveProgress(nextProgress, storage);
  saveWrongBook(nextWrong, storage);
  saveWritingDrafts(nextDrafts, storage);
  saveStats(nextStats, storage);

  return {
    cardsAdded: cards.added,
    cardsMerged: cards.merged,
    wrongAdded: wrong.added,
    wrongMerged: wrong.merged,
    draftsAdded: drafts.added,
    draftsMerged: drafts.merged,
    statsModulesUpdated,
  };
}

/** 便捷入口：解析 JSON 文本并导入（页面接线用；解析失败抛 BackupFormatError） */
export function importBackupFromText(text: string, storage: StorageLike = defaultStorage()): ImportSummary {
  return importBackup(parseBackup(text), storage);
}

/** 空数据备份（清空后导出 / 测试用） */
export function emptyBackup(now = 0): BackupData {
  return {
    version: BACKUP_VERSION,
    app: 'english-learning',
    exportedAt: now,
    progress: emptyProgress(),
    wrongbook: emptyWrongBook(),
    writing: emptyWritingDrafts(),
    stats: emptyStats(),
  };
}
