import { describe, it, expect } from 'vitest';
import type { FillExercise } from '../types';
import {
  UNIT_MANIFESTS,
  UNIT_IDS,
  UNIT_META,
  UNIT_REGISTRY,
  unitsByBook,
  unitIdsOfBook,
  firstUnitOfBook,
  bookUnitTitle,
} from './units';
import { getWordsByUnit, getWord, getWordUnit, allWords } from './words';
import { getGrammarPoints, getGrammarExercises, getGrammarPoint, checkFillAnswer } from './grammar';
import { getPassagesByUnit, getPassage } from './reading';
import { getListeningsByUnit, getListening } from './listening';
import { getWritingTasksByUnit, getWritingTask } from './writing';

/**
 * 必修三（required-3 · 人教2019 Unit 1–5 = unit21–unit25）纯数据新增回归：
 * 按册独立测试文件约定（units-bookN.test.ts）编写——只断言本册单元，
 * 不改共享 units.test.ts，避免各册 PR 并行冲突。
 * （rebase 说明：原 PR 单元文件 unit6–unit10 全局改编号为 unit21–unit25，
 * 　错开选择性必修一 unit6–unit10 的既有占用；词条 crop/generous/diverse/jazz/solar/manner
 * 　与全表查重冲突，分别换为 parade/compassion/multicultural/fusion/telescope/budget；
 * 　语法点 id present-perfect-passive 与必修二冲突，更名为 u24-present-perfect-passive。）
 */

const BOOK3_UNITS = ['unit21', 'unit22', 'unit23', 'unit24', 'unit25'] as const;

/** 人教2019必修三各单元主题（册内单元号 / 英文标题 / 中文译名） */
const BOOK3_META: Record<(typeof BOOK3_UNITS)[number], { no: number; title: string; theme: string }> = {
  unit21: { no: 1, title: 'Festivals and Celebrations', theme: '节日与庆祝' },
  unit22: { no: 2, title: 'Morals and Virtues', theme: '道德与美德' },
  unit23: { no: 3, title: 'Diverse Cultures', theme: '多元文化' },
  unit24: { no: 4, title: 'Space Exploration', theme: '太空探索' },
  unit25: { no: 5, title: 'The Value of Money', theme: '金钱的价值' },
};

/** 词边界 + 大小写不敏感地检查生词形式是否真的出现在原文中（与必修一阅读测试同款） */
function textIncludesForm(paragraphs: string[], form: string): boolean {
  const re = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return paragraphs.join(' ').match(re) !== null;
}

describe('必修三 · 注册表自动纳入（纯数据文件新增，零代码改动）', () => {
  it('五单元自动进入注册表并归入必修三分组，整体按册别顺序 → 册内 no 升序', () => {
    for (const id of BOOK3_UNITS) expect(UNIT_IDS).toContain(id);
    expect(unitIdsOfBook('required-3')).toEqual([...BOOK3_UNITS]);
    expect(unitsByBook('required-3').map((m) => m.no)).toEqual([1, 2, 3, 4, 5]);
    expect(firstUnitOfBook('required-3')).toBe('unit21');
  });

  it('meta 元信息按人教2019必修三单元主题挂载：book=必修三、册内 no=1-5', () => {
    for (const id of BOOK3_UNITS) {
      const m = UNIT_REGISTRY[id];
      expect(m.book, `${id} 应属必修三`).toBe('required-3');
      expect(m.no).toBe(BOOK3_META[id].no);
      expect(m.title).toBe(BOOK3_META[id].title);
      expect(m.theme).toBe(BOOK3_META[id].theme);
      expect(UNIT_META[id]).toEqual({ book: 'required-3', no: m.no, title: m.title, titleZh: m.theme });
    }
  });

  it('必修一分组不受影响，册 + 单元标题带册别维度', () => {
    expect(unitIdsOfBook('required-1')).toEqual(['unit1', 'unit2', 'unit3', 'unit4', 'unit5']);
    expect(bookUnitTitle('unit21')).toBe('必修三 · Unit 1 Festivals and Celebrations');
    expect(bookUnitTitle('unit25')).toBe('必修三 · Unit 5 The Value of Money');
  });
});

