import type { PracticeModule, WrongEntry } from '../types';
import { loadWrongBook, saveWrongBook, removeEntry, emptyWrongBook, type WrongBook } from '../store/wrongbook';
import { MODULE_LABEL, MODULE_RETRY_ROUTE, type MistakesDeps } from './deps';

/**
 * /mistakes 错题本页：汇总词汇（复习）/ 语法 / 阅读 / 听力各模块写入
 * localStorage 的错题（按 exerciseId 去重），支持按模块过滤、移除单条、
 * 清空与「去重练」跳回对应模块。
 */

type Filter = PracticeModule | 'all';

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'vocab', label: MODULE_LABEL.vocab },
  { key: 'grammar', label: MODULE_LABEL.grammar },
  { key: 'reading', label: MODULE_LABEL.reading },
  { key: 'listening', label: MODULE_LABEL.listening },
];

/** 从 ?module= 读取初始过滤（非法值回退全部），与词汇页 ?tab= 深链约定一致 */
function currentFilter(): Filter {
  const value = new URLSearchParams(location.search).get('module');
  return FILTERS.some((f) => f.key === value) ? (value as Filter) : 'all';
}

function formatDate(epochMs: number): string {
  return new Date(epochMs).toISOString().slice(0, 10);
}

export function renderMistakes(root: HTMLElement, deps?: MistakesDeps): void {
  const d: MistakesDeps = deps ?? {
    load: () => loadWrongBook(),
    save: (b) => saveWrongBook(b),
  };

  let book: WrongBook = d.load();
  let filter: Filter = currentFilter();

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="site-header__brand" href="/" data-link>高中英语学习系统</a>
      <nav class="site-header__nav">
        <a class="btn btn--ghost" href="/" data-link>首页</a>
        <a class="btn btn--ghost" href="/report" data-link>学习报告</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';

  /* 标题区：总数徽标 + 清空按钮 */
  const countChip = document.createElement('span');
  countChip.className = 'stat-chip';
  countChip.setAttribute('data-testid', 'mistake-count');

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'btn btn--ghost';
  clearBtn.setAttribute('data-testid', 'mistake-clear');
  clearBtn.textContent = '清空错题本';

  const head = document.createElement('div');
  head.className = 'page-head';
  const title = document.createElement('h1');
  title.className = 'page-head__title';
  title.textContent = '错题本';
  const spacer = document.createElement('span');
  spacer.className = 'page-head__spacer';
  head.append(title, spacer, countChip, clearBtn);

  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent =
    '汇总词汇、语法、阅读、听力四个模块的答错记录（按题目去重，重复答错累计次数）。选模块过滤，逐条移除或「去重练」回到对应模块再战。';

  /* 模块过滤 Tab */
  const tabBar = document.createElement('div');
  tabBar.className = 'tabs mistake-filter';
  tabBar.setAttribute('role', 'tablist');
  tabBar.setAttribute('data-testid', 'mistake-filter');

  const tabButtons = new Map<Filter, HTMLButtonElement>();
  for (const { key, label } of FILTERS) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tab';
    tab.dataset.module = key;
    tab.setAttribute('role', 'tab');
    const text = document.createElement('span');
    text.textContent = label;
    const count = document.createElement('span');
    count.className = 'tab__count';
    tab.append(text, count);
    tab.addEventListener('click', () => {
      filter = key;
      try {
        const url = key === 'all' ? '/mistakes' : `/mistakes?module=${key}`;
        history.replaceState(null, '', url);
      } catch {
        /* file:// 等环境忽略 */
      }
      renderList();
    });
    tabButtons.set(key, tab);
    tabBar.append(tab);
  }

  /* 列表 + 空状态 */
  const list = document.createElement('div');
  list.className = 'wrongbook__list';
  list.setAttribute('data-testid', 'mistake-list');

  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.setAttribute('data-testid', 'mistake-empty');
  const emptyTitle = document.createElement('h2');
  emptyTitle.className = 'empty-state__title';
  const emptyDesc = document.createElement('p');
  emptyDesc.className = 'empty-state__desc';
  const emptyLink = document.createElement('a');
  emptyLink.className = 'btn btn--primary';
  emptyLink.setAttribute('data-link', '');
  empty.append(emptyTitle, emptyDesc, emptyLink);

  function buildWrongItem(entry: WrongEntry): HTMLElement {
    const item = document.createElement('article');
    item.className = 'wrong-item card';
    item.dataset.exercise = entry.exerciseId;

    const itemHead = document.createElement('div');
    itemHead.className = 'wrong-item__head';
    const badge = document.createElement('span');
    badge.className = `module-badge module-badge--${entry.module}`;
    badge.setAttribute('data-testid', 'mistake-module');
    badge.textContent = MODULE_LABEL[entry.module];
    const meta = document.createElement('span');
    meta.className = 'wrong-item__meta';
    meta.setAttribute('data-testid', 'mistake-meta');
    meta.textContent = `累计答错 ${entry.wrongCount} 次 · 最近 ${formatDate(entry.lastWrongAt)}`;
    itemHead.append(badge, meta);

    const stem = document.createElement('p');
    stem.className = 'wrong-item__stem';
    stem.textContent = entry.stem;

    const answers = document.createElement('p');
    answers.className = 'wrong-item__answers';
    const yours = document.createElement('span');
    yours.className = 'wrong-item__yours';
    yours.textContent = `你的答案：${entry.yourAnswer}`;
    const right = document.createElement('span');
    right.className = 'wrong-item__right';
    right.textContent = `正确答案：${entry.correctAnswer}`;
    answers.append(yours, right);

    const exp = document.createElement('p');
    exp.className = 'wrong-item__explanation';
    const label = document.createElement('strong');
    label.textContent = '解析：';
    exp.append(label, entry.explanation);

    const actions = document.createElement('div');
    actions.className = 'wrong-item__actions';
    const retry = document.createElement('a');
    retry.className = 'btn btn--primary btn--sm';
    retry.setAttribute('data-testid', 'mistake-retry');
    retry.setAttribute('data-link', '');
    retry.href = MODULE_RETRY_ROUTE[entry.module];
    retry.textContent = `去重练${MODULE_LABEL[entry.module]}`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn btn--ghost btn--sm';
    remove.setAttribute('data-testid', 'mistake-remove');
    remove.textContent = '移除';
    remove.addEventListener('click', () => {
      book = removeEntry(book, entry.exerciseId);
      d.save(book);
      renderList();
    });
    actions.append(retry, remove);

    item.append(itemHead, stem, answers, exp, actions);
    return item;
  }

  function renderList(): void {
    const all = Object.values(book.entries).sort((a, b) => b.lastWrongAt - a.lastWrongAt);
    const visible = filter === 'all' ? all : all.filter((e) => e.module === filter);

    list.replaceChildren(...visible.map(buildWrongItem));
    list.hidden = visible.length === 0;

    emptyTitle.textContent = visible.length === 0 && filter !== 'all' ? '该模块暂无错题' : '暂无错题';
    emptyDesc.textContent =
      visible.length === 0 && filter !== 'all'
        ? `${MODULE_LABEL[filter]}模块目前没有错题记录，换个模块看看。`
        : '全部答对就是最好的复习。去各模块练一练，答错的题会自动收进这里。';
    emptyLink.href = filter === 'all' ? '/grammar' : MODULE_RETRY_ROUTE[filter as PracticeModule];
    emptyLink.textContent = filter === 'all' ? '去做几道题 →' : `去练${MODULE_LABEL[filter as PracticeModule]} →`;
    empty.hidden = visible.length !== 0;

    countChip.replaceChildren('共 ');
    const strong = document.createElement('strong');
    strong.textContent = String(all.length);
    countChip.append(strong, ' 题');
    for (const { key } of FILTERS) {
      const tab = tabButtons.get(key)!;
      const n = key === 'all' ? all.length : all.filter((e) => e.module === key).length;
      tab.querySelector<HTMLElement>('.tab__count')!.textContent = String(n);
      tab.classList.toggle('tab--active', filter === key);
      tab.setAttribute('aria-selected', String(filter === key));
    }

    clearBtn.disabled = all.length === 0;
  }

  clearBtn.addEventListener('click', () => {
    book = emptyWrongBook();
    d.save(book);
    renderList();
  });

  renderList();

  page.append(head, intro, tabBar, list, empty);
  root.append(header, page);
}
