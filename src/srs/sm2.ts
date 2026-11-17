import type { Card, Grade } from '../types';

/**
 * 简化 SM-2 间隔重复算法（Anki 风格四档）
 *
 * 规则（本票约定的简化版）：
 * - ease 初始 2.5，区间 [1.3, 3.0]，四档对 ease 的调整：
 *   again -0.20 / hard -0.15 / good ±0 / easy +0.15
 * - 新卡（interval < 1 天）首评：
 *   again → interval 0（10 分钟后重学）；hard → 1 天；good → 1 天；easy → 3 天
 * - 复习卡间隔增长：
 *   hard → round(interval × 1.2)；good → round(interval × ease)；easy → round(interval × ease × 1.3)
 * - again 将 interval 归零（回到重学队列），lapses +1
 * - due = 评分时刻 + interval（again 用 10 分钟学习步长）
 */

export const START_EASE = 2.5;
export const MIN_EASE = 1.3;
export const MAX_EASE = 3.0;

export const MINUTE_MS = 60 * 1000;
export const DAY_MS = 24 * 60 * MINUTE_MS;
/** again 档的学习步长：10 分钟后重新进入到期队列 */
export const AGAIN_DELAY_MS = 10 * MINUTE_MS;

/** 新卡初始状态：立即到期（进入复习队列） */
export function createCard(id: string, now: number = Date.now()): Card {
  return {
    id,
    ease: START_EASE,
    intervalDays: 0,
    reps: 0,
    lapses: 0,
    due: now,
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clampEase(value: number): number {
  return Math.min(MAX_EASE, Math.max(MIN_EASE, round2(value)));
}

/** 纯函数：按四档评分返回新卡片状态，不修改原对象 */
export function scheduleCard(card: Card, grade: Grade, now: number): Card {
  const ease = card.ease;
  let intervalDays = card.intervalDays;
  const isNew = intervalDays < 1;

  switch (grade) {
    case 'again':
      intervalDays = 0;
      break;
    case 'hard':
      intervalDays = isNew ? 1 : Math.max(1, Math.round(intervalDays * 1.2));
      break;
    case 'good':
      intervalDays = isNew ? 1 : Math.max(1, Math.round(intervalDays * ease));
      break;
    case 'easy':
      intervalDays = isNew ? 3 : Math.max(1, Math.round(intervalDays * ease * 1.3));
      break;
  }

  const nextEase = clampEase(
    grade === 'again'
      ? ease - 0.2
      : grade === 'hard'
        ? ease - 0.15
        : grade === 'easy'
          ? ease + 0.15
          : ease,
  );

  const delayMs = grade === 'again' ? AGAIN_DELAY_MS : intervalDays * DAY_MS;

  return {
    ...card,
    ease: nextEase,
    intervalDays,
    reps: card.reps + 1,
    lapses: card.lapses + (grade === 'again' ? 1 : 0),
    due: now + delayMs,
  };
}
