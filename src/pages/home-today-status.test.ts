import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHome } from './home';
import { resetUnitState } from './unit-switch';
import { emptyDaily, recordActivity, type DailyActivity } from '../store/daily';

/**
 * 首页今日进度卡 · 状态行（学习引导 / 正向反馈）：
 * - 今天尚无学习记录（词汇 + 练习均为 0）：显示「今天还没有学习记录，去词汇模块开始吧。」，
 *   引导文案为站内链接 /vocabulary（带 data-link，由路由拦截跳转）；
 * - 已有进度：按完成度显示「今日已完成 N%，继续加油！」（与进度 chip 同口径，一位小数），
 *   不再出现空态引导；
 * - 两维均达标：显示「今日目标已达成（N%）…继续加油！」。
 */

/** 本地正午（跨时区稳定，不落日期边界）：2026-01-18 周日 */
const NOW = new Date(2026, 0, 18, 12, 0, 0, 0).getTime();

const GOAL = { version: 1, vocab: 10, exercises: 10 } as const;

function testStorage(): Storage {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  const s = g._localStorage ?? g.localStorage;
  if (!s) throw new Error('测试环境无可用 localStorage');
  return s;
}

/** 今日有记录的活动数据（vocab + exercises 计入今日） */
function dailyWithToday(vocab: number, exercises: number): DailyActivity {
  let daily = emptyDaily();
  if (vocab) daily = recordActivity(daily, 'vocab', NOW, vocab);
  if (exercises) daily = recordActivity(daily, 'exercises', NOW, exercises);
  return daily;
}

function statusOf(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>('[data-testid="home-today-status"]')!;
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

describe('首页今日进度卡 · 空态引导（今天还没有学习记录）', () => {
  it('今日词汇/练习均为 0：状态行显示引导文案，「去词汇模块开始吧」为指向 /vocabulary 的站内链接', () => {
    const root = renderWith(emptyDaily());

    const status = statusOf(root);
    expect(status.textContent).toContain('今天还没有学习记录');
    expect(status.textContent).toContain('去词汇模块开始吧');
    expect(status.textContent).not.toContain('今日已完成');

    const link = status.querySelector<HTMLAnchorElement>('a.home-today__start')!;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/vocabulary');
    expect(link.hasAttribute('data-link')).toBe(true); // 路由拦截（SPA 站内跳转）标记
  });

  it('昨日有记录但今天为 0：仍按今日口径显示空态引导（不拿历史进度冒充今日）', () => {
    const yesterday = new Date(NOW);
    yesterday.setDate(yesterday.getDate() - 1);
    const daily = recordActivity(emptyDaily(), 'vocab', yesterday.getTime(), 6);

    const root = renderWith(daily);

    expect(statusOf(root).textContent).toContain('今天还没有学习记录');
    expect(statusOf(root).querySelector('a.home-today__start')).toBeTruthy();
  });
});

describe('首页今日进度卡 · 有进度时的正向反馈', () => {
  it('今日 3 词 + 5 题（目标 10+10）：显示「今日已完成 40%，继续加油！」，不再出现空态引导链接', () => {
    const root = renderWith(dailyWithToday(3, 5));

    const status = statusOf(root);
    expect(status.textContent).toContain('今日已完成 40%');
    expect(status.textContent).toContain('继续加油');
    expect(status.textContent).not.toContain('今天还没有学习记录');
    expect(status.querySelector('a.home-today__start')).toBeNull();
  });

  it('非整比例完成度保留一位小数：3 词 + 2 题（目标 10+10）→ 25%', () => {
    const root = renderWith(dailyWithToday(3, 2));

    expect(statusOf(root).textContent).toContain('今日已完成 25%');
  });

  it('两维均达标：显示「今日目标已达成（100%）…继续加油！」', () => {
    const root = renderWith(dailyWithToday(10, 12));

    const status = statusOf(root);
    expect(status.textContent).toContain('今日目标已达成');
    expect(status.textContent).toContain('100%');
    expect(status.textContent).toContain('继续加油');
  });

  it('原操作提示行保留：目标调整入口与近 7 天节点说明仍在卡内', () => {
    const root = renderWith(dailyWithToday(3, 5));

    const subs = [...root.querySelectorAll('.home-today__sub')];
    expect(subs.some((p) => p.textContent!.includes('每日目标可在学习报告页调整'))).toBe(true);
  });
});
