import type { PracticeModule, WrongEntry } from '../types';
import { BOOKS, BOOK_LABELS, UNIT_IDS, UNIT_META, type BookId, type UnitId } from '../data/units';
import { getWordUnit } from '../data/words';
import { loadWrongBook, type WrongBook } from '../store/wrongbook';
import { loadStats, PRACTICE_MODULES, type StatsBook } from '../store/stats';
import { loadProgress, type Progress } from '../store/progress';
import {
  buildLast7Days,
  computeStreak,
  goalCompletion,
  loadDaily,
  loadGoal,
  normalizeGoal,
  saveGoal,
  GOAL_MAX,
  GOAL_MIN,
} from '../store/daily';
import { MODULE_LABEL, MODULE_RETRY_ROUTE, pctText, buildEmptyState, type ReportDeps } from './deps';
import { buildDataManagement, defaultDataManagementDeps } from './data-management';

/**
 * /report 学习报告页：汇总各模块练习次数 / 正确率 / 错题数与词汇 SRS 到期数，
 * 并提供按册 + 单元两级统计维度与数据导出/导入。
 * 图表全部用纯 CSS（正确率条）+ 内联 SVG（正确率环）实现，不引第三方图表库。
 */

const MODULE_ORDER: readonly PracticeModule[] = ['vocab', 'grammar', 'reading', 'listening'];

/** 总体正确率环：viewBox 120，半径 52 */
const DONUT_RADIUS = 52;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

/** 单元「去练习」入口：优先词汇（各单元都有词表可学） */
const UNIT_RETRY_ROUTE: Record<UnitId, string> = Object.fromEntries(
  UNIT_IDS.map((id) => [id, `/vocabulary?unit=${id}`]),
) as Record<UnitId, string>;

export interface ModuleRow {
  module: PracticeModule;
  answered: number;
  correct: number;
  /** 0~1；未练习为 null */
  accuracy: number | null;
  wrongCount: number;
}

export interface UnitRow {
  unit: UnitId;
  /** 所属册别（按册 + 单元统计的分组维度） */
  book: BookId;
  answered: number;
  correct: number;
  /** 0~1；未练习为 null */
  accuracy: number | null;
  wrongCount: number;
  /** 该单元已加入复习计划的单词数 */
  srsTotal: number;
  /** 该单元当前到期（due <= now）应复习的单词数 */
  srsDue: number;
}

/** 册别汇总行：该册全部单元的合计统计（册级维度） */
export interface BookRow {
  book: BookId;
  /** 册别展示名（必修一…选择性必修四） */
  label: string;
  /** 该册的单元统计行（册内 no 升序；空册为空数组） */
  unitRows: UnitRow[];
  answered: number;
  correct: number;
  /** 0~1；未练习为 null */
  accuracy: number | null;
  wrongCount: number;
}

export interface ReportData {
  rows: ModuleRow[];
  unitRows: UnitRow[];
  /** 按册分组聚合（七册固定分组，含空册；与 unitRows 同源） */
  bookRows: BookRow[];
  totalAnswered: number;
  totalCorrect: number;
  overallAccuracy: number | null;
  wrongTotal: number;
  /** 已加入复习计划的单词数（全部单元合计） */
  srsTotal: number;
  /** 当前到期（due <= now）应复习的单词数（全部单元合计） */
  srsDue: number;
}

/** 错题条目归属单元：u{n}- 前缀按注册表单元号归档；w:词id → 按词表归属；其余（Unit 1 旧 id）→ Unit 1 */
export function entryUnit(entry: WrongEntry): UnitId {
  for (const unit of UNIT_IDS) {
    const no = UNIT_META[unit].no;
    if (no > 1 && entry.exerciseId.startsWith(`u${no}-`)) return unit;
  }
  if (entry.exerciseId.startsWith('w:')) return getWordUnit(entry.exerciseId.slice(2)) ?? 'unit1';
  return 'unit1';
}

