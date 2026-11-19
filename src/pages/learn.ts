import { getWordsByUnit } from '../data/words';
import type { Word } from '../types';
import type { UnitId } from '../data/units';
import { createCard } from '../srs/sm2';
import type { Progress } from '../store/progress';
import { recordActivityAndSave } from '../store/daily';
import { buildEmptyState, createFlipCard, type VocabDeps } from './deps';
import type { SpeechEngine } from '../speech/tts';
import { filterVocabWords, firstMatchIndex, hasVocabQuery } from './vocab-search';

/** ?q= 单元内搜索关键词（学习 Tab 可深链；缺省 / 存储不可用时为空串） */
function searchFromUrl(): string {
  try {
    return new URLSearchParams(location.search).get('q') ?? '';
  } catch {
    return '';
  }
}

/** 搜索关键词 → URL：保留 unit / tab 等其余参数；清空（或纯空白）时移除 q */
function syncSearchUrl(query: string): void {
  try {
    const params = new URLSearchParams(location.search);
    if (hasVocabQuery(query)) params.set('q', query);
    else params.delete('q');
    const qs = params.toString();
    history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname);
  } catch {
    /* file:// 等环境忽略 */
  }
}

/**
 * 学习页：浏览指定单元词表（翻面卡），标记已学加入复习计划；
 * 卡片正反面各带一个朗读按钮（复用 speechSynthesis 引擎，切换词 / 翻页停止上一段）；
 * 顶部「单元内搜索」按英文拼写或中文释义实时过滤当前词表，
 * 显示匹配数，点击结果 / 回车跳到该词卡片，一键清空并支持 ?q= 深链。
 */
