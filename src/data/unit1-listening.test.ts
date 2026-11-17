import { describe, it, expect } from 'vitest';
import { unit1Listenings, countScriptWords, LISTENING_QUESTION_TYPE_LABEL } from './unit1-listening';

describe('听力数据 · Unit 1（人教2019必修一）', () => {
  it('内置 2 段自编听力文本，各配 3 道听力选择题', () => {
    expect(unit1Listenings).toHaveLength(2);
    for (const m of unit1Listenings) {
      expect(m.script.length).toBeGreaterThan(0);
      expect(m.title).toBeTruthy();
      expect(m.genre).toBeTruthy();
      expect(m.questions).toHaveLength(3);
    }
  });

  it('每段文本约 80 词（70–90 词区间）', () => {
    for (const m of unit1Listenings) {
      const words = countScriptWords(m.script);
      expect(words).toBeGreaterThanOrEqual(70);
      expect(words).toBeLessThanOrEqual(90);
    }
  });

  it('题目完整且合法：id 唯一、4 个不重复选项、answerIndex 在范围内、带解析与题型标签', () => {
    const ids = new Set<string>();
    for (const m of unit1Listenings) {
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

  it('朗读原文为纯英文（TTS 可直接朗读，不含中文）', () => {
    for (const m of unit1Listenings) {
      expect(/[\u4e00-\u9fff]/.test(m.script.join(' '))).toBe(false);
    }
  });
});
