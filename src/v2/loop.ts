/**
 * 学习闭环状态模型（T5）：每日计划 → 词汇卡 → 小测 → 错题入本 → 进度更新。
 *
 * 事件驱动的可追踪状态机：
 * - LoopEvent：剧本（离线 tutor）与壳层（远程模式从组件 / 工具结果推断）
 *   都只发这八种事件，不直接改状态；
 * - reduceLoop：纯函数 reducer，单步状态 pending → active → done 只进不退，
 *   唯一重置点是新一轮计划（plan-created）；
 * - LoopTracker：壳层持有的实例（deps.loop 注入剧本），dispatch 推进快照、
 *   状态无变化不通知订阅者；loopticker 据此渲染常驻进度条。
 *
 * 本模块不碰 DOM、不碰 storage：任何环境（jsdom / Node）可直接单测。
 */

/** 闭环步骤 id（按推进顺序） */
export type LoopStepId = 'plan' | 'cards' | 'quiz' | 'wrongbook' | 'progress';

/** 单步状态：待办 / 进行 / 完成 */
export type LoopStepStatus = 'pending' | 'active' | 'done';

/** 五步闭环（id + 进度条标签） */
export const LOOP_STEPS: ReadonlyArray<{ id: LoopStepId; label: string }> = [
  { id: 'plan', label: '计划' },
  { id: 'cards', label: '词汇' },
  { id: 'quiz', label: '小测' },
  { id: 'wrongbook', label: '错题' },
  { id: 'progress', label: '进度' },
];

/** 闭环事件（唯一的状态变更入口） */
export type LoopEvent =
  | { type: 'plan-created'; cardsTotal: number }
  | { type: 'cards-shown'; shown: number; total: number }
  | { type: 'quiz-started'; total: number }
  | { type: 'quiz-answered'; correct: boolean }
  | { type: 'wrong-added' }
  | { type: 'quiz-finished' }
  | { type: 'progress-updated' }
  | { type: 'wrongbook-reviewed' };

/** 闭环快照：五步状态 + 词汇 / 小测 / 错题计数 + 完成时刻 */
export interface LoopSnapshot {
  /** 五步各自的状态 */
  steps: Record<LoopStepId, LoopStepStatus>;
  /** 词汇环节：累计已出卡数 / 计划新词总数 */
  cards: { shown: number; total: number };
  /** 小测环节：已作答 / 总题数 / 答对数 */
  quiz: { answered: number; total: number; correct: number };
  /** 本轮新入错题本条数 */
  wrongAdded: number;
  /** 本轮开始时刻（计划制定 / 重置时间） */
  startedAt: number;
  /** 五步全部完成的时刻（未完成为 null；新一轮计划清空） */
  finishedAt: number | null;
}

/** 非负整数收敛（坏事件值不炸状态机） */
function count(value: number): number {
  return Math.max(0, Math.floor(value));
}

const RANK: Record<LoopStepStatus, number> = { pending: 0, active: 1, done: 2 };

/** 单调晋升：新状态不低于旧状态才生效（只进不退） */
function promote(prev: LoopStepStatus, next: LoopStepStatus): LoopStepStatus {
  return RANK[next] >= RANK[prev] ? next : prev;
}

/** 初始快照（全部待办、计数为零） */
export function initialLoopSnapshot(now: number): LoopSnapshot {
  return {
    steps: { plan: 'pending', cards: 'pending', quiz: 'pending', wrongbook: 'pending', progress: 'pending' },
    cards: { shown: 0, total: 0 },
    quiz: { answered: 0, total: 0, correct: 0 },
    wrongAdded: 0,
    startedAt: now,
    finishedAt: null,
  };
}

/** 五步是否全部完成 */
export function isLoopComplete(snapshot: LoopSnapshot): boolean {
  return LOOP_STEPS.every((step) => snapshot.steps[step.id] === 'done');
}

/**
 * 事件 → 新快照（纯函数；不改入参）。
 * 规则要点：
 * - plan-created 是唯一重置点：新一轮计划清空上一轮计数与完成标记；
 * - cards-shown 的计数取历史最大（乱序 / 重复事件不回退）；
 * - quiz-answered 答满自动收口小测步；错题步由 wrong-added 或
 *   「零错题收尾」（quiz-finished）完成；
 * - progress-updated 为终点：五步齐活才盖 finishedAt。
 */
