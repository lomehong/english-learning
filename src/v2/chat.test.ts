import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderChat, type ChatDeps } from './chat';
import { createRouter } from '../router';
import { V2_CONFIG_STORAGE_KEY } from './config';
import { STORAGE_KEY as WRONGBOOK_STORAGE_KEY } from '../store/wrongbook';
import type { StorageLike } from '../store/progress';
import { loadProgress } from '../store/progress';
import { loadWrongBook } from '../store/wrongbook';
import { loadDaily } from '../store/daily';
import { allWords, getWord } from '../data/words';
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

  it('欢迎卡底部学习报告入口：文案 + href=/report + data-link，点击经 router 站内进入学习报告', () => {
    const storage = memory();
    const root = document.createElement('div');
    document.body.append(root);
    const destroy = createRouter(root, [
      { path: '/', render: (mount) => void (mount.textContent = 'v1 home') },
      { path: '/report', render: (mount) => void (mount.textContent = '学习报告页') },
      { path: '/v2', render: (mount) => renderChat(mount, deps(storage)) },
    ]).destroy;
    try {
      history.pushState(null, '', '/v2');
      window.dispatchEvent(new PopStateEvent('popstate'));

      const welcome = root.querySelector('[data-testid="v2-welcome"]')!;
      const link = root.querySelector('[data-testid="v2-welcome-report"]') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      // 底部一行入口：欢迎卡最后一个子节点
      expect(welcome.lastElementChild).toBe(link);
      expect(link.textContent).toBe('想先看看学习数据？打开学习报告 →');
      expect(link.getAttribute('href')).toBe('/report');
      expect(link.hasAttribute('data-link')).toBe(true);

      // 点击 → router 拦截 data-link → 站内免刷新进入 /report
      link.click();
      expect(location.pathname).toBe('/report');
      expect(root.textContent).toContain('学习报告页');
    } finally {
      destroy();
      root.remove();
      history.pushState(null, '', '/');
    }
  });

  it('欢迎卡隐私说明：一行「所有对话与学习数据仅保存在本机浏览器」（离线 / 远程模式均在）', () => {
    env = setup();
    const welcome = env.root.querySelector('[data-testid="v2-welcome"]')!;
    const privacy = welcome.querySelector('[data-testid="v2-welcome-privacy"]') as HTMLElement | null;
    expect(privacy).toBeTruthy();
    expect(privacy!.tagName).toBe('P');
    expect(privacy!.textContent).toBe('所有对话与学习数据仅保存在本机浏览器');
    // 位于学习报告入口之前（报告入口仍是欢迎卡最后一个子节点）
    expect(privacy!.nextElementSibling?.getAttribute('data-testid')).toBe('v2-welcome-report');

    // 配置 Key 切到远程模式后，syncWelcome 重建欢迎卡，隐私说明仍在
    const toggle = env.root.querySelector('[data-testid="v2-config-toggle"]') as HTMLButtonElement;
    toggle.click();
    const key = env.root.querySelector('[data-testid="v2-config-key"]') as HTMLInputElement;
    key.value = 'sk-live-key';
    (env.root.querySelector('[data-testid="v2-config-save"]') as HTMLButtonElement).click();
    expect(env.root.querySelector('[data-testid="v2-welcome"]')!.textContent).toContain('已连接模型');
    const privacyRemote = env.root.querySelector('[data-testid="v2-welcome-privacy"]')!;
    expect(privacyRemote.textContent).toBe('所有对话与学习数据仅保存在本机浏览器');
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

  it('T2 验收链路：「今天学什么」→ 助手占位回复（计划正文 + 进度 + 首组词汇卡），全程无异常', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    input.value = '今天学什么';
    send.click();

    await waitFor(() => env!.root.querySelector('.v2-msg--assistant .v2-card__word-en') !== null);
    // 无 key 占位回复：离线剧本给出今日计划（正文含目标与先攻计划）
    const body = env.root.querySelector('.v2-msg--assistant .v2-msg__body')!;
    expect(body.textContent).toContain('今日目标');
    expect(body.textContent).toContain('今天的计划');
    // 计划进度组件（今日完成度，进度环）与首组词汇卡渲染
    const ring = env.root.querySelector('.v2-msg--assistant [data-testid="v2-progress-ring"]')!;
    expect(ring.getAttribute('aria-valuenow')).toBe('0');
    expect(env.root.querySelector('.v2-msg--assistant .v2-card__word-en')!.textContent).toMatch(/^[a-zA-Z]+$/);
    // 正文无围栏 JSON 原文
    expect(body.textContent).not.toContain('```');
  });

  it('预置错题（seedLocalStorage）→「复习错题」→ 工具调用状态行 + 错题结果卡', async () => {
    env = setup({
      [WRONGBOOK_STORAGE_KEY]: JSON.stringify({
        version: 1,
        entries: {
          'w:demo-adapt': {
            exerciseId: 'w:demo-adapt',
            module: 'vocab',
            stem: '「适应；改编」对应的单词是？',
            yourAnswer: 'adopt',
            correctAnswer: 'adapt',
            explanation: 'adapt vt. 适应；改编',
            wrongCount: 2,
            lastWrongAt: 1732080000000,
          },
        },
      }),
    });
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    input.value = '复习错题';
    send.click();

    await waitFor(() => env!.root.querySelector('.v2-list--wrong') !== null);
    // 结果卡：错题列表（list wrong 组件）+ 正文回读预置数据
    expect(env.root.querySelector('.v2-msg--assistant .v2-msg__body')!.textContent).toContain('错题本共 1 条');
    expect(env.root.querySelector('.v2-list--wrong')!.textContent).toContain('adapt');
    // 工具调用状态行：离线剧本同样走 tool-start / tool-end（工具调用证据）
    const status = env.root.querySelector('.v2-msg--assistant .v2-msg__status') as HTMLElement;
    expect(status.hidden).toBe(false);
    expect(status.textContent).toContain('✓ query_wrongbook 完成');
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
    // 词卡正面计数（计划卡无 word-en，不混入）；第二组渲染后 > 4
    await waitFor(() => env!.root.querySelectorAll('.v2-card__word-en').length > 4);
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

describe('/v2 学习闭环（T5 验收：计划 → 词汇卡 → 小测 → 错题入本 → 进度更新）', () => {
  let env: ReturnType<typeof setup> | null = null;

  afterEach(() => {
    env?.cleanup();
    env = null;
    history.pushState(null, '', '/');
  });

  /** 依题干从词表解析正确选项（与剧本出题模板互逆，作答可确定性构造） */
  function resolveCorrectOption(stem: string): string | null {
    const byMeaning = /^「(.+)」对应的单词是？$/.exec(stem);
    if (byMeaning) {
      return allWords.find((w) => w.meaning === byMeaning[1])?.word ?? null;
    }
    const byWord = /^(\S+) .* 的意思是？$/.exec(stem);
    if (byWord) return getWord(byWord[1]!)?.meaning ?? null;
    return null;
  }

  it('进度条常驻：挂载即渲染五步闭环（全部待启动）', () => {
    env = setup();
    const loop = env.root.querySelector('[data-testid="v2-loop"]')!;
    expect(loop).toBeTruthy();
    const steps = [...loop.querySelectorAll('.v2-loop__step')];
    expect(steps.map((s) => s.getAttribute('data-loop-step'))).toEqual([
      'plan',
      'cards',
      'quiz',
      'wrongbook',
      'progress',
    ]);
    expect(steps.every((s) => s.getAttribute('data-status') === 'pending')).toBe(true);
    expect((loop.querySelector('[data-testid="v2-loop-done"]') as HTMLElement).hidden).toBe(true);
  });

  it('T5 验收链路：「今天学什么」→ 计划卡与词汇卡依次上屏，进度条同步推进', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    input.value = '今天学什么';
    send.click();

    await waitFor(() => env!.root.querySelector('.v2-msg--assistant .v2-card__word-en') !== null);

    // 计划卡：闭环四步 + 单元徽标（与词卡同屏出现，截图判据）
    const titles = [...env.root.querySelectorAll('.v2-msg--assistant .v2-card__title')].map(
      (n) => n.textContent,
    );
    expect(titles).toContain('今日学习计划');
    const planCard = [...env.root.querySelectorAll('.v2-msg--assistant .v2-card')].find((n) =>
      n.querySelector('.v2-card__title')!.textContent === '今日学习计划',
    )!;
    expect(planCard.textContent).toContain('错题');
    expect(planCard.querySelector('.v2-card__badge')!.textContent).toBe('unit1');

    // 词汇卡：首组 4 词（词卡正面为英文拼写）+ 每词跟读
    const words = [...env.root.querySelectorAll('.v2-msg--assistant .v2-card__word-en')];
    expect(words.length).toBe(4);
    expect(words.every((w) => /^[a-zA-Z]+$/.test(w.textContent!))).toBe(true);
    expect(env.root.querySelectorAll('.v2-msg--assistant .v2-audio').length).toBe(4);

    // 进度条：计划完成、词汇进行（计数 4/总数），其余待启动
    const step = (id: string) =>
      env!.root.querySelector(`.v2-loop__step[data-loop-step="${id}"]`)!;
    expect(step('plan').getAttribute('data-status')).toBe('done');
    expect(step('cards').getAttribute('data-status')).toBe('active');
    expect(step('cards')!.textContent).toMatch(/4\/\d+ 词/);
    expect(step('quiz').getAttribute('data-status')).toBe('pending');
  });

  it('闭环全链路：小测作答 → 错题入本 → 进度更新 → 五步全完成徽标', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    const sendText = async (text: string): Promise<void> => {
      const before = env!.root.querySelectorAll('.v2-msg--assistant').length;
      input.value = text;
      send.click();
      await waitFor(() => env!.root.querySelectorAll('.v2-msg--assistant').length === before + 1);
    };

    await sendText('今天学什么');
    await waitFor(() => env!.root.querySelector('.v2-msg--assistant .v2-card__word-en') !== null);

    // 小测上屏（同一对话内继续）
    await sendText('来一组小测');
    await waitFor(() => env!.root.querySelectorAll('.v2-quiz:not(.v2-quiz--answered)').length > 0);
    const quizzes = [...env.root.querySelectorAll('.v2-quiz')];
    expect(quizzes.length).toBeGreaterThanOrEqual(2);
    expect(env.root.querySelector('.v2-loop__step[data-loop-step="quiz"]')!.getAttribute('data-status')).toBe('active');

    // 逐题作答：第 1 题故意答错（确定性构造），其余答对
    const wrongWords: string[] = [];
    for (let i = 0; i < quizzes.length; i += 1) {
      const quiz = quizzes[i]!;
      const stem = quiz.querySelector('.v2-quiz__stem')!.textContent ?? '';
      const correct = resolveCorrectOption(stem);
      const buttons = [...quiz.querySelectorAll('button.v2-quiz__option')] as HTMLButtonElement[];
      const answerWrong = i === 0 && correct !== null;
      const target = answerWrong
        ? buttons.find((b) => b.querySelector('.v2-quiz__label')!.textContent !== correct)!
        : buttons.find((b) => b.querySelector('.v2-quiz__label')!.textContent === correct)!;
      wrongWords.push(target.querySelector('.v2-quiz__label')!.textContent!);
      target.click();
    }

    // 每题一条作答回执（助手消息流无中断）
    await waitFor(() => env!.root.querySelectorAll('.v2-msg--note').length === quizzes.length);
    const notes = [...env.root.querySelectorAll('.v2-msg--note')].map((n) => n.textContent);
    expect(notes[0]).toMatch(/错题本|已记录/);
    expect(notes.at(-1)).toContain('本轮小测');
    expect(notes.at(-1)).toContain('今日进度已更新');
    expect(notes.at(-1)).toContain('错题已入本');

    // 进度条：五步全部完成 + 完成徽标可见
    for (const id of ['plan', 'cards', 'quiz', 'wrongbook', 'progress']) {
      expect(env.root.querySelector(`.v2-loop__step[data-loop-step="${id}"]`)!.getAttribute('data-status')).toBe('done');
    }
    const doneBadge = env.root.querySelector('[data-testid="v2-loop-done"]') as HTMLElement;
    expect(doneBadge.hidden).toBe(false);
    expect(doneBadge.textContent).toContain('本轮闭环完成');

    // store 侧：答错词入本、四词进 SRS、今日活动记账
    const wrong = loadWrongBook(env.storage);
    const entries = Object.values(wrong.entries);
    expect(entries).toHaveLength(1);
    expect(entries[0]!.module).toBe('vocab');
    expect(wrongWords[0]).toBeTruthy();

    const progress = loadProgress(env.storage);
    expect(Object.keys(progress.cards).length).toBe(quizzes.length);

    const daily = loadDaily(env.storage);
    expect(Object.values(daily.days).some((d) => d.exercises >= quizzes.length)).toBe(true);
  });

  it('错题复盘话术同样推进闭环：wrongbook 步完成', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    input.value = '看看错题本';
    send.click();
    await waitFor(() => env!.root.querySelectorAll('.v2-msg--assistant').length === 1);
    const step = env.root.querySelector('.v2-loop__step[data-loop-step="wrongbook"]')!;
    expect(step.getAttribute('data-status')).toBe('done');
  });
});

