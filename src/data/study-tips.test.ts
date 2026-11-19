import { describe, it, expect } from 'vitest';
import { STUDY_TIPS } from './study-tips';
import type { StudyTip } from '../types';

/** 结构校验：学习建议数量与字段完整性 */
describe('高考英语学习建议', () => {
  it('恰好 6 条建议', () => {
    expect(STUDY_TIPS).toHaveLength(6);
  });

  it('每条 title、body 字段非空（去除首尾空白后仍有内容）', () => {
    for (const tip of STUDY_TIPS as StudyTip[]) {
      expect(tip.title, `title 不应为空`).toMatch(/\S/);
      expect(tip.body, `「${tip.title}」的 body 不应为空`).toMatch(/\S/);
    }
  });

  it('内容充实：标题与正文均有实质长度', () => {
    for (const tip of STUDY_TIPS as StudyTip[]) {
      expect(tip.title.trim().length, `「${tip.title}」标题过短`).toBeGreaterThanOrEqual(8);
      expect(tip.body.trim().length, `「${tip.title}」正文过短`).toBeGreaterThanOrEqual(40);
    }
  });
});
