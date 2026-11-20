/**
 * tool calling 框架（T2）：注册表 + 参数校验 + 执行分发。
 *
 * - 注册表：name → { schema, handler }；schema 是 OpenAI function 定义
 *   （随请求发给模型），handler 收已解析的参数对象返回 JSON 可序列化结果；
 * - 参数校验：先 JSON 解析、再按 schema 轻量校验（required / type / enum），
 *   任何一步失败都不抛出——把错误说明作为工具结果返回，由 runtime.ts
 *   以 role:'tool' 消息回喂模型，让模型自行修正后重试；
 * - MAX_TOOL_ROUNDS：工具循环轮数上限（防失控），runtime.ts 编排时消费。
 */

import type { ToolDef, ToolCall } from '../types';
import { V2_TOOL_DEFS, executeTool, type ToolContext } from '../tools';

export type { ToolContext };

/** 工具循环轮数上限（一轮 = 一次模型请求 + 其全部工具执行） */
export const MAX_TOOL_ROUNDS = 6;

/** 注册表条目：模型可见的 schema + 本地执行器 */
export interface ToolEntry {
  schema: ToolDef;
  handler: (args: unknown, ctx: ToolContext) => unknown;
}

export interface ToolRegistry {
  /** 注册工具；重名抛错（防静默覆盖串味） */
  register(entry: ToolEntry): void;
  get(name: string): ToolEntry | undefined;
  /** 发给模型的工具清单（保持注册顺序） */
  defs(): ToolDef[];
  names(): string[];
}

export function createToolRegistry(entries: readonly ToolEntry[] = []): ToolRegistry {
  const map = new Map<string, ToolEntry>();
  const registry: ToolRegistry = {
    register(entry) {
      const name = entry.schema.function.name;
      if (map.has(name)) throw new Error(`工具 ${name} 已注册`);
      map.set(name, entry);
    },
    get(name) {
      return map.get(name);
    },
    defs() {
      return [...map.values()].map((e) => e.schema);
    },
    names() {
      return [...map.keys()];
    },
  };
  for (const entry of entries) registry.register(entry);
  return registry;
}

/* -------------------- 参数校验 -------------------- */

function typeOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * 轻量 JSON Schema 校验（覆盖本项目 schema 用到的子集：顶层 object +
 * 一层 properties 的 type / enum / required）。返回可读错误列表；空 = 通过。
 */
export function validateToolArgs(parameters: Record<string, unknown>, args: unknown): string[] {
  const errors: string[] = [];
  if (typeOf(args) !== 'object') {
    return [`参数应为 JSON 对象，实际是 ${typeOf(args)}`];
  }
  const obj = args as Record<string, unknown>;
  const required = Array.isArray(parameters.required) ? (parameters.required as unknown[]) : [];
  for (const key of required) {
    if (typeof key === 'string' && !(key in obj)) errors.push(`缺少必填参数 ${key}`);
  }
  const props = (parameters.properties ?? {}) as Record<string, Record<string, unknown>>;
  for (const [key, rule] of Object.entries(props)) {
    if (!(key in obj)) continue;
    const value = obj[key];
    if (value === undefined || value === null) continue; // null/undefined 可选字段放行
    if (typeof rule.type === 'string' && rule.type !== typeOf(value)) {
      errors.push(`参数 ${key} 应为 ${rule.type}，实际是 ${typeOf(value)}`);
      continue;
    }
    if (Array.isArray(rule.enum) && !rule.enum.some((v) => v === value)) {
      errors.push(`参数 ${key} 应为 ${rule.enum.join(' / ')} 之一`);
    }
  }
  return errors;
}

/* -------------------- 工具调用执行 -------------------- */

export interface ToolCallOutcome {
  ok: boolean;
  /** 工具结果（失败时为错误说明对象；由 runtime.ts 序列化进 tool 消息回喂模型） */
  result: unknown;
}

/**
 * 执行一次工具调用：JSON 解析 → schema 校验 → handler。
 * 所有失败（含未知工具 / 坏 JSON / 校验不过 / 执行异常）都走 ok:false +
 * 错误说明结果——错误信息回喂模型，而不是中断对话。
 */
export function runToolCall(registry: ToolRegistry, call: ToolCall, ctx: ToolContext): ToolCallOutcome {
  const name = call.function.name;
  const entry = registry.get(name);
  if (entry === undefined) {
    return {
      ok: false,
      result: {
        error: 'unknown_tool',
        message: `未知工具 ${name}；可用工具：${registry.names().join(' / ')}`,
      },
    };
  }

  const raw = call.function.arguments;
  let args: unknown;
  if (raw.trim() === '') {
    args = {};
  } else {
    try {
      args = JSON.parse(raw);
    } catch {
      return {
        ok: false,
        result: {
          error: 'invalid_arguments_json',
          message: `工具参数不是合法 JSON：${raw.slice(0, 200)}`,
        },
      };
    }
  }

  const errors = validateToolArgs(
    entry.schema.function.parameters as Record<string, unknown>,
    args,
  );
  if (errors.length > 0) {
    return { ok: false, result: { error: 'invalid_arguments', message: `参数校验失败：${errors.join('；')}` } };
  }

  try {
    return { ok: true, result: entry.handler(args, ctx) };
  } catch (error) {
    return {
      ok: false,
      result: { error: 'tool_failed', message: error instanceof Error ? error.message : String(error) },
    };
  }
}

/* -------------------- 默认注册表（v2 数据工具） -------------------- */

/**
 * v2 默认工具注册表：get_learning_state / query_vocab / query_wrongbook /
 * record_answer（schema 来自 V2_TOOL_DEFS，执行走 executeTool 落真实 store）。
 */
export function createDefaultToolRegistry(ctx: ToolContext): ToolRegistry {
  return createToolRegistry(
    V2_TOOL_DEFS.map((schema): ToolEntry => {
      const name = schema.function.name;
      return { schema, handler: (args) => executeTool(name, args, ctx) };
    }),
  );
}
