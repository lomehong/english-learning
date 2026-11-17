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
