import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderListening } from './listening';
import { unit1Listenings } from '../data/unit1-listening';
import { unit2Listenings } from '../data/unit2-listening';
import { clearWrongBook, loadWrongBook } from '../store/wrongbook';
import { emptyStats, loadStats, saveStats } from '../store/stats';
import type { ListeningQuestion } from '../types';
import type { PlayerState, SpeechEngine } from '../speech/tts';
import type { ListeningDeps } from './deps';

const TOTAL = unit1Listenings.reduce((n, m) => n + m.questions.length, 0);
const TOTAL_U2 = unit2Listenings.reduce((n, m) => n + m.questions.length, 0);

/* ---------- 假语音引擎（记录调用、可强制状态） ---------- */

interface FakeEngine extends SpeechEngine {
  calls: {
    plays: Array<{ id: string; text: string; rate: number }>;
    pause: number;
    resume: number;
    stop: number;
    destroy: number;
  };
  force(state: PlayerState, id: string | null): void;
}

function makeFakeEngine(supported = true): FakeEngine {
  const calls: FakeEngine['calls'] = { plays: [], pause: 0, resume: 0, stop: 0, destroy: 0 };
  const listeners = new Set<(state: PlayerState, id: string | null) => void>();
  let state: PlayerState = 'idle';
  let currentId: string | null = null;
  const notify = (): void => {
    for (const listener of [...listeners]) listener(state, currentId);
  };
  return {
    calls,
    force(next, id) {
      state = next;
      currentId = id;
      notify();
    },
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
      calls.plays.push({ id, text, rate });
      state = 'playing';
      currentId = id;
      notify();
    },
    pause() {
      calls.pause += 1;
      state = 'paused';
      notify();
    },
    resume() {
      calls.resume += 1;
      state = 'playing';
      notify();
    },
    stop() {
      calls.stop += 1;
      state = 'idle';
      currentId = null;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    destroy() {
      calls.destroy += 1;
      listeners.clear();
    },
  };
}

