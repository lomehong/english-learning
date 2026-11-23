/**
 * /v2 对话式学习入口（T1 壳层）：
 *
 * - 消息流（v2-stream）+ 输入框（Enter 发送 / Shift+Enter 换行）+ 快捷指令 chips；
 * - 欢迎卡底部一行「学习报告」入口：href=/report + data-link 站内免刷新跳转；
 * - 欢迎卡隐私说明一行（离线 / 远程模式均在）：所有对话与学习数据仅保存在本机浏览器；
 * - 组件渲染区：assistant 回复中的 ```component 围栏经 DSL 渲染器变成交互组件；
 * - 工具调用结果卡（T4）：远程 function calling 与离线剧本的工具事件
 *   渲染成消息流常驻卡片（工具名 / 入参 / 结果摘要），状态行仅作过渡提示；
 * - 模型配置面板：OpenAI 兼容 baseUrl / apiKey / model 持久化 localStorage；
 *   无 key 自动降级「离线陪学」剧本，页面永远可用；
 * - 对话历史本地持久化（history.ts）：用户 / 助手消息存
 *   english-learning.v2.history.v1，刷新恢复最近 50 条（时间顺序，坏数据
 *   安全降级）；恢复后消息流顶部显示可关闭提示条「已恢复上次对话
 *   （N 条）」，清空对话后随之消失；顶栏「清空对话」二次确认后清空
 *   并回到欢迎卡，取消不改动；
 * - 三档主题：复用全局 <html data-theme> 令牌体系（浅色 / 深色 / 跟随系统）；
 * - 390px 自适应：单列流式布局 + 窄屏断点（styles/v2.css）。
 *
 * 本文件不使用 innerHTML / eval：所有节点 document.createElement + textContent 构造。
 */

import {
  loadV2Config,
  saveV2Config,
  hasRemoteAgent,
  maskApiKey,
  type V2Config,
} from './config';
import { createOfflineTutor, type OfflineTutor } from './agent/offline';
import { createRemoteAgent } from './agent/runtime';
import { createDefaultToolRegistry } from './agent/tools';
import {
  extractComponents,
  renderComponent,
  type RenderContext,
} from './components/dsl';
import { createToolCard, type ToolCard } from './components/toolcard';
import { createLoopTicker } from './components/loopticker';
import { createLoopTracker } from './loop';
import {
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  restoredBannerText,
  type HistoryEntry,
} from './history';
import { loadDemoMessages } from './seed';
import type { Agent, ChatMessage } from './types';
import { createSpeechEngine, type SpeechEngine, type SpeechSynthesisLike, type SpeechSynthesisUtteranceLike } from '../speech/tts';
import type { StorageLike } from '../store/progress';
import { defaultStorage } from '../store/progress';

/* -------------------- 依赖接缝（测试注入） -------------------- */

export interface ChatDeps {
  storage?: StorageLike;
  now?: () => number;
  /** 离线剧本的流式延迟（测试传空函数立即完成） */
  delay?: (ms: number) => Promise<void>;
  /** 朗读引擎工厂（默认浏览器 speechSynthesis；jsdom 传假引擎） */
  createSpeech?: () => SpeechEngine | null;
  /** 远程 Agent 工厂（默认按配置创建 OpenAI 兼容运行时） */
  createRemote?: (config: V2Config) => Agent;
}

function defaultSpeech(): SpeechEngine | null {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const synth = window.speechSynthesis as unknown as SpeechSynthesisLike;
    return createSpeechEngine({
      synth,
      createUtterance: (text) =>
        new SpeechSynthesisUtterance(text) as unknown as SpeechSynthesisUtteranceLike,
    });
  } catch {
    return null;
  }
}

/** 流式期间隐藏未闭合的组件围栏（避免 JSON 原文闪现） */
function maskPartialFence(text: string): string {
  const cleaned = extractComponents(text).cleanText;
  const idx = cleaned.lastIndexOf('```');
  return idx === -1 ? cleaned : cleaned.slice(0, idx);
}

