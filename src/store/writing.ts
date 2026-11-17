import { defaultStorage, type StorageLike } from './progress';

/** 写作草稿持久化（localStorage）——接缝：StorageLike 可注入（复用 progress 的存储接缝） */

export interface WritingDraft {
  /** 草稿正文 */
  content: string;
  /** 最近一次保存时间（epoch 毫秒） */
  updatedAt: number;
}

export interface WritingDrafts {
  version: 1;
  /** key 为 WritingTask.id */
  drafts: Record<string, WritingDraft>;
}

export const STORAGE_VERSION = 1;
export const STORAGE_KEY = 'english-learning.writing.v1';

export function emptyWritingDrafts(): WritingDrafts {
  return { version: STORAGE_VERSION, drafts: {} };
}

function isValidDraft(value: unknown): value is WritingDraft {
  if (typeof value !== 'object' || value === null) return false;
  const d = value as Record<string, unknown>;
  return (
    typeof d.content === 'string' &&
    typeof d.updatedAt === 'number' &&
    Number.isFinite(d.updatedAt)
  );
}

/** 读取并归一化；任何损坏/不兼容数据都安全回退，不抛异常 */
export function loadWritingDrafts(storage: StorageLike = defaultStorage()): WritingDrafts {
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch {
    return emptyWritingDrafts();
  }
  if (!raw) return emptyWritingDrafts();

  try {
    const parsed = JSON.parse(raw) as { version?: number; drafts?: Record<string, unknown> };
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      parsed.version !== STORAGE_VERSION ||
      typeof parsed.drafts !== 'object' ||
      parsed.drafts === null
    ) {
      return emptyWritingDrafts();
    }
    const drafts: Record<string, WritingDraft> = {};
    for (const [id, draft] of Object.entries(parsed.drafts)) {
      if (isValidDraft(draft)) drafts[id] = { content: draft.content, updatedAt: draft.updatedAt };
    }
    return { version: STORAGE_VERSION, drafts };
  } catch {
    return emptyWritingDrafts();
  }
}

export function saveWritingDrafts(drafts: WritingDrafts, storage: StorageLike = defaultStorage()): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

/** 保存/覆盖一个任务的草稿（纯函数）：空草稿等同删除，返回新草稿集 */
export function putDraft(book: WritingDrafts, taskId: string, content: string, at: number): WritingDrafts {
  const trimmed = content.trim();
  if (trimmed === '') return removeDraft(book, taskId);
  return {
    version: STORAGE_VERSION,
    drafts: { ...book.drafts, [taskId]: { content, updatedAt: at } },
  };
}

/** 移除一个任务的草稿（纯函数）：未知 id 原样返回新引用 */
export function removeDraft(book: WritingDrafts, taskId: string): WritingDrafts {
  if (!(taskId in book.drafts)) return { ...book };
  const drafts = { ...book.drafts };
  delete drafts[taskId];
  return { version: STORAGE_VERSION, drafts };
}
