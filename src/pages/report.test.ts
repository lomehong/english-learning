import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderReport, buildReportData, buildAdvice, entryUnit, type ReportData } from './report';
import { emptyStats, recordAnswer, type StatsBook } from '../store/stats';
import { emptyWrongBook, recordWrong, type WrongBook, type WrongInput } from '../store/wrongbook';
import { emptyProgress, type Progress } from '../store/progress';
import { createCard, DAY_MS } from '../srs/sm2';
import type { ReportDeps } from './deps';
import type { PracticeModule } from '../types';
import { UNIT_IDS, BOOK_IDS, type UnitId } from '../data/units';

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

/** 统计：Unit1 语法 4 答 2 对、阅读 2 答 2 对、词汇 2 答 1 对；Unit2 语法 1 答 0 对、听力 1 答 1 对 */
function sampleStats(): StatsBook {
  let stats = emptyStats();
  for (const [m, pairs, unit] of [
    ['grammar', [true, false, false, true], 'unit1'],
    ['reading', [true, true], 'unit1'],
    ['vocab', [false, true], 'unit1'],
    ['grammar', [false], 'unit2'],
    ['listening', [true], 'unit2'],
  ] as Array<[PracticeModule, boolean[], UnitId]>) {
    for (const correct of pairs) stats = recordAnswer(stats, m, correct, unit);
  }
  return stats;
}

/** 错题：Unit1 语法 ×2、Unit1 阅读 ×1；Unit2 语法 ×1、Unit2 词汇 ×1 */
function sampleBook(): WrongBook {
  let book = recordWrong(emptyWrongBook(), wrongInput(), NOW);
  book = recordWrong(book, wrongInput({ exerciseId: 'g4' }), NOW);
  book = recordWrong(book, wrongInput({ exerciseId: 'r1-1', module: 'reading' }), NOW);
  book = recordWrong(
    book,
    wrongInput({ exerciseId: 'u2-g1', stem: 'She ______ to the travel office.', yourAnswer: 'has been', correctAnswer: 'has gone' }),
    NOW,
  );
  book = recordWrong(
    book,
    wrongInput({ exerciseId: 'w:apply', module: 'vocab', stem: 'apply /əˈplaɪ/', yourAnswer: '重来', correctAnswer: '申请' }),
    NOW,
  );
  return book;
}

