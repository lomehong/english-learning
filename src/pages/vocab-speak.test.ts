import { describe, it, expect, afterEach } from 'vitest';
import { renderLearn } from './learn';
import { renderReview } from './review';
import { renderVocabulary } from './vocabulary';
import { emptyProgress, saveProgress } from '../store/progress';
import { createCard } from '../srs/sm2';
import { getWordsByUnit } from '../data/words';
import { resetUnitState } from './unit-switch';
import type { PlayerState, SpeechEngine } from '../speech/tts';
import type { VocabDeps, SpeechDeps } from './deps';

/**
 * 词汇卡朗读：学习页 / 复习页单词卡正反面「🔊 朗读单词 / 🔊 朗读例句」按钮。
 * 复用 src/speech/tts.ts 的 SpeechEngine（与听力页同一接缝），这里注入假引擎，
 * 只测页面接线与交互：按钮存在、点击调用朗读、朗读中再点停止、切换/翻页停止、
 * 点击不冒泡翻面、浏览器不支持 speechSynthesis 时隐藏按钮且不报错。
 */

const NOW = Date.UTC(2026, 0, 1);
const FIRST = getWordsByUnit('unit1')[0]!;

/* ---------- 假语音引擎（记录调用、可强制状态） ---------- */

interface FakeEngine extends SpeechEngine {
  calls: {
    plays: Array<{ id: string; text: string; rate: number }>;
    stop: number;
    destroy: number;
  };
}

function makeFakeEngine(supported = true): FakeEngine {
  const calls: FakeEngine['calls'] = { plays: [], stop: 0, destroy: 0 };
  const listeners = new Set<(state: PlayerState, id: string | null) => void>();
  let state: PlayerState = 'idle';
  let currentId: string | null = null;
  const notify = (): void => {
    for (const listener of [...listeners]) listener(state, currentId);
  };
  return {
    calls,
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
      state = 'paused';
      notify();
    },
    resume() {
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

function makeDeps(initial = emptyProgress()): VocabDeps {
  let state = initial;
  return {
    load: () => state,
    save: (p) => {
      state = p;
    },
    now: () => NOW,
  };
}

function speechDeps(engine: FakeEngine): SpeechDeps {
  return { createEngine: () => engine };
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function press(el: Element, key: string): void {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function faceButton(container: HTMLElement, face: 'front' | 'back', kind: 'word' | 'example'): HTMLButtonElement {
  return container.querySelector<HTMLButtonElement>(
    `.flip-card__face--${face} [data-testid="speak-${kind}"]`,
  )!;
}

function nextButton(container: HTMLElement): HTMLButtonElement {
  return [...container.querySelectorAll<HTMLButtonElement>('button')].find((b) =>
    b.textContent!.includes('下一个'),
  )!;
}

afterEach(() => {
  history.replaceState(null, '', '/vocabulary');
  resetUnitState();
  saveProgress(emptyProgress());
});

describe('学习页 · 单词卡朗读', () => {
  it('正面有「🔊 朗读单词」按钮，背面有「🔊 朗读例句」按钮', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps(), { speech: makeFakeEngine() });

    const wordBtn = faceButton(container, 'front', 'word');
    const exampleBtn = faceButton(container, 'back', 'example');
    expect(wordBtn.textContent).toContain('🔊 朗读单词');
    expect(exampleBtn.textContent).toContain('🔊 朗读例句');
  });

  it('点击「朗读单词」调用朗读引擎，朗读当前单词', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderLearn(container, makeDeps(), { speech: engine });

    click(faceButton(container, 'front', 'word'));

    expect(engine.calls.plays).toEqual([{ id: `${FIRST.id}:word`, text: FIRST.word, rate: 1 }]);
  });

  it('点击「朗读例句」朗读该词英文例句', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderLearn(container, makeDeps(), { speech: engine });

    click(faceButton(container, 'back', 'example'));

    expect(engine.calls.plays).toEqual([{ id: `${FIRST.id}:example`, text: FIRST.example, rate: 1 }]);
  });

  it('朗读中再次点击同一按钮 → 停止（不重复播放），按钮文案回退', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderLearn(container, makeDeps(), { speech: engine });
    const wordBtn = faceButton(container, 'front', 'word');

    const stopsBefore = engine.calls.stop;
    click(wordBtn);
    expect(wordBtn.textContent).toContain('停止');
    click(wordBtn);

    expect(engine.calls.stop).toBe(stopsBefore + 1);
    expect(engine.calls.plays.length).toBe(1);
    expect(wordBtn.textContent).toContain('🔊 朗读单词');
  });

  it('点击朗读按钮不触发卡片翻面（鼠标点击与键盘 Enter 都不翻面）', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps(), { speech: makeFakeEngine() });
    const card = container.querySelector<HTMLElement>('.flip-card')!;

    click(faceButton(container, 'front', 'word'));
    expect(card.classList.contains('flipped')).toBe(false);

    press(faceButton(container, 'back', 'example'), 'Enter');
    expect(card.classList.contains('flipped')).toBe(false);

    // 对照：点击卡片本体仍能正常翻面
    click(card);
    expect(card.classList.contains('flipped')).toBe(true);
  });

  it('翻页（下一个）时停止上一段朗读', () => {
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderLearn(container, makeDeps(), { speech: engine });

    click(faceButton(container, 'front', 'word'));
    expect(engine.state).toBe('playing');
    const stopsBefore = engine.calls.stop;

    click(nextButton(container));

    expect(engine.calls.stop).toBe(stopsBefore + 1);
    expect(engine.state).toBe('idle');
    // 新卡片的按钮回到未播放文案
    expect(faceButton(container, 'front', 'word').textContent).toContain('🔊 朗读单词');
  });

  it('浏览器不支持 speechSynthesis：隐藏按钮、不报错，卡片照常可翻面', () => {
    const container = document.createElement('div');
    expect(() => renderLearn(container, makeDeps(), { speech: makeFakeEngine(false) })).not.toThrow();

    expect(container.querySelector('[data-testid="speak-word"]')).toBeNull();
    expect(container.querySelector('[data-testid="speak-example"]')).toBeNull();

    const card = container.querySelector<HTMLElement>('.flip-card')!;
    click(card);
    expect(card.classList.contains('flipped')).toBe(true);
  });
});

