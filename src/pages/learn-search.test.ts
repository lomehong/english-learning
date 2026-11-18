import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderLearn } from './learn';
import { renderVocabulary } from './vocabulary';
import { resetUnitState } from './unit-switch';
import { emptyProgress, saveProgress } from '../store/progress';
import { getWordsByUnit } from '../data/words';
import type { VocabDeps } from './deps';

/**
 * 词汇学习页「单元内搜索」的 UI 行为：
 * 实时过滤 / 匹配数 / 点击或回车跳到词卡 / 一键清空 / ?q= 深链。
 * 过滤算法本身在 vocab-search.test.ts 单测，这里只测页面接线。
 */

const NOW = Date.UTC(2026, 0, 1);

function makeDeps(initial = emptyProgress()): VocabDeps & { saved: unknown[] } {
  let state = initial;
  const saved: unknown[] = [];
  return {
    load: () => state,
    save: (p) => {
      state = p;
      saved.push(p);
    },
    now: () => NOW,
    saved,
  };
}

function type(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function pressEnter(input: HTMLInputElement): void {
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function searchInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector<HTMLInputElement>('[data-testid="vocab-search"]')!;
}

function countText(container: HTMLElement): string {
  return container.querySelector<HTMLElement>('[data-testid="vocab-search-count"]')!.textContent!;
}

function resultIds(container: HTMLElement): string[] {
  return [...container.querySelectorAll<HTMLElement>('[data-testid="vocab-search-result"]')].map(
    (el) => el.dataset.wordId!,
  );
}

function counterText(container: HTMLElement): string {
  return container.querySelector<HTMLElement>('.card-nav__counter')!.textContent!;
}

describe('学习页 · 单元内搜索 UI', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/vocabulary');
  });

  afterEach(() => {
    history.replaceState(null, '', '/vocabulary');
  });

  it('渲染搜索框与匹配数；关键词为空时结果列表 / 清空按钮隐藏', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps());

    const input = searchInput(container);
    expect(input.placeholder).toContain('搜索本单元单词');
    expect(input.value).toBe('');
    expect(countText(container)).toBe('匹配 20 / 20 词');
    expect(container.querySelector<HTMLElement>('[data-testid="vocab-search-results"]')!.hidden).toBe(true);
    expect(container.querySelector<HTMLElement>('[data-testid="vocab-search-clear"]')!.hidden).toBe(true);
  });

  it('输入英文实时过滤当前单元词表并显示匹配数', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps());
    const input = searchInput(container);

    type(input, 'teen');
    expect(countText(container)).toBe('匹配 2 / 20 词');
    expect(resultIds(container)).toEqual(['teenage', 'teenager']);
    expect(container.querySelector<HTMLElement>('[data-testid="vocab-search-results"]')!.hidden).toBe(false);

    type(input, 'APP');
    expect(countText(container)).toBe('匹配 0 / 20 词'); // Unit 1 无 apply
  });

  it('输入中文按释义过滤（志愿者 → volunteer）', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps());

    type(searchInput(container), '志愿者');
    expect(countText(container)).toBe('匹配 1 / 20 词');
    expect(resultIds(container)).toEqual(['volunteer']);
  });

  it('无匹配时显示空态提示，匹配数为 0', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps());

    type(searchInput(container), 'zzzz');
    expect(countText(container)).toBe('匹配 0 / 20 词');
    expect(resultIds(container)).toEqual([]);
    const empty = container.querySelector<HTMLElement>('[data-testid="vocab-search-empty"]')!;
    expect(empty.hidden).toBe(false);
    expect(empty.textContent).toContain('没有匹配的单词');
  });

  it('回车跳到首个匹配词的卡片，URL 保留 ?q=', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps());
    const input = searchInput(container);

    type(input, 'volunteer');
    pressEnter(input);

    expect(counterText(container)).toBe('4 / 20'); // volunteer 是 Unit 1 第 4 词
    expect(container.querySelector<HTMLElement>('.flip-card')!.textContent).toContain('volunteer');
    expect(new URLSearchParams(location.search).get('q')).toBe('volunteer');
  });

  it('点击结果跳到该词卡片', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps());
    const input = searchInput(container);

    type(input, 'ballet');
    const result = container.querySelector<HTMLElement>('[data-testid="vocab-search-result"][data-word-id="ballet"]');
    expect(result).not.toBeNull();
    click(result!);

    expect(counterText(container)).toBe('3 / 20'); // ballet 是 Unit 1 第 3 词
    expect(container.querySelector<HTMLElement>('.flip-card')!.textContent).toContain('ballet');
  });

  it('一键清空：恢复完整词表、移除 ?q= 并隐藏结果区', () => {
    const container = document.createElement('div');
    renderLearn(container, makeDeps());
    const input = searchInput(container);

    type(input, 'ballet');
    expect(resultIds(container)).toEqual(['ballet']);
    history.replaceState(null, '', '/vocabulary?q=ballet'); // 模拟已同步的地址栏
    const clear = container.querySelector<HTMLButtonElement>('[data-testid="vocab-search-clear"]')!;
    expect(clear.hidden).toBe(false);
    click(clear);

    expect(input.value).toBe('');
    expect(countText(container)).toBe('匹配 20 / 20 词');
    expect(resultIds(container)).toEqual([]);
    expect(container.querySelector<HTMLElement>('[data-testid="vocab-search-results"]')!.hidden).toBe(true);
    expect(clear.hidden).toBe(true);
    expect(new URLSearchParams(location.search).get('q')).toBeNull();
  });

  it('标记已学后重渲染仍保留搜索关键词与结果', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderLearn(container, deps);

    type(searchInput(container), 'ballet');
    const mark = [...container.querySelectorAll('button')].find((b) =>
      b.textContent!.includes('标记已学'),
    )!;
    click(mark);

    expect(deps.saved.length).toBe(1);
    expect(searchInput(container).value).toBe('ballet');
    expect(countText(container)).toBe('匹配 1 / 20 词');
    expect(resultIds(container)).toEqual(['ballet']);
  });
});

