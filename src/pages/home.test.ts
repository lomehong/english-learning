import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';
import { renderWriting } from './writing';
import { UNIT_STORAGE_KEY, BOOK_STORAGE_KEY, resetUnitState } from './unit-switch';
import { getWordsByUnit } from '../data/words';
import { BOOKS, BOOK_IDS, BOOK_LABELS, unitIdsOfBook, type BookId } from '../data/units';

/**
 * 首页两级切换器（册 + 单元）↔ 各模块联动：
 * 首页选册 → 第二级单元列表重建为该册单元 → 点选单元 → localStorage + ?book=&unit= 同步
 * → 各模块页挂载读取全局「册 + 单元」渲染对应数据。
 */

/** 当前尚未收录单元数据的第一个册（数据无关写法：册全齐后为 null，空册用例自动跳过） */
const EMPTY_BOOK: BookId | null = BOOK_IDS.find((b) => unitIdsOfBook(b).length === 0) ?? null;
const emptyBookIt = (name: string, fn: () => void): void => {
  if (EMPTY_BOOK) it(name, fn);
  else it.skip(name, fn);
};

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
  // 与 store 测试同款：绕过 Node≥26 实验性全局 localStorage 遮蔽，取 jsdom 实例
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

describe('首页 · 全局单元切换器', () => {
  it('渲染当前册（必修一）全部注册单元的切换按钮（自动发现，随数据文件扩展），默认 Unit 1 选中', () => {
    const root = document.createElement('div');
    renderHome(root);

    const buttons = [...root.querySelectorAll('[data-testid="unit-switcher"] button')];
    expect(buttons.map((b) => (b as HTMLElement).dataset.unit)).toEqual([...unitIdsOfBook('required-1')]);
    expect(root.textContent).toContain('Unit 3 · Sports and Fitness');

    const active = switcherButton(root, 'unit1');
    expect(active.classList.contains('tab--active')).toBe(true);
    expect(active.getAttribute('aria-selected')).toBe('true');
    expect(switcherButton(root, 'unit3').classList.contains('tab--active')).toBe(false);
    expect(root.querySelector('[data-testid="unit-hint"]')!.textContent).toContain('Teenage Life');
  });

  it('?unit=unit3 深链首页：初始即 Unit 3 选中（URL → 状态）', () => {
    history.replaceState(null, '', '/?unit=unit3');
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

  it('纯数据文件新增的 Unit 4：自动出现在切换器，切换后各模块页渲染 Unit 4 数据', () => {
    const home = document.createElement('div');
    renderHome(home);

    // 首页切换器：Unit 4 按钮自动出现（meta 数据文件驱动，无手工清单）
    const button4 = switcherButton(home, 'unit4');
    expect(button4.textContent).toContain('Unit 4');
    expect(button4.textContent).toContain('Natural Disasters');
    click(button4);

    // 词汇：Unit 4 词表（20 词）
    history.replaceState(null, '', '/vocabulary');
    const vocab = document.createElement('div');
    renderVocabulary(vocab);
    expect(vocab.querySelector('h1')!.textContent).toContain('Natural Disasters');
    expect(vocab.querySelector<HTMLElement>('.card-nav__counter')!.textContent).toBe(
      `1 / ${getWordsByUnit('unit4').length}`,
    );
    expect(vocab.querySelector<HTMLElement>('[data-testid="current-unit"]')!.dataset.unit).toBe('unit4');

    // 语法：Unit 4 讲解卡与练习
    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Unit 4');
    expect(grammar.querySelector('.exercise[data-exercise="u4-g1"]')).toBeTruthy();

    // 阅读：Unit 4 两篇短文
    history.replaceState(null, '', '/reading');
    const reading = document.createElement('div');
    renderReading(reading);
    expect(reading.querySelector('h1')!.textContent).toContain('Unit 4');
    expect(reading.querySelectorAll('.reading-passage')).toHaveLength(2);

    // 听力：Unit 4 两段材料
    history.replaceState(null, '', '/listening');
    const listening = document.createElement('div');
    renderListening(listening);
    expect(listening.querySelector('h1')!.textContent).toContain('Unit 4');
    expect(listening.querySelectorAll('.listening-material')).toHaveLength(2);

    // 写作：Unit 4 两个任务
    history.replaceState(null, '', '/writing');
    const writing = document.createElement('div');
    renderWriting(writing);
    expect(writing.querySelector('h1')!.textContent).toContain('Unit 4');
    expect(writing.querySelector('[data-task="u4-w1"]')).toBeTruthy();
    expect(writing.querySelector('[data-task="u4-w2"]')).toBeTruthy();
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

describe('首页 · 两级切换器（第一级册别 / 第二级该册单元）', () => {
  it('第一级渲染七册固定维度（必修一 ~ 选择性必修四），默认必修一选中；第二级渲染该册全部注册单元', () => {
    const root = document.createElement('div');
    renderHome(root);

    const books = [...root.querySelectorAll('[data-testid="book-switcher"] button')];
    expect(books.map((b) => (b as HTMLElement).dataset.book)).toEqual([...BOOK_IDS]);
    expect(books.map((b) => b.textContent)).toEqual(BOOKS.map((b) => b.label));
    expect(bookButton(root, 'required-1').classList.contains('tab--active')).toBe(true);
    expect(bookButton(root, 'required-1').getAttribute('aria-selected')).toBe('true');
    expect(bookButton(root, 'elective-1').classList.contains('tab--active')).toBe(false);

    // 第二级 = 当前册（必修一）的单元：unit1-5，默认 Unit 1 选中
    expect(unitButtons(root)).toEqual([...unitIdsOfBook('required-1')]);
    expect(switcherButton(root, 'unit1').classList.contains('tab--active')).toBe(true);
  });

  emptyBookIt('点击空册：第二级降级为空态提示，URL 只带 ?book=，模块沿用最近单元（缺册降级）', () => {
    const root = document.createElement('div');
    renderHome(root);
    click(switcherButton(root, 'unit3')); // 先在必修一选中 Unit 3
    click(bookButton(root, EMPTY_BOOK!));

    // 第二级：该册无单元 → 空态提示，不再渲染单元按钮
    expect(root.querySelector('[data-testid="unit-empty"]')!.textContent).toContain(BOOK_LABELS[EMPTY_BOOK!]);
    expect(root.querySelector('[data-testid="unit-empty"]')!.textContent).toContain('暂未收录单元');
    expect(root.querySelector('[data-testid="unit-switcher"] button')).toBeNull();

    // 存储与 URL：册写入、单元沿用（不写误导性的 ?unit=）
    expect(bookStorageValue()).toBe(EMPTY_BOOK!);
    expect(storageValue()).toBe('unit3');
    expect(new URLSearchParams(location.search).get('book')).toBe(EMPTY_BOOK!);
    expect(new URLSearchParams(location.search).get('unit')).toBeNull();

    // 提示文案：空册降级说明 + 沿用单元
    const hint = root.querySelector('[data-testid="unit-hint"]')!.textContent!;
    expect(hint).toContain(BOOK_LABELS[EMPTY_BOOK!]);
    expect(hint).toContain('Unit 3');

    // 模块页联动降级：仍渲染最近单元（Unit 3）不崩溃，徽标显示沿用单元及其所属册
    history.replaceState(null, '', '/grammar');
    const grammar = document.createElement('div');
    renderGrammar(grammar);
    expect(grammar.querySelector('h1')!.textContent).toContain('Unit 3');
    const badge = grammar.querySelector<HTMLElement>('[data-testid="current-unit"]')!;
    expect(badge.dataset.unit).toBe('unit3');
    expect(badge.textContent).toContain('必修一'); // 徽标带册别维度
  });

  emptyBookIt('两级联动：空册切回必修一 → 单元列表恢复为该册单元并选中册内最近选择', () => {
    const root = document.createElement('div');
    renderHome(root);
    click(switcherButton(root, 'unit2'));
    click(bookButton(root, EMPTY_BOOK!)); // 空册
    click(bookButton(root, 'required-1')); // 切回

    expect(unitButtons(root)).toEqual([...unitIdsOfBook('required-1')]);
    expect(switcherButton(root, 'unit2').classList.contains('tab--active')).toBe(true);
    expect(bookButton(root, 'required-1').classList.contains('tab--active')).toBe(true);
    const params = new URLSearchParams(location.search);
    expect(params.get('book')).toBeNull(); // 默认册不写参数
    expect(params.get('unit')).toBe('unit2');
    expect(storageValue()).toBe('unit2');
  });

  it('?book=&unit= 深链首页：两级初始选中（URL → 状态）', () => {
    history.replaceState(null, '', '/?book=必修一&unit=unit3'); // 中文册名写法 + slug 单元写法
    const root = document.createElement('div');
    renderHome(root);

    expect(bookButton(root, 'required-1').classList.contains('tab--active')).toBe(true);
    expect(switcherButton(root, 'unit3').classList.contains('tab--active')).toBe(true);
    expect(storageValue()).toBe('unit3');
    expect(bookStorageValue()).toBe('required-1');
  });

  emptyBookIt('?book= 深链首页（空册）：册选中 + 单元空态，单元回退 Unit 1', () => {
    history.replaceState(null, '', `/?book=${EMPTY_BOOK!}`);
    const root = document.createElement('div');
    renderHome(root);

    expect(bookButton(root, EMPTY_BOOK!).classList.contains('tab--active')).toBe(true);
    expect(root.querySelector('[data-testid="unit-empty"]')).toBeTruthy();
    expect(storageValue()).toBe('unit1'); // 空册深链的单元回退落存储
    expect(bookStorageValue()).toBe(EMPTY_BOOK!);
  });
});

describe('首页 · 全站命名（高中英语学习系统）', () => {
  it('banner 品牌与首屏 heading 为「高中英语学习系统」，不再出现「高一」限定', () => {
    const root = document.createElement('div');
    renderHome(root);

    expect(root.querySelector('.site-header__brand')!.textContent).toBe('高中英语学习系统');
    const h1 = root.querySelector('h1')!;
    expect(h1.textContent).toContain('高中英语学习系统');
    expect(h1.textContent).toContain('人教2019');
    expect(root.textContent).not.toContain('高一');
  });

  it('首屏文案强调覆盖整个高中阶段：必修一 ~ 三 + 选择性必修一 ~ 四共 7 册 35 单元', () => {
    const root = document.createElement('div');
    renderHome(root);

    const text = root.querySelector('main p')!.textContent ?? '';
    expect(text).toContain('整个高中阶段');
    expect(text).toContain('必修一');
    expect(text).toContain('必修三');
    expect(text).toContain('选择性必修一 ~ 四');
    expect(text).toContain('7 册 35 单元');
  });

  it('各模块页顶部品牌同样为「高中英语学习系统」', () => {
    const hosts = [document.createElement('div'), document.createElement('div')];
    renderVocabulary(hosts[0]!);
    renderGrammar(hosts[1]!);
    for (const host of hosts) {
      expect(host.querySelector('.site-header__brand')!.textContent).toBe('高中英语学习系统');
    }
  });
});

describe('首页 · 页脚版本标记', () => {
  it('页脚渲染单行版本标记「高中英语学习系统 · v2026.11」', () => {
    const root = document.createElement('div');
    renderHome(root);

    const footer = root.querySelector('footer.site-footer');
    expect(footer, '首页应有 footer.site-footer 页脚').toBeTruthy();
    expect(footer!.textContent).toBe('高中英语学习系统 · v2026.11');
  });
});

describe('首页 · v2 对话式陪学入口', () => {
  it('渲染入口横幅卡：链接指向 /v2 且带 data-link（router 拦截站内跳转）', () => {
    const root = document.createElement('div');
    renderHome(root);

    const entry = root.querySelector<HTMLAnchorElement>('[data-testid="home-v2-entry"]')!;
    expect(entry, '首页应有 v2 对话式陪学入口卡').toBeTruthy();
    expect(entry.tagName).toBe('A');
    expect(entry.getAttribute('href')).toBe('/v2');
    expect(entry.hasAttribute('data-link')).toBe(true);
    expect(entry.querySelector('.home-v2__title')!.textContent).toContain('对话式陪学');
    expect(entry.querySelector('.home-v2__go')!.textContent).toContain('进入对话');
  });

  it('入口文案如实描述壳层能力：离线陪学降级 + 页内配置 OpenAI 兼容模型', () => {
    const root = document.createElement('div');
    renderHome(root);

    const desc = root.querySelector('.home-v2__desc')!.textContent ?? '';
    expect(desc).toContain('离线陪学');
    expect(desc).toContain('OpenAI 兼容');
  });

  it('入口横幅位于今日进度卡与七大模块入口之间，不挤占模块网格（仍 7 张模块卡）', () => {
    const root = document.createElement('div');
    renderHome(root);

    const sections = [...root.querySelectorAll('main > *')];
    const today = sections.findIndex((n) => (n as HTMLElement).dataset.testid === 'home-today');
    const v2 = sections.findIndex((n) => (n as HTMLElement).dataset.testid === 'home-v2-entry');
    const modules = sections.findIndex((n) => (n as HTMLElement).className.includes('home-modules'));
    expect(today).toBeGreaterThanOrEqual(0);
    expect(v2).toBe(today + 1);
    expect(modules).toBe(v2 + 1);

    expect(root.querySelectorAll('.module-grid .module-card')).toHaveLength(7);
    expect(root.querySelector('.module-grid [data-testid="home-v2-entry"]')).toBeNull();
  });
});
