import { describe, it, expect } from 'vitest';
import type { FillExercise, McqExercise } from '../types';
import {
  UNIT_MANIFESTS,
  UNITS_BY_BOOK,
  unitIdsOfBook,
  firstUnitOfBook,
  bookUnitTitle,
  BOOK_LABELS,
} from './units';
import { getWord, allWords } from './words';
import { getGrammarPoint, checkFillAnswer } from './grammar';
import { countWords, QUESTION_TYPE_LABEL } from './reading';

/**
 * 选择性必修四（人教2019 · 全册五单元）纯数据新增的完整性测试：
 * - 注册表自动发现：unit11–unit15 归入 elective-4 分组，必修一 / 选择性必修一原有单元不受影响；
 * - 每单元五模块数据齐备：词表 20 词 / 语法 2 点 + 10 题 / 阅读 2 篇各 3 题 /
 *   听力 2 段各 3 题 / 写作 2 任务含范文；
 * - 阅读生词形式须真实出现在原文且 wordId 归属本单元词表，听力原文为纯英文（供 TTS 朗读）。
 */

const ELECTIVE4_UNITS: ReadonlyArray<{ id: string; no: number; title: string; theme: string }> = [
  { id: 'unit11', no: 1, title: 'Science Fiction', theme: '科幻小说' },
  { id: 'unit12', no: 2, title: 'Iconic Attractions', theme: '标志性景点' },
  { id: 'unit13', no: 3, title: 'Sea Exploration', theme: '海洋探索' },
  { id: 'unit14', no: 4, title: 'Sharing', theme: '分享互助' },
  { id: 'unit15', no: 5, title: 'Launching Your Career', theme: '开启职业生涯' },
];

const elective4Manifests = ELECTIVE4_UNITS.map((u) => UNIT_MANIFESTS.find((m) => m.id === u.id)!);

