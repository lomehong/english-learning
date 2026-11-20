import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderChat, type ChatDeps } from './chat';
import { createRouter } from '../router';
import { V2_CONFIG_STORAGE_KEY } from './config';
import type { StorageLike } from '../store/progress';
import { loadProgress } from '../store/progress';
import { loadWrongBook } from '../store/wrongbook';
import type { Agent, ChatMessage } from './types';

function memory(initial: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => void store.set(k, v),
  };
}

const NO_DELAY = async () => {};
const NO_SPEECH = () => null;

function deps(storage: StorageLike, extra: Partial<ChatDeps> = {}): ChatDeps {
  return { storage, delay: NO_DELAY, createSpeech: NO_SPEECH, ...extra };
}

/** 等待条件成立（短轮询；上限 1s） */
async function waitFor(cond: () => boolean, timeoutMs = 1000): Promise<void> {
  const start = Date.now();
  while (!cond()) {
    if (Date.now() - start > timeoutMs) throw new Error('waitFor 超时');
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

function setup(initial: Record<string, string> = {}) {
  const storage = memory(initial);
  const root = document.createElement('div');
  document.body.append(root);
  const cleanup = renderChat(root, deps(storage));
  return {
    root,
    storage,
    cleanup: () => {
      cleanup?.();
      root.remove();
    },
  };
}

describe('/v2 对话壳（T1）', () => {
  let env: ReturnType<typeof setup> | null = null;

  afterEach(() => {
    env?.cleanup();
    env = null;
    history.pushState(null, '', '/');
  });

  it('壳层骨架：消息流 / 输入框 / 发送键 / 快捷指令 / 组件渲染区（欢迎卡即占位）', () => {
    env = setup();
    expect(env.root.querySelector('[data-testid="v2-stream"]')).toBeTruthy();
    expect(env.root.querySelector('[data-testid="v2-input"]')).toBeTruthy();
    expect(env.root.querySelector('[data-testid="v2-send"]')).toBeTruthy();
    expect(env.root.querySelector('[data-testid="v2-config"]')).toBeTruthy();
    expect(env.root.querySelectorAll('.v2-chips [data-testid^="v2-chip-"]')).toHaveLength(4);
    // 欢迎卡 = 组件渲染区占位（无 key 降级文案）
    expect(env.root.querySelector('[data-testid="v2-welcome"]')!.textContent).toContain('离线陪学');
    expect(env.root.querySelector('[data-testid="v2-mode"]')!.textContent).toContain('离线陪学模式');
  });

  it('无 key 降级：输入消息 → 离线剧本流式回复（正文 + 组件渲染区）', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    input.value = '开始今天的学习';
    send.click();

    await waitFor(() => env!.root.querySelectorAll('.v2-msg--user').length === 1);
    await waitFor(() => env!.root.querySelectorAll('.v2-msg--assistant .v2-comp').length > 0);

    const userBubble = env.root.querySelector('.v2-msg--user .v2-msg__body')!;
    expect(userBubble.textContent).toContain('开始今天的学习');
    const assistant = env.root.querySelector('.v2-msg--assistant .v2-msg__main')!;
    expect(assistant.textContent).toContain('今日目标');
    // 组件渲染区：progress + 词卡 + 跟读 + 计时器
    const types = [...env.root.querySelectorAll('.v2-msg--assistant [data-comp-type]')].map((n) =>
      n.getAttribute('data-comp-type'),
    );
    expect(types).toContain('progress');
    expect(types).toContain('card');
    expect(types).toContain('timer');
    // 正文不含围栏 JSON 原文（流式遮蔽 + 最终提取均生效）
    expect(env.root.querySelector('.v2-msg--assistant .v2-msg__body')!.textContent).not.toContain('```');
  });

  it('小测交互闭环（壳层 → 剧本 → store）：点选项 → 记账 → 反馈气泡', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    input.value = '来一组小测';
    send.click();
    await waitFor(() => env!.root.querySelectorAll('.v2-quiz').length > 0);

    const firstQuiz = env.root.querySelector('.v2-quiz')!;
    const options = [...firstQuiz.querySelectorAll('button.v2-quiz__option')] as HTMLButtonElement[];
    expect(firstQuiz.getAttribute('data-quiz-id')).toMatch(/^v2q:/);
    options[0]!.click(); // 无论对错，都应完成记账
    const correct = options[0]!.classList.contains('v2-quiz__option--correct');
    expect(options.every((o) => o.disabled)).toBe(true);

    await waitFor(() => env!.root.querySelectorAll('.v2-msg--note').length === 1);
    expect(env.root.querySelector('.v2-msg--note')!.textContent).toMatch(/已记录|还剩/);

    // store 侧：作答已记账（SRS 卡片生成；答错则同时入错题本）
    const progress = loadProgress(env.storage);
    expect(Object.keys(progress.cards).length).toBeGreaterThanOrEqual(1);
    if (!correct) {
      const wrong = loadWrongBook(env.storage);
      expect(Object.keys(wrong.entries).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('配置面板：展开回显 → 保存持久化 + 模式徽标切换；清空回离线', () => {
    env = setup();
    const toggle = env.root.querySelector('[data-testid="v2-config-toggle"]') as HTMLButtonElement;
    const panel = env.root.querySelector('[data-testid="v2-config"]') as HTMLElement;
    expect(panel.hidden).toBe(true);

    toggle.click();
    expect(panel.hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    const baseUrl = env.root.querySelector('[data-testid="v2-config-baseurl"]') as HTMLInputElement;
    const key = env.root.querySelector('[data-testid="v2-config-key"]') as HTMLInputElement;
    const model = env.root.querySelector('[data-testid="v2-config-model"]') as HTMLInputElement;
    baseUrl.value = 'https://llm.example/v1';
    key.value = 'sk-live-key';
    model.value = 'my-model';

    (env.root.querySelector('[data-testid="v2-config-save"]') as HTMLButtonElement).click();
    const saved = JSON.parse(env.storage.getItem(V2_CONFIG_STORAGE_KEY)!) as Record<string, string>;
    expect(saved).toMatchObject({ baseUrl: 'https://llm.example/v1', apiKey: 'sk-live-key', model: 'my-model' });
    expect(env.root.querySelector('[data-testid="v2-mode"]')!.textContent).toContain('已连接 my-model');
    expect(env.root.querySelector('[data-testid="v2-welcome"]')!.textContent).toContain('已连接模型');

    (env.root.querySelector('[data-testid="v2-config-clear"]') as HTMLButtonElement).click();
    expect(env.root.querySelector('[data-testid="v2-mode"]')!.textContent).toContain('离线陪学模式');
    const cleared = JSON.parse(env.storage.getItem(V2_CONFIG_STORAGE_KEY)!) as { apiKey: string };
    expect(cleared.apiKey).toBe('');
  });

  it('localStorage 预置 Key → 直接进入远程模式徽标', () => {
    env = setup({
      [V2_CONFIG_STORAGE_KEY]: JSON.stringify({
        version: 1,
        baseUrl: 'https://llm.example/v1',
        apiKey: 'sk-seeded',
        model: 'seeded-model',
      }),
    });
    expect(env.root.querySelector('[data-testid="v2-mode"]')!.textContent).toContain('已连接 seeded-model');
  });

  it('剧本阶段跨轮保持：「开始学习」后发「继续」拿到下一组词卡', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    const sendText = async (text: string): Promise<void> => {
      const before = env!.root.querySelectorAll('.v2-msg--user').length;
      input.value = text;
      send.click();
      await waitFor(
        () =>
          env!.root.querySelectorAll('.v2-msg--user').length === before + 1 &&
          env!.root.querySelectorAll('.v2-msg--assistant').length === before + 1,
      );
    };
    await sendText('开始今天的学习');
    await waitFor(() => env!.root.querySelectorAll('.v2-card').length > 0);
    const firstWord = env.root.querySelector('.v2-card__word-en')!.textContent;
    await sendText('继续');
    await waitFor(() => env!.root.querySelectorAll('.v2-card').length > 4);
    // 第二轮出现新词卡（下一组），且历史消息仍在流里
    const words = [...env.root.querySelectorAll('.v2-card__word-en')].map((n) => n.textContent);
    expect(words.length).toBeGreaterThan(4); // 首组 4 词 + 第二组若干
    expect(words.slice(4)).not.toContain(firstWord);
  });

  it('远程 Agent 失败 → 自动降级离线剧本补答（永远有回复）', async () => {
    const storage = memory({
      [V2_CONFIG_STORAGE_KEY]: JSON.stringify({
        version: 1,
        baseUrl: 'https://llm.example/v1',
        apiKey: 'sk-x',
        model: 'm',
      }),
    });
    const failing: Agent = {
      label: 'm',
      offline: false,
      run: async (_history, emit) => {
        emit({ type: 'error', message: '连接超时' });
        return null;
      },
    };
    const root = document.createElement('div');
    document.body.append(root);
    const cleanup = renderChat(root, deps(storage, { createRemote: () => failing }));
    env = {
      root,
      storage,
      cleanup: () => {
        cleanup?.();
        root.remove();
      },
    };

    const input = root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    input.value = '看看错题本';
    (root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement).click();

    await waitFor(() => root.querySelector('.v2-msg--note') !== null);
    const streamText = root.querySelector('.v2-stream')!.textContent!;
    expect(streamText).toContain('远程模型不可用');
    expect(streamText).toContain('错题本是空的');
  });

  it('远程 Agent 工具状态行：tool-start / tool-end 展示', async () => {
    const storage = memory({
      [V2_CONFIG_STORAGE_KEY]: JSON.stringify({
        version: 1,
        baseUrl: 'https://x/v1',
        apiKey: 'sk-y',
        model: 'mm',
      }),
    });
    const calls: ChatMessage[] = [];
    const remote: Agent = {
      label: 'mm',
      offline: false,
      run: async (history, emit) => {
        calls.push(...history);
        emit({ type: 'tool-start', name: 'get_learning_state', args: {} });
        emit({ type: 'tool-end', name: 'get_learning_state', ok: true, result: {} });
        emit({ type: 'text-delta', text: '你看，状态已拿到。' });
        emit({ type: 'done' });
        return { role: 'assistant', content: '你看，状态已拿到。' };
      },
    };
    const root = document.createElement('div');
    document.body.append(root);
    const cleanup = renderChat(root, deps(storage, { createRemote: () => remote }));
    env = {
      root,
      storage,
      cleanup: () => {
        cleanup?.();
        root.remove();
      },
    };

    const input = root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    input.value = '我现在学得怎么样';
    (root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement).click();
    await waitFor(() => root.textContent!.includes('你看，状态已拿到。'));
    expect(root.textContent).toContain('✓ get_learning_state 完成');
    expect(calls.at(-1)!.role).toBe('user');
  });

  it('Enter 发送 / Shift+Enter 换行不发送', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    input.value = '看看错题本';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true, cancelable: true }),
    );
    expect(env.root.querySelectorAll('.v2-msg--user')).toHaveLength(0);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await waitFor(() => env!.root.querySelectorAll('.v2-msg--user').length === 1);
  });

  it('路由接线：/v2 挂载对话壳（与 v1 路由表同构），离开时执行清理', () => {
    const storage = memory();
    const root = document.createElement('div');
    document.body.append(root);
    const destroy = createRouter(root, [
      { path: '/', render: (mount) => void (mount.textContent = 'v1 home') },
      { path: '/v2', render: (mount) => renderChat(mount, deps(storage)) },
    ]).destroy;
    try {
      history.pushState(null, '', '/v2');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(root.querySelector('[data-testid="v2-root"]')).toBeTruthy();
      history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(root.querySelector('[data-testid="v2-root"]')).toBeNull();
    } finally {
      destroy();
      root.remove();
      history.pushState(null, '', '/');
    }
  });

  it('main.ts 接线守卫：/v2 路由已注册 + v2 样式已引入 + 壳层不依赖 v1 页面', () => {
    const main = readFileSync(join(process.cwd(), 'src/main.ts'), 'utf8');
    expect(main).toContain(`{ path: '/v2', render: renderChat }`);
    expect(main).toContain(`./styles/v2.css`);
    const chatSource = readFileSync(join(process.cwd(), 'src/v2/chat.ts'), 'utf8');
    expect(chatSource).not.toMatch(/from '\.\.\/pages\//);
    expect(chatSource).not.toMatch(/\.innerHTML/); // 壳层同样禁用 innerHTML（注释不算）
    expect(chatSource).not.toMatch(/\beval\s*\(/);
  });
});
