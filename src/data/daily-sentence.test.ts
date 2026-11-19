import { describe, it, expect } from 'vitest';
import { dailySentences } from './daily-sentence';

describe('每日一句 · 数据结构校验', () => {
  it('共 5 条佳句', () => {
    expect(Array.isArray(dailySentences)).toBe(true);
    expect(dailySentences).toHaveLength(5);
  });

  it('每条佳句字段完整（en / zh / author 均为非空字符串）', () => {
    for (const sentence of dailySentences) {
      expect(sentence).toBeTruthy();
      expect(typeof sentence.en).toBe('string');
      expect(sentence.en.trim().length).toBeGreaterThan(0);
      expect(typeof sentence.zh).toBe('string');
      expect(sentence.zh.trim().length).toBeGreaterThan(0);
      expect(typeof sentence.author).toBe('string');
      expect(sentence.author.trim().length).toBeGreaterThan(0);
    }
  });

  it('无重复句子（中英文均不重复）', () => {
    const enSet = new Set(dailySentences.map((s) => s.en.trim().toLowerCase()));
    expect(enSet.size).toBe(dailySentences.length);
    const zhSet = new Set(dailySentences.map((s) => s.zh.trim()));
    expect(zhSet.size).toBe(dailySentences.length);
  });
});