/** 词边界 + 大小写不敏感地检查生词形式是否真的出现在原文中（与 reading.test 同款思路） */
function textIncludesForm(paragraphs: string[], form: string): boolean {
  const re = new RegExp(`\\b${form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return paragraphs.join(' ').match(re) !== null;
}

describe('选择性必修四 · 注册表自动发现与册分组（纯数据新增）', () => {
  it('五个新单元（unit11–unit15）全部归入 elective-4，按册内 no 升序排列', () => {
    expect(unitIdsOfBook('elective-4')).toEqual(['unit11', 'unit12', 'unit13', 'unit14', 'unit15']);
    expect(firstUnitOfBook('elective-4')).toBe('unit11');
    for (const m of elective4Manifests) expect(m.book).toBe('elective-4');
    expect(UNITS_BY_BOOK['elective-4'].map((m) => m.no)).toEqual([1, 2, 3, 4, 5]);
  });

  it('元信息与工单一致：书名 / 单元号 / 英文主题 / 中文译名', () => {
    for (const u of ELECTIVE4_UNITS) {
      const m = UNIT_MANIFESTS.find((x) => x.id === u.id)!;
      expect(m.no).toBe(u.no);
      expect(m.title).toBe(u.title);
      expect(m.theme).toBe(u.theme);
      expect(bookUnitTitle(u.id)).toBe(`${BOOK_LABELS['elective-4']} · Unit ${u.no} ${u.title}`);
    }
  });

  it('既有十单元不受影响（unit1–unit5 仍归 required-1，unit6–unit10 仍归 elective-1）', () => {
    expect(unitIdsOfBook('required-1')).toEqual(['unit1', 'unit2', 'unit3', 'unit4', 'unit5']);
    for (const id of ['unit1', 'unit2', 'unit3', 'unit4', 'unit5']) {
      expect(UNIT_MANIFESTS.find((m) => m.id === id)!.book).toBe('required-1');
    }
    expect(unitIdsOfBook('elective-1')).toEqual(['unit6', 'unit7', 'unit8', 'unit9', 'unit10']);
    for (const id of ['unit6', 'unit7', 'unit8', 'unit9', 'unit10']) {
      expect(UNIT_MANIFESTS.find((m) => m.id === id)!.book).toBe('elective-1');
    }
  });
});

describe('选择性必修四 · 每单元五模块数据齐备', () => {
  it('词汇：每单元 20 词，字段完整，且与既有全表（unit1–unit10）不重叠', () => {
    const existingIds = new Set(
      UNIT_MANIFESTS.filter((m) => m.book !== 'elective-4').flatMap((m) => m.words.map((w) => w.id)),
    );
    for (const m of elective4Manifests) {
      expect(m.words, `${m.id} 词表 20 词`).toHaveLength(20);
      for (const w of m.words) {
        expect(w.id).toBe(w.word.toLowerCase());
        expect(w.phonetic, `${w.id} 缺音标`).toMatch(/^\/.+\//);
        expect(w.pos.trim()).not.toBe('');
        expect(w.meaning.trim()).not.toBe('');
        expect(w.example).toMatch(/[A-Za-z]/);
        expect(w.exampleZh.trim()).not.toBe('');
        expect(existingIds.has(w.id), `${w.id} 与既有单元词表重复`).toBe(false);
        expect(getWord(w.id)?.word).toBe(w.word);
      }
    }
    expect(allWords).toHaveLength(UNIT_MANIFESTS.reduce((n, m) => n + m.words.length, 0));
  });

  it('语法：每单元 2 个语法点 + 10 道练习（6 单选 + 4 填空），语法点 id 全局唯一', () => {
    const globalPointIds = new Set(
      UNIT_MANIFESTS.filter((m) => m.book !== 'elective-4').flatMap((m) => m.grammarPoints.map((p) => p.id)),
    );
    for (const m of elective4Manifests) {
      expect(m.grammarPoints, `${m.id} 2 个语法点`).toHaveLength(2);
      for (const p of m.grammarPoints) {
        expect(globalPointIds.has(p.id), `语法点 id 与既有单元重复：${p.id}`).toBe(false);
        globalPointIds.add(p.id);
        expect(p.forms.length).toBeGreaterThanOrEqual(3);
        expect(new Set(p.forms.map((f) => f.label)).size).toBe(p.forms.length);
        expect(p.usages.length).toBeGreaterThanOrEqual(3);
        expect(p.markers.length).toBeGreaterThanOrEqual(4);
        expect(p.examples.length).toBeGreaterThanOrEqual(3);
        expect(p.examples.every((e) => e.en.trim() !== '' && e.zh.trim() !== '')).toBe(true);
        expect(p.tips.length).toBeGreaterThanOrEqual(2);
        expect(getGrammarPoint(p.id)).toBe(p);
      }

      expect(m.grammarExercises, `${m.id} 10 道练习`).toHaveLength(10);
      expect(new Set(m.grammarExercises.map((e) => e.id)).size).toBe(10);
      const mcqs = m.grammarExercises.filter((e): e is McqExercise => e.type === 'mcq');
      const fills = m.grammarExercises.filter((e): e is FillExercise => e.type === 'fill');
      expect(mcqs.length).toBeGreaterThanOrEqual(6);
      expect(fills.length).toBeGreaterThanOrEqual(4);
      for (const q of mcqs) {
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options).size).toBe(4);
        expect(q.answerIndex).toBeGreaterThanOrEqual(0);
        expect(q.answerIndex).toBeLessThan(q.options.length);
        expect(q.explanation.trim().length).toBeGreaterThanOrEqual(8);
      }
      for (const f of fills) {
        expect(f.stem).toContain('______');
        expect(checkFillAnswer(f, f.answer)).toBe(true);
      }
      for (const p of m.grammarPoints) {
        expect(m.grammarExercises.some((e) => e.pointId === p.id), `${m.id} 语法点 ${p.id} 无练习覆盖`).toBe(true);
      }
    }
  });

  it('阅读：每单元 2 篇各 3 题，生词形式真实出现、wordId 归属本单元且题型覆盖', () => {
    for (const m of elective4Manifests) {
      expect(m.passages, `${m.id} 2 篇短文`).toHaveLength(2);
      const unitWordIds = new Set(m.words.map((w) => w.id));
      const types: string[] = [];
      for (const p of m.passages) {
        expect(p.paragraphs.length).toBeGreaterThanOrEqual(3);
        const words = countWords(p.paragraphs);
        expect(words, `${p.id} 词数 ${words} 不在 100–140 区间`).toBeGreaterThanOrEqual(100);
        expect(words, `${p.id} 词数 ${words} 不在 100–140 区间`).toBeLessThanOrEqual(140);
        expect(p.questions, `${p.id} 3 道题`).toHaveLength(3);
        expect(p.glossary.length, `${p.id} 生词表不少于 6`).toBeGreaterThanOrEqual(6);
        const seenForms = new Set<string>();
        for (const g of p.glossary) {
          expect(unitWordIds.has(g.wordId), `${p.id} 生词 ${g.wordId} 不在本单元词表`).toBe(true);
          for (const form of g.forms) {
            expect(textIncludesForm(p.paragraphs, form), `${p.id} 生词形式 “${form}” 未出现在原文`).toBe(true);
            const key = form.toLowerCase();
            expect(seenForms.has(key), `${p.id} 形式 “${form}” 被重复使用`).toBe(false);
            seenForms.add(key);
          }
        }
        for (const q of p.questions) {
          expect(q.options).toHaveLength(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.answerIndex).toBeGreaterThanOrEqual(0);
          expect(q.answerIndex).toBeLessThan(q.options.length);
          expect(q.explanation).toMatch(/选|故|可知|概括/);
          expect(QUESTION_TYPE_LABEL[q.type]).toBeTruthy();
          types.push(q.type);
        }
      }
      expect(types.filter((t) => t === 'detail').length, `${m.id} 细节题不少于 3`).toBeGreaterThanOrEqual(3);
      expect(types.some((t) => t !== 'detail'), `${m.id} 应含主旨/推理/写作意图题`).toBe(true);
      expect(m.passages.some((p) => p.genre.includes('应用文')) || m.passages.some((p) => p.genre.includes('记叙文'))).toBe(
        true,
      );
    }
  });

  it('听力：每单元 2 段各 3 题，独白与对话兼备，原文为纯英文', () => {
    for (const m of elective4Manifests) {
      expect(m.listenings, `${m.id} 2 段材料`).toHaveLength(2);
      const genres = m.listenings.map((mat) => mat.genre);
      expect(genres).toContain('独白');
      expect(genres).toContain('对话');
      for (const mat of m.listenings) {
        expect(mat.script.length).toBeGreaterThan(0);
        expect(/[\u4e00-\u9fff]/.test(mat.script.join(' ')), `${mat.id} 听力原文应纯英文`).toBe(false);
        expect(mat.questions, `${mat.id} 3 道题`).toHaveLength(3);
        for (const q of mat.questions) {
          expect(q.options).toHaveLength(4);
          expect(new Set(q.options).size).toBe(4);
          expect(q.answerIndex).toBeGreaterThanOrEqual(0);
          expect(q.answerIndex).toBeLessThan(q.options.length);
          expect(q.explanation).toMatch(/选|故|可知|概括/);
        }
      }
    }
  });

  it('写作：每单元 2 个任务含范文，体裁/要点/自评清单齐备', () => {
    for (const m of elective4Manifests) {
      expect(m.writingTasks, `${m.id} 2 个任务`).toHaveLength(2);
      for (const t of m.writingTasks) {
        expect(t.genre).toContain('·');
        expect(t.prompt.trim()).not.toBe('');
        expect(t.wordHint.trim()).not.toBe('');
        expect(t.requirements.length).toBeGreaterThanOrEqual(3);
        expect(t.checklist.length).toBeGreaterThanOrEqual(4);
        expect(t.modelEssay.join(' ').trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('全部条目 id 带各自单元前缀（u11–u15），全仓跨单元不冲突', () => {
    const prefixOf: Record<string, string> = {
      unit11: 'u11-',
      unit12: 'u12-',
      unit13: 'u13-',
      unit14: 'u14-',
      unit15: 'u15-',
    };
    const globalIds = new Set<string>();
    for (const m of UNIT_MANIFESTS) {
      const prefix = prefixOf[m.id];
      const unitIds = [
        ...m.grammarExercises.map((e) => e.id),
        ...m.passages.flatMap((p) => [p.id, ...p.questions.map((q) => q.id)]),
        ...m.listenings.flatMap((mat) => [mat.id, ...mat.questions.map((q) => q.id)]),
        ...m.writingTasks.map((t) => t.id),
      ];
      for (const id of unitIds) {
        if (prefix) expect(id.startsWith(prefix), `${m.id} 条目 ${id} 应带 ${prefix} 前缀`).toBe(true);
        expect(globalIds.has(id), `全仓条目 id 重复：${id}`).toBe(false);
        globalIds.add(id);
      }
    }
  });
});
