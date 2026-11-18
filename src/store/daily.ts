import { defaultStorage, type StorageLike } from './progress';

/**
 * 学习计划（每日目标）与连续学习（streak）持久化。
 *
 * 两份独立 localStorage 数据：
 * - 每日目标（english-learning.daily-goal.v1）：可设每日新学词汇数 / 练习题数；
 * - 每日活动（english-learning.daily-activity.v1）：按本地日期（YYYY-MM-DD）记录
 *   当日新学词汇数与作答题数，供「今日完成度 / streak / 近 7 天活动图」三视图共用。
 * 接缝：StorageLike 可注入（复用 progress 的存储接缝），页面接线走便捷写入函数。
 */

/* -------------------- 每日目标 -------------------- */

export interface DailyGoal {
  version: 1;
  /** 每日新学词汇目标（标记已学单词数） */
  vocab: number;
  /** 每日练习题目标（作答题数） */
  exercises: number;
}

export const GOAL_STORAGE_KEY = 'english-learning.daily-goal.v1';

/** 默认目标：每日词汇 10 · 练习 10 题 */
export const DEFAULT_DAILY_GOAL: DailyGoal = { version: 1, vocab: 10, exercises: 10 };

export const GOAL_MIN = 1;
export const GOAL_MAX = 500;

function clampCount(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return Math.min(GOAL_MAX, Math.max(GOAL_MIN, Math.floor(value)));
}

/** 目标归一化（纯函数）：非法/缺字段回默认，数值收敛到 [1, 500] 的整数 */
export function normalizeGoal(value: unknown): DailyGoal {
  if (typeof value !== 'object' || value === null) return DEFAULT_DAILY_GOAL;
  const v = value as Record<string, unknown>;
  if (v.version !== 1) return DEFAULT_DAILY_GOAL;
  const vocab = clampCount(v.vocab);
  const exercises = clampCount(v.exercises);
  if (vocab === null || exercises === null) return DEFAULT_DAILY_GOAL;
  return { version: 1, vocab, exercises };
}

/** 读取并归一化；任何损坏/不兼容数据都安全回退默认，不抛异常 */
export function loadGoal(storage: StorageLike = defaultStorage()): DailyGoal {
  let raw: string | null = null;
  try {
    raw = storage.getItem(GOAL_STORAGE_KEY);
  } catch {
    return DEFAULT_DAILY_GOAL;
  }
  if (!raw) return DEFAULT_DAILY_GOAL;
  try {
    return normalizeGoal(JSON.parse(raw));
  } catch {
    return DEFAULT_DAILY_GOAL;
  }
}

export function saveGoal(goal: DailyGoal, storage: StorageLike = defaultStorage()): void {
  storage.setItem(GOAL_STORAGE_KEY, JSON.stringify(normalizeGoal(goal)));
}

/* -------------------- 每日活动记录 -------------------- */

/** 活动维度：vocab = 新学词汇（标记已学），exercises = 练习作答 */
export type DailyKind = 'vocab' | 'exercises';

export interface DayCount {
  vocab: number;
  exercises: number;
}

export interface DailyActivity {
  version: 1;
  /** key = 本地日期 YYYY-MM-DD */
  days: Record<string, DayCount>;
}

export const ACTIVITY_STORAGE_KEY = 'english-learning.daily-activity.v1';

export function emptyDaily(): DailyActivity {
  return { version: 1, days: {} };
}

const DAY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

function toCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

/** 活动记录归一化（纯函数）：坏 JSON / 非法日期键丢弃，数值收敛为非负整数 */
export function normalizeDaily(value: unknown): DailyActivity {
  const daily = emptyDaily();
  if (typeof value !== 'object' || value === null) return daily;
  const v = value as Record<string, unknown>;
  if (v.version !== 1 || typeof v.days !== 'object' || v.days === null) return daily;
  for (const [key, entry] of Object.entries(v.days as Record<string, unknown>)) {
    if (!DAY_KEY_RE.test(key)) continue;
    const e = (entry ?? {}) as Record<string, unknown>;
    daily.days[key] = { vocab: toCount(e.vocab), exercises: toCount(e.exercises) };
  }
  return daily;
}

/** 读取并归一化；任何损坏/不兼容数据都安全回退，不抛异常 */
export function loadDaily(storage: StorageLike = defaultStorage()): DailyActivity {
  let raw: string | null = null;
  try {
    raw = storage.getItem(ACTIVITY_STORAGE_KEY);
  } catch {
    return emptyDaily();
  }
  if (!raw) return emptyDaily();
  try {
    return normalizeDaily(JSON.parse(raw));
  } catch {
    return emptyDaily();
  }
}

