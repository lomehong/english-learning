import { describe, it, expect } from 'vitest';
import type { FillExercise, McqExercise } from '../types';
import {
  UNIT_MANIFESTS,
  UNIT_REGISTRY,
  UNITS_BY_BOOK,
  unitIdsOfBook,
  firstUnitOfBook,
  bookUnitTitle,
  BOOK_LABELS,
} from './units';
import { getWord, allWords } from './words';
import { getGrammarPoint, checkFillAnswer } from './grammar';
import { countWords, getPassage, QUESTION_TYPE_LABEL } from './reading';
import { countScriptWords, getListening, LISTENING_QUESTION_TYPE_LABEL } from './listening';
import { countEssayWords, getWritingTask } from './writing';

/**
 * 选择性必修三（elective-3 · 人教2019 Unit 1–5 = unit26–unit30）纯数据新增回归：
 * 按册独立测试文件约定（units-bookN.test.ts）编写——只断言本册单元，
 * 不改共享 units.test.ts，避免各册 PR 并行冲突。
 * 单元文件 unit26–unit30（meta book=选择性必修三）自动进入注册表并按册分组，
 * 每单元五模块数据齐备且满足既有数据约束（与必修一/二同一套质量基线）。
 */

const BOOK6_UNITS = ['unit26', 'unit27', 'unit28', 'unit29', 'unit30'] as const;

/** 人教2019选择性必修三各单元主题（册内单元号 / 英文标题 / 中文译名） */
const BOOK6_META: Record<(typeof BOOK6_UNITS)[number], { no: number; title: string; theme: string }> = {
  unit26: { no: 1, title: 'Art', theme: '艺术' },
  unit27: { no: 2, title: 'Healthy Lifestyle', theme: '健康的生活方式' },
  unit28: { no: 3, title: 'Environmental Protection', theme: '环境保护' },
  unit29: { no: 4, title: 'Adversity and Courage', theme: '逆境与勇气' },
  unit30: { no: 5, title: 'Poems', theme: '诗歌' },
};

/** 各单元语法点（id 全局唯一，带 u26–u30 前缀；标题与教材语法定位一致） */
const BOOK6_GRAMMAR: Record<(typeof BOOK6_UNITS)[number], Array<{ id: string; title: string }>> = {
  unit26: [
    { id: 'u26-full-inversion', title: '完全倒装（here / there / away 等方位副词开头）' },
    { id: 'u26-partial-inversion-only', title: '部分倒装（only + 状语位于句首）' },
  ],
  unit27: [
    { id: 'u27-unless-clause', title: 'unless 引导的条件状语从句' },
    { id: 'u27-so-that-clause', title: 'so that 引导目的与结果状语从句' },
  ],
  unit28: [
    { id: 'u28-infinitive-passive', title: '不定式的被动语态（to be done / to be given）' },
    { id: 'u28-multiple-comparison', title: '倍数比较表达（times as ... as ...）' },
  ],
  unit29: [
    { id: 'u29-concessive-clause', title: '让步状语从句（although / even though）' },
    { id: 'u29-no-sooner-than', title: 'no sooner ... than / hardly ... when' },
  ],
  unit30: [
    { id: 'u30-subjunctive-present', title: '虚拟语气（if 从句与现在事实相反）' },
    { id: 'u30-subjunctive-past', title: '虚拟语气（if 从句与过去事实相反）' },
  ],
};

const book6Manifests = BOOK6_UNITS.map((id) => UNIT_MANIFESTS.find((m) => m.id === id)!);

/** 词边界 + 大小写不敏感地检查生词形式是否真的出现在原文中（与必修一阅读测试同款） */
function textIncludesForm(paragraphs: string[], form: string): boolean {
  const re = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return paragraphs.join(' ').match(re) !== null;
}

describe('选择性必修三 · 注册表自动发现（纯数据文件 unit26–unit30）', () => {
  it('五个新单元全部归入 elective-3，按册内 no 升序排列', () => {
    expect(unitIdsOfBook('elective-3')).toEqual([...BOOK6_UNITS]);
    expect(firstUnitOfBook('elective-3')).toBe('unit26');
    for (const m of book6Manifests) expect(m.book).toBe('elective-3');
    expect(UNITS_BY_BOOK['elective-3'].map((m) => m.no)).toEqual([1, 2, 3, 4, 5]);
  });

  it('元信息来自 meta.json：选择性必修三 / 各单元标题与中文主题', () => {
    for (const id of BOOK6_UNITS) {
      const m = UNIT_REGISTRY[id];
      expect(m, `${id} 应注册`).toBeDefined();
      expect(m.no).toBe(BOOK6_META[id]!.no);
      expect(m.title).toBe(BOOK6_META[id]!.title);
      expect(m.theme).toBe(BOOK6_META[id]!.theme);
      expect(bookUnitTitle(id)).toBe(`${BOOK_LABELS['elective-3']} · Unit ${m.no} ${m.title}`);
    }
  });
});

