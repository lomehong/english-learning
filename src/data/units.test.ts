import { describe, it, expect } from 'vitest';
import {
  UNIT_MANIFESTS,
  UNIT_IDS,
  UNIT_META,
  UNIT_REGISTRY,
  unitTitle,
  bookUnitTitle,
  isUnitId,
  buildUnitManifests,
  BOOKS,
  BOOK_IDS,
  BOOK_LABELS,
  DEFAULT_BOOK,
  UNITS_BY_BOOK,
  unitsByBook,
  unitIdsOfBook,
  bookOfUnit,
  firstUnitOfBook,
  isBookId,
  normalizeBookValue,
  type UnitId,
  type UnitModuleFiles,
} from './units';
import { getWordsByUnit, allWords } from './words';
import { getGrammarPoints, getGrammarExercises, getGrammarPoint } from './grammar';
import { getPassagesByUnit, getPassage } from './reading';
import { getListeningsByUnit, getListening } from './listening';
import { getWritingTasksByUnit, getWritingTask } from './writing';
import type { Word } from '../types';

/**
 * 共享注册表测试（数据无关）：
 * ══════════════════════════════════════════════════════════════════════════
 * 【并行约定】本文件只保留对「注册表聚合逻辑」的数据无关断言（合成数据 + 全量不变式），
 * 不随册别/单元数量变化，各册新增单元的专属测试写独立文件 units-bookN.test.ts，
 * 不再修改本文件，避免各册 PR 并行开发时在共享测试上冲突。
 * ══════════════════════════════════════════════════════════════════════════
 */

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

const metaFiles = (
  entries: Array<[id: string, no: number, title?: string, book?: string]>,
): Record<string, unknown> =>
  Object.fromEntries(
    entries.map(([id, no, title, book]) => [
      `./${id}-meta.json`,
      { ...(book !== undefined ? { book } : {}), no, title: title ?? `T${no}`, theme: `主题${no}` },
    ]),
  );

describe('单元注册表 · 自动发现（unitN-meta.json 驱动，无手工清单）', () => {
  it('全部注册单元 id 形如 unitN 且互不重复，清单与 manifest 一一对应（册数随数据文件自由扩展）', () => {
    expect(UNIT_IDS).toEqual(UNIT_MANIFESTS.map((m) => m.id));
    expect(new Set(UNIT_IDS).size).toBe(UNIT_IDS.length);
    for (const id of UNIT_IDS) expect(id).toMatch(/^unit\d+$/);
    for (const book of BOOK_IDS) {
      const nos = unitsByBook(book).map((m) => m.no);
      expect(new Set(nos).size, `${book} 册内单元号不重复`).toBe(nos.length);
    }
  });

  it('每行 manifest 元信息齐全：id / book / no / title / theme 非空，theme 为中文', () => {
    for (const m of UNIT_MANIFESTS) {
      expect(m.id, 'id 非空').toMatch(/^unit\d+$/);
      expect(isBookId(m.book), `${m.id} book 合法`).toBe(true);
      expect(m.title, `${m.id} title 非空`).toMatch(/[A-Za-z]/);
      expect(m.theme, `${m.id} theme 非空`).toMatch(/[\u4e00-\u9fff]/);
    }
  });

  it('UNIT_REGISTRY / UNIT_META / unitTitle 与 manifest 一一对应', () => {
    for (const m of UNIT_MANIFESTS) {
      expect(UNIT_REGISTRY[m.id as UnitId]).toBe(m);
      expect(UNIT_META[m.id as UnitId]).toEqual({ book: m.book, no: m.no, title: m.title, titleZh: m.theme });
      expect(unitTitle(m.id as UnitId)).toBe(`Unit ${m.no} ${m.title}`);
      expect(bookUnitTitle(m.id as UnitId)).toBe(`${BOOK_LABELS[m.book]} · Unit ${m.no} ${m.title}`);
    }
  });

  it('isUnitId 只接受注册表内的 id', () => {
    for (const id of UNIT_IDS) expect(isUnitId(id)).toBe(true);
    for (const id of ['unit9900', 'Unit1', '', 'unit3 ', null, 3]) expect(isUnitId(id)).toBe(false);
  });
});