/** 数据组装（纯函数）：统计 + 错题 + 进度三源合一，含按单元维度 */
export function buildReportData(
  stats: StatsBook,
  book: WrongBook,
  progress: Progress,
  now: number,
): ReportData {
  const rows: ModuleRow[] = MODULE_ORDER.map((module) => {
    const stat = stats.modules[module] ?? { answered: 0, correct: 0 };
    const wrongCount = Object.values(book.entries).filter((e) => e.module === module).length;
    return {
      module,
      answered: stat.answered,
      correct: stat.correct,
      accuracy: stat.answered === 0 ? null : stat.correct / stat.answered,
      wrongCount,
    };
  });

  const entries = Object.values(book.entries);
  const unitRows: UnitRow[] = UNIT_IDS.map((unit) => {
    let answered = 0;
    let correct = 0;
    const table = stats.units?.[unit];
    if (table) {
      for (const module of PRACTICE_MODULES) {
        answered += table[module]?.answered ?? 0;
        correct += table[module]?.correct ?? 0;
      }
    }
    const srsCards = Object.values(progress.cards).filter((c) => getWordUnit(c.id) === unit);
    return {
      unit,
      book: UNIT_META[unit].book,
      answered,
      correct,
      accuracy: answered === 0 ? null : correct / answered,
      wrongCount: entries.filter((e) => entryUnit(e) === unit).length,
      srsTotal: srsCards.length,
      srsDue: srsCards.filter((c) => c.due <= now).length,
    };
  });

  /* 按册分组聚合：七册固定分组（空册保留分组，行内降级提示），册内合计与单元行同源 */
  const bookRows: BookRow[] = BOOKS.map((def) => {
    const rows = unitRows.filter((r) => r.book === def.id);
    const answered = rows.reduce((n, r) => n + r.answered, 0);
    const correct = rows.reduce((n, r) => n + r.correct, 0);
    return {
      book: def.id,
      label: BOOK_LABELS[def.id],
      unitRows: rows,
      answered,
      correct,
      accuracy: answered === 0 ? null : correct / answered,
      wrongCount: rows.reduce((n, r) => n + r.wrongCount, 0),
    };
  });

  const totalAnswered = rows.reduce((n, r) => n + r.answered, 0);
  const totalCorrect = rows.reduce((n, r) => n + r.correct, 0);
  const cards = Object.values(progress.cards);

  return {
    rows,
    unitRows,
    bookRows,
    totalAnswered,
    totalCorrect,
    overallAccuracy: totalAnswered === 0 ? null : totalCorrect / totalAnswered,
    wrongTotal: entries.length,
    srsTotal: cards.length,
    srsDue: cards.filter((c) => c.due <= now).length,
  };
}

/** 学习建议（纯函数）：按到期 → 短板 → 错题 → 均衡 → 正向反馈的优先级生成 */
export function buildAdvice(data: ReportData): string[] {
  if (data.totalAnswered === 0 && data.wrongTotal === 0 && data.srsTotal === 0) {
    return [
      '学习数据还没有积累：先去「词汇」把单词标记已学、开启间隔复习，再到「语法」「阅读」做题，报告会在这里自动生成。',
    ];
  }

  const tips: string[] = [];

  if (data.srsDue > 0) {
    tips.push(
      `有 ${data.srsDue} 个单词到了复习时间：优先去「词汇 → 复习」清空到期队列，间隔重复最忌拖延。`,
    );
  }

  const weak = data.rows
    .filter((r) => r.answered >= 3 && r.accuracy !== null && r.accuracy < 0.8)
    .sort((a, b) => a.accuracy! - b.accuracy!)[0];
  if (weak) {
    tips.push(
      `「${MODULE_LABEL[weak.module]}」模块正确率 ${pctText(weak.accuracy)}，是当前短板：先回看讲解，再去错题本重练该模块的错题。`,
    );
  }

  if (data.wrongTotal > 0) {
    tips.push(`错题本还有 ${data.wrongTotal} 道错题未消化：建议每天清几道，重练确认掌握后移除。`);
  }

  const untouched = data.rows.filter((r) => r.answered === 0 && r.wrongCount === 0);
  if (untouched.length > 0 && untouched.length < MODULE_ORDER.length) {
    const names = untouched.map((r) => `「${MODULE_LABEL[r.module]}」`).join('');
    tips.push(`${names}模块还没有练习记录，保持四模块均衡推进。`);
  }

  if (data.overallAccuracy !== null && data.overallAccuracy >= 0.9 && data.totalAnswered >= 10) {
    tips.push(`总体正确率 ${pctText(data.overallAccuracy)}，状态很好，保持当前节奏即可。`);
  }

  return tips;
}

