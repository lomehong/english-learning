import { describe, it, expect, beforeEach } from 'vitest';
import {
  emptyStats,
  loadStats,
  saveStats,
  recordAnswer,
  STORAGE_KEY,
} from './stats';
import { UNIT_IDS } from '../data/units';

// 与 wrongbook.test.ts 同款：绕过 Node≥26 实验性全局 localStorage 遮蔽，取 jsdom 实例
function testStorage(): Storage {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  const s = g._localStorage ?? g.localStorage;
  if (!s) throw new Error('测试环境无可用 localStorage');
  return s;
}

describe('练习统计 localStorage 持久化', () => {
  beforeEach(() => {
    testStorage().clear();
  });

  it('无记录时返回空统计：四模块 answered/correct 均为 0，含各注册单元细分', () => {
    const stats = loadStats();
    expect(stats).toEqual(emptyStats());
    expect(Object.keys(stats.modules).sort()).toEqual(['grammar', 'listening', 'reading', 'vocab']);
    expect(stats.modules.grammar).toEqual({ answered: 0, correct: 0 });
    expect(Object.keys(stats.units).sort()).toEqual([...UNIT_IDS].sort());
    expect(stats.units.unit1.vocab).toEqual({ answered: 0, correct: 0 });
    expect(stats.units.unit2.listening).toEqual({ answered: 0, correct: 0 });
    expect(stats.units.unit4.listening).toEqual({ answered: 0, correct: 0 });
  });

  it('recordAnswer 同时累加模块总计与所属单元细分（纯函数，不改原对象）', () => {
    const original = emptyStats();
    let stats = recordAnswer(original, 'grammar', true, 'unit1');
    stats = recordAnswer(stats, 'grammar', false, 'unit1');
    stats = recordAnswer(stats, 'grammar', true, 'unit2');
    stats = recordAnswer(stats, 'reading', true, 'unit2');

    expect(stats.modules.grammar).toEqual({ answered: 3, correct: 2 });
    expect(stats.modules.reading).toEqual({ answered: 1, correct: 1 });
    expect(stats.modules.vocab).toEqual({ answered: 0, correct: 0 });
    expect(stats.units.unit1.grammar).toEqual({ answered: 2, correct: 1 });
    expect(stats.units.unit2.grammar).toEqual({ answered: 1, correct: 1 });
    expect(stats.units.unit2.reading).toEqual({ answered: 1, correct: 1 });
    expect(stats.units.unit1.reading).toEqual({ answered: 0, correct: 0 });
    // 纯函数
    expect(original.modules.grammar).toEqual({ answered: 0, correct: 0 });
    expect(original.units.unit1.grammar).toEqual({ answered: 0, correct: 0 });
  });

  it('保存后重新加载往返一致，写入约定键', () => {
    const saved = recordAnswer(
      recordAnswer(emptyStats(), 'vocab', true, 'unit2'),
      'vocab',
      false,
      'unit2',
    );
    saveStats(saved, testStorage());

    expect(testStorage().getItem(STORAGE_KEY)).toBeTruthy();
    expect(loadStats(testStorage())).toEqual(saved);
    expect(JSON.parse(testStorage().getItem(STORAGE_KEY)!).version).toBe(1);
  });

  it('损坏的 JSON / 不兼容版本 / 非对象结构：安全回退空统计，不抛异常', () => {
    testStorage().setItem(STORAGE_KEY, '{not-valid-json');
    expect(loadStats(testStorage())).toEqual(emptyStats());

    testStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 99, modules: {} }));
    expect(loadStats(testStorage())).toEqual(emptyStats());

    testStorage().setItem(STORAGE_KEY, JSON.stringify({ version: 1, modules: 'nope' }));
    expect(loadStats(testStorage())).toEqual(emptyStats());
  });

  it('旧版本数据（无 units 字段）：modules 保留累计，units 视为全 0', () => {
    testStorage().setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        modules: { grammar: { answered: 6, correct: 4 } },
      }),
    );
    const loaded = loadStats(testStorage());
    expect(loaded.modules.grammar).toEqual({ answered: 6, correct: 4 });
    expect(loaded.units.unit1.grammar).toEqual({ answered: 0, correct: 0 });
    expect(loaded.units.unit2.grammar).toEqual({ answered: 0, correct: 0 });
  });

  it('脏数据防御：非有限数字、负数、correct>answered、未知模块/单元一律归一化', () => {
    testStorage().setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        modules: {
          grammar: { answered: 5, correct: 9 }, // correct>answered → 收敛为 5
          reading: { answered: -3, correct: -1 }, // 负数 → 归 0
          listening: { answered: 'x', correct: 2 }, // 非数字 → 该模块归 0
          vocab: { answered: 4, correct: 3 }, // 合法保留
          hacker: { answered: 100, correct: 100 }, // 未知模块 → 丢弃
        },
        units: {
          unit2: {
            grammar: { answered: 2, correct: 1 }, // 合法保留
            hacker: { answered: 50, correct: 50 }, // 未知模块 → 丢弃
          },
          unit99: { grammar: { answered: 9, correct: 9 } }, // 未知单元 → 丢弃（unit9 已是必修三合法单元）
        },
      }),
    );
    const loaded = loadStats(testStorage());
    expect(loaded.modules.grammar).toEqual({ answered: 5, correct: 5 });
    expect(loaded.modules.reading).toEqual({ answered: 0, correct: 0 });
    expect(loaded.modules.listening).toEqual({ answered: 0, correct: 0 });
    expect(loaded.modules.vocab).toEqual({ answered: 4, correct: 3 });
    expect(Object.keys(loaded.modules).includes('hacker')).toBe(false);
    expect(loaded.units.unit2.grammar).toEqual({ answered: 2, correct: 1 });
    expect(Object.keys(loaded.units.unit2).includes('hacker')).toBe(false);
    expect(Object.keys(loaded.units).includes('unit99')).toBe(false);
    expect(loaded.units.unit1.grammar).toEqual({ answered: 0, correct: 0 });
  });

  it('支持注入自定义 storage（接缝：不绑定全局 localStorage）', () => {
    const memory = new Map<string, string>();
    const storage = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => void memory.set(k, v),
    };
    saveStats(recordAnswer(emptyStats(), 'listening', true, 'unit2'), storage);
    const loaded = loadStats(storage);
    expect(loaded.modules.listening).toEqual({ answered: 1, correct: 1 });
    expect(loaded.units.unit2.listening).toEqual({ answered: 1, correct: 1 });
  });
});
