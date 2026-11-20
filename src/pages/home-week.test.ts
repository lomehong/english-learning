import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderHome } from './home';
import { resetUnitState } from './unit-switch';
import { dayKey, emptyDaily, loadDaily, recordActivity, saveDaily, type DailyActivity } from '../store/daily';

/**
 * 首页今日进度卡 · 「近 7 天活动」：
 * - 7 天节点升序可见，今天带标记（label「今」+ data-today），活动日/非活动日可区分；
 * - 点击任意一天 → 卡内就地显示该天词汇/练习完成数（无记录显示 0），不跳转；
 * - 数据走每日活动 localStorage 约定键（刷新/重渲染仍来自本地记录）；
 * - 样式层 7 轨 minmax(0,1fr) + 跨满卡宽 → 窄屏（390px）不横向溢出。
 */

/** 本地正午（跨时区稳定，不落日期边界）：2026-01-18 周日 */
const NOW = new Date(2026, 0, 18, 12, 0, 0, 0).getTime();

function noonOffset(days: number): number {
  const d = new Date(NOW);
  d.setDate(d.getDate() - days);
  return d.getTime();
}

function testStorage(): Storage {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  const s = g._localStorage ?? g.localStorage;
  if (!s) throw new Error('测试环境无可用 localStorage');
  return s;
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/** 构造活动数据：offsets 为距今天数数组（0 = 今天），每天可记 vocab / exercises */
function dailyChain(days: Array<{ offset: number; vocab?: number; exercises?: number }>): DailyActivity {
  let daily = emptyDaily();
  for (const { offset, vocab, exercises } of days) {
    if (vocab) daily = recordActivity(daily, 'vocab', noonOffset(offset), vocab);
    if (exercises) daily = recordActivity(daily, 'exercises', noonOffset(offset), exercises);
  }
  return daily;
}

/** 近 7 天记录：今天 3 词 5 题、1 天前 1 词、3 天前 2 题；其余天空洞 */
const WEEK_DAILY = dailyChain([
  { offset: 0, vocab: 3, exercises: 5 },
  { offset: 1, vocab: 1 },
  { offset: 3, exercises: 2 },
]);

const GOAL = { version: 1, vocab: 10, exercises: 10 } as const;

function weekNodes(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('[data-testid="home-week-day"]')];
}

function nodeOf(root: HTMLElement, day: string): HTMLElement {
  return root.querySelector<HTMLElement>(`[data-testid="home-week-day"][data-day="${day}"]`)!;
}

function renderWith(daily: DailyActivity, root = document.createElement('div')): HTMLElement {
  renderHome(root, {
    loadDaily: () => daily,
    loadGoal: () => GOAL,
    now: () => NOW,
  });
  return root;
}

beforeEach(() => {
  resetUnitState();
  testStorage().clear();
  history.replaceState(null, '', '/');
});

afterEach(() => {
  resetUnitState();
  history.replaceState(null, '', '/');
});

describe('首页今日进度卡 · 近 7 天活动节点', () => {
  it('渲染 7 个节点（6 天前 → 今天升序），今天带标记且活动/非活动日可区分', () => {
    const root = renderWith(WEEK_DAILY);

    const nodes = weekNodes(root);
    expect(nodes).toHaveLength(7);
    // 升序：第一个节点 = 6 天前，最后一个 = 今天
    expect(nodes.map((n) => n.dataset.day)).toEqual([
      dayKey(noonOffset(6)),
      dayKey(noonOffset(5)),
      dayKey(noonOffset(4)),
      dayKey(noonOffset(3)),
      dayKey(noonOffset(2)),
      dayKey(noonOffset(1)),
      dayKey(NOW),
    ]);

    // 今天有标记：data-today + label「今」，且当天有记录 → active
    const today = nodes[6]!;
    expect(today.dataset.today).toBe('true');
    expect(today.dataset.active).toBe('true');
    expect(today.dataset.count).toBe('8');
    expect(today.textContent).toContain('今');
    // 非今天节点不带「今」标记
    expect(nodes[5]!.dataset.today).toBe('false');

    // 活动日 / 非活动日区分：1 天前有记录，2 天前空洞
    expect(nodeOf(root, dayKey(noonOffset(1))).dataset.active).toBe('true');
    expect(nodeOf(root, dayKey(noonOffset(1))).dataset.count).toBe('1');
    expect(nodeOf(root, dayKey(noonOffset(2))).dataset.active).toBe('false');
    expect(nodeOf(root, dayKey(noonOffset(2))).dataset.count).toBe('0');
  });

  it('节点位于今日进度卡内（home-today），容器带标题「近 7 天活动」', () => {
    const root = renderWith(WEEK_DAILY);

    const card = root.querySelector<HTMLElement>('[data-testid="home-today"]')!;
    expect(card.querySelector('[data-testid="home-week"]')).toBeTruthy();
    expect(card.querySelector('[data-testid="home-week"]')!.textContent).toContain('近 7 天活动');
  });
});

