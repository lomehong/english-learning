import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';
import { renderWriting } from './writing';
import { UNIT_STORAGE_KEY, BOOK_STORAGE_KEY, resetUnitState, unitFromParam } from './unit-switch';
import { unitIdsOfBook } from '../data/units';
import { getWordsByUnit } from '../data/words';

/**
 * 必修三纯数据新增后的首页两级切换器与模块联动：
 * - 册别切换器（七册固定维度）出现必修三分组 → 第二级自动渲染 unit6-10（不再是空册占位）；
 * - 点选必修三单元 → localStorage 与 ?book=&unit= 同步 → 各模块页渲染该册该单元数据。
 */

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function bookButton(root: HTMLElement, book: string): HTMLButtonElement {
  return root.querySelector<HTMLButtonElement>(
    `[data-testid="book-switcher"] button[data-book="${book}"]`,
  )!;
}

function unitButton(root: HTMLElement, unit: string): HTMLButtonElement {
  return root.querySelector<HTMLButtonElement>(
    `[data-testid="unit-switcher"] button[data-unit="${unit}"]`,
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
  it('册别切换器含必修三：点击后第二级渲染 unit6-10，不再是空册占位；存储与 URL 三处同步', () => {
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
    // 册切换的默认落点：该册首个单元 unit6
    expect(unitButton(root, 'unit6').classList.contains('tab--active')).toBe(true);
    // localStorage + ?book= & ?unit= 同步
    expect(storageValue(BOOK_STORAGE_KEY)).toBe('required-3');
    expect(storageValue(UNIT_STORAGE_KEY)).toBe('unit6');
    expect(new URLSearchParams(location.search).get('book')).toBe('required-3');
    expect(new URLSearchParams(location.search).get('unit')).toBe('unit6');
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

  it('?book=必修三 深链（中文册名写法）：册命中，单元回退该册首个 unit6', () => {
    history.replaceState(null, '', '/?book=必修三');
    const root = document.createElement('div');
    renderHome(root);

    expect(bookButton(root, 'required-3').classList.contains('tab--active')).toBe(true);
    expect(unitButtons(root)).toEqual([...unitIdsOfBook('required-3')]);
    expect(storageValue(BOOK_STORAGE_KEY)).toBe('required-3');
    expect(storageValue(UNIT_STORAGE_KEY)).toBe('unit6');
  });

  it('数字写法深链语义（多册 no 重复）：?unit=N 解析到注册表末册（必修三）的同号单元，规范写法不受影响', () => {
    // UNIT_PARAM_SPELLINGS 按「单元号 → 单元」顺序构建，必修三 unit6-10（no=1-5）覆盖必修一的同号映射；
    // 这是册维度扩展后数字写法的既定解析口径（规范写法 unit1…unit10 始终唯一）。
    expect(unitFromParam('unit2')).toBe('unit2');
    expect(unitFromParam('unit8')).toBe('unit8');
    expect(unitFromParam('2')).toBe('unit7');
    expect(unitFromParam('5')).toBe('unit10');
  });
});

describe('首页 ↔ 模块页联动 · 必修三单元（以 unit8 Diverse Cultures 为例）', () => {
  it('首页切到必修三 Unit 3 后，五个模块页渲染 unit8 数据（册 + 单元两级跟随）', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(bookButton(home, 'required-3'));
    click(unitButton(home, 'unit8'));
    expect(storageValue(UNIT_STORAGE_KEY)).toBe('unit8');

    // 词汇：unit8 词表（首词 diverse）
    history.replaceState(null, '', '/vocabulary');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(vocab.querySelector('h1')!.textContent).toContain('Diverse Cultures');
    expect(vocab.querySelector('h1')!.textContent).toContain('必修三');
    expect(vocab.querySelector<HTMLElement>('.card-nav__counter')!.textContent).toBe(
      `1 / ${getWordsByUnit('unit8').length}`,
    );
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.dataset.unit).toBe('unit8');
    expect(vocab.querySelector<HTMLElement>('.flip-card')!.textContent).toContain('diverse');

    // 语法：主谓一致 + 10 题（u8- 前缀）
    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Diverse Cultures');
    expect(grammar.textContent).toContain('主谓一致');
    expect(grammar.querySelectorAll('.exercise')).toHaveLength(10);
    expect(grammar.querySelector('.exercise[data-exercise="u8-g1"]')).toBeTruthy();

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

    // 写作：2 个任务（u8-w1 / u8-w2，含范文）
    history.replaceState(null, '', '/writing');
    const writing = document.createElement('div');
    renderWriting(writing);
    expect(writing.querySelector('[data-task="u8-w1"]')).toBeTruthy();
    expect(writing.querySelector('[data-task="u8-w2"]')).toBeTruthy();
  });
});
