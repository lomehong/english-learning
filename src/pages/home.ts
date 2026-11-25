import { BOOK_LABELS, BOOKS, UNIT_IDS, UNIT_META, bookOfUnit, unitTitle, type BookId } from '../data/units';
import { buildBookSwitcher, buildUnitSwitcher, currentUnit } from './unit-switch';
import {
  buildLast7Days,
  computeStreak,
  goalCompletion,
  loadDaily,
  loadGoal,
  todayCounters,
  type DailyActivity,
  type DailyGoal,
  type DayActivity,
} from '../store/daily';
import { defaultHomeDeps, type HomeDeps } from './deps';

/** 首页：Hero 品牌区（中文衬线标题 + 教材统计）+ 全局「册 + 单元」两级切换器
 *  （localStorage + ?book=&unit= 双向同步）+ 今日挑战卡（空态 / 非空态互斥）
 *  + 今日进度环形 + v2 对话式陪学入口横幅 + 七大模块入口卡 */

/** 册别列表文案：必修一 / 必修二 / …（七册固定维度） */
const BOOK_TEXT = BOOKS.map((b) => b.label).join(' / ');

/** 七大模块入口：编号 + 图标 + 标题 + 描述（入口箭头由样式层追加） */
const MODULES = [
  {
    no: '01',
    icon: '📚',
    title: '词汇',
    href: '/vocabulary',
    desc: `${BOOKS.length} 册 · ${UNIT_IDS.length} 单元词表学习（翻面卡）与四档间隔复习`,
  },
  {
    no: '02',
    icon: '📖',
    title: '语法',
    href: '/grammar',
    desc: '每单元两个语法点讲解 + 10 题专项练习（即时判分/错题入本）',
  },
  {
    no: '03',
    icon: '📄',
    title: '阅读',
    href: '/reading',
    desc: '每单元主题短文 ×2：阅读理解即时判分，生词一点收进词汇本',
  },
  {
    no: '04',
    icon: '🎧',
    title: '听力',
    href: '/listening',
    desc: '每单元主题材料 ×2：浏览器本地朗读，语速可调，答题即时判分',
  },
  {
    no: '05',
    icon: '✍️',
    title: '写作',
    href: '/writing',
    desc: '每单元主题写作 ×2：范文对照 + 自评清单，草稿自动保存',
  },
  {
    no: '06',
    icon: '📝',
    title: '错题本',
    href: '/mistakes',
    desc: '四模块错题汇总：按模块过滤、逐条移除、去重练',
  },
  {
    no: '07',
    icon: '📊',
    title: '学习报告',
    href: '/report',
    desc: '按册 + 单元统计 / 错题 / 复习到期与学习建议，支持数据导出导入',
  },
] as const;

/* -------------------- 今日挑战：数据适配与状态计算（纯函数，可单测） --------------------
 * 数据来源只读现有 store（每日目标 + 每日活动，两份 localStorage 约定键），
 * 不新增接口 / 网络请求 / 依赖；本层不触碰 DOM，也不改变页面挂载。
 * 管线：getTodayChallengeSnapshot（读数据，异常 → null）→ normalizeTodayChallenge（归一化）
 *       → buildTodayChallengeViewModel（空态 / 百分比 / 转义后的文案与 stats）。 */

/** 今日挑战原始数据（来自 store/localStorage 的未信任数据；字段可能缺失或类型错误） */
export interface TodayChallengeRaw {
  completedCount?: unknown;
  totalCount?: unknown;
  /** 键值统计（对象或键值对数组，类型未信任） */
  stats?: unknown;
}

/** 今日挑战单个「键：值」统计项（label / value 均为字符串，展示层负责转义） */
export interface TodayChallengeStat {
  label: string;
  value: string;
}

/** 归一化后的今日挑战：计数为非负数值，stats 为键值字符串列表 */
export interface TodayChallenge {
  completedCount: number;
  totalCount: number;
  stats: TodayChallengeStat[];
}

/** 今日挑战视图模型：空态 / 百分比 / 进度文案 / 已转义的 stats */
export interface TodayChallengeViewModel {
  empty: boolean;
  /** 0 ~ 100 整数；空态为 0 */
  percent: number;
  /** 非空态「今日挑战进度 N%」；空态为空串 */
  progressText: string;
  completedCount: number;
  totalCount: number;
  /** label / value 已做 HTML 转义 */
  stats: TodayChallengeStat[];
}