describe('学习页 · ?q= 深链', () => {
  afterEach(() => {
    history.replaceState(null, '', '/vocabulary');
    resetUnitState();
    saveProgress(emptyProgress());
  });

  it('?q= 深链：输入框回填、词表过滤并定位到首个匹配词卡片', () => {
    history.replaceState(null, '', '/vocabulary?unit=unit2&q=app');
    const container = document.createElement('div');
    renderLearn(container, makeDeps(), { unit: 'unit2' });

    expect(searchInput(container).value).toBe('app');
    expect(countText(container)).toBe('匹配 1 / 20 词');
    expect(resultIds(container)).toEqual(['apply']);
    expect(counterText(container)).toBe('1 / 20');
    expect(container.querySelector<HTMLElement>('.flip-card')!.textContent).toContain('apply');
    // 深链参数不被破坏
    expect(new URLSearchParams(location.search).get('unit')).toBe('unit2');
    expect(new URLSearchParams(location.search).get('q')).toBe('app');
  });

  it('?q= 无匹配深链：卡片回退首个未学词，提示无匹配', () => {
    history.replaceState(null, '', '/vocabulary?unit=unit2&q=zzzz');
    const container = document.createElement('div');
    renderLearn(container, makeDeps(), { unit: 'unit2' });

    expect(searchInput(container).value).toBe('zzzz');
    expect(countText(container)).toBe('匹配 0 / 20 词');
    expect(container.querySelector<HTMLElement>('[data-testid="vocab-search-empty"]')!.hidden).toBe(false);
    expect(counterText(container)).toBe(`1 / ${getWordsByUnit('unit2').length}`);
  });

  it('/vocabulary 容器直链 ?unit=unit2&q=visa：学习 Tab 内即过滤（含标题与单元徽标）', () => {
    history.replaceState(null, '', '/vocabulary?unit=unit2&q=visa');
    saveProgress(emptyProgress());
    const container = document.createElement('div');
    renderVocabulary(container);

    expect(container.querySelector('h1')!.textContent).toContain('Unit 2');
    expect(container.querySelector<HTMLElement>('[data-testid="current-unit"]')!.dataset.unit).toBe('unit2');
    expect(searchInput(container).value).toBe('visa');
    expect(countText(container)).toBe('匹配 2 / 20 词'); // apply 释义含「申请签证」也命中
    expect(resultIds(container)).toEqual(['apply', 'visa']);
  });
});
