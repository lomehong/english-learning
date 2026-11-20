import { describe, it, expect, vi } from 'vitest';
import { createSSEParser } from './sse';
import { createAccumulator, feedDelta, createRemoteAgent, MAX_TOOL_ROUNDS } from './runtime';
import type { FetchLike } from './runtime';
import { createToolRegistry } from './tools';
import type { AgentEvent } from '../types';

/* -------------------- SSE 解析 -------------------- */

describe('SSE 增量解析（T2）', () => {
  it('标准事件流：data 行 → 载荷；[DONE] 原样给出', () => {
    const parser = createSSEParser();
    const out = parser.push('data: {"a":1}\n\ndata: {"a":2}\n\ndata: [DONE]\n\n');
    expect(out).toEqual(['{"a":1}', '{"a":2}', '[DONE]']);
  });

  it('跨 chunk 半行残留：缓冲拼出完整行', () => {
    const parser = createSSEParser();
    expect(parser.push('data: {"a"')).toEqual([]);
    expect(parser.push(':1}')).toEqual([]);
    expect(parser.push('\n')).toEqual(['{"a":1}']);
  });

  it('忽略注释 / 空行 / event 行；CRLF 兼容；flush 冲刷无换行尾巴', () => {
    const parser = createSSEParser();
    const out = parser.push(': keep-alive\r\nevent: x\r\ndata: {"b":1}\r\n\r\ndata: tail');
    expect(out).toEqual(['{"b":1}']);
    expect(parser.flush()).toEqual(['tail']);
    expect(parser.flush()).toEqual([]);
  });
});

/* -------------------- 增量累积 -------------------- */

describe('流式增量累积（T2）', () => {
  it('正文增量拼接；tool_calls 分片按 index 合并（id / 名称 / 参数）', () => {
    const acc = createAccumulator();
    expect(feedDelta(acc, JSON.stringify({ choices: [{ delta: { content: '你' } }] }))).toBe('你');
    expect(feedDelta(acc, JSON.stringify({ choices: [{ delta: { content: '好' } }] }))).toBe('好');
    expect(acc.content).toBe('你好');

    const toolDelta = (index: number, id: string, name: string, args: string): string =>
      JSON.stringify({
        choices: [{ delta: { tool_calls: [{ index, id, function: { name, arguments: args } }] } }],
      });
    feedDelta(acc, toolDelta(0, 'call_1', 'query_', '{"keyword'));
    feedDelta(acc, toolDelta(0, '', 'vocab', '":"adapt"}'));
    feedDelta(acc, toolDelta(1, 'call_2', 'get_learning_state', '{}'));
    expect(acc.toolCalls).toEqual([
      { id: 'call_1', type: 'function', function: { name: 'query_vocab', arguments: '{"keyword":"adapt"}' } },
      { id: 'call_2', type: 'function', function: { name: 'get_learning_state', arguments: '{}' } },
    ]);
  });

  it('[DONE] / 坏 JSON / 无 delta：安全跳过', () => {
    const acc = createAccumulator();
    expect(feedDelta(acc, '[DONE]')).toBe('');
    expect(feedDelta(acc, 'not-json')).toBe('');
    expect(feedDelta(acc, JSON.stringify({ choices: [{ delta: {} }] }))).toBe('');
    expect(acc.content).toBe('');
  });
});

/* -------------------- 远程 Agent（mock fetch + 流式 body） -------------------- */

const CONFIG = { version: 1 as const, baseUrl: 'https://llm.example/v1', apiKey: 'sk-test', model: 'test-model' };

function sseBody(lines: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const line of lines) controller.enqueue(encoder.encode(line));
      controller.close();
    },
  });
}

