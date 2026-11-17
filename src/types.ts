/** 词汇条目（内置词表） */
export interface Word {
  /** 稳定 id（用单词本身作小写 id） */
  id: string;
  /** 单词 */
  word: string;
  /** 音标（IPA，英式） */
  phonetic: string;
  /** 词性（缩写，如 n. / adj. / vt.） */
  pos: string;
  /** 中文释义 */
  meaning: string;
  /** 英文例句 */
  example: string;
  /** 例句中文翻译 */
  exampleZh: string;
}

/* -------------------- 语法模块 -------------------- */

/** 语法讲解卡：构成形式行 */
export interface GrammarForm {
  label: string;
  detail: string;
}

/** 语法讲解卡：例句 */
export interface GrammarExample {
  en: string;
  zh: string;
}

/** 语法讲解卡（一个语法点） */
export interface GrammarPoint {
  id: string;
  title: string;
  /** 一句话定位 */
  tagline: string;
  /** 肯定 / 否定 / 疑问等构成形式 */
  forms: GrammarForm[];
  /** 用法要点 */
  usages: string[];
  /** 常用时间标志词 */
  markers: string[];
  examples: GrammarExample[];
  /** 易错点提醒 */
  tips: string[];
}

/** 语法练习题：单项选择 */
export interface McqExercise {
  id: string;
  type: 'mcq';
  /** 关联 GrammarPoint.id */
  pointId: string;
  /** 题干（含 ______ 空位） */
  stem: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/** 语法练习题：填空（stem 括号内为所给词） */
export interface FillExercise {
  id: string;
  type: 'fill';
  pointId: string;
  stem: string;
  answer: string;
  /** 等价可接受形式（如缩写的展开形式） */
  acceptable?: string[];
  explanation: string;
}

export type GrammarExercise = McqExercise | FillExercise;

/* -------------------- 阅读模块 -------------------- */

/** 阅读理解选择题 */
export interface ReadingQuestion {
  id: string;
  /** 题型：细节理解 / 主旨大意 / 推理判断 / 写作意图 */
  type: 'detail' | 'main-idea' | 'inference' | 'purpose';
  /** 题干 */
  stem: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/** 短文生词表项：点击可加入词汇本（与词汇模块共享） */
export interface ReadingGlossEntry {
  /** 关联词表条目 id（Word.id，须存在于 unit1Words） */
  wordId: string;
  /** 该词在文中出现的拼写形式（用于渲染可点击生词） */
  forms: string[];
}

/** 阅读短文（自编，避免版权） */
export interface ReadingPassage {
  id: string;
  title: string;
  /** 体裁（记叙文 / 应用文等） */
  genre: string;
  /** 段落原文 */
  paragraphs: string[];
  glossary: ReadingGlossEntry[];
  questions: ReadingQuestion[];
}

/* -------------------- 听力模块 -------------------- */

/** 听力理解选择题 */
export interface ListeningQuestion {
  id: string;
  /** 题型：细节理解 / 推理判断 */
  type: 'detail' | 'inference';
  /** 题干 */
  stem: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

/** 听力材料（自编，避免版权；由浏览器 speechSynthesis 朗读） */
export interface ListeningMaterial {
  id: string;
  title: string;
  /** 体裁：独白 / 对话 */
  genre: string;
  /** 朗读原文（对话体按行含说话人标签，纯英文供 TTS 朗读） */
  script: string[];
  questions: ListeningQuestion[];
}

/** 练习模块标识（错题与统计共用的维度） */
export type PracticeModule = 'vocab' | 'grammar' | 'reading' | 'listening';

/** 错题本条目（localStorage 持久化单元） */
export interface WrongEntry {
  exerciseId: string;
  /** 所属模块（旧数据缺失时由加载归一化按 id 前缀推断） */
  module: PracticeModule;
  stem: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  /** 累计答错次数 */
  wrongCount: number;
  /** 最近一次答错时间（epoch 毫秒） */
  lastWrongAt: number;
}

/** SRS 四档评分 */
export type Grade = 'again' | 'hard' | 'good' | 'easy';

/** SM-2 卡片状态（进度持久化的最小单元） */
export interface Card {
  /** 对应 Word.id */
  id: string;
  /** 难度系数，区间 [1.3, 3.0] */
  ease: number;
  /** 当前复习间隔（天），0 表示处于重学步长 */
  intervalDays: number;
  /** 已完成复习次数 */
  reps: number;
  /** 遗忘（again）次数 */
  lapses: number;
  /** 下次到期时间（epoch 毫秒） */
  due: number;
}
