import type { ListeningMaterial, ListeningQuestion } from '../types';
import { UNIT_IDS, UNIT_REGISTRY, type UnitId } from './units';

/**
 * 听力模块：材料按单元从注册表取用（新增单元零改动）；
 * 词数统计与题型标签为全单元共享的纯函数。
 */

/** 按单元取听力材料 */
export function getListeningsByUnit(unit: UnitId): ListeningMaterial[] {
  return UNIT_REGISTRY[unit].listenings;
}

const materialById = new Map(
  UNIT_IDS.flatMap((u) => UNIT_REGISTRY[u].listenings.map((m) => [m.id, m] as const)),
);

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
