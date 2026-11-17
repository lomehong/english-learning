import { describe, it, expect } from 'vitest';
import type { FillExercise, McqExercise } from '../types';
import {
  UNIT_MANIFESTS,
  UNIT_IDS,
  UNIT_REGISTRY,
  UNITS_BY_BOOK,
  unitIdsOfBook,
  firstUnitOfBook,
  bookOfUnit,
  bookUnitTitle,
  type UnitId,
} from './units';
import { allWords, getWordsByUnit } from './words';
import { getGrammarPoint } from './grammar';
import { countWords, getPassage, QUESTION_TYPE_LABEL } from './reading';
import { countScriptWords, getListening, LISTENING_QUESTION_TYPE_LABEL } from './listening';
import { countEssayWords, getWritingTask } from './writing';

/**
 * 必修二（required-2 · 人教2019 Unit 1–5 = unit16–unit20）纯数据新增回归：
 * 按册独立测试文件约定（units-bookN.test.ts）编写——只断言本册单元，
 * 不改共享 units.test.ts，避免各册 PR 并行冲突。
 * （rebase 说明：原 PR 单元文件 unit6–unit10 全局改编号为 unit16–unit20，
 * 　错开选择性必修一 unit6–unit10 的既有占用；词条 privacy/efficient/generation
 * 　与全表查重冲突，分别换为 wireless/bandwidth/dynasty。）
 */

const BOOK2_UNIT_IDS = ['unit16', 'unit17', 'unit18', 'unit19', 'unit20'] as const;

const BOOK2_META: Record<string, { title: string; theme: string }> = {
  unit16: { title: 'Cultural Heritage', theme: '文化遗产' },
  unit17: { title: 'Wildlife Protection', theme: '野生动物保护' },
  unit18: { title: 'The Internet', theme: '互联网' },
  unit19: { title: 'History and Traditions', theme: '历史与传统' },
  unit20: { title: 'Music', theme: '音乐' },
};

/** 词边界 + 大小写不敏感地检查生词形式是否真的出现在原文中（与必修一阅读测试同款） */
function textIncludesForm(paragraphs: string[], form: string): boolean {
  const re = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return paragraphs.join(' ').match(re) !== null;
}

describe('必修二 · 注册表自动发现（纯数据文件 unit16–unit20）', () => {
  it('五单元自动进入注册表并归入必修二分组，册内 no 为 1–5，整体顺序 = 册别顺序 → 册内 no 升序', () => {
    expect(unitIdsOfBook('required-2')).toEqual([...BOOK2_UNIT_IDS]);
    const nos = UNITS_BY_BOOK['required-2'].map((m) => m.no);
    expect(nos).toEqual([1, 2, 3, 4, 5]);
    expect(firstUnitOfBook('required-2')).toBe('unit16');
    for (const id of BOOK2_UNIT_IDS) {
      expect(UNIT_IDS).toContain(id);
      expect(bookOfUnit(id)).toBe('required-2');
    }
  });

  it('元信息来自 meta.json（book=必修二 / title / theme），标题用 bookUnitTitle 带册别', () => {
    for (const id of BOOK2_UNIT_IDS) {
      const m = UNIT_REGISTRY[id];
      expect(m, `${id} 应注册`).toBeDefined();
      expect(m.book).toBe('required-2');
      expect(bookOfUnit(id)).toBe('required-2');
      expect(m.title).toBe(BOOK2_META[id]!.title);
      expect(m.theme).toBe(BOOK2_META[id]!.theme);
      expect(bookUnitTitle(id)).toBe(`必修二 · Unit ${m.no} ${m.title}`);
    }
  });

  it('必修一原有五单元不受影响：仍归 required-1，词表引用不变', () => {
    expect(unitIdsOfBook('required-1')).toEqual(['unit1', 'unit2', 'unit3', 'unit4', 'unit5']);
    for (let i = 1; i <= 5; i++) {
      const id = `unit${i}` as UnitId;
      expect(bookOfUnit(id)).toBe('required-1');
      expect(getWordsByUnit(id)).toBe(UNIT_REGISTRY[id].words);
    }
  });
});

