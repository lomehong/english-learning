import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderMistakes } from './mistakes';
import {
  emptyWrongBook,
  recordWrong,
  type WrongBook,
  type WrongInput,
} from '../store/wrongbook';
import type { MistakesDeps } from './deps';

const NOW = Date.UTC(2026, 0, 1);

function input(overrides: Partial<WrongInput> = {}): WrongInput {
  return {
    exerciseId: 'g1',
    module: 'grammar',
    stem: 'Listen! Someone ______ in the next room.',
    yourAnswer: 'sings',
    correctAnswer: 'is singing',
    explanation: '“Listen!” 提示动作此刻正在进行，用现在进行时。',
    ...overrides,
  };
}

function makeDeps(initial: WrongBook = emptyWrongBook()): MistakesDeps & { saved: WrongBook[] } {
  let state = initial;
  const saved: WrongBook[] = [];
  return {
    load: () => state,
    save: (b) => {
      state = b;
      saved.push(b);
    },
    saved,
  };
}

/** 预置一本跨模块错题：阅读 r1-1（最近）→ 语法 g1 → 词汇 w:teenage */
function sampleBook(): WrongBook {
  let book = recordWrong(emptyWrongBook(), input({ exerciseId: 'w:teenage', module: 'vocab' }), NOW);
  book = recordWrong(book, input(), NOW + 1000);
  book = recordWrong(
    book,
    input({
      exerciseId: 'r1-1',
      module: 'reading',
      stem: 'What does the writer mainly talk about?',
      yourAnswer: 'B',
      correctAnswer: 'A',
      explanation: '主旨题。',
    }),
    NOW + 2000,
  );
  return book;
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function tabOf(container: HTMLElement, module: string): HTMLButtonElement {
  return container.querySelector<HTMLButtonElement>(
    `[data-testid="mistake-filter"] button[data-module="${module}"]`,
  )!;
}

describe('错题本页 /mistakes', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    history.replaceState(null, '', '/mistakes');
  });

  afterEach(() => {
    container.remove();
    history.replaceState(null, '', '/mistakes');
  });

  it('汇总各模块错题：列出全部条目、模块徽标正确、按最近答错倒序', () => {
    renderMistakes(container, makeDeps(sampleBook()));

    const items = container.querySelectorAll('[data-testid="mistake-list"] .wrong-item');
    expect(items).toHaveLength(3);
    // 最近答错的排最前：r1-1（NOW+2000）→ g1 → w:teenage
    expect(items[0]!.getAttribute('data-exercise')).toBe('r1-1');
    expect(items[1]!.getAttribute('data-exercise')).toBe('g1');
    expect(items[2]!.getAttribute('data-exercise')).toBe('w:teenage');

    const badges = [...items].map((i) => i.querySelector('[data-testid="mistake-module"]')!.textContent);
    expect(badges).toEqual(['阅读', '语法', '词汇']);
    expect(container.querySelector('[data-testid="mistake-count"]')!.textContent).toContain('3');
  });

  it('去重：同题多次答错只占一条，累计答错次数体现为 wrongCount', () => {
    let book = recordWrong(emptyWrongBook(), input(), NOW);
    book = recordWrong(book, input({ yourAnswer: 'is dance' }), NOW + 5000);
    renderMistakes(container, makeDeps(book));

    const items = container.querySelectorAll('[data-testid="mistake-list"] .wrong-item');
    expect(items).toHaveLength(1);
    expect(items[0]!.textContent).toContain('累计答错 2 次');
  });

  it('按模块过滤：切「语法」只显示语法错题，URL 同步 ?module=grammar，计数徽标分模块正确', () => {
    renderMistakes(container, makeDeps(sampleBook()));

    expect(tabOf(container, 'grammar').textContent).toContain('1');
    expect(tabOf(container, 'reading').textContent).toContain('1');
    expect(tabOf(container, 'vocab').textContent).toContain('1');
    expect(tabOf(container, 'all').textContent).toContain('3');

    click(tabOf(container, 'grammar'));
    let items = container.querySelectorAll('[data-testid="mistake-list"] .wrong-item');
    expect(items).toHaveLength(1);
    expect(items[0]!.getAttribute('data-exercise')).toBe('g1');
    expect(tabOf(container, 'grammar').classList.contains('tab--active')).toBe(true);
    expect(new URLSearchParams(location.search).get('module')).toBe('grammar');

    click(tabOf(container, 'all'));
    items = container.querySelectorAll('[data-testid="mistake-list"] .wrong-item');
    expect(items).toHaveLength(3);
    expect(new URLSearchParams(location.search).get('module')).toBe(null);
  });

  it('深链 ?module=reading 初始即过滤为阅读错题', () => {
    history.replaceState(null, '', '/mistakes?module=reading');
    renderMistakes(container, makeDeps(sampleBook()));

    const items = container.querySelectorAll('[data-testid="mistake-list"] .wrong-item');
    expect(items).toHaveLength(1);
    expect(items[0]!.getAttribute('data-exercise')).toBe('r1-1');
    expect(tabOf(container, 'reading').classList.contains('tab--active')).toBe(true);
  });

  it('移除单条：列表即时更新并持久化，其余条目保留', () => {
    const deps = makeDeps(sampleBook());
    renderMistakes(container, deps);

    const g1 = container.querySelector<HTMLElement>('.wrong-item[data-exercise="g1"]')!;
    click(g1.querySelector<HTMLButtonElement>('[data-testid="mistake-remove"]')!);

    expect(container.querySelectorAll('[data-testid="mistake-list"] .wrong-item')).toHaveLength(2);
    expect(deps.saved.length).toBeGreaterThan(0);
    expect(deps.load().entries['g1']).toBeUndefined();
    expect(deps.load().entries['r1-1']).toBeDefined();
  });

  it('重练跳转：条目附对应模块路由链接（词汇→复习 Tab，语法/阅读→模块页）', () => {
    renderMistakes(container, makeDeps(sampleBook()));

    const hrefOf = (id: string): string =>
      container
        .querySelector<HTMLElement>(`.wrong-item[data-exercise="${id}"]`)!
        .querySelector<HTMLAnchorElement>('[data-testid="mistake-retry"]')!
        .getAttribute('href')!;
    expect(hrefOf('g1')).toBe('/grammar');
    expect(hrefOf('r1-1')).toBe('/reading');
    expect(hrefOf('w:teenage')).toBe('/vocabulary?tab=review');
  });

  it('空错题本：显示空状态与引导文案，清空按钮禁用，确认条不出现', () => {
    renderMistakes(container, makeDeps());

    expect(container.querySelector('[data-testid="mistake-empty"]')!.textContent).toContain('暂无错题');
    expect(container.querySelectorAll('[data-testid="mistake-list"] .wrong-item')).toHaveLength(0);
    expect(
      (container.querySelector('[data-testid="mistake-clear"]') as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(container.querySelector<HTMLElement>('[data-testid="mistake-clear-confirm"]')!.hidden).toBe(
      true,
    );
  });

  it('清空需二次确认：首次点击只出现确认态并显示将清除的条数，数据未动', () => {
    const deps = makeDeps(sampleBook());
    renderMistakes(container, deps);

    click(container.querySelector<HTMLButtonElement>('[data-testid="mistake-clear"]')!);

    const confirm = container.querySelector<HTMLElement>('[data-testid="mistake-clear-confirm"]')!;
    expect(confirm.hidden).toBe(false);
    expect(confirm.textContent).toContain('3');
    // 未确认前不落盘：列表与存储都保持原样
    expect(container.querySelectorAll('[data-testid="mistake-list"] .wrong-item')).toHaveLength(3);
    expect(deps.saved).toHaveLength(0);
    expect(Object.keys(deps.load().entries)).toHaveLength(3);
  });

  it('取消清空：确认条收起，条目与存储均不变', () => {
    const deps = makeDeps(sampleBook());
    renderMistakes(container, deps);
    click(container.querySelector<HTMLButtonElement>('[data-testid="mistake-clear"]')!);

    click(container.querySelector<HTMLButtonElement>('[data-testid="mistake-clear-cancel"]')!);

    expect(container.querySelector<HTMLElement>('[data-testid="mistake-clear-confirm"]')!.hidden).toBe(
      true,
    );
    expect(container.querySelectorAll('[data-testid="mistake-list"] .wrong-item')).toHaveLength(3);
    expect(deps.saved).toHaveLength(0);
    expect(Object.keys(deps.load().entries)).toHaveLength(3);
  });

  it('确认清空：移除所有条目并持久化空本，确认条收起、按钮回到禁用', () => {
    const deps = makeDeps(sampleBook());
    renderMistakes(container, deps);
    click(container.querySelector<HTMLButtonElement>('[data-testid="mistake-clear"]')!);

    click(container.querySelector<HTMLButtonElement>('[data-testid="mistake-clear-ok"]')!);

    expect(container.querySelectorAll('[data-testid="mistake-list"] .wrong-item')).toHaveLength(0);
    expect(container.querySelector<HTMLElement>('[data-testid="mistake-empty"]')!.hidden).toBe(false);
    expect(deps.saved).toHaveLength(1);
    expect(deps.saved[0]!.entries).toEqual({});
    expect(deps.load().entries).toEqual({});
    expect(container.querySelector<HTMLElement>('[data-testid="mistake-clear-confirm"]')!.hidden).toBe(
      true,
    );
    expect(
      (container.querySelector('[data-testid="mistake-clear"]') as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('确认期间移除单条：确认条数量同步为最新条数', () => {
    renderMistakes(container, makeDeps(sampleBook()));
    click(container.querySelector<HTMLButtonElement>('[data-testid="mistake-clear"]')!);
    expect(
      container.querySelector<HTMLElement>('[data-testid="mistake-clear-confirm"]')!.textContent,
    ).toContain('3');

    const g1 = container.querySelector<HTMLElement>('.wrong-item[data-exercise="g1"]')!;
    click(g1.querySelector<HTMLButtonElement>('[data-testid="mistake-remove"]')!);

    expect(
      container.querySelector<HTMLElement>('[data-testid="mistake-clear-confirm"]')!.textContent,
    ).toContain('2');
  });

  it('过滤后清空该模块最后一题：切换为该过滤下的空状态', () => {
    const deps = makeDeps(sampleBook());
    renderMistakes(container, deps);

    click(tabOf(container, 'vocab'));
    const item = container.querySelector<HTMLElement>('.wrong-item[data-exercise="w:teenage"]')!;
    click(item.querySelector<HTMLButtonElement>('[data-testid="mistake-remove"]')!);

    expect(container.querySelectorAll('[data-testid="mistake-list"] .wrong-item')).toHaveLength(0);
    expect(container.querySelector('[data-testid="mistake-empty"]')!.textContent).toContain('词汇');
    // 其他模块条目仍在错题本中
    expect(deps.load().entries['g1']).toBeDefined();
  });
});
