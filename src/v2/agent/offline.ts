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
 */

import type { Agent, EmitFn } from '../types';
import type { StorageLike } from '../../store/progress';
import {
  getLearningState,
  queryVocab,
  queryWrongbook,
  recordAnswer,
  type ToolContext,
  type VocabItem,
} from '../tools';
import { toComponentFence, type QuizSpec } from '../components/dsl';
import { getWordsByUnit } from '../../data/words';
import { isUnitId } from '../../data/units';

export interface OfflineDeps {
  storage?: StorageLike;
  now?: () => number;
  /** 流式「打字机」延迟接缝（测试注入空函数立即完成） */
  delay?: (ms: number) => Promise<void>;
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

  function pickUnit(text: string): string {
    const m = /unit\s*(\d+)/i.exec(text);
    if (m) {
      const id = `unit${m[1]}`;
      if (isUnitId(id)) return id;
    }
    return unit;
  }

  /* ---------- 各场景回复 ---------- */

  function planReply(userText: string): string {
    unit = pickUnit(userText);
    const state = getLearningState(ctx);
    const { items } = queryVocab({ unit, limit: 200 }, ctx);
    const fresh = items.filter((w) => !w.learned);
    currentBatch = fresh.slice(0, BATCH);
    queue = fresh.slice(BATCH);
    stage = currentBatch.length > 0 ? 'cards' : 'idle';

    const lines: string[] = [];
    lines.push(
      `先看看你的底子：已学 ${state.learnedWords}/${state.totalWords} 词，今日目标 ${state.today.vocab} 词 + ${state.today.exercises} 题，连续学习 ${state.streak} 天。`,
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

  function buildQuiz(): void {
    const pool = currentBatch.length > 0 ? currentBatch : queryVocab({ unit, limit: 12 }, ctx).items.filter((w) => w.learned);
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
  }

  function quizReply(userText: string): string {
    unit = pickUnit(userText);
    if (currentBatch.length === 0) {
      const { items } = queryVocab({ unit, limit: 12 }, ctx);
      currentBatch = items.filter((w) => w.learned).slice(0, 5);
      if (currentBatch.length === 0) currentBatch = items.slice(0, 5);
    }
    buildQuiz();
    if (quiz.length === 0) return '这个词表暂时出不了题，换个单元试试（如「测 unit2」）。';
    return `好，${quiz.length} 道小测开始！点选项作答，我会逐一记账：答对进复习计划、答错进错题本。`;
  }

  function wrongbookReply(): string {
    const { total, items } = queryWrongbook({}, ctx);
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

  function stateReply(): string {
    const s = getLearningState(ctx);
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

    const pick = (list: readonly string[]): string => list[Math.floor(rng() * list.length)]!;
    const note = info.correct ? pick(PRAISE) : pick(COMFORT);

    const remaining = quiz.filter((q) => !q.answered).length;
    if (remaining > 0) {
      return `${note}（还剩 ${remaining} 题）${result.ok ? ` · ${result.message}` : ''}`;
    }

    // 收尾：全部作答完毕 → 进度更新汇总
    const state = getLearningState(ctx);
    const correctCount = quiz.filter((q) => q.correct).length;
    const value = Math.round(state.overall * 100);
    stage = 'idle';
    return [
      `${note} 本轮小测 ${correctCount}/${quiz.length} 答对。${result.message}`,
      toComponentFence({
        type: 'progress',
        label: '小测后的今日完成度',
        value,
        hint: `${state.today.vocab}/${state.today.vocabGoal} 词 · ${state.today.exercises}/${state.today.exercisesGoal} 题 · 连续 ${state.streak} 天`,
      }),
      state.wrongbook.total > 0
        ? `错题本现有 ${state.wrongbook.total} 条，想复盘就说「看看错题本」。`
        : '错题本仍是空的，说明掌握得不错！',
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
    handleQuizAnswer,
    async run(history, emit) {
      const lastUser = [...history].reverse().find((m) => m.role === 'user');
      const userText = lastUser?.content ?? '';

      let reply: string;
      let components = '';
      if (/计划|开始|今日|今天|学习|背/.test(userText) && !/测|考/.test(userText)) {
        reply = planReply(userText);
        components = currentBatch.length > 0 ? cardsBody() : '';
      } else if (/测|考|quiz/i.test(userText)) {
        reply = quizReply(userText);
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
        reply = wrongbookReply();
      } else if (/状态|进度|报告/.test(userText)) {
        reply = stateReply();
      } else if (userText.trim() === '') {
        reply = '想学点什么？可以说「开始今天的学习」，或让我「看看错题本」。';
      } else {
        reply =
          '我在呢！可以试试：\n「开始今天的学习」制定今日计划 ·「继续」背下一组 ·「来一组小测」检验成果 ·「看看错题本」复盘错题。也可以直接问单词，比如「查一下 adapt 什么意思」。';
        const m = /([a-zA-Z]{2,})/.exec(userText);
        if (m && /意思|什么|翻译|查询|查一下/.test(userText)) {
          const { items, total } = queryVocab({ keyword: m[1]!, limit: 3 }, ctx);
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
