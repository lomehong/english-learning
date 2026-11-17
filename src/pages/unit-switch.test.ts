import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  UNIT_STORAGE_KEY,
  currentUnit,
  unitFromParam,
  storedUnit,
  setUnit,
  resetUnitState,
} from './unit-switch';
import { UNIT_IDS } from '../data/units';

/** 全局单元状态：URL ?unit= ↔ localStorage 双向同步（首页切换器驱动） */

/** 与 store 测试同款：绕过 Node≥26 实验性全局 localStorage 遮蔽，取 jsdom 实例 */
function storage(): Storage | undefined {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  return g._localStorage ?? g.localStorage;
}

function storageValue(): string | null {
  return storage()?.getItem(UNIT_STORAGE_KEY) ?? null;
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
    expect(unitFromParam('4')).toBeNull();
    expect(unitFromParam('unit4')).toBeNull();
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