/* -------------------- DOM 小工具 -------------------- */

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function text(tag: keyof HTMLElementTagNameMap, className: string | undefined, content: string): HTMLElement {
  const node = el(tag, className);
  node.textContent = content;
  return node;
}

/* -------------------- 消息渲染 -------------------- */

interface MessageHandle {
  root: HTMLElement;
  /** 工具调用结果卡容器（常驻，置于正文前：工具调用发生在回答之前） */
  tools: HTMLElement;
  body: HTMLElement;
  components: HTMLElement;
  status: HTMLElement;
}

function makeMessage(stream: HTMLElement, role: 'user' | 'assistant' | 'note'): MessageHandle {
  const root = el('div', `v2-msg v2-msg--${role}`);
  const avatar = el('span', 'v2-msg__avatar');
  avatar.textContent = role === 'user' ? '我' : role === 'note' ? '✦' : '师';
  const main = el('div', 'v2-msg__main');
  const tools = el('div', 'v2-msg__tools');
  const body = el('div', 'v2-msg__body');
  body.textContent = '';
  const status = el('div', 'v2-msg__status');
  status.hidden = true;
  const components = el('div', 'v2-msg__components');
  main.append(tools, body, status, components);
  root.append(avatar, main);
  stream.append(root);
  scrollStream(stream);
  return { root, tools, body, components, status };
}

/** 最终渲染一条 assistant/note 文本：正文 + 组件（同一管线，含降级占位） */
function renderFinal(handle: MessageHandle, content: string, ctx: RenderContext): void {
  const { cleanText, specs } = extractComponents(content);
  handle.body.textContent = cleanText;
  handle.components.replaceChildren();
  for (const spec of specs) handle.components.append(renderComponent(spec, ctx));
}

function scrollStream(stream: HTMLElement): void {
  try {
    stream.scrollTop = stream.scrollHeight;
  } catch {
    /* jsdom 无布局，忽略 */
  }
}

/**
 * 终态滚动（T5 界面判据）：回复比可视区高不少时，滚到底部会把
 * 开头的计划卡挤出屏幕（截图只见词汇卡不见计划卡）——改为把组件区
 * 开头对齐到可视区顶部，计划卡与后续词汇卡同屏可见；
 * 短回复 / jsdom（无布局，scrollHeight 恒 0）仍走滚底逻辑。
 */
function scrollFinal(handle: MessageHandle, stream: HTMLElement): void {
  try {
    if (handle.root.scrollHeight > stream.clientHeight + 64) {
      const anchor = handle.components.firstElementChild ?? handle.root;
      if (typeof anchor.scrollIntoView === 'function') {
        anchor.scrollIntoView({ block: 'start', inline: 'nearest' });
        return;
      }
    }
  } catch {
    /* 布局不可用时退回滚底 */
  }
  scrollStream(stream);
}

/* -------------------- 页面 -------------------- */

