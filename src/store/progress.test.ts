import { describe, it, expect, beforeEach } from 'vitest';
import { loadProgress, saveProgress, STORAGE_KEY, emptyProgress } from './progress';
import { createCard } from '../srs/sm2';

// jsdom 环境自带 localStorage；但 Node≥26 的实验性全局 localStorage 会遮蔽 jsdom
// 注入的实例（jsdom 原件挂在 _localStorage），此处取可用句柄。
function testStorage(): Storage {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  const s = g._localStorage ?? g.localStorage;
  if (!s) throw new Error('测试环境无可用 localStorage');
  return s;
}

const NOW = Date.UTC(2026, 0, 1);

describe('进度 localStorage 持久化', () => {
  beforeEach(() => {
    testStorage().clear();
  });

  it('无记录时返回空进度（cards 为空对象）', () => {
    const progress = loadProgress();
    expect(progress).toEqual(emptyProgress());
    expect(progress.cards).toEqual({});
  });

  it('保存后重新加载，卡片状态往返一致', () => {
    const card = createCard('teenage', NOW);
    card.ease = 2.3;
    card.intervalDays = 3;
    card.reps = 2;
    card.lapses = 1;
    card.due = NOW + 3 * 24 * 3600 * 1000;

    saveProgress({ version: 1, cards: { teenage: card } }, testStorage());

    const loaded = loadProgress(testStorage());
    expect(loaded.cards['teenage']).toEqual(card);
  });

  it('实际写入了 localStorage 的约定键', () => {
    const progress = emptyProgress();
    progress.cards['ballet'] = createCard('ballet', NOW);
    saveProgress(progress, testStorage());
    expect(testStorage().getItem(STORAGE_KEY)).toBeTruthy();
    expect(JSON.parse(testStorage().getItem(STORAGE_KEY)!).version).toBe(1);
  });

  it('损坏的 JSON 不抛异常，回退到空进度', () => {
    testStorage().setItem(STORAGE_KEY, '{not-valid-json');
    expect(loadProgress(testStorage())).toEqual(emptyProgress());
  });

  it('不兼容的版本号回退到空进度', () => {
    testStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 99, cards: { x: {} } }));
    expect(loadProgress(testStorage()).cards).toEqual({});
  });

  it('卡片字段缺失或类型错误时丢弃该卡（防御性归一化）', () => {
    const raw = {
      version: 1,
      cards: {
        good: { id: 'good', ease: 2.5, intervalDays: 1, reps: 1, lapses: 0, due: NOW },
        bad: { id: 'bad', ease: '高' },
        worse: null,
      },
    };
    testStorage().setItem(STORAGE_KEY, JSON.stringify(raw));
    const loaded = loadProgress(testStorage());
    expect(Object.keys(loaded.cards)).toEqual(['good']);
  });

  it('支持注入自定义 storage（接缝：不绑定全局 localStorage）', () => {
    const memory = new Map<string, string>();
    const storage = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => void memory.set(k, v),
    };
    const card = createCard('topic', NOW);
    saveProgress({ version: 1, cards: { topic: card } }, storage);
    expect(loadProgress(storage).cards['topic']).toEqual(card);
  });
});