describe('选择性必修三 · 每单元五模块数据齐备（质量基线与必修一/二一致）', () => {
  it('词汇：每单元恰 20 词，字段完整，id = 单词小写且全表不重叠', () => {
    for (const id of BOOK6_UNITS) {
      const words = UNIT_REGISTRY[id]!.words;
      expect(words, `${id} 词表 20 词`).toHaveLength(20);
      for (const w of words) {
        expect(w.id).toBe(w.word.toLowerCase());
        expect(w.phonetic, `${id}/${w.word} 缺音标`).toMatch(/^\/.+\//);
        expect(w.pos, `${id}/${w.word} 缺词性`).toBeTruthy();
        expect(w.meaning, `${id}/${w.word} 缺中文释义`).toBeTruthy();
        expect(w.example, `${id}/${w.word} 缺例句`).toMatch(/[A-Za-z]/);
        expect(w.exampleZh, `${id}/${w.word} 缺例句翻译`).toBeTruthy();
        expect(getWord(w.id)?.word).toBe(w.word);
      }
    }
    const ids = allWords.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(allWords).toHaveLength(UNIT_MANIFESTS.reduce((n, m) => n + m.words.length, 0));
  });

  it('语法：每单元 2 个语法点 + 10 题练习（6 单选 + 4 填空），语法点 id 与约定一致', () => {
    for (const id of BOOK6_UNITS) {
      const { grammarPoints, grammarExercises } = UNIT_REGISTRY[id]!;
      expect(grammarPoints, `${id} 2 个语法点`).toHaveLength(2);
      expect(grammarPoints.map((p) => p.id)).toEqual(BOOK6_GRAMMAR[id]!.map((p) => p.id));
      for (const p of grammarPoints) {
        expect(p.title).toBe(BOOK6_GRAMMAR[id]!.find((x) => x.id === p.id)!.title);
        expect(p.tagline.trim()).not.toBe('');
        expect(p.forms.length).toBeGreaterThanOrEqual(3);
        expect(new Set(p.forms.map((f) => f.label)).size).toBe(p.forms.length);
        expect(p.usages.length).toBeGreaterThanOrEqual(3);
        expect(p.markers.length).toBeGreaterThanOrEqual(4);
        expect(p.examples.length).toBeGreaterThanOrEqual(3);
        expect(p.examples.every((e) => e.en.trim() !== '' && e.zh.trim() !== '')).toBe(true);
        expect(p.tips.length).toBeGreaterThanOrEqual(2);
        expect(getGrammarPoint(p.id)).toBe(p);
        expect(grammarExercises.some((e) => e.pointId === p.id), `${id} 讲解卡 ${p.id} 无练习覆盖`).toBe(true);
      }

      expect(grammarExercises, `${id} 10 道练习`).toHaveLength(10);
      expect(new Set(grammarExercises.map((e) => e.id)).size).toBe(10);
      const mcqs = grammarExercises.filter((e): e is McqExercise => e.type === 'mcq');
      const fills = grammarExercises.filter((e): e is FillExercise => e.type === 'fill');
      expect(mcqs.length, `${id} 单选不少于 6`).toBeGreaterThanOrEqual(6);
      expect(fills.length, `${id} 填空不少于 4`).toBeGreaterThanOrEqual(4);
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
        expect(checkFillAnswer(fill, fill.answer)).toBe(true);
      }
      for (const e of grammarExercises) expect(e.id.startsWith(`${id.replace('unit', 'u')}-`)).toBe(true);
    }
  });

  it('阅读：每单元 2 篇各 3 题，约 100–140 词，生词表 wordId 在本单元词表且形式确实出现', () => {
    for (const id of BOOK6_UNITS) {
      const unit = UNIT_REGISTRY[id]!;
      expect(unit.passages, `${id} 2 篇短文`).toHaveLength(2);
      const ownWordIds = new Set(unit.words.map((w) => w.id));
      const types: string[] = [];
      for (const p of unit.passages) {
        expect(p.paragraphs.length).toBeGreaterThanOrEqual(3);
        const words = countWords(p.paragraphs);
        expect(words, `${id}/${p.id} 词数 ${words} 不在 100–140 区间`).toBeGreaterThanOrEqual(100);
        expect(words, `${id}/${p.id} 词数 ${words} 不在 100–140 区间`).toBeLessThanOrEqual(140);
        expect(p.questions).toHaveLength(3);
        expect(p.glossary.length, `${p.id} 生词表不少于 6`).toBeGreaterThanOrEqual(6);
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
        for (const q of p.questions) {
          expect(q.options).toHaveLength(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.answerIndex).toBeGreaterThanOrEqual(0);
          expect(q.answerIndex).toBeLessThan(4);
          expect(q.explanation).toMatch(/选|故|可知|概括/);
          expect(QUESTION_TYPE_LABEL[q.type]).toBeTruthy();
          expect(getPassage(p.id)).toBe(p);
          types.push(q.type);
        }
      }
      expect(types.filter((t) => t === 'detail').length, `${id} 细节题不少于 3`).toBeGreaterThanOrEqual(3);
      expect(types.some((t) => t !== 'detail'), `${id} 应含主旨/推理/写作意图题`).toBe(true);
    }
  });

  it('听力：每单元 2 段各 3 题，约 70–90 词纯英文，体裁覆盖独白与对话', () => {
    for (const id of BOOK6_UNITS) {
      const unit = UNIT_REGISTRY[id]!;
      expect(unit.listenings, `${id} 2 段材料`).toHaveLength(2);
      const genres = unit.listenings.map((m) => m.genre);
      expect(genres).toContain('独白');
      expect(genres).toContain('对话');
      for (const m of unit.listenings) {
        const words = countScriptWords(m.script);
        expect(words, `${id}/${m.id} 词数 ${words} 不在 70–90 区间`).toBeGreaterThanOrEqual(70);
        expect(words, `${id}/${m.id} 词数 ${words} 不在 70–90 区间`).toBeLessThanOrEqual(90);
        expect(/[\u4e00-\u9fff]/.test(m.script.join(' ')), `${m.id} 听力原文应纯英文`).toBe(false);
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

  it('写作：每单元 2 个任务，范文词数与词数要求匹配（80/100 ±30）', () => {
    for (const id of BOOK6_UNITS) {
      const unit = UNIT_REGISTRY[id]!;
      expect(unit.writingTasks, `${id} 2 个任务`).toHaveLength(2);
      for (const t of unit.writingTasks) {
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

  it('全部条目 id 带各自单元前缀（u26–u30），本册内跨单元不冲突', () => {
    const globalIds = new Set<string>();
    for (const m of book6Manifests) {
      const prefix = m.id.replace('unit', 'u') + '-';
      const itemIds = [
        ...m.grammarExercises.map((e) => e.id),
        ...m.passages.flatMap((p) => [p.id, ...p.questions.map((q) => q.id)]),
        ...m.listenings.flatMap((mat) => [mat.id, ...mat.questions.map((q) => q.id)]),
        ...m.writingTasks.map((t) => t.id),
      ];
      for (const id of itemIds) {
        expect(id.startsWith(prefix), `${m.id} 条目 ${id} 应带 ${prefix} 前缀`).toBe(true);
        expect(globalIds.has(id), `条目 id 重复：${id}`).toBe(false);
        globalIds.add(id);
      }
    }
  });
});

describe('选择性必修三 · 单元主题贴合（人教2019 目录）', () => {
  it('各单元语法点标题对应教材语法定位', () => {
    const titles = (id: (typeof BOOK6_UNITS)[number]) =>
      UNIT_REGISTRY[id]!.grammarPoints.map((p) => p.title).join('/');
    expect(titles('unit26')).toContain('完全倒装');
    expect(titles('unit26')).toContain('部分倒装');
    expect(titles('unit27')).toContain('unless');
    expect(titles('unit27')).toContain('so that');
    expect(titles('unit28')).toContain('不定式的被动语态');
    expect(titles('unit28')).toContain('倍数');
    expect(titles('unit29')).toContain('让步状语从句');
    expect(titles('unit29')).toContain('no sooner');
    expect(titles('unit30')).toContain('与现在事实相反');
    expect(titles('unit30')).toContain('与过去事实相反');
  });
});
