import { describe, it, expect, beforeEach } from 'vitest';
import {
  ACTIVITY_STORAGE_KEY,
  DEFAULT_DAILY_GOAL,
  GOAL_STORAGE_KEY,
  buildLast7Days,
  computeStreak,
  dayKey,
  emptyDaily,
  goalCompletion,
  loadDaily,
  loadGoal,
  normalizeGoal,
  recordActivity,
  recordActivityAndSave,
  saveDaily,
  saveGoal,
  type DailyActivity,
  type DailyGoal,
} from './daily';
import type { StorageLike } from './progress';

/**
 * 学习计划与连续学习（streak）单元测试：
 * 目标设置 / 今日完成度 / 跨日断签归零 / 近 7 天活动图 四组判据的数据层覆盖。
 */

/** 本地正午时间戳：跨时区跑测试时避免落在日期边界附近 */
function noon(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day, 12, 0, 0, 0).getTime();
}

/** 本例基准「今天」= 2026-01-18（周日）12:00 本地时间 */
const TODAY = noon(2026, 1, 18);
const YESTERDAY = noon(2026, 1, 17);
const DAY2 = noon(2026, 1, 16);
const DAY3 = noon(2026, 1, 15);
const DAY4 = noon(2026, 1, 14);

/** 可注入的内存存储（接缝：不绑定全局 localStorage） */
function memoryStorage(): StorageLike & { dump(): Record<string, string> } {
  const memory = new Map<string, string>();
  return {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => void memory.set(k, v),
    dump: () => Object.fromEntries(memory),
  };
}

/** 按天铺活动记录（纯数据构造，缺失的天 = 无活动） */
function dailyWith(days: Record<string, { vocab?: number; exercises?: number }>): DailyActivity {
  const daily = emptyDaily();
  for (const [key, count] of Object.entries(days)) {
    daily.days[key] = { vocab: count.vocab ?? 0, exercises: count.exercises ?? 0 };
  }
  return daily;
}

beforeEach(() => {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  (g._localStorage ?? g.localStorage)?.clear();
});

describe('每日目标 · 目标设置（localStorage）', () => {
  it('空存储返回默认目标：每日词汇 10 / 练习 10', () => {
    const storage = memoryStorage();
    expect(loadGoal(storage)).toEqual(DEFAULT_DAILY_GOAL);
    expect(DEFAULT_DAILY_GOAL).toMatchObject({ version: 1, vocab: 10, exercises: 10 });
  });

  it('保存后重新加载往返一致，写入约定键 english-learning.daily-goal.v1', () => {
    const storage = memoryStorage();
    saveGoal({ version: 1, vocab: 15, exercises: 25 }, storage);

    expect(storage.dump()[GOAL_STORAGE_KEY]).toBeTruthy();
    expect(loadGoal(storage)).toEqual({ version: 1, vocab: 15, exercises: 25 });
  });

  it('真实 localStorage 默认接缝：保存 → 读取一致（jsdom 实例）', () => {
    saveGoal({ version: 1, vocab: 8, exercises: 12 });
    expect(loadGoal()).toEqual({ version: 1, vocab: 8, exercises: 12 });
  });

  it('normalizeGoal 脏数据归一化：越界收敛到 [1,500]、小数取整、非法值回默认', () => {
    expect(normalizeGoal({ version: 1, vocab: 0, exercises: 999 })).toEqual({ version: 1, vocab: 1, exercises: 500 });
    expect(normalizeGoal({ version: 1, vocab: 3.7, exercises: -5 })).toEqual({ version: 1, vocab: 3, exercises: 1 });
    expect(normalizeGoal({ version: 1, vocab: 'x', exercises: 20 })).toEqual(DEFAULT_DAILY_GOAL);
    expect(normalizeGoal('not-an-object')).toEqual(DEFAULT_DAILY_GOAL);
    expect(normalizeGoal(null)).toEqual(DEFAULT_DAILY_GOAL);
    // version 不符 / 结构损坏 → 回默认
    expect(normalizeGoal({ version: 99, vocab: 5, exercises: 5 })).toEqual(DEFAULT_DAILY_GOAL);
  });

  it('loadGoal 损坏 JSON / 不兼容版本：安全回退默认，不抛异常', () => {
    const storage = memoryStorage();
    storage.setItem(GOAL_STORAGE_KEY, '{not-valid-json');
    expect(loadGoal(storage)).toEqual(DEFAULT_DAILY_GOAL);

    storage.setItem(GOAL_STORAGE_KEY, JSON.stringify({ version: 2, vocab: 5 }));
    expect(loadGoal(storage)).toEqual(DEFAULT_DAILY_GOAL);
  });
});