function makeDeps(engine: FakeEngine): ListeningDeps {
  return { createEngine: () => engine };
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function questionById(id: string): ListeningQuestion {
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
  const correct = buttons.find((b) => textOf(b) === rightText)!;
  const wrong = buttons.find((b) => textOf(b) !== rightText)!;
  return { correct, wrong };
}

describe('听力页 · 渲染', () => {
  it('渲染 2 段材料（标题/体裁/词数）与每段 3 道题', () => {
    const container = document.createElement('div');
    renderListening(container, makeDeps(makeFakeEngine()));

    const materials = container.querySelectorAll('.listening-material');
    expect(materials).toHaveLength(2);
    expect(container.textContent).toContain('Material 1 · A Busy but Interesting School Life');
    expect(container.textContent).toContain('独白');
    expect(container.textContent).toContain('对话');
    expect(container.textContent).toContain('词');

    expect(container.querySelectorAll('.exercise--listening')).toHaveLength(TOTAL);
    expect(container.querySelector('[data-testid="listening-stat"]')!.textContent).toContain(`已答 0 / ${TOTAL}`);
  });

  it('听力原文默认隐藏，点开可对照、再点收起', () => {
    const container = document.createElement('div');
    renderListening(container, makeDeps(makeFakeEngine()));

    const script = container.querySelector<HTMLElement>('[data-testid="script-l1"]')!;
    expect(script.hidden).toBe(true);

    const toggle = container.querySelector<HTMLButtonElement>('[data-testid="script-toggle-l1"]')!;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    click(toggle);
    expect(script.hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.textContent).toContain('收起听力原文');
    expect(script.textContent).toContain('debate club');

    click(toggle);
    expect(script.hidden).toBe(true);
    expect(toggle.textContent).toContain('查看听力原文');
  });
});

describe('听力页 · 播放器', () => {
  it('点击播放：以常速朗读全文，按钮转「暂停」，停止仅对当前材料可用', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, makeDeps(engine));

    click(container.querySelector<HTMLButtonElement>('[data-testid="play-l1"]')!);

    expect(engine.calls.plays).toHaveLength(1);
    expect(engine.calls.plays[0]!.id).toBe('l1');
    expect(engine.calls.plays[0]!.rate).toBe(1);
    expect(engine.calls.plays[0]!.text).toBe(unit1Listenings[0]!.script.join(' '));

    const play = container.querySelector<HTMLButtonElement>('[data-testid="play-l1"]')!;
    expect(play.textContent).toContain('暂停');
    expect(container.querySelector('[data-testid="player-state-l1"]')!.textContent).toBe('播放中');
    expect(container.querySelector<HTMLButtonElement>('[data-testid="stop-l1"]')!.disabled).toBe(false);
    expect(container.querySelector<HTMLButtonElement>('[data-testid="stop-l2"]')!.disabled).toBe(true);
    // 另一段的播放器不受影响
    expect(container.querySelector<HTMLButtonElement>('[data-testid="play-l2"]')!.textContent).toContain('播放');
    expect(container.querySelector('[data-testid="player-state-l2"]')!.textContent).toBe('未播放');
  });

  it('播放中再点＝暂停，暂停后点击＝继续；停止回到初始态', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, makeDeps(engine));

    const play = container.querySelector<HTMLButtonElement>('[data-testid="play-l1"]')!;
    click(play);
    click(play); // 暂停
    expect(engine.calls.pause).toBe(1);
    expect(play.textContent).toContain('继续');
    expect(container.querySelector('[data-testid="player-state-l1"]')!.textContent).toBe('已暂停');

    click(play); // 继续
    expect(engine.calls.resume).toBe(1);
    expect(play.textContent).toContain('暂停');

    click(container.querySelector<HTMLButtonElement>('[data-testid="stop-l1"]')!);
    expect(engine.calls.stop).toBe(1);
    expect(play.textContent).toContain('播放');
    expect(container.querySelector('[data-testid="player-state-l1"]')!.textContent).toBe('未播放');
    expect(container.querySelector<HTMLButtonElement>('[data-testid="stop-l1"]')!.disabled).toBe(true);
  });

  it('切换语速后播放新材料：按所选语速朗读并切换当前材料', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, makeDeps(engine));

    const rate = container.querySelector<HTMLSelectElement>('[data-testid="rate-l2"]')!;
    rate.value = '0.8';
    click(container.querySelector<HTMLButtonElement>('[data-testid="play-l2"]')!);

    expect(engine.calls.plays[0]).toMatchObject({ id: 'l2', rate: 0.8 });
    // 上一段播放器恢复「播放」初始文案
    expect(container.querySelector<HTMLButtonElement>('[data-testid="play-l1"]')!.textContent).toContain('播放');
  });

  it('环境不支持语音合成：播放/停止禁用并给出提示，题目仍可作答', () => {
    const container = document.createElement('div');
    renderListening(container, makeDeps(makeFakeEngine(false)));

    expect(container.querySelector<HTMLButtonElement>('[data-testid="play-l1"]')!.disabled).toBe(true);
    expect(container.querySelector<HTMLButtonElement>('[data-testid="stop-l1"]')!.disabled).toBe(true);
    expect(container.querySelector('[data-testid="tts-unsupported-l1"]')!.textContent).toContain('不支持语音合成');
    expect(container.querySelectorAll('.exercise--listening')).toHaveLength(TOTAL);
  });
});

