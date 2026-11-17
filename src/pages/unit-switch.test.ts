import { describe, it, expect, afterEach } from 'vitest';
import { currentUnit, unitFromParam, unitUrl } from './unit-switch';
import { UNIT_IDS } from '../data/units';

/** 各模块路径：挂载时都经 currentUnit() 从 ?unit= 初始化单元状态 */
const MODULE_PATHS = ['/vocabulary', '/grammar', '/reading', '/listening', '/writing'];

describe('unitFromParam · ?unit= 参数解析', () => {
  it('规范写法：unit1 / unit2 原样通过', () => {
    expect(unitFromParam('unit1')).toBe('unit1');
    expect(unitFromParam('unit2')).toBe('unit2');
  });

  it('单元号写法：1 → unit1，2 → unit2（/vocabulary?unit=2 深链）', () => {
    expect(unitFromParam('1')).toBe('unit1');
    expect(unitFromParam('2')).toBe('unit2');
  });

  it('缺省（null）与非法值一律回退 Unit 1', () => {
    expect(unitFromParam(null)).toBe('unit1');
    expect(unitFromParam('')).toBe('unit1');
    expect(unitFromParam('0')).toBe('unit1');
    expect(unitFromParam('3')).toBe('unit1');
    expect(unitFromParam('unit3')).toBe('unit1');
    expect(unitFromParam('Unit2')).toBe('unit1'); // 大小写敏感
    expect(unitFromParam('two')).toBe('unit1');
    expect(unitFromParam(' unit2 ')).toBe('unit1'); // 不做 trim
  });
});

describe('currentUnit · 各模块挂载时从 URL searchParams 初始化', () => {
  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('?unit=2 深链初始化为 Unit 2（五个模块路径一致）', () => {
    for (const path of MODULE_PATHS) {
      history.replaceState(null, '', `${path}?unit=2`);
      expect(currentUnit(), path).toBe('unit2');
    }
  });

  it('?unit=unit2 规范深链初始化为 Unit 2', () => {
    history.replaceState(null, '', '/grammar?unit=unit2');
    expect(currentUnit()).toBe('unit2');
  });

  it('非法值与缺省回退 Unit 1', () => {
    for (const path of MODULE_PATHS) {
      history.replaceState(null, '', `${path}?unit=99`);
      expect(currentUnit(), path).toBe('unit1');
    }
    history.replaceState(null, '', '/vocabulary?unit=abc');
    expect(currentUnit()).toBe('unit1');
    history.replaceState(null, '', '/reading');
    expect(currentUnit()).toBe('unit1');
  });
});

describe('unitUrl · 切换单元时的 URL 同步（replaceState 写入）', () => {
  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('切到 Unit 2 写入规范 unit 参数，切回 Unit 1 清除参数', () => {
    history.replaceState(null, '', '/vocabulary');
    expect(unitUrl('/vocabulary', 'unit2')).toBe('/vocabulary?unit=unit2');
    expect(unitUrl('/vocabulary', 'unit1')).toBe('/vocabulary');
  });

  it('保留其余查询参数（如 ?tab=review）', () => {
    history.replaceState(null, '', '/vocabulary?unit=2&tab=review');
    const toUnit2 = new URL(unitUrl('/vocabulary', 'unit2'), 'http://localhost/');
    expect(toUnit2.searchParams.get('unit')).toBe('unit2');
    expect(toUnit2.searchParams.get('tab')).toBe('review');
    const toUnit1 = new URL(unitUrl('/vocabulary', 'unit1'), 'http://localhost/');
    expect(toUnit1.searchParams.get('unit')).toBeNull();
    expect(toUnit1.searchParams.get('tab')).toBe('review');
  });

  it('UNIT_IDS 全部单元都有可生成的切换 URL', () => {
    history.replaceState(null, '', '/grammar');
    for (const id of UNIT_IDS) {
      expect(unitUrl('/grammar', id), id).toContain('/grammar');
    }
  });
});