/** 读数接缝（测试可注入假 store；默认走现有 store 的真实 localStorage 读取） */
export interface TodayChallengeDeps {
  loadDaily?: () => DailyActivity;
  loadGoal?: () => DailyGoal;
  now?: () => number;
}

/**
 * 今日挑战原始快照：只读现有 store（每日活动 + 每日目标），异常一律返回 null。
 * 不发起任何网络请求，也不写入 localStorage。
 */
export function getTodayChallengeSnapshot(deps: TodayChallengeDeps = {}): TodayChallengeRaw | null {
  try {
    const now = deps.now ? deps.now() : Date.now();
    const daily = deps.loadDaily ? deps.loadDaily() : loadDaily();
    const goal = deps.loadGoal ? deps.loadGoal() : loadGoal();
    const today = todayCounters(daily, now);
    return {
      completedCount: today.vocab + today.exercises,
      totalCount: goal.vocab + goal.exercises,
      stats: [
        { label: '词汇', value: `${today.vocab}/${goal.vocab}` },
        { label: '练习', value: `${today.exercises}/${goal.exercises}` },
      ],
    };
  } catch {
    // 读取异常（存储不可用 / 注入 loader 抛错）→ 上层按空态处理
    return null;
  }
}

/** 非负数值归一化：负数 / 非数字 / 空串 / NaN / Infinity → 0；数字字符串按数字解析 */
export function toNonNegativeNumber(value: unknown): number {
  let n: number;
  if (typeof value === 'number') n = value;
  else if (typeof value === 'string' && value.trim() !== '') n = Number(value);
  else n = Number.NaN;
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n;
}

/** HTML 转义（单趟替换，避免二次转义）：& < > " '；null/undefined → 空串 */
const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]!);
}

/** 统计值文本化：数字/字符串/布尔保留，其余（null / 对象 / NaN / Infinity）→ 空串 */
function statText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '';
  if (typeof value === 'boolean') return String(value);
  return '';
}

/**
 * stats 归一化：对象 → 逐项 {label: 键, value: 值}；数组支持 [键, 值] 对、
 * {label/key/name, value} 对象与裸字符串（label 为空）；空项丢弃。
 */
function normalizeStats(raw: unknown): TodayChallengeStat[] {
  const stats: TodayChallengeStat[] = [];
  if (Array.isArray(raw)) {
    for (const entry of raw) {
      if (Array.isArray(entry)) {
        const label = statText(entry[0]);
        const value = statText(entry[1]);
        if (label === '' && value === '') continue;
        stats.push({ label, value });
      } else if (typeof entry === 'object' && entry !== null) {
        const e = entry as Record<string, unknown>;
        const label = statText(e.label ?? e.key ?? e.name);
        const value = statText(e.value);
        if (label === '' && value === '') continue;
        stats.push({ label, value });
      } else {
        const value = statText(entry);
        if (value === '') continue;
        stats.push({ label: '', value });
      }
    }
    return stats;
  }
  if (typeof raw === 'object' && raw !== null) {
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      const label = statText(key);
      if (label === '') continue;
      stats.push({ label, value: statText(value) });
    }
  }
  return stats;
}

/**
 * 今日挑战归一化（纯函数）：raw 为 null/undefined（或非对象）→ null（空态）；
 * 计数经 toNonNegativeNumber 收敛，stats 归一化为键值字符串列表。
 */
export function normalizeTodayChallenge(raw: unknown): TodayChallenge | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'object') return null;
  const v = raw as TodayChallengeRaw;
  return {
    completedCount: toNonNegativeNumber(v.completedCount),
    totalCount: toNonNegativeNumber(v.totalCount),
    stats: normalizeStats(v.stats),
  };
}

/**
 * 今日挑战视图模型（纯函数）：
 * - 空态：raw 为 null/undefined、读取异常（快照返回 null）、completedCount<=0、totalCount<=0；
 * - 非空：N = clamp(round(completedCount / totalCount * 100), 1, 100)，
 *   progressText =「今日挑战进度 N%」；
 * - stats 键与值均做 HTML 转义（空态也返回已归一化并转义的 stats）。
 */
