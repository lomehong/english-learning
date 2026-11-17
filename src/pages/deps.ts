import type { PracticeModule, Word } from '../types';
import type { WrongBook } from '../store/wrongbook';
import type { StatsBook } from '../store/stats';
import type { Progress } from '../store/progress';
import { createSpeechEngine, type SpeechEngine, type SpeechSynthesisLike, type SpeechSynthesisUtteranceLike } from '../speech/tts';

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

/** 错题本页 /mistakes 依赖：读写错题本存储 */
export interface MistakesDeps {
  load: () => WrongBook;
  save: (book: WrongBook) => void;
}

/** 学习报告页 /report 依赖：汇总三份 localStorage 数据源 */
export interface ReportDeps {
  loadStats: () => StatsBook;
  loadWrong: () => WrongBook;
  loadProgress: () => Progress;
  now: () => number;
}

/* ---------- 模块维度共享常量（错题本 / 学习报告页共用） ---------- */

export const MODULE_LABEL: Record<PracticeModule, string> = {
  vocab: '词汇',
  grammar: '语法',
  reading: '阅读',
  listening: '听力',
};

/** 各模块「去重练」跳转目标（词汇=到期复习队列） */
export const MODULE_RETRY_ROUTE: Record<PracticeModule, string> = {
  vocab: '/vocabulary?tab=review',
  grammar: '/grammar',
  reading: '/reading',
  listening: '/listening',
};

/** 正确率显示：null（未练习）→「—」，否则保留一位小数的百分数（50%、62.5%） */
export function pctText(accuracy: number | null): string {
  if (accuracy === null) return '—';
  return `${Math.round(accuracy * 1000) / 10}%`;
}

/**
 * 阅读模块页面依赖：与词汇模块共用同一进度存储（localStorage 键
 * english-learning.progress.v1），生词收藏即「加入词汇本」。
 */
export type ReadingDeps = VocabDeps;

/**
 * 听力模块页面依赖：speechSynthesis 引擎注入点。
 * 默认实现用浏览器本地 Web Speech API 朗读（不依赖外部 TTS）；测试注入假引擎。
 */
export interface ListeningDeps {
  createEngine: () => SpeechEngine;
}

/** 默认依赖：浏览器 speechSynthesis 本地朗读 */
export function defaultListeningDeps(): ListeningDeps {
  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined';
  return {
    // DOM 完整类型与 tts.ts 的「结构子集」接口在事件处理器签名上不兼容
    //（如 onstart 带事件参数），此处为接缝边界的显式桥接转换，运行时结构兼容。
    createEngine: () =>
      createSpeechEngine({
        synth: supported ? (window.speechSynthesis as unknown as SpeechSynthesisLike) : undefined,
        createUtterance: (text) => new SpeechSynthesisUtterance(text) as unknown as SpeechSynthesisUtteranceLike,
      }),
  };
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