describe('必修三 · 每单元数据完备（词汇 20 / 语法 2+10 / 阅读 2×3 / 听力 2×3 / 写作 2）', () => {
  it('词汇：每单元 20 词，含音标 / 词性 / 中文释义 / 例句及翻译', () => {
    for (const id of BOOK3_UNITS) {
      const words = UNIT_REGISTRY[id].words;
      expect(words, `${id} 词表 20 词`).toHaveLength(20);
      expect(getWordsByUnit(id)).toBe(words);
      for (const w of words) {
        expect(w.id, `${w.word} id 应为单词小写`).toBe(w.word.toLowerCase());
        expect(w.phonetic, `${w.word} 音标`).toMatch(/^\/.+\//);
        expect(w.pos, `${w.word} 词性`).toBeTruthy();
        expect(w.meaning, `${w.word} 中文释义`).toMatch(/[\u4e00-\u9fff]/);
        expect(w.example, `${w.word} 例句`).toMatch(/[A-Za-z]/);
        expect(w.exampleZh, `${w.word} 例句翻译`).toMatch(/[\u4e00-\u9fff]/);
      }
    }
  });

  it('词汇：必修三 100 词跨册全局不重复，allWords 与各单元之和对齐且跨册可查', () => {
    const book3Ids = new Set(BOOK3_UNITS.flatMap((id) => UNIT_REGISTRY[id].words.map((w) => w.id)));
    expect(book3Ids.size).toBe(100);
    expect(allWords).toHaveLength(UNIT_MANIFESTS.reduce((n, m) => n + m.words.length, 0));
    for (const id of BOOK3_UNITS) {
      const first = UNIT_REGISTRY[id].words[0]!;
      expect(getWordUnit(first.id), `${first.id} 应归属 ${id}`).toBe(id);
      expect(getWord(first.id)?.word).toBe(first.word);
    }
  });

  it('语法：每单元 2 个语法点 + 10 题（≥6 单选 + ≥4 填空），语法点 id 跨册全局唯一', () => {
    for (const id of BOOK3_UNITS) {
      const m = UNIT_REGISTRY[id];
      expect(m.grammarPoints, `${id} 2 个语法点`).toHaveLength(2);
      expect(m.grammarExercises, `${id} 10 道练习`).toHaveLength(10);
      expect(getGrammarPoints(id)).toBe(m.grammarPoints);
      expect(getGrammarExercises(id)).toBe(m.grammarExercises);

      const mcq = m.grammarExercises.filter((e) => e.type === 'mcq');
      const fill = m.grammarExercises.filter((e): e is FillExercise => e.type === 'fill');
      expect(mcq.length, `${id} 单选题 ≥6`).toBeGreaterThanOrEqual(6);
      expect(fill.length, `${id} 填空题 ≥4`).toBeGreaterThanOrEqual(4);
      for (const e of m.grammarExercises) {
        expect(getGrammarPoint(e.pointId), `${e.id} 关联语法点应存在`).toBeDefined();
        expect(e.explanation.trim().length).toBeGreaterThanOrEqual(8);
      }
      // 每个语法点至少被一道练习覆盖
      for (const p of m.grammarPoints) {
        expect(m.grammarExercises.some((e) => e.pointId === p.id), `${id} 语法点 ${p.id} 应有练习覆盖`).toBe(true);
      }
    }
    const allPointIds = UNIT_MANIFESTS.flatMap((m) => m.grammarPoints.map((p) => p.id));
    expect(new Set(allPointIds).size, '语法点 id 全局唯一').toBe(allPointIds.length);
  });

  it('阅读：每单元 2 篇 × 3 题，生词表 wordId 均在本单元词表且形式确实出现在原文', () => {
    for (const id of BOOK3_UNITS) {
      const m = UNIT_REGISTRY[id];
      const wordIds = new Set(m.words.map((w) => w.id));
      expect(m.passages, `${id} 2 篇短文`).toHaveLength(2);
      expect(getPassagesByUnit(id)).toBe(m.passages);
      for (const p of m.passages) {
        expect(p.paragraphs.length, `${p.id} 段落 ≥3`).toBeGreaterThanOrEqual(3);
        expect(p.questions, `${p.id} 3 道题`).toHaveLength(3);
        expect(getPassage(p.id)).toBe(p);
        expect(p.glossary.length, `${p.id} 生词表 ≥6`).toBeGreaterThanOrEqual(6);
        for (const g of p.glossary) {
          expect(wordIds.has(g.wordId), `${p.id} 生词 ${g.wordId} 不在 ${id} 词表`).toBe(true);
          for (const form of g.forms) {
            expect(textIncludesForm(p.paragraphs, form), `${p.id} 生词形式 ${form} 未出现在原文`).toBe(true);
          }
        }
        for (const q of p.questions) {
          expect(q.options, `${q.id} 4 个选项`).toHaveLength(4);
          expect(new Set(q.options).size, `${q.id} 选项不重复`).toBe(4);
          expect(q.explanation, `${q.id} 解析`).toMatch(/选|故|可知|概括/);
        }
      }
    }
  });

  it('听力：每单元 2 段 × 3 题，脚本成段（对话体含说话人标签）', () => {
    for (const id of BOOK3_UNITS) {
      const m = UNIT_REGISTRY[id];
      expect(m.listenings, `${id} 2 段材料`).toHaveLength(2);
      expect(getListeningsByUnit(id)).toBe(m.listenings);
      for (const mat of m.listenings) {
        expect(getListening(mat.id)).toBe(mat);
        expect(mat.script.length, `${mat.id} 脚本 ≥3 行`).toBeGreaterThanOrEqual(3);
        expect(mat.questions, `${mat.id} 3 道题`).toHaveLength(3);
        for (const q of mat.questions) {
          expect(q.options, `${q.id} 4 个选项`).toHaveLength(4);
          expect(new Set(q.options).size, `${q.id} 选项不重复`).toBe(4);
        }
      }
    }
  });

  it('写作：每单元 2 个任务，均配范文、内容要点 ≥3、自评清单 ≥4', () => {
    for (const id of BOOK3_UNITS) {
      const m = UNIT_REGISTRY[id];
      expect(m.writingTasks, `${id} 2 个任务`).toHaveLength(2);
      expect(getWritingTasksByUnit(id)).toBe(m.writingTasks);
      for (const t of m.writingTasks) {
        expect(getWritingTask(t.id)).toBe(t);
        expect(t.modelEssay.join(' ').trim().length, `${t.id} 范文非空`).toBeGreaterThan(0);
        expect(t.requirements.length, `${t.id} 要点 ≥3`).toBeGreaterThanOrEqual(3);
        expect(t.checklist.length, `${t.id} 清单 ≥4`).toBeGreaterThanOrEqual(4);
        expect(t.prompt, `${t.id} 中文情境`).toMatch(/[\u4e00-\u9fff]/);
      }
    }
  });
});

describe('必修三 · 主题贴合（人教2019必修三单元主题与语法板块）', () => {
  const themed = (id: (typeof BOOK3_UNITS)[number], words: string[], grammarTitles: string[]): void => {
    const m = UNIT_REGISTRY[id];
    const ids = new Set(m.words.map((w) => w.id));
    for (const w of words) expect(ids.has(w), `${id} 词表应含 ${w}`).toBe(true);
    const titles = m.grammarPoints.map((p) => p.title).join('/');
    for (const t of grammarTitles) expect(titles, `${id} 语法点应含「${t}」`).toContain(t);
  };

  it('Unit 1 Festivals and Celebrations：节日词汇 + 情态动词（表推测 / 表许可请求）', () => {
    themed(
      'unit21',
      ['lantern', 'carnival', 'costume', 'ceremony', 'origin', 'harvest', 'firework', 'grateful'],
      ['情态动词表推测', '情态动词表许可与请求'],
    );
  });

  it('Unit 2 Morals and Virtues：美德词汇 + 动词-ing 作主语 / 宾语', () => {
    themed(
      'unit22',
      ['moral', 'virtue', 'dilemma', 'kindness', 'physician', 'compassion'],
      ['动词-ing形式作主语', '动词-ing形式作宾语'],
    );
  });

  it('Unit 3 Diverse Cultures：多元文化词汇 + 主谓一致（语法与意义一致 / 就近原则）', () => {
    themed(
      'unit23',
      ['multicultural', 'diversity', 'ethnic', 'immigrant', 'fusion', 'downtown'],
      ['主谓一致：语法一致与意义一致', '主谓一致：就近原则'],
    );
  });

  it('Unit 4 Space Exploration：太空词汇 + 被动语态（一般现在时 / 现在完成时）', () => {
    themed(
      'unit24',
      ['astronaut', 'rocket', 'gravity', 'satellite', 'spacecraft', 'universe', 'telescope'],
      ['一般现在时的被动语态', '现在完成时的被动语态'],
    );
  });

  it('Unit 5 The Value of Money：金钱词汇 + 宾语从句 / 表语从句', () => {
    themed(
      'unit25',
      ['bet', 'banknote', 'amount', 'budget', 'rude', 'unbelievable'],
      ['宾语从句', '表语从句'],
    );
  });

  it('错题归档前缀约定：五模块条目 id 均带 u21-…u25- 前缀（与其它册单元不冲突）', () => {
    for (const id of BOOK3_UNITS) {
      const prefix = `u${id.slice(4)}-`; // unit21 → u21-，unit25 → u25-
      const m = UNIT_REGISTRY[id];
      for (const e of m.grammarExercises) expect(e.id.startsWith(prefix), `${e.id} 应带 ${prefix}`).toBe(true);
      for (const p of m.passages) {
        expect(p.id.startsWith(prefix), `${p.id} 应带 ${prefix}`).toBe(true);
        for (const q of p.questions) expect(q.id.startsWith(prefix), `${q.id} 应带 ${prefix}`).toBe(true);
      }
      for (const mat of m.listenings) {
        expect(mat.id.startsWith(prefix), `${mat.id} 应带 ${prefix}`).toBe(true);
        for (const q of mat.questions) expect(q.id.startsWith(prefix), `${q.id} 应带 ${prefix}`).toBe(true);
      }
      for (const t of m.writingTasks) expect(t.id.startsWith(prefix), `${t.id} 应带 ${prefix}`).toBe(true);
    }
  });

  it('练习 / 短文 / 听力 / 写作条目 id 跨册全局唯一', () => {
    const ids = UNIT_MANIFESTS.flatMap((m) => [
      ...m.grammarExercises.map((e) => e.id),
      ...m.passages.map((p) => p.id),
      ...m.passages.flatMap((p) => p.questions.map((q) => q.id)),
      ...m.listenings.map((l) => l.id),
      ...m.listenings.flatMap((l) => l.questions.map((q) => q.id)),
      ...m.writingTasks.map((t) => t.id),
    ]);
    expect(new Set(ids).size, '全部条目 id 不重复').toBe(ids.length);
  });

  it('填空题标准答案可通过判分（checkFillAnswer）', () => {
    for (const id of BOOK3_UNITS) {
      for (const e of UNIT_REGISTRY[id].grammarExercises) {
        if (e.type === 'fill') expect(checkFillAnswer(e, e.answer), `${e.id} 标准答案应判对`).toBe(true);
      }
    }
  });
});
