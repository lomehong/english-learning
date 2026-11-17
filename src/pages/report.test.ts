import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderReport, buildReportData, buildAdvice, type ReportData } from './report';
import { emptyStats, recordAnswer, type StatsBook } from '../store/stats';
import { emptyWrongBook, recordWrong, type WrongBook, type WrongInput } from '../store/wrongbook';
import { emptyProgress, type Progress } from '../store/progress';
import { createCard, DAY_MS } from '../srs/sm2';
import type { ReportDeps } from './deps';
import type { PracticeModule } from '../types';

const NOW = Date.UTC(2026, 0, 1);

function wrongInput(overrides: Partial<WrongInput> = {}): WrongInput {
  return {
    exerciseId: 'g1',
    module: 'grammar',
    stem: 'Listen! Someone ______ in the next room.',
    yourAnswer: 'sings',
    correctAnswer: 'is singing',
    explanation: '现在进行时。',
    ...overrides,
  };
}

/** 统计：语法 4 答 2 对、阅读 2 答 2 对、词汇 2 答 1 对 */
function sampleStats(): StatsBook {
  let stats = emptyStats();
  for (const [m, pairs] of [
    ['grammar', [true, false, false, true]],
    ['reading', [true, true]],
    ['vocab', [false, true]],
  ] as Array<[PracticeModule, boolean[]]>) {
    for (const correct of pairs) stats = recordAnswer(stats, m, correct);
  }
  return stats;
}

/** 错题：语法 ×2、阅读 ×1 */
function sampleBook(): WrongBook {
  let book = recordWrong(emptyWrongBook(), wrongInput(), NOW);
  book = recordWrong(book, wrongInput({ exerciseId: 'g4' }), NOW);
  book = recordWrong(book, wrongInput({ exerciseId: 'r1-1', module: 'reading' }), NOW);
  return book;
}

/** 进度：3 张卡，其中 2 张到期（teenage/exchange），1 张明天到期 */
function sampleProgress(): Progress {
  const progress = emptyProgress();
  progress.cards['teenage'] = createCard('teenage', NOW - DAY_MS);
  const fresh = createCard('exchange', NOW - DAY_MS);
  fresh.due = NOW - 1;
  progress.cards['exchange'] = fresh;
  const future = createCard('volunteer', NOW - DAY_MS);
  future.due = NOW + DAY_MS;
  progress.cards['volunteer'] = future;
  return progress;
}

function makeDeps(
  stats: StatsBook = sampleStats(),
  book: WrongBook = sampleBook(),
  progress: Progress = sampleProgress(),
): ReportDeps {
  return {
    loadStats: () => stats,
    loadWrong: () => book,
    loadProgress: () => progress,
    now: () => NOW,
  };
}

describe('学习报告 · 数据组装（纯函数）', () => {
  it('按模块汇总练习次数/正确率/错题数，未练习模块正确率为 null', () => {
    const data = buildReportData(sampleStats(), sampleBook(), sampleProgress(), NOW);

    const byModule = new Map(data.rows.map((r) => [r.module, r]));
    expect(byModule.get('grammar')).toMatchObject({ answered: 4, correct: 2, accuracy: 0.5, wrongCount: 2 });
    expect(byModule.get('reading')).toMatchObject({ answered: 2, correct: 2, accuracy: 1, wrongCount: 1 });
    expect(byModule.get('vocab')).toMatchObject({ answered: 2, correct: 1, accuracy: 0.5, wrongCount: 0 });
    expect(byModule.get('listening')).toMatchObject({ answered: 0, correct: 0, accuracy: null, wrongCount: 0 });

    expect(data.totalAnswered).toBe(8);
    expect(data.totalCorrect).toBe(5);
    expect(data.overallAccuracy).toBeCloseTo(0.625);
    expect(data.wrongTotal).toBe(3);
    expect(data.srsDue).toBe(2);
    expect(data.srsTotal).toBe(3);
  });

  it('全空数据：总计为 0、正确率 null、到期 0', () => {
    const data = buildReportData(emptyStats(), emptyWrongBook(), emptyProgress(), NOW);
    expect(data.totalAnswered).toBe(0);
    expect(data.overallAccuracy).toBeNull();
    expect(data.wrongTotal).toBe(0);
    expect(data.srsDue).toBe(0);
    expect(data.srsTotal).toBe(0);
  });
});

