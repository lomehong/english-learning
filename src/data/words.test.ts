import { describe, it, expect } from 'vitest';
import unit1WordsJson from './unit1-words.json';
import unit2WordsJson from './unit2-words.json';
import type { Word } from '../types';
import { getWord, getWordsByUnit, getWordUnit, allWords } from './words';

const unit1Words = unit1WordsJson as Word[];
const unit2Words = unit2WordsJson as Word[];

/** 词表结构完整性（两单元共用同一套约束） */
function expectWordListValid(words: Word[], label: string): void {
  it(`${label}：约 20 词（18–22 条）`, () => {
    expect(words.length).toBeGreaterThanOrEqual(18);
    expect(words.length).toBeLessThanOrEqual(22);
  });

  it(`${label}：每条含音标/词性/中文释义/例句且非空`, () => {
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

  it(`${label}：id 与单词均唯一`, () => {
    const ids = new Set(words.map((w) => w.id));
    const forms = new Set(words.map((w) => w.word.toLowerCase()));
    expect(ids.size).toBe(words.length);
    expect(forms.size).toBe(words.length);
  });
}

describe('人教2019必修一 Unit1 词表', () => {
  expectWordListValid(unit1Words, 'Unit 1');
});

describe('人教2019必修一 Unit2 词表（Travelling Around）', () => {
  expectWordListValid(unit2Words, 'Unit 2');

  it('覆盖 Unit 2 核心词汇（apply/visa/destination/amazing 等）', () => {
    const ids = new Set(unit2Words.map((w) => w.id));
    for (const id of ['apply', 'visa', 'rent', 'pack', 'amazing', 'destination', 'admire', 'view', 'sight', 'comment']) {
      expect(ids.has(id), `Unit 2 词表应含 ${id}`).toBe(true);
    }
  });
});

describe('词表注册表（跨单元）', () => {
  it('getWordsByUnit 返回对应单元词表', () => {
    expect(getWordsByUnit('unit1')).toBe(unit1Words);
    expect(getWordsByUnit('unit2')).toBe(unit2Words);
  });

  it('两单元词表 id 不重叠，allWords 为两单元之和', () => {
    const overlap = unit1Words.filter((w) => unit2Words.some((x) => x.id === w.id));
    expect(overlap).toEqual([]);
    expect(allWords).toHaveLength(unit1Words.length + unit2Words.length);
  });

  it('getWord 跨单元查词，未知 id 返回 undefined', () => {
    expect(getWord('teenage')?.meaning).toContain('青少年的');
    expect(getWord('destination')?.meaning).toContain('目的地');
    expect(getWord('nope')).toBeUndefined();
  });

  it('getWordUnit 返回单词所属单元，词表外返回 undefined', () => {
    expect(getWordUnit('teenage')).toBe('unit1');
    expect(getWordUnit('apply')).toBe('unit2');
    expect(getWordUnit('ghost-word')).toBeUndefined();
  });
});