describe('首页今日进度卡 · 点击某天查看完成数', () => {
  it('默认选中今天：卡内详情初始即今日词汇/练习完成数', () => {
    const root = renderWith(WEEK_DAILY);

    const detail = root.querySelector<HTMLElement>('[data-testid="home-week-detail"]')!;
    expect(detail.dataset.day).toBe(dayKey(NOW));
    expect(detail.textContent).toContain('词汇 3');
    expect(detail.textContent).toContain('练习 5');
    expect(nodeOf(root, dayKey(NOW)).getAttribute('aria-pressed')).toBe('true');
    expect(nodeOf(root, dayKey(noonOffset(1))).getAttribute('aria-pressed')).toBe('false');
  });

  it('点击有记录的一天：就地显示该天词汇/练习数，选中态随点击移动（不跳转）', () => {
    const root = renderWith(WEEK_DAILY);

    click(nodeOf(root, dayKey(noonOffset(3)))); // 3 天前：练习 2

    const detail = root.querySelector<HTMLElement>('[data-testid="home-week-detail"]')!;
    expect(detail.dataset.day).toBe(dayKey(noonOffset(3)));
    expect(detail.textContent).toContain('词汇 0');
    expect(detail.textContent).toContain('练习 2');
    expect(nodeOf(root, dayKey(noonOffset(3))).getAttribute('aria-pressed')).toBe('true');
    expect(nodeOf(root, dayKey(NOW)).getAttribute('aria-pressed')).toBe('false');
    // 卡内切换，不发生路由跳转
    expect(location.pathname).toBe('/');
  });

  it('点击无记录的一天：词汇/练习均显示 0', () => {
    const root = renderWith(WEEK_DAILY);

    click(nodeOf(root, dayKey(noonOffset(5)))); // 5 天前：无记录

    const detail = root.querySelector<HTMLElement>('[data-testid="home-week-detail"]')!;
    expect(detail.dataset.day).toBe(dayKey(noonOffset(5)));
    expect(detail.textContent).toContain('词汇 0');
    expect(detail.textContent).toContain('练习 0');
  });

  it('再点回今天：详情恢复今日完成数（选中可反复切换）', () => {
    const root = renderWith(WEEK_DAILY);

    click(nodeOf(root, dayKey(noonOffset(1))));
    click(nodeOf(root, dayKey(NOW)));

    const detail = root.querySelector<HTMLElement>('[data-testid="home-week-detail"]')!;
    expect(detail.dataset.day).toBe(dayKey(NOW));
    expect(detail.textContent).toContain('词汇 3');
    expect(detail.textContent).toContain('练习 5');
  });
});

describe('首页今日进度卡 · 数据来自本地记录（localStorage 约定键）', () => {
  it('saveDaily 落键后重新渲染（模拟刷新）：节点与详情仍来自本地记录', () => {
    saveDaily(WEEK_DAILY, testStorage());

    // 每次渲染都从 localStorage 现读（与刷新后 defaultHomeDeps → loadDaily() 同路径）
    const first = document.createElement('div');
    renderHome(first, { loadDaily: () => loadDaily(testStorage()), loadGoal: () => GOAL, now: () => NOW });
    expect(nodeOf(first, dayKey(NOW)).dataset.count).toBe('8');
    expect(nodeOf(first, dayKey(noonOffset(1))).dataset.active).toBe('true');

    // 模拟刷新：丢弃旧 DOM，重新挂载读取同一份本地记录
    const second = document.createElement('div');
    renderHome(second, { loadDaily: () => loadDaily(testStorage()), loadGoal: () => GOAL, now: () => NOW });
    click(nodeOf(second, dayKey(noonOffset(3))));
    const detail = second.querySelector<HTMLElement>('[data-testid="home-week-detail"]')!;
    expect(detail.textContent).toContain('练习 2');
    expect(nodeOf(second, dayKey(NOW)).dataset.count).toBe('8');
  });

  it('无任何本地记录：7 节点全 inactive，详情显示 0（不崩溃）', () => {
    const root = renderWith(emptyDaily());

    expect(weekNodes(root).every((n) => n.dataset.active === 'false')).toBe(true);
    const detail = root.querySelector<HTMLElement>('[data-testid="home-week-detail"]')!;
    expect(detail.textContent).toContain('词汇 0');
    expect(detail.textContent).toContain('练习 0');
  });
});

/* -------------------- 样式层（base.css）：窄屏不横向溢出 -------------------- */

// jsdom 不加载样式表，直接解析 base.css 断言轨道规则（同 module-grid.test.ts 做法）
const css = readFileSync(join(process.cwd(), 'src', 'styles', 'base.css'), 'utf8');

function ruleBody(selectorRe: RegExp): string | null {
  const m = selectorRe.exec(css);
  return m ? m[1]! : null;
}

describe('首页今日进度卡 · 近 7 天活动样式（窄屏不溢出）', () => {
  it('节点轨道 repeat(7, minmax(0, 1fr))：轨道最小宽为 0，长内容撑不出容器', () => {
    const days = ruleBody(/\.home-week__days\s*\{([^}]*)\}/);
    expect(days).toBeTruthy();
    expect(days!.replace(/\s+/g, ' ')).toContain('grid-template-columns: repeat(7, minmax(0, 1fr))');
  });

  it('活动条跨满今日进度卡整行且宽度 100%（小屏 justify-items:start 下仍贴满）', () => {
    const wrap = ruleBody(/\.home-week\s*\{([^}]*)\}/);
    expect(wrap).toBeTruthy();
    const norm = wrap!.replace(/\s+/g, ' ');
    expect(norm).toContain('grid-column: 1 / -1');
    expect(norm).toContain('width: 100%');
    expect(norm).toContain('min-width: 0');
  });

  it('日节点最小宽 0：内容只能收缩、不能把轨道撑破', () => {
    const day = ruleBody(/\.home-week__day\s*\{([^}]*)\}/);
    expect(day).toBeTruthy();
    expect(day!.replace(/\s+/g, ' ')).toContain('min-width: 0');
  });
});
