/**
 * 浏览器 speechSynthesis（Web Speech API）封装：朗读播放/暂停/继续/停止。
 * 纯本地浏览器能力，不依赖任何外部 TTS 服务。
 *
 * 通过接缝注入合成器与 utterance 工厂，jsdom 无 speechSynthesis 时
 * 可用假实现做单元测试；浏览器环境由 page 层提供默认实现。
 *
 * 已知浏览器怪癖的处理：
 * - cancel 后浏览器仍可能补发旧 utterance 的 onend → 代数（generation）守卫忽略过期事件；
 * - Chrome 远端语音约 15s 截断 → 播放期间 10s 保活 resume()。
 */

export type PlayerState = 'idle' | 'playing' | 'paused';

/** 语音（结构子集） */
export interface SpeechSynthesisVoiceLike {
  lang: string;
  name: string;
}

/** 朗读单元（结构与 SpeechSynthesisUtterance 兼容的子集） */
export interface SpeechSynthesisUtteranceLike {
  text: string;
  lang: string;
  rate: number;
  voice: SpeechSynthesisVoiceLike | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onpause: (() => void) | null;
  onresume: (() => void) | null;
  onerror: (() => void) | null;
}

/** 合成器（结构与 window.speechSynthesis 兼容的子集） */
export interface SpeechSynthesisLike {
  speak(utterance: SpeechSynthesisUtteranceLike): void;
  pause(): void;
  resume(): void;
  cancel(): void;
  getVoices(): SpeechSynthesisVoiceLike[];
}

export interface SpeechEngine {
  /** 当前环境是否支持语音合成 */
  readonly supported: boolean;
  readonly state: PlayerState;
  /** 正在朗读/暂停的材料 id（idle 时为 null） */
  readonly currentId: string | null;
  /** 从头朗读指定材料（自动停掉上一段；语速随调用生效） */
  play(id: string, text: string, rate: number): void;
  pause(): void;
  resume(): void;
  stop(): void;
  /** 状态变化订阅；返回退订函数 */
  subscribe(listener: (state: PlayerState, currentId: string | null) => void): () => void;
  /** 停止朗读并释放资源（页面卸载/路由离开时调用） */
  destroy(): void;
}

export interface SpeechEngineDeps {
  /** 浏览器合成器；undefined 表示环境不支持 */
  synth: SpeechSynthesisLike | undefined;
  createUtterance: (text: string) => SpeechSynthesisUtteranceLike;
}

/** Chrome 远端语音截断问题的保活间隔 */
const KEEP_ALIVE_MS = 10_000;

export function createSpeechEngine(deps: SpeechEngineDeps): SpeechEngine {
  const { synth, createUtterance } = deps;

  let state: PlayerState = 'idle';
  let currentId: string | null = null;
  let generation = 0;
  let keepAliveTimer: ReturnType<typeof setInterval> | null = null;
  const listeners = new Set<(next: PlayerState, id: string | null) => void>();

  function notify(): void {
    for (const listener of [...listeners]) listener(state, currentId);
  }

  function setState(next: PlayerState, id: string | null): void {
    state = next;
    currentId = id;
    notify();
  }

  function stopKeepAlive(): void {
    if (keepAliveTimer !== null) {
      clearInterval(keepAliveTimer);
      keepAliveTimer = null;
    }
  }

  function startKeepAlive(): void {
    if (!synth || keepAliveTimer !== null) return;
    keepAliveTimer = setInterval(() => {
      if (state === 'playing') synth?.resume();
      else stopKeepAlive();
    }, KEEP_ALIVE_MS);
  }

  /** 优先选择英文语音（本机无则交给浏览器默认语音 + en-US 提示） */
  function pickEnglishVoice(): SpeechSynthesisVoiceLike | null {
    if (!synth) return null;
    return synth.getVoices().find((v) => /^en([-_]|$)/i.test(v.lang)) ?? null;
  }

  function play(id: string, text: string, rate: number): void {
    if (!synth) return; // 环境不支持：页面层已禁用按钮，这里安全空操作
    generation += 1;
    const gen = generation;
    synth.cancel(); // 切换材料时停掉上一段

    const utterance = createUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.voice = pickEnglishVoice();
    utterance.onend = () => {
      if (gen === generation) {
        stopKeepAlive();
        setState('idle', null);
      }
    };
    utterance.onerror = () => {
      if (gen === generation) {
        stopKeepAlive();
        setState('idle', null);
      }
    };
    utterance.onpause = () => {
      if (gen === generation && state === 'playing') setState('paused', id);
    };
    utterance.onresume = () => {
      if (gen === generation && state === 'paused') setState('playing', id);
    };

    synth.speak(utterance);
    setState('playing', id);
    startKeepAlive();
  }

  function pause(): void {
    if (!synth || state !== 'playing') return;
    synth.pause();
    stopKeepAlive();
    setState('paused', currentId);
  }

  function resume(): void {
    if (!synth || state !== 'paused') return;
    synth.resume();
    setState('playing', currentId);
    startKeepAlive();
  }

  function stop(): void {
    generation += 1; // 使迟到事件失效
    stopKeepAlive();
    synth?.cancel();
    setState('idle', null);
  }

  function destroy(): void {
    stop();
    listeners.clear();
  }

  return {
    get supported() {
      return !!synth;
    },
    get state() {
      return state;
    },
    get currentId() {
      return currentId;
    },
    play,
    pause,
    resume,
    stop,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    destroy,
  };
}
