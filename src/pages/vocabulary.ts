import { BOOK_LABELS, UNIT_META, unitTitle } from '../data/units';
import { loadProgress, saveProgress } from '../store/progress';
import { renderLearn } from './learn';
import { renderReview } from './review';
import { buildUnitBadge, currentUnit } from './unit-switch';
import type { VocabDeps } from './deps';

type Tab = 'learn' | 'review';

function currentTab(): Tab {
  return new URLSearchParams(location.search).get('tab') === 'review' ? 'review' : 'learn';
}

/** /vocabulary 页：跟随全局单元（首页切换）+ 学习 / 复习 双 Tab 容器（?tab= 可直链） */
export function renderVocabulary(root: HTMLElement): void {
  const deps: VocabDeps = {
    load: () => loadProgress(),
    save: (p) => saveProgress(p),
    now: () => Date.now(),
  };

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="site-header__brand" href="/" data-link>高一英语学习系统</a>
      <nav class="site-header__nav">
        <a class="btn btn--ghost" href="/" data-link>首页</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';

  const head = document.createElement('div');
  head.className = 'page-head';

  const title = document.createElement('h1');
  title.className = 'page-head__title';

  // 全局单元：首页切换器维护（localStorage + ?unit=），此处只读取
  const unit = currentUnit();
  const unitBadge = buildUnitBadge(unit);

  const tabs = document.createElement('div');
  tabs.className = 'tabs';
  tabs.setAttribute('role', 'tablist');

  const learnTab = document.createElement('button');
  learnTab.type = 'button';
  learnTab.className = 'tab';
  learnTab.setAttribute('role', 'tab');
  learnTab.textContent = '📖 学习';

  const reviewTab = document.createElement('button');
  reviewTab.type = 'button';
  reviewTab.className = 'tab';
  reviewTab.setAttribute('role', 'tab');
  reviewTab.textContent = '🔁 复习';

  tabs.append(learnTab, reviewTab);
  head.append(title, unitBadge, tabs);
  head.insertAdjacentHTML(
    'beforeend',
    '<span class="page-head__spacer"></span><span class="stat-chip" data-testid="storage-hint">进度自动保存在本机</span>',
  );

  const content = document.createElement('div');
  content.style.marginTop = 'var(--space-5)';

  function syncTitle(): void {
    const meta = UNIT_META[unit];
    title.textContent = `词汇 · ${BOOK_LABELS[meta.book]} ${unitTitle(unit)}（${meta.titleZh}）`;
  }

  function tabUrl(tab: Tab): string {
    const params = new URLSearchParams(location.search);
    if (tab === 'review') params.set('tab', 'review');
    else params.delete('tab');
    const qs = params.toString();
    return qs ? `/vocabulary?${qs}` : '/vocabulary';
  }

  function showTab(tab: Tab): void {
    try {
      history.replaceState(null, '', tabUrl(tab));
    } catch {
      /* file:// 等环境忽略 */
    }
    learnTab.classList.toggle('tab--active', tab === 'learn');
    reviewTab.classList.toggle('tab--active', tab === 'review');
    learnTab.setAttribute('aria-selected', String(tab === 'learn'));
    reviewTab.setAttribute('aria-selected', String(tab === 'review'));
    if (tab === 'learn') {
      renderLearn(content, deps, { gotoReview: () => showTab('review'), unit });
    } else {
      renderReview(content, deps, { gotoLearn: () => showTab('learn') });
    }
  }

  learnTab.addEventListener('click', () => showTab('learn'));
  reviewTab.addEventListener('click', () => showTab('review'));

  page.append(head, content);
  root.append(header, page);
  syncTitle();
  showTab(currentTab());
}
