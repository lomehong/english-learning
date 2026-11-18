import { BOOK_LABELS, BOOKS, UNIT_IDS, UNIT_META, bookOfUnit, unitTitle, type BookId } from '../data/units';
import { buildBookSwitcher, buildUnitSwitcher, currentUnit } from './unit-switch';
import { computeStreak, goalCompletion } from '../store/daily';
import { defaultHomeDeps, type HomeDeps } from './deps';

/** 首页：全局「册 + 单元」两级切换器（localStorage + ?book=&unit= 双向同步）+ 模块入口 */

/** 单元号列表文案：Unit 1 / 2 / …（随自动发现的注册表扩展） */
const UNIT_NO_TEXT = UNIT_IDS.map((id) => UNIT_META[id].no).join(' / ');

/** 册别列表文案：必修一 / 必修二 / …（七册固定维度） */
const BOOK_TEXT = BOOKS.map((b) => b.label).join(' / ');

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
  page.innerHTML = `
    <h1 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);margin:var(--space-5) 0 var(--space-2);">
      高中英语学习系统 · 人教2019
    </h1>
    <p style="color:var(--color-text-secondary);margin:0 0 var(--space-3);">
      覆盖整个高中阶段：人教2019 必修一 ~ 必修三 + 选择性必修一 ~ 四共 7 册 35 单元。
      词汇 / 语法 / 阅读 / 听力 / 写作五大模块专项练习，错题自动沉淀、报告随时可查，进度保存在本机浏览器。
    </p>`;

  /* 两级切换器：第一级选册（七册），第二级选该册单元；选择写入 localStorage 并同步 ?book=&unit= */
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
  intro.style.cssText = 'color:var(--color-text-secondary);margin:0 0 var(--space-4);';
  intro.textContent = `先选册（${BOOK_TEXT}），再选该册单元：词汇 / 语法 / 阅读 / 听力 / 写作将统一跟随当前册 + 单元（选择保存在本机，并同步到地址栏 ?book=&unit=；尚未收录单元的册先显示空态，后续新增数据文件即自动出现）。`;

  /* 今日进度 + streak 徽标（数据源：每日活动/目标 localStorage；点徽标去学习报告调整目标） */
  const today = document.createElement('div');
  today.className = 'home-today card';
  today.setAttribute('data-testid', 'home-today');

  const goal = deps.loadGoal();
  const daily = deps.loadDaily();
  const now = deps.now();
  const completion = goalCompletion(goal, daily, now);
  const streak = computeStreak(daily, now);
  const goalTotal = goal.vocab + goal.exercises;

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

  today.append(progressChip, streakBadge);

  const grid = document.createElement('div');
  grid.className = 'module-grid';
  grid.innerHTML = `
    <a class="module-card" href="/vocabulary" data-link>
      <h2 class="module-card__title">📚 词汇</h2>
      <p class="module-card__desc">Unit ${UNIT_NO_TEXT} 词表学习（翻面卡）与四档间隔复习</p>
    </a>
    <a class="module-card" href="/grammar" data-link>
      <h2 class="module-card__title">📖 语法</h2>
      <p class="module-card__desc">每单元两个语法点讲解 + 10 题专项练习（即时判分/错题入本）</p>
    </a>
    <a class="module-card" href="/reading" data-link>
      <h2 class="module-card__title">📄 阅读</h2>
      <p class="module-card__desc">每单元主题短文 ×2：阅读理解即时判分，生词一点收进词汇本</p>
    </a>
    <a class="module-card" href="/listening" data-link>
      <h2 class="module-card__title">🎧 听力</h2>
      <p class="module-card__desc">每单元主题材料 ×2：浏览器本地朗读，语速可调，答题即时判分</p>
    </a>
    <a class="module-card" href="/writing" data-link>
      <h2 class="module-card__title">✍️ 写作</h2>
      <p class="module-card__desc">每单元主题写作 ×2：范文对照 + 自评清单，草稿自动保存</p>
    </a>
    <a class="module-card" href="/mistakes" data-link>
      <h2 class="module-card__title">📝 错题本</h2>
      <p class="module-card__desc">四模块错题汇总：按模块过滤、逐条移除、去重练</p>
    </a>
    <a class="module-card" href="/report" data-link>
      <h2 class="module-card__title">📊 学习报告</h2>
      <p class="module-card__desc">按册 + 单元统计 / 错题 / 复习到期与学习建议，支持数据导出导入</p>
    </a>`;

  page.append(unitHead, intro, today, grid);
  // 模块入口统一由 router 的 <a data-link> 拦截跳转
  root.append(header, page);
  syncUnitHint();
}
