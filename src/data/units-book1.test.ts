import { describe, it, expect } from 'vitest';
import { UNIT_REGISTRY, UNIT_META, unitIdsOfBook, bookOfUnit, type UnitId } from './units';

/**
 * 必修一（required-1 · 人教2019 Unit 1–5 = unit1–unit5）专属回归：
 * 按册独立测试文件约定（units-bookN.test.ts）——只断言本册单元，
 * 与共享 units.test.ts（数据无关不变式）分离，各册 PR 并行不冲突。
 */

describe('必修一 · 册分组与元信息（unit1–unit5）', () => {
  it('五个单元全部归入必修一，册内单元号 1–5', () => {
    expect(unitIdsOfBook('required-1')).toEqual(['unit1', 'unit2', 'unit3', 'unit4', 'unit5']);
    for (let i = 1; i <= 5; i++) {
      const id = `unit${i}` as UnitId;
      expect(bookOfUnit(id)).toBe('required-1');
      expect(UNIT_META[id].book).toBe('required-1');
      expect(UNIT_META[id].no).toBe(i);
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