describe('每日活动记录 · 记录与读取', () => {
  it('recordActivity 纯函数：分别累加词汇 / 练习两维，不修改原对象', () => {
    const original = emptyDaily();
    let daily = recordActivity(original, 'vocab', TODAY);
    daily = recordActivity(daily, 'vocab', TODAY);
    daily = recordActivity(daily, 'exercises', TODAY);

    expect(daily.days[dayKey(TODAY)]).toEqual({ vocab: 2, exercises: 1 });
    expect(original.days[dayKey(TODAY)]).toBeUndefined();
  });

  it('支持一次记多笔（count > 1），跨天互不串扰', () => {
    let daily = recordActivity(emptyDaily(), 'vocab', YESTERDAY, 3);
    daily = recordActivity(daily, 'exercises', TODAY, 4);

    expect(daily.days[dayKey(YESTERDAY)]).toEqual({ vocab: 3, exercises: 0 });
    expect(daily.days[dayKey(TODAY)]).toEqual({ vocab: 0, exercises: 4 });
  });

  it('recordActivityAndSave 便捷写入：读取 → 记录 → 持久化（可注入 storage）', () => {
    const storage = memoryStorage();
    recordActivityAndSave('vocab', TODAY, 1, storage);
    recordActivityAndSave('exercises', TODAY, 1, storage);
    recordActivityAndSave('exercises', YESTERDAY, 2, storage);

    const daily = loadDaily(storage);
    expect(daily.days[dayKey(TODAY)]).toEqual({ vocab: 1, exercises: 1 });
    expect(daily.days[dayKey(YESTERDAY)]).toEqual({ vocab: 0, exercises: 2 });
    expect(storage.dump()[ACTIVITY_STORAGE_KEY]).toBeTruthy();
  });

  it('loadDaily 损坏数据防御：坏 JSON 回空、非法日期键丢弃、数值归一化', () => {
    const storage = memoryStorage();
    storage.setItem(ACTIVITY_STORAGE_KEY, '###');
    expect(loadDaily(storage)).toEqual(emptyDaily());

    storage.setItem(
      ACTIVITY_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        days: {
          '2026-01-18': { vocab: -3, exercises: 2.9 },
          'not-a-date': { vocab: 10, exercises: 10 },
          '2026-01-17': 'corrupted',
        },
      }),
    );
    const daily = loadDaily(storage);
    expect(daily.days['2026-01-18']).toEqual({ vocab: 0, exercises: 2 });
    expect(daily.days['not-a-date']).toBeUndefined();
    expect(daily.days['2026-01-17']).toEqual({ vocab: 0, exercises: 0 });
  });

  it('saveDaily → loadDaily 往返一致', () => {
    const storage = memoryStorage();
    const daily = dailyWith({ '2026-01-18': { vocab: 5, exercises: 6 } });
    saveDaily(daily, storage);
    expect(loadDaily(storage)).toEqual(daily);
  });
});

describe('今日完成度（目标口径）', () => {
  const goal: DailyGoal = { version: 1, vocab: 10, exercises: 10 };

  it('今日无活动：完成度 0，两维均未达成', () => {
    const c = goalCompletion(goal, dailyWith({ [dayKey(YESTERDAY)]: { vocab: 10, exercises: 10 } }), TODAY);
    expect(c.vocab).toBe(0);
    expect(c.exercises).toBe(0);
    expect(c.overall).toBe(0);
    expect(c.done).toBe(false);
    expect(c.vocabDone).toBe(false);
    expect(c.exercisesDone).toBe(false);
  });

  it('部分完成：词汇 3 / 练习 5 → 总进度 0.4（两维合计口径）', () => {
    const daily = dailyWith({ [dayKey(TODAY)]: { vocab: 3, exercises: 5 } });
    const c = goalCompletion(goal, daily, TODAY);
    expect(c).toMatchObject({ vocab: 3, vocabGoal: 10, exercises: 5, exercisesGoal: 10, overall: 0.4 });
    expect(c.done).toBe(false);
  });

  it('两维均达标：overall 收敛为 1 且 done；超额完成同样封顶 1', () => {
    const met = goalCompletion(goal, dailyWith({ [dayKey(TODAY)]: { vocab: 10, exercises: 10 } }), TODAY);
    expect(met.overall).toBe(1);
    expect(met.done).toBe(true);
    expect(met.vocabDone).toBe(true);
    expect(met.exercisesDone).toBe(true);

    const over = goalCompletion(goal, dailyWith({ [dayKey(TODAY)]: { vocab: 15, exercises: 20 } }), TODAY);
    expect(over.overall).toBe(1);
    expect(over.done).toBe(true);
  });

  it('跨日口径：昨天的完成情况不计入今天（今日完成度按日切分）', () => {
    const daily = dailyWith({
      [dayKey(YESTERDAY)]: { vocab: 10, exercises: 10 },
      [dayKey(TODAY)]: { vocab: 1, exercises: 0 },
    });
    const today = goalCompletion(goal, daily, TODAY);
    expect(today.vocab).toBe(1);
    expect(today.exercises).toBe(0);
    expect(today.overall).toBeCloseTo(0.05);
  });
});

