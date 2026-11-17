import type { PracticeModule } from '../types';
import { loadWrongBook, type WrongBook } from '../store/wrongbook';
import { loadStats, type StatsBook } from '../store/stats';
import { loadProgress, type Progress } from '../store/progress';
import { MODULE_LABEL, MODULE_RETRY_ROUTE, pctText, type ReportDeps } from './deps';

/**
 * /report 学习报告页：汇总各模块练习次数 / 正确率 / 错题数与词汇 SRS 到期数。
 * 图表全部用纯 CSS（正确率条）+ 内联 SVG（正确率环）实现，不引第三方图表库。
 */

const MODULE_ORDER: readonly PracticeModule[] = ['vocab', 'grammar', 'reading', 'listening'];

/** 总体正确率环：viewBox 120，半径 52 */
const DONUT_RADIUS = 52;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export interface ModuleRow {
  module: PracticeModule;
  answered: number;
  correct: number;
  /** 0~1；未练习为 null */
  accuracy: number | null;
  wrongCount: number;
}

export interface ReportData {
  rows: ModuleRow[];
  totalAnswered: number;
  totalCorrect: number;
  overallAccuracy: number | null;
  wrongTotal: number;
  /** 已加入复习计划的单词数 */
  srsTotal: number;
  /** 当前到期（due <= now）应复习的单词数 */
  srsDue: number;
}

/** 数据组装（纯函数）：统计 + 错题 + 进度三源合一 */
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

  const totalAnswered = rows.reduce((n, r) => n + r.answered, 0);
  const totalCorrect = rows.reduce((n, r) => n + r.correct, 0);
  const cards = Object.values(progress.cards);

  return {
    rows,
    totalAnswered,
    totalCorrect,
    overallAccuracy: totalAnswered === 0 ? null : totalCorrect / totalAnswered,
    wrongTotal: Object.keys(book.entries).length,
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
    '汇总词汇、语法、阅读、听力四个模块的练习次数与正确率、错题沉淀，以及词汇 SM-2 间隔复习的到期情况，并给出下一步学习建议。';

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

  page.append(head, intro, cards, moduleSection, adviceSection);
  root.append(header, page);
}