/* ---------- DOM 渲染 ---------- */

/** 百分比宽度文案：40% / 62.5%（与 pctText 同一舍入口径） */
function pctWidth(ratio: number): string {
  return `${Math.round(ratio * 1000) / 10}%`;
}

/** 今日目标输入框（每日词汇 / 练习题两维） */
function buildGoalField(label: string, testid: string, value: number): HTMLElement {
  const field = document.createElement('label');
  field.className = 'goal-form__field';
  const text = document.createElement('span');
  text.textContent = label;
  const input = document.createElement('input');
  input.type = 'number';
  input.min = String(GOAL_MIN);
  input.max = String(GOAL_MAX);
  input.step = '1';
  input.setAttribute('data-testid', testid);
  input.value = String(value);
  field.append(text, input);
  return field;
}

/**
 * 学习计划区：今日目标（可设每日词汇/练习题数，localStorage）+ 今日完成度 +
 * 连续学习天数（断签归零）+ 近 7 天活动图（纯 CSS 柱状，不引第三方库）。
 * 保存目标后就地刷新完成度 / streak / 活动图三块派生视图。
 */
function buildPlanSection(d: Required<ReportDeps>): HTMLElement {
  const section = document.createElement('section');
  section.className = 'report-plan';
  section.setAttribute('data-testid', 'daily-plan');

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '学习计划 · 今日目标与连续学习';

  const grid = document.createElement('div');
  grid.className = 'plan-grid';

  /* --- 目标设置卡 --- */
  const goalCard = document.createElement('div');
  goalCard.className = 'card plan-card';
  const goalTitle = document.createElement('h3');
  goalTitle.className = 'plan-card__title';
  goalTitle.textContent = '今日目标';
  const goalForm = document.createElement('form');
  goalForm.className = 'goal-form';
  goalForm.setAttribute('data-testid', 'goal-form');

  let goal = d.loadGoal();
  const vocabField = buildGoalField('每日词汇（新学）', 'goal-vocab-input', goal.vocab);
  const vocabInput = vocabField.querySelector('input')!;
  const exercisesField = buildGoalField('每日练习题', 'goal-exercises-input', goal.exercises);
  const exercisesInput = exercisesField.querySelector('input')!;

  const saveRow = document.createElement('div');
  saveRow.className = 'goal-form__save';
  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'btn btn--primary btn--sm';
  saveBtn.setAttribute('data-testid', 'goal-save');
  saveBtn.textContent = '保存目标';
  const savedHint = document.createElement('span');
  savedHint.className = 'goal-form__saved';
  savedHint.setAttribute('data-testid', 'goal-saved-hint');
  savedHint.textContent = '';
  saveRow.append(saveBtn, savedHint);
  goalForm.append(vocabField, exercisesField, saveRow);
  goalCard.append(goalTitle, goalForm);

  /* --- 派生视图容器（保存目标后整体重建） --- */
  const derived = document.createElement('div');
  derived.className = 'plan-derived';

  function refresh(): void {
    const daily = d.loadDaily();
    const now = d.now();
    const completion = goalCompletion(d.loadGoal(), daily, now);
    const streak = computeStreak(daily, now);
    const week = buildLast7Days(daily, now);
    section.dataset.state = completion.done ? 'done' : 'in-progress';

    /* 今日完成度卡 */
    const todayCard = document.createElement('div');
    todayCard.className = 'card plan-card';
    const todayTitle = document.createElement('h3');
    todayTitle.className = 'plan-card__title';
    todayTitle.textContent = '今日完成度';
    const todayText = document.createElement('p');
    todayText.setAttribute('data-testid', 'today-completion');
    todayText.className = 'plan-card__text';
    todayText.textContent = `词汇 ${completion.vocab}/${completion.vocabGoal} · 练习 ${completion.exercises}/${completion.exercisesGoal}${completion.done ? ' · 已达成 ✓' : ''}`;
    const overall = document.createElement('p');
    overall.setAttribute('data-testid', 'today-overall');
    overall.className = 'plan-card__text plan-card__text--strong';
    overall.textContent = `总进度 ${pctWidth(completion.overall)}`;
    const bar = document.createElement('div');
    bar.className = 'report-bar';
    const fill = document.createElement('div');
    fill.className = 'report-bar__fill report-bar__fill--goal';
    fill.setAttribute('data-testid', 'today-bar');
    fill.style.width = pctWidth(completion.overall);
    bar.append(fill);
    todayCard.append(todayTitle, todayText, overall, bar);

    /* 连续学习卡（streak） */
    const streakCard = document.createElement('div');
    streakCard.className = 'card plan-card';
    const streakTitle = document.createElement('h3');
    streakTitle.className = 'plan-card__title';
    streakTitle.textContent = '连续学习';
    const streakBadge = document.createElement('div');
    streakBadge.className = 'streak-badge';
    streakBadge.setAttribute('data-testid', 'streak-days');
    streakBadge.textContent = `🔥 连续 ${streak} 天`;
    const streakHint = document.createElement('p');
    streakHint.className = 'plan-card__text';
    streakHint.textContent = '每天记 1 个词或答 1 道题即算打卡；中断一天立即归零。今天还没学不打断，今天结束仍未学习则断签。';
    streakCard.append(streakTitle, streakBadge, streakHint);

    /* 近 7 天活动图（纯 CSS 柱状） */
    const weekCard = document.createElement('div');
    weekCard.className = 'card plan-card plan-card--wide';
    const weekTitle = document.createElement('h3');
    weekTitle.className = 'plan-card__title';
    weekTitle.textContent = '近 7 天活动';
    const chart = document.createElement('div');
    chart.className = 'activity-chart';
    chart.setAttribute('data-testid', 'activity-chart');
    const maxTotal = Math.max(...week.map((day) => day.total));
    if (maxTotal === 0) {
      chart.append(buildEmptyState('近 7 天暂无学习记录，今天记 1 个词或答 1 道题就开始积累。', 'activity-empty'));
    } else {
      for (const day of week) {
        const col = document.createElement('div');
        col.className = 'activity-chart__day';
        col.setAttribute('data-testid', 'activity-day');
        col.dataset.day = day.key;
        col.dataset.count = String(day.total);
        col.dataset.today = String(day.isToday);
        col.title = `${day.key} · 词汇 ${day.vocab} · 练习 ${day.exercises}`;
        const track = document.createElement('div');
        track.className = 'activity-chart__track';
        const barEl = document.createElement('div');
        barEl.className = 'activity-chart__bar';
        barEl.setAttribute('data-testid', 'activity-bar');
        barEl.style.height = pctWidth(day.total / maxTotal);
        track.append(barEl);
        const label = document.createElement('span');
        label.className = 'activity-chart__label';
        label.textContent = day.isToday ? '今' : day.label;
        col.append(track, label);
        chart.append(col);
      }
    }
    weekCard.append(weekTitle, chart);

    derived.replaceChildren(todayCard, streakCard, weekCard);
  }

  saveBtn.addEventListener('click', () => {
    // 空输入（NaN）沿用原值；normalizeGoal 统一收敛到 [1,500] 整数
    const vocab = Number(vocabInput.value);
    const exercises = Number(exercisesInput.value);
    goal = normalizeGoal({
      version: 1,
      vocab: Number.isFinite(vocab) ? vocab : goal.vocab,
      exercises: Number.isFinite(exercises) ? exercises : goal.exercises,
    });
    d.saveGoal(goal);
    const saved = d.loadGoal(); // 回读归一化后的目标（clamp 后的真值）
    vocabInput.value = String(saved.vocab);
    exercisesInput.value = String(saved.exercises);
    savedHint.textContent = '已保存 ✓';
    refresh();
  });

  refresh();
  grid.append(goalCard, derived);
  section.append(title, grid);
  return section;
}

