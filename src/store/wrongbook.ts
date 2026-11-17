import type { PracticeModule, WrongEntry } from '../types';
import { defaultStorage, type StorageLike } from './progress';

/** 错题本持久化（localStorage）——接缝：StorageLike 可注入（复用 progress 的存储接缝） */

export interface WrongBook {
  version: 1;
  /** key 为练习题 id */
  entries: Record<string, WrongEntry>;
}

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'english-learning.wrongbook.v1';

const MODULES: readonly PracticeModule[] = ['vocab', 'grammar', 'reading', 'listening'];

function isPracticeModule(value: unknown): value is PracticeModule {
  return typeof value === 'string' && (MODULES as readonly string[]).includes(value);
}

/**
 * 旧版本条目（无 module 字段）加载时按 exerciseId 前缀推断所属模块：
 * w: 前缀=词汇复习、g*=语法、r*=阅读、l*=听力；其余默认语法（历史唯一写入方）。
 * Unit 2 题目 id 带 u2- 前缀（如 u2-g1 / u2-r1-1），剥掉前缀后再按首字母判断。
 */
export function inferModule(exerciseId: string): PracticeModule {
  const id = exerciseId.startsWith('u2-') ? exerciseId.slice(3) : exerciseId;
  if (id.startsWith('w:')) return 'vocab';
  const first = id[0]?.toLowerCase();
  if (first === 'g') return 'grammar';
  if (first === 'r') return 'reading';
  if (first === 'l') return 'listening';
  return 'grammar';
}

/** recordWrong 的输入（页面判分后组装） */
export interface WrongInput {
  exerciseId: string;
  module: PracticeModule;
  stem: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export function emptyWrongBook(): WrongBook {
  return { version: STORAGE_VERSION, entries: {} };
}

function isValidEntry(value: unknown): value is WrongEntry {
  if (typeof value !== 'object' || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.exerciseId === 'string' &&
    // module 允许缺失（旧版本数据，加载时推断补齐）；存在则必须是合法模块
    (e.module === undefined || isPracticeModule(e.module)) &&
    typeof e.stem === 'string' &&
    typeof e.yourAnswer === 'string' &&
    typeof e.correctAnswer === 'string' &&
    typeof e.explanation === 'string' &&
    typeof e.wrongCount === 'number' &&
    Number.isFinite(e.wrongCount) &&
    typeof e.lastWrongAt === 'number' &&
    Number.isFinite(e.lastWrongAt)
  );
}

/** 读取并归一化；任何损坏/不兼容数据都安全回退，不抛异常 */
export function loadWrongBook(storage: StorageLike = defaultStorage()): WrongBook {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return emptyWrongBook();
  }
  if (!raw) return emptyWrongBook();

  try {
    const parsed = JSON.parse(raw) as { version?: number; entries?: Record<string, unknown> };
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      parsed.version !== STORAGE_VERSION ||
      typeof parsed.entries !== 'object' ||
      parsed.entries === null
    ) {
      return emptyWrongBook();
    }
    const entries: Record<string, WrongEntry> = {};
    for (const [id, entry] of Object.entries(parsed.entries)) {
      if (isValidEntry(entry) && entry.exerciseId === id) {
        // 旧数据无 module：按 id 前缀推断补齐，保证加载后字段完整
        entries[id] = { ...entry, module: entry.module ?? inferModule(id) };
      }
    }
    return { version: STORAGE_VERSION, entries };
  } catch {
    return emptyWrongBook();
  }
}

export function saveWrongBook(book: WrongBook, storage: StorageLike = defaultStorage()): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(book));
}

/** 记错（纯函数）：同题再错时累加 wrongCount 并更新作答与时间，返回新错题本 */
export function recordWrong(book: WrongBook, input: WrongInput, at: number): WrongBook {
  const previous = book.entries[input.exerciseId];
  const entry: WrongEntry = {
    exerciseId: input.exerciseId,
    module: input.module,
    stem: input.stem,
    yourAnswer: input.yourAnswer,
    correctAnswer: input.correctAnswer,
    explanation: input.explanation,
    wrongCount: (previous?.wrongCount ?? 0) + 1,
    lastWrongAt: at,
  };
  return {
    version: STORAGE_VERSION,
    entries: { ...book.entries, [input.exerciseId]: entry },
  };
}

/** 移除单条错题（纯函数）：未知 id 原样返回新引用 */
export function removeEntry(book: WrongBook, exerciseId: string): WrongBook {
  if (!(exerciseId in book.entries)) return { ...book };
  const entries = { ...book.entries };
  delete entries[exerciseId];
  return { version: STORAGE_VERSION, entries };
}

/** 清空错题本并持久化，返回空错题本 */
export function clearWrongBook(storage: StorageLike = defaultStorage()): WrongBook {
  const empty = emptyWrongBook();
  saveWrongBook(empty, storage);
  return empty;
}
