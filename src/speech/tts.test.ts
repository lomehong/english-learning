import { describe, it, expect, afterEach } from 'vitest';
import {
  createSpeechEngine,
  type SpeechEngine,
  type SpeechSynthesisLike,
  type SpeechSynthesisUtteranceLike,
} from './tts';

/** 假 utterance：字段与事件回调与浏览器 SpeechSynthesisUtterance 结构一致 */
class FakeUtterance implements SpeechSynthesisUtteranceLike {
  text: string;
  lang = '';
  rate = 1;
  voice: { lang: string; name: string } | null = null;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

interface SynthCalls {
  speak: FakeUtterance[];
  pause: number;
  resume: number;
  cancel: number;
}

function makeSynth(voices: { lang: string; name: string }[] = []): { synth: SpeechSynthesisLike; calls: SynthCalls } {
  const calls: SynthCalls = { speak: [], pause: 0, resume: 0, cancel: 0 };
  const synth: SpeechSynthesisLike = {
    speak: (u) => {
      calls.speak.push(u as FakeUtterance);
    },
    pause: () => {
      calls.pause += 1;
    },
    resume: () => {
      calls.resume += 1;
    },
    cancel: () => {
      calls.cancel += 1;
    },
    getVoices: () => voices,
  };
  return { synth, calls };
}

const engines: SpeechEngine[] = [];
function makeEngine(synth?: SpeechSynthesisLike): SpeechEngine {
  const engine = createSpeechEngine({ synth, createUtterance: (text) => new FakeUtterance(text) });
  engines.push(engine);
  return engine;
}

afterEach(() => {
  for (const engine of engines.splice(0)) engine.destroy();
});

describe('speechSynthesis 引擎 · 基本控制', () => {
  it('play：按文本+语速朗读，选英文语音，进入 playing 并记住材料 id', () => {
    const { synth, calls } = makeSynth([
      { lang: 'zh-CN', name: 'Huihui' },
      { lang: 'en-GB', name: 'Ryan' },
    ]);
    const engine = makeEngine(synth);

    engine.play('l1', 'Hello world', 0.8);

    expect(calls.speak).toHaveLength(1);
    expect(calls.speak[0]!.text).toBe('Hello world');
    expect(calls.speak[0]!.rate).toBe(0.8);
    expect(calls.speak[0]!.lang).toBe('en-US');
    expect(calls.speak[0]!.voice?.name).toBe('Ryan'); // 优先英文语音
    expect(engine.state).toBe('playing');
    expect(engine.currentId).toBe('l1');
  });

  it('pause / resume：状态切换并调用合成器；idle 下为空操作', () => {
    const { synth, calls } = makeSynth();
    const engine = makeEngine(synth);

    engine.pause(); // idle 下不应触碰合成器
    expect(calls.pause).toBe(0);
    expect(engine.state).toBe('idle');

    engine.play('l1', 'text', 1);
    engine.pause();
    expect(calls.pause).toBe(1);
    expect(engine.state).toBe('paused');
    expect(engine.currentId).toBe('l1'); // 暂停保留当前材料

    engine.resume();
    expect(calls.resume).toBe(1);
    expect(engine.state).toBe('playing');

    engine.resume(); // 非 paused 下空操作
    expect(calls.resume).toBe(1);
  });

  it('stop：取消朗读回到 idle，迟到的 onend 不再改变状态', () => {
    const { synth, calls } = makeSynth();
    const engine = makeEngine(synth);
    const fired: string[] = [];
    engine.subscribe((state) => fired.push(state));
    engine.play('l1', 'text', 1);
    const utterance = calls.speak[0]!;

    engine.stop();
    expect(calls.cancel).toBe(2); // play 内 1 次 + stop 1 次
    expect(engine.state).toBe('idle');
    expect(engine.currentId).toBeNull();
    expect(fired).toEqual(['playing', 'idle']);

    utterance.onend?.(); // 浏览器 cancel 后仍会补发 onend
    expect(engine.state).toBe('idle');
    expect(fired).toEqual(['playing', 'idle']); // 过期事件被忽略
  });

  it('朗读完自动回到 idle（onend），onerror 同样收敛到 idle', () => {
    const { synth, calls } = makeSynth();
    const engine = makeEngine(synth);

    engine.play('l1', 'text', 1);
    calls.speak[0]!.onend?.();
    expect(engine.state).toBe('idle');
    expect(engine.currentId).toBeNull();

    engine.play('l2', 'text2', 1);
    calls.speak[1]!.onerror?.();
    expect(engine.state).toBe('idle');
  });

  it('切换材料：先 cancel 旧朗读，旧 utterance 的 onend 被忽略，currentId 更新', () => {
    const { synth, calls } = makeSynth();
    const engine = makeEngine(synth);

    engine.play('l1', 'first', 1);
    const first = calls.speak[0]!;
    engine.play('l2', 'second', 1.2);

    expect(calls.speak).toHaveLength(2);
    expect(calls.cancel).toBe(2); // 每次 play 内部都先 cancel 一次
    expect(engine.currentId).toBe('l2');
    expect(engine.state).toBe('playing');

    first.onend?.(); // 旧 utterance 迟到的 onend 不得打断新朗读
    expect(engine.state).toBe('playing');
    expect(engine.currentId).toBe('l2');
  });

  it('暂停/继续事件回调与用户操作一致收敛', () => {
    const { synth, calls } = makeSynth();
    const engine = makeEngine(synth);

    engine.play('l1', 'text', 1);
    calls.speak[0]!.onpause?.();
    expect(engine.state).toBe('paused');
    calls.speak[0]!.onresume?.();
    expect(engine.state).toBe('playing');
  });

  it('subscribe：状态变化通知订阅者，退订后不再通知', () => {
    const { synth } = makeSynth();
    const engine = makeEngine(synth);

    const seen: Array<[string, string | null]> = [];
    const off = engine.subscribe((state, id) => seen.push([state, id]));

    engine.play('l1', 'text', 1);
    engine.pause();
    off();
    engine.resume();

    expect(seen).toEqual([
      ['playing', 'l1'],
      ['paused', 'l1'],
    ]);
  });

  it('浏览器不支持 speechSynthesis：supported=false，play/stop 均为安全空操作', () => {
    const engine = makeEngine(undefined);

    expect(engine.supported).toBe(false);
    expect(() => engine.play('l1', 'text', 1)).not.toThrow();
    expect(() => engine.stop()).not.toThrow();
    expect(engine.state).toBe('idle');
  });

  it('destroy：停止朗读并回到 idle（清理保活定时器）', () => {
    const { synth, calls } = makeSynth();
    const engine = makeEngine(synth);

    engine.play('l1', 'text', 1);
    engine.destroy();

    expect(calls.cancel).toBe(2);
    expect(engine.state).toBe('idle');
    expect(engine.currentId).toBeNull();
  });
});