export function renderLearn(
  container: HTMLElement,
  deps: VocabDeps,
  options: { gotoReview?: () => void; unit?: UnitId; speech?: SpeechEngine } = {},
): void {
  const { speech } = options;
  const unit = options.unit ?? 'unit1';
  const words = getWordsByUnit(unit);
  /** 当前卡片的朗读订阅释放函数（翻页 / 重渲染前调用） */
  let cardDispose: (() => void) | null = null;

  // 该单元缺词表数据（unitN-words.json 未提供）：优雅降级显示暂无内容，不渲染翻面卡
  if (words.length === 0) {
    speech?.stop();
    container.replaceChildren(buildEmptyState('本单元词表暂无内容，敬请期待。'));
    return;
  }

  const progress = deps.load();
  let query = searchFromUrl();
  let matches = filterVocabWords(words, query);
  // ?q= 深链且命中 → 卡片直接定位到首个匹配词；否则沿用「首个未学」
  let index =
    hasVocabQuery(query) && matches.length > 0
      ? Math.max(0, firstMatchIndex(words, query))
      : firstUnlearnedIndex(progress);
  let scrollToCard = false;

  function firstUnlearnedIndex(p: Progress): number {
    const i = words.findIndex((w) => !p.cards[w.id]);
    return i === -1 ? 0 : i;
  }

  function learnedCount(p: Progress): number {
    return words.filter((w) => p.cards[w.id]).length;
  }

  /* ---------- 单元内搜索：固定元素复用（重渲染时保留输入值与焦点） ---------- */

  const searchEl = document.createElement('div');
  searchEl.className = 'vocab-search';

  const searchRow = document.createElement('div');
  searchRow.className = 'vocab-search__row';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'vocab-search__input';
  input.placeholder = '搜索本单元单词 / 释义（英文或中文）';
  input.setAttribute('data-testid', 'vocab-search');
  input.setAttribute('aria-label', '按英文单词或中文释义搜索本单元词表');
  input.value = query;

  const countEl = document.createElement('span');
  countEl.className = 'stat-chip vocab-search__count';
  countEl.setAttribute('data-testid', 'vocab-search-count');

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'btn btn--ghost btn--sm vocab-search__clear';
  clearBtn.setAttribute('data-testid', 'vocab-search-clear');
  clearBtn.textContent = '清空';

  searchRow.append(input, countEl, clearBtn);

  const results = document.createElement('div');
  results.className = 'vocab-search__results';
  results.setAttribute('data-testid', 'vocab-search-results');
  results.setAttribute('aria-label', '搜索匹配结果');

  const noMatch = document.createElement('p');
  noMatch.className = 'vocab-search__empty';
  noMatch.setAttribute('data-testid', 'vocab-search-empty');
  noMatch.textContent = '没有匹配的单词，换个关键词试试（支持英文拼写或中文释义）。';

  searchEl.append(searchRow, results, noMatch);

  function buildResultButton(word: Word): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vocab-search__result';
    button.setAttribute('data-testid', 'vocab-search-result');
    button.dataset.wordId = word.id;

    const wordEl = document.createElement('span');
    wordEl.className = 'vocab-search__word';
    wordEl.textContent = word.word;
    const posEl = document.createElement('span');
    posEl.className = 'vocab-search__pos';
    posEl.textContent = word.pos;
    const meaningEl = document.createElement('span');
    meaningEl.className = 'vocab-search__meaning';
    meaningEl.textContent = word.meaning;

    button.append(wordEl, posEl, meaningEl);
    button.addEventListener('click', () => jumpTo(word));
    return button;
  }

  /** 同步搜索区：匹配数 + 结果列表（仅关键词非空时展开）+ 一键清空显隐 */
  function syncSearch(): void {
    const active = hasVocabQuery(query);
    countEl.textContent = `匹配 ${matches.length} / ${words.length} 词`;
    clearBtn.hidden = !active;
    results.hidden = !active;
    noMatch.hidden = !active || matches.length !== 0;
    if (!active) {
      results.replaceChildren();
      return;
    }
    const currentId = words[index]?.id;
    const buttons = matches.map(buildResultButton);
    for (const button of buttons) {
      button.classList.toggle('vocab-search__result--active', button.dataset.wordId === currentId);
    }
    results.replaceChildren(...buttons);
  }

  /** 应用关键词：更新过滤结果、地址栏 ?q= 与搜索区显示（不移动卡片） */
  function applyQuery(next: string): void {
    query = next;
    matches = filterVocabWords(words, query);
    syncSearchUrl(query);
    syncSearch();
  }

  /** 一键清空：恢复完整词表，移除 ?q= 并把焦点还给输入框 */
  function clearQuery(): void {
    input.value = '';
    applyQuery('');
    input.focus();
  }

  function jumpTo(word: Word): void {
    const target = words.findIndex((w) => w.id === word.id);
    if (target === -1) return;
    index = target;
    scrollToCard = true;
    render();
  }

  input.addEventListener('input', () => applyQuery(input.value));
  input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matches.length > 0) jumpTo(matches[0]!); // 回车 → 首个匹配词的卡片
    } else if (e.key === 'Escape') {
      e.preventDefault();
      clearQuery();
    }
  });
  clearBtn.addEventListener('click', clearQuery);

  function render(): void {
    // 翻页 / 切词 / 标记已学重渲染：先停止上一段朗读并释放旧卡片的朗读订阅
    cardDispose?.();
    cardDispose = null;
    speech?.stop();
    // 重渲染会摘掉搜索区元素，先记录焦点，挂回后恢复（回车跳转后仍可继续输入）
    const keepFocus = document.activeElement === input;
    container.innerHTML = '';
    const total = words.length;
    const word = words[index];
    const learned = !!progress.cards[word.id];

    const chips = document.createElement('div');
    chips.className = 'card-chips';
    chips.innerHTML = `
      <span class="stat-chip">本单元 <strong>${total}</strong> 词</span>
      <span class="stat-chip">已学 <strong>${learnedCount(progress)}</strong></span>
      <span class="stat-chip">待学 <strong>${total - learnedCount(progress)}</strong></span>`;

    const flipCard = createFlipCard(word, { speech });
    cardDispose = flipCard.dispose;
    const markBtn = document.createElement('button');
    markBtn.type = 'button';
    markBtn.className = 'btn btn--primary';
    markBtn.textContent = learned ? '✓ 已加入复习计划' : '标记已学，加入复习';
    if (learned) markBtn.classList.add('btn--ghost');
    markBtn.addEventListener('click', () => {
      if (progress.cards[word.id]) {
        delete progress.cards[word.id];
      } else {
        progress.cards[word.id] = createCard(word.id, deps.now());
        // 学习计划数据源：当日新学词汇 +1
        recordActivityAndSave('vocab', deps.now());
      }
      deps.save(progress);
      render();
    });

    const nav = document.createElement('div');
    nav.className = 'card-nav';
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'btn btn--ghost';
    prev.textContent = '← 上一个';
    prev.disabled = index === 0;
    prev.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      render();
    });

    const counter = document.createElement('span');
    counter.className = 'card-nav__counter';
    counter.textContent = `${index + 1} / ${total}`;

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn btn--ghost';
    next.textContent = '下一个 →';
    next.disabled = index === total - 1;
    next.addEventListener('click', () => {
      index = Math.min(total - 1, index + 1);
      render();
    });

    nav.append(prev, counter, next);

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.append(markBtn);
    if (learnedCount(progress) > 0 && options.gotoReview) {
      const toReview = document.createElement('button');
      toReview.type = 'button';
      toReview.className = 'btn btn--ghost card-actions__more';
      toReview.textContent = '去复习 →';
      toReview.addEventListener('click', options.gotoReview);
      actions.append(toReview);
    }

    container.append(searchEl, chips, flipCard.el, nav, actions);
    syncSearch();
    if (keepFocus) input.focus();
    if (scrollToCard) {
      scrollToCard = false;
      if (typeof flipCard.el.scrollIntoView === 'function') {
        flipCard.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }

  render();
}