export function renderChat(root: HTMLElement, deps: ChatDeps = {}): () => void {
  const storage = deps.storage ?? defaultStorage();
  const now = deps.now ?? Date.now;
  const speech = deps.createSpeech ? deps.createSpeech() : defaultSpeech();
  const history: ChatMessage[] = [];
  /** 本地持久化副本（仅 user / assistant 文本轮；saveChatHistory 负责上限收敛） */
  const savedHistory: HistoryEntry[] = [];
  const persistHistory = (): void => saveChatHistory(savedHistory, storage);
  let busy = false;

  /* ---------- 学习闭环（T5）：唯一状态源 + 常驻进度条 ----------
   * 离线剧本直接往这个 tracker 发事件（deps 注入）；
   * 远程模式由壳层从组件渲染与 record_answer 工具结果发同一批事件。 */
  const loop = createLoopTracker(now);
  const loopTicker = createLoopTicker();
  loopTicker.update(loop.get());
  loop.subscribe((snapshot) => loopTicker.update(snapshot));

  /* ---------- 骨架 ---------- */

  const shell = el('div', 'v2');
  shell.setAttribute('data-testid', 'v2-root');

  const topbar = el('header', 'v2-topbar');
  const back = el('a', 'v2-topbar__back');
  back.href = '/';
  back.setAttribute('data-link', '');
  back.textContent = '‹ 返回';
  const title = el('div', 'v2-topbar__title');
  title.append(text('span', 'v2-topbar__name', '对话式陪学'), text('span', 'v2-topbar__sub', 'v2 入口'));
  const modeBadge = el('span', 'v2-mode');
  modeBadge.setAttribute('data-testid', 'v2-mode');
  /* 「清空对话」（本地历史）：二次确认内联在顶栏，取消不改动 */
  const historyActions = el('div', 'v2-topbar__history');
  const clearHistoryBtn = el('button', 'v2-topbar__clear');
  clearHistoryBtn.type = 'button';
  clearHistoryBtn.setAttribute('data-testid', 'v2-history-clear');
  clearHistoryBtn.textContent = '清空对话';
  const clearCancelBtn = el('button', 'v2-topbar__clear-cancel');
  clearCancelBtn.type = 'button';
  clearCancelBtn.setAttribute('data-testid', 'v2-history-clear-cancel');
  clearCancelBtn.textContent = '取消';
  clearCancelBtn.hidden = true;
  historyActions.append(clearHistoryBtn, clearCancelBtn);
  const configToggle = el('button', 'v2-iconbtn');
  configToggle.type = 'button';
  configToggle.setAttribute('data-testid', 'v2-config-toggle');
  configToggle.setAttribute('aria-expanded', 'false');
  configToggle.setAttribute('aria-label', '模型配置面板');
  configToggle.textContent = '⚙';
  topbar.append(back, title, modeBadge, historyActions, configToggle);

  const configPanel = el('section', 'v2-config');
  configPanel.setAttribute('data-testid', 'v2-config');
  configPanel.hidden = true;
  const configGrid = el('div', 'v2-config__grid');

  const baseUrlInput = el('input', 'v2-config__input');
  baseUrlInput.setAttribute('data-testid', 'v2-config-baseurl');
  baseUrlInput.type = 'text';
  baseUrlInput.placeholder = 'https://api.openai.com/v1';
  const baseUrlLabel = el('label', 'v2-config__field');
  baseUrlLabel.append(text('span', undefined, '接口地址（OpenAI 兼容）'), baseUrlInput);

  const apiKeyInput = el('input', 'v2-config__input');
  apiKeyInput.setAttribute('data-testid', 'v2-config-key');
  apiKeyInput.type = 'password';
  apiKeyInput.placeholder = 'sk-…（留空 = 离线陪学）';
  apiKeyInput.autocomplete = 'off';
  const apiKeyLabel = el('label', 'v2-config__field');
  apiKeyLabel.append(text('span', undefined, 'API Key'), apiKeyInput);

  const modelInput = el('input', 'v2-config__input');
  modelInput.setAttribute('data-testid', 'v2-config-model');
  modelInput.type = 'text';
  modelInput.placeholder = 'gpt-4o-mini';
  const modelLabel = el('label', 'v2-config__field');
  modelLabel.append(text('span', undefined, '模型'), modelInput);
  configGrid.append(baseUrlLabel, apiKeyLabel, modelLabel);

  const configActions = el('div', 'v2-config__actions');
  const saveBtn = el('button', 'btn btn--primary btn--sm');
  saveBtn.type = 'button';
  saveBtn.setAttribute('data-testid', 'v2-config-save');
  saveBtn.textContent = '保存并启用';
  const clearBtn = el('button', 'btn btn--ghost btn--sm');
  clearBtn.type = 'button';
  clearBtn.setAttribute('data-testid', 'v2-config-clear');
  clearBtn.textContent = '清空 Key（回到离线陪学）';
  const configHint = el('span', 'v2-config__hint');
  configActions.append(saveBtn, clearBtn, configHint);
  configPanel.append(configGrid, configActions);

  const stream = el('main', 'v2-stream');
  stream.setAttribute('data-testid', 'v2-stream');
  stream.setAttribute('aria-live', 'polite');

  const chips = el('div', 'v2-chips');
  chips.setAttribute('data-testid', 'v2-chips');
  const CHIP_DEFS: Array<{ id: string; label: string; message: string }> = [
    { id: 'v2-chip-start', label: '📅 开始今天的学习', message: '开始今天的学习' },
    { id: 'v2-chip-cards', label: '📖 继续背单词', message: '继续' },
    { id: 'v2-chip-quiz', label: '📝 来一组小测', message: '来一组小测' },
    { id: 'v2-chip-wrong', label: '📕 看看错题本', message: '看看错题本' },
  ];
  for (const chip of CHIP_DEFS) {
    const btn = el('button', 'v2-chip');
    btn.type = 'button';
    btn.setAttribute('data-testid', chip.id);
    btn.textContent = chip.label;
    btn.addEventListener('click', () => {
      if (busy) return;
      input.value = chip.message;
      void submit();
    });
    chips.append(btn);
  }

  const inputbar = el('form', 'v2-inputbar');
  const input = el('textarea', 'v2-inputbar__input');
  input.setAttribute('data-testid', 'v2-input');
  input.rows = 1;
  input.placeholder = '输入消息，Enter 发送（Shift+Enter 换行）';
  input.setAttribute('aria-label', '对话输入框');
  const send = el('button', 'btn btn--primary v2-inputbar__send');
  send.type = 'submit';
  send.setAttribute('data-testid', 'v2-send');
  send.textContent = '发送';
  inputbar.append(input, send);

  shell.append(topbar, configPanel, loopTicker.root, stream, chips, inputbar);
  root.append(shell);

  /* ---------- 渲染上下文（quiz 作答回路） ---------- */

  let offlineTutor: OfflineTutor | null = null;

  const renderCtx: RenderContext = {
    speech: speech
      ? {
          supported: speech.supported,
          play: (id, t, rate) => speech.play(id, t, rate),
          stop: () => speech.stop(),
          get state() {
            return speech.state;
          },
          get currentId() {
            return speech.currentId;
          },
          subscribe: (listener) => speech.subscribe(listener),
        }
      : undefined,
    onQuizAnswer: (info) => {
      if (offlineTutor !== null) {
        const note = offlineTutor.handleQuizAnswer({
          id: info.id,
          correct: info.correct,
          choiceIndex: info.choiceIndex,
          choice: info.choice,
        });
        if (note !== null) {
          const handle = makeMessage(stream, 'note');
          renderFinal(handle, note, renderCtx);
        }
        return;
      }
      // 远程模式：作答同步进对话历史，下一轮模型可见（可调 record_answer 记账）
      history.push({ role: 'user', content: `[quiz 作答] ${info.id} ${info.correct ? '答对' : '答错'}：${info.choice}` });
      loop.dispatch({ type: 'quiz-answered', correct: info.correct });
      const handle = makeMessage(stream, 'note');
      handle.body.textContent = '已把本次作答同步给模型，继续对话即可记账讲解。';
    },
  };

  /* ---------- 欢迎卡 ---------- */

  const welcome = el('div', 'v2-welcome');
  welcome.setAttribute('data-testid', 'v2-welcome');
  const syncWelcome = (config: V2Config): void => {
    welcome.replaceChildren();
    // 底部一行入口：跳转学习报告（站内 data-link，router 拦截免刷新跳转）
    const reportLink = el('a', 'v2-welcome__report');
    reportLink.href = '/report';
    reportLink.setAttribute('data-link', '');
    reportLink.setAttribute('data-testid', 'v2-welcome-report');
    reportLink.textContent = '想先看看学习数据？打开学习报告 →';
    // 隐私说明一行：明确「本地存储」承诺（复用 hint 小字样式，两种模式都在）
    const privacyNote = text('p', 'v2-welcome__hint', '所有对话与学习数据仅保存在本机浏览器');
    privacyNote.setAttribute('data-testid', 'v2-welcome-privacy');
    welcome.append(
      text('h2', 'v2-welcome__title', '你好，我是你的英语陪学助手 👋'),
      text(
        'p',
        'v2-welcome__text',
        hasRemoteAgent(config)
          ? `已连接模型 ${config.model}（${maskApiKey(config.apiKey)}）。我会用真实学习数据带你完成「计划 → 背词 → 小测 → 错题 → 进度」的闭环。`
          : '当前未配置 API Key，已自动进入「离线陪学」模式：词表、小测与学习记账全部本地可用。配置 Key 后可接入任意 OpenAI 兼容模型。',
      ),
      text('p', 'v2-welcome__hint', '试试下面的快捷指令，或直接输入消息。'),
      privacyNote,
      reportLink,
    );
    modeBadge.textContent = hasRemoteAgent(config) ? `已连接 ${config.model}` : '离线陪学模式';
    modeBadge.classList.toggle('v2-mode--offline', !hasRemoteAgent(config));
  };

  /* ---------- 配置面板 ---------- */

  const syncConfigPanel = (): void => {
    const config = loadV2Config(storage);
    baseUrlInput.value = config.baseUrl;
    apiKeyInput.value = config.apiKey;
    modelInput.value = config.model;
    configHint.textContent = hasRemoteAgent(config)
      ? `当前 Key：${maskApiKey(config.apiKey)} · 端点 ${config.baseUrl}`
      : '未配置 Key：使用离线陪学（本地剧本 + 本地数据）。';
  };

  configToggle.addEventListener('click', () => {
    const open = configPanel.hidden;
    configPanel.hidden = !open;
    configToggle.setAttribute('aria-expanded', String(open));
    if (open) syncConfigPanel();
  });

  saveBtn.addEventListener('click', () => {
    saveV2Config(
      { version: 1, baseUrl: baseUrlInput.value, apiKey: apiKeyInput.value, model: modelInput.value },
      storage,
    );
    offlineTutor = null; // 换回远程：作答回路切到历史同步
    syncConfigPanel();
    syncWelcome(loadV2Config(storage));
  });

  clearBtn.addEventListener('click', () => {
    saveV2Config({ version: 1, baseUrl: baseUrlInput.value, apiKey: '', model: modelInput.value }, storage);
    offlineTutor = null;
    syncConfigPanel();
    syncWelcome(loadV2Config(storage));
  });

  /* ---------- 清空对话（本地历史，二次确认） ---------- */

  /* 历史恢复提示条（可关闭）：恢复历史后置顶于消息流，
   * 点关闭或确认清空对话后移除；仅本组件局部状态，不落盘。 */
  let restoredBanner: HTMLElement | null = null;
  const dismissRestoredBanner = (): void => {
    restoredBanner?.remove();
    restoredBanner = null;
  };

  let confirmingClear = false;
  const resetClearConfirm = (): void => {
    confirmingClear = false;
    clearHistoryBtn.textContent = '清空对话';
    clearHistoryBtn.classList.remove('v2-topbar__clear--confirm');
    clearCancelBtn.hidden = true;
  };

  clearCancelBtn.addEventListener('click', resetClearConfirm);

  clearHistoryBtn.addEventListener('click', () => {
    if (busy) return;
    if (!confirmingClear) {
      // 第一次点击：只进入确认态，不改动任何数据
      confirmingClear = true;
      clearHistoryBtn.textContent = '确认清空';
      clearHistoryBtn.classList.add('v2-topbar__clear--confirm');
      clearCancelBtn.hidden = false;
      return;
    }
    // 第二次点击（确认）：清空本地历史与消息流，回到欢迎卡
    savedHistory.length = 0;
    history.length = 0;
    clearChatHistory(storage);
    dismissRestoredBanner(); // 恢复提示条随清空消失
    for (const node of [...stream.querySelectorAll('.v2-msg')]) node.remove();
    syncWelcome(loadV2Config(storage));
    welcome.hidden = false;
    resetClearConfirm();
  });

  /* ---------- 发送回路 ---------- */

  function pickAgent(): Agent {
    const config = loadV2Config(storage);
    if (hasRemoteAgent(config)) {
      offlineTutor = null; // 远程模式：quiz 作答走历史同步回路
      if (deps.createRemote) return deps.createRemote(config);
      // 工具走注册表：schema 参数校验 + 按名分发（错误对象回喂模型自纠）
      const registry = createDefaultToolRegistry({ storage, now });
      return createRemoteAgent(config, { registry, toolContext: { storage, now } });
    }
    // 离线剧本跨轮复用同一实例（保持 计划→背词→小测 的阶段状态）；
    // 闭环 tracker 由壳层注入：剧本事件直接驱动常驻进度条
    offlineTutor ??= createOfflineTutor({ storage, now, delay: deps.delay, loop });
    return offlineTutor;
  }

  async function submit(): Promise<void> {
    const content = input.value.trim();
    if (content === '' || busy) return;
    busy = true;
    send.disabled = true;
    input.value = '';
    try {
      history.push({ role: 'user', content });
      savedHistory.push({ role: 'user', text: content, at: now() });
      persistHistory(); // 发送即落盘：刷新不丢刚发出的提问
      const userHandle = makeMessage(stream, 'user');
      userHandle.body.textContent = content;

      const agent = pickAgent();
      const agentHandle = makeMessage(stream, 'assistant');
      agentHandle.root.classList.add('v2-msg--pending');
      /* 工具调用结果卡（T4）：按工具名配对 start/end，常驻消息流 */
      const runningCards = new Map<string, ToolCard>();
      let acc = '';
      const assistantMsg = await agent.run(history, (event) => {
        if (event.type === 'text-delta') {
          acc += event.text;
          agentHandle.body.textContent = maskPartialFence(acc);
          scrollStream(stream);
        } else if (event.type === 'tool-start') {
          const card = createToolCard(event.name, event.args);
          agentHandle.tools.append(card.root);
          runningCards.set(event.name, card);
          agentHandle.status.hidden = false;
          agentHandle.status.textContent = `🔧 调用工具 ${event.name}…`;
          scrollStream(stream);
        } else if (event.type === 'tool-end') {
          runningCards.get(event.name)?.finish(event.ok, event.result);
          runningCards.delete(event.name);
          agentHandle.status.textContent = event.ok ? `✓ ${event.name} 完成` : `⚠ ${event.name} 失败`;
          // 远程模式闭环兜底：record_answer 记账成功 → 错题入本 / 进度更新事件
          if (event.ok && event.name === 'record_answer' && offlineTutor === null) {
            const recorded = (event.result as { recorded?: { wrongbookAdded?: boolean } }).recorded;
            if (recorded?.wrongbookAdded) loop.dispatch({ type: 'wrong-added' });
            loop.dispatch({ type: 'progress-updated' });
          }
        } else if (event.type === 'error') {
          agentHandle.status.hidden = false;
          agentHandle.status.textContent = `⚠ ${event.message}`;
        }
      });

      agentHandle.root.classList.remove('v2-msg--pending');

      if (agentHandle.status.textContent.startsWith('✓')) {
        window.setTimeout(() => {
          agentHandle.status.hidden = true;
        }, 1600);
      }

      if (assistantMsg === null) {
        // 远程失败：降级到离线剧本补一轮回复（无 key 精神：永远给答案）
        agentHandle.body.textContent = '远程模型不可用，我先切回离线陪学为你作答 👇';
        const fallback = createOfflineTutor({ storage, now, delay: deps.delay, loop });
        const fbHandle = makeMessage(stream, 'note');
        acc = '';
        const reply = await fallback.run(history, (event) => {
          if (event.type === 'text-delta') {
            acc += event.text;
            fbHandle.body.textContent = maskPartialFence(acc);
            scrollStream(stream);
          }
        });
        offlineTutor = fallback;
        if (reply) {
          renderFinal(fbHandle, reply.content, renderCtx);
          // 降级补答同样是助手回答：照常持久化
          savedHistory.push({ role: 'assistant', text: reply.content, at: now() });
          persistHistory();
        }
        scrollFinal(fbHandle, stream);
      } else {
        history.push(assistantMsg);
        if (assistantMsg.content.trim() !== '') {
          savedHistory.push({ role: 'assistant', text: assistantMsg.content, at: now() });
          persistHistory();
        }
        renderFinal(agentHandle, assistantMsg.content, renderCtx);
        // 远程模式闭环兜底：回复里的组件即闭环证据
        // （词汇卡 → 词汇/计划步；quiz 组件 → 小测步开始）
        if (offlineTutor === null) {
          const { specs } = extractComponents(assistantMsg.content);
          const cards = specs.filter((s) => s.type === 'card').length;
          if (cards > 0) {
            if (loop.get().steps.plan === 'pending') loop.dispatch({ type: 'plan-created', cardsTotal: cards });
            loop.dispatch({ type: 'cards-shown', shown: cards, total: cards });
          }
          const quizzes = specs.filter((s) => s.type === 'quiz').length;
          if (quizzes > 0) loop.dispatch({ type: 'quiz-started', total: quizzes });
        }
        scrollFinal(agentHandle, stream);
      }
    } finally {
      busy = false;
      send.disabled = false;
      input.focus();
    }
  }

  inputbar.addEventListener('submit', (event) => {
    event.preventDefault();
    void submit();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  });

  /* ---------- 初始状态 ---------- */

  syncConfigPanel();
  syncWelcome(loadV2Config(storage));
  stream.append(welcome);

  /* ---------- 历史恢复（本地持久化）：坏数据已由 history.ts 安全降级 ----------
   * 有历史 → 欢迎卡让位，按时间顺序回放最近 50 条；恢复的 assistant 正文
   * （含组件围栏）与模型回复走同一渲染管线；同时回填 Agent 上下文，
   * 刷新后继续对话不失忆。无历史时保持原行为（欢迎卡 + 演示种子）。
   * 恢复后在消息流顶部显示可关闭提示条「已恢复上次对话（N 条）」。 */
  const storedHistory = loadChatHistory(storage);
  if (storedHistory.length > 0) {
    welcome.hidden = true;
    /* 提示条：条数 = 实际恢复条数；「×」关闭后本次挂载不再出现 */
    const banner = el('div', 'v2-history-restored');
    banner.setAttribute('data-testid', 'v2-history-restored');
    banner.setAttribute('role', 'status');
    const bannerText = text(
      'span',
      'v2-history-restored__text',
      restoredBannerText(storedHistory.length),
    );
    const bannerClose = el('button', 'v2-history-restored__close');
    bannerClose.type = 'button';
    bannerClose.setAttribute('data-testid', 'v2-history-restored-close');
    bannerClose.setAttribute('aria-label', '关闭恢复提示');
    bannerClose.textContent = '×';
    bannerClose.addEventListener('click', dismissRestoredBanner);
    banner.append(bannerText, bannerClose);
    restoredBanner = banner;
    stream.append(banner);
    for (const msg of storedHistory) {
      history.push({ role: msg.role, content: msg.text });
      savedHistory.push(msg);
      const handle = makeMessage(stream, msg.role);
      if (msg.role === 'user') handle.body.textContent = msg.text;
      else renderFinal(handle, msg.text, renderCtx);
    }
    scrollStream(stream);
  }

  /* ---------- 演示消息注入（T3 验收通道）：localStorage 预置剧本 ----------
   * 与模型回复同一渲染管线：正文走围栏提取，dsl 逐节点走白名单渲染器；
   * 坏种子 / 非法节点静默降级，页面零脚本异常。仅作展示，不进对话历史。
   * 仅在无本地历史时注入（有真实历史时历史优先）。 */
  if (storedHistory.length === 0) {
    const demoMessages = loadDemoMessages(storage);
    for (const msg of demoMessages) {
      const handle = makeMessage(stream, msg.role);
      renderFinal(handle, msg.content, renderCtx);
      for (const node of msg.dsl) handle.components.append(renderComponent(node, renderCtx));
    }
    if (demoMessages.length > 0) scrollStream(stream);
  }

  input.focus();

  return () => {
    speech?.destroy();
  };
}
