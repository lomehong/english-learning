import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderLearn } from './learn';
import { renderReview } from './review';
import { renderVocabulary } from './vocabulary';
import { createCard, DAY_MS } from '../srs/sm2';
import { emptyProgress, loadProgress, saveProgress, type Progress } from '../store/progress';
import { clearWrongBook, loadWrongBook, recordWrong, saveWrongBook } from '../store/wrongbook';
import { emptyStats, loadStats, saveStats } from '../store/stats';
import { getWord, getWordsByUnit } from '../data/words';
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

  it('unit=unit2：渲染 Unit 2 词表（Travelling Around），标记已学写入同一份进度', () => {
    const deps = makeDeps(emptyProgress());
    const container = document.createElement('div');
    renderLearn(container, deps, { unit: 'unit2' });

    const words = getWordsByUnit('unit2');
    const counter = container.querySelector<HTMLElement>('.card-nav__counter')!;
    expect(counter.textContent).toBe(`1 / ${words.length}`);

    const card = container.querySelector<HTMLElement>('.flip-card')!;
    expect(card.textContent).toContain(words[0]!.word);
    click(card);
    expect(card.textContent).toContain(words[0]!.meaning);

    const mark = [...container.querySelectorAll('button')].find((b) =>
      b.textContent!.includes('标记已学'),
    )!;
    click(mark);
    expect(deps.load().cards[words[0]!.id]).toBeDefined();
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

  it('Unit 2 单词复习评分计入 unit2 统计维度', () => {
    const progress = emptyProgress();
    progress.cards['apply'] = createCard('apply', NOW - 1); // Unit 2 词，已到期
    const deps = makeDeps(progress);
    const container = document.createElement('div');
    renderReview(container, deps);

    click(container.querySelector<HTMLButtonElement>('button[data-grade="good"]')!);

    expect(loadStats().modules.vocab).toEqual({ answered: 1, correct: 1 });
    expect(loadStats().units.unit2.vocab).toEqual({ answered: 1, correct: 1 });
    expect(loadStats().units.unit1.vocab).toEqual({ answered: 0, correct: 0 });
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

describe('词汇页 · 单元切换（/vocabulary 容器）', () => {
  beforeEach(() => {
    saveProgress(emptyProgress());
    history.replaceState(null, '', '/vocabulary');
  });

  afterEach(() => {
    history.replaceState(null, '', '/vocabulary');
    saveProgress(emptyProgress());
  });

  it('?unit=unit2 直链渲染 Unit 2 词表；标记已学写入共享进度', () => {
    history.replaceState(null, '', '/vocabulary?unit=unit2');
    const container = document.createElement('div');
    renderVocabulary(container);

    expect(container.querySelector('h1')!.textContent).toContain('Unit 2');
    expect(container.querySelector('h1')!.textContent).toContain('Travelling Around');
    const counter = container.querySelector<HTMLElement>('.card-nav__counter')!;
    expect(counter.textContent).toBe('1 / 20');

    const mark = [...container.querySelectorAll('button')].find((b) =>
      b.textContent!.includes('标记已学'),
    )!;
    click(mark);
    const progress = loadProgress();
    expect(progress.cards['apply']).toBeDefined();
    expect(progress.cards['teenage']).toBeUndefined();
  });

  it('单元与 Tab 参数共存：?unit=unit2&tab=review 直达复习队列，URL 保留单元', () => {
    history.replaceState(null, '', '/vocabulary?unit=unit2&tab=review');
    const progress = emptyProgress();
    progress.cards['apply'] = createCard('apply', NOW - 1);
    saveProgress(progress);

    const container = document.createElement('div');
    renderVocabulary(container);

    expect(container.textContent).toContain('剩余 1 词');
    expect(location.search).toContain('unit=unit2');
    expect(location.search).toContain('tab=review');
  });

  it('点击单元切换按钮：URL 更新且内容切到对应单元词表（tab 参数保留）', () => {
    const container = document.createElement('div');
    renderVocabulary(container);

    const unit2Btn = container.querySelector<HTMLButtonElement>(
      '[data-testid="unit-switcher"] button[data-unit="unit2"]',
    )!;
    click(unit2Btn);

    expect(location.search).toContain('unit=unit2');
    expect(container.querySelector('h1')!.textContent).toContain('Travelling Around');
    const card = container.querySelector<HTMLElement>('.flip-card')!;
    expect(card.textContent).toContain(getWordsByUnit('unit2')[0]!.word);
  });
});
