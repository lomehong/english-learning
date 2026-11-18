import { describe, it, expect, beforeEach } from 'vitest';
import { renderReport } from './report';
import { renderHome } from './home';
import { renderLearn } from './learn';
import { renderReview } from './review';
import type { ReportDeps } from './deps';
import { emptyStats } from '../store/stats';
import { emptyWrongBook } from '../store/wrongbook';
import { emptyProgress } from '../store/progress';
import { createCard } from '../srs/sm2';
import {
  dayKey,
  emptyDaily,
  loadDaily,
  recordActivity,
  type DailyActivity,
  type DailyGoal,
} from '../store/daily';

/**
 * 学习计划与连续学习（streak）页面级测试：
 * 学习报告页（今日目标设置 / 今日完成度 / streak / 近 7 天活动图）+
 * 首页（今日进度与 streak 徽标）+ 学习/复习页的活动记录接线。
 */

/** 本地正午（跨时区稳定，不落日期边界） */
const NOW = new Date(2026, 0, 18, 12, 0, 0, 0).getTime(); // 2026-01-18 周日

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

/** 构造活动数据：offsets 为距今天数数组（0 = 今天），每天记一维或多维 */
function dailyChain(days: Array<{ offset: number; vocab?: number; exercises?: number }>): DailyActivity {
  let daily = emptyDaily();
  for (const { offset, vocab, exercises } of days) {
    if (vocab) daily = recordActivity(daily, 'vocab', noonOffset(offset), vocab);
    if (exercises) daily = recordActivity(daily, 'exercises', noonOffset(offset), exercises);
  }
  return daily;
}

/** 报告页依赖注入（含学习计划接缝；saveGoal 捕获并可回读） */
function makeDeps(daily: DailyActivity, goal: DailyGoal) {
  let current = goal;
  const saved: DailyGoal[] = [];
  const deps: ReportDeps = {
    loadStats: () => emptyStats(),
    loadWrong: () => emptyWrongBook(),
    loadProgress: () => emptyProgress(),
    now: () => NOW,
    loadDaily: () => daily,
    loadGoal: () => current,
    saveGoal: (g) => {
      saved.push(g);
      current = g;
    },
  };
  return { deps, saved, get current() { return current; } };
}

beforeEach(() => {
  testStorage().clear();
  history.replaceState(null, '', '/report');
});

describe('学习报告页 · 今日目标设置', () => {
  it('渲染每日目标表单：输入框回填当前目标（词汇 / 练习题两维）', () => {
    const root = document.createElement('div');
    renderReport(root, makeDeps(emptyDaily(), { version: 1, vocab: 12, exercises: 8 }).deps);

    const vocabInput = root.querySelector<HTMLInputElement>('[data-testid="goal-vocab-input"]')!;
    const exercisesInput = root.querySelector<HTMLInputElement>('[data-testid="goal-exercises-input"]')!;
    expect(vocabInput.value).toBe('12');
    expect(exercisesInput.value).toBe('8');
    expect(root.querySelector('[data-testid="goal-save"]')).toBeTruthy();
  });

  it('修改目标并保存：saveGoal 收到新值，页面显示已保存提示', () => {
    const root = document.createElement('div');
    const { deps, saved } = makeDeps(emptyDaily(), { version: 1, vocab: 10, exercises: 10 });
    renderReport(root, deps);

    const vocabInput = root.querySelector<HTMLInputElement>('[data-testid="goal-vocab-input"]')!;
    const exercisesInput = root.querySelector<HTMLInputElement>('[data-testid="goal-exercises-input"]')!;
    vocabInput.value = '20';
    exercisesInput.value = '30';
    click(root.querySelector('[data-testid="goal-save"]')!);

    expect(saved).toEqual([{ version: 1, vocab: 20, exercises: 30 }]);
    expect(root.querySelector('[data-testid="goal-saved-hint"]')!.textContent).toContain('已保存');
  });

  it('非法输入收敛：0 → 1、999 → 500、小数取整', () => {
    const root = document.createElement('div');
    const { deps, saved } = makeDeps(emptyDaily(), { version: 1, vocab: 10, exercises: 10 });
    renderReport(root, deps);

    const vocabInput = root.querySelector<HTMLInputElement>('[data-testid="goal-vocab-input"]')!;
    const exercisesInput = root.querySelector<HTMLInputElement>('[data-testid="goal-exercises-input"]')!;
    vocabInput.value = '0';
    exercisesInput.value = '999.6';
    click(root.querySelector('[data-testid="goal-save"]')!);

    expect(saved).toEqual([{ version: 1, vocab: 1, exercises: 500 }]);
  });

  it('保存目标后今日完成度随新目标刷新（不改日历）', () => {
    const root = document.createElement('div');
    const daily = dailyChain([{ offset: 0, vocab: 3, exercises: 5 }]);
    const { deps } = makeDeps(daily, { version: 1, vocab: 10, exercises: 10 });
    renderReport(root, deps);

    expect(root.querySelector('[data-testid="today-overall"]')!.textContent).toContain('40%');

    const vocabInput = root.querySelector<HTMLInputElement>('[data-testid="goal-vocab-input"]')!;
    vocabInput.value = '2';
    click(root.querySelector('[data-testid="goal-save"]')!);

    // (3 + 5) / (2 + 10) = 66.7%
    expect(root.querySelector('[data-testid="today-completion"]')!.textContent).toContain('词汇 3/2');
    expect(root.querySelector('[data-testid="today-overall"]')!.textContent).toContain('66.7%');
  });
});

