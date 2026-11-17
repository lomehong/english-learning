import unit1WordsJson from './unit1-words.json';
import unit2WordsJson from './unit2-words.json';
import type { Word } from '../types';
import { UNIT_IDS, type UnitId } from './units';

/** 人教2019必修一 Unit 1（Teenage Life）内置词表 */
export const unit1Words = unit1WordsJson as Word[];

/** 人教2019必修一 Unit 2（Travelling Around）内置词表 */
export const unit2Words = unit2WordsJson as Word[];

/** 两单元词表合集（顺序：Unit 1 → Unit 2） */
export const allWords: Word[] = [...unit1Words, ...unit2Words];

const wordsByUnit: Record<UnitId, Word[]> = {
  unit1: unit1Words,
  unit2: unit2Words,
};

/** 按单元取词表 */
export function getWordsByUnit(unit: UnitId): Word[] {
  return wordsByUnit[unit];
}

const wordById = new Map(allWords.map((w) => [w.id, w]));
const unitByWordId = new Map<string, UnitId>();
for (const unit of UNIT_IDS) {
  for (const w of wordsByUnit[unit]) if (!unitByWordId.has(w.id)) unitByWordId.set(w.id, unit);
}

/** 跨单元查词（词汇复习队列 / 阅读生词共用；两单元 id 不重叠） */
export function getWord(id: string): Word | undefined {
  return wordById.get(id);
}

/** 查询单词所属单元（学习报告按单元统计 / 统计归属用）；词表外返回 undefined */
export function getWordUnit(id: string): UnitId | undefined {
  return unitByWordId.get(id);
}
