import { describe, it, expect } from 'vitest';
import { unit1Listenings } from './unit1-listening';
import { unit2Listenings } from './unit2-listening';
import { countScriptWords, getListening, getListeningsByUnit, LISTENING_QUESTION_TYPE_LABEL } from './listening';

/** 听力材料与题目数据完整性（两单元共用同一套约束） */
function expectListeningsValid(listenings: typeof unit1Listenings, label: string): void {
  it(`${label}：内置 2 段自编听力文本，各配 3 道听力选择题`, () => {
    expect(listenings).toHaveLength(2);
    for (const m of listenings) {
      expect(m.script.length).toBeGreaterThan(0);
      expect(m.title).toBeTruthy();
      expect(m.genre).toBeTruthy();
      expect(m.questions).toHaveLength(3);
    }
  });

  it(`${label}：每段文本约 80 词（70–90 词区间）`, () => {
    for (const m of listenings) {
      const words = countScriptWords(m.script);
      expect(words).toBeGreaterThanOrEqual(70);
      expect(words).toBeLessThanOrEqual(90);
    }
  });

  it(`${label}：题目完整且合法：id 唯一、4 个不重复选项、answerIndex 在范围内、带解析与题型标签`, () => {
    const ids = new Set<string>();
    for (const m of listenings) {
      for (const q of m.questions) {
        expect(ids.has(q.id)).toBe(false);
        ids.add(q.id);
        expect(q.stem).toBeTruthy();
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options).size).toBe(4);
        expect(Number.isInteger(q.answerIndex)).toBe(true);
        expect(q.answerIndex).toBeGreaterThanOrEqual(0);
        expect(q.answerIndex).toBeLessThan(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(10);
        expect(LISTENING_QUESTION_TYPE_LABEL[q.type]).toBeTruthy();
      }
    }
  });

  it(`${label}：朗读原文为纯英文（TTS 可直接朗读，不含中文）`, () => {
    for (const m of listenings) {
      expect(/[\u4e00-\u9fff]/.test(m.script.join(' '))).toBe(false);
    }
  });
}

describe('听力数据 · Unit 1（人教2019必修一）', () => {
  expectListeningsValid(unit1Listenings, 'Unit 1');
});

describe('听力数据 · Unit 2（Travelling Around）', () => {
  expectListeningsValid(unit2Listenings, 'Unit 2');

  it('Unit 2 材料/题目 id 均带 u2- 前缀，与 Unit 1 不冲突', () => {
    const unit1Ids = new Set([
      ...unit1Listenings.map((m) => m.id),
      ...unit1Listenings.flatMap((m) => m.questions.map((q) => q.id)),
    ]);
    for (const id of [
      ...unit2Listenings.map((m) => m.id),
      ...unit2Listenings.flatMap((m) => m.questions.map((q) => q.id)),
    ]) {
      expect(id.startsWith('u2-')).toBe(true);
      expect(unit1Ids.has(id)).toBe(false);
    }
  });

  it('材料体裁覆盖独白与对话', () => {
    const genres = unit2Listenings.map((m) => m.genre);
    expect(genres).toContain('独白');
    expect(genres).toContain('对话');
  });
});

describe('听力注册表（按单元取用）', () => {
  it('getListeningsByUnit 按单元返回；getListening 跨单元可查', () => {
    expect(getListeningsByUnit('unit1')).toBe(unit1Listenings);
    expect(getListeningsByUnit('unit2')).toBe(unit2Listenings);
    expect(getListening('u2-l1')?.title).toBe('Getting Ready for London');
    expect(getListening('u2-l2')?.genre).toBe('对话');
    expect(getListening('nope')).toBeUndefined();
  });
});