describe('听力页 · 即时判分与错题统计（错题本/学习报告数据源）', () => {
  beforeEach(() => {
    // 页面错题/统计均写默认存储；同源重置保证用例独立
    clearWrongBook();
    saveStats(emptyStats());
  });

  it('答对：即时判分、锁定选项、更新进度徽标并计入统计，不入错题本', () => {
    const container = document.createElement('div');
    renderListening(container, makeDeps(makeFakeEngine()));

    const item = container.querySelector('[data-question="l1-1"]')!;
    click(optionButtons(container, 'l1-1').correct);

    expect(item.classList.contains('exercise--correct')).toBe(true);
    expect(item.textContent).toContain('解析');
    expect([...item.querySelectorAll<HTMLButtonElement>('button.option')].every((b) => b.disabled)).toBe(true);
    const stat = container.querySelector('[data-testid="listening-stat"]')!;
    expect(stat.textContent).toContain(`已答 1 / ${TOTAL}`);
    expect(stat.textContent).toContain('答对 1');
    expect(loadStats().modules.listening).toEqual({ answered: 1, correct: 1 });
    expect(loadWrongBook().entries['l1-1']).toBeUndefined();
  });

  it('答错：展示正确答案与解析，自动写入错题本（module=listening）', () => {
    const container = document.createElement('div');
    renderListening(container, makeDeps(makeFakeEngine()));

    const item = container.querySelector('[data-question="l2-1"]')!;
    click(optionButtons(container, 'l2-1').wrong);

    expect(item.classList.contains('exercise--wrong')).toBe(true);
    const result = item.querySelector('.exercise__result')!;
    expect(result.textContent).toContain('正确答案');
    expect(result.textContent).toContain(questionById('l2-1').options[questionById('l2-1').answerIndex]);
    expect(container.querySelector('[data-testid="listening-stat"]')!.textContent).toContain('答对 0');

    const entry = loadWrongBook().entries['l2-1'];
    expect(entry).toBeDefined();
    expect(entry!.module).toBe('listening');
    expect(entry!.explanation).toBe(questionById('l2-1').explanation);
    expect(loadStats().modules.listening).toEqual({ answered: 1, correct: 0 });
  });

  it('每题只能作答一次：判分后重复点击不再累计', () => {
    const container = document.createElement('div');
    renderListening(container, makeDeps(makeFakeEngine()));

    click(optionButtons(container, 'l1-2').wrong);
    click(optionButtons(container, 'l1-2').wrong);

    expect(container.querySelector('[data-testid="listening-stat"]')!.textContent).toContain(`已答 1 / ${TOTAL}`);
    expect(loadStats().modules.listening).toEqual({ answered: 1, correct: 0 });
  });
});

describe('听力页 · 生命周期', () => {
  it('返回的清理函数会销毁引擎（路由离开时停止朗读、退订状态）', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    const cleanup = renderListening(container, makeDeps(engine));

    click(container.querySelector<HTMLButtonElement>('[data-testid="play-l1"]')!);
    cleanup();

    expect(engine.calls.destroy).toBe(1);
    // 退订后状态变化不再触发页面更新（不抛异常即可）
    expect(() => engine.force('idle', null)).not.toThrow();
  });
});

describe('听力页 · 单元切换（Unit 2）', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/listening?unit=unit2');
    clearWrongBook();
    saveStats(emptyStats());
  });

  afterEach(() => {
    history.replaceState(null, '', '/listening');
  });

  it('?unit=unit2 直链渲染 Unit 2 材料（Travelling Around），作答计入 unit2 统计', () => {
    const container = document.createElement('div');
    renderListening(container, makeDeps(makeFakeEngine()));

    expect(container.querySelector('h1')!.textContent).toContain('Unit 2');
    expect(container.querySelector('h1')!.textContent).toContain('Travelling Around');
    expect(container.textContent).toContain('Material 1 · Getting Ready for London');
    expect(container.textContent).toContain('Talking about a Trip to Xi');
    expect(container.querySelectorAll('.exercise--listening')).toHaveLength(TOTAL_U2);

    const q = unit2Listenings[0]!.questions[0]!;
    const buttons = [
      ...container.querySelector(`[data-question="${q.id}"]`)!.querySelectorAll<HTMLButtonElement>('button.option'),
    ];
    const right = buttons.find((b) => b.textContent!.replace(/^[A-D]\.\s*/, '').trim() === q.options[q.answerIndex])!;
    click(right);

    expect(loadStats().units.unit2.listening).toEqual({ answered: 1, correct: 1 });
    expect(loadStats().units.unit1.listening).toEqual({ answered: 0, correct: 0 });
  });

  it('点击 Unit 1 切换按钮：销毁旧引擎并重建为 Unit 1 内容，URL 保留在单元页', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderListening(container, makeDeps(engine));

    const unit1Btn = container.querySelector<HTMLButtonElement>('[data-testid="unit-switcher"] button[data-unit="unit1"]')!;
    click(unit1Btn);

    expect(engine.calls.destroy).toBe(1);
    expect(container.textContent).toContain('Material 1 · A Busy but Interesting School Life');
    expect(container.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(location.search).toBe('');
  });
});
