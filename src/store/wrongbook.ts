import type { WrongEntry } from '../types';
import { defaultStorage, type StorageLike } from './progress';

/** 错题本持久化（localStorage）——接缝：StorageLike 可注入（复用 progress 的存储接缝） */

export interface WrongBook {
  version: 1;
  /** key 为练习题 id */
  entries: Record<string, WrongEntry>;
}

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'english-learning.wrongbook.v1';

/** recordWrong 的输入（页面判分后组装） */
export interface WrongInput {
  exerciseId: string;
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
      if (isValidEntry(entry) && entry.exerciseId === id) entries[id] = entry;
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

/** 清空错题本并持久化，返回空错题本 */
export function clearWrongBook(storage: StorageLike = defaultStorage()): WrongBook {
  const empty = emptyWrongBook();
  saveWrongBook(empty, storage);
  return empty;
}