describe('学习报告 · 建议文案（纯函数）', () => {
  const base: ReportData = buildReportData(sampleStats(), sampleBook(), sampleProgress(), NOW);

  it('零数据给新手引导', () => {
    const empty = buildReportData(emptyStats(), emptyWrongBook(), emptyProgress(), NOW);
    const advice = buildAdvice(empty);
    expect(advice.length).toBeGreaterThanOrEqual(1);
    expect(advice[0]).toContain('词汇');
    expect(advice.join('')).not.toContain('短板');
  });

  it('有到期单词 → 提示优先复习；有错题 → 提示去错题本消化', () => {
    const advice = buildAdvice(base).join('');
    expect(advice).toContain('2 个单词');
    expect(advice).toContain('3 道');
  });

  it('正确率低的已练模块 → 指出短板（语法/词汇并列时取最先出现者）', () => {
    const advice = buildAdvice(base).join('');
    expect(advice).toContain('短板');
    expect(advice).toContain('语法');
  });

  it('未开始模块（听力）→ 提示均衡推进；整体正确率高 → 正向反馈', () => {
    let stats = emptyStats();
    for (let i = 0; i < 10; i += 1) stats = recordAnswer(stats, 'grammar', true);
    const data = buildReportData(stats, emptyWrongBook(), sampleProgress(), NOW);
    const advice = buildAdvice(data).join('');
    expect(advice).toContain('听力');
    expect(advice).toContain('保持');
  });
});

describe('学习报告页 /report', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    history.replaceState(null, '', '/report');
  });

  afterEach(() => {
    container.remove();
    history.replaceState(null, '', '/report');
  });

  it('渲染四张总览卡：总练习/正确率/错题数/SRS 到期，数值正确', () => {
    renderReport(container, makeDeps());

    expect(container.querySelector('[data-testid="stat-answered"]')!.textContent).toContain('8');
    expect(container.querySelector('[data-testid="stat-accuracy"]')!.textContent).toContain('62.5%');
    expect(container.querySelector('[data-testid="stat-wrong"]')!.textContent).toContain('3');
    expect(container.querySelector('[data-testid="stat-due"]')!.textContent).toContain('2');
  });

  it('渲染各模块行：练习次数/正确率/错题数 + 纯 CSS/SVG 图表（不引第三方库）', () => {
    renderReport(container, makeDeps());

    const rows = container.querySelectorAll('[data-testid="module-row"]');
    expect(rows).toHaveLength(4);

    const grammar = container.querySelector<HTMLElement>('[data-testid="module-row"][data-module="grammar"]')!;
    expect(grammar.querySelector('[data-testid="module-answered"]')!.textContent).toContain('4');
    expect(grammar.querySelector('[data-testid="module-accuracy"]')!.textContent).toContain('50%');
    expect(grammar.querySelector('[data-testid="module-wrong"]')!.textContent).toContain('2');

    // 正确率条：宽度百分比与数据一致（纯 CSS 实现）
    const bar = grammar.querySelector<HTMLElement>('.report-bar__fill')!;
    expect(bar.style.width).toBe('50%');

    // 总体正确率环：SVG circle，dasharray 与 62.5% 对应且携带 data-accuracy
    const donut = container.querySelector<SVGCircleElement>('[data-testid="accuracy-donut"]')!;
    expect(donut).toBeTruthy();
    expect(donut.getAttribute('data-accuracy')).toBe('62.5');
    expect(donut.getAttribute('stroke-dasharray')).toMatch(/^\d+(\.\d+)? \d+(\.\d+)?$/);
  });

  it('未练习模块显示「—」且进度条为 0%', () => {
    renderReport(container, makeDeps());

    const listening = container.querySelector<HTMLElement>('[data-testid="module-row"][data-module="listening"]')!;
    expect(listening.querySelector('[data-testid="module-accuracy"]')!.textContent).toContain('—');
    expect(listening.querySelector<HTMLElement>('.report-bar__fill')!.style.width).toBe('0%');
  });

  it('渲染学习建议列表与跳转入口（错题本/词汇复习）', () => {
    renderReport(container, makeDeps());

    const advice = container.querySelector('[data-testid="report-advice"]')!;
    expect(advice.querySelectorAll('li').length).toBeGreaterThanOrEqual(2);
    expect(advice.textContent).toContain('短板');

    expect(container.querySelector<HTMLAnchorElement>('a[href="/mistakes"]')).toBeTruthy();
    expect(container.querySelector<HTMLAnchorElement>('a[href="/vocabulary?tab=review"]')).toBeTruthy();
  });

  it('零数据状态：总览为 0、显示新手引导文案', () => {
    renderReport(container, makeDeps(emptyStats(), emptyWrongBook(), emptyProgress()));

    expect(container.querySelector('[data-testid="stat-answered"]')!.textContent).toContain('0');
    expect(container.querySelector('[data-testid="stat-accuracy"]')!.textContent).toContain('—');
    expect(container.querySelector('[data-testid="report-advice"]')!.textContent).toContain('词汇');
  });
});
