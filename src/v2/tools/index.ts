/**
 * v2 数据工具（T4）：Agent 的四个 function calling 工具，对接 v1 store。
 *
 * - get_learning_state：汇总学习状态（进度 / 到期 / 今日完成度 / streak / 错题量）；
 * - query_vocab：按关键词或单元查词表；
 * - query_wrongbook：查错题本（可按模块过滤）；
 * - record_answer：作答记账——统计 + 每日活动 + 错题本联动 + 词汇 SRS 进度。
 *
 * 全部为纯数据函数：storage 接缝可注入（复用 v1 StorageLike），
 * 返回 JSON 可序列化对象（远程 Agent 作为 tool result 回传给模型；
 * 离线剧本直接消费同一批函数，保证两条路径记账一致）。
 *
 * 另含旧版错题种子（v1_wrongbook 键）的只读归并适配：验收 / 演示
 * 预置的简版错题数组在查询侧并入结果，正式 store 优先且不被回写。
 */

import type { PracticeModule, Grade, WrongEntry } from '../../types';
import type { ToolDef } from '../types';
import {
  loadProgress,
  saveProgress,
  type StorageLike,
  defaultStorage,
} from '../../store/progress';
import {
  loadWrongBook,
  saveWrongBook,
  recordWrong,
  removeEntry,
  inferModule,
  STORAGE_VERSION as WRONGBOOK_VERSION,
  type WrongBook,
} from '../../store/wrongbook';
import { loadStats, saveStats, recordAnswer as statsRecordAnswer, type StatsBook } from '../../store/stats';
import {
  loadDaily,
  loadGoal,
  recordActivityAndSave,
  goalCompletion,
  computeStreak,
  dayKey,
} from '../../store/daily';
import { allWords, getWord, getWordUnit, getWordsByUnit } from '../../data/words';
import { UNIT_IDS, UNIT_META, isUnitId } from '../../data/units';
import { createCard, scheduleCard } from '../../srs/sm2';

/** 工具执行上下文（接缝：默认真实 localStorage + 当前时间） */
export interface ToolContext {
  storage?: StorageLike;
  now?: () => number;
}

function storageOf(ctx: ToolContext): StorageLike {
  return ctx.storage ?? defaultStorage();
}

function nowOf(ctx: ToolContext): number {
  return (ctx.now ?? Date.now)();
}

const PRACTICE_MODULES: readonly PracticeModule[] = ['vocab', 'grammar', 'reading', 'listening'];

function isModule(value: unknown): value is PracticeModule {
  return typeof value === 'string' && (PRACTICE_MODULES as readonly string[]).includes(value);
}

function isGrade(value: unknown): value is Grade {
  return value === 'again' || value === 'hard' || value === 'good' || value === 'easy';
}

function strField(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() !== '' ? v : undefined;
}

/* -------------------- 旧版错题种子（只读适配） --------------------
 * 验收 / 演示通道会把简版错题数组直接预置到 localStorage：
 *   v1_wrongbook = [{ id, question, answer, wrongCount }, ...]
 * v1 store 的正式键是 english-learning.wrongbook.v1（形状不同，互不干扰）。
 * 此处只在 v2 工具读取侧做宽容归并：正式 store 优先，旧键条目按 id 去重补充，
 * 让「预置错题 → 复习错题」的演示闭环拿到真实数据；不回写、不改 v1 行为。 */

/** 旧版（验收预置）错题键名 */
export const LEGACY_WRONGBOOK_KEY = 'v1_wrongbook';

/** 旧键条目数上限（防坏种子撑爆结果） */
const LEGACY_MAX_ITEMS = 50;