export function saveDaily(daily: DailyActivity, storage: StorageLike = defaultStorage()): void {
  storage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(daily));
}

/* -------------------- 日期工具（本地日历） -------------------- */

/** 本地日期键：YYYY-MM-DD（按用户本地时区切日，跨时区不串日） */
export function dayKey(now: number): string {
  const d = new Date(now);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** 本地日历位移：用 setDate 走日历日（DST / 月末 / 年末都正确），不用 24h 毫秒减法 */
function shiftDays(now: number, days: number): number {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.getTime();
}

/* -------------------- 记录（纯函数 + 便捷写入） -------------------- */

/** 记一笔回当日（纯函数）：vocab / exercises 两维独立累加，不修改原对象 */
export function recordActivity(daily: DailyActivity, kind: DailyKind, now: number, count = 1): DailyActivity {
  const key = dayKey(now);
  const prev = daily.days[key] ?? { vocab: 0, exercises: 0 };
  const n = Math.max(0, Math.floor(count));
  return {
    version: 1,
    days: {
      ...daily.days,
      [key]: { ...prev, [kind]: prev[kind] + n },
    },
  };
}

/** 便捷写入：读取 → 记录 → 持久化（页面接线用；测试可注入 storage） */
export function recordActivityAndSave(
  kind: DailyKind,
  now: number = Date.now(),
  count = 1,
  storage: StorageLike = defaultStorage(),
): void {
  saveDaily(recordActivity(loadDaily(storage), kind, now, count), storage);
}

/* -------------------- 派生视图（纯函数） -------------------- */

/** 今日两维计数 */
export function todayCounters(daily: DailyActivity, now: number): DayCount {
  return daily.days[dayKey(now)] ?? { vocab: 0, exercises: 0 };
}

/** 活动日判定：当日任一维有记录即视为「有学习」 */
function isActiveDay(daily: DailyActivity, now: number): boolean {
  const c = daily.days[dayKey(now)];
  return !!c && c.vocab + c.exercises > 0;
}

/**
 * 连续学习天数（断签归零）：
 * 从今天（或昨天——今天尚未学习时不打断，链延续到昨天）向前数连续活动日，
 * 遇到整天空洞即中断；无任何活动 → 0。
 */
export function computeStreak(daily: DailyActivity, now: number): number {
  let offset = isActiveDay(daily, now) ? 0 : 1;
  let streak = 0;
  while (isActiveDay(daily, shiftDays(now, offset + streak))) {
    streak += 1;
  }
  return streak;
}

/** 近 7 天单日视图（活动图的一列） */
export interface DayActivity {
  /** YYYY-MM-DD */
  key: string;
  /** 星期缩写（一 / 二 / … / 日） */
  label: string;
  vocab: number;
  exercises: number;
  /** vocab + exercises */
  total: number;
  isToday: boolean;
}

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

/** 近 7 天活动（升序：6 天前 → 今天；今天在最后一列并带 isToday 标记） */
export function buildLast7Days(daily: DailyActivity, now: number): DayActivity[] {
  const days: DayActivity[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const t = shiftDays(now, i);
    const key = dayKey(t);
    const count = daily.days[key] ?? { vocab: 0, exercises: 0 };
    days.push({
      key,
      label: WEEKDAY_LABELS[new Date(t).getDay()]!,
      vocab: count.vocab,
      exercises: count.exercises,
      total: count.vocab + count.exercises,
      isToday: i === 0,
    });
  }
  return days;
}

/** 今日完成度（两维合计口径） */
export interface GoalCompletion {
  vocab: number;
  vocabGoal: number;
  exercises: number;
  exercisesGoal: number;
  /** 总完成度 0 ~ 1（超额封顶 1） */
  overall: number;
  vocabDone: boolean;
  exercisesDone: boolean;
  /** 两维均达标 */
  done: boolean;
}

/** 今日完成度（纯函数）：目标 × 当日活动 → 完成度视图 */
export function goalCompletion(goal: DailyGoal, daily: DailyActivity, now: number): GoalCompletion {
  const today = todayCounters(daily, now);
  const denom = goal.vocab + goal.exercises;
  return {
    vocab: today.vocab,
    vocabGoal: goal.vocab,
    exercises: today.exercises,
    exercisesGoal: goal.exercises,
    overall: denom === 0 ? 0 : Math.min(1, (today.vocab + today.exercises) / denom),
    vocabDone: goal.vocab === 0 ? true : today.vocab >= goal.vocab,
    exercisesDone: goal.exercises === 0 ? true : today.exercises >= goal.exercises,
    done: today.vocab >= goal.vocab && today.exercises >= goal.exercises,
  };
}