function buildDonut(accuracy: number | null): SVGSVGElement {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 120 120');
  svg.classList.add('report-donut');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `总体正确率 ${pctText(accuracy)}`);

  const track = document.createElementNS(NS, 'circle');
  track.classList.add('report-donut__track');
  track.setAttribute('cx', '60');
  track.setAttribute('cy', '60');
  track.setAttribute('r', String(DONUT_RADIUS));

  const fill = document.createElementNS(NS, 'circle');
  fill.classList.add('report-donut__fill');
  fill.setAttribute('data-testid', 'accuracy-donut');
  fill.setAttribute('cx', '60');
  fill.setAttribute('cy', '60');
  fill.setAttribute('r', String(DONUT_RADIUS));
  fill.setAttribute('transform', 'rotate(-90 60 60)');
  const pct = accuracy === null ? 0 : Math.round(accuracy * 1000) / 10;
  fill.setAttribute('data-accuracy', String(pct));
  fill.setAttribute('stroke-dasharray', `${((pct / 100) * DONUT_CIRCUMFERENCE).toFixed(1)} ${DONUT_CIRCUMFERENCE.toFixed(1)}`);

  svg.append(track, fill);
  return svg;
}

function buildStatCard(opts: {
  label: string;
  value: string;
  testid: string;
  donut?: SVGSVGElement;
  link?: { href: string; text: string };
}): HTMLElement {
  const card = document.createElement('div');
  card.className = 'report-card card';

  const label = document.createElement('span');
  label.className = 'report-card__label';
  label.textContent = opts.label;

  const value = document.createElement('strong');
  value.className = 'report-card__value';
  value.setAttribute('data-testid', opts.testid);
  value.textContent = opts.value;

  card.append(label, value);
  if (opts.donut) card.append(opts.donut);
  if (opts.link) {
    const link = document.createElement('a');
    link.className = 'report-card__link';
    link.setAttribute('data-link', '');
    link.href = opts.link.href;
    link.textContent = opts.link.text;
    card.append(link);
  }
  return card;
}

