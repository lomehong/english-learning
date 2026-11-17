import { describe, it, expect } from 'vitest';
import {
  emptyWritingDrafts,
  loadWritingDrafts,
  saveWritingDrafts,
  putDraft,
  removeDraft,
  STORAGE_KEY,
} from './writing';

function memoryStorage(): Storage & { dump(): string | null } {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => void (store[k] = v),
    dump: () => store[STORAGE_KEY] ?? null,
  } as Storage & { dump(): string | null };
}

describe('写作草稿存储', () => {
  it('空存储 → 返回空草稿集', () => {
    const storage = memoryStorage();
    expect(loadWritingDrafts(storage)).toEqual(emptyWritingDrafts());
  });

  it('putDraft 保存草稿并可读回（round-trip）', () => {
    const storage = memoryStorage();
    let book = emptyWritingDrafts();
    book = putDraft(book, 'w1', 'Dear Tom, I am writing...', 1000);
    saveWritingDrafts(book, storage);

    const loaded = loadWritingDrafts(storage);
    expect(loaded.drafts['w1']).toEqual({ content: 'Dear Tom, I am writing...', updatedAt: 1000 });
  });

  it('putDraft 覆盖旧草稿；空白草稿等同删除', () => {
    let book = emptyWritingDrafts();
    book = putDraft(book, 'w1', 'first draft', 1000);
    book = putDraft(book, 'w1', 'second draft', 2000);
    expect(book.drafts['w1']).toEqual({ content: 'second draft', updatedAt: 2000 });

    book = putDraft(book, 'w1', '   ', 3000);
    expect(book.drafts['w1']).toBeUndefined();
  });

  it('removeDraft 移除指定草稿，不影响其他任务；未知 id 返回新引用', () => {
    let book = emptyWritingDrafts();
    book = putDraft(book, 'w1', 'a', 1);
    book = putDraft(book, 'w2', 'b', 2);

    const next = removeDraft(book, 'w1');
    expect(next.drafts['w1']).toBeUndefined();
    expect(next.drafts['w2']).toEqual({ content: 'b', updatedAt: 2 });
    expect(removeDraft(next, 'w404')).not.toBe(next);
    expect(removeDraft(next, 'w404').drafts).toEqual(next.drafts);
  });

  it('损坏 / 不兼容数据安全回退为空草稿集，不抛异常', () => {
    const storage = memoryStorage();
    for (const bad of ['not json', '{"version":2,"drafts":{}}', '{"version":1,"drafts":"x"}', 'null']) {
      storage.setItem(STORAGE_KEY, bad);
      expect(loadWritingDrafts(storage)).toEqual(emptyWritingDrafts());
    }
  });

  it('脏草稿条目被丢弃，合法条目保留（字段级校验）', () => {
    const storage = memoryStorage();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        drafts: {
          w1: { content: 'ok', updatedAt: 5 },
          w2: { content: 123, updatedAt: 5 },
          w3: { content: 'no time' },
        },
      }),
    );
    const loaded = loadWritingDrafts(storage);
    expect(Object.keys(loaded.drafts)).toEqual(['w1']);
    expect(loaded.drafts['w1']).toEqual({ content: 'ok', updatedAt: 5 });
  });

  it('读写异常的存储（隐私模式等）不抛异常', () => {
    const throwing = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    };
    expect(loadWritingDrafts(throwing)).toEqual(emptyWritingDrafts());
  });
});