function numField(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

/**
 * 旧版种子归一化（纯函数）：
 * 接受数组或 { entries: [...] }；条目字段按别名宽容映射
 * （id/exerciseId、question/stem、answer/correctAnswer、yourAnswer/userAnswer），
 * 形状非法的条目跳过，整体坏 JSON 抛给调用方兜底为空。
 */
export function parseLegacyWrongbook(raw: unknown): WrongEntry[] {
  const list = Array.isArray(raw)
    ? raw
    : raw !== null && typeof raw === 'object' && Array.isArray((raw as { entries?: unknown }).entries)
      ? ((raw as { entries: unknown[] }).entries)
      : null;
  if (list === null) return [];
  const out: WrongEntry[] = [];
  for (const node of list) {
    if (out.length >= LEGACY_MAX_ITEMS) break;
    if (typeof node !== 'object' || node === null) continue;
    const e = node as Record<string, unknown>;
    const exerciseId = strField(e.id) ?? strField(e.exerciseId);
    if (exerciseId === undefined) continue;
    const stem = strField(e.question) ?? strField(e.stem);
    const correctAnswer = strField(e.answer) ?? strField(e.correctAnswer);
    if (stem === undefined || correctAnswer === undefined) continue;
    const wrongCount = numField(e.wrongCount);
    out.push({
      exerciseId,
      module: isModule(e.module) ? e.module : inferModule(exerciseId),
      stem,
      yourAnswer: strField(e.yourAnswer) ?? strField(e.userAnswer) ?? '—',
      correctAnswer,
      explanation: strField(e.explanation) ?? '（旧版预置错题，无解析）',
      wrongCount: wrongCount === undefined ? 1 : Math.max(1, Math.floor(wrongCount)),
      lastWrongAt: numField(e.lastWrongAt) ?? 0,
    });
  }
  return out;
}

/**
 * 工具侧错题读取 = 正式 store + 旧版种子归并（只读）：
 * 正式条目优先；旧键条目按 exerciseId 去重补充；读失败 / 坏 JSON 回退正式数据。
 */
export function loadWrongbookForTools(storage: StorageLike): WrongBook {
  const book = loadWrongBook(storage);
  let raw: string | null = null;
  try {
    raw = storage.getItem(LEGACY_WRONGBOOK_KEY);
  } catch {
    return book;
  }
  if (raw === null || raw.trim() === '') return book;
  try {
    const legacy = parseLegacyWrongbook(JSON.parse(raw));
    if (legacy.length === 0) return book;
    const entries = { ...book.entries };
    for (const entry of legacy) {
      if (!(entry.exerciseId in entries)) entries[entry.exerciseId] = entry;
    }
    return { version: WRONGBOOK_VERSION, entries };
  } catch {
    return book;
  }
}

/* -------------------- get_learning_state -------------------- */

export interface LearningState {
  /** 已学词数 / 全部词数 */
  learnedWords: number;
  totalWords: number;
  /** 当前到期复习数（due <= now） */
  dueReviews: number;
  /** 今日已学词 / 目标、今日作答 / 目标 */
  today: { vocab: number; vocabGoal: number; exercises: number; exercisesGoal: number };
  /** 今日总完成度 0~1 */
  overall: number;
  /** 连续学习天数 */
  streak: number;
  /** 错题本总量（按模块细分） */
  wrongbook: { total: number; byModule: Record<string, number> };
  /** 各模块累计作答 / 正确 */
  stats: Record<string, { answered: number; correct: number }>;
  /** 单元与册信息 */
  units: { id: string; label: string; words: number }[];
}

/** 汇总学习状态（读四份 store，拼一张总览） */
export function getLearningState(ctx: ToolContext = {}): LearningState {
  const storage = storageOf(ctx);
  const now = nowOf(ctx);
  const progress = loadProgress(storage);
  const daily = loadDaily(storage);
  const goal = loadGoal(storage);
  const wrong = loadWrongbookForTools(storage);
  const stats: StatsBook = loadStats(storage);

  const cards = Object.values(progress.cards);
  const due = cards.filter((c) => c.due <= now).length;
  const completion = goalCompletion(goal, daily, now);
  const streak = computeStreak(daily, now);

  const byModule: Record<string, number> = {};
  let total = 0;
  for (const entry of Object.values(wrong.entries)) {
    byModule[entry.module] = (byModule[entry.module] ?? 0) + 1;
    total += 1;
  }

  const statsView: Record<string, { answered: number; correct: number }> = {};
  for (const m of PRACTICE_MODULES) {
    const s = stats.modules[m] ?? { answered: 0, correct: 0 };
    statsView[m] = { answered: s.answered, correct: s.correct };
  }

  return {
    learnedWords: cards.length,
    totalWords: allWords.length,
    dueReviews: due,
    today: {
      vocab: completion.vocab,
      vocabGoal: completion.vocabGoal,
      exercises: completion.exercises,
      exercisesGoal: completion.exercisesGoal,
    },
    overall: Math.round(completion.overall * 100) / 100,
    streak,
    wrongbook: { total, byModule },
    stats: statsView,
    units: UNIT_IDS.map((id) => {
      const meta = UNIT_META[id]!;
      return { id, label: `${meta.no}·${meta.title}`, words: getWordsByUnit(id).length };
    }),
  };
}

/* -------------------- query_vocab -------------------- */

export interface VocabQueryArgs {
  keyword?: string;
  unit?: string;
  limit?: number;
}

export interface VocabItem {
  wordId: string;
  word: string;
  phonetic: string;
  pos: string;
  meaning: string;
  example: string;
  exampleZh: string;
  unit: string;
  /** 已学 = progress 中有卡片；已学附带到期与否 */
  learned: boolean;
  due: boolean;
}

/** 查词：关键词（拼写 / 释义，不区分大小写）+ 单元过滤，limit 默认 8、上限 20 */
export function queryVocab(args: VocabQueryArgs, ctx: ToolContext = {}): { items: VocabItem[]; total: number } {
  const storage = storageOf(ctx);
  const now = nowOf(ctx);
  const keyword = args.keyword?.trim().toLowerCase() ?? '';
  const limit = Math.min(20, Math.max(1, Math.floor(args.limit ?? 8)));

  const pool = args.unit !== undefined && isUnitId(args.unit) ? getWordsByUnit(args.unit) : allWords;
  const matched = pool.filter(
    (w) => keyword === '' || w.word.toLowerCase().includes(keyword) || w.meaning.includes(keyword),
  );

  const progress = loadProgress(storage);
  const items = matched.slice(0, limit).map((w): VocabItem => {
    const card = progress.cards[w.id];
    return {
      wordId: w.id,
      word: w.word,
      phonetic: w.phonetic,
      pos: w.pos,
      meaning: w.meaning,
      example: w.example,
      exampleZh: w.exampleZh,
      unit: getWordUnit(w.id) ?? 'unit1',
      learned: !!card,
      due: !!card && card.due <= now,
    };
  });
  return { items, total: matched.length };
}

/* -------------------- query_wrongbook -------------------- */

export interface WrongbookQueryArgs {
  module?: string;
  limit?: number;
}

/** 查错题本：可按模块过滤；按最近答错时间倒序 */
export function queryWrongbook(
  args: WrongbookQueryArgs,
  ctx: ToolContext = {},
): {
  total: number;
  items: Array<{
    exerciseId: string;
    module: string;
    stem: string;
    yourAnswer: string;
    correctAnswer: string;
    wrongCount: number;
    lastWrongAt: number;
  }>;
} {
  const wrong = loadWrongbookForTools(storageOf(ctx));
  const limit = Math.min(20, Math.max(1, Math.floor(args.limit ?? 10)));
  const module = isModule(args.module) ? args.module : null;
  const entries = Object.values(wrong.entries)
    .filter((e) => module === null || e.module === module)
    .sort((a, b) => b.lastWrongAt - a.lastWrongAt);
  return {
    total: entries.length,
    items: entries.slice(0, limit).map((e) => ({
      exerciseId: e.exerciseId,
      module: e.module,
      stem: e.stem,
      yourAnswer: e.yourAnswer,
      correctAnswer: e.correctAnswer,
      wrongCount: e.wrongCount,
      lastWrongAt: e.lastWrongAt,
    })),
  };
}

/* -------------------- record_answer -------------------- */

export interface RecordAnswerArgs {
  /** 练习模块；vocab 时可用 wordId + grade 走 SRS 通道 */
  module: string;
  correct: boolean;
  /** 非 vocab 通用记账所需 */
  exerciseId?: string;
  stem?: string;
  yourAnswer?: string;
  correctAnswer?: string;
  explanation?: string;
  /** vocab 通道 */
  wordId?: string;
  grade?: string;
  /** 统计归属单元（缺省按词归属 / unit1） */
  unit?: string;
}

export interface RecordAnswerResult {
  ok: boolean;
  /** 入账明细（供模型 / 剧本向用户复述） */
  recorded: {
    statsModule: string;
    correct: boolean;
    unit: string;
    wrongbookAdded: boolean;
    wrongbookRemoved: boolean;
    srs?: { intervalDays: number; dueInMinutes: number };
    today: { vocab: number; exercises: number };
  };
  message: string;
}

/**
 * 作答记账（对齐 v1 review/练习页的联动语义）：
 * - 统计：recordAnswer(modules + units 两维)；
 * - 今日活动：exercises +1；
 * - 错题本：答错入本（同题累加 wrongCount）；vocab 答对且已在错题本 → 掌握出本；
 * - vocab 且带 wordId：走 SM-2 调度（新词首次入账 = 标记已学并记 vocab 活动 +1）。
 */
export function recordAnswer(args: RecordAnswerArgs, ctx: ToolContext = {}): RecordAnswerResult {
  const storage = storageOf(ctx);
  const now = nowOf(ctx);
  const module = isModule(args.module) ? args.module : null;
  const empty = (message: string): RecordAnswerResult => ({
    ok: false,
    recorded: {
      statsModule: 'none',
      correct: false,
      unit: 'none',
      wrongbookAdded: false,
      wrongbookRemoved: false,
      today: { vocab: 0, exercises: 0 },
    },
    message,
  });
  if (module === null) {
    return empty(`非法模块 ${args.module}（可选：${PRACTICE_MODULES.join(' / ')}）`);
  }

  const correct = args.correct === true;
  const wordId = strField(args.wordId);
  const grade = isGrade(args.grade) ? args.grade : correct ? 'good' : 'again';
  const word = wordId !== undefined ? getWord(wordId) : undefined;
  if (module === 'vocab' && wordId !== undefined && word === undefined) {
    return empty(`词表外单词 id：${wordId}`);
  }

  /* ---- 归属单元 ---- */
  const unit =
    (args.unit !== undefined && isUnitId(args.unit) ? args.unit : undefined) ??
    (word !== undefined ? getWordUnit(word.id) : undefined) ??
    'unit1';

  /* ---- 词汇 SRS 通道 ---- */
  let srs: RecordAnswerResult['recorded']['srs'];
  if (module === 'vocab' && word !== undefined) {
    const progress = loadProgress(storage);
    const existing = progress.cards[word.id];
    const base = existing ?? createCard(word.id, now);
    const next = scheduleCard(base, grade, now);
    progress.cards[word.id] = next;
    saveProgress(progress, storage);
    srs = {
      intervalDays: next.intervalDays,
      dueInMinutes: Math.max(0, Math.round((next.due - now) / 60000)),
    };
    if (existing === undefined) recordActivityAndSave('vocab', now, 1, storage);
  }

  /* ---- 统计（模块 + 单元两维） ---- */
  saveStats(statsRecordAnswer(loadStats(storage), module, correct, unit), storage);

  /* ---- 今日作答 +1 ---- */
  recordActivityAndSave('exercises', now, 1, storage);

  /* ---- 错题本联动 ---- */
  let wrongbookAdded = false;
  let wrongbookRemoved = false;
  const book = loadWrongBook(storage);
  if (!correct) {
    const stem =
      strField(args.stem) ??
      (word !== undefined ? `${word.word} ${word.phonetic}` : strField(args.exerciseId) ?? '练习');
    const correctAnswer = strField(args.correctAnswer) ?? (word !== undefined ? word.meaning : '—');
    const explanation =
      strField(args.explanation) ??
      (word !== undefined
        ? `${word.pos} ${word.meaning} · 例句：${word.example}（${word.exampleZh}）`
        : '（无解析）');
    const id = strField(args.exerciseId) ?? (word !== undefined ? `w:${word.id}` : `v2:${now}`);
    saveWrongBook(
      recordWrong(
        book,
        {
          exerciseId: id,
          module,
          stem,
          yourAnswer: strField(args.yourAnswer) ?? '（未作答）',
          correctAnswer,
          explanation,
        },
        now,
      ),
      storage,
    );
    wrongbookAdded = true;
  } else if (module === 'vocab' && word !== undefined && book.entries[`w:${word.id}`]) {
    saveWrongBook(removeEntry(book, `w:${word.id}`), storage);
    wrongbookRemoved = true;
  }

  const daily = loadDaily(storage);
  const todayCount = daily.days[dayKey(now)] ?? { vocab: 0, exercises: 0 };

  const bits: string[] = [`已记录：${module} 模块${correct ? '答对' : '答错'}`, `当前单元 ${unit}`];
  if (wrongbookAdded) bits.push('已加入错题本');
  if (wrongbookRemoved) bits.push('掌握，已移出错题本');
  if (srs) bits.push(`下次复习约 ${srs.dueInMinutes} 分钟后`);

  return {
    ok: true,
    recorded: {
      statsModule: module,
      correct,
      unit,
      wrongbookAdded,
      wrongbookRemoved,
      srs,
      today: { vocab: todayCount.vocab, exercises: todayCount.exercises },
    },
    message: bits.join('；'),
  };
}

/* -------------------- 工具定义（OpenAI function schema） -------------------- */

/** 提供给远程 Agent 的工具清单（与上面执行器同名同参） */
export const V2_TOOL_DEFS: readonly ToolDef[] = [
  {
    type: 'function',
    function: {
      name: 'get_learning_state',
      description:
        '查看当前学习状态总览：已学词汇数、到期复习数、今日完成度、连续学习天数、错题本规模、各模块作答统计与单元清单。',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_vocab',
      description: '查询词表：可按英文拼写或中文释义关键词、单元 id 过滤，返回词条详情与学习状态。',
      parameters: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: '英文拼写或中文释义关键词（可选）' },
          unit: { type: 'string', description: '单元 id，如 unit1（可选）' },
          limit: { type: 'number', description: '返回条数上限，默认 8、最大 20（可选）' },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_wrongbook',
      description: '查询错题本：可按模块（vocab/grammar/reading/listening）过滤，返回题干、作答与正确答案。',
      parameters: {
        type: 'object',
        properties: {
          module: {
            type: 'string',
            enum: ['vocab', 'grammar', 'reading', 'listening'],
            description: '模块过滤（可选）',
          },
          limit: { type: 'number', description: '返回条数上限，默认 10、最大 20（可选）' },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'record_answer',
      description:
        '记录一次作答并联动学习数据：模块统计、今日活动 +1；答错自动入错题本；词汇题传 wordId + grade 走间隔复习调度（again/hard/good/easy），答对且原在错题本会移出。',
      parameters: {
        type: 'object',
        properties: {
          module: { type: 'string', enum: ['vocab', 'grammar', 'reading', 'listening'] },
          correct: { type: 'boolean', description: '是否答对' },
          exerciseId: { type: 'string', description: '练习题稳定 id（可选，缺省按词汇词 id 生成）' },
          stem: { type: 'string', description: '题干（可选）' },
          yourAnswer: { type: 'string', description: '用户作答（可选）' },
          correctAnswer: { type: 'string', description: '正确答案（可选）' },
          explanation: { type: 'string', description: '解析（可选）' },
          wordId: { type: 'string', description: '词汇题的单词 id（vocab 模块可选）' },
          grade: {
            type: 'string',
            enum: ['again', 'hard', 'good', 'easy'],
            description: 'SRS 四档评分（可选，缺省按 correct 映射）',
          },
          unit: { type: 'string', description: '统计归属单元 id（可选）' },
        },
        required: ['module', 'correct'],
        additionalProperties: false,
      },
    },
  },
] as const;

/**
 * 工具名 → 执行器（壳层 / 运行时按名分发；JSON 参数已解析为对象）。
 * 入参先做形状收敛（非对象 / 非法字段 → 缺省），执行期任何异常都转成
 * 结构化错误对象（{ error, message }）返回——离线剧本与远程 runtime
 * 拿到的是同一份错误形状，绝不把异常抛穿到壳层。
 */
export function executeTool(name: string, args: unknown, ctx: ToolContext = {}): unknown {
  if (typeof args !== 'object' || args === null || Array.isArray(args)) {
    return { error: 'invalid_arguments', message: `工具 ${name} 的参数应为 JSON 对象` };
  }
  const a = args as Record<string, unknown>;
  try {
    return dispatchTool(name, a, ctx);
  } catch (error) {
    return {
      error: 'tool_failed',
      message: `工具 ${name} 执行失败：${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function dispatchTool(name: string, a: Record<string, unknown>, ctx: ToolContext): unknown {
  switch (name) {
    case 'get_learning_state':
      return getLearningState(ctx);
    case 'query_vocab':
      return queryVocab(
        {
          keyword: typeof a.keyword === 'string' ? a.keyword : undefined,
          unit: typeof a.unit === 'string' ? a.unit : undefined,
          limit: typeof a.limit === 'number' ? a.limit : undefined,
        },
        ctx,
      );
    case 'query_wrongbook':
      return queryWrongbook(
        {
          module: typeof a.module === 'string' ? a.module : undefined,
          limit: typeof a.limit === 'number' ? a.limit : undefined,
        },
        ctx,
      );
    case 'record_answer':
      return recordAnswer(
        {
          module: typeof a.module === 'string' ? a.module : '',
          correct: a.correct === true,
          exerciseId: strField(a.exerciseId),
          stem: strField(a.stem),
          yourAnswer: strField(a.yourAnswer),
          correctAnswer: strField(a.correctAnswer),
          explanation: strField(a.explanation),
          wordId: strField(a.wordId),
          grade: typeof a.grade === 'string' ? a.grade : undefined,
          unit: typeof a.unit === 'string' ? a.unit : undefined,
        },
        ctx,
      );
    default:
      return { error: `未知工具 ${name}` };
  }
}
