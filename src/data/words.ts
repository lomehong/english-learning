import type { Word } from '../types';
import { UNIT_IDS, UNIT_REGISTRY, type UnitId } from './units';

/** 词表模块：按单元从注册表取词（新增单元零改动） */

/** 按单元取词表 */
export function getWordsByUnit(unit: UnitId): Word[] {
  return UNIT_REGISTRY[unit].words;
}

/** 各单元词表合集（顺序 = 注册表顺序：Unit 1 → Unit 2 → Unit 3） */
export const allWords: Word[] = UNIT_IDS.flatMap((unit) => UNIT_REGISTRY[unit].words);

const wordById = new Map(allWords.map((w) => [w.id, w]));
const unitByWordId = new Map<string, UnitId>();
for (const unit of UNIT_IDS) {
  for (const w of UNIT_REGISTRY[unit].words) if (!unitByWordId.has(w.id)) unitByWordId.set(w.id, unit);
}

/** 跨单元查词（词汇复习队列 / 阅读生词共用；各单元 id 不重叠） */
export function getWord(id: string): Word | undefined {
  return wordById.get(id);
}

/** 查询单词所属单元（学习报告按单元统计 / 统计归属用）；词表外返回 undefined */
export function getWordUnit(id: string): UnitId | undefined {
  return unitByWordId.get(id);
}
