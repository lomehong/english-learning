/**
 * 单元注册表（数据驱动架构的唯一清单）：
 * 新增单元 = 新建一套 unit{n}-* 数据文件 + 在 UNIT_MANIFESTS 追加一行，
 * 词汇/语法/阅读/听力/写作各模块按 UnitId 从本注册表取数，页面代码无需改动。
 */

import type {
  Word,
  GrammarPoint,
  GrammarExercise,
  ReadingPassage,
  ListeningMaterial,
  WritingTask,
} from '../types';
import unit1WordsJson from './unit1-words.json';
import { unit1GrammarPoints, unit1Exercises } from './unit1-grammar';
import { unit1Passages } from './unit1-reading';
import { unit1Listenings } from './unit1-listening';
import { unit1WritingTasks } from './unit1-writing';
import unit2WordsJson from './unit2-words.json';
import { unit2GrammarPoints, unit2Exercises } from './unit2-grammar';
import { unit2Passages } from './unit2-reading';
import { unit2Listenings } from './unit2-listening';
import { unit2WritingTasks } from './unit2-writing';
import unit3WordsJson from './unit3-words.json';
import { unit3GrammarPoints, unit3Exercises } from './unit3-grammar';
import { unit3Passages } from './unit3-reading';
import { unit3Listenings } from './unit3-listening';
import { unit3WritingTasks } from './unit3-writing';

/** 单元 manifest：一个单元的全部元信息与五模块数据引用 */
export interface UnitManifest {
  /** 稳定单元 id（即 ?unit= 深链与 localStorage 的取值） */
  id: string;
  /** 教材单元号（人教2019必修一） */
  no: number;
  /** 单元标题（教材原文英文主题） */
  title: string;
  /** 中文主题译名 */
  theme: string;
  /** 词汇：词表 */
  words: Word[];
  /** 语法：讲解卡 + 专项练习 */
  grammarPoints: GrammarPoint[];
  grammarExercises: GrammarExercise[];
  /** 阅读：主题短文 */
  passages: ReadingPassage[];
  /** 听力：主题材料 */
  listenings: ListeningMaterial[];
  /** 写作：主题任务（含范文） */
  writingTasks: WritingTask[];
}

export const UNIT_MANIFESTS = [
  {
    id: 'unit1',
    no: 1,
    title: 'Teenage Life',
    theme: '青少年生活',
    words: unit1WordsJson as Word[],
    grammarPoints: unit1GrammarPoints,
    grammarExercises: unit1Exercises,
    passages: unit1Passages,
    listenings: unit1Listenings,
    writingTasks: unit1WritingTasks,
  },
  {
    id: 'unit2',
    no: 2,
    title: 'Travelling Around',
    theme: '环游世界',
    words: unit2WordsJson as Word[],
    grammarPoints: unit2GrammarPoints,
    grammarExercises: unit2Exercises,
    passages: unit2Passages,
    listenings: unit2Listenings,
    writingTasks: unit2WritingTasks,
  },
  {
    id: 'unit3',
    no: 3,
    title: 'Sports and Fitness',
    theme: '体育运动与健康',
    words: unit3WordsJson as Word[],
    grammarPoints: unit3GrammarPoints,
    grammarExercises: unit3Exercises,
    passages: unit3Passages,
    listenings: unit3Listenings,
    writingTasks: unit3WritingTasks,
  },
] as const satisfies readonly UnitManifest[];

/** 单元 id 联合类型：随注册表行自动扩展 */
export type UnitId = (typeof UNIT_MANIFESTS)[number]['id'];

/** 全部单元 id（注册表顺序） */
export const UNIT_IDS: readonly UnitId[] = UNIT_MANIFESTS.map((m) => m.id);

const registry = {} as Record<UnitId, UnitManifest>;
const metaRecord = {} as Record<UnitId, UnitMeta>;
for (const m of UNIT_MANIFESTS) {
  registry[m.id] = m;
  metaRecord[m.id] = { no: m.no, title: m.title, titleZh: m.theme };
}

/** 单元注册表：id → manifest（各模块按当前单元取数的唯一入口） */
export const UNIT_REGISTRY: Record<UnitId, UnitManifest> = registry;

/** 单元元信息（兼容既有页面用语，titleZh 即 manifest.theme） */
export interface UnitMeta {
  /** 教材单元号 */
  no: number;
  /** 英文主题 */
  title: string;
  /** 中文主题译名 */
  titleZh: string;
}

export const UNIT_META: Record<UnitId, UnitMeta> = metaRecord;

/** 页面标题用：Unit 1 · Teenage Life */
export function unitTitle(unit: UnitId): string {
  const meta = UNIT_META[unit];
  return `Unit ${meta.no} ${meta.title}`;
}

export function isUnitId(value: unknown): value is UnitId {
  return typeof value === 'string' && (UNIT_IDS as readonly string[]).includes(value);
}
