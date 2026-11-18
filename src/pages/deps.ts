import type { PracticeModule, Word } from '../types';
import type { WrongBook } from '../store/wrongbook';
import type { StatsBook } from '../store/stats';
import type { Progress } from '../store/progress';
import type { WritingDrafts } from '../store/writing';
import type { DailyActivity, DailyGoal } from '../store/daily';
import { loadDaily, loadGoal } from '../store/daily';
import { createSpeechEngine, type SpeechEngine, type SpeechSynthesisLike, type SpeechSynthesisUtteranceLike } from '../speech/tts';
import { loadWritingDrafts, saveWritingDrafts } from '../store/writing';

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
  /** 学习计划接缝（可选：默认走每日活动/目标真实存储；测试可注入） */
  loadDaily?: () => DailyActivity;
  loadGoal?: () => DailyGoal;
  saveGoal?: (goal: DailyGoal) => void;
}

/**
 * 首页依赖：今日进度与 streak 徽标的数据源
 * （可选注入；默认走每日活动/目标真实存储 + 当前时间）。
 */
export interface HomeDeps {
  loadDaily: () => DailyActivity;
  loadGoal: () => DailyGoal;
  now: () => number;
}

/** 首页默认依赖：真实 localStorage 每日活动/目标 */
export function defaultHomeDeps(): HomeDeps {
  return {
    loadDaily: () => loadDaily(),
    loadGoal: () => loadGoal(),
    now: () => Date.now(),
  };
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

/**
 * 朗读引擎注入点（听力页 / 词汇单词卡朗读共用同一 speechSynthesis 接缝）。
 * 默认实现见 defaultSpeechDeps；测试注入假引擎。
 */
export type SpeechDeps = ListeningDeps;

/**
 * 写作模块页面依赖：草稿读写走 localStorage
 * （键 english-learning.writing.v1）；测试可注入假实现。
 */
export interface WritingDeps {
  load: () => WritingDrafts;
  save: (drafts: WritingDrafts) => void;
  now: () => number;
}

/** 写作模块默认依赖 */
export function defaultWritingDeps(): WritingDeps {
  return {
    load: () => loadWritingDrafts(),
    save: (drafts) => saveWritingDrafts(drafts),
    now: () => Date.now(),
  };
}

/**
 * 默认依赖：浏览器 speechSynthesis 本地朗读
 *（听力页播放器与词汇单词卡朗读共用同一默认实现）。
 */
export function defaultSpeechDeps(): SpeechDeps {
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

/** 听力页默认依赖（与词汇卡朗读共用同一 speechSynthesis 默认实现） */
export function defaultListeningDeps(): ListeningDeps {
  return defaultSpeechDeps();
}

/** 单词卡朗读按钮类型：正面朗读单词，背面朗读例句 */
type SpeakKind = 'word' | 'example';

/** 单词卡朗读语速（常速；与听力页默认档一致） */
const SPEAK_RATE = 1;

export interface FlipCardOptions {
  /**
   * 朗读引擎（页面层创建并负责销毁）；缺省或引擎 supported=false 时
   * 不渲染朗读按钮（浏览器不支持 speechSynthesis 时静默降级）。
   */
  speech?: SpeechEngine;
}

export interface FlipCard {
  el: HTMLElement;
  flip: () => void;
  reset: () => void;
  isFlipped: () => boolean;
  /** 释放朗读订阅（卡片被翻页 / 重渲染丢弃前调用，避免监听泄漏） */
  dispose: () => void;
}

/** 模块空数据降级提示：该单元缺此模块数据文件时显示「暂无内容」，而不是崩溃或空白 */
export function buildEmptyState(text: string, testId = 'module-empty'): HTMLParagraphElement {
  const el = document.createElement('p');
  el.className = 'empty-state';
  el.setAttribute('data-testid', testId);
  el.textContent = text;
  return el;
}

/**
 * 翻面卡片：正面=单词+音标（+「朗读单词」），背面=词性/释义/例句（+「朗读例句」）；
 * 点击卡片翻面。传入朗读引擎时，正反面各加一个朗读按钮：点击朗读对应文本、
 * 朗读中再次点击停止、切换卡片时由页面层停止，且点击 / 回车不冒泡触发翻面。
 */
export function createFlipCard(word: Word, options: FlipCardOptions = {}): FlipCard {
  const { speech } = options;
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

  /** 引擎订阅退订函数（卡片丢弃时统一释放） */
  const unsubscribes: Array<() => void> = [];

  /**
   * 朗读按钮：独立于卡片翻面（click / 键盘事件都不冒泡到卡片）。
   * 同一段正在朗读 / 暂停时再点击 → 停止；否则从头朗读该段。
   */
  function buildSpeakButton(kind: SpeakKind): HTMLButtonElement {
    const id = `${word.id}:${kind}`;
    const text = kind === 'word' ? word.word : word.example;
    const label = kind === 'word' ? '🔊 朗读单词' : '🔊 朗读例句';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn--ghost btn--sm flip-card__speak';
    button.setAttribute('data-testid', `speak-${kind}`);
    button.setAttribute('aria-label', `${label}（${word.word}），再次点击停止`);
    button.textContent = label;

    function sync(): void {
      if (!speech) return;
      const active = speech.currentId === id && speech.state !== 'idle';
      button.textContent = active ? '⏹ 停止' : label;
      button.setAttribute('aria-pressed', String(active));
    }

    button.addEventListener('click', (event: MouseEvent) => {
      // 朗读按钮点击不应冒泡到卡片（否则会顺带翻面）
      event.stopPropagation();
      if (!speech) return;
      if (speech.currentId === id && speech.state !== 'idle') speech.stop();
      else speech.play(id, text, SPEAK_RATE);
    });
    // 键盘回车 / 空格同样不冒泡：卡片本体监听 keydown 翻面
    button.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
    });

    if (speech) unsubscribes.push(speech.subscribe(sync));
    sync();
    return button;
  }

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

  // 朗读按钮：正面（单词）在提示语之前，背面（例句）在例句译文之后
  if (speech?.supported) {
    el.querySelector('.flip-card__face--front')!.insertBefore(
      buildSpeakButton('word'),
      el.querySelector('.flip-card__hint'),
    );
    el.querySelector('.flip-card__face--back')!.append(buildSpeakButton('example'));
  }

  return {
    el,
    flip,
    reset: () => el.classList.remove('flipped'),
    isFlipped: () => el.classList.contains('flipped'),
    dispose: () => {
      for (const unsubscribe of unsubscribes) unsubscribe();
      unsubscribes.length = 0;
    },
  };
}
