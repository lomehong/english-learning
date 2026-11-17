import { describe, it, expect } from 'vitest';
import {
  createCard,
  scheduleCard,
  START_EASE,
  MIN_EASE,
  MAX_EASE,
  AGAIN_DELAY_MS,
  DAY_MS,
} from './sm2';

const NOW = Date.UTC(2026, 0, 1); // 2026-01-01T00:00:00Z，固定基准时间

describe('createCard', () => {
  it('新卡默认 ease 2.5 / interval 0 / reps 0 / lapses 0 / due=now', () => {
    const card = createCard('teenage', NOW);
    expect(card).toEqual({
      id: 'teenage',
      ease: START_EASE,
      intervalDays: 0,
      reps: 0,
      lapses: 0,
      due: NOW,
    });
  });
});

describe('scheduleCard · 新卡首评', () => {
  it('again：ease-0.2、lapses+1、interval 归零、due=now+10分钟', () => {
    const next = scheduleCard(createCard('teenage', NOW), 'again', NOW);
    expect(next.ease).toBeCloseTo(2.3);
    expect(next.intervalDays).toBe(0);
    expect(next.reps).toBe(1);
    expect(next.lapses).toBe(1);
    expect(next.due).toBe(NOW + AGAIN_DELAY_MS);
  });

  it('hard：ease-0.15、interval=1天、due=now+1天', () => {
    const next = scheduleCard(createCard('teenage', NOW), 'hard', NOW);
    expect(next.ease).toBeCloseTo(2.35);
    expect(next.intervalDays).toBe(1);
    expect(next.lapses).toBe(0);
    expect(next.due).toBe(NOW + 1 * DAY_MS);
  });

  it('good：ease 不变、interval=1天、due=now+1天', () => {
    const next = scheduleCard(createCard('teenage', NOW), 'good', NOW);
    expect(next.ease).toBeCloseTo(2.5);
    expect(next.intervalDays).toBe(1);
    expect(next.due).toBe(NOW + 1 * DAY_MS);
  });

  it('easy：ease+0.15、interval=3天、due=now+3天', () => {
    const next = scheduleCard(createCard('teenage', NOW), 'easy', NOW);
    expect(next.ease).toBeCloseTo(2.65);
    expect(next.intervalDays).toBe(3);
    expect(next.due).toBe(NOW + 3 * DAY_MS);
  });
});

describe('scheduleCard · 复习卡间隔增长', () => {
  it('good：interval=1、ease=2.5 → interval=round(1×2.5)=3', () => {
    const card = { ...createCard('teenage'), intervalDays: 1, reps: 1 };
    const next = scheduleCard(card, 'good', NOW);
    expect(next.intervalDays).toBe(3);
    expect(next.due).toBe(NOW + 3 * DAY_MS);
  });

  it('easy：interval=3、ease=2.65 → interval=round(3×2.65×1.3)=10', () => {
    const card = { ...createCard('teenage'), ease: 2.65, intervalDays: 3, reps: 2 };
    const next = scheduleCard(card, 'easy', NOW);
    expect(next.ease).toBeCloseTo(2.8);
    expect(next.intervalDays).toBe(10);
  });

  it('hard：interval=10 → interval=round(10×1.2)=12', () => {
    const card = { ...createCard('teenage'), intervalDays: 10, reps: 3 };
    const next = scheduleCard(card, 'hard', NOW);
    expect(next.intervalDays).toBe(12);
  });

  it('again 后重学：interval 归零、due=now+10分钟', () => {
    const card = { ...createCard('teenage'), intervalDays: 12, reps: 4 };
    const next = scheduleCard(card, 'again', NOW);
    expect(next.intervalDays).toBe(0);
    expect(next.due).toBe(NOW + AGAIN_DELAY_MS);
    expect(next.reps).toBe(5);
    expect(next.lapses).toBe(1);
  });
});

describe('scheduleCard · ease 上下限', () => {
  it('ease 低于下限时钳制到 1.3', () => {
    const card = { ...createCard('teenage'), ease: MIN_EASE, intervalDays: 5, reps: 2 };
    const next = scheduleCard(card, 'again', NOW);
    expect(next.ease).toBe(MIN_EASE);
  });

  it('ease 高于上限时钳制到 3.0', () => {
    const card = { ...createCard('teenage'), ease: 2.95, intervalDays: 5, reps: 2 };
    const next = scheduleCard(card, 'easy', NOW);
    expect(next.ease).toBe(MAX_EASE);
  });
});

describe('scheduleCard · 纯函数性', () => {
  it('不修改原卡片，保留 id', () => {
    const card = createCard('teenage', NOW);
    const next = scheduleCard(card, 'good', NOW);
    expect(card.reps).toBe(0); // 原对象不被改动
    expect(next.id).toBe('teenage');
    expect(next).not.toBe(card);
  });
});
