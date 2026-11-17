import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderReading } from './reading';
import { emptyProgress, type Progress } from '../store/progress';
import { createCard } from '../srs/sm2';
import { unit1Passages } from '../data/unit1-reading';
import { unit2Passages } from '../data/unit2-reading';
import { QUESTION_TYPE_LABEL } from '../data/reading';
import { clearWrongBook, loadWrongBook } from '../store/wrongbook';
import { emptyStats, loadStats, saveStats } from '../store/stats';
import type { ReadingQuestion } from '../types';
import type { ReadingDeps } from './deps';

const NOW = Date.UTC(2026, 0, 1);
const TOTAL = unit1Passages.reduce((n, p) => n + p.questions.length, 0);
const TOTAL_U2 = unit2Passages.reduce((n, p) => n + p.questions.length, 0);

function makeDeps(initial: Progress = emptyProgress()): ReadingDeps & { saved: Progress[] } {
  let state = initial;
  const saved: Progress[] = [];
  return {
    load: () => state,
    save: (p) => {
      state = p;
      saved.push(p);
    },
    now: () => NOW,
    saved,
  };
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function questionById(id: string): ReadingQuestion {
  for (const p of unit1Passages) {
    const q = p.questions.find((item) => item.id === id);
    if (q) return q;
  }
  throw new Error(`题目 ${id} 不存在`);
}

/** 从数据推导正确/错误选项按钮（不依赖 DOM 泄露答案） */
function optionButtons(container: HTMLElement, id: string): { correct: HTMLButtonElement; wrong: HTMLButtonElement } {
  const q = questionById(id);
  const rightText = q.options[q.answerIndex];
  const buttons = [
    ...container.querySelector(`[data-question="${id}"]`)!.querySelectorAll<HTMLButtonElement>('button.option'),
  ];
  const textOf = (b: HTMLButtonElement) => b.textContent!.replace(/^[A-D]\.\s*/, '').trim();
  const correct = buttons.find((b) => textOf(b) === rightText)!;
  const wrong = buttons.find((b) => textOf(b) !== rightText)!;
  return { correct, wrong };
}

describe('阅读页 · 渲染', () => {
  it('渲染 2 篇短文（标题/体裁/词数）与每篇 3 道题', () => {
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    const passages = container.querySelectorAll('.reading-passage');
    expect(passages).toHaveLength(2);
    expect(container.textContent).toContain("Passage 1 · A Freshman's First Term");
    expect(container.textContent).toContain('记叙文');
    expect(container.textContent).toContain('应用文');
    expect(container.textContent).toContain('词');

    expect(container.querySelectorAll('.exercise--reading')).toHaveLength(TOTAL);
    expect(container.querySelector('[data-testid="reading-stat"]')!.textContent).toContain(`已答 0 / ${TOTAL}`);
  });

  it('题目展示题型标签，短文中生词渲染为可点击元素', () => {
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    const q1 = container.querySelector('[data-question="r1-3"]')!;
    expect(q1.textContent).toContain(QUESTION_TYPE_LABEL['main-idea']);
    expect(container.querySelector('[data-question="r2-3"]')!.textContent).toContain(QUESTION_TYPE_LABEL.purpose);

    const body1 = container.querySelector('[data-testid="passage-body-p1"]')!;
    const words = body1.querySelectorAll('.reading-word');
    expect(words.length).toBeGreaterThanOrEqual(8);
    const word = words[0] as HTMLSpanElement;
    expect(word.getAttribute('role')).toBe('button');
    expect(word.title).toContain('/'); // 含音标提示
  });
});

describe('阅读页 · 即时判分', () => {
  it('答对：判定正确、展示解析、锁定选项、更新进度徽标', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderReading(container, deps);

    const item = container.querySelector('[data-question="r1-1"]')!;
    click(optionButtons(container, 'r1-1').correct);

    expect(item.classList.contains('exercise--correct')).toBe(true);
    expect(item.textContent).toContain('解析');
    expect(item.textContent).toContain('confusing');
    expect([...item.querySelectorAll<HTMLButtonElement>('button.option')].every((b) => b.disabled)).toBe(true);
    const stat = container.querySelector('[data-testid="reading-stat"]')!;
    expect(stat.textContent).toContain(`已答 1 / ${TOTAL}`);
    expect(stat.textContent).toContain('答对 1');
  });

  it('答错：判定错误、给出正确答案与解析', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderReading(container, deps);

    const item = container.querySelector('[data-question="r2-1"]')!;
    click(optionButtons(container, 'r2-1').wrong);

    expect(item.classList.contains('exercise--wrong')).toBe(true);
    const result = item.querySelector('.exercise__result')!;
    expect(result.textContent).toContain('正确答案');
    expect(result.textContent).toContain(questionById('r2-1').options[questionById('r2-1').answerIndex]);
    expect(result.textContent).toContain('解析');
    expect(container.querySelector('[data-testid="reading-stat"]')!.textContent).toContain('答对 0');
  });

  it('每题只能作答一次：判分后重复点击不再累计', () => {
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    click(optionButtons(container, 'r1-2').wrong);
    click(optionButtons(container, 'r1-2').wrong);

    const stat = container.querySelector('[data-testid="reading-stat"]')!;
    expect(stat.textContent).toContain(`已答 1 / ${TOTAL}`);
  });
});