function buildModuleRow(row: ModuleRow): HTMLElement {
  const item = document.createElement('article');
  item.className = 'report-row card';
  item.setAttribute('data-testid', 'module-row');
  item.dataset.module = row.module;

  const badge = document.createElement('span');
  badge.className = `module-badge module-badge--${row.module}`;
  badge.textContent = MODULE_LABEL[row.module];

  const main = document.createElement('div');
  main.className = 'report-row__main';

  const numbers = document.createElement('div');
  numbers.className = 'report-row__numbers';
  const answered = document.createElement('span');
  answered.setAttribute('data-testid', 'module-answered');
  answered.replaceChildren('练习 ', strongOf(row.answered), ' 次');
  const accuracy = document.createElement('span');
  accuracy.setAttribute('data-testid', 'module-accuracy');
  accuracy.replaceChildren('正确率 ', strongOf(pctText(row.accuracy)));
  const wrong = document.createElement('span');
  wrong.setAttribute('data-testid', 'module-wrong');
  wrong.replaceChildren('错题 ', strongOf(row.wrongCount), ' 道');
  numbers.append(answered, accuracy, wrong);

  const bar = document.createElement('div');
  bar.className = 'report-bar';
  const fill = document.createElement('div');
  fill.className = `report-bar__fill report-bar__fill--${row.module}`;
  fill.style.width = row.accuracy === null ? '0%' : `${Math.round(row.accuracy * 1000) / 10}%`;
  bar.append(fill);

  main.append(numbers, bar);

  const retry = document.createElement('a');
  retry.className = 'btn btn--ghost btn--sm';
  retry.setAttribute('data-link', '');
  retry.href = MODULE_RETRY_ROUTE[row.module];
  retry.textContent = row.answered === 0 ? '去开启' : '去练习';

  item.append(badge, main, retry);
  return item;
}

