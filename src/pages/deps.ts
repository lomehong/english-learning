import type { Word } from '../types';
import type { WrongBook } from '../store/wrongbook';

/** 词汇模块页面依赖（默认实现走真实 localStorage；测试可注入假实现） */
export interface VocabDeps {
  load: () => import('../store/progress').Progress;
  save: (progress: import('../store/progress').Progress) => void;
  now: () => number;
}

/** 语法模块页面依赖（默认实现走真实 localStorage；测试可注入假实现） */
export interface GrammarDeps {
  load: () => WrongBook;
  save: (book: WrongBook) => void;
  now: () => number;
}

export interface FlipCard {
  el: HTMLElement;
  flip: () => void;
  reset: () => void;
  isFlipped: () => boolean;
}

/** 翻面卡片：正面=单词+音标，背面=词性/释义/例句；点击翻面 */
export function createFlipCard(word: Word): FlipCard {
  const el = document.createElement('div');
  el.className = 'flip-card';
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', `单词卡片：${word.word}，点击翻面查看释义`);
  el.innerHTML = `
    <div class="flip-card__inner">
      <div class="flip-card__face flip-card__face--front">
        <h2 class="flip-card__word">${word.word}</h2>
        <p class="flip-card__phonetic">${word.phonetic}</p>
        <p class="flip-card__hint">点击卡片翻面</p>
      </div>
      <div class="flip-card__face flip-card__face--back">
        <span class="flip-card__pos">${word.pos}</span>
        <p class="flip-card__meaning">${word.meaning}</p>
        <p class="flip-card__example">${word.example}</p>
        <p class="flip-card__example-zh">${word.exampleZh}</p>
      </div>
    </div>`;

  const flip = (): void => {
    el.classList.toggle('flipped');
  };
  el.addEventListener('click', flip);
  el.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      flip();
    }
  });

  return {
    el,
    flip,
    reset: () => el.classList.remove('flipped'),
    isFlipped: () => el.classList.contains('flipped'),
  };
}
