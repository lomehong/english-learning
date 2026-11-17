import type { ListeningMaterial, ListeningQuestion } from '../types';
import { unit1Listenings } from './unit1-listening';
import { unit2Listenings } from './unit2-listening';
import { UNIT_IDS, type UnitId } from './units';

/**
 * 听力模块注册表：两单元材料按单元取用；
 * 词数统计与题型标签为全单元共享的纯函数。
 */

const listeningsByUnit: Record<UnitId, ListeningMaterial[]> = {
  unit1: unit1Listenings,
  unit2: unit2Listenings,
};

/** 按单元取听力材料 */
export function getListeningsByUnit(unit: UnitId): ListeningMaterial[] {
  return listeningsByUnit[unit];
}

const materialById = new Map(UNIT_IDS.flatMap((u) => listeningsByUnit[u].map((m) => [m.id, m] as const)));

/** 跨单元按 id 查听力材料 */
export function getListening(id: string): ListeningMaterial | undefined {
  return materialById.get(id);
}

/** 听力题型中文标签 */
export const LISTENING_QUESTION_TYPE_LABEL: Record<ListeningQuestion['type'], string> = {
  detail: '细节理解',
  inference: '推理判断',
};

/** 词数统计：只计含字母的 token（与阅读模块同一口径） */
export function countScriptWords(script: string[]): number {
  return script
    .join(' ')
    .split(/\s+/)
    .filter((token) => /[A-Za-z]/.test(token)).length;
}
