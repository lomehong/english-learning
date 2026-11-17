import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';
import { renderWriting } from './writing';
import { UNIT_STORAGE_KEY, BOOK_STORAGE_KEY, resetUnitState } from './unit-switch';
import { getWordsByUnit } from '../data/words';
import { unitIdsOfBook } from '../data/units';

/**
 * 必修三（required-3 · unit21–unit25）· 首页两级切换器与模块联动回归：
 * 册别切换器出现必修三 → 第二级自动渲染该册五单元 → 模块页渲染对应册 + 单元数据。
 * （rebase 说明：原 PR 单元文件 unit6–unit10 全局改编号为 unit21–unit25，
 * 　与选择性必修一 unit6–unit10 的既有占用错开，内部条目前缀同步 u21–u25。）
 */

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function unitButton(root: HTMLElement, unit: string): HTMLButtonElement {
  return root.querySelector<HTMLButtonElement>(
    `[data-testid="unit-switcher"] button[data-unit="${unit}"]`,
  )!;
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

function storageValue(key: string): string | null {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  return (g._localStorage ?? g.localStorage)?.getItem(key) ?? null;
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

describe('首页 · 必修三册别切换（纯数据新增后自动出现）', () => {
  it('册别切换器含必修三：点击后第二级渲染 unit21-25，不再是空册占位；存储与 URL 三处同步', () => {
    const root = document.createElement('div');
    renderHome(root);

    const book3 = bookButton(root, 'required-3');
    expect(book3.textContent).toBe('必修三');
    expect(book3.classList.contains('tab--active')).toBe(false);

    click(book3);

    expect(book3.classList.contains('tab--active')).toBe(true);
    expect(book3.getAttribute('aria-selected')).toBe('true');
    expect(root.querySelector('[data-testid="unit-empty"]')).toBeNull();
    expect(unitButtons(root)).toEqual([...unitIdsOfBook('required-3')]);
    // 册切换的默认落点：该册首个单元 unit21
    expect(unitButton(root, 'unit21').classList.contains('tab--active')).toBe(true);
    // localStorage + ?book= & ?unit= 同步
    expect(storageValue(BOOK_STORAGE_KEY)).toBe('required-3');
    expect(storageValue(UNIT_STORAGE_KEY)).toBe('unit21');
    expect(new URLSearchParams(location.search).get('book')).toBe('required-3');
    expect(new URLSearchParams(location.search).get('unit')).toBe('unit21');
  });

  it('第二级按钮带教材单元标题：Unit 1 Festivals … Unit 5 The Value of Money', () => {
    const root = document.createElement('div');
    renderHome(root);
    click(bookButton(root, 'required-3'));

    const texts = [...root.querySelectorAll('[data-testid="unit-switcher"] button')].map(
      (b) => b.textContent,
    );
    expect(texts).toHaveLength(5);
    expect(texts[0]).toContain('Unit 1');
    expect(texts[0]).toContain('Festivals and Celebrations');
    expect(texts[1]).toContain('Unit 2');
    expect(texts[1]).toContain('Morals and Virtues');
    expect(texts[2]).toContain('Unit 3');
    expect(texts[2]).toContain('Diverse Cultures');
    expect(texts[3]).toContain('Unit 4');
    expect(texts[3]).toContain('Space Exploration');
    expect(texts[4]).toContain('Unit 5');
    expect(texts[4]).toContain('The Value of Money');
  });

  it('?book=必修三 深链（中文册名写法）：册命中，单元回退该册首个 unit21', () => {
    history.replaceState(null, '', '/?book=必修三');
    const root = document.createElement('div');
    renderHome(root);

    expect(bookButton(root, 'required-3').classList.contains('tab--active')).toBe(true);
    expect(unitButtons(root)).toEqual([...unitIdsOfBook('required-3')]);
    expect(storageValue(BOOK_STORAGE_KEY)).toBe('required-3');
    expect(storageValue(UNIT_STORAGE_KEY)).toBe('unit21');
  });
});

describe('首页 ↔ 模块页联动 · 必修三单元（以 unit23 Diverse Cultures 为例）', () => {
  it('首页切到必修三 Unit 3 后，五个模块页渲染 unit23 数据（册 + 单元两级跟随）', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(bookButton(home, 'required-3'));
    click(unitButton(home, 'unit23'));
    expect(storageValue(UNIT_STORAGE_KEY)).toBe('unit23');

    // 词汇：unit23 词表（20 词）
    history.replaceState(null, '', '/vocabulary');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(vocab.querySelector('h1')!.textContent).toContain('Diverse Cultures');
    expect(vocab.querySelector('h1')!.textContent).toContain('必修三');
    expect(vocab.querySelector<HTMLElement>('.card-nav__counter')!.textContent).toBe(
      `1 / ${getWordsByUnit('unit23').length}`,
    );
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.dataset.unit).toBe('unit23');

    // 语法：主谓一致 + 10 题（u23- 前缀）
    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Diverse Cultures');
    expect(grammar.textContent).toContain('主谓一致');
    expect(grammar.querySelectorAll('.exercise')).toHaveLength(10);
    expect(grammar.querySelector('.exercise[data-exercise="u23-g1"]')).toBeTruthy();

    // 阅读：2 篇主题短文
    history.replaceState(null, '', '/reading');
    const reading = document.createElement('div');
    renderReading(reading);
    expect(reading.querySelectorAll('.reading-passage')).toHaveLength(2);
    expect(reading.textContent).toContain('A Food Adventure Downtown');

    // 听力：2 段主题材料
    history.replaceState(null, '', '/listening');
    const listening = document.createElement('div');
    renderListening(listening);
    expect(listening.querySelectorAll('.listening-material')).toHaveLength(2);
    expect(listening.querySelector('h1')!.textContent).toContain('Unit 3');

    // 写作：2 个任务（u23-w1 / u23-w2，含范文）
    history.replaceState(null, '', '/writing');
    const writing = document.createElement('div');
    renderWriting(writing);
    expect(writing.querySelector('[data-task="u23-w1"]')).toBeTruthy();
    expect(writing.querySelector('[data-task="u23-w2"]')).toBeTruthy();
  });
});
