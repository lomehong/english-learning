/** 单元维度（词表 / 语法 / 阅读 / 听力 / 写作各模块共用的切换粒度） */

export type UnitId = 'unit1' | 'unit2';

export const UNIT_IDS: readonly UnitId[] = ['unit1', 'unit2'];

export interface UnitMeta {
  /** 教材单元号（人教2019必修一） */
  no: number;
  /** 单元标题（教材原文主题） */
  title: string;
  /** 中文主题译名 */
  titleZh: string;
}

export const UNIT_META: Record<UnitId, UnitMeta> = {
  unit1: { no: 1, title: 'Teenage Life', titleZh: '青少年生活' },
  unit2: { no: 2, title: 'Travelling Around', titleZh: '环游世界' },
};

/** 页面标题用：Unit 1 · Teenage Life */
export function unitTitle(unit: UnitId): string {
  const meta = UNIT_META[unit];
  return `Unit ${meta.no} ${meta.title}`;
}

export function isUnitId(value: unknown): value is UnitId {
  return typeof value === 'string' && (UNIT_IDS as readonly string[]).includes(value);
}
