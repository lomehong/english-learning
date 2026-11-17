import { UNIT_IDS, UNIT_META, unitTitle } from '../data/units';
import { buildUnitSwitcher } from './unit-switch';

/** 首页：全局单元切换器（localStorage + ?unit= 双向同步）+ 模块入口 */

/** 单元号列表文案：Unit 1 / 2 / …（随自动发现的注册表扩展） */
const UNIT_NO_TEXT = UNIT_IDS.map((id) => UNIT_META[id].no).join(' / ');

export function renderHome(root: HTMLElement): void {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <span class="site-header__brand">高一英语学习系统</span>
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
      高一英语学习系统 · 人教2019
    </h1>
    <p style="color:var(--color-text-secondary);margin:0 0 var(--space-3);">
      词汇 / 语法 / 阅读 / 听力 / 写作五大模块专项练习，错题自动沉淀、报告随时可查，进度保存在本机浏览器。
    </p>`;

  /* 全局单元切换器：选择写入 localStorage 并同步 ?unit=，各模块页按此全局单元取数 */
  const unitHead = document.createElement('div');
  unitHead.className = 'page-head';
  const unitLabel = document.createElement('span');
  unitLabel.className = 'stat-chip';
  unitLabel.setAttribute('data-testid', 'unit-hint');
  const switcher = buildUnitSwitcher(() => {
    syncUnitHint();
  });
  const spacer = document.createElement('span');
  spacer.className = 'page-head__spacer';
  unitHead.append(switcher.el, spacer, unitLabel);

  function syncUnitHint(): void {
    unitLabel.textContent = `当前单元 ${unitTitle(switcher.get())}（${UNIT_META[switcher.get()].titleZh}）· 各模块自动跟随`;
  }

  const intro = document.createElement('p');
  intro.style.cssText = 'color:var(--color-text-secondary);margin:0 0 var(--space-4);';
  intro.textContent = `在这里选择单元后，词汇 / 语法 / 阅读 / 听力 / 写作将统一切换到该单元（选择保存在本机，并同步到地址栏 ?unit=）。`;

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
      <p class="module-card__desc">模块与按单元统计 / 错题 / 复习到期与学习建议，支持数据导出导入</p>
    </a>`;

  page.append(unitHead, intro, grid);
  // 模块入口统一由 router 的 <a data-link> 拦截跳转
  root.append(header, page);
  syncUnitHint();
}