describe('必修二 · 每单元五模块数据齐备（质量基线与必修一一致）', () => {
  it('词汇：每单元恰 20 词，字段完整，全表 id 不重叠', () => {
    for (const id of BOOK2_UNIT_IDS) {
      const words = UNIT_REGISTRY[id].words;
      expect(words, `${id} 词表 20 词`).toHaveLength(20);
      for (const w of words) {
        expect(w.id, `${id} 缺 id`).toBeTruthy();
        expect(w.word, `${id} 缺 word`).toBeTruthy();
        expect(w.phonetic, `${id}/${w.word} 缺音标`).toMatch(/^\/.+\//);
        expect(w.pos, `${id}/${w.word} 缺词性`).toBeTruthy();
        expect(w.meaning, `${id}/${w.word} 缺中文释义`).toBeTruthy();
        expect(w.example, `${id}/${w.word} 缺例句`).toMatch(/[A-Za-z]/);
        expect(w.exampleZh, `${id}/${w.word} 缺例句翻译`).toBeTruthy();
      }
    }
    const ids = allWords.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(allWords).toHaveLength(UNIT_MANIFESTS.reduce((n, m) => n + m.words.length, 0));
  });

  it('语法：每单元 2 个语法点 + 10 题练习，跨全部单元语法点 id 唯一，题目 id 唯一', () => {
    const pointIds = new Set<string>();
    const exerciseIds = new Set<string>();
    for (const m of UNIT_MANIFESTS) {
      expect(m.grammarPoints, `${m.id} 2 个语法点`).toHaveLength(2);
      expect(m.grammarExercises, `${m.id} 10 道练习`).toHaveLength(10);
      for (const p of m.grammarPoints) {
        expect(pointIds.has(p.id), `语法点 id 重复：${p.id}`).toBe(false);
        pointIds.add(p.id);
        expect(getGrammarPoint(p.id)).toBe(p);
      }
      for (const e of m.grammarExercises) {
        expect(exerciseIds.has(e.id), `练习 id 重复：${e.id}`).toBe(false);
        exerciseIds.add(e.id);
      }
    }
  });

  it('必修二语法：每单元 6 单选 + 4 填空，讲解卡覆盖练习，单元内 id 带自身前缀', () => {
    const prefixes: Record<string, string> = {
      unit16: 'u16-',
      unit17: 'u17-',
      unit18: 'u18-',
      unit19: 'u19-',
      unit20: 'u20-',
    };
    for (const id of BOOK2_UNIT_IDS) {
      const { grammarPoints, grammarExercises } = UNIT_REGISTRY[id];
      const mcqs = grammarExercises.filter((e): e is McqExercise => e.type === 'mcq');
      const fills = grammarExercises.filter((e): e is FillExercise => e.type === 'fill');
      expect(mcqs.length, `${id} 单选不少于 6`).toBeGreaterThanOrEqual(6);
      expect(fills.length, `${id} 填空不少于 4`).toBeGreaterThanOrEqual(4);
      for (const p of grammarPoints) {
        expect(grammarExercises.some((e) => e.pointId === p.id), `${id} 讲解卡 ${p.id} 无练习覆盖`).toBe(true);
        expect(p.forms.length).toBeGreaterThanOrEqual(3);
        expect(p.usages.length).toBeGreaterThanOrEqual(3);
        expect(p.markers.length).toBeGreaterThanOrEqual(4);
        expect(p.examples.length).toBeGreaterThanOrEqual(3);
        expect(p.tips.length).toBeGreaterThanOrEqual(2);
      }
      for (const mcq of mcqs) {
        expect(mcq.options).toHaveLength(4);
        expect(new Set(mcq.options).size).toBe(4);
        expect(mcq.answerIndex).toBeGreaterThanOrEqual(0);
        expect(mcq.answerIndex).toBeLessThan(4);
        expect(mcq.explanation.trim().length).toBeGreaterThanOrEqual(8);
      }
      for (const fill of fills) {
        expect(fill.stem).toContain('______');
        expect(fill.answer.trim().length).toBeGreaterThan(0);
      }
      for (const e of grammarExercises) expect(e.id.startsWith(prefixes[id]!)).toBe(true);
    }
  });

  it('阅读：每单元 2 篇各 3 题，约 100–140 词，生词表 wordId 在本单元词表且形式确实出现', () => {
    for (const id of BOOK2_UNIT_IDS) {
      const unit = UNIT_REGISTRY[id];
      expect(unit.passages, `${id} 2 篇短文`).toHaveLength(2);
      const ownWordIds = new Set(unit.words.map((w) => w.id));
      for (const p of unit.passages) {
        expect(p.paragraphs.length).toBeGreaterThanOrEqual(3);
        const words = countWords(p.paragraphs);
        expect(words, `${id}/${p.id} 词数 ${words} 不在 100–140 区间`).toBeGreaterThanOrEqual(100);
        expect(words, `${id}/${p.id} 词数 ${words} 不在 100–140 区间`).toBeLessThanOrEqual(140);
        expect(p.questions).toHaveLength(3);
        for (const q of p.questions) {
          expect(q.options).toHaveLength(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.answerIndex).toBeGreaterThanOrEqual(0);
          expect(q.answerIndex).toBeLessThan(4);
          expect(q.explanation).toMatch(/选|故|可知|概括/);
          expect(QUESTION_TYPE_LABEL[q.type]).toBeTruthy();
          expect(getPassage(p.id)).toBe(p);
        }
        expect(p.glossary.length).toBeGreaterThanOrEqual(6);
        const seenForms = new Set<string>();
        for (const entry of p.glossary) {
          expect(ownWordIds.has(entry.wordId), `${p.id} 生词 ${entry.wordId} 不在 ${id} 词表`).toBe(true);
          for (const form of entry.forms) {
            expect(textIncludesForm(p.paragraphs, form), `${p.id} 生词形式 “${form}” 未出现在原文`).toBe(true);
            const key = form.toLowerCase();
            expect(seenForms.has(key), `${p.id} 形式 “${form}” 被多个生词重复使用`).toBe(false);
            seenForms.add(key);
          }
        }
      }
    }
  });

  it('听力：每单元 2 段各 3 题，约 70–90 词纯英文，体裁覆盖独白与对话', () => {
    for (const id of BOOK2_UNIT_IDS) {
      const unit = UNIT_REGISTRY[id];
      expect(unit.listenings, `${id} 2 段材料`).toHaveLength(2);
      const genres = unit.listenings.map((m) => m.genre);
      expect(genres).toContain('独白');
      expect(genres).toContain('对话');
      for (const m of unit.listenings) {
        const words = countScriptWords(m.script);
        expect(words, `${id}/${m.id} 词数 ${words} 不在 70–90 区间`).toBeGreaterThanOrEqual(70);
        expect(words, `${id}/${m.id} 词数 ${words} 不在 70–90 区间`).toBeLessThanOrEqual(90);
        expect(/[\u4e00-\u9fff]/.test(m.script.join(' '))).toBe(false);
        expect(m.questions).toHaveLength(3);
        for (const q of m.questions) {
          expect(q.options).toHaveLength(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.answerIndex).toBeGreaterThanOrEqual(0);
          expect(q.answerIndex).toBeLessThan(4);
          expect(q.explanation.length).toBeGreaterThan(10);
          expect(LISTENING_QUESTION_TYPE_LABEL[q.type]).toBeTruthy();
        }
        expect(getListening(m.id)).toBe(m);
      }
    }
  });

  it('写作：每单元 2 个任务，范文词数与词数要求匹配（80/100 ±30），任务 id 唯一', () => {
    const taskIds = new Set<string>();
    for (const id of BOOK2_UNIT_IDS) {
      const unit = UNIT_REGISTRY[id];
      expect(unit.writingTasks, `${id} 2 个任务`).toHaveLength(2);
      for (const t of unit.writingTasks) {
        expect(taskIds.has(t.id), `任务 id 重复：${t.id}`).toBe(false);
        taskIds.add(t.id);
        expect(getWritingTask(t.id)).toBe(t);
        expect(t.genre).toContain('·');
        expect(t.wordHint).toContain('词数');
        expect(t.prompt.length).toBeGreaterThanOrEqual(20);
        expect(t.requirements.length).toBeGreaterThanOrEqual(3);
        expect(t.checklist.length).toBeGreaterThanOrEqual(4);
        const n = countEssayWords(t.modelEssay.join(' '));
        const target = t.id.endsWith('w1') ? 80 : 100;
        expect(Math.abs(n - target), `${id}/${t.id} 范文词数 ${n} 偏离 ${target} 超过 30`).toBeLessThanOrEqual(30);
      }
    }
  });

  it('必修二条目 id 均不与其它册冲突：短文 / 题目 / 材料 / 任务全局唯一', () => {
    const passageIds = new Set<string>();
    const questionIds = new Set<string>();
    for (const m of UNIT_MANIFESTS) {
      for (const p of m.passages) {
        expect(passageIds.has(p.id), `短文 id 重复：${p.id}`).toBe(false);
        passageIds.add(p.id);
        for (const q of p.questions) {
          expect(questionIds.has(q.id), `阅读题 id 重复：${q.id}`).toBe(false);
          questionIds.add(q.id);
        }
      }
      for (const mat of m.listenings) {
        expect(passageIds.has(mat.id), `材料 id 重复：${mat.id}`).toBe(false);
        passageIds.add(mat.id);
        for (const q of mat.questions) {
          expect(questionIds.has(q.id), `听力题 id 重复：${q.id}`).toBe(false);
          questionIds.add(q.id);
        }
      }
    }
  });
});

describe('必修二 · 单元主题贴合（人教2019 目录）', () => {
  it('各单元语法点对应教材语法：定语从句 / 被动语态系列 / 过去分词', () => {
    const titles = (id: string) => UNIT_REGISTRY[id]!.grammarPoints.map((p) => p.title).join('/');
    expect(titles('unit16')).toContain('关系副词');
    expect(titles('unit16')).toContain('介词');
    expect(titles('unit17')).toContain('现在进行时的被动语态');
    expect(titles('unit17')).toContain('一般现在时的被动语态');
    expect(titles('unit18')).toContain('现在完成时的被动语态');
    expect(titles('unit18')).toContain('一般将来时的被动语态');
    expect(titles('unit19')).toContain('过去分词（短语）作定语');
    expect(titles('unit19')).toContain('过去分词作宾语补足语');
    expect(titles('unit20')).toContain('过去分词作状语');
    expect(titles('unit20')).toContain('状语从句中的省略');
  });

  it('各单元核心词汇贴合主题（Unit 1 heritage / Unit 2 wildlife / Unit 3 internet / Unit 4 history / Unit 5 music）', () => {
    const ids = (id: string) => new Set(UNIT_REGISTRY[id]!.words.map((w) => w.id));
    for (const w of ['heritage', 'relic', 'preserve', 'promote']) expect(ids('unit16').has(w)).toBe(true);
    for (const w of ['wildlife', 'species', 'habitat', 'extinct']) expect(ids('unit17').has(w)).toBe(true);
    for (const w of ['download', 'upload', 'password', 'software']) expect(ids('unit18').has(w)).toBe(true);
    for (const w of ['ancestor', 'tradition', 'castle', 'philosopher']) expect(ids('unit19').has(w)).toBe(true);
    for (const w of ['perform', 'instrument', 'orchestra', 'inspire']) expect(ids('unit20').has(w)).toBe(true);
  });
});
