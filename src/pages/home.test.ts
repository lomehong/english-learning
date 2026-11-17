import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';
import { renderWriting } from './writing';
import { UNIT_STORAGE_KEY, resetUnitState } from './unit-switch';
import { getWordsByUnit } from '../data/words';
import { UNIT_IDS } from '../data/units';

/**
 * 首页全局单元切换器 ↔ 各模块联动：
 * 首页点选 → localStorage + ?unit= 同步 → 各模块页挂载读取全局单元渲染对应数据。
 */

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function switcherButton(root: HTMLElement, unit: string): HTMLButtonElement {
  return root.querySelector<HTMLButtonElement>(
    `[data-testid="unit-switcher"] button[data-unit="${unit}"]`,
  )!;
}

function storageValue(): string | null {
  // 与 store 测试同款：绕过 Node≥26 实验性全局 localStorage 遮蔽，取 jsdom 实例
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  return (g._localStorage ?? g.localStorage)?.getItem(UNIT_STORAGE_KEY) ?? null;
}

beforeEach(() => {
  resetUnitState();
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  (g._localStorage ?? g.localStorage)?.clear();
  history.replaceState(null, '', '/');
});

afterEach(() => {
  resetUnitState();
  history.replaceState(null, '', '/');
});

describe('首页 · 全局单元切换器', () => {
  it('渲染全部注册单元（Unit 1 / 2 / 3）的切换按钮，默认 Unit 1 选中', () => {
    const root = document.createElement('div');
    renderHome(root);

    const buttons = [...root.querySelectorAll('[data-testid="unit-switcher"] button')];
    expect(buttons.map((b) => (b as HTMLElement).dataset.unit)).toEqual([...UNIT_IDS]);
    expect(root.textContent).toContain('Unit 3 · Sports and Fitness');

    const active = switcherButton(root, 'unit1');
    expect(active.classList.contains('tab--active')).toBe(true);
    expect(active.getAttribute('aria-selected')).toBe('true');
    expect(switcherButton(root, 'unit3').classList.contains('tab--active')).toBe(false);
    expect(root.querySelector('[data-testid="unit-hint"]')!.textContent).toContain('Teenage Life');
  });

  it('?unit=3 深链首页：初始即 Unit 3 选中（URL → 状态）', () => {
    history.replaceState(null, '', '/?unit=3');
    const root = document.createElement('div');
    renderHome(root);

    expect(switcherButton(root, 'unit3').classList.contains('tab--active')).toBe(true);
    expect(storageValue()).toBe('unit3');
  });

  it('点击 Unit 3：localStorage 与地址栏 ?unit= 同步，选中态与提示联动', () => {
    const root = document.createElement('div');
    renderHome(root);

    click(switcherButton(root, 'unit3'));

    expect(storageValue()).toBe('unit3');
    expect(new URLSearchParams(location.search).get('unit')).toBe('unit3');
    expect(switcherButton(root, 'unit3').classList.contains('tab--active')).toBe(true);
    expect(switcherButton(root, 'unit1').classList.contains('tab--active')).toBe(false);
    expect(root.querySelector('[data-testid="unit-hint"]')!.textContent).toContain('Sports and Fitness');
  });

  it('切回 Unit 1：清除 ?unit= 参数并回写存储', () => {
    const root = document.createElement('div');
    renderHome(root);
    click(switcherButton(root, 'unit2'));
    click(switcherButton(root, 'unit1'));

    expect(storageValue()).toBe('unit1');
    expect(location.search).toBe('');
    expect(switcherButton(root, 'unit1').classList.contains('tab--active')).toBe(true);
  });
});

describe('首页切换 ↔ 各模块联动（模块页读取全局单元）', () => {
  it('首页切到 Unit 3 后，五个模块页（无 ?unit= 参数）均渲染 Unit 3 数据', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(switcherButton(home, 'unit3'));

    // 词汇：Unit 3 词表（20 词，首词 fitness）
    history.replaceState(null, '', '/vocabulary');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(vocab.querySelector('h1')!.textContent).toContain('Sports and Fitness');
    expect(vocab.querySelector<HTMLElement>('.card-nav__counter')!.textContent).toBe(
      `1 / ${getWordsByUnit('unit3').length}`,
    );
    expect(vocab.querySelector<HTMLElement>('.flip-card')!.textContent).toContain('fitness');
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.dataset.unit).toBe('unit3');

    // 语法：一般过去时 / 一般将来时 + 10 题
    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(grammar.textContent).toContain('一般过去时');
    expect(grammar.textContent).toContain('一般将来时');
    expect(grammar.querySelectorAll('.exercise')).toHaveLength(10);
    expect(grammar.querySelector('.exercise[data-exercise="u3-g1"]')).toBeTruthy();

    // 阅读：Unit 3 两篇短文
    history.replaceState(null, '', '/reading');
    const reading = document.createElement('div');
    renderReading(reading);
    expect(reading.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(reading.textContent).toContain('The Girl Who Never Gave Up');
    expect(reading.querySelectorAll('.reading-passage')).toHaveLength(2);
    expect(reading.querySelector('[data-question="u3-r1-1"]')).toBeTruthy();

    // 听力：Unit 3 两段材料
    history.replaceState(null, '', '/listening');
    const listening = document.createElement('div');
    renderListening(listening);
    expect(listening.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(listening.textContent).toContain('Preparing for the Mini-Marathon');
    expect(listening.querySelectorAll('.listening-material')).toHaveLength(2);

    // 写作：Unit 3 两个任务（含范文）
    history.replaceState(null, '', '/writing');
    const writing = document.createElement('div');
    renderWriting(writing);
    expect(writing.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(writing.querySelector('[data-task="u3-w1"]')).toBeTruthy();
    expect(writing.querySelector('[data-task="u3-w2"]')).toBeTruthy();
    expect(writing.textContent).toContain('An Unforgettable Match');
  });

  it('首页切到 Unit 2 后，模块页渲染 Unit 2 数据（回归）', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(switcherButton(home, 'unit2'));

    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Unit 2');
    expect(grammar.textContent).toContain('现在完成时');
    expect(grammar.querySelector('.exercise[data-exercise="u2-g1"]')).toBeTruthy();

    history.replaceState(null, '', '/writing');
    const writing = document.createElement('div');
    renderWriting(writing);
    expect(writing.querySelector('[data-task="u2-w1"]')).toBeTruthy();
    expect(writing.querySelector('[data-task="u3-w1"]')).toBeNull();
  });
});

describe('模块页 · 深链回退（?unit= 仍可直达）', () => {
  it('?unit=unit3 深链模块页：渲染 Unit 3 并把选择沉淀到存储', () => {
    history.replaceState(null, '', '/grammar?unit=unit3');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(storageValue()).toBe('unit3');

    // 站内再跳到无参模块页，仍沿用深链采纳的全局单元
    history.replaceState(null, '', '/vocabulary');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector<HTMLElement>('.flip-card')!.textContent).toContain('fitness');
  });

  it('?unit=99 非法深链：忽略参数回退 Unit 1，且不污染存储', () => {
    history.replaceState(null, '', '/vocabulary?unit=99');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(vocab.querySelector<HTMLElement>('.flip-card')!.textContent).toContain(
      getWordsByUnit('unit1')[0]!.word,
    );
    expect(storageValue()).toBeNull();
  });
});
