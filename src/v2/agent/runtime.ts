/**
 * Agent 运行时（T2）：OpenAI 兼容 chat completions 客户端。
 *
 * - 流式回复：SSE 增量解析，text-delta 逐段推给壳层；
 * - tool calling 框架：assistant 轮携带 tool_calls 时，逐个执行工具、
 *   以 role:'tool' 消息回填结果，再发起下一轮，直到模型给出最终文本
 *   或达到最大轮次（防失控循环）；
 * - 接缝：fetchImpl 可注入（单测 mock）；工具执行器可注入；
 * - 任何网络 / 协议错误都不抛出到壳层，统一走 error 事件 + 返回 null，
 *   壳层据此降级到离线陪学。
 */

import type { Agent, ChatMessage, EmitFn, ToolCall, ToolDef } from '../types';
import type { V2Config } from '../config';
import { chatCompletionsUrl } from '../config';
import { createSSEParser } from './sse';
import { buildTutorSystemPrompt } from './prompt';

/** 默认最大工具循环轮数（一轮 = 一次请求 + 全部工具执行） */
export const MAX_TOOL_ROUNDS = 6;

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export interface RuntimeDeps {
  fetchImpl?: FetchLike;
  /** 工具执行器（name + 已解析参数 → JSON 结果）；缺省抛错由 error 事件兜底 */
  executeTool?: (name: string, args: unknown) => unknown;
  /** 工具清单；缺省不给模型提供工具 */
  tools?: readonly ToolDef[];
  /** 循环轮数上限（测试可调小） */
  maxRounds?: number;
  /** 系统提示词（测试可注入短文案） */
  systemPrompt?: string;
}

/* -------------------- 流式增量累积 -------------------- */

/** 一次 assistant 回复的增量状态：正文 + tool_calls 分片按 index 合并 */
export interface StreamAccumulator {
  content: string;
  toolCalls: ToolCall[];
}

export function createAccumulator(): StreamAccumulator {
  return { content: '', toolCalls: [] };
}

/** 喂入一个 SSE data 载荷（JSON 字符串或 [DONE]）；返回本段正文增量（未推给外部） */
export function feedDelta(acc: StreamAccumulator, payload: string): string {
  if (payload === '[DONE]') return '';
  let delta: {
    choices?: Array<{
      delta?: { content?: string | null; tool_calls?: Array<Record<string, unknown>> };
    }>;
  };
  try {
    delta = JSON.parse(payload);
  } catch {
    return ''; // 心跳 / 半截 JSON：跳过不致命
  }
  const choice = delta.choices?.[0];
  if (!choice?.delta) return '';

  let text = '';
  const content = choice.delta.content;
  if (typeof content === 'string' && content !== '') {
    acc.content += content;
    text = content;
  }

  const calls = choice.delta.tool_calls;
  if (Array.isArray(calls)) {
    for (const raw of calls) {
      const index = typeof raw.index === 'number' ? raw.index : null;
      if (index === null) continue;
      const fn = (raw.function ?? {}) as { name?: unknown; arguments?: unknown };
      const id = typeof raw.id === 'string' ? raw.id : '';
      const namePiece = typeof fn.name === 'string' ? fn.name : '';
      const argsPiece = typeof fn.arguments === 'string' ? fn.arguments : '';
      const existing = acc.toolCalls[index];
      if (existing === undefined) {
        acc.toolCalls[index] = {
          id,
          type: 'function',
          function: { name: namePiece, arguments: argsPiece },
        };
      } else {
        if (id !== '' && existing.id === '') existing.id = id;
        existing.function.name += namePiece;
        existing.function.arguments += argsPiece;
      }
    }
  }
  return text;
}

/* -------------------- 请求 / 读取 -------------------- */

interface ChatRequestBody {
  model: string;
  messages: ChatMessage[];
  stream: true;
  temperature?: number;
}

function wireMessages(system: string, history: ChatMessage[]): ChatMessage[] {
  const out: ChatMessage[] = [{ role: 'system', content: system }];
  for (const m of history) {
    if (m.role === 'tool') {
      out.push({ role: 'tool', content: m.content, tool_call_id: m.tool_call_id, name: m.name });
    } else if (m.role === 'assistant' && m.tool_calls && m.tool_calls.length > 0) {
      out.push({ role: 'assistant', content: m.content, tool_calls: m.tool_calls });
    } else {
      out.push({ role: m.role, content: m.content });
    }
  }
  return out;
}

