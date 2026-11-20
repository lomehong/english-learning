import { describe, it, expect } from 'vitest';
import {
  createToolRegistry,
  createDefaultToolRegistry,
  validateToolArgs,
  runToolCall,
  MAX_TOOL_ROUNDS,
  type ToolEntry,
} from './tools';
import type { ToolDef, ToolCall } from '../types';
import type { StorageLike } from '../../store/progress';

function memory(initial: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(initial));
  return { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => void store.set(k, v) };
}

const stateSchema: ToolDef = {
  type: 'function',
  function: {
    name: 'get_learning_state',
    description: '学习状态总览',
    parameters: { type: 'object', properties: {}, additionalProperties: false },
  },
};

const recordSchema: ToolDef = {
  type: 'function',
  function: {
    name: 'record_answer',
    description: '作答记账',
    parameters: {
      type: 'object',
      properties: {
        module: { type: 'string', enum: ['vocab', 'grammar', 'reading', 'listening'] },
        correct: { type: 'boolean' },
        limit: { type: 'number' },
      },
      required: ['module', 'correct'],
      additionalProperties: false,
    },
  },
};

function call(id: string, name: string, args: string): ToolCall {
  return { id, type: 'function', function: { name, arguments: args } };
}

/* -------------------- 注册表 -------------------- */

describe('工具注册表（T2）', () => {
  it('name → {schema, handler}：注册 / 取出 / defs 顺序 / names', () => {
    const seen: Array<[string, unknown]> = [];
    const entryA: ToolEntry = {
      schema: stateSchema,
      handler: (args) => {
        seen.push(['get_learning_state', args]);
        return { learnedWords: 3 };
      },
    };
    const entryB: ToolEntry = {
      schema: recordSchema,
      handler: () => ({}),
    };
    const registry = createToolRegistry([entryA, entryB]);
    expect(registry.names()).toEqual(['get_learning_state', 'record_answer']);
    expect(registry.defs().map((d) => d.function.name)).toEqual(['get_learning_state', 'record_answer']);
    expect(registry.get('get_learning_state')?.schema).toEqual(stateSchema);
    expect(registry.get('nope')).toBeUndefined();

    const outcome = runToolCall(registry, call('c1', 'get_learning_state', '{}'), {});
    expect(outcome.ok).toBe(true);
    expect(seen).toEqual([['get_learning_state', {}]]);
  });

  it('重名注册抛错（防静默覆盖）', () => {
    const registry = createToolRegistry([{ schema: stateSchema, handler: () => 1 }]);
    expect(() => registry.register({ schema: stateSchema, handler: () => 2 })).toThrow(/已注册/);
  });

  it('默认注册表：v2 四工具齐备，handler 走真实 store（内存接缝）', () => {
    const registry = createDefaultToolRegistry({ storage: memory() });
    expect(registry.names()).toEqual([
      'get_learning_state',
      'query_vocab',
      'query_wrongbook',
      'record_answer',
    ]);
    const outcome = runToolCall(registry, call('c9', 'query_vocab', '{"keyword":"adapt"}'), {
      storage: memory(),
    });
    expect(outcome.ok).toBe(true);
    const result = outcome.result as { items: Array<{ word: string }>; total: number };
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.items[0]!.word.toLowerCase()).toContain('adapt');
  });

  it('循环上限常量 MAX_TOOL_ROUNDS = 6', () => {
    expect(MAX_TOOL_ROUNDS).toBe(6);
  });
});

/* -------------------- 参数校验 -------------------- */

describe('validateToolArgs：轻量 JSON Schema 校验（T2）', () => {
  const params = recordSchema.function.parameters as Record<string, unknown>;

  it('合法参数（含可选字段）通过', () => {
    expect(validateToolArgs(params, { module: 'vocab', correct: true, limit: 5 })).toEqual([]);
  });

  it('非对象 / 缺必填 / 类型不匹配 / enum 越界逐条给出可读错误', () => {
    expect(validateToolArgs(params, 'oops')).toHaveLength(1);
    expect(validateToolArgs(params, { module: 'vocab' })[0]).toContain('correct');
    expect(validateToolArgs(params, { module: 'vocab', correct: 'yes' })[0]).toContain('boolean');
    expect(validateToolArgs(params, { module: 'pe', correct: true })[0]).toContain('module');
    expect(validateToolArgs(params, { module: 'vocab', correct: true, limit: '8' })[0]).toContain('number');
  });
});

/* -------------------- 工具调用执行（错误一律回喂模型） -------------------- */

describe('runToolCall：参数错误回喂（T2）', () => {
  it('坏参数 JSON → ok=false，错误说明作为结果（供 tool 消息回喂模型）', () => {
    const registry = createToolRegistry([{ schema: recordSchema, handler: () => ({}) }]);
    const outcome = runToolCall(registry, call('c1', 'record_answer', '{"module":"voc'), {});
    expect(outcome.ok).toBe(false);
    const result = outcome.result as { error: string; message: string };
    expect(result.error).toBe('invalid_arguments_json');
    expect(result.message).toContain('JSON');
  });

  it('schema 校验失败（缺必填）→ ok=false，错误回喂且不触达 handler', () => {
    let touched = false;
    const registry = createToolRegistry([
      { schema: recordSchema, handler: () => ((touched = true), {}) },
    ]);
    const outcome = runToolCall(registry, call('c2', 'record_answer', '{"module":"vocab"}'), {});
    expect(outcome.ok).toBe(false);
    expect(touched).toBe(false);
    expect((outcome.result as { error: string }).error).toBe('invalid_arguments');
  });

  it('未知工具 → ok=false，提示可用工具清单', () => {
    const registry = createToolRegistry([{ schema: stateSchema, handler: () => ({}) }]);
    const outcome = runToolCall(registry, call('c3', 'no_such_tool', '{}'), {});
    expect(outcome.ok).toBe(false);
    expect((outcome.result as { error: string }).error).toBe('unknown_tool');
    expect((outcome.result as { message: string }).message).toContain('get_learning_state');
  });

  it('handler 抛异常 → ok=false，异常消息回喂', () => {
    const registry = createToolRegistry([
      { schema: stateSchema, handler: () => { throw new Error('boom'); } },
    ]);
    const outcome = runToolCall(registry, call('c4', 'get_learning_state', '{}'), {});
    expect(outcome.ok).toBe(false);
    expect((outcome.result as { message: string }).message).toContain('boom');
  });

  it('空参数串按 {} 容错（无参数工具常见形态）', () => {
    const registry = createToolRegistry([{ schema: stateSchema, handler: (args) => ({ args }) }]);
    const outcome = runToolCall(registry, call('c5', 'get_learning_state', ''), {});
    expect(outcome.ok).toBe(true);
    expect(outcome.result).toEqual({ args: {} });
  });
});
