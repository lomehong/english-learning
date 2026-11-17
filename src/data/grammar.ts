import type { FillExercise, GrammarExercise, GrammarPoint } from '../types';
import { unit1GrammarPoints, unit1Exercises } from './unit1-grammar';
import { unit2GrammarPoints, unit2Exercises } from './unit2-grammar';
import { UNIT_IDS, type UnitId } from './units';

/**
 * 语法模块注册表：两单元讲解卡/练习题按单元取用；
 * 填空判分（normalizeAnswer / checkFillAnswer）为全单元共享的纯函数。
 */

const pointsByUnit: Record<UnitId, GrammarPoint[]> = {
  unit1: unit1GrammarPoints,
  unit2: unit2GrammarPoints,
};

const exercisesByUnit: Record<UnitId, GrammarExercise[]> = {
  unit1: unit1Exercises,
  unit2: unit2Exercises,
};

/** 按单元取语法讲解卡 */
export function getGrammarPoints(unit: UnitId): GrammarPoint[] {
  return pointsByUnit[unit];
}

/** 按单元取专项练习题 */
export function getGrammarExercises(unit: UnitId): GrammarExercise[] {
  return exercisesByUnit[unit];
}

const pointById = new Map(UNIT_IDS.flatMap((u) => pointsByUnit[u].map((p) => [p.id, p] as const)));

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