describe('/v2 演示消息注入（T3 验收场景：v2_demo_messages）', () => {
  let env: ReturnType<typeof setup> | null = null;

  afterEach(() => {
    env?.cleanup();
    env = null;
    history.pushState(null, '', '/');
  });

  it('验收种子：assistant 消息 dsl 数组渲染词汇卡 + 进度环（60%）', () => {
    env = setup({
      v2_demo_messages: JSON.stringify([
        {
          role: 'assistant',
          dsl: [
            { type: 'card', title: '词汇卡', items: ['apple 苹果'] },
            { type: 'progress', value: 60, label: '今日进度' },
          ],
        },
      ]),
    });
    // 欢迎卡仍在，种子消息按 assistant 气泡渲染在其后
    expect(env.root.querySelector('[data-testid="v2-welcome"]')).toBeTruthy();
    const msg = env.root.querySelector('.v2-msg--assistant')!;
    const card = msg.querySelector('.v2-card')!;
    expect(card.getAttribute('data-comp-type')).toBe('card');
    expect(card.textContent).toContain('词汇卡');
    expect(card.textContent).toContain('apple 苹果');
    const ring = msg.querySelector('[data-testid="v2-progress-ring"]')!;
    expect(ring.getAttribute('aria-valuenow')).toBe('60');
    expect(msg.querySelector('[data-testid="v2-progress-ring-value"]')!.textContent).toBe('60%');
    expect(msg.textContent).toContain('今日进度');
  });

  it('非法 dsl 节点降级占位：坏种子不炸页面，合法节点照常渲染', () => {
    env = setup({
      v2_demo_messages: JSON.stringify([
        {
          role: 'assistant',
          content: '演示一条混合消息',
          dsl: [
            { type: 'card', title: '词汇卡', items: ['apple 苹果'] },
            { type: 'script', code: 'alert(1)' }, // 白名单外
            'not-even-an-object', // 形状非法
            { type: 'progress' }, // 缺 value
          ],
        },
        { role: 'system', content: 'role 非法整条丢弃' },
      ]),
    });
    const msgs = env.root.querySelectorAll('.v2-msg--assistant');
    expect(msgs).toHaveLength(1); // system 条目被丢弃
    const body = msgs[0]!.querySelector('.v2-msg__body')!;
    expect(body.textContent).toContain('演示一条混合消息');
    // 合法节点 + 3 个降级占位，全部出现在组件渲染区
    expect(msgs[0]!.querySelectorAll('.v2-comp')).toHaveLength(4);
    expect(msgs[0]!.querySelectorAll('.v2-comp--invalid')).toHaveLength(3);
    expect(msgs[0]!.querySelectorAll('.v2-card__items li')[0]!.textContent).toBe('apple 苹果');
    expect(env.root.querySelector('[data-testid="v2-root"]')).toBeTruthy(); // 页面未被破坏
  });

  it('无种子 / 坏 JSON 种子：不产生任何消息，行为与 T1 壳层一致', () => {
    env = setup({ v2_demo_messages: '{ broken' });
    expect(env.root.querySelectorAll('.v2-msg')).toHaveLength(0);
    expect(env.root.querySelector('[data-testid="v2-welcome"]')).toBeTruthy();
  });
});

