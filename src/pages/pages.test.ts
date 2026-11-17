import { describe, it, expect, beforeEach } from 'vitest';
import { renderLearn } from './learn';
import { renderReview } from './review';
import { createCard, DAY_MS } from '../srs/sm2';
import { emptyProgress, type Progress } from '../store/progress';
import { clearWrongBook, loadWrongBook, recordWrong, saveWrongBook } from '../store/wrongbook';
import { emptyStats, loadStats, saveStats } from '../store/stats';
import { getWord } from '../data/words';
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

describe('复习页 · 错题与统计数据源（错题本/学习报告页消费）', () => {
  beforeEach(() => {
    // 页面错题/统计均写默认存储；同源重置保证用例独立
    clearWrongBook();
    saveStats(emptyStats());
  });

  function reviewOneDue(): { container: HTMLElement; deps: ReturnType<typeof makeDeps> } {
    const progress = emptyProgress();
    progress.cards['teenage'] = createCard('teenage', NOW - 1);
    const deps = makeDeps(progress);
    const container = document.createElement('div');
    renderReview(container, deps);
    return { container, deps };
  }

  it('again 评分：记为词汇错题（w: 前缀，module=vocab）并计入统计', () => {
    const { container } = reviewOneDue();

    click(container.querySelector<HTMLButtonElement>('button[data-grade="again"]')!);

    const entry = loadWrongBook().entries['w:teenage'];
    expect(entry).toBeDefined();
    expect(entry!.module).toBe('vocab');
    expect(entry!.correctAnswer).toBe(getWord('teenage')!.meaning);
    expect(loadStats().modules.vocab).toEqual({ answered: 1, correct: 0 });
  });

  it('good 评分：计入统计（correct+1），并移除该词已有的词汇错题（掌握即出本）', () => {
    const progress = emptyProgress();
    progress.cards['teenage'] = createCard('teenage', NOW - 1);
    let clock = NOW;
    const deps = { ...makeDeps(progress), now: () => clock };
    const container = document.createElement('div');
    renderReview(container, deps);

    click(container.querySelector<HTMLButtonElement>('button[data-grade="again"]')!);
    expect(loadWrongBook().entries['w:teenage']).toBeDefined();

    // 10 分钟学习步长过后，单词重新进入到期队列；这次评 good = 确认掌握
    clock = NOW + 11 * 60 * 1000;
    renderReview(container, deps);
    click(container.querySelector<HTMLButtonElement>('button[data-grade="good"]')!);

    expect(loadWrongBook().entries['w:teenage']).toBeUndefined();
    expect(loadStats().modules.vocab).toEqual({ answered: 2, correct: 1 });
  });

  it('非 again 评分在无词汇错题时不出本、不误删他词错题', () => {
    const { container } = reviewOneDue();
    // 预置一条别的词的词汇错题，确认不会被误删
    saveWrongBook(
      recordWrong(
        loadWrongBook(),
        {
          exerciseId: 'w:volunteer',
          module: 'vocab',
          stem: 'volunteer',
          yourAnswer: '记不起',
          correctAnswer: '志愿者',
          explanation: '-',
        },
        NOW,
      ),
    );

    click(container.querySelector<HTMLButtonElement>('button[data-grade="good"]')!);

    expect(loadWrongBook().entries['w:volunteer']).toBeDefined();
    expect(loadWrongBook().entries['w:teenage']).toBeUndefined();
    expect(loadStats().modules.vocab).toEqual({ answered: 1, correct: 1 });
  });
});
