import { describe, it, expect } from 'vitest';
import {
  UNIT_MANIFESTS,
  UNIT_IDS,
  UNIT_META,
  UNIT_REGISTRY,
  unitTitle,
  isUnitId,
  buildUnitManifests,
  type UnitId,
  type UnitModuleFiles,
} from './units';
import { getWordsByUnit, allWords } from './words';
import { getGrammarPoints, getGrammarExercises, getGrammarPoint } from './grammar';
import { getPassagesByUnit, getPassage } from './reading';
import { getListeningsByUnit, getListening } from './listening';
import { getWritingTasksByUnit, getWritingTask } from './writing';
import type { Word } from '../types';

/* ---------- 合成数据（只测聚合逻辑，不依赖真实单元文件） ---------- */

const word = (id: string): Word => ({
  id,
  word: id,
  phonetic: `/x/`,
  pos: 'n.',
  meaning: `${id} 释义`,
  example: `This is ${id}.`,
  exampleZh: `这是 ${id}。`,
});

const metaFiles = (entries: Array<[id: string, no: number, title?: string]>): Record<string, unknown> =>
  Object.fromEntries(
    entries.map(([id, no, title]) => [`./${id}-meta.json`, { no, title: title ?? `T${no}`, theme: `主题${no}` }]),
  );

describe('单元注册表 · 自动发现（unitN-meta.json 驱动，无手工清单）', () => {
  it('内置五个单元（Unit 1–5），全部由 meta 数据文件自动聚合进注册表', () => {
    expect(UNIT_IDS).toEqual(['unit1', 'unit2', 'unit3', 'unit4', 'unit5']);
    expect(new Set(UNIT_IDS).size).toBe(5);
    const nos = UNIT_MANIFESTS.map((m) => m.no);
    expect(nos).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(nos).size).toBe(5);
  });

  it('每行 manifest 元信息齐全：id / no / title / theme 非空，theme 为中文', () => {
    for (const m of UNIT_MANIFESTS) {
      expect(m.id, 'id 非空').toMatch(/^unit\d+$/);
      expect(m.title, `${m.id} title 非空`).toMatch(/[A-Za-z]/);
      expect(m.theme, `${m.id} theme 非空`).toMatch(/[\u4e00-\u9fff]/);
    }
  });

  it('UNIT_REGISTRY / UNIT_META / unitTitle 与 manifest 一一对应', () => {
    for (const m of UNIT_MANIFESTS) {
      expect(UNIT_REGISTRY[m.id as UnitId]).toBe(m);
      expect(UNIT_META[m.id as UnitId]).toEqual({ no: m.no, title: m.title, titleZh: m.theme });
      expect(unitTitle(m.id as UnitId)).toBe(`Unit ${m.no} ${m.title}`);
    }
  });

  it('isUnitId 只接受注册表内的 id', () => {
    for (const id of UNIT_IDS) expect(isUnitId(id)).toBe(true);
    for (const id of ['unit99', 'Unit1', '', 'unit3 ', null, 3]) expect(isUnitId(id)).toBe(false);
  });
});

describe('单元排序 · 按 no 升序（稳定）', () => {
  it('真实注册表：no 严格递增，与 UNIT_IDS 顺序一致', () => {
    const nos = UNIT_MANIFESTS.map((m) => m.no);
    for (let i = 1; i < nos.length; i++) expect(nos[i], 'no 应严格递增').toBeGreaterThan(nos[i - 1]);
    expect(UNIT_IDS).toEqual(UNIT_MANIFESTS.map((m) => m.id));
  });

  it('buildUnitManifests：乱序输入的 meta 按 no 升序输出', () => {
    const files: UnitModuleFiles = { meta: metaFiles([['unit3', 3], ['unit1', 1], ['unit2', 2]]) };
    expect(buildUnitManifests(files).map((m) => m.id)).toEqual(['unit1', 'unit2', 'unit3']);
  });

  it('buildUnitManifests：no 相同时按 id 字典序稳定排序', () => {
    const files: UnitModuleFiles = { meta: metaFiles([['unit12', 2], ['unit11', 2]]) };
    expect(buildUnitManifests(files).map((m) => m.id)).toEqual(['unit11', 'unit12']);
  });
});

