import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadWrongBook,
  saveWrongBook,
  recordWrong,
  clearWrongBook,
  emptyWrongBook,
  STORAGE_KEY,
  type WrongInput,
} from './wrongbook';
import type { WrongEntry } from '../types';

// jsdom 环境自带 localStorage；但 Node≥26 的实验性全局 localStorage 会遮蔽 jsdom
// 注入的实例（jsdom 原件挂在 _localStorage），此处取可用句柄。
function testStorage(): Storage {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  const s = g._localStorage ?? g.localStorage;
  if (!s) throw new Error('测试环境无可用 localStorage');
  return s;
}

const NOW = Date.UTC(2026, 0, 1);

function sampleInput(overrides: Partial<WrongInput> = {}): WrongInput {
  return {
    exerciseId: 'g1',
    stem: 'Listen! Someone ______ in the next room.',
    yourAnswer: 'sings',
    correctAnswer: 'is singing',
    explanation: '“Listen!” 提示动作此刻正在进行，用现在进行时。',
    ...overrides,
  };
}

describe('错题本 localStorage 持久化', () => {
  beforeEach(() => {
    testStorage().clear();
  });

  it('无记录时返回空错题本（entries 为空对象）', () => {
    const book = loadWrongBook();
    expect(book).toEqual(emptyWrongBook());
    expect(book.entries).toEqual({});
  });

  it('保存后重新加载，条目往返一致，写入约定键', () => {
    const entry: WrongEntry = {
      exerciseId: 'g1',
      stem: 'Listen! Someone ______ in the next room.',
      yourAnswer: 'sings',
      correctAnswer: 'is singing',
      explanation: '现在进行时。',
      wrongCount: 2,
      lastWrongAt: NOW,
    };
    saveWrongBook({ version: 1, entries: { g1: entry } }, testStorage());

    const loaded = loadWrongBook(testStorage());
    expect(loaded.entries['g1']).toEqual(entry);
    expect(testStorage().getItem(STORAGE_KEY)).toBeTruthy();
    expect(JSON.parse(testStorage().getItem(STORAGE_KEY)!).version).toBe(1);
  });

  it('recordWrong 新增条目：wrongCount 从 1 起，记录最近答错时间', () => {
    const book = recordWrong(emptyWrongBook(), sampleInput(), NOW);
    const entry = book.entries['g1'];
    expect(entry).toBeDefined();
    expect(entry.wrongCount).toBe(1);
    expect(entry.lastWrongAt).toBe(NOW);
    expect(entry.yourAnswer).toBe('sings');
  });

  it('recordWrong 同题再错：upsert 累加 wrongCount，更新作答与时间', () => {
    let book = recordWrong(emptyWrongBook(), sampleInput(), NOW);
    book = recordWrong(book, sampleInput({ yourAnswer: 'sang' }), NOW + 1000);
    const entry = book.entries['g1'];
    expect(Object.keys(book.entries)).toEqual(['g1']);
    expect(entry.wrongCount).toBe(2);
    expect(entry.yourAnswer).toBe('sang');
    expect(entry.lastWrongAt).toBe(NOW + 1000);
  });

  it('recordWrong 为纯函数：不修改传入的原错题本', () => {
    const original = emptyWrongBook();
    recordWrong(original, sampleInput(), NOW);
    expect(original.entries).toEqual({});
  });

  it('clearWrongBook 清空并持久化', () => {
    saveWrongBook(recordWrong(emptyWrongBook(), sampleInput(), NOW), testStorage());
    const cleared = clearWrongBook(testStorage());
    expect(cleared).toEqual(emptyWrongBook());
    expect(loadWrongBook(testStorage()).entries).toEqual({});
  });

  it('损坏的 JSON 不抛异常，回退到空错题本', () => {
    testStorage().setItem(STORAGE_KEY, '{not-valid-json');
    expect(loadWrongBook(testStorage())).toEqual(emptyWrongBook());
  });

  it('不兼容的版本号回退到空错题本', () => {
    testStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 99, entries: { x: {} } }));
    expect(loadWrongBook(testStorage()).entries).toEqual({});
  });

  it('条目字段缺失或类型错误时丢弃该条（防御性归一化）', () => {
    const raw = {
      version: 1,
      entries: {
        good: {
          exerciseId: 'good',
          stem: 's',
          yourAnswer: 'a',
          correctAnswer: 'b',
          explanation: 'e',
          wrongCount: 1,
          lastWrongAt: NOW,
        },
        bad: { exerciseId: 'bad', wrongCount: '很多' },
        worse: null,
      },
    };
    testStorage().setItem(STORAGE_KEY, JSON.stringify(raw));
    const loaded = loadWrongBook(testStorage());
    expect(Object.keys(loaded.entries)).toEqual(['good']);
  });

  it('支持注入自定义 storage（接缝：不绑定全局 localStorage）', () => {
    const memory = new Map<string, string>();
    const storage = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => void memory.set(k, v),
    };
    const saved = recordWrong(emptyWrongBook(), sampleInput({ exerciseId: 'g9' }), NOW);
    saveWrongBook(saved, storage);
    expect(loadWrongBook(storage).entries['g9']).toBeDefined();
  });
});
