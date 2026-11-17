import { unit1Words } from '../data/words';
import { createCard } from '../srs/sm2';
import type { Progress } from '../store/progress';
import { createFlipCard, type VocabDeps } from './deps';

/** 学习页：浏览 Unit 1 词表（翻面卡），标记已学加入复习计划 */
export function renderLearn(
  container: HTMLElement,
  deps: VocabDeps,
  options: { gotoReview?: () => void } = {},
): void {
  const progress = deps.load();
  let index = firstUnlearnedIndex(progress);
  let flipCard = createFlipCard(unit1Words[index]);

  function firstUnlearnedIndex(p: Progress): number {
    const i = unit1Words.findIndex((w) => !p.cards[w.id]);
    return i === -1 ? 0 : i;
  }

  function learnedCount(p: Progress): number {
    return unit1Words.filter((w) => p.cards[w.id]).length;
  }

  function render(): void {
    container.innerHTML = '';
    const total = unit1Words.length;
    const word = unit1Words[index];
    const learned = !!progress.cards[word.id];

    const chips = document.createElement('div');
    chips.style.cssText =
      'display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-4);justify-content:center;';
    chips.innerHTML = `
      <span class="stat-chip">本单元 <strong>${total}</strong> 词</span>
      <span class="stat-chip">已学 <strong>${learnedCount(progress)}</strong></span>
      <span class="stat-chip">待学 <strong>${total - learnedCount(progress)}</strong></span>`;

    flipCard = createFlipCard(word);
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
    actions.style.cssText = 'text-align:center;margin-top:var(--space-4);';
    actions.append(markBtn);
    if (learnedCount(progress) > 0 && options.gotoReview) {
      const toReview = document.createElement('button');
      toReview.type = 'button';
      toReview.className = 'btn btn--ghost';
      toReview.style.marginLeft = 'var(--space-2)';
      toReview.textContent = '去复习 →';
      toReview.addEventListener('click', options.gotoReview);
      actions.append(toReview);
    }

    container.append(chips, flipCard.el, nav, actions);
  }

  render();
}
