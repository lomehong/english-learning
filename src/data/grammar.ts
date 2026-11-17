import type { FillExercise, GrammarExercise, GrammarPoint } from '../types';
import { UNIT_IDS, UNIT_REGISTRY, type UnitId } from './units';

/**
 * 语法模块：讲解卡/练习题按单元从注册表取用（新增单元零改动）；
 * 填空判分（normalizeAnswer / checkFillAnswer）为全单元共享的纯函数。
 */

/** 按单元取语法讲解卡 */
export function getGrammarPoints(unit: UnitId): GrammarPoint[] {
  return UNIT_REGISTRY[unit].grammarPoints;
}

/** 按单元取专项练习题 */
export function getGrammarExercises(unit: UnitId): GrammarExercise[] {
  return UNIT_REGISTRY[unit].grammarExercises;
}

const pointById = new Map(
  UNIT_IDS.flatMap((u) => UNIT_REGISTRY[u].grammarPoints.map((p) => [p.id, p] as const)),
);

/** 跨单元按 id 查讲解卡（练习题展示所属语法点标题用） */
export function getGrammarPoint(id: string): GrammarPoint | undefined {
  return pointById.get(id);
}

/** 归一化填空答案：忽略大小写、首尾空格与词间多余空格，统一撇号，去掉句末标点 */
export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019]/gu, "'")
    .replace(/[.。!！?？,，]+$/u, '')
    .replace(/\s+/gu, ' ');
}

/** 判定填空题作答是否正确（含等价可接受形式） */
export function checkFillAnswer(exercise: FillExercise, input: string): boolean {
  const candidates = [exercise.answer, ...(exercise.acceptable ?? [])];
  const normalized = normalizeAnswer(input);
  if (normalized === '') return false;
  return candidates.some((c) => normalizeAnswer(c) === normalized);
}
