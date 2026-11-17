import type { WritingTask } from '../types';
import { UNIT_IDS, UNIT_REGISTRY, type UnitId } from './units';

/**
 * 写作模块：任务按单元从注册表取用（新增单元零改动）；
 * 词数统计为全单元共享的纯函数。
 */

/** 按单元取写作任务 */
export function getWritingTasksByUnit(unit: UnitId): WritingTask[] {
  return UNIT_REGISTRY[unit].writingTasks;
}

const taskById = new Map(
  UNIT_IDS.flatMap((u) => UNIT_REGISTRY[u].writingTasks.map((t) => [t.id, t] as const)),
);

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
