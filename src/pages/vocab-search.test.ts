import { describe, it, expect } from 'vitest';
import { getWordsByUnit } from '../data/words';
import type { Word } from '../types';
import {
  filterVocabWords,
  firstMatchIndex,
  hasVocabQuery,
  normalizeVocabQuery,
} from './vocab-search';

/** 单元内搜索的纯过滤函数单测：不依赖 DOM / localStorage，直接喂词表数据 */

const unit1 = getWordsByUnit('unit1');
const unit2 = getWordsByUnit('unit2');

function ids(words: Word[]): string[] {
  return words.map((w) => w.id);
}

describe('关键词归一化', () => {
  it('去首尾空白并转小写（英文大小写不敏感）', () => {
    expect(normalizeVocabQuery('  APPLY  ')).toBe('apply');
    expect(normalizeVocabQuery('TeenAge')).toBe('teenage');
    expect(normalizeVocabQuery('  志愿者  ')).toBe('志愿者');
  });

  it('hasVocabQuery：空串 / 纯空白无效，任一非空白字符有效', () => {
    expect(hasVocabQuery('')).toBe(false);
    expect(hasVocabQuery('   ')).toBe(false);
    expect(hasVocabQuery(' a ')).toBe(true);
    expect(hasVocabQuery('签')).toBe(true);
  });
});

describe('filterVocabWords：英文按拼写过滤', () => {
  it('大小写不敏感的子串命中，保持词表原顺序', () => {
    expect(ids(filterVocabWords(unit2, 'APP'))).toEqual(['apply']);
    expect(ids(filterVocabWords(unit1, 'teen'))).toEqual(['teenage', 'teenager']);
  });

  it('前缀 / 中缀 / 后缀均可命中', () => {
    expect(ids(filterVocabWords(unit1, 'rec'))).toEqual(['recommend', 'recommendation']);
    expect(ids(filterVocabWords(unit2, 'narrow'))).toEqual(['narrow']);
    expect(ids(filterVocabWords(unit1, 'ation'))).toEqual(['recommendation']); // 后缀 in recommendation
  });
});

describe('filterVocabWords：中文按释义过滤', () => {
  it('中文子串命中释义（如 志愿者 → volunteer）', () => {
    expect(ids(filterVocabWords(unit1, '志愿者'))).toEqual(['volunteer']);
    // apply 的释义也含「签证」（apply for a visa 申请签证），一并命中
    expect(ids(filterVocabWords(unit2, '签证'))).toEqual(['apply', 'visa']);
  });

  it('释义命中多个词时全部返回且保持词表顺序', () => {
    const matched = filterVocabWords(unit1, '青少年');
    expect(ids(matched)).toEqual(['teenage', 'teenager']);
    expect(matched[0]!.id).toBe(unit1[0]!.id);
  });
});

describe('filterVocabWords：边界与纯函数性质', () => {
  it('空关键词 / 纯空白 → 返回完整词表（顺序不变）', () => {
    expect(ids(filterVocabWords(unit1, ''))).toEqual(ids(unit1));
    expect(ids(filterVocabWords(unit1, '   '))).toEqual(ids(unit1));
  });

  it('无匹配返回空数组', () => {
    expect(filterVocabWords(unit1, 'zzzz')).toEqual([]);
    expect(filterVocabWords(unit2, '不存在的释义')).toEqual([]);
  });

  it('只搜索传入单元的单词，不跨单元泄漏', () => {
    // teenage 是 Unit 1 的词，用 Unit 2 词表过滤不应命中
    expect(filterVocabWords(unit2, 'teenage')).toEqual([]);
    // Unit 1 内子串命中：teenager 也包含 teenage
    expect(ids(filterVocabWords(unit1, 'teenage'))).toEqual(['teenage', 'teenager']);
  });

  it('不修改入参，返回新数组', () => {
    const snapshot = ids(unit1);
    const result = filterVocabWords(unit1, '');
    expect(ids(unit1)).toEqual(snapshot);
    expect(result).not.toBe(unit1 as unknown as Word[]);
    result.push({ ...unit1[0]!, id: 'injected' });
    expect(ids(unit1)).toEqual(snapshot);
  });
});

describe('firstMatchIndex：首个匹配词下标', () => {
  it('命中返回词表下标（用于 ?q= 深链定位 / 回车跳转）', () => {
    expect(firstMatchIndex(unit2, 'app')).toBe(0);
    expect(firstMatchIndex(unit1, '志愿者')).toBe(3); // volunteer
    expect(firstMatchIndex(unit1, 'teen')).toBe(0); // 首个匹配是 teenage
  });

  it('无匹配 / 空关键词返回 -1（调用方回退默认卡片）', () => {
    expect(firstMatchIndex(unit1, 'zzzz')).toBe(-1);
    expect(firstMatchIndex(unit1, '')).toBe(-1);
    expect(firstMatchIndex(unit1, '   ')).toBe(-1);
  });
});