describe('阅读页 · 生词收藏（与词汇模块共享 localStorage 进度）', () => {
  it('点击生词：写入共享 progress（建卡即到期）并标记已加入，词汇本徽标更新', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderReading(container, deps);

    const span = container.querySelector<HTMLElement>('[data-testid="passage-body-p1"] .reading-word[data-word-id="volunteer"]')!;
    expect(span.classList.contains('reading-word--added')).toBe(false);

    click(span);

    const card = deps.load().cards['volunteer'];
    expect(card).toBeDefined();
    expect(card!.due).toBe(NOW); // 新卡立即进入词汇模块的到期复习队列
    expect(deps.saved).toHaveLength(1);
    expect(span.classList.contains('reading-word--added')).toBe(true);
    expect(span.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('[data-testid="vocab-chip"]')!.textContent).toContain('词汇本 1 词');
  });

  it('再次点击同一生词：从词汇本移除', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderReading(container, deps);

    const span = container.querySelector<HTMLElement>('[data-testid="passage-body-p1"] .reading-word[data-word-id="volunteer"]')!;
    click(span);
    click(span);

    expect(deps.load().cards['volunteer']).toBeUndefined();
    expect(deps.saved).toHaveLength(2);
    expect(span.classList.contains('reading-word--added')).toBe(false);
    expect(container.querySelector('[data-testid="vocab-chip"]')!.textContent).toContain('词汇本 0 词');
  });

  it('词表外脏数据不受影响，已有卡片渲染为已加入状态', () => {
    const progress = emptyProgress();
    progress.cards['freshman'] = createCard('freshman', NOW);
    const deps = makeDeps(progress);
    const container = document.createElement('div');
    renderReading(container, deps);

    const span = container.querySelector<HTMLElement>('[data-testid="passage-body-p1"] .reading-word[data-word-id="freshman"]')!;
    expect(span.classList.contains('reading-word--added')).toBe(true);
    expect(container.querySelector('[data-testid="vocab-chip"]')!.textContent).toContain('词汇本 1 词');
  });
});

describe('阅读页 · 错题与统计数据源（错题本/学习报告页消费）', () => {
  beforeEach(() => {
    // 页面错题/统计均写默认存储；同源重置保证用例独立
    clearWrongBook();
    saveStats(emptyStats());
  });

  it('答错自动写入错题本（module=reading，含题干/作答/解析），答对不入本', () => {
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    click(optionButtons(container, 'r1-1').wrong);
    click(optionButtons(container, 'r1-2').correct);

    const book = loadWrongBook();
    expect(Object.keys(book.entries)).toEqual(['r1-1']);
    const entry = book.entries['r1-1']!;
    expect(entry.module).toBe('reading');
    expect(entry.explanation).toBe(questionById('r1-1').explanation);
  });

  it('每次作答计入练习统计（stats.reading），correct 仅累计答对', () => {
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    click(optionButtons(container, 'r2-1').wrong);
    click(optionButtons(container, 'r2-2').correct);

    expect(loadStats().modules.reading).toEqual({ answered: 2, correct: 1 });
  });
});