function chunked(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

function okResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

function contentEvent(text: string): string {
  return `data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`;
}

function toolCallEvent(id: string, name: string, args: string, index = 0): string {
  return `data: ${JSON.stringify({ choices: [{ delta: { tool_calls: [{ index, id, function: { name, arguments: args } }] } }] })}\n\n`;
}

const HISTORY = [{ role: 'user' as const, content: '我现在学得怎么样？' }];

describe('远程 Agent 运行时（T2：OpenAI 兼容 + 流式 + tool calling）', () => {
  it('纯文本流式回复：逐段 text-delta → done → assistant 消息', async () => {
    const fetchMock = vi.fn(async () =>
      okResponse(chunked([contentEvent('你今天'), contentEvent('表现不错'), 'data: [DONE]\n\n'])),
    );
    const fetchImpl = fetchMock as unknown as FetchLike;
    const events: AgentEvent[] = [];
    const agent = createRemoteAgent(CONFIG, { fetchImpl });
    const message = await agent.run(HISTORY, (e) => events.push(e));

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://llm.example/v1/chat/completions',
      expect.objectContaining({ method: 'POST' }),
    );
    const init = (fetchMock.mock.calls[0] as unknown[])[1] as RequestInit;
    const body = JSON.parse(init.body as string) as { model: string; stream: boolean; messages: unknown[] };
    expect(body.model).toBe('test-model');
    expect(body.stream).toBe(true);
    expect((body.messages[0] as { role: string }).role).toBe('system');

    const deltas = events.filter((e) => e.type === 'text-delta').map((e) => (e as { text: string }).text);
    expect(deltas).toEqual(['你今天', '表现不错']);
    expect(events.at(-1)).toEqual({ type: 'done' });
    expect(message).toEqual({ role: 'assistant', content: '你今天表现不错' });
  });

  it('tool calling 循环：执行工具 → tool 消息回填 → 下一轮拿到最终文本', async () => {
    const fetchMock = vi.fn(async () => {
      if (fetchMock.mock.calls.length === 1) {
        return okResponse(sseBody([
          toolCallEvent('call_1', 'get_learning_state', '{}'),
          'data: [DONE]\n\n',
        ]));
      }
      return okResponse(sseBody([contentEvent('你已学 12 词，继续保持！'), 'data: [DONE]\n\n']));
    });
    const fetchImpl = fetchMock as unknown as FetchLike;
    const execute = vi.fn(() => ({ learnedWords: 12, totalWords: 2400 }));
    const events: AgentEvent[] = [];
    const agent = createRemoteAgent(CONFIG, {
      fetchImpl,
      executeTool: execute,
      tools: [
        { type: 'function', function: { name: 'get_learning_state', description: '', parameters: {} } },
      ],
      systemPrompt: 'test',
    });
    const message = await agent.run(HISTORY, (e) => events.push(e));

    expect(execute).toHaveBeenCalledWith('get_learning_state', {});
    // 第二轮请求里应包含 assistant(tool_calls) + tool 结果两条消息
    const secondInit = (fetchMock.mock.calls[1] as unknown[])[1] as RequestInit;
    const secondBody = JSON.parse(secondInit.body as string) as { messages: Array<Record<string, unknown>> };
    const roles = secondBody.messages.map((m) => m.role);
    expect(roles).toEqual(['system', 'user', 'assistant', 'tool']);
    expect(secondBody.messages[3]).toMatchObject({ role: 'tool', tool_call_id: 'call_1', name: 'get_learning_state' });

    expect(events).toContainEqual({ type: 'tool-start', name: 'get_learning_state', args: {} });
    expect(events).toContainEqual({ type: 'tool-end', name: 'get_learning_state', ok: true, result: { learnedWords: 12, totalWords: 2400 } });
    expect(message).toEqual({ role: 'assistant', content: '你已学 12 词，继续保持！' });
  });

  it('工具抛异常 → tool-end ok=false，错误信息作为结果回填；坏参数 JSON 容错', async () => {
    const fetchImpl = vi.fn(async () =>
      okResponse(sseBody([
        toolCallEvent('call_x', 'record_answer', '{"module":"voc'),
        'data: [DONE]\n\n',
      ])),
    ) as unknown as FetchLike;
    const execute = vi.fn(() => {
      throw new Error('boom');
    });
    const events: AgentEvent[] = [];
    const agent = createRemoteAgent(CONFIG, { fetchImpl, executeTool: execute, maxRounds: 1, systemPrompt: 't' });
    // maxRounds=1：工具轮后直接触顶，返回 null + error 事件（不抛出）
    const message = await agent.run(HISTORY, (e) => events.push(e));
    expect(message).toBeNull();
    expect(events.some((e) => e.type === 'tool-end' && !(e as { ok: boolean }).ok)).toBe(true);
    expect(events.at(-1)).toMatchObject({ type: 'error' });
  });

  it('HTTP 非 200：error 事件 + 返回 null（壳层据此降级离线）', async () => {
    const fetchImpl = vi.fn(async () => new Response('{"error":"bad key"}', { status: 401 })) as unknown as FetchLike;
    const events: AgentEvent[] = [];
    const agent = createRemoteAgent(CONFIG, { fetchImpl, systemPrompt: 't' });
    const message = await agent.run(HISTORY, (e) => events.push(e));
    expect(message).toBeNull();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: 'error', message: expect.stringContaining('401') });
  });

  it('网络异常 / 无 body：error 事件不抛出到壳层', async () => {
    const fail = createRemoteAgent(CONFIG, {
      fetchImpl: (async () => {
        throw new TypeError('fetch failed');
      }) as unknown as FetchLike,
      systemPrompt: 't',
    });
    const events: AgentEvent[] = [];
    expect(await fail.run(HISTORY, (e) => events.push(e))).toBeNull();
    expect(events.at(-1)).toMatchObject({ type: 'error', message: 'fetch failed' });

    const noBody = createRemoteAgent(CONFIG, {
      fetchImpl: (async () => new Response(null, { status: 200 })) as unknown as FetchLike,
      systemPrompt: 't',
    });
    const events2: AgentEvent[] = [];
    expect(await noBody.run(HISTORY, (e) => events2.push(e))).toBeNull();
    expect(events2.at(-1)).toMatchObject({ type: 'error' });
  });

  it('默认循环上限 MAX_TOOL_ROUNDS=6，可注入调小防失控', async () => {
    expect(MAX_TOOL_ROUNDS).toBe(6);
    const fetchMock = vi.fn(async () =>
      okResponse(sseBody([toolCallEvent('c', 'get_learning_state', '{}'), 'data: [DONE]\n\n'])),
    );
    const agent = createRemoteAgent(CONFIG, {
      fetchImpl: fetchMock as unknown as FetchLike,
      executeTool: () => ({}),
      maxRounds: 2,
      systemPrompt: 't',
    });
    const events: AgentEvent[] = [];
    expect(await agent.run(HISTORY, (e) => events.push(e))).toBeNull();
    expect(fetchMock.mock.calls).toHaveLength(2);
    expect(events.at(-1)).toMatchObject({ type: 'error', message: expect.stringContaining('上限') });
  });

  it('注册表接缝（registry）：工具清单取自 defs()，执行走 校验→分发，错误回喂模型', async () => {
    const fetchMock = vi.fn(async () =>
      okResponse(sseBody([
        toolCallEvent('call_r', 'record_answer', '{"module":"pe","correct":true}'),
        'data: [DONE]\n\n',
      ])),
    );
    const touched: string[] = [];
    const registry = createToolRegistry([
      {
        schema: {
          type: 'function',
          function: {
            name: 'record_answer',
            description: '作答记账',
            parameters: {
              type: 'object',
              properties: {
                module: { type: 'string', enum: ['vocab', 'grammar', 'reading', 'listening'] },
                correct: { type: 'boolean' },
              },
              required: ['module', 'correct'],
            },
          },
        },
        handler: (args) => {
          touched.push(JSON.stringify(args));
          return { ok: true };
        },
      },
    ]);
    const agent = createRemoteAgent(CONFIG, {
      fetchImpl: fetchMock as unknown as FetchLike,
      registry,
      maxRounds: 2,
      systemPrompt: 't',
    });
    const events: AgentEvent[] = [];
    await agent.run(HISTORY, (e) => events.push(e));

    // 请求体工具清单来自注册表 defs()
    const init = (fetchMock.mock.calls[0] as unknown[])[1] as RequestInit;
    const body = JSON.parse(init.body as string) as { tools: Array<{ function: { name: string } }> };
    expect(body.tools).toHaveLength(1);
    expect(body.tools[0]!.function.name).toBe('record_answer');

    // enum 越界被 schema 校验拦下：handler 不触达，错误对象作为 tool 结果
    expect(touched).toEqual([]);
    const toolEnd = events.find((e) => e.type === 'tool-end') as unknown as {
      ok: boolean;
      result: { error: string; message: string };
    };
    expect(toolEnd.ok).toBe(false);
    expect(toolEnd.result.error).toBe('invalid_arguments');
    expect(toolEnd.result.message).toContain('module');
    // 校验错误以 role:'tool' 消息回喂（下一轮请求可见）
    const secondInit = (fetchMock.mock.calls[1] as unknown[])[1] as RequestInit;
    const secondBody = JSON.parse(secondInit.body as string) as { messages: Array<Record<string, unknown>> };
    expect(secondBody.messages[3]).toMatchObject({ role: 'tool', tool_call_id: 'call_r' });
  });
});