export function buildTodayChallengeViewModel(raw: unknown): TodayChallengeViewModel {
  const normalized = normalizeTodayChallenge(raw);
  const stats = (normalized?.stats ?? []).map((stat) => ({
    label: escapeHtml(stat.label),
    value: escapeHtml(stat.value),
  }));
  const completedCount = normalized?.completedCount ?? 0;
  const totalCount = normalized?.totalCount ?? 0;

  if (normalized === null || completedCount <= 0 || totalCount <= 0) {
    return { empty: true, percent: 0, progressText: '', completedCount, totalCount, stats };
  }

  const percent = Math.min(100, Math.max(1, Math.round((completedCount / totalCount) * 100)));
  return {
    empty: false,
    percent,
    progressText: `今日挑战进度 ${percent}%`,
    completedCount,
    totalCount,
    stats,
  };
}

/** 空态文案：与需求逐字一致，同时作为整卡链接的可访问名称 */
export const TODAY_CHALLENGE_EMPTY_TEXT = '今天还没有学习记录，去词汇模块开始吧';

/** 非空态卡片标题 */
export const TODAY_CHALLENGE_TITLE = '今日挑战';

/**
 * 渲染「今日挑战」卡的 HTML 字符串（section.today-challenge[data-testid=today-challenge-card]）。
 * - 空态：整卡唯一子节点为原生 a.today-challenge__empty-link（href=/vocabulary），
 *   不渲染进度文案与统计；
 * - 非空态：标题 + 进度文案 + ul.today-challenge__stats 统计列表，不生成整卡链接。
 * 两态由视图模型的 empty 单一分支互斥；百分比与统计值直接取自计算层，渲染层不重复实现口径。
 */
export function renderTodayChallengeCard(view: TodayChallengeViewModel): string {
  if (view.empty) {
    // 空态整卡即原生链接：a 以块级铺满卡片（复用 home-section 的留白），
    // 点击 / Tab 聚焦落在链接上即可去词汇模块开始学习。
    return `<section class="today-challenge today-challenge--empty card" data-testid="today-challenge-card" data-state="empty" style="margin-bottom:var(--space-5)"><a class="today-challenge__empty-link home-section" href="/vocabulary" data-link data-testid="today-challenge-empty-link" aria-label="${TODAY_CHALLENGE_EMPTY_TEXT}" style="display:block;margin:0;border-radius:inherit;color:inherit;text-decoration:none">${TODAY_CHALLENGE_EMPTY_TEXT}</a></section>`;
  }

  const stats = view.stats
    .map(
      (stat) => `
        <li class="today-challenge__stat">
          <span class="today-challenge__stat-label">${stat.label}</span>
          <span class="today-challenge__stat-value">${stat.value}</span>
        </li>`,
    )
    .join('');

  return `
    <section class="today-challenge home-section card" data-testid="today-challenge-card" data-state="active">
      <div class="today-challenge__head">
        <h2 class="today-challenge__title home-section__title">${TODAY_CHALLENGE_TITLE}</h2>
        <p class="today-challenge__progress" data-testid="today-challenge-progress">${view.progressText}</p>
      </div>
      <ul class="today-challenge__stats" data-testid="today-challenge-stats">${stats}</ul>
    </section>`;
}

/** 把渲染字符串挂成 DOM 节点（首页挂载用） */
export function buildTodayChallengeCard(view: TodayChallengeViewModel): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = renderTodayChallengeCard(view);
  return host.firstElementChild as HTMLElement;
}