describe('阅读页 · 单元切换（Unit 2）', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/reading?unit=unit2');
    clearWrongBook();
    saveStats(emptyStats());
  });

  afterEach(() => {
    history.replaceState(null, '', '/reading');
  });

  it('?unit=unit2 直链渲染 Unit 2 短文与题目，生词可收藏进词汇本', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderReading(container, deps);

    expect(container.querySelector('h1')!.textContent).toContain('Unit 2');
    expect(container.querySelector('h1')!.textContent).toContain('Travelling Around');
    expect(container.textContent).toContain('Passage 1 · A Weekend in an Ancient Town');
    expect(container.textContent).toContain('Before You Visit the Terracotta Army');
    expect(container.querySelectorAll('.exercise--reading')).toHaveLength(TOTAL_U2);
    expect(container.querySelector('[data-testid="reading-stat"]')!.textContent).toContain(`已答 0 / ${TOTAL_U2}`);

    // 生词点击加入词汇本（与词汇模块共享 progress）
    const span = container.querySelector<HTMLElement>(
      '[data-testid="passage-body-u2-p1"] .reading-word[data-word-id="destination"]',
    )!;
    click(span);
    expect(deps.load().cards['destination']).toBeDefined();
    expect(container.querySelector('[data-testid="vocab-chip"]')!.textContent).toContain('词汇本 1 词');
  });

  it('?unit=2 数字写法深链：初始加载即 Unit 2 短文与题目', () => {
    history.replaceState(null, '', '/reading?unit=2');
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    expect(container.querySelector('h1')!.textContent).toContain('Unit 2');
    expect(container.querySelector('h1')!.textContent).toContain('Travelling Around');
    expect(container.textContent).toContain('A Weekend in an Ancient Town');
    expect(container.querySelectorAll('.exercise--reading')).toHaveLength(TOTAL_U2);
    expect(container.querySelector('[data-question="u2-r1-1"]')).toBeTruthy();
  });

  it('?unit=oops 非法值深链回退 Unit 1 短文', () => {
    history.replaceState(null, '', '/reading?unit=oops');
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    expect(container.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(container.textContent).toContain("Passage 1 · A Freshman's First Term");
    expect(container.querySelectorAll('.exercise--reading')).toHaveLength(TOTAL);
    expect(container.querySelector('[data-question="u2-r1-1"]')).toBeNull();
  });

  it('Unit 2 作答计入 unit2 统计维度；错题 id 带 u2- 前缀', () => {
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    const q = unit2Passages[0]!.questions[0]!;
    const buttons = [
      ...container.querySelector(`[data-question="${q.id}"]`)!.querySelectorAll<HTMLButtonElement>('button.option'),
    ];
    const textOf = (b: HTMLButtonElement) => b.textContent!.replace(/^[A-D]\.\s*/, '').trim();
    const wrong = buttons.find((b) => textOf(b) !== q.options[q.answerIndex])!;
    click(wrong);

    expect(loadStats().units.unit2.reading).toEqual({ answered: 1, correct: 0 });
    expect(loadStats().units.unit1.reading).toEqual({ answered: 0, correct: 0 });
    expect(loadWrongBook().entries[q.id]).toBeDefined();
  });

  it('点击 Unit 1 切换按钮：内容重建为 Unit 1 短文', () => {
    const container = document.createElement('div');
    renderReading(container, makeDeps());

    click(container.querySelector<HTMLButtonElement>('[data-testid="unit-switcher"] button[data-unit="unit1"]')!);

    expect(container.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(container.textContent).toContain("Passage 1 · A Freshman's First Term");
    expect(container.querySelector('[data-question="u2-r1-1"]')).toBeNull();
    expect(location.search).toBe('');
  });
});