describe('缺模块降级 · 缺数据文件不崩溃（该模块为空数组）', () => {
  it('只给 meta + 词表：其余四模块全部降级为空数组，词表正常挂载', () => {
    const files: UnitModuleFiles = {
      meta: metaFiles([['unit5', 5]]),
      words: { ['./unit5-words.json']: [word('disaster')] },
    };
    const [m] = buildUnitManifests(files);
    expect(m.id).toBe('unit5');
    expect(m.words).toHaveLength(1);
    expect(m.grammarPoints).toEqual([]);
    expect(m.grammarExercises).toEqual([]);
    expect(m.passages).toEqual([]);
    expect(m.listenings).toEqual([]);
    expect(m.writingTasks).toEqual([]);
  });

  it('只有模块文件、没有 meta：不产生单元（单元清单由 meta 驱动，孤儿模块被忽略）', () => {
    const files: UnitModuleFiles = { meta: {}, words: { ['./unit6-words.json']: [word('flood')] } };
    expect(buildUnitManifests(files)).toEqual([]);
  });

  it('非法 meta（no 非正整数 / 空 title / 空 theme）→ 跳过该单元而不是崩溃', () => {
    const files: UnitModuleFiles = {
      meta: {
        './unit7-meta.json': { no: 0, title: 'No', theme: '无' },
        './unit8-meta.json': { no: 8, title: '', theme: '空标题' },
        './unit9-meta.json': { no: 9, title: 'Ok', theme: '' },
        './unit10-meta.json': { no: 10, title: 'Good', theme: '正常' },
      },
    };
    expect(buildUnitManifests(files).map((m) => m.id)).toEqual(['unit10']);
  });

  it('模块 default 导出形状不对（非数组 / grammar 缺字段）→ 该模块按空数组降级', () => {
    const files: UnitModuleFiles = {
      meta: metaFiles([['unit5', 5]]),
      words: { ['./unit5-words.json']: 'not-an-array' },
      grammar: { ['./unit5-grammar.ts']: { points: 'oops' } },
      listening: { ['./unit5-listening.ts']: null },
    };
    const [m] = buildUnitManifests(files);
    expect(m.words).toEqual([]);
    expect(m.grammarPoints).toEqual([]);
    expect(m.grammarExercises).toEqual([]);
    expect(m.listenings).toEqual([]);
  });
});

describe('单元注册表 · 每单元五模块数据齐备', () => {
  it('词汇：每单元 20 词，全表 id 不重叠，allWords 为各单元之和', () => {
    for (const m of UNIT_MANIFESTS) {
      expect(m.words, `${m.id} 词表 20 词`).toHaveLength(20);
      expect(getWordsByUnit(m.id as UnitId)).toBe(m.words);
    }
    const ids = allWords.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(allWords).toHaveLength(UNIT_MANIFESTS.reduce((n, m) => n + m.words.length, 0));
  });

  it('语法：每单元 2 个语法点 + 10 道练习，跨单元语法点 id 唯一', () => {
    const pointIds = new Set<string>();
    for (const m of UNIT_MANIFESTS) {
      expect(m.grammarPoints, `${m.id} 2 个语法点`).toHaveLength(2);
      expect(m.grammarExercises, `${m.id} 10 道练习`).toHaveLength(10);
      expect(getGrammarPoints(m.id as UnitId)).toBe(m.grammarPoints);
      expect(getGrammarExercises(m.id as UnitId)).toBe(m.grammarExercises);
      for (const p of m.grammarPoints) {
        expect(pointIds.has(p.id), `语法点 id 重复：${p.id}`).toBe(false);
        pointIds.add(p.id);
        expect(getGrammarPoint(p.id)).toBe(p);
      }
    }
  });

  it('阅读：每单元 2 篇短文各 3 题，全部 id 唯一', () => {
    const ids = new Set<string>();
    for (const m of UNIT_MANIFESTS) {
      expect(m.passages, `${m.id} 2 篇短文`).toHaveLength(2);
      expect(getPassagesByUnit(m.id as UnitId)).toBe(m.passages);
      for (const p of m.passages) {
        expect(p.questions, `${p.id} 3 道题`).toHaveLength(3);
        expect(ids.has(p.id), `短文 id 重复：${p.id}`).toBe(false);
        ids.add(p.id);
        expect(getPassage(p.id)).toBe(p);
        for (const q of p.questions) {
          expect(ids.has(q.id), `题目 id 重复：${q.id}`).toBe(false);
          ids.add(q.id);
        }
      }
    }
  });

  it('听力：每单元 2 段材料各 3 题，全部 id 唯一', () => {
    const ids = new Set<string>();
    for (const m of UNIT_MANIFESTS) {
      expect(m.listenings, `${m.id} 2 段材料`).toHaveLength(2);
      expect(getListeningsByUnit(m.id as UnitId)).toBe(m.listenings);
      for (const mat of m.listenings) {
        expect(mat.questions, `${mat.id} 3 道题`).toHaveLength(3);
        expect(ids.has(mat.id), `材料 id 重复：${mat.id}`).toBe(false);
        ids.add(mat.id);
        expect(getListening(mat.id)).toBe(mat);
        for (const q of mat.questions) {
          expect(ids.has(q.id), `题目 id 重复：${q.id}`).toBe(false);
          ids.add(q.id);
        }
      }
    }
  });

  it('写作：每单元 2 个任务且配范文，任务 id 唯一', () => {
    const ids = new Set<string>();
    for (const m of UNIT_MANIFESTS) {
      expect(m.writingTasks, `${m.id} 2 个任务`).toHaveLength(2);
      expect(getWritingTasksByUnit(m.id as UnitId)).toBe(m.writingTasks);
      for (const t of m.writingTasks) {
        expect(ids.has(t.id), `任务 id 重复：${t.id}`).toBe(false);
        ids.add(t.id);
        expect(getWritingTask(t.id)).toBe(t);
        expect(t.modelEssay.join(' ').trim().length).toBeGreaterThan(0);
        expect(t.requirements.length).toBeGreaterThanOrEqual(3);
        expect(t.checklist.length).toBeGreaterThanOrEqual(4);
      }
    }
  });
});

