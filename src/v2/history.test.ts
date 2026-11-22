/**
 * /v2 对话历史本地持久化测试：
 *
 * - 单元（history.ts 纯函数 / storage 接缝）：保存上限（最近 50 条）、
 *   恢复顺序（at 升序）、坏数据降级（坏 JSON / 非法条目 / 超长 / 抛异常）；
 * - 集成（chat.ts 壳层接线）：刷新恢复回放、发送回路落盘、顶栏「清空对话」
 *   二次确认（确认清空回到欢迎卡 / 取消不改动）、不影响模型配置与离线模式。
 */

import { describe, it, expect, afterEach } from 'vitest';
import {
  HISTORY_STORAGE_KEY,
  HISTORY_MAX_MESSAGES,
  HISTORY_MAX_TEXT_CHARS,
  parseHistory,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  type HistoryEntry,
} from './history';
import { renderChat, type ChatDeps } from './chat';
import { V2_CONFIG_STORAGE_KEY } from './config';
import type { StorageLike } from '../store/progress';

function memory(initial: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => void store.set(k, v),
  };
}

/** 读取 / 写入均抛异常的坏 storage（隐私模式 / 配额满等极端场景） */
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

const NO_DELAY = async () => {};
const NO_SPEECH = () => null;

/** 等待条件成立（短轮询；上限 1s） */
async function waitFor(cond: () => boolean, timeoutMs = 1000): Promise<void> {
  const start = Date.now();
  while (!cond()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor 超时');
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

function entry(role: 'user' | 'assistant', text: string, at: number): HistoryEntry {
  return { role, text, at };
}

/** 造 n 条合法历史（user / assistant 交替，时间递增） */
function gen(n: number): HistoryEntry[] {
  return Array.from({ length: n }, (_, i) => entry(i % 2 === 0 ? 'user' : 'assistant', `消息 ${i}`, i + 1));
}

describe('/v2 对话历史持久化：parseHistory 纯函数', () => {
  it('验收形状原样保留：[{role, text, at}] 按时间顺序', () => {
    const seed = [
      { role: 'user', text: '历史问题', at: 1 },
      { role: 'assistant', text: '历史回答', at: 2 },
    ];
    expect(parseHistory(seed)).toEqual(seed);
  });

  it('恢复顺序：乱序 at 排成升序（时间顺序），同刻保持插入顺序', () => {
    const out = parseHistory([
      entry('assistant', '晚到的回答', 30),
      entry('user', '最早的问题', 10),
      entry('user', '中间的追问', 20),
      entry('assistant', '同刻回答', 20),
    ]);
    expect(out.map((m) => m.text)).toEqual(['最早的问题', '中间的追问', '同刻回答', '晚到的回答']);
  });

  it('上限收敛：最多保留最近 50 条（最旧淘汰），仍按时间升序', () => {
    const out = parseHistory(gen(80));
    expect(out).toHaveLength(HISTORY_MAX_MESSAGES);
    expect(out[0]!.text).toBe('消息 30'); // 消息 0..29 被淘汰
    expect(out.at(-1)!.text).toBe('消息 79');
    expect(out.every((m, i) => i === 0 || out[i - 1]!.at <= m.at)).toBe(true);
  });

  it('非法条目安全降级：非对象 / 非法 role / 非字符串 text / 纯空白 text 逐条丢弃', () => {
    expect(parseHistory('nope')).toEqual([]); // 顶层非数组
    expect(parseHistory(null)).toEqual([]);
    expect(parseHistory({ role: 'user' })).toEqual([]);
    expect(
      parseHistory([
        'plain string',
        42,
        null,
        { role: 'system', text: '系统注入尝试', at: 1 },
        { role: 'tool', text: 'tool 轮不持久化', at: 2 },
        { role: 'user', text: 123, at: 3 },
        { role: 'user', text: '   ', at: 4 },
        { role: 'user', text: '有效的', at: 5 },
        { role: 'assistant', text: '缺 at 也保留（回退 0）' },
      ]),
    ).toEqual([
      { role: 'assistant', text: '缺 at 也保留（回退 0）', at: 0 },
      { role: 'user', text: '有效的', at: 5 },
    ]);
  });

  it('超长条目截断降级：单条 text 截到上限，条目不丢不炸', () => {
    const long = 'x'.repeat(HISTORY_MAX_TEXT_CHARS + 5000);
    const out = parseHistory([entry('user', long, 1)]);
    expect(out).toHaveLength(1);
    expect(out[0]!.text).toHaveLength(HISTORY_MAX_TEXT_CHARS);
  });
});

describe('/v2 对话历史持久化：storage 读写接缝', () => {
  it('save → load 往返：键名 english-learning.v2.history.v1，条目形状 {role, text, at}', () => {
    const storage = memory();
    saveChatHistory([entry('user', '问题', 1), entry('assistant', '回答', 2)], storage);
    expect(JSON.parse(storage.getItem(HISTORY_STORAGE_KEY)!)).toEqual([
      { role: 'user', text: '问题', at: 1 },
      { role: 'assistant', text: '回答', at: 2 },
    ]);
    expect(loadChatHistory(storage)).toEqual([
      { role: 'user', text: '问题', at: 1 },
      { role: 'assistant', text: '回答', at: 2 },
    ]);
  });

  it('保存上限：60 条只落盘最近 50 条（最旧淘汰，时间升序）', () => {
    const storage = memory();
    saveChatHistory(gen(60), storage);
    const stored = loadChatHistory(storage);
    expect(stored).toHaveLength(HISTORY_MAX_MESSAGES);
    expect(stored[0]!.text).toBe('消息 10');
    expect(stored.at(-1)!.text).toBe('消息 59');
  });

  it('loadChatHistory 坏数据降级：缺键 / 坏 JSON / 空白 / 顶层非数组 / storage 抛异常 → 空列表', () => {
    expect(loadChatHistory(memory())).toEqual([]);
    expect(loadChatHistory(memory({ [HISTORY_STORAGE_KEY]: '{ broken json' }))).toEqual([]);
    expect(loadChatHistory(memory({ [HISTORY_STORAGE_KEY]: '   ' }))).toEqual([]);
    expect(loadChatHistory(memory({ [HISTORY_STORAGE_KEY]: '"just a string"' }))).toEqual([]);
    expect(loadChatHistory(explodingStorage())).toEqual([]);
  });

  it('save / clear 在抛异常的 storage 上不炸（配额满不影响对话）', () => {
    expect(() => saveChatHistory(gen(3), explodingStorage())).not.toThrow();
    expect(() => clearChatHistory(explodingStorage())).not.toThrow();
  });

  it('clearChatHistory：清空后 load 为空列表，且不触碰其他键（模型配置等）', () => {
    const configRaw = JSON.stringify({ version: 1, baseUrl: 'https://llm.example/v1', apiKey: 'sk-x', model: 'm' });
    const storage = memory({
      [V2_CONFIG_STORAGE_KEY]: configRaw,
      [HISTORY_STORAGE_KEY]: JSON.stringify(gen(3)),
    });
    clearChatHistory(storage);
    expect(loadChatHistory(storage)).toEqual([]);
    expect(storage.getItem(V2_CONFIG_STORAGE_KEY)).toBe(configRaw);
  });
});

describe('/v2 对话历史持久化：壳层接线（chat.ts）', () => {
  let root: HTMLElement | null = null;
  let cleanupFn: (() => void) | null = null;

  afterEach(() => {
    cleanupFn?.();
    cleanupFn = null;
    root?.remove();
    root = null;
  });

  function attach(storage: StorageLike, now?: () => number): void {
    root = document.createElement('div');
    document.body.append(root);
    const deps: ChatDeps = { storage, delay: NO_DELAY, createSpeech: NO_SPEECH };
    if (now) deps.now = now;
    const destroy = renderChat(root, deps);
    cleanupFn = () => destroy?.();
  }

  function type(text: string): void {
    const input = root!.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    input.value = text;
    (root!.querySelector('[data-testid="v2-send"]') as HTMLButtonElement).click();
  }

  const bodies = (): string[] =>
    [...root!.querySelectorAll('.v2-msg')].map((m) => m.querySelector('.v2-msg__body')!.textContent);

  it('刷新恢复：预置历史（evidence 种子形状）→ 按时间顺序回放，欢迎卡让位', () => {
    const storage = memory({
      [HISTORY_STORAGE_KEY]: JSON.stringify([
        { role: 'user', text: '历史问题', at: 1 },
        { role: 'assistant', text: '历史回答', at: 2 },
      ]),
    });
    attach(storage);
    expect(bodies()).toEqual(['历史问题', '历史回答']);
    expect(root!.querySelector('.v2-msg--user .v2-msg__body')!.textContent).toBe('历史问题');
    expect(root!.querySelector('.v2-msg--assistant .v2-msg__body')!.textContent).toBe('历史回答');
    expect((root!.querySelector('[data-testid="v2-welcome"]') as HTMLElement).hidden).toBe(true);
    // 顶栏「清空对话」按钮就位
    expect(root!.querySelector('[data-testid="v2-history-clear"]')).toBeTruthy();
  });

  it('恢复上限：预置 60 条 → 挂载只回放最近 50 条（最旧 10 条淘汰），时间升序', () => {
    const storage = memory({ [HISTORY_STORAGE_KEY]: JSON.stringify(gen(60)) });
    attach(storage);
    const texts = bodies();
    expect(texts).toHaveLength(HISTORY_MAX_MESSAGES);
    expect(texts[0]).toBe('消息 10');
    expect(texts.at(-1)).toBe('消息 59');
  });

  it('恢复的 assistant 围栏正文走同一渲染管线：组件可见、无 ``` 原文', () => {
    const fenced = '看这张卡：\n```component\n{"type":"card","title":"词汇卡","items":["apple 苹果"]}\n```';
    const storage = memory({
      [HISTORY_STORAGE_KEY]: JSON.stringify([{ role: 'assistant', text: fenced, at: 1 }]),
    });
    attach(storage);
    const msg = root!.querySelector('.v2-msg--assistant')!;
    expect(msg.querySelector('.v2-msg__body')!.textContent).toContain('看这张卡');
    expect(msg.querySelector('.v2-msg__body')!.textContent).not.toContain('```');
    const card = msg.querySelector('.v2-card')!;
    expect(card.getAttribute('data-comp-type')).toBe('card');
    expect(card.textContent).toContain('apple 苹果');
  });

  it('发送回路持久化：用户消息发出即落盘，离线助手回复完成后追加（at 时间顺序）', async () => {
    let clock = 1000;
    const storage = memory();
    attach(storage, () => clock);
    clock = 2000;
    type('开始今天的学习');
    await waitFor(() => loadChatHistory(storage).length >= 2);
    const stored = loadChatHistory(storage);
    expect(stored[0]).toMatchObject({ role: 'user', text: '开始今天的学习' });
    expect(stored[0]!.at).toBe(2000);
    expect(stored.at(-1)!.role).toBe('assistant');
    expect(stored.at(-1)!.at).toBeGreaterThanOrEqual(stored[0]!.at);
    // 助手原文（含组件围栏）按原文保存，恢复后可再渲染
    expect(stored.at(-1)!.text).toContain('今日目标');
  });

  it('刷新仍在：卸载 → 同 storage 重新挂载 → 历史完整恢复，且可继续追加对话', async () => {
    const storage = memory();
    attach(storage);
    type('看看错题本');
    await waitFor(() => loadChatHistory(storage).length >= 2);
    const before = loadChatHistory(storage);

    // 模拟刷新：卸载后用同一 storage 重新挂载
    cleanupFn?.();
    cleanupFn = null;
    root!.remove();
    root = null;
    attach(storage);
    const restored = bodies();
    expect(restored).toHaveLength(before.length);
    expect(restored[0]).toBe('看看错题本');
    expect((root!.querySelector('[data-testid="v2-welcome"]') as HTMLElement).hidden).toBe(true);

    // 继续对话：新消息追加在恢复的历史之后
    type('继续');
    await waitFor(() => loadChatHistory(storage).length >= before.length + 2);
    const after = loadChatHistory(storage).map((m) => m.text);
    expect(after.slice(0, before.length)).toEqual(before.map((m) => m.text));
    expect(after).toContain('继续');
  });

  it('清空对话（二次确认）：确认后清空并回到欢迎卡；取消不改动任何数据', async () => {
    const storage = memory({
      [HISTORY_STORAGE_KEY]: JSON.stringify([
        { role: 'user', text: '历史问题', at: 1 },
        { role: 'assistant', text: '历史回答', at: 2 },
      ]),
    });
    attach(storage);
    const clear = root!.querySelector('[data-testid="v2-history-clear"]') as HTMLButtonElement;
    const cancel = root!.querySelector('[data-testid="v2-history-clear-cancel"]') as HTMLButtonElement;

    // 初始：取消按钮隐藏
    expect(cancel.hidden).toBe(true);

    // 第一次点击：仅进入确认态，消息 / storage 均不变
    clear.click();
    expect(clear.textContent).toContain('确认');
    expect(cancel.hidden).toBe(false);
    expect(bodies()).toEqual(['历史问题', '历史回答']);
    expect(loadChatHistory(storage)).toHaveLength(2);

    // 取消：退出确认态，一切保持原样
    cancel.click();
    expect(clear.textContent).toContain('清空对话');
    expect(cancel.hidden).toBe(true);
    expect(bodies()).toEqual(['历史问题', '历史回答']);
    expect(loadChatHistory(storage)).toHaveLength(2);

    // 再次点击 → 确认：storage 清空、消息流清空、回到欢迎卡
    clear.click();
    clear.click();
    expect(loadChatHistory(storage)).toEqual([]);
    expect(root!.querySelectorAll('.v2-msg')).toHaveLength(0);
    expect((root!.querySelector('[data-testid="v2-welcome"]') as HTMLElement).hidden).toBe(false);

    // 清空后可重新开始对话，历史从头计
    type('继续');
    await waitFor(() => loadChatHistory(storage).length >= 2);
    expect(loadChatHistory(storage).map((m) => m.text)[0]).toBe('继续');
  });

  it('清空后重新开始：新对话正常持久化（离线模式不受影响）', async () => {
    const storage = memory({
      [HISTORY_STORAGE_KEY]: JSON.stringify([{ role: 'user', text: '旧问题', at: 1 }]),
    });
    attach(storage);
    const clear = root!.querySelector('[data-testid="v2-history-clear"]') as HTMLButtonElement;
    clear.click();
    clear.click();

    type('看看错题本');
    await waitFor(() => loadChatHistory(storage).length >= 2);
    const stored = loadChatHistory(storage);
    expect(stored.map((m) => m.text)).not.toContain('旧问题');
    expect(stored[0]).toMatchObject({ role: 'user', text: '看看错题本' });
    // 离线模式徽标不受历史持久化影响
    expect(root!.querySelector('[data-testid="v2-mode"]')!.textContent).toContain('离线陪学模式');
  });

  it('不影响模型配置：预置远程 Key + 历史 → 挂载即恢复历史且徽标仍为已连接', () => {
    const storage = memory({
      [V2_CONFIG_STORAGE_KEY]: JSON.stringify({
        version: 1,
        baseUrl: 'https://llm.example/v1',
        apiKey: 'sk-seeded',
        model: 'seeded-model',
      }),
      [HISTORY_STORAGE_KEY]: JSON.stringify([{ role: 'user', text: '历史问题', at: 1 }]),
    });
    attach(storage);
    expect(root!.querySelector('[data-testid="v2-mode"]')!.textContent).toContain('已连接 seeded-model');
    expect(root!.querySelector('.v2-msg--user .v2-msg__body')!.textContent).toBe('历史问题');
  });
});