describe('单元排序 · 册内按 no 升序（稳定）', () => {
  it('真实注册表：每册内 no 严格递增（册别顺序分组），与 UNIT_IDS 顺序一致', () => {
    for (const book of BOOK_IDS) {
      const nos = unitsByBook(book).map((m) => m.no);
      for (let i = 1; i < nos.length; i++)
        expect(nos[i], `${book} 册内 no 应严格递增`).toBeGreaterThan(nos[i - 1]);
    }
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

describe('册别维度 · 注册表按册分组（meta 的 book 字段驱动）', () => {
  it('七册固定清单：必修一 / 必修二 / 必修三 + 选择性必修一 ~ 四，顺序稳定，默认册为必修一', () => {
    expect(BOOKS.map((b) => b.label)).toEqual([
      '必修一',
      '必修二',
      '必修三',
      '选择性必修一',
      '选择性必修二',
      '选择性必修三',
      '选择性必修四',
    ]);
    expect(BOOK_IDS).toEqual(BOOKS.map((b) => b.id));
    expect(DEFAULT_BOOK).toBe('required-1');
    expect(BOOK_LABELS[DEFAULT_BOOK]).toBe('必修一');
  });

  it('按册分组与 manifest 逐册对应：每个单元落在其 meta 声明的册，册清单顺序 = 册内 no 升序', () => {
    for (const book of BOOK_IDS) {
      const ids = unitIdsOfBook(book);
      expect(ids).toEqual(UNITS_BY_BOOK[book].map((m) => m.id));
      for (const m of UNITS_BY_BOOK[book]) {
        expect(m.book).toBe(book);
        expect(UNIT_META[m.id as UnitId].book).toBe(book);
      }
      // 尚未收录数据的册为空分组（缺册降级为空数组）；有数据的册首单元存在
      if (ids.length === 0) expect(firstUnitOfBook(book)).toBeNull();
      else expect(firstUnitOfBook(book)).toBe(ids[0]);
    }
    expect(firstUnitOfBook('required-1')).toBe('unit1');
  });

  it('UNITS_BY_BOOK 聚合视图与 manifest 一一对应：七册之和 = 注册表总数（自动发现不变）', () => {
    const total = BOOK_IDS.reduce((n, book) => n + UNITS_BY_BOOK[book].length, 0);
    expect(total).toBe(UNIT_MANIFESTS.length);
    const allGrouped = BOOK_IDS.flatMap((book) => UNITS_BY_BOOK[book].map((m) => m.id));
    expect(allGrouped.sort()).toEqual([...UNIT_IDS].sort());
  });

  it('册别查询助手：bookOfUnit / isBookId / normalizeBookValue（册名与 slug 双写法）', () => {
    expect(bookOfUnit('unit3')).toBe('required-1');
    expect(bookOfUnit('unit5')).toBe('required-1');
    expect(isBookId('required-2')).toBe(true);
    expect(isBookId('elective-4')).toBe(true);
    expect(isBookId('必修二')).toBe(false); // 存储与深链统一用 slug，册名不是 id
    expect(isBookId('book9')).toBe(false);
    expect(normalizeBookValue('必修二')).toBe('required-2');
    expect(normalizeBookValue('选择性必修四')).toBe('elective-4');
    expect(normalizeBookValue('elective-3')).toBe('elective-3'); // slug 写法同样接受
  });

  it('跨册聚合排序：先按册别顺序（必修一 → 选择性必修四），册内再按 no 升序', () => {
    const files: UnitModuleFiles = {
      meta: {
        ...metaFiles([['unit1', 1]]), // 缺 book → 必修一（缺册降级）
        ...metaFiles([
          ['unit6', 2, undefined, '必修二'],
          ['unit5', 1, undefined, '必修二'],
          ['unit7', 1, undefined, '选择性必修一'],
        ]),
      },
    };
    expect(buildUnitManifests(files).map((m) => `${m.book}:${m.id}`)).toEqual([
      'required-1:unit1',
      'required-2:unit5', // 必修二册内 no=1 在 no=2 前
      'required-2:unit6',
      'elective-1:unit7',
    ]);
  });
});

describe('缺册降级 · meta 的 book 缺失 / 非法不崩溃', () => {
  it('meta 缺 book 字段 → 该单元降级归入必修一（旧数据兼容）', () => {
    const files: UnitModuleFiles = { meta: metaFiles([['unit1', 1]]) };
    expect(buildUnitManifests(files)[0]!.book).toBe('required-1');
  });

  it('meta 的 book 取值不在七册之列 / 类型不对 → 一律降级归入必修一', () => {
    const files: UnitModuleFiles = {
      meta: {
        './unit2-meta.json': { no: 2, title: 'A', theme: '甲', book: '必修五' },
        './unit3-meta.json': { no: 3, title: 'B', theme: '乙', book: 5 },
        './unit4-meta.json': { no: 4, title: 'C', theme: '丙', book: null },
      },
    };
    for (const m of buildUnitManifests(files)) expect(m.book).toBe('required-1');
  });

  it('缺册降级不影响其余元信息：no / title / theme 照常挂载', () => {
    const files: UnitModuleFiles = { meta: metaFiles([['unit8', 8, 'Ok']]) };
    const [m] = buildUnitManifests(files);
    expect(m!.book).toBe('required-1');
    expect(m!.no).toBe(8);
    expect(m!.title).toBe('Ok');
    expect(m!.theme).toBe('主题8');
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

describe('单元注册表 · 每单元五模块数据齐备（全量不变式，随数据扩展自动覆盖新单元）', () => {
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