describe('连续学习天数 streak（断签归零）', () => {
  it('无任何活动 → 0', () => {
    expect(computeStreak(emptyDaily(), TODAY)).toBe(0);
  });

  it('仅今天有活动 → 1', () => {
    const daily = dailyWith({ [dayKey(TODAY)]: { vocab: 1, exercises: 0 } });
    expect(computeStreak(daily, TODAY)).toBe(1);
  });

  it('连续 4 天（今天 + 前 3 天）→ 4', () => {
    const daily = dailyWith({
      [dayKey(TODAY)]: { exercises: 2 },
      [dayKey(YESTERDAY)]: { vocab: 1 },
      [dayKey(DAY2)]: { exercises: 1 },
      [dayKey(DAY3)]: { vocab: 3 },
    });
    expect(computeStreak(daily, TODAY)).toBe(4);
  });

  it('跨日断签归零：今天与 3 天前有活动、昨天缺勤 → 链断为 1', () => {
    const daily = dailyWith({
      [dayKey(TODAY)]: { vocab: 2 },
      [dayKey(DAY2)]: { vocab: 1 },
    });
    expect(computeStreak(daily, TODAY)).toBe(1);
  });

  it('今天尚未学习不打断：昨天有活动 → streak 保留为 1（今天还有补签机会）', () => {
    const daily = dailyWith({ [dayKey(YESTERDAY)]: { exercises: 1 } });
    expect(computeStreak(daily, TODAY)).toBe(1);
  });

  it('今天与昨天都缺勤 → 归 0（连续已断）', () => {
    const daily = dailyWith({ [dayKey(DAY2)]: { vocab: 1 }, [dayKey(DAY3)]: { vocab: 1 } });
    expect(computeStreak(daily, TODAY)).toBe(0);
  });

  it('链止于昨天：连续 5 天到昨天（今天未学）→ 5', () => {
    const daily = dailyWith({
      [dayKey(YESTERDAY)]: { vocab: 1 },
      [dayKey(DAY2)]: { vocab: 1 },
      [dayKey(DAY3)]: { vocab: 1 },
      [dayKey(DAY4)]: { vocab: 1 },
      [dayKey(noon(2026, 1, 13) as unknown as number)]: { vocab: 1 },
    });
    expect(computeStreak(daily, TODAY)).toBe(5);
  });
});

describe('近 7 天活动图数据', () => {
  it('固定返回 7 天（升序，从 6 天前到今天），最后一天标记 isToday', () => {
    const days = buildLast7Days(emptyDaily(), TODAY);

    expect(days).toHaveLength(7);
    expect(days[6]!.isToday).toBe(true);
    expect(days[6]!.key).toBe(dayKey(TODAY));
    expect(days[0]!.key).toBe(dayKey(noon(2026, 1, 12)));
    expect(days.slice(0, 6).every((d) => d.isToday === false)).toBe(true);
    // 键逐日相邻且不重复
    expect(new Set(days.map((d) => d.key)).size).toBe(7);
  });

  it('逐日取数正确：无活动日为 0，total = vocab + exercises', () => {
    const daily = dailyWith({
      [dayKey(TODAY)]: { vocab: 3, exercises: 5 },
      [dayKey(YESTERDAY)]: { exercises: 2 },
    });
    const days = buildLast7Days(daily, TODAY);

    expect(days[6]).toMatchObject({ key: dayKey(TODAY), vocab: 3, exercises: 5, total: 8, isToday: true });
    expect(days[5]).toMatchObject({ key: dayKey(YESTERDAY), vocab: 0, exercises: 2, total: 2 });
    expect(days[4]).toMatchObject({ vocab: 0, exercises: 0, total: 0 });
  });

  it('7 天以前的活动不进入图表（窗口恰为近 7 天）', () => {
    const daily = dailyWith({ [dayKey(noon(2026, 1, 11))]: { vocab: 9, exercises: 9 } });
    const days = buildLast7Days(daily, TODAY);
    expect(days.every((d) => d.total === 0)).toBe(true);
  });

  it('周一到周日的标签与活动日的星期一致（本地日历）', () => {
    const daily = dailyWith({ [dayKey(TODAY)]: { vocab: 1 } });
    const days = buildLast7Days(daily, TODAY);
    // 2026-01-18 是周日
    expect(days[6]!.label).toBe('日');
    expect(days[5]!.label).toBe('六');
    expect(days[0]!.label).toBe('一');
  });
});
