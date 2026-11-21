import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEMO_MESSAGES_KEY, parseDemoMessages, loadDemoMessages } from './seed';
import type { StorageLike } from '../store/progress';

const projectRoot = process.cwd();

function memory(initial: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => void store.set(k, v),
  };
}

/** 读取即抛的坏 storage（隐私模式 / 配额等极端场景） */
function explodingStorage(): StorageLike {
  return {
    getItem: () => {
      throw new Error('quota exceeded');
    },
    setItem: () => {
      throw new Error('quota exceeded');
    },
  };
}

describe('演示消息种子（T3）：v2_demo_messages 解析', () => {
  it('验收形状：[{role:assistant, dsl:[card+progress]}] 原样保留', () => {
    const seed = [
      { role: 'assistant', dsl: [{ type: 'card', title: '词汇卡', items: ['apple 苹果'] }] },
      { role: 'assistant', dsl: [{ type: 'progress', value: 60, label: '今日进度' }] },
    ];
    const out = parseDemoMessages(seed);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ role: 'assistant', content: '', dsl: seed[0]!.dsl });
    expect(out[1]!.dsl[0]).toMatchObject({ type: 'progress', value: 60 });
  });

  it('content / role / 混合消息归一化：缺 content 补空串，dsl 缺省空数组', () => {
    const out = parseDemoMessages([
      { role: 'user', content: '你好' },
      { role: 'assistant', content: '回复', dsl: [{ type: 'timer', seconds: 30 }] },
    ]);
    expect(out[0]).toEqual({ role: 'user', content: '你好', dsl: [] });
    expect(out[1]!.dsl).toEqual([{ type: 'timer', seconds: 30 }]);
  });

  it('非法条目静默丢弃：非对象 / 未知 role / 双空 / 顶层非数组', () => {
    expect(parseDemoMessages('nope')).toEqual([]);
    expect(parseDemoMessages(null)).toEqual([]);
    expect(
      parseDemoMessages([
        'plain string',
        42,
        null,
        { role: 'system', content: '系统注入尝试' },
        { role: 'assistant' }, // 无 content 且无 dsl
        { role: 'assistant', content: '   ' }, // 纯空白正文也视为空
        { role: 'assistant', dsl: [] }, // 空 dsl 也视为空
        { role: 'user', content: '有效的' },
      ]),
    ).toEqual([{ role: 'user', content: '有效的', dsl: [] }]);
  });

  it('上限收敛：消息 ≤50 条，单条 dsl ≤20 节点', () => {
    const many = Array.from({ length: 80 }, (_, i) => ({ role: 'assistant' as const, content: `m${i}` }));
    expect(parseDemoMessages(many)).toHaveLength(50);
    const nodes = Array.from({ length: 30 }, () => ({ type: 'card', title: 'x' }));
    const out = parseDemoMessages([{ role: 'assistant', dsl: nodes }]);
    expect(out[0]!.dsl).toHaveLength(20);
  });

  it('loadDemoMessages：storage JSON 读取 / 坏 JSON / 缺键 / 抛异常全兜底', () => {
    const storage = memory({
      [DEMO_MESSAGES_KEY]: JSON.stringify([{ role: 'assistant', dsl: [{ type: 'progress', value: 60 }] }]),
    });
    expect(loadDemoMessages(storage)).toEqual([
      { role: 'assistant', content: '', dsl: [{ type: 'progress', value: 60 }] },
    ]);
    expect(loadDemoMessages(memory())).toEqual([]); // 无键
    expect(loadDemoMessages(memory({ [DEMO_MESSAGES_KEY]: '{ broken json' }))).toEqual([]); // 坏 JSON
    expect(loadDemoMessages(memory({ [DEMO_MESSAGES_KEY]: '   ' }))).toEqual([]); // 空白
    expect(loadDemoMessages(explodingStorage())).toEqual([]); // storage 抛异常
  });

  it('源码守卫：种子通道与壳层一样不使用 innerHTML / eval', () => {
    const source = readFileSync(join(projectRoot, 'src/v2/seed.ts'), 'utf8');
    expect(source).not.toMatch(/\.innerHTML/);
    expect(source).not.toMatch(/\beval\s*\(/);
    expect(source).not.toMatch(/\bnew\s+Function\s*\(/);
  });
});
