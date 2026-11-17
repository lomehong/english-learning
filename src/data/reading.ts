import type { ReadingPassage, ReadingQuestion } from '../types';
import { unit1Passages } from './unit1-reading';
import { unit2Passages } from './unit2-reading';
import { UNIT_IDS, type UnitId } from './units';

/**
 * 阅读模块注册表：两单元短文按单元取用；
 * 词数统计与题型标签为全单元共享的纯函数。
 */

const passagesByUnit: Record<UnitId, ReadingPassage[]> = {
  unit1: unit1Passages,
  unit2: unit2Passages,
};

/** 按单元取阅读短文 */
export function getPassagesByUnit(unit: UnitId): ReadingPassage[] {
  return passagesByUnit[unit];
}

const passageById = new Map(UNIT_IDS.flatMap((u) => passagesByUnit[u].map((p) => [p.id, p] as const)));

/** 跨单元按 id 查短文 */
export function getPassage(id: string): ReadingPassage | undefined {
  return passageById.get(id);
}

/** 题型中文标签 */
export const QUESTION_TYPE_LABEL: Record<ReadingQuestion['type'], string> = {
  detail: '细节理解',
  'main-idea': '主旨大意',
  inference: '推理判断',
  purpose: '写作意图',
};

/** 词数统计：只计含字母的 token（数字、破折号等符号不计词） */
export function countWords(paragraphs: string[]): number {
  return paragraphs
    .join(' ')
    .split(/\s+/)
    .filter((token) => /[A-Za-z]/.test(token)).length;
}
