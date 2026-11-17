import { describe, it, expect } from 'vitest';
import { unit1Passages, countWords, getPassage, QUESTION_TYPE_LABEL } from './unit1-reading';
import { getWord } from './words';

/** 词边界 + 大小写不敏感地检查生词形式是否真的出现在原文中 */
function textIncludesForm(paragraphs: string[], form: string): boolean {
  const re = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return paragraphs.join(' ').match(re) !== null;
}

describe('人教2019必修一 Unit1 阅读短文', () => {
  it('内置 2 篇自编短文，每篇约 120 词（100–140）', () => {
    expect(unit1Passages).toHaveLength(2);
    for (const p of unit1Passages) {
      const words = countWords(p.paragraphs);
      expect(words, `${p.id} 词数 ${words} 不在 100–140 区间`).toBeGreaterThanOrEqual(100);
      expect(words, `${p.id} 词数 ${words} 不在 100–140 区间`).toBeLessThanOrEqual(140);
    }
  });

  it('每篇含标题、体裁与多个段落', () => {
    for (const p of unit1Passages) {
      expect(p.id).toBeTruthy();
      expect(p.title).toMatch(/[A-Za-z]/);
      expect(p.genre).toBeTruthy();
      expect(p.paragraphs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('getPassage 可按 id 取回内置短文', () => {
    expect(getPassage('p1')?.title).toBe("A Freshman's First Term");
    expect(getPassage('p2')?.genre).toBe('应用文');
    expect(getPassage('nope')).toBeUndefined();
  });

  it('countWords 只计含字母的 token', () => {
    expect(countWords(['Hello world - 15 ways!'])).toBe(3);
    expect(countWords(['one'])).toBe(1);
    expect(countWords(['—', '15', '“…”'])).toBe(0);
  });

  it('每篇恰好 3 道单选题：4 个选项、答案有效、解析非空、题型有标签', () => {
    for (const p of unit1Passages) {
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

  it('全部题目 id 唯一', () => {
    const ids = unit1Passages.flatMap((p) => p.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('生词表 wordId 均在 Unit1 词表中，且每个形式确实出现在原文', () => {
    for (const p of unit1Passages) {
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
});
