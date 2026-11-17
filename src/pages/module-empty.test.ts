import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * 缺模块数据 · 页面优雅降级：
 * 某单元缺某模块数据文件 = 该模块取数函数返回空数组（接缝语义），
 * 页面应显示「暂无内容」空态（[data-testid="module-empty"]）而不是崩溃。
 */

vi.mock('../data/words', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../data/words')>()),
  getWordsByUnit: () => [],
}));
vi.mock('../data/grammar', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../data/grammar')>()),
  getGrammarPoints: () => [],
  getGrammarExercises: () => [],
}));
vi.mock('../data/reading', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../data/reading')>()),
  getPassagesByUnit: () => [],
}));
vi.mock('../data/listening', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../data/listening')>()),
  getListeningsByUnit: () => [],
}));
vi.mock('../data/writing', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../data/writing')>()),
  getWritingTasksByUnit: () => [],
}));

import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';
import { renderWriting } from './writing';
import { resetUnitState } from './unit-switch';
import { emptyWrongBook } from '../store/wrongbook';
import { emptyProgress } from '../store/progress';
import { emptyWritingDrafts } from '../store/writing';
import type { SpeechEngine } from '../speech/tts';
import type { GrammarDeps, ReadingDeps, WritingDeps } from './deps';

const NOW = Date.UTC(2026, 0, 1);

/** 最小假引擎（材料为空时不会被调用，仅满足注入接缝） */
function fakeEngine(): SpeechEngine {
  return {
    supported: false,
    state: 'idle',
    currentId: null,
    play: () => {},
    pause: () => {},
    resume: () => {},
    stop: () => {},
    subscribe: () => () => {},
    destroy: () => {},
  };
}

function grammarDeps(): GrammarDeps {
  let book = emptyWrongBook();
  return {
    load: () => book,
    save: (b) => {
      book = b;
    },
    now: () => NOW,
  };
}

function progressDeps(): ReadingDeps {
  return { load: () => emptyProgress(), save: () => {}, now: () => NOW };
}

function writingDeps(): WritingDeps {
  return { load: () => emptyWritingDrafts(), save: () => {}, now: () => NOW };
}

beforeEach(() => {
  resetUnitState();
});

afterEach(() => {
  resetUnitState();
  history.replaceState(null, '', '/');
});

describe('缺模块数据 · 五大模块页优雅降级（显示暂无内容，不崩溃）', () => {
  it('词汇页：词表为空 → 学习 Tab 显示空态，不渲染翻面卡', () => {
    const root = document.createElement('div');
    expect(() => renderVocabulary(root)).not.toThrow();
    const empty = root.querySelector('[data-testid="module-empty"]');
    expect(empty).toBeTruthy();
    expect(empty!.textContent).toContain('暂无内容');
    expect(root.querySelector('.flip-card')).toBeNull();
  });

  it('语法页：讲解卡与练习均为空 → 两区显示空态，练习计数为 0', () => {
    const root = document.createElement('div');
    expect(() => renderGrammar(root, grammarDeps())).not.toThrow();
    const empties = root.querySelectorAll('[data-testid="module-empty"]');
    expect(empties.length).toBeGreaterThanOrEqual(2);
    for (const el of empties) expect(el.textContent).toContain('暂无内容');
    expect(root.querySelector('.grammar-card')).toBeNull();
    expect(root.querySelector('.exercise')).toBeNull();
    expect(root.querySelector('[data-testid="drill-stat"]')!.textContent).toContain('0 / 0');
  });

  it('阅读页：短文为空 → 显示空态，无短文区', () => {
    const root = document.createElement('div');
    expect(() => renderReading(root, progressDeps())).not.toThrow();
    expect(root.querySelector('[data-testid="module-empty"]')!.textContent).toContain('暂无内容');
    expect(root.querySelector('.reading-passage')).toBeNull();
  });

  it('听力页：材料为空 → 显示空态，无材料区', () => {
    const root = document.createElement('div');
    expect(() => renderListening(root, { createEngine: fakeEngine })).not.toThrow();
    expect(root.querySelector('[data-testid="module-empty"]')!.textContent).toContain('暂无内容');
    expect(root.querySelector('.listening-material')).toBeNull();
  });

  it('写作页：任务为空 → 显示空态，无任务卡', () => {
    const root = document.createElement('div');
    expect(() => renderWriting(root, writingDeps())).not.toThrow();
    expect(root.querySelector('[data-testid="module-empty"]')!.textContent).toContain('暂无内容');
    expect(root.querySelector('[data-task]')).toBeNull();
  });
});