/** 进度：Unit1 两张卡（teenage/exchange 到期，volunteer 明天到期）；Unit2 一张到期 */
function sampleProgress(): Progress {
  const progress = emptyProgress();
  progress.cards['teenage'] = createCard('teenage', NOW - DAY_MS);
  const fresh = createCard('exchange', NOW - DAY_MS);
  fresh.due = NOW - 1;
  progress.cards['exchange'] = fresh;
  const future = createCard('volunteer', NOW - DAY_MS);
  future.due = NOW + DAY_MS;
  progress.cards['volunteer'] = future;
  progress.cards['apply'] = createCard('apply', NOW - DAY_MS);
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
    expect(byModule.get('grammar')).toMatchObject({ answered: 5, correct: 2, accuracy: 0.4, wrongCount: 3 });
    expect(byModule.get('reading')).toMatchObject({ answered: 2, correct: 2, accuracy: 1, wrongCount: 1 });
    expect(byModule.get('vocab')).toMatchObject({ answered: 2, correct: 1, accuracy: 0.5, wrongCount: 1 });
    expect(byModule.get('listening')).toMatchObject({ answered: 1, correct: 1, accuracy: 1, wrongCount: 0 });

    expect(data.totalAnswered).toBe(10);
    expect(data.totalCorrect).toBe(6);
    expect(data.overallAccuracy).toBeCloseTo(0.6);
    expect(data.wrongTotal).toBe(5);
    expect(data.srsDue).toBe(3);
    expect(data.srsTotal).toBe(4);
  });

  it('按单元维度汇总：练习/正确率/错题与该单元词汇复习进度', () => {
    const data = buildReportData(sampleStats(), sampleBook(), sampleProgress(), NOW);

    const byUnit = new Map(data.unitRows.map((r) => [r.unit, r]));
    expect(byUnit.get('unit1')).toMatchObject({
      answered: 8,
      correct: 5,
      accuracy: 0.625,
      wrongCount: 3,
      srsTotal: 2,
      srsDue: 1,
    });
    expect(byUnit.get('unit2')).toMatchObject({
      answered: 2,
      correct: 1,
      accuracy: 0.5,
      wrongCount: 2,
      srsTotal: 1,
      srsDue: 1,
    });
    // 各单元合计与总量对齐（Unit 3 未练习，行为 0 不影响合计）
    expect(data.unitRows.reduce((n, r) => n + r.answered, 0)).toBe(data.totalAnswered);
    expect(data.unitRows.reduce((n, r) => n + r.wrongCount, 0)).toBe(data.wrongTotal);
    expect(data.unitRows.reduce((n, r) => n + r.srsTotal, 0)).toBe(3); // exchange 不属于任何单元词表
  });

  it('entryUnit 错题归属：u2-/u3- 前缀按单元号归档；w:词id → 按词表；其余 → Unit 1', () => {
    const book = sampleBook();
    expect(entryUnit(book.entries['g1']!)).toBe('unit1');
    expect(entryUnit(book.entries['r1-1']!)).toBe('unit1');
    expect(entryUnit(book.entries['u2-g1']!)).toBe('unit2');
    expect(entryUnit(book.entries['w:apply']!)).toBe('unit2');
    expect(entryUnit({ ...book.entries['u2-g1']!, exerciseId: 'u3-g1' })).toBe('unit3');
    expect(entryUnit({ ...book.entries['u2-g1']!, exerciseId: 'u3-l1-1' })).toBe('unit3');
    expect(entryUnit({ ...book.entries['u2-g1']!, exerciseId: 'u9-g1' })).toBe('unit1'); // 未注册前缀回退
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
    expect(advice).toContain('3 个单词');
    expect(advice).toContain('5 道');
  });

  it('正确率低的已练模块 → 指出短板（语法/词汇并列时取最先出现者）', () => {
    const advice = buildAdvice(base).join('');
    expect(advice).toContain('短板');
    expect(advice).toContain('语法');
  });

  it('未开始模块（听力）→ 提示均衡推进；整体正确率高 → 正向反馈', () => {
    let stats = emptyStats();
    for (let i = 0; i < 10; i += 1) stats = recordAnswer(stats, 'grammar', true, 'unit1');
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

    expect(container.querySelector('[data-testid="stat-answered"]')!.textContent).toContain('10');
    expect(container.querySelector('[data-testid="stat-accuracy"]')!.textContent).toContain('60%');
    expect(container.querySelector('[data-testid="stat-wrong"]')!.textContent).toContain('5');
    expect(container.querySelector('[data-testid="stat-due"]')!.textContent).toContain('3');
  });

  it('渲染各模块行：练习次数/正确率/错题数 + 纯 CSS/SVG 图表（不引第三方库）', () => {
    renderReport(container, makeDeps());

    const rows = container.querySelectorAll('[data-testid="module-row"]');
    expect(rows).toHaveLength(4);

    const grammar = container.querySelector<HTMLElement>('[data-testid="module-row"][data-module="grammar"]')!;
    expect(grammar.querySelector('[data-testid="module-answered"]')!.textContent).toContain('5');
    expect(grammar.querySelector('[data-testid="module-accuracy"]')!.textContent).toContain('40%');
    expect(grammar.querySelector('[data-testid="module-wrong"]')!.textContent).toContain('3');

    // 正确率条：宽度百分比与数据一致（纯 CSS 实现）
    const bar = grammar.querySelector<HTMLElement>('.report-bar__fill')!;
    expect(bar.style.width).toBe('40%');

    // 总体正确率环：SVG circle，dasharray 与 60% 对应且携带 data-accuracy
    const donut = container.querySelector<SVGCircleElement>('[data-testid="accuracy-donut"]')!;
    expect(donut).toBeTruthy();
    expect(donut.getAttribute('data-accuracy')).toBe('60');
    expect(donut.getAttribute('stroke-dasharray')).toMatch(/^\d+(\.\d+)? \d+(\.\d+)?$/);
  });

  it('未练习模块显示「—」且进度条为 0%', () => {
    renderReport(container, makeDeps(emptyStats(), emptyWrongBook(), emptyProgress()));

    const vocab = container.querySelector<HTMLElement>('[data-testid="module-row"][data-module="vocab"]')!;
    expect(vocab.querySelector('[data-testid="module-accuracy"]')!.textContent).toContain('—');
    expect(vocab.querySelector<HTMLElement>('.report-bar__fill')!.style.width).toBe('0%');
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

  it('渲染按单元统计：每注册单元一行（Unit 1–4），练习/正确率/错题/词汇复习数值正确', () => {
    renderReport(container, makeDeps());

    const section = container.querySelector('[data-testid="unit-stats"]')!;
    const rows = section.querySelectorAll('[data-testid="unit-row"]');
    expect(rows).toHaveLength(UNIT_IDS.length);

    const unit1 = section.querySelector<HTMLElement>('[data-testid="unit-row"][data-unit="unit1"]')!;
    expect(unit1.querySelector('[data-testid="unit-answered"]')!.textContent).toContain('8');
    expect(unit1.querySelector('[data-testid="unit-accuracy"]')!.textContent).toContain('62.5%');
    expect(unit1.querySelector('[data-testid="unit-wrong"]')!.textContent).toContain('3');
    expect(unit1.querySelector('[data-testid="unit-srs"]')!.textContent).toContain('2');
    expect(unit1.querySelector<HTMLElement>('.report-bar__fill')!.style.width).toBe('62.5%');

    const unit2 = section.querySelector<HTMLElement>('[data-testid="unit-row"][data-unit="unit2"]')!;
    expect(unit2.querySelector('[data-testid="unit-answered"]')!.textContent).toContain('2');
    expect(unit2.querySelector('[data-testid="unit-accuracy"]')!.textContent).toContain('50%');
    expect(unit2.querySelector('[data-testid="unit-wrong"]')!.textContent).toContain('2');
    expect(unit2.querySelector('[data-testid="unit-srs"]')!.textContent).toContain('1');

    // Unit 3：注册表自带行，未练习时正确率显示「—」
    const unit3 = section.querySelector<HTMLElement>('[data-testid="unit-row"][data-unit="unit3"]')!;
    expect(unit3.querySelector('[data-testid="unit-answered"]')!.textContent).toContain('0');
    expect(unit3.querySelector('[data-testid="unit-accuracy"]')!.textContent).toContain('—');
    expect(unit3.textContent).toContain('Sports and Fitness');

    // Unit 4：纯数据文件新增的单元同样自动出现在按单元统计（未练习 → 全 0 行）
    const unit4 = section.querySelector<HTMLElement>('[data-testid="unit-row"][data-unit="unit4"]')!;
    expect(unit4.querySelector('[data-testid="unit-answered"]')!.textContent).toContain('0');
    expect(unit4.querySelector('[data-testid="unit-accuracy"]')!.textContent).toContain('—');
    expect(unit4.textContent).toContain('Natural Disasters');

    // 每行带「去练习」入口（带单元参数）
    expect(unit1.querySelector<HTMLAnchorElement>('a[href="/vocabulary?unit=unit1"]')).toBeTruthy();
    expect(unit2.querySelector<HTMLAnchorElement>('a[href="/vocabulary?unit=unit2"]')).toBeTruthy();
    expect(unit3.querySelector<HTMLAnchorElement>('a[href="/vocabulary?unit=unit3"]')).toBeTruthy();
  });

  it('渲染数据管理区（导出 / 导入）', () => {
    renderReport(container, makeDeps());

    const section = container.querySelector('[data-testid="data-management"]')!;
    expect(section.querySelector<HTMLButtonElement>('[data-testid="export-btn"]')).toBeTruthy();
    expect(section.querySelector<HTMLInputElement>('[data-testid="import-file"]')).toBeTruthy();
    expect(section.textContent).toContain('合并去重');
  });
});

