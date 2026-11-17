import type { WritingTask } from '../types';
import { unit1WritingTasks } from './unit1-writing';
import { unit2WritingTasks } from './unit2-writing';
import { UNIT_IDS, type UnitId } from './units';

/** 写作模块注册表：两单元任务按单元取用；词数统计为全单元共享的纯函数。 */

const tasksByUnit: Record<UnitId, WritingTask[]> = {
  unit1: unit1WritingTasks,
  unit2: unit2WritingTasks,
};

/** 按单元取写作任务 */
export function getWritingTasksByUnit(unit: UnitId): WritingTask[] {
  return tasksByUnit[unit];
}

const taskById = new Map(UNIT_IDS.flatMap((u) => tasksByUnit[u].map((t) => [t.id, t] as const)));

/** 跨单元按 id 查写作任务 */
export function getWritingTask(id: string): WritingTask | undefined {
  return taskById.get(id);
}

/** 词数统计：只计含字母的 token（与阅读/听力模块同一口径） */
export function countEssayWords(text: string): number {
  return text
    .split(/\s+/)
    .filter((token) => /[A-Za-z]/.test(token)).length;
}
