import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { resetUnitState } from './unit-switch';
import { unitIdsOfBook } from '../data/units';
import { getWordsByUnit } from '../data/words';

/**
 * 选择性必修一 · 首页两级切换器集成（纯数据新增的端到端验证）：
 * 首页册别切换器出现「选择性必修一」→ 点击后第二级列出该册 5 个单元 →
 * 各模块页自动跟随渲染选必一 Unit 1（People of Achievement）数据。
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

describe('首页 · 册别切换器出现选择性必修一（数据驱动自动出现）', () => {
  it('切换到选择性必修一：第二级自动列出该册 5 个单元，URL 与提示同步', () => {
    const root = document.createElement('div');
    renderHome(root);

    const elective1 = bookButton(root, 'elective-1');
    expect(elective1.textContent).toBe('选择性必修一');
    click(elective1);

    expect(elective1.classList.contains('tab--active')).toBe(true);
    expect(unitButtons(root)).toEqual([...unitIdsOfBook('elective-1')]);
    expect(unitButtons(root)).toEqual(['unit6', 'unit7', 'unit8', 'unit9', 'unit10']);
    expect(root.textContent).toContain('Unit 1 · People of Achievement');
    expect(root.textContent).toContain('Unit 2 · Looking into the Future');
    expect(root.textContent).toContain('Unit 3 · Fascinating Parks');
    expect(root.textContent).toContain('Unit 4 · Body Language');
    expect(root.textContent).toContain('Unit 5 · Working the Land');

    const params = new URLSearchParams(location.search);
    expect(params.get('book')).toBe('elective-1');
    expect(params.get('unit')).toBe('unit6');
    const hint = root.querySelector('[data-testid="unit-hint"]')!.textContent!;
    expect(hint).toContain('选择性必修一');
    expect(hint).toContain('People of Achievement');
  });

  it('选必一 Unit 6（册内 Unit 1）：词汇页渲染 20 词词表，徽标带册别', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(bookButton(home, 'elective-1'));

    history.replaceState(null, '', '/vocabulary');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector('h1')!.textContent).toContain('People of Achievement');
    expect(vocab.querySelector<HTMLElement>('.card-nav__counter')!.textContent).toBe(
      `1 / ${getWordsByUnit('unit6').length}`,
    );
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.dataset.unit).toBe('unit6');
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.textContent).toContain(
      '选择性必修一',
    );
  });

  it('选必一 Unit 6：语法页渲染非限制性定语从句讲解卡与 10 题（u6- 前缀）', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(bookButton(home, 'elective-1'));

    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('选择性必修一');
    expect(grammar.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(grammar.textContent).toContain('非限制性定语从句');
    expect(grammar.textContent).toContain('介词 + which / whom');
    expect(grammar.querySelectorAll('.exercise')).toHaveLength(10);
    expect(grammar.querySelector('.exercise[data-exercise="u6-g1"]')).toBeTruthy();
    expect(grammar.querySelector('.exercise[data-exercise="u1-g1"]')).toBeNull();
  });

  it('深链 ?book=选择性必修一&unit=unit8：直达 Body Language 单元（中文册名 + slug 写法）', () => {
    history.replaceState(null, '', '/?book=选择性必修一&unit=unit8');
    const root = document.createElement('div');
    renderHome(root);

    expect(bookButton(root, 'elective-1').classList.contains('tab--active')).toBe(true);
    expect(unitButtons(root)).toEqual(['unit6', 'unit7', 'unit8', 'unit9', 'unit10']);
    const active = root.querySelector<HTMLButtonElement>(
      '[data-testid="unit-switcher"] button[data-unit="unit8"]',
    )!;
    expect(active.classList.contains('tab--active')).toBe(true);
    expect(root.textContent).toContain('Body Language');
  });
});