export function renderHome(root: HTMLElement, deps: HomeDeps = defaultHomeDeps()): void {
  const header = document.createElement('header');
  // site-header--home：360px 窄屏「让位横带」修复只命中首页页头（见 base.css ≤40rem 档）
  header.className = 'site-header site-header--home';
  header.innerHTML = `
    <div class="site-header__inner">
      <span class="site-header__brand">高中英语学习系统</span>
      <nav class="site-header__nav">
        <a class="btn btn--ghost" href="/vocabulary" data-link>词汇</a>
        <a class="btn btn--ghost" href="/grammar" data-link>语法</a>
        <a class="btn btn--ghost" href="/reading" data-link>阅读</a>
        <a class="btn btn--ghost" href="/listening" data-link>听力</a>
        <a class="btn btn--ghost" href="/writing" data-link>写作</a>
        <a class="btn btn--ghost" href="/mistakes" data-link>错题本</a>
        <a class="btn btn--ghost" href="/report" data-link>学习报告</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';

  /* ---- Hero 分区：品牌大标题（中文衬线层级）+ 教材统计 ---- */
  const hero = document.createElement('section');
  hero.className = 'home-hero card';
  hero.innerHTML = `
    <span class="home-hero__kicker">校本同步 · 离线自学 · 数据留在本机</span>
    <h1 class="home-hero__title">高中英语学习系统<span class="home-hero__edition">人教2019 · 必修 + 选择性必修</span></h1>
    <p class="home-hero__lead">
      覆盖整个高中阶段：人教2019 必修一 ~ 必修三 + 选择性必修一 ~ 四共 7 册 35 单元。
      词汇 / 语法 / 阅读 / 听力 / 写作五大模块专项练习，错题自动沉淀、报告随时可查，进度保存在本机浏览器。
    </p>
    <div class="home-hero__stats">
      <div class="hero-stat">
        <span class="hero-stat__value">${BOOKS.length}</span>
        <span class="hero-stat__label">册教材 · 七册固定维度</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat__value">${UNIT_IDS.length}</span>
        <span class="hero-stat__label">已收录单元 · 随数据扩充</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat__value">5</span>
        <span class="hero-stat__label">专项模块 · 练习即时判分</span>
      </div>
      <div class="hero-stat">
        <span class="hero-stat__value">4</span>
        <span class="hero-stat__label">档间隔复习 · SM-2 调度</span>
      </div>
    </div>`;

  /* ---- 两级切换器：第一级选册（七册），第二级选该册单元；选择写入 localStorage 并同步 ?book=&unit= ---- */
  const unitSection = document.createElement('section');
  unitSection.className = 'home-section card';
  const unitSectionTitle = document.createElement('h2');
  unitSectionTitle.className = 'home-section__title';
  unitSectionTitle.textContent = '选择当前单元';

  const unitHead = document.createElement('div');
  unitHead.className = 'page-head';
  const unitLabel = document.createElement('span');
  unitLabel.className = 'stat-chip';
  unitLabel.setAttribute('data-testid', 'unit-hint');

  const switchGroup = document.createElement('div');
  switchGroup.className = 'unit-switch-group';
  const unitHost = document.createElement('div');
  const bookSwitcher = buildBookSwitcher((book) => {
    mountUnitSwitcher(book); // 册切换 → 第二级单元列表整体重建为该册单元
    syncUnitHint();
  });

  function mountUnitSwitcher(book: BookId): void {
    const unitSwitcher = buildUnitSwitcher(book, () => {
      syncUnitHint();
    });
    unitHost.replaceChildren(unitSwitcher.el);
  }

  mountUnitSwitcher(bookSwitcher.get());
  switchGroup.append(bookSwitcher.el, unitHost);

  const spacer = document.createElement('span');
  spacer.className = 'page-head__spacer';
  unitHead.append(switchGroup, spacer, unitLabel);

  function syncUnitHint(): void {
    const unit = currentUnit();
    const meta = UNIT_META[unit];
    if (bookOfUnit(unit) !== bookSwitcher.get()) {
      // 空册降级：该册暂无单元数据，各模块沿用最近一个有效单元
      unitLabel.textContent = `当前 ${BOOK_LABELS[bookSwitcher.get()]} · 暂未收录单元（各模块暂沿 ${unitTitle(unit)}）`;
      return;
    }
    unitLabel.textContent = `当前 ${BOOK_LABELS[meta.book]} ${unitTitle(unit)}（${meta.titleZh}）· 各模块自动跟随`;
  }

  const intro = document.createElement('p');
  intro.className = 'home-section__hint';
  intro.style.cssText = 'color:var(--color-text-secondary);margin:0 0 var(--space-2);';
  intro.textContent = `先选册（${BOOK_TEXT}），再选该册单元：词汇 / 语法 / 阅读 / 听力 / 写作将统一跟随当前册 + 单元（选择保存在本机，并同步到地址栏 ?book=&unit=；尚未收录单元的册先显示空态，后续新增数据文件即自动出现）。`;
  unitSection.append(unitSectionTitle, unitHead, intro);

  /* ---- 今日进度环形 + streak 徽标（数据源：每日活动/目标 localStorage；点徽标去学习报告调整目标） ---- */
  const today = document.createElement('section');
  today.className = 'home-today card';
  today.setAttribute('data-testid', 'home-today');

  const goal = deps.loadGoal();
  const daily = deps.loadDaily();
  const now = deps.now();

  /* ---- 今日挑战卡：数据适配 + 视图模型（纯函数）→ 空态 / 非空态互斥渲染 ----
   * 复用本次已读取的今日活动 / 目标 / 时间，避免同页重复读存储造成口径漂移。 */
  const challenge = buildTodayChallengeCard(
    buildTodayChallengeViewModel(
      getTodayChallengeSnapshot({ loadDaily: () => daily, loadGoal: () => goal, now: () => now }),
    ),
  );

  const completion = goalCompletion(goal, daily, now);
  const streak = computeStreak(daily, now);
  const goalTotal = goal.vocab + goal.exercises;
  /* 环形进度按 0~1 裁剪，避免异常数据撑爆圆环 */
  const ratio = Math.min(Math.max(completion.overall, 0), 1);

  const RING_R = 30;
  const RING_C = 2 * Math.PI * RING_R;

  const todayRing = document.createElement('div');
  todayRing.className = 'home-today__ring';
  todayRing.setAttribute('aria-hidden', 'true');
  todayRing.innerHTML = `
    <svg class="home-ring" viewBox="0 0 72 72">
      <circle class="home-ring__track" cx="36" cy="36" r="${RING_R}"></circle>
      <circle
        class="home-ring__fill"
        cx="36"
        cy="36"
        r="${RING_R}"
        stroke-dasharray="${(ratio * RING_C).toFixed(1)} ${RING_C.toFixed(1)}"
      ></circle>
    </svg>
    <span class="home-today__pct">${Math.round(ratio * 100)}<small>%</small></span>`;

  const progressChip = document.createElement('span');
  progressChip.className = 'stat-chip';
  progressChip.setAttribute('data-testid', 'home-today-progress');
  const strong = document.createElement('strong');
  strong.textContent = `${completion.vocab + completion.exercises}/${goalTotal}`;
  progressChip.append('今日 ', strong, `（${Math.round(completion.overall * 1000) / 10}%）`, `· 词汇 ${completion.vocab}/${goal.vocab} · 练习 ${completion.exercises}/${goal.exercises}`);
  if (completion.done) progressChip.append(' · 目标已达成 ✓');

  const streakBadge = document.createElement('a');
  streakBadge.className = 'streak-badge';
  streakBadge.setAttribute('data-testid', 'home-streak');
  streakBadge.setAttribute('data-link', '');
  streakBadge.href = '/report';
  streakBadge.textContent = `🔥 连续 ${streak} 天`;

  const todayMain = document.createElement('div');
  todayMain.className = 'home-today__main';
  const todayTitle = document.createElement('h2');
  todayTitle.className = 'home-today__title';
  todayTitle.textContent = '今日进度';
  const todaySub = document.createElement('p');
  todaySub.className = 'home-today__sub';
  todaySub.textContent = '每日目标可在学习报告页调整；点下方近 7 天节点查看当天完成数，点火焰徽标看连续天数。';
  todayMain.append(todayTitle, progressChip, todaySub, streakBadge);

  today.append(todayRing, todayMain);

  /* ---- 近 7 天活动（今日进度卡内）：7 天是否有学习记录一屏可见，
   *      点击某天就地（卡内）显示该天词汇/练习完成数，今天节点带「今」标记 ---- */
  const week = buildLast7Days(daily, now);

  const weekWrap = document.createElement('div');
  weekWrap.className = 'home-week';
  weekWrap.setAttribute('data-testid', 'home-week');

  const weekHead = document.createElement('div');
  weekHead.className = 'home-week__head';
  const weekTitle = document.createElement('h3');
  weekTitle.className = 'home-week__title';
  weekTitle.textContent = '近 7 天活动';
  const weekHint = document.createElement('span');
  weekHint.className = 'home-week__hint';
  weekHint.textContent = '点某天查看当天完成数';
  weekHead.append(weekTitle, weekHint);

  const weekDays = document.createElement('div');
  weekDays.className = 'home-week__days';

  const weekDetail = document.createElement('p');
  weekDetail.className = 'home-week__detail';
  weekDetail.setAttribute('data-testid', 'home-week-detail');

  /** 日期短文案：1月18日（今天前缀「今天 · 」） */
  function dayText(day: DayActivity): string {
    const [, month, date] = day.key.split('-');
    return `${day.isToday ? '今天 · ' : ''}${Number(month)}月${Number(date)}日`;
  }

  /** 卡内详情：该天词汇/练习完成数（无记录显示 0） */
  function renderWeekDetail(day: DayActivity): void {
    weekDetail.dataset.day = day.key;
    weekDetail.textContent = `${dayText(day)}：词汇 ${day.vocab} · 练习 ${day.exercises}${day.total > 0 ? '' : '（无学习记录）'}`;
  }

  const dayButtons: HTMLButtonElement[] = [];
  let selected = week[week.length - 1]!; // 升序末位 = 今天，默认选中

  function syncSelected(): void {
    for (const button of dayButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.day === selected.key));
    }
  }

  for (const day of week) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'home-week__day';
    button.setAttribute('data-testid', 'home-week-day');
    button.dataset.day = day.key;
    button.dataset.count = String(day.total);
    button.dataset.today = String(day.isToday);
    button.dataset.active = String(day.total > 0);
    button.title = `${day.key} · 词汇 ${day.vocab} · 练习 ${day.exercises}`;
    button.setAttribute(
      'aria-label',
      `${dayText(day)}：词汇 ${day.vocab}，练习 ${day.exercises}${day.total > 0 ? '' : '，无学习记录'}`,
    );

    const dot = document.createElement('span');
    dot.className = 'home-week__dot';
    dot.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.className = 'home-week__label';
    label.textContent = day.isToday ? '今' : day.label;
    button.append(dot, label);

    button.addEventListener('click', () => {
      selected = day;
      renderWeekDetail(day);
      syncSelected();
    });

    dayButtons.push(button);
    weekDays.append(button);
  }

  renderWeekDetail(selected);
  syncSelected();
  weekWrap.append(weekHead, weekDays, weekDetail);

  today.append(weekWrap);

  /* ---- v2 对话式陪学入口（横幅卡）：链到 /v2 对话壳，
   *      未配置模型自动降级离线陪学，页面永远可用（能力文案与壳层实际行为一致） ---- */
  const v2Entry = document.createElement('a');
  v2Entry.className = 'home-v2 card';
  v2Entry.setAttribute('data-testid', 'home-v2-entry');
  v2Entry.setAttribute('data-link', '');
  v2Entry.href = '/v2';
  v2Entry.innerHTML = `
    <div class="home-v2__body">
      <span class="home-v2__badge">v2 尝鲜</span>
      <h2 class="home-v2__title">对话式陪学</h2>
      <p class="home-v2__desc">
        与 AI 老师对话学英语：消息流提问 + 快捷指令一点即练，回复可带交互练习组件；
        未配置模型自动降级离线陪学（离线也能用），页内随时配置 OpenAI 兼容模型接入远程 AI。
      </p>
    </div>
    <span class="home-v2__go">进入对话<span class="home-v2__arrow" aria-hidden="true">→</span></span>`;

  /* ---- 七大模块入口：编号 + 图标 + 描述 + 入口箭头 ---- */
  const modulesSection = document.createElement('section');
  modulesSection.className = 'home-modules';
  const modulesTitle = document.createElement('h2');
  modulesTitle.className = 'home-section__title';
  modulesTitle.textContent = '七大模块入口';
  const grid = document.createElement('div');
  grid.className = 'module-grid';
  grid.innerHTML = MODULES.map(
    (m) => `
    <a class="module-card" href="${m.href}" data-link>
      <span class="module-card__no" aria-hidden="true">${m.no}</span>
      <span class="module-card__icon" aria-hidden="true">${m.icon}</span>
      <h2 class="module-card__title">${m.title}</h2>
      <p class="module-card__desc">${m.desc}</p>
      <span class="module-card__go">进入<span class="module-card__arrow" aria-hidden="true">→</span></span>
    </a>`,
  ).join('');
  modulesSection.append(modulesTitle, grid);

  page.append(hero, unitSection, challenge, today, v2Entry, modulesSection);

  /* 页脚：单行版本标记（静态文案，测试以其为锚点做回归） */
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.setAttribute('data-testid', 'footer-version');
  footer.style.cssText =
    'max-width:var(--page-max-width);margin:0 auto;padding:var(--space-3) var(--space-4);' +
    'border-top:1px solid var(--color-border);color:var(--color-text-secondary);font-size:var(--font-size-sm);';
  footer.textContent = '高中英语学习系统 · v2026.11';

  // 模块入口统一由 router 的 <a data-link> 拦截跳转
  root.append(header, page, footer);
  syncUnitHint();
}