describe('学习报告页 · 今日完成度', () => {
  it('展示两维完成度与总进度：词汇 3/12 · 练习 5/8 → 总进度 40%，进度条宽度一致', () => {
    const root = document.createElement('div');
    const daily = dailyChain([{ offset: 0, vocab: 3, exercises: 5 }]);
    renderReport(root, makeDeps(daily, { version: 1, vocab: 12, exercises: 8 }).deps);

    const text = root.querySelector('[data-testid="today-completion"]')!.textContent!;
    expect(text).toContain('词汇 3/12');
    expect(text).toContain('练习 5/8');
    expect(root.querySelector('[data-testid="today-overall"]')!.textContent).toContain('40%');

    const bar = root.querySelector<HTMLElement>('[data-testid="today-bar"]')!;
    expect(bar.style.width).toBe('40%');
    expect(root.querySelector<HTMLElement>('[data-testid="daily-plan"]')!.dataset.state).toBe('in-progress');
  });

  it('两维达标：标记已完成（data-state=done）', () => {
    const root = document.createElement('div');
    const daily = dailyChain([{ offset: 0, vocab: 10, exercises: 12 }]);
    renderReport(root, makeDeps(daily, { version: 1, vocab: 10, exercises: 10 }).deps);

    expect(root.querySelector<HTMLElement>('[data-testid="daily-plan"]')!.dataset.state).toBe('done');
    expect(root.querySelector('[data-testid="today-completion"]')!.textContent).toContain('已达成');
  });

  it('今天还没学：完成度 0%，展示 0/目标', () => {
    const root = document.createElement('div');
    renderReport(root, makeDeps(emptyDaily(), { version: 1, vocab: 10, exercises: 10 }).deps);

    const text = root.querySelector('[data-testid="today-completion"]')!.textContent!;
    expect(text).toContain('词汇 0/10');
    expect(text).toContain('练习 0/10');
    expect(root.querySelector('[data-testid="today-overall"]')!.textContent).toContain('0%');
  });
});

describe('学习报告页 · 连续学习天数（streak）', () => {
  it('连续 3 天 → 徽标显示 3 天', () => {
    const root = document.createElement('div');
    const daily = dailyChain([
      { offset: 0, exercises: 2 },
      { offset: 1, vocab: 1 },
      { offset: 2, exercises: 3 },
    ]);
    renderReport(root, makeDeps(daily, { version: 1, vocab: 10, exercises: 10 }).deps);

    expect(root.querySelector('[data-testid="streak-days"]')!.textContent).toContain('3 天');
  });

  it('跨日断签归零：昨天缺勤 → 显示 1 天；无任何活动 → 0 天', () => {
    const root = document.createElement('div');
    const daily = dailyChain([
      { offset: 0, vocab: 2 },
      { offset: 2, vocab: 1 },
    ]);
    renderReport(root, makeDeps(daily, { version: 1, vocab: 10, exercises: 10 }).deps);
    expect(root.querySelector('[data-testid="streak-days"]')!.textContent).toContain('1 天');

    const empty = document.createElement('div');
    renderReport(empty, makeDeps(emptyDaily(), { version: 1, vocab: 10, exercises: 10 }).deps);
    expect(empty.querySelector('[data-testid="streak-days"]')!.textContent).toContain('0 天');
  });
});

