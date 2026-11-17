import { describe, it, expect } from 'vitest';
import { renderReading } from './reading';
import { emptyProgress, type Progress } from '../store/progress';
import { createCard } from '../srs/sm2';
import { unit1Passages, QUESTION_TYPE_LABEL } from '../data/unit1-reading';
import type { ReadingQuestion } from '../types';
import type { ReadingDeps } from './deps';

const NOW = Date.UTC(2026, 0, 1);
const TOTAL = unit1Passages.reduce((n, p) => n + p.questions.length, 0);

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
