/**
 * 离线陪学剧本（T5）：无 key 降级的本地对话 Agent。
 *
 * 用真实词表 + v1 store 驱动完整学习闭环（全程对话内）：
 *   每日计划（get_learning_state）→ 词汇卡分组教学（card/audio）
 *   → 小测（quiz）→ 作答记账（record_answer：错题入本 / SRS 调度 / 今日活动）
 *   → 进度更新（progress 汇总收尾）。
 *
 * 与远程 Agent 实现同一 Agent 接口（run + emit），壳层无差别接入；
 * quiz 作答由壳层回传 handleQuizAnswer，剧本完成记账并给出反馈文案
 * （反馈文案同样可携带组件围栏，壳层走同一渲染管线）。
 *
 * T5 闭环跟踪：剧本在出计划 / 出卡 / 出题 / 记账 / 收尾时向 LoopTracker
 * 发事件（deps.loop 可注入壳层实例），驱动 /v2 常驻进度条的五步状态。
 */

import type { Agent, EmitFn } from '../types';
import type { StorageLike } from '../../store/progress';
import {
  getLearningState,
  queryVocab,
  queryWrongbook,
  recordAnswer,
  type LearningState,
  type ToolContext,
  type VocabItem,
} from '../tools';
import { toComponentFence, type QuizSpec } from '../components/dsl';
import { getWordsByUnit } from '../../data/words';
import { isUnitId } from '../../data/units';
import { createLoopTracker, type LoopTracker } from '../loop';

export interface OfflineDeps {
  storage?: StorageLike;
  now?: () => number;
  /** 流式「打字机」延迟接缝（测试注入空函数立即完成） */
  delay?: (ms: number) => Promise<void>;
  /** 闭环跟踪器接缝：壳层注入自己的实例，剧本事件直接驱动进度条 */
  loop?: LoopTracker;
}

type Stage = 'idle' | 'cards' | 'quiz';

interface QuizQuestion extends QuizSpec {
  wordId: string;
  correctAnswer: string;
  answered: boolean;
  correct: boolean;
}

const PRAISE = ['答得漂亮！', '很好，保持！', '正确！这个词已经稳了。', '太棒了，继续冲！'];
const COMFORT = ['没关系，已记进错题本，回头我们一起重练。', '错一次印象更深，别灰心。', '快对了，再看一眼释义。'];

/* -------------------- 小工具 -------------------- */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** 流式输出：按小块 emit，模拟打字机节奏 */
async function streamText(text: string, emit: EmitFn, delay: (ms: number) => Promise<void>): Promise<void> {
  const SIZE = 28;
  for (let i = 0; i < text.length; i += SIZE) {
    emit({ type: 'text-delta', text: text.slice(i, i + SIZE) });
    await delay(14);
  }
}

/* -------------------- 剧本 Agent -------------------- */

export interface OfflineTutor extends Agent {
  /** 壳层回传 quiz 作答；返回要追加展示的反馈文案（含组件围栏），null 表示忽略 */
  handleQuizAnswer(info: { id: string; correct: boolean; choiceIndex: number; choice: string }): string | null;
  /** 当前阶段（测试 / 状态展示用） */
  readonly stage: Stage;
  /** 学习闭环跟踪器（T5）：壳层订阅后驱动进度条 */
  readonly loop: LoopTracker;
}