describe('学习报告页 · 近 7 天活动图（纯 CSS/SVG，不引第三方库）', () => {
  it('渲染 7 列（6 天前 → 今天）：data-day / data-count 正确，今天高亮', () => {
    const root = document.createElement('div');
    const daily = dailyChain([
      { offset: 0, vocab: 3, exercises: 5 },
      { offset: 1, exercises: 2 },
      { offset: 6, vocab: 4 },
    ]);
    renderReport(root, makeDeps(daily, { version: 1, vocab: 10, exercises: 10 }).deps);

    const chart = root.querySelector('[data-testid="activity-chart"]')!;
    const days = [...chart.querySelectorAll('[data-testid="activity-day"]')];
    expect(days).toHaveLength(7);

    expect((days[6] as HTMLElement).dataset.day).toBe(dayKey(NOW));
    expect((days[6] as HTMLElement).dataset.count).toBe('8');
    expect((days[6] as HTMLElement).dataset.today).toBe('true');
    expect((days[5] as HTMLElement).dataset.count).toBe('2');
    expect((days[5] as HTMLElement).dataset.today).toBe('false');
    expect((days[0] as HTMLElement).dataset.day).toBe(dayKey(noonOffset(6)));
    expect((days[0] as HTMLElement).dataset.count).toBe('4');
    // 活动条高度与最大日成比例（纯 CSS 实现）
    const bar = days[6]!.querySelector<HTMLElement>('[data-testid="activity-bar"]')!;
    expect(bar.style.height).toBe('100%');
    expect(days[4]!.querySelector<HTMLElement>('[data-testid="activity-bar"]')!.style.height).toBe('0%');
  });

  it('近 7 天全空：显示暂无活动提示', () => {
    const root = document.createElement('div');
    renderReport(root, makeDeps(emptyDaily(), { version: 1, vocab: 10, exercises: 10 }).deps);

    expect(root.querySelector('[data-testid="activity-empty"]')!).toBeTruthy();
  });
});

describe('首页 · 今日进度与 streak 徽标', () => {
  it('渲染今日进度（今日 8/20（40%）· 词汇 3/10 · 练习 5/10）与连续天数徽标', () => {
    const root = document.createElement('div');
    history.replaceState(null, '', '/');
    const daily = dailyChain([
      { offset: 0, vocab: 3, exercises: 5 },
      { offset: 1, vocab: 1 },
      { offset: 2, vocab: 2 },
    ]);
    renderHome(root, {
      loadDaily: () => daily,
      loadGoal: () => ({ version: 1, vocab: 10, exercises: 10 }),
      now: () => NOW,
    });

    const progress = root.querySelector('[data-testid="home-today-progress"]')!.textContent!;
    expect(progress).toContain('今日 8/20');
    expect(progress).toContain('40%');
    expect(progress).toContain('词汇 3/10');
    expect(progress).toContain('练习 5/10');

    expect(root.querySelector('[data-testid="home-streak"]')!.textContent).toContain('连续 3 天');
    expect(root.querySelector<HTMLAnchorElement>('[data-testid="home-streak"]')!.getAttribute('href')).toBe(
      '/report',
    );
  });

  it('零活动：显示 0% 与「连续 0 天」，仍渲染徽标（引导开始）', () => {
    const root = document.createElement('div');
    history.replaceState(null, '', '/');
    renderHome(root, {
      loadDaily: () => emptyDaily(),
      loadGoal: () => ({ version: 1, vocab: 10, exercises: 10 }),
      now: () => NOW,
    });

    expect(root.querySelector('[data-testid="home-today-progress"]')!.textContent).toContain('0%');
    expect(root.querySelector('[data-testid="home-streak"]')!.textContent).toContain('连续 0 天');
  });
});

describe('活动记录接线（词汇标记已学 / 练习作答 → 每日活动）', () => {
  it('学习页标记已学：当日 vocab +1（写入 localStorage 约定键）', () => {
    let progress = emptyProgress();
    const container = document.createElement('div');
    renderLearn(
      container,
      {
        load: () => progress,
        save: (p) => {
          progress = p;
        },
        now: () => NOW,
      },
    );

    click(container.querySelector('button.btn--primary')!);

    expect(loadDaily().days[dayKey(NOW)]).toEqual({ vocab: 1, exercises: 0 });
  });

  it('复习页评分：当日 exercises +1（同键累计）', () => {
    const progress = emptyProgress();
    progress.cards['teenage'] = createCard('teenage', NOW - 1);
    const container = document.createElement('div');
    renderReview(container, {
      load: () => progress,
      save: () => {},
      now: () => NOW,
    });

    click(container.querySelector('[data-grade="good"]')!);

    const day = loadDaily().days[dayKey(NOW)]!;
    expect(day.exercises).toBe(1);
  });
});