describe('/v2 工具调用结果卡（T4 验收：预置 v1_wrongbook →「复习错题」）', () => {
  let env: ReturnType<typeof setup> | null = null;

  afterEach(() => {
    env?.cleanup();
    env = null;
    history.pushState(null, '', '/');
  });

  it('验收链路：旧键预置错题 → 发送「复习错题」→ query_wrongbook 结果卡常驻可见', async () => {
    // 与工单 evidence.preview.seedLocalStorage 完全一致：键 v1_wrongbook + 简版数组
    env = setup({
      v1_wrongbook: JSON.stringify([{ id: 'demo-1', question: 'apple 的中文', answer: '苹果', wrongCount: 1 }]),
    });
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    input.value = '复习错题';
    send.click();

    // 终态条件：错题列表组件上屏（回复渲染完成；结果卡先于此就位）
    await waitFor(() => env!.root.querySelector('.v2-list--wrong') !== null);
    const card = env.root.querySelector('.v2-msg--assistant [data-tool-name="query_wrongbook"]')!;
    expect(card.getAttribute('data-testid')).toBe('v2-toolcard');
    // 结果摘要：预置数据上卡（总数 + 题干 → 正确答案）
    expect(card.textContent).toContain('错题共 1 条');
    expect(card.textContent).toContain('apple 的中文 → 苹果（错 1 次）');
    // 正文与错题列表组件同样回读预置数据（同一数据源）
    expect(env.root.querySelector('.v2-msg--assistant .v2-msg__body')!.textContent).toContain('错题本共 1 条');
    expect(env.root.querySelector('.v2-list--wrong')!.textContent).toContain('apple 的中文');
    // 卡片常驻且先于正文（工具调用发生在回答之前）
    const main = env.root.querySelector('.v2-msg--assistant .v2-msg__main')!;
    expect(main.firstElementChild!.querySelector('[data-testid="v2-toolcard"]')).toBeTruthy();
  });

  it('学习计划链路同样出卡：get_learning_state 与 query_vocab 各一张结果卡', async () => {
    env = setup();
    const input = env.root.querySelector('[data-testid="v2-input"]') as HTMLTextAreaElement;
    const send = env.root.querySelector('[data-testid="v2-send"]') as HTMLButtonElement;
    input.value = '开始今天的学习';
    send.click();

    await waitFor(() => env!.root.querySelectorAll('.v2-msg--assistant .v2-toolcard--ok').length >= 2);
    const names = [...env.root.querySelectorAll('.v2-msg--assistant [data-tool-name]')].map((n) =>
      n.getAttribute('data-tool-name'),
    );
    expect(names).toContain('get_learning_state');
    expect(names).toContain('query_vocab');
    // 状态卡内容与工具结果一致（词表命中摘要非空）
    const stateCard = env.root.querySelector('[data-tool-name="get_learning_state"]')!;
    expect(stateCard.textContent).toMatch(/已学词汇 \d+ \/ \d+/);
  });
});
