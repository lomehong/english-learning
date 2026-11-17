import wordsJson from './unit1-words.json';
import type { Word } from '../types';

/** 人教2019必修一 Unit 1（Teenage Life）内置词表 */
export const unit1Words = wordsJson as Word[];

const wordById = new Map(unit1Words.map((w) => [w.id, w]));

export function getWord(id: string): Word | undefined {
  return wordById.get(id);
}
