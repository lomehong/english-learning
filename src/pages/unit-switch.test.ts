import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UNIT_STORAGE_KEY,
  BOOK_STORAGE_KEY,
  currentUnit,
  currentBook,
  unitFromParam,
  bookFromParam,
  storedUnit,
  storedBook,
  setUnit,
  setBook,
  resetUnitState,
} from './unit-switch';
import { UNIT_IDS, DEFAULT_BOOK } from '../data/units';

/** 全局「册 + 单元」两级状态：URL ?book=&unit= ↔ localStorage 双向同步（首页两级切换器驱动） */

/** 与 store 测试同款：绕过 Node≥26 实验性全局 localStorage 遮蔽，取 jsdom 实例 */
function storage(): Storage | undefined {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  return g._localStorage ?? g.localStorage;
}

function storageValue(): string | null {
  return storage()?.getItem(UNIT_STORAGE_KEY) ?? null;
}

function bookStorageValue(): string | null {
  return storage()?.getItem(BOOK_STORAGE_KEY) ?? null;
}

beforeEach(() => {
  resetUnitState();
});

afterEach(() => {
  resetUnitState();
  history.replaceState(null, '', '/');
});

describe('unitFromParam · ?unit= 参数解析', () => {
  it('规范写法：unit1 / unit2 / unit3 原样通过', () => {
    expect(unitFromParam('unit1')).toBe('unit1');
    expect(unitFromParam('unit2')).toBe('unit2');
    expect(unitFromParam('unit3')).toBe('unit3');
  });

  it('单元号写法：1 / 2 / 3 → 对应单元（/grammar?unit=3 深链）', () => {
    expect(unitFromParam('1')).toBe('unit1');
    expect(unitFromParam('2')).toBe('unit2');
    expect(unitFromParam('3')).toBe('unit3');
  });

  it('非法值返回 null（由存储与默认值兜底），缺省也是 null', () => {
    expect(unitFromParam(null)).toBeNull();
    expect(unitFromParam('')).toBeNull();
    expect(unitFromParam('0')).toBeNull();
    expect(unitFromParam('99')).toBeNull();
    expect(unitFromParam('unit99')).toBeNull();
    expect(unitFromParam('Unit2')).toBeNull(); // 大小写敏感
    expect(unitFromParam('two')).toBeNull();
    expect(unitFromParam(' unit2 ')).toBeNull(); // 不做 trim
  });
});

describe('全局单元 · 深链回退与优先级', () => {
  it('无 URL 参数且无存储 → 回退 Unit 1', () => {
    history.replaceState(null, '', '/grammar');
    expect(storageValue()).toBeNull();
    expect(currentUnit()).toBe('unit1');
  });

  it('非法 ?unit= 深链 → 忽略参数并回退 Unit 1', () => {
    history.replaceState(null, '', '/grammar?unit=99');
    expect(currentUnit()).toBe('unit1');
    expect(storageValue()).toBeNull(); // 非法值不落存储
  });

  it('存储中有合法单元（曾用首页切换）→ 无参 URL 沿用存储值', () => {
    history.replaceState(null, '', '/');
    setUnit('unit3');
    history.replaceState(null, '', '/vocabulary'); // 站内跳转到模块页（无 unit 参数）
    expect(currentUnit()).toBe('unit3');
  });

  it('存储脏数据（非法值）→ 回退 Unit 1 而不是抛异常', () => {
    storage()?.setItem(UNIT_STORAGE_KEY, 'unit9');
    history.replaceState(null, '', '/grammar');
    expect(storedUnit()).toBeNull();
    expect(currentUnit()).toBe('unit1');
  });

  it('有效 ?unit= 深链优先于存储，并被采纳回写存储（URL → 状态）', () => {
    setUnit('unit2');
    history.replaceState(null, '', '/grammar?unit=3');
    expect(currentUnit()).toBe('unit3');
    expect(storageValue()).toBe('unit3');
  });
});

describe('全局单元 · 状态 → URL 同步（setUnit）', () => {
  it('切换写入 localStorage 并同步当前地址 ?unit=，切回 Unit 1 清除参数', () => {
    history.replaceState(null, '', '/');
    setUnit('unit3');
    expect(storageValue()).toBe('unit3');
    expect(location.pathname).toBe('/');
    expect(new URLSearchParams(location.search).get('unit')).toBe('unit3');

    setUnit('unit1');
    expect(storageValue()).toBe('unit1');
    expect(location.search).toBe('');
  });

  it('保留其余查询参数（如 /vocabulary?tab=review 上的切换）', () => {
    history.replaceState(null, '', '/vocabulary?tab=review');
    setUnit('unit2');
    const params = new URLSearchParams(location.search);
    expect(params.get('unit')).toBe('unit2');
    expect(params.get('tab')).toBe('review');
    setUnit('unit1');
    expect(new URLSearchParams(location.search).get('tab')).toBe('review');
    expect(new URLSearchParams(location.search).get('unit')).toBeNull();
  });

  it('注册表内全部单元均可切换（Unit 1 / 2 / 3）', () => {
    for (const id of UNIT_IDS) {
      setUnit(id);
      expect(currentUnit()).toBe(id);
      expect(storageValue()).toBe(id);
    }
  });
});