describe('学习报告 · 按册 + 单元统计（册维度分组聚合）', () => {
  it('bookRows：七册固定分组（含空册），必修一汇总该册全部单元，册合计与总量对齐', () => {
    const data = buildReportData(sampleStats(), sampleBook(), sampleProgress(), NOW);

    expect(data.bookRows.map((r) => r.book)).toEqual([...BOOK_IDS]);
    const required1 = data.bookRows[0]!;
    expect(required1.label).toBe('必修一');
    expect(required1.unitRows.map((r) => r.unit)).toEqual([...UNIT_IDS]);
    expect(required1.answered).toBe(10);
    expect(required1.correct).toBe(6);
    expect(required1.accuracy).toBeCloseTo(0.6);
    expect(required1.wrongCount).toBe(5);

    // 其余六册：尚无单元（缺册降级为空分组），合计为 0 且正确率 null
    for (const row of data.bookRows.slice(1)) {
      expect(row.unitRows).toEqual([]);
      expect(row.answered).toBe(0);
      expect(row.correct).toBe(0);
      expect(row.accuracy).toBeNull();
      expect(row.wrongCount).toBe(0);
    }

    // 册分组与单元行同源：合计对齐、展开顺序一致
    expect(data.bookRows.reduce((n, r) => n + r.answered, 0)).toBe(data.totalAnswered);
    expect(data.bookRows.reduce((n, r) => n + r.wrongCount, 0)).toBe(data.wrongTotal);
    expect(data.bookRows.flatMap((r) => r.unitRows.map((u) => u.unit))).toEqual(
      data.unitRows.map((u) => u.unit),
    );
  });

  it('渲染：每册一个分组（data-testid=book-group），册头带汇总徽标，空册显示降级占位', () => {
    const container = document.createElement('div');
    history.replaceState(null, '', '/report');
    renderReport(container, makeDeps());

    const groups = container.querySelectorAll('[data-testid="book-group"]');
    expect(groups).toHaveLength(BOOK_IDS.length);

    const g1 = container.querySelector<HTMLElement>('[data-testid="book-group"][data-book="required-1"]')!;
    expect(g1.querySelector('[data-testid="book-summary"]')!.textContent).toContain('5 个单元');
    expect(g1.querySelector('[data-testid="book-summary"]')!.textContent).toContain('60%');
    expect(g1.querySelectorAll('[data-testid="unit-row"]')).toHaveLength(UNIT_IDS.length);

    // 空册：保留分组（架构占位），册头显示「暂未收录单元」，组内是降级提示而非崩溃
    const empty = container.querySelector<HTMLElement>('[data-testid="book-group"][data-book="elective-2"]')!;
    expect(empty.querySelector('[data-testid="book-summary"]')!.textContent).toContain('暂未收录单元');
    expect(empty.querySelector('[data-testid="book-empty"]')!.textContent).toContain('选择性必修二');
    expect(empty.querySelector('[data-testid="unit-row"]')).toBeNull();

    // 单元行携带册别维度（册 + 单元两级归属）
    const unit2 = container.querySelector<HTMLElement>('[data-testid="unit-row"][data-unit="unit2"]')!;
    expect(unit2.dataset.book).toBe('required-1');
  });
});