/** 单元统计行：练习/正确率/错题/词汇复习汇总（数据源含 stats.units 维度；按册分组后隶属某册） */
function buildUnitRow(row: UnitRow): HTMLElement {
  const item = document.createElement('article');
  item.className = 'report-row card';
  item.setAttribute('data-testid', 'unit-row');
  item.dataset.unit = row.unit;
  item.dataset.book = row.book;

  const badge = document.createElement('span');
  badge.className = `module-badge module-badge--${row.unit}`;
  badge.textContent = `Unit ${UNIT_META[row.unit].no} · ${UNIT_META[row.unit].title}`;

  const main = document.createElement('div');
  main.className = 'report-row__main';

  const numbers = document.createElement('div');
  numbers.className = 'report-row__numbers';
  const answered = document.createElement('span');
  answered.setAttribute('data-testid', 'unit-answered');
  answered.replaceChildren('练习 ', strongOf(row.answered), ' 次');
  const accuracy = document.createElement('span');
  accuracy.setAttribute('data-testid', 'unit-accuracy');
  accuracy.replaceChildren('正确率 ', strongOf(pctText(row.accuracy)));
  const wrong = document.createElement('span');
  wrong.setAttribute('data-testid', 'unit-wrong');
  wrong.replaceChildren('错题 ', strongOf(row.wrongCount), ' 道');
  const srs = document.createElement('span');
  srs.setAttribute('data-testid', 'unit-srs');
  srs.replaceChildren('词汇已学 ', strongOf(row.srsTotal), ' · 到期 ', strongOf(row.srsDue));
  numbers.append(answered, accuracy, wrong, srs);

  const bar = document.createElement('div');
  bar.className = 'report-bar';
  const fill = document.createElement('div');
  fill.className = `report-bar__fill report-bar__fill--${row.unit}`;
  fill.style.width = row.accuracy === null ? '0%' : `${Math.round(row.accuracy * 1000) / 10}%`;
  bar.append(fill);

  main.append(numbers, bar);

  const retry = document.createElement('a');
  retry.className = 'btn btn--ghost btn--sm';
  retry.setAttribute('data-link', '');
  retry.href = UNIT_RETRY_ROUTE[row.unit];
  retry.textContent = row.answered === 0 ? '去开启' : '去练习';

  item.append(badge, main, retry);
  return item;
}

function strongOf(text: string | number): HTMLElement {
  const el = document.createElement('strong');
  el.textContent = String(text);
  return el;
}