describe('bookFromParam · ?book= 参数解析（两级深链的册侧）', () => {
  it('slug 写法：required-1 / elective-2 原样通过', () => {
    expect(bookFromParam('required-1')).toBe('required-1');
    expect(bookFromParam('required-3')).toBe('required-3');
    expect(bookFromParam('elective-1')).toBe('elective-1');
    expect(bookFromParam('elective-4')).toBe('elective-4');
  });

  it('中文册名写法：必修一 / 选择性必修三 → 对应册', () => {
    expect(bookFromParam('必修一')).toBe('required-1');
    expect(bookFromParam('必修二')).toBe('required-2');
    expect(bookFromParam('选择性必修三')).toBe('elective-3');
  });

  it('非法值返回 null（由存储与默认值兜底），缺省也是 null', () => {
    expect(bookFromParam(null)).toBeNull();
    expect(bookFromParam('')).toBeNull();
    expect(bookFromParam('book2')).toBeNull();
    expect(bookFromParam('必修五')).toBeNull();
    expect(bookFromParam('Required-1')).toBeNull(); // 大小写敏感
    expect(bookFromParam('required-9')).toBeNull();
    expect(bookFromParam(' required-1 ')).toBeNull(); // 不做 trim
  });
});

describe('全局册 + 单元 · 深链与回退（URL → 状态）', () => {
  it('无 URL 参数且无存储 → 回退必修一 + Unit 1（两级默认值）', () => {
    history.replaceState(null, '', '/grammar');
    expect(storageValue()).toBeNull();
    expect(bookStorageValue()).toBeNull();
    expect(currentBook()).toBe(DEFAULT_BOOK);
    expect(currentUnit()).toBe('unit1');
  });

  it('?unit= 深链：单元优先命中，册随单元归属（unit3 → 必修一），册 + 单元双写存储', () => {
    history.replaceState(null, '', '/grammar?unit=3');
    expect(currentUnit()).toBe('unit3');
    expect(currentBook()).toBe('required-1');
    expect(storageValue()).toBe('unit3');
    expect(bookStorageValue()).toBe('required-1');
  });

  it('?book=&unit= 冲突（book=选择性必修一 & unit=unit3）→ 单元优先，册随单元归必修一', () => {
    history.replaceState(null, '', '/grammar?book=elective-1&unit=unit3');
    expect(currentUnit()).toBe('unit3');
    expect(currentBook()).toBe('required-1'); // 不因册参数把内容切到空册
    expect(bookStorageValue()).toBe('required-1');
  });

  it('仅 ?book=required-1：册命中，单元沿用该册内最近选择', () => {
    setUnit('unit2');
    history.replaceState(null, '', '/grammar?book=required-1');
    expect(currentBook()).toBe('required-1');
    expect(currentUnit()).toBe('unit2');
  });

  it('仅 ?book=（空册深链）：册被采纳，单元沿用最近有效单元（缺册降级，模块不崩溃）', () => {
    setUnit('unit4');
    history.replaceState(null, '', '/grammar?book=elective-1');
    expect(currentBook()).toBe('elective-1');
    expect(currentUnit()).toBe('unit4'); // 空册没有单元可切，沿用最近单元
    expect(bookStorageValue()).toBe('elective-1');
    expect(storageValue()).toBe('unit4');
  });

  it('非法 ?book= 与非法 ?unit= 同时出现 → 全部忽略，回退必修一 Unit 1，不落存储', () => {
    history.replaceState(null, '', '/grammar?book=99&unit=99');
    expect(currentBook()).toBe('required-1');
    expect(currentUnit()).toBe('unit1');
    expect(bookStorageValue()).toBeNull();
    expect(storageValue()).toBeNull();
  });

  it('存储册脏数据（非法值）→ storedBook 为 null，册随单元兜底必修一', () => {
    storage()?.setItem(BOOK_STORAGE_KEY, 'book9');
    history.replaceState(null, '', '/grammar');
    expect(storedBook()).toBeNull();
    expect(currentBook()).toBe('required-1');
  });

  it('存储册为空册 + 存储单元合法：无参地址沿用该组合（空册降级保持最近单元）', () => {
    setBook('elective-2'); // 空册：unit 沿用 setBook 前的 unit1
    history.replaceState(null, '', '/grammar');
    expect(currentBook()).toBe('elective-2');
    expect(currentUnit()).toBe('unit1');
  });
});

describe('全局册切换 · setBook（两级联动 + 状态 → URL 同步）', () => {
  it('切到空册：URL 只写 ?book=（不写误导性的 ?unit=），册 + 单元双写存储', () => {
    history.replaceState(null, '', '/');
    setUnit('unit3');
    setBook('elective-2');
    expect(bookStorageValue()).toBe('elective-2');
    expect(storageValue()).toBe('unit3'); // 空册沿用最近单元（降级）
    const params = new URLSearchParams(location.search);
    expect(params.get('book')).toBe('elective-2');
    expect(params.get('unit')).toBeNull(); // 空册不带单元参数
  });

  it('从空册切回必修一：默认册不写 ?book=，单元恢复册内最近选择', () => {
    history.replaceState(null, '', '/');
    setUnit('unit3');
    setBook('elective-2');
    setBook('required-1');
    expect(bookStorageValue()).toBe('required-1');
    expect(storageValue()).toBe('unit3'); // 册内最近选择恢复
    const params = new URLSearchParams(location.search);
    expect(params.get('book')).toBeNull(); // 默认册走干净路径
    expect(params.get('unit')).toBe('unit3');
  });

  it('setUnit 仍带动册随单元（册 + 单元一致性由单元侧保证）', () => {
    history.replaceState(null, '', '/');
    setBook('elective-1');
    setUnit('unit5');
    expect(currentBook()).toBe('required-1'); // 册随单元离开空册
    expect(bookStorageValue()).toBe('required-1');
  });

  it('切换册保留其余查询参数（如 /vocabulary?tab=review 上切册）', () => {
    history.replaceState(null, '', '/vocabulary?tab=review');
    setBook('elective-3');
    const params = new URLSearchParams(location.search);
    expect(params.get('book')).toBe('elective-3');
    expect(params.get('tab')).toBe('review');
  });
});
