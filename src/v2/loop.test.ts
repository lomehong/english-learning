import { describe, it, expect } from 'vitest';
import {
  createLoopTracker,
  initialLoopSnapshot,
  isLoopComplete,
  LOOP_STEPS,
  reduceLoop,
  type LoopSnapshot,
} from './loop';

/**
 * 学习闭环状态模型（T5）单测：
 * 计划 → 词汇 → 小测 → 错题入本 → 进度更新 的可追踪状态机。
 * 覆盖：初始态、事件推进、幂等性、新计划重置、完成判定、订阅通知。
 */

const T0 = 1000;

function fresh(): LoopSnapshot {
  return initialLoopSnapshot(T0);
}

describe('reduceLoop 状态推进', () => {
  it('初始态：五步全部 pending，计数为零', () => {
    const snap = fresh();
    for (const step of LOOP_STEPS) expect(snap.steps[step.id]).toBe('pending');
    expect(snap.cards).toEqual({ shown: 0, total: 0 });
    expect(snap.quiz).toEqual({ answered: 0, total: 0, correct: 0 });
    expect(snap.wrongAdded).toBe(0);
    expect(snap.finishedAt).toBeNull();
    expect(isLoopComplete(snap)).toBe(false);
  });

  it('plan-created：计划完成、词汇进行（有新词）或直接完成（无新词）', () => {
    const withCards = reduceLoop(fresh(), { type: 'plan-created', cardsTotal: 12 }, T0 + 1);
    expect(withCards.steps.plan).toBe('done');
    expect(withCards.steps.cards).toBe('active');
    expect(withCards.cards).toEqual({ shown: 0, total: 12 });
    expect(withCards.steps.quiz).toBe('pending');

    const noCards = reduceLoop(fresh(), { type: 'plan-created', cardsTotal: 0 }, T0 + 1);
    expect(noCards.steps.cards).toBe('done');
  });

  it('cards-shown：累计出卡，出满后词汇步完成（计数只进不退）', () => {
    let snap = reduceLoop(fresh(), { type: 'plan-created', cardsTotal: 8 }, T0);
    snap = reduceLoop(snap, { type: 'cards-shown', shown: 4, total: 8 }, T0 + 1);
    expect(snap.steps.cards).toBe('active');
    expect(snap.cards).toEqual({ shown: 4, total: 8 });

    // 乱序的旧计数不回退（shown 取 max）
    snap = reduceLoop(snap, { type: 'cards-shown', shown: 2, total: 8 }, T0 + 2);
    expect(snap.cards.shown).toBe(4);

    snap = reduceLoop(snap, { type: 'cards-shown', shown: 8, total: 8 }, T0 + 3);
    expect(snap.steps.cards).toBe('done');
  });

  it('quiz 链路：started → answered×n → 答满自动 done', () => {
    let snap = reduceLoop(fresh(), { type: 'plan-created', cardsTotal: 4 }, T0);
    snap = reduceLoop(snap, { type: 'cards-shown', shown: 4, total: 4 }, T0 + 1);
    snap = reduceLoop(snap, { type: 'quiz-started', total: 3 }, T0 + 2);
    expect(snap.steps.quiz).toBe('active');
    expect(snap.quiz).toEqual({ answered: 0, total: 3, correct: 0 });

    snap = reduceLoop(snap, { type: 'quiz-answered', correct: true }, T0 + 3);
    snap = reduceLoop(snap, { type: 'quiz-answered', correct: false }, T0 + 4);
    expect(snap.quiz).toEqual({ answered: 2, total: 3, correct: 1 });
    expect(snap.steps.quiz).toBe('active');

    snap = reduceLoop(snap, { type: 'quiz-answered', correct: true }, T0 + 5);
    expect(snap.steps.quiz).toBe('done');
    expect(snap.quiz).toEqual({ answered: 3, total: 3, correct: 2 });
  });

  it('错题入本：wrong-added 计数并完成错题步；quiz-finished 零错题时同样完成', () => {
    let withWrong = reduceLoop(fresh(), { type: 'quiz-started', total: 2 }, T0);
    withWrong = reduceLoop(withWrong, { type: 'quiz-answered', correct: false }, T0 + 1);
    withWrong = reduceLoop(withWrong, { type: 'wrong-added' }, T0 + 2);
    expect(withWrong.wrongAdded).toBe(1);
    expect(withWrong.steps.wrongbook).toBe('done');

    let allCorrect = reduceLoop(fresh(), { type: 'quiz-started', total: 1 }, T0);
    allCorrect = reduceLoop(allCorrect, { type: 'quiz-answered', correct: true }, T0 + 1);
    allCorrect = reduceLoop(allCorrect, { type: 'quiz-finished' }, T0 + 2);
    expect(allCorrect.steps.wrongbook).toBe('done');
    expect(allCorrect.wrongAdded).toBe(0);
  });

  it('progress-updated 收尾：五步齐活盖 finishedAt；缺一步不算完成', () => {
    let snap = reduceLoop(fresh(), { type: 'plan-created', cardsTotal: 4 }, T0);
    snap = reduceLoop(snap, { type: 'cards-shown', shown: 4, total: 4 }, T0 + 1);
    snap = reduceLoop(snap, { type: 'quiz-started', total: 1 }, T0 + 2);
    snap = reduceLoop(snap, { type: 'quiz-answered', correct: false }, T0 + 3);
    snap = reduceLoop(snap, { type: 'wrong-added' }, T0 + 4);
    // 错题已入本但进度未更新：未完成
    expect(isLoopComplete(snap)).toBe(false);
    snap = reduceLoop(snap, { type: 'progress-updated' }, T0 + 5);
    expect(isLoopComplete(snap)).toBe(true);
    expect(snap.finishedAt).toBe(T0 + 5);
  });

  it('新计划是唯一重置点：完成后 plan-created 清零重新开始', () => {
    let snap = reduceLoop(fresh(), { type: 'plan-created', cardsTotal: 4 }, T0);
    snap = reduceLoop(snap, { type: 'cards-shown', shown: 4, total: 4 }, T0 + 1);
    snap = reduceLoop(snap, { type: 'quiz-started', total: 2 }, T0 + 2);
    snap = reduceLoop(snap, { type: 'quiz-answered', correct: false }, T0 + 3);
    snap = reduceLoop(snap, { type: 'wrong-added' }, T0 + 4);
    snap = reduceLoop(snap, { type: 'quiz-answered', correct: true }, T0 + 5);
    snap = reduceLoop(snap, { type: 'progress-updated' }, T0 + 6);
    expect(isLoopComplete(snap)).toBe(true);

    snap = reduceLoop(snap, { type: 'plan-created', cardsTotal: 6 }, T0 + 7);
    expect(snap.steps).toEqual({
      plan: 'done',
      cards: 'active',
      quiz: 'pending',
      wrongbook: 'pending',
      progress: 'pending',
    });
    expect(snap.cards).toEqual({ shown: 0, total: 6 });
    expect(snap.quiz).toEqual({ answered: 0, total: 0, correct: 0 });
    expect(snap.wrongAdded).toBe(0);
    expect(snap.finishedAt).toBeNull();
  });

  it('状态只进不退：done 之后的 pending 事件不回退', () => {
    let snap = reduceLoop(fresh(), { type: 'plan-created', cardsTotal: 4 }, T0);
    snap = reduceLoop(snap, { type: 'cards-shown', shown: 4, total: 4 }, T0 + 1);
    expect(snap.steps.cards).toBe('done');
    // cards-shown 带 active 语义不再回退
    const again = reduceLoop(snap, { type: 'cards-shown', shown: 0, total: 0 }, T0 + 2);
    expect(again.steps.cards).toBe('done');
  });
});

describe('createLoopTracker 订阅', () => {
  it('dispatch 推进快照并通知订阅者；状态无变化不打扰', () => {
    let tick = T0;
    const tracker = createLoopTracker(() => tick);
    const seen: LoopSnapshot[] = [];
    const off = tracker.subscribe((s) => seen.push(s));

    tick += 1;
    tracker.dispatch({ type: 'plan-created', cardsTotal: 8 });
    tracker.dispatch({ type: 'cards-shown', shown: 4, total: 8 });
    expect(seen.length).toBe(2);
    expect(seen[1]!.cards).toEqual({ shown: 4, total: 8 });

    // 同值事件（无状态变化）不通知
    tracker.dispatch({ type: 'cards-shown', shown: 4, total: 8 });
    expect(seen.length).toBe(2);

    off();
    tracker.dispatch({ type: 'quiz-started', total: 5 });
    expect(seen.length).toBe(2);
    expect(tracker.get().quiz.total).toBe(5);
  });
});