describe('单元注册表 · Unit 3（Sports and Fitness）', () => {
  const unit3 = UNIT_REGISTRY.unit3;

  it('主题与词汇贴合：词表含 fitness/stadium/marathon/champion 等', () => {
    expect(unit3.title).toBe('Sports and Fitness');
    expect(unit3.theme).toBe('体育运动与健康');
    const ids = new Set(unit3.words.map((w) => w.id));
    for (const id of ['fitness', 'stadium', 'gym', 'marathon', 'champion', 'medal', 'compete', 'coach']) {
      expect(ids.has(id), `Unit 3 词表应含 ${id}`).toBe(true);
    }
  });

  it('语法点为一般过去时与一般将来时，练习 id 均带 u3- 前缀', () => {
    expect(unit3.grammarPoints.map((p) => p.title).join('/')).toContain('一般过去时');
    expect(unit3.grammarPoints.map((p) => p.title).join('/')).toContain('一般将来时');
    for (const e of unit3.grammarExercises) expect(e.id.startsWith('u3-')).toBe(true);
  });

  it('阅读 / 听力 / 写作条目 id 均带 u3- 前缀（错题归档前缀约定）', () => {
    for (const p of unit3.passages) {
      expect(p.id.startsWith('u3-')).toBe(true);
      for (const q of p.questions) expect(q.id.startsWith('u3-')).toBe(true);
    }
    for (const m of unit3.listenings) {
      expect(m.id.startsWith('u3-')).toBe(true);
      for (const q of m.questions) expect(q.id.startsWith('u3-')).toBe(true);
    }
    for (const t of unit3.writingTasks) expect(t.id.startsWith('u3-')).toBe(true);
  });

  it('阅读生词表 wordId 均在 Unit 3 词表中', () => {
    const ids = new Set(unit3.words.map((w) => w.id));
    for (const p of unit3.passages) {
      for (const g of p.glossary) expect(ids.has(g.wordId), `${p.id} 生词 ${g.wordId} 不在 Unit 3 词表`).toBe(true);
    }
  });
});

describe('单元注册表 · Unit 4（Natural Disasters，纯数据文件新增）', () => {
  const unit4 = UNIT_REGISTRY.unit4;

  it('元信息来自 unit4-meta.json：Natural Disasters / 自然灾害', () => {
    expect(unit4.no).toBe(4);
    expect(unit4.id).toBe('unit4');
    expect(unit4.title).toBe('Natural Disasters');
    expect(unit4.theme).toBe('自然灾害');
  });

  it('主题与词汇贴合：词表含 disaster/earthquake/flood/rescue/shelter/survive 等', () => {
    const ids = new Set(unit4.words.map((w) => w.id));
    for (const id of [
      'disaster',
      'earthquake',
      'flood',
      'rescue',
      'shelter',
      'survive',
      'destroy',
      'trap',
      'emergency',
      'aid',
    ]) {
      expect(ids.has(id), `Unit 4 词表应含 ${id}`).toBe(true);
    }
  });

  it('语法点为过去完成时与一般过去时的被动语态，练习 id 均带 u4- 前缀', () => {
    expect(unit4.grammarPoints.map((p) => p.title).join('/')).toContain('过去完成时');
    expect(unit4.grammarPoints.map((p) => p.title).join('/')).toContain('被动语态');
    for (const e of unit4.grammarExercises) expect(e.id.startsWith('u4-')).toBe(true);
  });

  it('阅读 / 听力 / 写作条目 id 均带 u4- 前缀（错题归档前缀约定）', () => {
    for (const p of unit4.passages) {
      expect(p.id.startsWith('u4-')).toBe(true);
      for (const q of p.questions) expect(q.id.startsWith('u4-')).toBe(true);
    }
    for (const m of unit4.listenings) {
      expect(m.id.startsWith('u4-')).toBe(true);
      for (const q of m.questions) expect(q.id.startsWith('u4-')).toBe(true);
    }
    for (const t of unit4.writingTasks) expect(t.id.startsWith('u4-')).toBe(true);
  });

  it('阅读生词表 wordId 均在 Unit 4 词表中', () => {
    const ids = new Set(unit4.words.map((w) => w.id));
    for (const p of unit4.passages) {
      for (const g of p.glossary) expect(ids.has(g.wordId), `${p.id} 生词 ${g.wordId} 不在 Unit 4 词表`).toBe(true);
    }
  });
});