export function reduceLoop(state: LoopSnapshot, event: LoopEvent, now: number): LoopSnapshot {
  switch (event.type) {
    case 'plan-created': {
      // 新一轮：全部重来（唯一允许状态回退的事件）
      const total = count(event.cardsTotal);
      return {
        steps: {
          plan: 'done',
          cards: total > 0 ? 'active' : 'done',
          quiz: 'pending',
          wrongbook: 'pending',
          progress: 'pending',
        },
        cards: { shown: 0, total },
        quiz: { answered: 0, total: 0, correct: 0 },
        wrongAdded: 0,
        startedAt: now,
        finishedAt: null,
      };
    }
    case 'cards-shown': {
      const shown = Math.max(state.cards.shown, count(event.shown));
      const total = Math.max(state.cards.total, count(event.total));
      const computed: LoopStepStatus =
        total > 0 ? (shown >= total ? 'done' : 'active') : state.steps.cards;
      return withSteps(state, { cards: promote(state.steps.cards, computed) }, {
        cards: { shown, total },
      });
    }
    case 'quiz-started': {
      const total = count(event.total);
      const computed: LoopStepStatus = total > 0 ? 'active' : 'done';
      return withSteps(
        state,
        {
          // 开测即视为词汇环节收口（正常流：学完才测）
          cards: promote(state.steps.cards, 'done'),
          quiz: promote(state.steps.quiz, computed),
        },
        { quiz: { answered: 0, total, correct: 0 } },
      );
    }
    case 'quiz-answered': {
      const answered = state.quiz.answered + 1;
      const correct = state.quiz.correct + (event.correct ? 1 : 0);
      const computed: LoopStepStatus =
        state.quiz.total > 0 ? (answered >= state.quiz.total ? 'done' : 'active') : 'done';
      return withSteps(state, { quiz: promote(state.steps.quiz, computed) }, {
        quiz: { answered, total: state.quiz.total, correct },
      });
    }
    case 'wrong-added': {
      return withSteps(state, { wrongbook: promote(state.steps.wrongbook, 'done') }, {
        wrongAdded: state.wrongAdded + 1,
      });
    }
    case 'quiz-finished': {
      // 零错题的收尾同样视为「错题入本」步走完（无可入本之题）
      const wrongbook: LoopStepStatus =
        state.wrongAdded === 0 ? promote(state.steps.wrongbook, 'done') : state.steps.wrongbook;
      return withSteps(state, { quiz: promote(state.steps.quiz, 'done'), wrongbook });
    }
    case 'progress-updated': {
      const next = withSteps(state, { progress: promote(state.steps.progress, 'done') });
      return isLoopComplete(next) ? { ...next, finishedAt: next.finishedAt ?? now } : next;
    }
    case 'wrongbook-reviewed': {
      // 复盘错题本同样收口错题步（空本复盘 = 该步无事可做）
      return withSteps(state, { wrongbook: promote(state.steps.wrongbook, 'done') });
    }
  }
}

/** 局部更新五步状态 / 计数（浅拷贝，不改入参） */
function withSteps(
  state: LoopSnapshot,
  steps: Partial<Record<LoopStepId, LoopStepStatus>>,
  counts: { cards?: LoopSnapshot['cards']; quiz?: LoopSnapshot['quiz']; wrongAdded?: number } = {},
): LoopSnapshot {
  return {
    steps: { ...state.steps, ...steps },
    cards: counts.cards ?? state.cards,
    quiz: counts.quiz ?? state.quiz,
    wrongAdded: counts.wrongAdded ?? state.wrongAdded,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
  };
}

/** 快照相等（订阅去重：无变化不打扰） */
function sameSnapshot(a: LoopSnapshot, b: LoopSnapshot): boolean {
  return (
    a.wrongAdded === b.wrongAdded &&
    a.startedAt === b.startedAt &&
    a.finishedAt === b.finishedAt &&
    a.cards.shown === b.cards.shown &&
    a.cards.total === b.cards.total &&
    a.quiz.answered === b.quiz.answered &&
    a.quiz.total === b.quiz.total &&
    a.quiz.correct === b.quiz.correct &&
    LOOP_STEPS.every((step) => a.steps[step.id] === b.steps[step.id])
  );
}

/** 闭环跟踪器接口：剧本事件入口 + 快照读取 + 订阅 */
export interface LoopTracker {
  /** 发一个闭环事件（状态无变化时不通知订阅者） */
  dispatch(event: LoopEvent): void;
  /** 当前快照（只读约定：调用方不得修改） */
  get(): LoopSnapshot;
  /** 订阅快照变更；返回退订函数 */
  subscribe(listener: (snapshot: LoopSnapshot) => void): () => void;
}

/** 创建跟踪器（now 接缝可注入，测试用固定时钟） */
export function createLoopTracker(now: () => number = Date.now): LoopTracker {
  let snapshot = initialLoopSnapshot(now());
  const listeners = new Set<(snapshot: LoopSnapshot) => void>();
  return {
    dispatch(event) {
      const next = reduceLoop(snapshot, event, now());
      if (sameSnapshot(snapshot, next)) return;
      snapshot = next;
      for (const listener of [...listeners]) listener(snapshot);
    },
    get: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
