import { describe, it, expect } from 'vitest';
import { renderListening } from './listening';
import { unit1Listenings, LISTENING_QUESTION_TYPE_LABEL } from '../data/unit1-listening';
import type { PlayerState, SpeechEngine } from '../speech/tts';
import type { ListeningDeps } from './deps';

const TOTAL = unit1Listenings.reduce((n, m) => n + m.questions.length, 0);

interface EngineCalls {
  play: Array<[string, string, number]>;
  pause: number;
  resume: number;
  stop: number;
  destroy: number;
}

/** 假引擎：记录调用并在状态变化时通知订阅者（与真实引擎行为一致） */
function makeFakeEngine(supported = true): { deps: ListeningDeps; calls: EngineCalls } {
  let state: PlayerState = 'idle';
  let currentId: string | null = null;
  const calls: EngineCalls = { play: [], pause: 0, resume: 0, stop: 0, destroy: 0 };
  const listeners = new Set<(s: PlayerState, id: string | null) => void>();

  const set = (next: PlayerState, id: string | null): void => {
    state = next;
    currentId = id;
    for (const listener of [...listeners]) listener(state, currentId);
  };

  const engine: SpeechEngine = {
    get supported() {
      return supported;
    },
    get state() {
      return state;
    },
    get currentId() {
      return currentId;
    },
    play(id, text, rate) {
      calls.play.push([id, text, rate]);
      set('playing', id);
    },
    pause() {
      calls.pause += 1;
      if (state === 'playing') set('paused', currentId);
    },
    resume() {
      calls.resume += 1;
      if (state === 'paused') set('playing', currentId);
    },
    stop() {
      calls.stop += 1;
      set('idle', null);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    destroy() {
      calls.destroy += 1;
      set('idle', null);
    },
  };

  return { deps: { createEngine: () => engine }, calls };
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function questionById(id: string) {
  for (const m of unit1Listenings) {
    const q = m.questions.find((item) => item.id === id);
    if (q) return q;
  }
  throw new Error(`题目 ${id} 不存在`);
}

/** 从数据推导正确/错误选项按钮（不依赖 DOM 泄露答案） */
function optionButtons(container: HTMLElement, id: string): { correct: HTMLButtonElement; wrong: HTMLButtonElement } {
  const q = questionById(id);
  const rightText = q.options[q.answerIndex];
  const buttons = [
    ...container.querySelector(`[data-question="${id}"]`)!.querySelectorAll<HTMLButtonElement>('button.option'),
  ];
  const textOf = (b: HTMLButtonElement) => b.textContent!.replace(/^[A-D]\.\s*/, '').trim();
  return {
    correct: buttons.find((b) => textOf(b) === rightText)!,
    wrong: buttons.find((b) => textOf(b) !== rightText)!,
  };
}

describe('听力页 · 渲染', () => {
  it('渲染 2 段材料（体裁/词数/播放器）与每段 3 道题，进度徽标从 0 开始', () => {
    const { deps } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    const passages = container.querySelectorAll('.listening-passage');
    expect(passages).toHaveLength(2);
    expect(container.textContent).toContain('Passage 1 · A Busy but Interesting School Life');
    expect(container.textContent).toContain('独白');
    expect(container.textContent).toContain('对话');
    expect(container.textContent).toContain('词');

    expect(container.querySelectorAll('.exercise--listening')).toHaveLength(TOTAL);
    expect(container.querySelector('[data-testid="listening-stat"]')!.textContent).toContain(`已答 0 / ${TOTAL}`);
  });

  it('题目展示题型标签；听力原文默认隐藏且查看按钮禁用', () => {
    const { deps } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    const q1 = container.querySelector('[data-question="l1-3"]')!;
    expect(q1.textContent).toContain(LISTENING_QUESTION_TYPE_LABEL.inference);

    const transcript = container.querySelector<HTMLElement>('[data-testid="listen-transcript-l1"]')!;
    expect(transcript.hidden).toBe(true);
    const toggle = container.querySelector<HTMLButtonElement>('[data-testid="listen-transcript-toggle-l1"]')!;
    expect(toggle.disabled).toBe(true);
  });
});

describe('听力页 · speechSynthesis 播放器', () => {
  it('点击播放：以拼接原文 + 当前语速调用引擎；随引擎状态切换 播放/暂停/继续', () => {
    const { deps, calls } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    const play = container.querySelector<HTMLButtonElement>('[data-testid="listen-play-l1"]')!;
    expect(play.textContent).toContain('播放');

    click(play);
    expect(calls.play).toHaveLength(1);
    expect(calls.play[0]![0]).toBe('l1');
    expect(calls.play[0]![1]).toBe(unit1Listenings[0]!.script.join(' '));
    expect(calls.play[0]![2]).toBe(1); // 默认语速 1.0
    expect(play.textContent).toContain('暂停'); // 引擎回调 playing → 暂停

    click(play);
    expect(calls.pause).toBe(1);
    expect(play.textContent).toContain('继续'); // 引擎回调 paused → 继续

    click(play);
    expect(calls.resume).toBe(1);
    expect(play.textContent).toContain('暂停');
  });

  it('重听：从头再放一遍（再次以原文+当前语速调用引擎）', () => {
    const { deps, calls } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    click(container.querySelector('[data-testid="listen-play-l2"]')!);
    click(container.querySelector('[data-testid="listen-replay-l2"]')!);
    expect(calls.play).toHaveLength(2);
    expect(calls.play[1]).toEqual(['l2', unit1Listenings[1]!.script.join(' '), 1]);
  });

  it('播放中切换材料：新的一段从头播放（互不打架）', () => {
    const { deps, calls } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    click(container.querySelector('[data-testid="listen-play-l1"]')!);
    click(container.querySelector('[data-testid="listen-play-l2"]')!);

    expect(calls.play).toHaveLength(2);
    expect(calls.play[1]![0]).toBe('l2');
    // 旧一段的按钮回到「播放」态
    expect(container.querySelector<HTMLButtonElement>('[data-testid="listen-play-l1"]')!.textContent).toContain('播放');
  });

  it('语速可调：滑杆更新读数；朗读中调整会以新语速从头重读本段', () => {
    const { deps, calls } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    const rate = container.querySelector<HTMLInputElement>('[data-testid="listen-rate-l1"]')!;
    const label = container.querySelector<HTMLElement>('[data-testid="listen-rate-label-l1"]')!;

    rate.value = '1.4';
    rate.dispatchEvent(new Event('input', { bubbles: true }));
    expect(label.textContent).toBe('1.4×');
    expect(calls.play).toHaveLength(0); // 未在朗读时只改读数

    click(container.querySelector('[data-testid="listen-play-l1"]')!);
    rate.value = '0.8';
    rate.dispatchEvent(new Event('input', { bubbles: true }));
    expect(calls.play).toHaveLength(2);
    expect(calls.play[1]).toEqual(['l1', unit1Listenings[0]!.script.join(' '), 0.8]);
  });
});

describe('听力页 · 即时判分与原文', () => {
  it('答对：判定正确、展示解析、锁定选项、更新进度徽标', () => {
    const { deps } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    const item = container.querySelector('[data-question="l1-1"]')!;
    click(optionButtons(container, 'l1-1').correct);

    expect(item.classList.contains('exercise--correct')).toBe(true);
    expect(item.textContent).toContain('解析');
    expect([...item.querySelectorAll<HTMLButtonElement>('button.option')].every((b) => b.disabled)).toBe(true);
    const stat = container.querySelector('[data-testid="listening-stat"]')!;
    expect(stat.textContent).toContain(`已答 1 / ${TOTAL}`);
    expect(stat.textContent).toContain('答对 1');
  });

  it('答错：判定错误、给出正确答案与解析；每题只判一次', () => {
    const { deps } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    const item = container.querySelector('[data-question="l2-1"]')!;
    const { wrong, correct } = optionButtons(container, 'l2-1');
    click(wrong);
    click(wrong); // 重复点击不再累计

    expect(item.classList.contains('exercise--wrong')).toBe(true);
    const result = item.querySelector('.exercise__result')!;
    const q = questionById('l2-1');
    expect(result.textContent).toContain('正确答案');
    expect(result.textContent).toContain(q.options[q.answerIndex]);
    expect(result.textContent).toContain('解析');
    expect(correct.classList.contains('option--correct')).toBe(true); // 高亮正确项
    expect(container.querySelector('[data-testid="listening-stat"]')!.textContent).toContain('已答 1 / ');
  });

  it('答完该段全部题目后可查看/收起听力原文', () => {
    const { deps } = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, deps);

    const toggle = container.querySelector<HTMLButtonElement>('[data-testid="listen-transcript-toggle-l1"]')!;
    for (const q of unit1Listenings[0]!.questions) {
      click(optionButtons(container, q.id).correct);
    }
    expect(toggle.disabled).toBe(false);

    click(toggle);
    const transcript = container.querySelector<HTMLElement>('[data-testid="listen-transcript-l1"]')!;
    expect(transcript.hidden).toBe(false);
    expect(transcript.textContent).toContain(unit1Listenings[0]!.script[0]!);
    expect(toggle.textContent).toContain('收起');

    click(toggle);
    expect(transcript.hidden).toBe(true);
  });
});

describe('听力页 · 兜底与清理', () => {
  it('浏览器不支持语音合成：控件禁用并给出提示，仍可作答', () => {
    const { deps } = makeFakeEngine(false);
    const container = document.createElement('div');
    renderListening(container, deps);

    expect(container.textContent).toContain('不支持语音合成');
    expect(container.querySelector<HTMLButtonElement>('[data-testid="listen-play-l1"]')!.disabled).toBe(true);
    expect(container.querySelector<HTMLButtonElement>('[data-testid="listen-replay-l1"]')!.disabled).toBe(true);
    expect(container.querySelector<HTMLInputElement>('[data-testid="listen-rate-l1"]')!.disabled).toBe(true);

    click(optionButtons(container, 'l1-1').correct);
    expect(container.querySelector('[data-question="l1-1"]')!.classList.contains('exercise--correct')).toBe(true);
  });

  it('页面清理（路由离开）：销毁引擎停止朗读', () => {
    const { deps, calls } = makeFakeEngine();
    const container = document.createElement('div');
    const dispose = renderListening(container, deps);

    click(container.querySelector('[data-testid="listen-play-l1"]')!);
    dispose();

    expect(calls.destroy).toBe(1);
  });
});
