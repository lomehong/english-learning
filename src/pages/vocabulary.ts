import { loadProgress, saveProgress } from '../store/progress';
import { renderLearn } from './learn';
import { renderReview } from './review';
import type { VocabDeps } from './deps';

type Tab = 'learn' | 'review';

function currentTab(): Tab {
  return new URLSearchParams(location.search).get('tab') === 'review' ? 'review' : 'learn';
}

/** /vocabulary 页：学习 / 复习 双 Tab 容器（?tab=learn|review 可直链） */
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
  head.innerHTML = `<h1 class="page-head__title">词汇 · 必修一 Unit 1 Teenage Life</h1>`;

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
  head.append(tabs);
  head.insertAdjacentHTML(
    'beforeend',
    '<span class="page-head__spacer"></span><span class="stat-chip" data-testid="storage-hint">进度自动保存在本机</span>',
  );

  const content = document.createElement('div');
  content.style.marginTop = 'var(--space-5)';

  function showTab(tab: Tab): void {
    try {
      const url = tab === 'learn' ? '/vocabulary' : '/vocabulary?tab=review';
      history.replaceState(null, '', url);
    } catch {
      /* file:// 等环境忽略 */
    }
    learnTab.classList.toggle('tab--active', tab === 'learn');
    reviewTab.classList.toggle('tab--active', tab === 'review');
    learnTab.setAttribute('aria-selected', String(tab === 'learn'));
    reviewTab.setAttribute('aria-selected', String(tab === 'review'));
    if (tab === 'learn') {
      renderLearn(content, deps, { gotoReview: () => showTab('review') });
    } else {
      renderReview(content, deps, { gotoLearn: () => showTab('learn') });
    }
  }

  learnTab.addEventListener('click', () => showTab('learn'));
  reviewTab.addEventListener('click', () => showTab('review'));

  page.append(head, content);
  root.append(header, page);
  showTab(currentTab());
}
