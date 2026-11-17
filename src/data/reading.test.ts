import { describe, it, expect } from 'vitest';
import { unit1Passages } from './unit1-reading';
import { unit2Passages } from './unit2-reading';
import { unit3Passages } from './unit3-reading';
import { countWords, getPassage, getPassagesByUnit, QUESTION_TYPE_LABEL } from './reading';
import { getWord } from './words';

/** 词边界 + 大小写不敏感地检查生词形式是否真的出现在原文中 */
function textIncludesForm(paragraphs: string[], form: string): boolean {
  const re = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return paragraphs.join(' ').match(re) !== null;
}

/** 短文与题目数据完整性（两单元共用同一套约束） */
function expectPassagesValid(
  passages: typeof unit1Passages,
  label: string,
  wordRange: [number, number],
): void {
  it(`${label}：内置 2 篇自编短文，每篇约 120 词（${wordRange[0]}–${wordRange[1]}）`, () => {
    expect(passages).toHaveLength(2);
    for (const p of passages) {
      const words = countWords(p.paragraphs);
      expect(words, `${p.id} 词数 ${words} 不在 ${wordRange[0]}–${wordRange[1]} 区间`).toBeGreaterThanOrEqual(wordRange[0]);
      expect(words, `${p.id} 词数 ${words} 不在 ${wordRange[0]}–${wordRange[1]} 区间`).toBeLessThanOrEqual(wordRange[1]);
    }
  });

  it(`${label}：每篇含标题、体裁与多个段落`, () => {
    for (const p of passages) {
      expect(p.id).toBeTruthy();
      expect(p.title).toMatch(/[A-Za-z]/);
      expect(p.genre).toBeTruthy();
      expect(p.paragraphs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it(`${label}：每篇恰好 3 道单选题：4 个选项、答案有效、解析非空、题型有标签`, () => {
    for (const p of passages) {
      expect(p.questions, `${p.id} 应有 3 道题`).toHaveLength(3);
      for (const q of p.questions) {
        expect(q.stem, `${q.id} 缺题干`).toMatch(/[A-Za-z?]/);
        expect(q.options, `${q.id} 应有 4 个选项`).toHaveLength(4);
        expect(new Set(q.options).size, `${q.id} 选项重复`).toBe(4);
        expect(q.answerIndex, `${q.id} answerIndex 越界`).toBeGreaterThanOrEqual(0);
        expect(q.answerIndex).toBeLessThan(q.options.length);
        expect(q.explanation, `${q.id} 缺解析`).toMatch(/选|故|可知|概括/);
        expect(QUESTION_TYPE_LABEL[q.type], `${q.id} 题型缺标签`).toBeTruthy();
      }
    }
  });

  it(`${label}：全部题目 id 唯一`, () => {
    const ids = passages.flatMap((p) => p.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it(`${label}：生词表 wordId 均在词表中（跨单元），且每个形式确实出现在原文`, () => {
    for (const p of passages) {
      expect(p.glossary.length, `${p.id} 生词表为空`).toBeGreaterThanOrEqual(6);
      const seenForms = new Set<string>();
      for (const entry of p.glossary) {
        const word = getWord(entry.wordId);
        expect(word, `${p.id} 生词 ${entry.wordId} 不在词表中`).toBeDefined();
        expect(entry.forms.length, `${p.id}/${entry.wordId} forms 为空`).toBeGreaterThanOrEqual(1);
        for (const form of entry.forms) {
          expect(
            textIncludesForm(p.paragraphs, form),
            `${p.id} 生词形式 “${form}” 未出现在原文`,
          ).toBe(true);
          const key = form.toLowerCase();
          expect(seenForms.has(key), `${p.id} 形式 “${form}” 被多个生词重复使用`).toBe(false);
          seenForms.add(key);
        }
      }
    }
  });
}

describe('人教2019必修一 Unit1 阅读短文', () => {
  expectPassagesValid(unit1Passages, 'Unit 1', [100, 140]);

  it('getPassage 可按 id 取回内置短文（跨单元）', () => {
    expect(getPassage('p1')?.title).toBe("A Freshman's First Term");
    expect(getPassage('p2')?.genre).toBe('应用文');
    expect(getPassage('nope')).toBeUndefined();
  });

  it('countWords 只计含字母的 token', () => {
    expect(countWords(['Hello world - 15 ways!'])).toBe(3);
    expect(countWords(['one'])).toBe(1);
    expect(countWords(['—', '15', '“…”'])).toBe(0);
  });
});

describe('人教2019必修一 Unit2 阅读短文（Travelling Around）', () => {
  expectPassagesValid(unit2Passages, 'Unit 2', [100, 140]);

  it('Unit 2 短文/题目 id 均带 u2- 前缀，与 Unit 1 不冲突', () => {
    const unit1Ids = new Set([
      ...unit1Passages.map((p) => p.id),
      ...unit1Passages.flatMap((p) => p.questions.map((q) => q.id)),
    ]);
    for (const id of [
      ...unit2Passages.map((p) => p.id),
      ...unit2Passages.flatMap((p) => p.questions.map((q) => q.id)),
    ]) {
      expect(id.startsWith('u2-')).toBe(true);
      expect(unit1Ids.has(id)).toBe(false);
    }
  });

  it('Unit 2 题型覆盖：两篇共 6 题含细节理解与主旨/写作意图', () => {
    const types = unit2Passages.flatMap((p) => p.questions.map((q) => q.type));
    expect(types.filter((t) => t === 'detail').length).toBeGreaterThanOrEqual(4);
    expect(types.some((t) => t === 'main-idea' || t === 'purpose')).toBe(true);
  });
});

describe('人教2019必修一 Unit3 阅读短文（Sports and Fitness）', () => {
  expectPassagesValid(unit3Passages, 'Unit 3', [100, 140]);

  it('Unit 3 短文/题目 id 均带 u3- 前缀，与前两单元不冲突', () => {
    const otherIds = new Set([
      ...unit1Passages.map((p) => p.id),
      ...unit1Passages.flatMap((p) => p.questions.map((q) => q.id)),
      ...unit2Passages.map((p) => p.id),
      ...unit2Passages.flatMap((p) => p.questions.map((q) => q.id)),
    ]);
    for (const id of [
      ...unit3Passages.map((p) => p.id),
      ...unit3Passages.flatMap((p) => p.questions.map((q) => q.id)),
    ]) {
      expect(id.startsWith('u3-')).toBe(true);
      expect(otherIds.has(id)).toBe(false);
    }
  });

  it('Unit 3 题型覆盖：两篇共 6 题含细节理解与主旨/写作意图，体裁覆盖记叙文与应用文', () => {
    const types = unit3Passages.flatMap((p) => p.questions.map((q) => q.type));
    expect(types.filter((t) => t === 'detail').length).toBeGreaterThanOrEqual(4);
    expect(types.some((t) => t === 'main-idea' || t === 'purpose')).toBe(true);
    const genres = unit3Passages.map((p) => p.genre);
    expect(genres).toContain('记叙文');
    expect(genres).toContain('应用文');
  });
});

describe('阅读注册表（按单元取用）', () => {
  it('getPassagesByUnit 按单元返回；getPassage 跨单元可查', () => {
    expect(getPassagesByUnit('unit1')).toBe(unit1Passages);
    expect(getPassagesByUnit('unit2')).toBe(unit2Passages);
    expect(getPassagesByUnit('unit3')).toBe(unit3Passages);
    expect(getPassage('u2-p1')?.title).toBe('A Weekend in an Ancient Town');
    expect(getPassage('u2-p2')?.genre).toBe('应用文');
    expect(getPassage('u3-p1')?.title).toBe('The Girl Who Never Gave Up');
    expect(getPassage('u3-p2')?.genre).toBe('应用文');
  });
});
