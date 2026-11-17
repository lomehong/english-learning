import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';
import { renderWriting } from './writing';
import { UNIT_STORAGE_KEY, BOOK_STORAGE_KEY, resetUnitState } from './unit-switch';
import { getWordsByUnit } from '../data/words';
import { unitIdsOfBook, UNIT_IDS } from '../data/units';

/**
 * 必修二（required-2 · unit16–unit20）· 首页两级切换器与模块联动回归：
 * 册别切换器出现必修二 → 第二级自动渲染该册五单元 → 模块页渲染对应册 + 单元数据。
 * （rebase 说明：原 PR 单元文件 unit6–unit10 全局改编号为 unit16–unit20，
 * 　与选择性必修一 unit6–unit10 的既有占用错开，内部条目前缀同步 u16–u20。）
 */

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function switcherButton(root: HTMLElement, unit: string): HTMLButtonElement {
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

function storageValue(): string | null {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  return (g._localStorage ?? g.localStorage)?.getItem(UNIT_STORAGE_KEY) ?? null;
}

function bookStorageValue(): string | null {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  return (g._localStorage ?? g.localStorage)?.getItem(BOOK_STORAGE_KEY) ?? null;
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

describe('首页 · 册别切换器出现必修二（纯数据自动纳入）', () => {
  it('第一级七册含「必修二」，默认不选中；点击后第二级自动渲染该册五个单元', () => {
    const root = document.createElement('div');
    renderHome(root);

    const book2 = bookButton(root, 'required-2');
    expect(book2.textContent).toContain('必修二');
    expect(book2.classList.contains('tab--active')).toBe(false);

    click(book2);

    expect(book2.classList.contains('tab--active')).toBe(true);
    expect(unitButtons(root)).toEqual(['unit16', 'unit17', 'unit18', 'unit19', 'unit20']);
    expect(switcherButton(root, 'unit16').textContent).toContain('Unit 1 · Cultural Heritage');
    expect(switcherButton(root, 'unit17').textContent).toContain('Unit 2 · Wildlife Protection');
    expect(switcherButton(root, 'unit18').textContent).toContain('Unit 3 · The Internet');
    expect(switcherButton(root, 'unit19').textContent).toContain('Unit 4 · History and Traditions');
    expect(switcherButton(root, 'unit20').textContent).toContain('Unit 5 · Music');
    // 切册后单元自动落到册内第一个单元（原全局单元不在该册）
    expect(switcherButton(root, 'unit16').classList.contains('tab--active')).toBe(true);
    expect(root.querySelector('[data-testid="unit-empty"]')).toBeNull();
    expect(root.querySelector('[data-testid="unit-hint"]')!.textContent).toContain('必修二');
    expect(root.querySelector('[data-testid="unit-hint"]')!.textContent).toContain('文化遗产');
  });

  it('切到必修二并点选 Unit 3（unit18）：册 + 单元双写存储，URL 同步 ?book=&unit=', () => {
    const root = document.createElement('div');
    renderHome(root);

    click(bookButton(root, 'required-2'));
    click(switcherButton(root, 'unit18'));

    expect(bookStorageValue()).toBe('required-2');
    expect(storageValue()).toBe('unit18');
    const params = new URLSearchParams(location.search);
    expect(params.get('book')).toBe('required-2');
    expect(params.get('unit')).toBe('unit18');
  });

  it('?book=required-2 深链首页：册选中，单元落到册内第一个（unit16）并沉淀存储', () => {
    history.replaceState(null, '', '/?book=required-2');
    const root = document.createElement('div');
    renderHome(root);

    expect(bookButton(root, 'required-2').classList.contains('tab--active')).toBe(true);
    expect(unitButtons(root)).toEqual(unitIdsOfBook('required-2'));
    expect(switcherButton(root, 'unit16').classList.contains('tab--active')).toBe(true);
    expect(bookStorageValue()).toBe('required-2');
    expect(storageValue()).toBe('unit16');
  });

  it('中文册名 + 规范单元 id 深链（?book=必修二&unit=unit18）：命中必修二 Unit 3', () => {
    history.replaceState(null, '', '/?book=必修二&unit=unit18');
    const root = document.createElement('div');
    renderHome(root);

    expect(bookButton(root, 'required-2').classList.contains('tab--active')).toBe(true);
    expect(switcherButton(root, 'unit18').classList.contains('tab--active')).toBe(true);
    expect(storageValue()).toBe('unit18');
  });

  it('注册表全部单元均可切换（含必修二五单元）', () => {
    expect(UNIT_IDS).toContain('unit16');
    const root = document.createElement('div');
    renderHome(root);
    for (const id of unitIdsOfBook('required-2')) {
      click(bookButton(root, 'required-2'));
      click(switcherButton(root, id));
      expect(storageValue()).toBe(id);
    }
  });
});

describe('首页切到必修二后 · 五个模块页渲染对应数据（册 + 单元联动）', () => {
  it('选中 Unit 1（unit16 · Cultural Heritage）后，词汇 / 语法 / 阅读 / 听力 / 写作均渲染必修二数据', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(bookButton(home, 'required-2'));
    click(switcherButton(home, 'unit16'));

    // 词汇：必修二 Unit 1 词表（20 词，首词 heritage）
    history.replaceState(null, '', '/vocabulary');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector('h1')!.textContent).toContain('必修二');
    expect(vocab.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(vocab.querySelector('h1')!.textContent).toContain('Cultural Heritage');
    expect(vocab.querySelector<HTMLElement>('.card-nav__counter')!.textContent).toBe(
      `1 / ${getWordsByUnit('unit16').length}`,
    );
    expect(vocab.querySelector<HTMLElement>('.flip-card')!.textContent).toContain('heritage');
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.dataset.unit).toBe('unit16');

    // 语法：关系副词 / 介词 + 关系代词 + 10 题
    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Cultural Heritage');
    expect(grammar.textContent).toContain('关系副词');
    expect(grammar.textContent).toContain('介词');
    expect(grammar.querySelectorAll('.exercise')).toHaveLength(10);
    expect(grammar.querySelector('.exercise[data-exercise="u16-g1"]')).toBeTruthy();

    // 阅读：两篇短文 + 生词可点
    history.replaceState(null, '', '/reading');
    const reading = document.createElement('div');
    renderReading(reading);
    expect(reading.querySelector('h1')!.textContent).toContain('Cultural Heritage');
    expect(reading.textContent).toContain('Guardians of the Old Temple');
    expect(reading.querySelectorAll('.reading-passage')).toHaveLength(2);
    expect(reading.querySelector('[data-question="u16-r1-1"]')).toBeTruthy();

    // 听力：两段材料
    history.replaceState(null, '', '/listening');
    const listening = document.createElement('div');
    renderListening(listening);
    expect(listening.querySelector('h1')!.textContent).toContain('Cultural Heritage');
    expect(listening.textContent).toContain('A Visit to the History Museum');
    expect(listening.querySelectorAll('.listening-material')).toHaveLength(2);

    // 写作：两个任务（含范文）
    history.replaceState(null, '', '/writing');
    const writing = document.createElement('div');
    renderWriting(writing);
    expect(writing.querySelector('h1')!.textContent).toContain('Cultural Heritage');
    expect(writing.querySelector('[data-task="u16-w1"]')).toBeTruthy();
    expect(writing.querySelector('[data-task="u16-w2"]')).toBeTruthy();
  });

  it('选中 Unit 5（unit20 · Music）后，语法页渲染过去分词与省略并显示册别徽标', () => {
    const home = document.createElement('div');
    renderHome(home);
    click(bookButton(home, 'required-2'));
    click(switcherButton(home, 'unit20'));

    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Music');
    expect(grammar.textContent).toContain('过去分词作状语');
    expect(grammar.textContent).toContain('状语从句中的省略');
    const badge = grammar.querySelector<HTMLElement>('[data-testid="current-unit"]')!;
    expect(badge.dataset.unit).toBe('unit20');
    expect(badge.dataset.book).toBe('required-2');
    expect(badge.textContent).toContain('必修二');
  });
});