describe('复习页 · 单词卡朗读', () => {
  it('复习卡同样有朗读按钮，点击调用朗读引擎', () => {
    const progress = emptyProgress();
    progress.cards[FIRST.id] = createCard(FIRST.id, NOW - 1); // 已到期
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderReview(container, makeDeps(progress), { speech: engine });

    click(faceButton(container, 'front', 'word'));
    click(faceButton(container, 'back', 'example'));

    expect(engine.calls.plays.map((p) => p.text)).toEqual([FIRST.word, FIRST.example]);
  });

  it('评分进入下一张卡时停止朗读', () => {
    const progress = emptyProgress();
    progress.cards[FIRST.id] = createCard(FIRST.id, NOW - 1);
    const engine = makeFakeEngine();
    const container = document.createElement('div');
    renderReview(container, makeDeps(progress), { speech: engine });

    click(faceButton(container, 'front', 'word'));
    const stopsBefore = engine.calls.stop;
    click(container.querySelector<HTMLButtonElement>('button[data-grade="good"]')!);

    expect(engine.calls.stop).toBe(stopsBefore + 1);
  });
});

describe('/vocabulary 页 · 朗读引擎接线', () => {
  it('学习 Tab 注入的引擎生效，路由离开时销毁引擎', () => {
    const engine = makeFakeEngine();
    const root = document.createElement('div');
    const cleanup = renderVocabulary(root, speechDeps(engine));

    expect(faceButton(root, 'front', 'word')).not.toBeNull();
    click(faceButton(root, 'front', 'word'));
    expect(engine.calls.plays.length).toBe(1);

    cleanup();
    expect(engine.calls.destroy).toBe(1);
  });

  it('切换到复习 Tab 时停止学习页正在进行的朗读', () => {
    saveProgress(emptyProgress());
    const engine = makeFakeEngine();
    const root = document.createElement('div');
    renderVocabulary(root, speechDeps(engine));

    click(faceButton(root, 'front', 'word'));
    const stopsBefore = engine.calls.stop;
    const reviewTab = [...root.querySelectorAll<HTMLButtonElement>('button.tab')].find((b) =>
      b.textContent!.includes('复习'),
    )!;
    click(reviewTab);

    expect(engine.calls.stop).toBe(stopsBefore + 1);
    expect(engine.state).toBe('idle');
  });

  it('不支持 speechSynthesis 的浏览器：词汇页正常渲染且无朗读按钮', () => {
    const engine = makeFakeEngine(false);
    const root = document.createElement('div');
    expect(() => renderVocabulary(root, speechDeps(engine))).not.toThrow();

    expect(root.querySelector('.flip-card')).not.toBeNull();
    expect(root.querySelector('[data-testid="speak-word"]')).toBeNull();
  });
});