/** 读流：ReadableStream（浏览器 / Node ≥18 均提供 getReader）逐段解码 */
async function readStreamBody(
  body: ReadableStream<Uint8Array> | null,
  onChunk: (text: string) => void,
): Promise<void> {
  if (!body || typeof body.getReader !== 'function') {
    throw new Error('模型服务返回的 body 不是可读流');
  }
  const reader = body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) onChunk(decoder.decode(value, { stream: true }));
  }
  onChunk(decoder.decode()); // 冲刷
}

/** 单轮请求：POST chat/completions 并把 SSE 事件灌进 accumulator */
async function requestRound(
  config: V2Config,
  messages: ChatMessage[],
  tools: readonly ToolDef[] | undefined,
  fetchImpl: FetchLike,
  acc: StreamAccumulator,
  emit: EmitFn,
): Promise<void> {
  const requestBody: ChatRequestBody & { tools?: unknown } = {
    model: config.model,
    messages,
    stream: true,
  };
  if (tools && tools.length > 0) {
    requestBody.tools = tools;
  }
  const response = await fetchImpl(chatCompletionsUrl(config.baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    let detail = `${response.status}`;
    try {
      const text = await response.text();
      detail = `${response.status} ${text.slice(0, 300)}`;
    } catch {
      /* 保留状态码 */
    }
    throw new Error(`模型服务返回错误：${detail}`);
  }
  if (!response.body) throw new Error('模型服务未返回流式 body');

  const parser = createSSEParser();
  await readStreamBody(response.body, (chunk) => {
    for (const payload of parser.push(chunk)) {
      const text = feedDelta(acc, payload);
      if (text !== '') emit({ type: 'text-delta', text });
    }
  });
  for (const payload of parser.flush()) {
    const text = feedDelta(acc, payload);
    if (text !== '') emit({ type: 'text-delta', text });
  }
}

function parseToolArguments(raw: string): unknown {
  if (raw.trim() === '') return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { __parseError: true, raw: raw.slice(0, 200) };
  }
}

/* -------------------- 远程 Agent 组装 -------------------- */

/** 创建 OpenAI 兼容远程 Agent（流式 + tool calling） */
export function createRemoteAgent(config: V2Config, deps: RuntimeDeps = {}): Agent {
  const fetchImpl = deps.fetchImpl ?? ((input, init) => fetch(input, init));
  const execute = deps.executeTool;
  const tools = deps.tools;
  const maxRounds = deps.maxRounds ?? MAX_TOOL_ROUNDS;
  const systemPrompt = deps.systemPrompt ?? buildTutorSystemPrompt();

  return {
    label: config.model,
    offline: false,
    async run(history, emit) {
      const conversation: ChatMessage[] = [...history];
      try {
        for (let round = 0; round < maxRounds; round += 1) {
          const acc = createAccumulator();
          await requestRound(
            config,
            wireMessages(systemPrompt, conversation),
            tools,
            fetchImpl,
            acc,
            emit,
          );

          const calls = acc.toolCalls.filter((c) => c.function.name !== '');
          if (calls.length === 0) {
            emit({ type: 'done' });
            return { role: 'assistant', content: acc.content };
          }

          const assistant: ChatMessage = {
            role: 'assistant',
            content: acc.content,
            tool_calls: calls,
          };
          conversation.push(assistant);

          for (const call of calls) {
            const args = parseToolArguments(call.function.arguments);
            emit({ type: 'tool-start', name: call.function.name, args });
            let result: unknown;
            let ok = true;
            if (execute === undefined) {
              ok = false;
              result = { error: '运行时未注册工具执行器' };
            } else {
              try {
                result = execute(call.function.name, args);
              } catch (error) {
                ok = false;
                result = { error: error instanceof Error ? error.message : String(error) };
              }
            }
            emit({ type: 'tool-end', name: call.function.name, ok, result });
            conversation.push({
              role: 'tool',
              tool_call_id: call.id,
              name: call.function.name,
              content: JSON.stringify(result),
            });
          }
          // 继续下一轮：把工具结果交回模型
        }
        emit({ type: 'error', message: `工具调用超过 ${maxRounds} 轮上限，已停止本轮回复。` });
        return null;
      } catch (error) {
        emit({
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
        return null;
      }
    },
  };
}
