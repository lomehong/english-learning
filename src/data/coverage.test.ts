import { describe, it, expect } from 'vitest';
import {
  BOOKS,
  BOOK_IDS,
  unitIdsOfBook,
  UNITS_BY_BOOK,
  UNIT_MANIFESTS,
  UNIT_IDS,
  bookOfUnit,
  firstUnitOfBook,
  type BookId,
} from './units';

/**
 * 全阶段覆盖验收（最终态 · 人教2019 七册全齐）：
 * 必修一 ~ 必修三 + 选择性必修一 ~ 四，共 7 册 35 单元；
 * 首页册别切换器的七册固定维度与各册单元清单均由本注册表驱动。
 */

const EXPECTED_BOOKS: ReadonlyArray<{ id: BookId; label: string; units: number }> = [
  { id: 'required-1', label: '必修一', units: 5 },
  { id: 'required-2', label: '必修二', units: 5 },
  { id: 'required-3', label: '必修三', units: 5 },
  { id: 'elective-1', label: '选择性必修一', units: 5 },
  { id: 'elective-2', label: '选择性必修二', units: 5 },
  { id: 'elective-3', label: '选择性必修三', units: 5 },
  { id: 'elective-4', label: '选择性必修四', units: 5 },
];

describe('全阶段覆盖 · 七册 35 单元（最终验收）', () => {
  it('七册固定清单齐全（首页册别切换器维度），顺序必修一 → 选择性必修四', () => {
    expect(BOOKS).toHaveLength(7);
    expect(BOOKS.map((b) => b.id)).toEqual(EXPECTED_BOOKS.map((b) => b.id));
    expect(BOOKS.map((b) => b.label)).toEqual(EXPECTED_BOOKS.map((b) => b.label));
  });

  it('每册恰 5 个单元，册内单元号 1–5，册首单元可取', () => {
    for (const book of EXPECTED_BOOKS) {
      const ids = unitIdsOfBook(book.id);
      expect(ids, `${book.label} 应有 ${book.units} 个单元`).toHaveLength(book.units);
      expect(UNITS_BY_BOOK[book.id]!.map((m) => m.no)).toEqual([1, 2, 3, 4, 5]);
      expect(firstUnitOfBook(book.id)).toBe(ids[0]);
      for (const id of ids) expect(bookOfUnit(id)).toBe(book.id);
    }
  });

  it('注册表合计 35 单元，与七册之和一致，无跨册重复', () => {
    expect(UNIT_MANIFESTS).toHaveLength(35);
    expect(UNIT_IDS).toHaveLength(35);
    expect(new Set(UNIT_IDS).size).toBe(35);
    expect(BOOK_IDS.reduce((n, book) => n + unitIdsOfBook(book).length, 0)).toBe(35);
  });
});