export function renderReport(root: HTMLElement, deps?: ReportDeps): void {
  const d: Required<ReportDeps> = {
    loadStats: deps?.loadStats ?? (() => loadStats()),
    loadWrong: deps?.loadWrong ?? (() => loadWrongBook()),
    loadProgress: deps?.loadProgress ?? (() => loadProgress()),
    now: deps?.now ?? (() => Date.now()),
    loadDaily: deps?.loadDaily ?? (() => loadDaily()),
    loadGoal: deps?.loadGoal ?? (() => loadGoal()),
    saveGoal: deps?.saveGoal ?? ((goal) => saveGoal(goal)),
  };

  const data = buildReportData(d.loadStats(), d.loadWrong(), d.loadProgress(), d.now());
  const advice = buildAdvice(data);

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="site-header__brand" href="/" data-link>高中英语学习系统</a>
      <nav class="site-header__nav">
        <a class="btn btn--ghost" href="/" data-link>首页</a>
        <a class="btn btn--ghost" href="/mistakes" data-link>错题本</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';

  const head = document.createElement('div');
  head.className = 'page-head';
  const title = document.createElement('h1');
  title.className = 'page-head__title';
  title.textContent = '学习报告';
  const spacer = document.createElement('span');
  spacer.className = 'page-head__spacer';
  const hint = document.createElement('span');
  hint.className = 'stat-chip';
  hint.textContent = '数据保存在本机 · 每次作答自动更新';
  head.append(title, spacer, hint);

  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent =
    '汇总词汇、语法、阅读、听力四个模块的练习次数与正确率、错题沉淀，以及词汇 SM-2 间隔复习的到期情况；支持按单元查看统计，并可导出 / 导入学习数据备份。';

  /* 学习计划：今日目标 / 完成度 / streak / 近 7 天活动图 */
  const planSection = buildPlanSection(d);

  /* 总览卡：总练习 / 总正确率（SVG 环）/ 错题总数 / SRS 到期 */
  const cards = document.createElement('div');
  cards.className = 'report-cards';
  cards.append(
    buildStatCard({ label: '总练习次数', value: String(data.totalAnswered), testid: 'stat-answered' }),
    buildStatCard({
      label: '总体正确率',
      value: pctText(data.overallAccuracy),
      testid: 'stat-accuracy',
      donut: buildDonut(data.overallAccuracy),
    }),
    buildStatCard({
      label: '错题总数',
      value: String(data.wrongTotal),
      testid: 'stat-wrong',
      link: { href: '/mistakes', text: '去错题本 →' },
    }),
    buildStatCard({
      label: '词汇复习到期',
      value: `${data.srsDue} / ${data.srsTotal}`,
      testid: 'stat-due',
      link: { href: '/vocabulary?tab=review', text: '去复习 →' },
    }),
  );

  /* 各模块概览 */
  const moduleSection = document.createElement('section');
  moduleSection.className = 'report-modules';
  const moduleTitle = document.createElement('h2');
  moduleTitle.className = 'section-title';
  moduleTitle.textContent = '各模块练习概览';
  const moduleList = document.createElement('div');
  moduleList.className = 'report-rows';
  for (const row of data.rows) moduleList.append(buildModuleRow(row));
  moduleSection.append(moduleTitle, moduleList);

  /* 按册 + 单元统计：七册固定分组（含空册降级提示），册内按单元展开 */
  const unitSection = document.createElement('section');
  unitSection.className = 'report-units';
  unitSection.setAttribute('data-testid', 'unit-stats');
  const unitTitle = document.createElement('h2');
  unitTitle.className = 'section-title';
  unitTitle.textContent = `按册 + 单元统计（${BOOKS.map((b) => b.label).join(' / ')}）`;
  const unitNote = document.createElement('p');
  unitNote.className = 'page-intro';
  unitNote.textContent =
    '先按册别分组，每册内再按单元汇总语法 / 阅读 / 听力 / 词汇复习的练习与错题，以及该单元词表的间隔复习进度；尚未收录单元数据的册显示占位提示，新增单元数据文件后自动出现。';
  const unitList = document.createElement('div');
  unitList.className = 'report-rows';
  for (const row of data.bookRows) {
    const group = document.createElement('div');
    group.className = 'report-book';
    group.setAttribute('data-testid', 'book-group');
    group.dataset.book = row.book;

    const groupHead = document.createElement('div');
    groupHead.className = 'report-book__head';
    const groupTitle = document.createElement('h3');
    groupTitle.className = 'report-book__title';
    groupTitle.textContent = row.label;
    const groupSummary = document.createElement('span');
    groupSummary.className = 'stat-chip';
    groupSummary.setAttribute('data-testid', 'book-summary');
    groupSummary.textContent =
      row.unitRows.length === 0
        ? '暂未收录单元'
        : `${row.unitRows.length} 个单元 · 练习 ${row.answered} 次 · 正确率 ${pctText(row.accuracy)} · 错题 ${row.wrongCount} 道`;
    groupHead.append(groupTitle, groupSummary);
    group.append(groupHead);

    if (row.unitRows.length === 0) {
      // 缺册降级：该册还没有单元数据（纯数据新增后自动出现），不崩溃、不留空白
      group.append(buildEmptyState(`${row.label} 暂未收录单元数据，新增单元数据文件（meta 的 book 写「${row.label}」）后自动出现。`, 'book-empty'));
    } else {
      for (const unitRow of row.unitRows) group.append(buildUnitRow(unitRow));
    }
    unitList.append(group);
  }
  unitSection.append(unitTitle, unitNote, unitList);

  /* 学习建议 */
  const adviceSection = document.createElement('section');
  adviceSection.className = 'report-advice';
  const adviceTitle = document.createElement('h2');
  adviceTitle.className = 'section-title';
  adviceTitle.textContent = '学习建议';
  const adviceList = document.createElement('ul');
  adviceList.setAttribute('data-testid', 'report-advice');
  for (const tip of advice) {
    const li = document.createElement('li');
    li.textContent = tip;
    adviceList.append(li);
  }
  adviceSection.append(adviceTitle, adviceList);

  /* 数据管理：导出 / 导入（导入成功后整页重渲，刷新统计） */
  const dataManagement = buildDataManagement(defaultDataManagementDeps(), {
    onImported: () => {
      root.replaceChildren();
      renderReport(root, d);
    },
  });

  page.append(head, intro, planSection, cards, moduleSection, unitSection, adviceSection, dataManagement);
  root.append(header, page);
}
