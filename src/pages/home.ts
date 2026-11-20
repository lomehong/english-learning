import { BOOK_LABELS, BOOKS, UNIT_IDS, UNIT_META, bookOfUnit, unitTitle, type BookId } from '../data/units';
import { buildBookSwitcher, buildUnitSwitcher, currentUnit } from './unit-switch';
import { buildLast7Days, computeStreak, goalCompletion, type DayActivity } from '../store/daily';
import { defaultHomeDeps, type HomeDeps } from './deps';

/** 首页：Hero 品牌区（中文衬线标题 + 教材统计）+ 全局「册 + 单元」两级切换器
 *  （localStorage + ?book=&unit= 双向同步）+ 今日进度环形 + 七大模块入口卡 */

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

export function renderHome(root: HTMLElement, deps: HomeDeps = defaultHomeDeps()): void {
  const header = document.createElement('header');
  header.className = 'site-header';
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

  page.append(hero, unitSection, today, modulesSection);

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
