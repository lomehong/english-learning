import type { PracticeModule, WrongEntry } from '../types';
import { UNIT_IDS, UNIT_META, type UnitId } from '../data/units';
import { getWordUnit } from '../data/words';
import { loadWrongBook, type WrongBook } from '../store/wrongbook';
import { loadStats, PRACTICE_MODULES, type StatsBook } from '../store/stats';
import { loadProgress, type Progress } from '../store/progress';
import { MODULE_LABEL, MODULE_RETRY_ROUTE, pctText, type ReportDeps } from './deps';
import { buildDataManagement, defaultDataManagementDeps } from './data-management';

/**
 * /report 学习报告页：汇总各模块练习次数 / 正确率 / 错题数与词汇 SRS 到期数，
 * 并提供按单元统计维度与数据导出/导入。
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

export interface ReportData {
  rows: ModuleRow[];
  unitRows: UnitRow[];
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
      answered,
      correct,
      accuracy: answered === 0 ? null : correct / answered,
      wrongCount: entries.filter((e) => entryUnit(e) === unit).length,
      srsTotal: srsCards.length,
      srsDue: srsCards.filter((c) => c.due <= now).length,
    };
  });

  const totalAnswered = rows.reduce((n, r) => n + r.answered, 0);
  const totalCorrect = rows.reduce((n, r) => n + r.correct, 0);
  const cards = Object.values(progress.cards);

  return {
    rows,
    unitRows,
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

/** 单元统计行：练习/正确率/错题/词汇复习汇总（数据源含 stats.units 维度） */
function buildUnitRow(row: UnitRow): HTMLElement {
  const item = document.createElement('article');
  item.className = 'report-row card';
  item.setAttribute('data-testid', 'unit-row');
  item.dataset.unit = row.unit;

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
  const d: ReportDeps = deps ?? {
    loadStats: () => loadStats(),
    loadWrong: () => loadWrongBook(),
    loadProgress: () => loadProgress(),
    now: () => Date.now(),
  };

  const data = buildReportData(d.loadStats(), d.loadWrong(), d.loadProgress(), d.now());
  const advice = buildAdvice(data);

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="site-header__brand" href="/" data-link>高一英语学习系统</a>
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

  /* 按单元统计 */
  const unitSection = document.createElement('section');
  unitSection.className = 'report-units';
  unitSection.setAttribute('data-testid', 'unit-stats');
  const unitTitle = document.createElement('h2');
  unitTitle.className = 'section-title';
  unitTitle.textContent = `按单元统计（Unit ${UNIT_IDS.map((id) => UNIT_META[id].no).join(' / ')}）`;
  const unitNote = document.createElement('p');
  unitNote.className = 'page-intro';
  unitNote.textContent =
    '每个单元汇总语法 / 阅读 / 听力 / 词汇复习的练习与错题，以及该单元词表的间隔复习进度；统计自单元维度上线后开始累积。';
  const unitList = document.createElement('div');
  unitList.className = 'report-rows';
  for (const row of data.unitRows) unitList.append(buildUnitRow(row));
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

  page.append(head, intro, cards, moduleSection, unitSection, adviceSection, dataManagement);
  root.append(header, page);
}
