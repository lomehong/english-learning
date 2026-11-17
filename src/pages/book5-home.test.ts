import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { resetUnitState } from './unit-switch';
import { unitIdsOfBook } from '../data/units';
import { getWordsByUnit } from '../data/words';

/**
 * 选择性必修二 · 首页两级切换器集成（纯数据新增的端到端验证）：
 * 首页册别切换器出现「选择性必修二」→ 点击后第二级列出该册 5 个单元 →
 * 各模块页自动跟随渲染选必二 Unit 1（Science and Scientists）数据。
 */

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function bookButton(root: HTMLElement, book: string): HTMLButtonElement {
  return root.querySelector<HTMLButtonElement>(
    `[data-testid="book-switcher"] button[data-book="${book}"]`,
  )!;
}

function unitButtons(root: HTMLElement): string[] {
  return [...root.querySelectorAll('[data-testid="unit-switcher"] button')].map(
    (b) => (b as HTMLElement).dataset.unit!,
  );
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

describe('首页 · 册别切换器出现选择性必修二（数据驱动自动出现）', () => {
  it('切换到选择性必修二：第二级自动列出该册 5 个单元，URL 与提示同步', () => {
    const root = document.createElement('div');
    renderHome(root);

    const elective2 = bookButton(root, 'elective-2');
    expect(elective2.textContent).toBe('选择性必修二');
    click(elective2);

    expect(elective2.classList.contains('tab--active')).toBe(true);
    expect(unitButtons(root)).toEqual([...unitIdsOfBook('elective-2')]);
    expect(unitButtons(root)).toEqual(['unit11', 'unit12', 'unit13', 'unit14', 'unit15']);
    expect(root.textContent).toContain('Unit 1 · Science and Scientists');
    expect(root.textContent).toContain('Unit 2 · Bridging Cultures');
    expect(root.textContent).toContain('Unit 3 · Food and Culture');
    expect(root.textContent).toContain('Unit 4 · Journey Across a Vast Land');
    expect(root.textContent).toContain('Unit 5 · First Aid');

    const params = new URLSearchParams(location.search);
    expect(params.get('book')).toBe('elective-2');
    expect(params.get('unit')).toBe('unit11');
    const hint = root.querySelector('[data-testid="unit-hint"]')!.textContent!;
    expect(hint).toContain('选择性必修二');
    expect(hint).toContain('Science and Scientists');
  });

  it('选必二 Unit 11（册内 Unit 1）：词汇页渲染 20 词词表，徽标带册别', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(bookButton(home, 'elective-2'));

    history.replaceState(null, '', '/vocabulary');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector('h1')!.textContent).toContain('Science and Scientists');
    expect(vocab.querySelector<HTMLElement>('.card-nav__counter')!.textContent).toBe(
      `1 / ${getWordsByUnit('unit11').length}`,
    );
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.dataset.unit).toBe('unit11');
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.textContent).toContain(
      '选择性必修二',
    );
  });

  it('选必二 Unit 11：语法页渲染过去分词讲解卡与 10 题（u11- 前缀）', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(bookButton(home, 'elective-2'));

    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('选择性必修二');
    expect(grammar.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(grammar.textContent).toContain('过去分词（-ed 形式）作定语');
    expect(grammar.textContent).toContain('过去分词（-ed 形式）作状语');
    expect(grammar.querySelectorAll('.exercise')).toHaveLength(10);
    expect(grammar.querySelector('.exercise[data-exercise="u11-g1"]')).toBeTruthy();
    expect(grammar.querySelector('.exercise[data-exercise="u1-g1"]')).toBeNull();
  });

  it('深链 ?book=选择性必修二&unit=unit13：直达 Food and Culture 单元（中文册名 + slug 写法）', () => {
    history.replaceState(null, '', '/?book=选择性必修二&unit=unit13');
    const root = document.createElement('div');
    renderHome(root);

    expect(bookButton(root, 'elective-2').classList.contains('tab--active')).toBe(true);
    expect(unitButtons(root)).toEqual(['unit11', 'unit12', 'unit13', 'unit14', 'unit15']);
    const active = root.querySelector<HTMLButtonElement>(
      '[data-testid="unit-switcher"] button[data-unit="unit13"]',
    )!;
    expect(active.classList.contains('tab--active')).toBe(true);
    expect(root.textContent).toContain('Food and Culture');
  });
});