export function createOfflineTutor(deps: OfflineDeps = {}): OfflineTutor {
  const ctx: ToolContext = { storage: deps.storage, now: deps.now };
  const delay = deps.delay ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const rng = mulberry32(deps.now?.() ?? Date.now());

  let stage: Stage = 'idle';
  /** 当前正在出示的一组词（≤ BATCH） */
  let currentBatch: VocabItem[] = [];
  /** 待出卡的剩余词（继续 → 下一组） */
  let queue: VocabItem[] = [];
  let quiz: QuizQuestion[] = [];
  /** 当前教学单元 */
  let unit = 'unit1';
  const BATCH = 4;

  /** 学习闭环跟踪器：出计划 / 出卡 / 出题 / 记账时发事件，壳层进度条订阅 */
  const loop = deps.loop ?? createLoopTracker(deps.now ?? Date.now);
  /** 本轮已出卡数（累计）与本轮新增错题数（新计划时重置） */
  let cardsShown = 0;
  let wrongAddedThisRound = 0;

  function pickUnit(text: string): string {
    const m = /unit\s*(\d+)/i.exec(text);
    if (m) {
      const id = `unit${m[1]}`;
      if (isUnitId(id)) return id;
    }
    return unit;
  }

  /**
   * 把一次 store 读取包装成工具事件：离线剧本与远程 tool calling
   * 同一语义（tool-start → 执行 → tool-end），壳层状态行可见「调用了什么」。
   */
  function withTool<T>(name: string, args: Record<string, unknown>, emit: EmitFn, fn: () => T): T {
    emit({ type: 'tool-start', name, args });
    try {
      const result = fn();
      emit({ type: 'tool-end', name, ok: true, result });
      return result;
    } catch (error) {
      emit({
        type: 'tool-end',
        name,
        ok: false,
        result: { error: error instanceof Error ? error.message : String(error) },
      });
      throw error;
    }
  }

  /** 学习状态总览（带工具事件） */
  const stateTool = (emit: EmitFn): LearningState =>
    withTool('get_learning_state', {}, emit, () => getLearningState(ctx));

  /** 查词（带工具事件） */
  const vocabTool = (
    args: { keyword?: string; unit?: string; limit?: number },
    emit: EmitFn,
  ): { items: VocabItem[]; total: number } => withTool('query_vocab', args, emit, () => queryVocab(args, ctx));

  /** 查错题本（带工具事件） */
  const wrongbookTool = (args: { module?: string; limit?: number }, emit: EmitFn) =>
    withTool('query_wrongbook', args, emit, () => queryWrongbook(args, ctx));

  /* ---------- 各场景回复 ---------- */

  function planReply(userText: string, emit: EmitFn): string {
    unit = pickUnit(userText);
    const state = stateTool(emit);
    const { items } = vocabTool({ unit, limit: 200 }, emit);
    const fresh = items.filter((w) => !w.learned);
    currentBatch = fresh.slice(0, BATCH);
    queue = fresh.slice(BATCH);
    stage = currentBatch.length > 0 ? 'cards' : 'idle';

    // 闭环事件：新一轮计划（唯一重置点）→ 词汇环节开始
    cardsShown = currentBatch.length;
    wrongAddedThisRound = 0;
    loop.dispatch({ type: 'plan-created', cardsTotal: fresh.length });
    if (currentBatch.length > 0) loop.dispatch({ type: 'cards-shown', shown: cardsShown, total: fresh.length });

    const lines: string[] = [];
    lines.push(
      `先看看你的底子：已学 ${state.learnedWords}/${state.totalWords} 词，今日目标 ${state.today.vocab} 词 + ${state.today.exercises} 题，连续学习 ${state.streak} 天。`,
    );
    // 计划卡：把「计划 → 词汇 → 小测 → 错题 → 进度」闭环写进一张卡（截图判据）
    lines.push(
      toComponentFence({
        type: 'card',
        title: '今日学习计划',
        badge: unit,
        items: [
          `词汇 · ${unit} 新词 ${fresh.length} 个，本组先学 ${currentBatch.length} 个`,
          '小测 · 学完即测 5 题以内，即时判分',
          '错题 · 答错的题自动进错题本',
          '进度 · 小测完成后更新今日完成度',
        ],
      }),
    );
    const overall = Math.round(state.overall * 100);
    lines.push(toComponentFence({ type: 'progress', label: '今日完成度', value: overall, hint: `${state.today.vocab}/${state.today.vocabGoal} 词 · ${state.today.exercises}/${state.today.exercisesGoal} 题` }));
    if (state.dueReviews > 0) lines.push(`另有 ${state.dueReviews} 个到期单词，小测里会优先安排复习。`);
    if (currentBatch.length === 0) {
      lines.push(`这个单元的词都学过了！说「来一组小测」检验一下，或换个单元（如「背 unit2 的词」）。`);
      lines.push(toComponentFence({ type: 'audio', text: 'Well done! You have finished all the new words in this unit.', label: '🔊 听一句鼓励' }));
      return lines.join('\n\n');
    }
    lines.push(`今天的计划：先攻 ${unit} 的 ${currentBatch.length} 个新词，随后小测检验；答错的自动进错题本。准备好了，先认识这一组 👇`);
    lines.push(toComponentFence({ type: 'timer', seconds: 180, label: '本组建议用时' }));
    return lines.join('\n\n');
  }

  function cardsReply(): string {
    currentBatch = queue.slice(0, BATCH);
    queue = queue.slice(BATCH);
    stage = 'cards';
    cardsShown += currentBatch.length;
    loop.dispatch({ type: 'cards-shown', shown: cardsShown, total: cardsShown + queue.length });
    if (queue.length === 0) {
      return `下一组来了（这是最后一组，之后还剩 0 词）：`;
    }
    return `下一组来了（之后还剩 ${queue.length} 词）：`;
  }

  function cardsBody(): string {
    const parts: string[] = [];
    for (const w of currentBatch) {
      parts.push(
        toComponentFence({
          type: 'card',
          title: `${w.pos} ${w.meaning}`,
          word: w.word,
          phonetic: w.phonetic,
          example: w.example,
          exampleZh: w.exampleZh,
          badge: w.unit,
        }),
      );
      parts.push(toComponentFence({ type: 'audio', text: `${w.word}. ${w.example}`, label: `🔊 跟读 ${w.word}` }));
    }
    return parts.join('\n\n');
  }

  function buildQuiz(emit: EmitFn): void {
    const pool =
      currentBatch.length > 0 ? currentBatch : vocabTool({ unit, limit: 12 }, emit).items.filter((w) => w.learned);
    const candidates = shuffle(pool, rng).slice(0, 5);
    const unitWords = getWordsByUnit(unit);
    quiz = candidates.map((w, i) => {
      // 题型交替：偶数题给释义选单词，奇数题给单词选释义
      const meaningMode = i % 2 === 0;
      const distract = shuffle(
        unitWords.filter((x) => x.id !== w.wordId),
        rng,
      ).slice(0, 3);
      if (meaningMode) {
        const options = shuffle([w.word, ...distract.map((d) => d.word)], rng);
        return {
          type: 'quiz',
          id: `v2q:${w.wordId}:${i}`,
          stem: `「${w.meaning}」对应的单词是？`,
          options,
          answerIndex: options.indexOf(w.word),
          explanation: `${w.word} ${w.phonetic} · ${w.pos} ${w.meaning}`,
          wordId: w.wordId,
          correctAnswer: w.word,
          answered: false,
          correct: false,
        } satisfies QuizQuestion;
      }
      const options = shuffle([w.meaning, ...distract.map((d) => d.meaning)], rng);
      return {
        type: 'quiz',
        id: `v2q:${w.wordId}:${i}`,
        stem: `${w.word} ${w.phonetic} 的意思是？`,
        options,
        answerIndex: options.indexOf(w.meaning),
        explanation: `${w.pos} ${w.meaning} · 例句：${w.example}`,
        wordId: w.wordId,
        correctAnswer: w.meaning,
        answered: false,
        correct: false,
      } satisfies QuizQuestion;
    });
    stage = 'quiz';
    loop.dispatch({ type: 'quiz-started', total: quiz.length });
  }

  function quizReply(userText: string, emit: EmitFn): string {
    unit = pickUnit(userText);
    if (currentBatch.length === 0) {
      const { items } = vocabTool({ unit, limit: 12 }, emit);
      currentBatch = items.filter((w) => w.learned).slice(0, 5);
      if (currentBatch.length === 0) currentBatch = items.slice(0, 5);
    }
    buildQuiz(emit);
    if (quiz.length === 0) return '这个词表暂时出不了题，换个单元试试（如「测 unit2」）。';
    return `好，${quiz.length} 道小测开始！点选项作答，我会逐一记账：答对进复习计划、答错进错题本。`;
  }

  function wrongbookReply(emit: EmitFn): string {
    const { total, items } = wrongbookTool({}, emit);
    loop.dispatch({ type: 'wrongbook-reviewed' });
    if (total === 0) return `错题本是空的，很干净！先来「开始今天的学习」，答错的题我会自动收进来。`;
    const lines = items.slice(0, 5).map(
      (e) => `${e.stem} → 你答「${e.yourAnswer}」，正确：${e.correctAnswer}（错 ${e.wrongCount} 次）`,
    );
    return [
      `错题本共 ${total} 条，最近的有：`,
      toComponentFence({ type: 'list', title: '最近错题', items: lines, tone: 'wrong' }),
      '逐条消灭它们：读一遍题干，遮住答案再想一次；需要的话我也可以「来一组小测」随机抽查。',
    ].join('\n\n');
  }

  function stateReply(emit: EmitFn): string {
    const s = stateTool(emit);
    const value = Math.round(s.overall * 100);
    return [
      `目前进度：已学 ${s.learnedWords}/${s.totalWords} 词，到期待复习 ${s.dueReviews} 个；今日 ${s.today.vocab}/${s.today.vocabGoal} 词、${s.today.exercises}/${s.today.exercisesGoal} 题；连续学习 ${s.streak} 天。`,
      toComponentFence({ type: 'progress', label: '今日完成度', value, hint: '加油，目标就在眼前' }),
    ].join('\n\n');
  }

  /* ---------- quiz 作答回执 ---------- */

  function handleQuizAnswer(info: {
    id: string;
    correct: boolean;
    choiceIndex: number;
    choice: string;
  }): string | null {
    const question = quiz.find((q) => q.id === info.id);
    if (!question || question.answered) return null;
    question.answered = true;
    question.correct = info.correct;

    const result = recordAnswer(
      {
        module: 'vocab',
        correct: info.correct,
        wordId: question.wordId,
        grade: info.correct ? 'good' : 'again',
        stem: question.stem,
        yourAnswer: info.choice,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        unit,
      },
      ctx,
    );

    // 闭环事件：小测作答记账；答错入本（错题步完成）
    loop.dispatch({ type: 'quiz-answered', correct: info.correct });
    if (!info.correct && result.recorded.wrongbookAdded) {
      wrongAddedThisRound += 1;
      loop.dispatch({ type: 'wrong-added' });
    }

    const pick = (list: readonly string[]): string => list[Math.floor(rng() * list.length)]!;
    const note = info.correct ? pick(PRAISE) : pick(COMFORT);

    const remaining = quiz.filter((q) => !q.answered).length;
    if (remaining > 0) {
      return `${note}（还剩 ${remaining} 题）${result.ok ? ` · ${result.message}` : ''}`;
    }

    // 收尾：全部作答完毕 → 闭环事件收口 + 进度更新汇总
    loop.dispatch({ type: 'quiz-finished' });
    loop.dispatch({ type: 'progress-updated' });
    const state = getLearningState(ctx);
    const correctCount = quiz.filter((q) => q.correct).length;
    const value = Math.round(state.overall * 100);
    stage = 'idle';
    return [
      `${note} 本轮小测 ${correctCount}/${quiz.length} 答对。${result.message}`,
      wrongAddedThisRound > 0
        ? `错题已入本（本轮 +${wrongAddedThisRound} 条），随时说「看看错题本」复盘。`
        : '本轮零错题，错题本没有新增，保持！',
      `今日进度已更新：`,
      toComponentFence({
        type: 'progress',
        label: '小测后的今日完成度',
        value,
        hint: `${state.today.vocab}/${state.today.vocabGoal} 词 · ${state.today.exercises}/${state.today.exercisesGoal} 题 · 连续 ${state.streak} 天`,
      }),
      '继续下一组就说「继续」，或「开始今天的学习」重新制定计划。',
    ].join('\n\n');
  }

  /* ---------- Agent 接口 ---------- */

  const tutor: OfflineTutor = {
    label: '离线陪学',
    offline: true,
    get stage() {
      return stage;
    },
    loop,
    handleQuizAnswer,
    async run(history, emit) {
      const lastUser = [...history].reverse().find((m) => m.role === 'user');
      const userText = lastUser?.content ?? '';

      let reply: string;
      let components = '';
      if (/计划|开始|今日|今天|学习|背/.test(userText) && !/测|考/.test(userText)) {
        reply = planReply(userText, emit);
        components = currentBatch.length > 0 ? cardsBody() : '';
      } else if (/测|考|quiz/i.test(userText)) {
        reply = quizReply(userText, emit);
        components = quiz.map((q) => toComponentFence(q)).join('\n\n');
      } else if (/继续|下一|next/i.test(userText)) {
        if (stage === 'cards' && queue.length > 0) {
          reply = cardsReply();
          components = cardsBody();
        } else if (stage === 'cards') {
          reply = '新词都过完了，直接上小测吧！';
          components = '';
        } else {
          reply = '我们从头来：先「开始今天的学习」制定计划。';
        }
      } else if (/错题/.test(userText)) {
        reply = wrongbookReply(emit);
      } else if (/状态|进度|报告/.test(userText)) {
        reply = stateReply(emit);
      } else if (userText.trim() === '') {
        reply = '想学点什么？可以说「开始今天的学习」，或让我「看看错题本」。';
      } else {
        reply =
          '我在呢！可以试试：\n「开始今天的学习」制定今日计划 ·「继续」背下一组 ·「来一组小测」检验成果 ·「看看错题本」复盘错题。也可以直接问单词，比如「查一下 adapt 什么意思」。';
        const m = /([a-zA-Z]{2,})/.exec(userText);
        if (m && /意思|什么|翻译|查询|查一下/.test(userText)) {
          const { items, total } = vocabTool({ keyword: m[1]!, limit: 3 }, emit);
          if (total > 0) {
            reply = `查到了 ${total} 个相关词条：`;
            components = items
              .map((w) =>
                toComponentFence({
                  type: 'card',
                  title: `${w.pos} ${w.meaning}`,
                  word: w.word,
                  phonetic: w.phonetic,
                  example: w.example,
                  exampleZh: w.exampleZh,
                  badge: w.unit,
                }),
              )
              .join('\n\n');
          } else {
            reply = `词表里没有找到「${m[1]}」，换个拼写试试？`;
          }
        }
      }

      const full = components === '' ? reply : `${reply}\n\n${components}`;
      await streamText(full, emit, delay);
      emit({ type: 'done' });
      return { role: 'assistant', content: full };
    },
  };
  return tutor;
}
