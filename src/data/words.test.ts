import { describe, it, expect } from 'vitest';
import unit1Words from './unit1-words.json';
import type { Word } from '../types';

const words = unit1Words as Word[];

describe('人教2019必修一 Unit1 词表', () => {
  it('约 20 词（18–22 条）', () => {
    expect(words.length).toBeGreaterThanOrEqual(18);
    expect(words.length).toBeLessThanOrEqual(22);
  });

  it('每条含音标/词性/中文释义/例句且非空', () => {
    for (const w of words) {
      expect(w.id, `${w.word} 缺 id`).toBeTruthy();
      expect(w.word, `${w.id} 缺 word`).toBeTruthy();
      expect(w.phonetic, `${w.word} 缺音标`).toMatch(/^\/.+\//);
      expect(w.pos, `${w.word} 缺词性`).toBeTruthy();
      expect(w.meaning, `${w.word} 缺中文释义`).toBeTruthy();
      expect(w.example, `${w.word} 缺例句`).toMatch(/[A-Za-z]/);
      expect(w.exampleZh, `${w.word} 缺例句翻译`).toBeTruthy();
    }
  });

  it('id 与单词均唯一', () => {
    const ids = new Set(words.map((w) => w.id));
    const forms = new Set(words.map((w) => w.word.toLowerCase()));
    expect(ids.size).toBe(words.length);
    expect(forms.size).toBe(words.length);
  });
});
