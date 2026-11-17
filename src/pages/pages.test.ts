import { describe, it, expect } from 'vitest';
import { renderLearn } from './learn';
import { renderReview } from './review';
import { createCard, DAY_MS } from '../srs/sm2';
import { emptyProgress, type Progress } from '../store/progress';
import type { VocabDeps } from './deps';

const NOW = Date.UTC(2026, 0, 1);

function makeDeps(initial: Progress): VocabDeps & { saved: Progress[] } {
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

describe('学习页', () => {
  it('渲染翻面卡与计数，点击卡片翻面', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps(emptyProgress()));

    const counter = container.querySelector<HTMLElement>('.card-nav__counter')!;
    expect(counter.textContent).toBe('1 / 20');

    const card = container.querySelector<HTMLElement>('.flip-card')!;
    expect(card.classList.contains('flipped')).toBe(false);
    click(card);
    expect(card.classList.contains('flipped')).toBe(true);
    expect(card.textContent).toContain('青少年的');
  });

  it('标记已学 → 建卡并持久化，按钮状态切换', () => {
    const deps = makeDeps(emptyProgress());
    const container = document.createElement('div');
    renderLearn(container, deps);

    const mark = [...container.querySelectorAll('button')].find((b) =>
      b.textContent!.includes('标记已学'),
    )!;
    click(mark);

    expect(deps.saved.length).toBe(1);
    const card = deps.load().cards['teenage'];
    expect(card).toBeDefined();
    expect(card!.due).toBe(NOW); // 新卡立即进入到期队列
    expect([...container.querySelectorAll('button')].some((b) => b.textContent!.includes('已加入复习计划'))).toBe(true);
  });
});

describe('复习页', () => {
  it('无到期卡时显示空状态', () => {
    const container = document.createElement('div');
    renderReview(container, makeDeps(emptyProgress()));
    expect(container.textContent).toContain('暂无到期单词');
  });

  it('到期卡渲染四档按钮，good 评分后按 SM-2 更新并持久化', () => {
    const progress = emptyProgress();
    progress.cards['teenage'] = createCard('teenage', NOW - 1); // 已到期
    const deps = makeDeps(progress);
    const container = document.createElement('div');
    renderReview(container, deps);

    const grades = [...container.querySelectorAll('button[data-grade]')].map(
      (b) => b.getAttribute('data-grade'),
    );
    expect(grades).toEqual(['again', 'hard', 'good', 'easy']);

    const good = container.querySelector<HTMLButtonElement>('button[data-grade="good"]')!;
    click(good);

    const savedCard = deps.load().cards['teenage'];
    expect(savedCard.reps).toBe(1);
    expect(savedCard.intervalDays).toBe(1);
    expect(savedCard.due).toBe(NOW + 1 * DAY_MS);
    expect(container.textContent).toContain('暂无到期单词'); // 队列清空
  });

  it('进度中的词表外脏 id 被自动清理', () => {
    const progress = emptyProgress();
    progress.cards['ghost-word'] = createCard('ghost-word', NOW);
    const deps = makeDeps(progress);
    const container = document.createElement('div');
    renderReview(container, deps);

    expect(deps.load().cards['ghost-word']).toBeUndefined();
    expect(container.textContent).toContain('暂无到期单词');
  });

  it('again 评分走 10 分钟学习步长', () => {
    const progress = emptyProgress();
    progress.cards['teenage'] = createCard('teenage', NOW - 1);
    const deps = makeDeps(progress);
    const container = document.createElement('div');
    renderReview(container, deps);

    click(container.querySelector<HTMLButtonElement>('button[data-grade="again"]')!);
    const savedCard = deps.load().cards['teenage'];
    expect(savedCard.due).toBe(NOW + 10 * 60 * 1000);
    expect(savedCard.lapses).toBe(1);
    expect(savedCard.intervalDays).toBe(0);
  });
});
