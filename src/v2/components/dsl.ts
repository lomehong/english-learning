/**
 * 受控组件 DSL 渲染器（T3）
 *
 * 模型（或离线剧本）在回复里用 ```component 代码围栏输出一段 JSON，
 * 壳层提取后交给这里的纯函数渲染成真实 DOM。安全边界：
 * - 白名单注册表：只有 card / quiz / progress / list / audio / timer 六个原语可渲染；
 * - 全部走 document.createElement + textContent / dataset 构造节点，
 *   禁用 eval / new Function / innerHTML——不受信文本只进文本节点，不进 HTML；
 * - progress 原语渲染为 SVG 进度环（createElementNS 构造，颜色取主题令牌）；
 *   card 支持 items 列表行（词汇卡/要点卡形态）；
 * - render* 均为纯函数：只依赖入参与 ctx 回调，不改全局状态；
 * - 非法 spec（未知 type / 缺字段 / 越界值）不抛异常，渲染成一条
 *   「降级占位」节点，保证对话流不因模型输出坏数据而崩溃。
 */

/* -------------------- 规格类型（受信白名单形状） -------------------- */

export interface CardSpec {
  type: 'card';
  title: string;
  /** 词条卡正面（单词 / 音标） */
  word?: string;
  /** 词条卡背面（词性 / 释义 / 例句 / 译文 / 补充行） */
  phonetic?: string;
  pos?: string;
  meaning?: string;
  example?: string;
  exampleZh?: string;
  lines?: string[];
  /** 列表型内容行（如一组「单词 释义」词条，词汇卡/要点卡形态） */
  items?: string[];
  badge?: string;
}

export interface QuizSpec {
  type: 'quiz';
  /** 稳定 id：作答回调回传，供学习闭环记账 */
  id: string;
  stem: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface ProgressSpec {
  type: 'progress';
  label?: string;
  /** 0 ~ 100（越界收敛） */
  value: number;
  hint?: string;
}

export interface ListSpec {
  type: 'list';
  title?: string;
  items: string[];
  ordered?: boolean;
  tone?: 'default' | 'wrong' | 'good';
}

export interface AudioSpec {
  type: 'audio';
  text: string;
  label?: string;
  /** 朗读语速 0.5 ~ 2（默认 1） */
  rate?: number;
}

export interface TimerSpec {
  type: 'timer';
  /** 倒计时秒数（1 ~ 3600 收敛） */
  seconds: number;
  label?: string;
}

export type ComponentSpec = CardSpec | QuizSpec | ProgressSpec | ListSpec | AudioSpec | TimerSpec;

/** 渲染上下文：只暴露回调与只读引擎能力，不暴露 DOM 全局 */
export interface RenderContext {
  /** quiz 作答：回调携带 spec.id / 是否答对 / 选项序号 */
  onQuizAnswer?: (info: { id: string; correct: boolean; choiceIndex: number; choice: string }) => void;
  /** 朗读引擎（缺省或不支持时 audio 原语降级为纯文本） */
  speech?: {
    supported: boolean;
    play(id: string, text: string, rate: number): void;
    stop(): void;
    state: string;
    currentId: string | null;
    subscribe(listener: () => void): () => void;
  };
}

/** 白名单（唯一可渲染的原语集合；新增原语必须显式改这里 + 注册表） */
export const COMPONENT_WHITELIST: readonly string[] = [
  'card',
  'quiz',
  'progress',
  'list',
  'audio',
  'timer',
];

/* -------------------- 校验（纯函数） -------------------- */

function isStr(v: unknown): v is string {
  return typeof v === 'string';
}

function optStr(v: unknown): string | undefined {
  return isStr(v) && v.trim() !== '' ? v : undefined;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** 原始 unknown → 受信 spec；任何形状问题返回 null（不抛异常） */
export function parseComponentSpec(raw: unknown): ComponentSpec | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const v = raw as Record<string, unknown>;
  switch (v.type) {
    case 'card': {
      if (!isStr(v.title)) return null;
      return {
        type: 'card',
        title: v.title,
        word: optStr(v.word),
        phonetic: optStr(v.phonetic),
        pos: optStr(v.pos),
        meaning: optStr(v.meaning),
        example: optStr(v.example),
        exampleZh: optStr(v.exampleZh),
        lines: Array.isArray(v.lines) ? v.lines.filter(isStr).slice(0, 12) : undefined,
        items: Array.isArray(v.items)
          ? v.items.filter((x): x is string => isStr(x) && x.trim() !== '').slice(0, 20)
          : undefined,
        badge: optStr(v.badge),
      };
    }
    case 'quiz': {
      if (!isStr(v.id) || v.id.trim() === '') return null;
      if (!isStr(v.stem)) return null;
      if (!Array.isArray(v.options) || v.options.length < 2 || v.options.length > 6) return null;
      if (!v.options.every(isStr)) return null;
      if (typeof v.answerIndex !== 'number' || !Number.isInteger(v.answerIndex)) return null;
      if (v.answerIndex < 0 || v.answerIndex >= v.options.length) return null;
      return {
        type: 'quiz',
        id: v.id,
        stem: v.stem,
        options: v.options.slice(),
        answerIndex: v.answerIndex,
        explanation: optStr(v.explanation),
      };
    }
    case 'progress': {
      if (typeof v.value !== 'number' || !Number.isFinite(v.value)) return null;
      return {
        type: 'progress',
        label: optStr(v.label),
        value: Math.round(clamp(v.value, 0, 100)),
        hint: optStr(v.hint),
      };
    }
    case 'list': {
      if (!Array.isArray(v.items) || v.items.length === 0 || v.items.length > 30) return null;
      if (!v.items.every(isStr)) return null;
      const tone = v.tone === 'wrong' || v.tone === 'good' ? v.tone : 'default';
      return {
        type: 'list',
        title: optStr(v.title),
        items: v.items.slice(),
        ordered: v.ordered === true,
        tone,
      };
    }
    case 'audio': {
      if (!isStr(v.text) || v.text.trim() === '') return null;
      const rate = typeof v.rate === 'number' && Number.isFinite(v.rate) ? clamp(v.rate, 0.5, 2) : 1;
      return { type: 'audio', text: v.text, label: optStr(v.label), rate };
    }
    case 'timer': {
      if (typeof v.seconds !== 'number' || !Number.isFinite(v.seconds)) return null;
      return {
        type: 'timer',
        seconds: Math.round(clamp(v.seconds, 1, 3600)),
        label: optStr(v.label),
      };
    }
    default:
      return null;
  }
}

/* -------------------- 工具函数 -------------------- */

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

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag: 'svg' | 'circle'): SVGElement {
  // SVG 节点必须走 createElementNS；属性/样式逐个 set，不拼接标记文本
  return document.createElementNS(SVG_NS, tag);
}

/** 秒数 → m:ss 展示 */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

/* -------------------- 原语渲染（纯函数） -------------------- */

function renderCard(spec: CardSpec): HTMLElement {
  const box = el('div', 'v2-card');
  const head = el('div', 'v2-card__head');
  head.append(text('h4', 'v2-card__title', spec.title));
  if (spec.badge) head.append(text('span', 'v2-card__badge', spec.badge));
  box.append(head);

  const body = el('div', 'v2-card__body');
  if (spec.word || spec.phonetic) {
    const wordRow = el('p', 'v2-card__word');
    if (spec.word) wordRow.append(text('span', 'v2-card__word-en', spec.word));
    if (spec.phonetic) wordRow.append(text('span', 'v2-card__word-phonetic', spec.phonetic));
    body.append(wordRow);
  }
  if (spec.pos) body.append(text('p', 'v2-card__pos', spec.pos));
  if (spec.meaning) body.append(text('p', 'v2-card__meaning', spec.meaning));
  if (spec.example) body.append(text('p', 'v2-card__example', spec.example));
  if (spec.exampleZh) body.append(text('p', 'v2-card__example-zh', spec.exampleZh));
  if (spec.lines && spec.lines.length > 0) {
    const lines = el('ul', 'v2-card__lines');
    for (const line of spec.lines) lines.append(text('li', undefined, line));
    body.append(lines);
  }
  // 列表型内容行（词汇卡/要点卡形态）：与 lines 同一视觉，便于「标题 + 若干行」的卡
  if (spec.items && spec.items.length > 0) {
    const items = el('ul', 'v2-card__lines v2-card__items');
    for (const item of spec.items) items.append(text('li', undefined, item));
    body.append(items);
  }
  box.append(body);
  return box;
}

function renderQuiz(spec: QuizSpec, ctx: RenderContext): HTMLElement {
  const box = el('div', 'v2-quiz');
  box.setAttribute('data-quiz-id', spec.id);
  box.append(text('p', 'v2-quiz__stem', spec.stem));

  const options = el('div', 'v2-quiz__options');
  const buttons: HTMLButtonElement[] = [];
  for (let i = 0; i < spec.options.length; i += 1) {
    const option = spec.options[i]!;
    const btn = el('button', 'v2-quiz__option');
    btn.type = 'button';
    btn.dataset.index = String(i);
    btn.setAttribute('data-testid', `v2-quiz-option-${i}`);
    const key = text('span', 'v2-quiz__key', String.fromCharCode(65 + i));
    const label = text('span', 'v2-quiz__label', option);
    btn.append(key, label);
    buttons.push(btn);
    options.append(btn);
  }
  box.append(options);

  const result = el('p', 'v2-quiz__result');
  result.hidden = true;
  box.append(result);

  let answered = false;
  for (let i = 0; i < buttons.length; i += 1) {
    buttons[i]!.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = i === spec.answerIndex;
      for (let j = 0; j < buttons.length; j += 1) {
        buttons[j]!.disabled = true;
        if (j === spec.answerIndex) buttons[j]!.classList.add('v2-quiz__option--correct');
        else if (j === i) buttons[j]!.classList.add('v2-quiz__option--wrong');
      }
      result.hidden = false;
      result.classList.add(correct ? 'v2-quiz__result--correct' : 'v2-quiz__result--wrong');
      result.textContent = correct
        ? `回答正确${spec.explanation ? `。${spec.explanation}` : ''}`
        : `正确答案是 ${String.fromCharCode(65 + spec.answerIndex)}.${spec.options[spec.answerIndex]}${spec.explanation ? `。${spec.explanation}` : ''}`;
      box.classList.add('v2-quiz--answered');
      ctx.onQuizAnswer?.({ id: spec.id, correct, choiceIndex: i, choice: spec.options[i]! });
    });
  }
  return box;
}

/** 进度环几何常量：viewBox 84×84，半径 34，描边 10（周长 2πr ≈ 213.63） */
const RING_SIZE = 84;
const RING_R = 34;
const RING_C = 2 * Math.PI * RING_R;

function renderProgress(spec: ProgressSpec): HTMLElement {
  const box = el('div', 'v2-progress');

  // 环 + 中心百分比：尺寸/定位走内联样式（几何属于组件自身），
  // 颜色引用主题令牌（--color-chart-*），浅色/深色主题均生效
  const ringBox = el('div', 'v2-progress__ringbox');
  ringBox.style.position = 'relative';
  ringBox.style.width = `${RING_SIZE}px`;
  ringBox.style.height = `${RING_SIZE}px`;
  ringBox.style.flex = 'none';

  const svg = svgEl('svg');
  svg.classList.add('v2-progress__ring');
  svg.setAttribute('data-testid', 'v2-progress-ring');
  svg.setAttribute('viewBox', `0 0 ${RING_SIZE} ${RING_SIZE}`);
  svg.setAttribute('role', 'progressbar');
  svg.setAttribute('aria-label', spec.label ?? '进度');
  svg.setAttribute('aria-valuenow', String(spec.value));
  svg.setAttribute('aria-valuemin', '0');
  svg.setAttribute('aria-valuemax', '100');
  svg.style.display = 'block';
  svg.style.width = '100%';
  svg.style.height = '100%';

  const half = RING_SIZE / 2;
  const track = svgEl('circle');
  track.classList.add('v2-progress__ring-track');
  track.setAttribute('cx', String(half));
  track.setAttribute('cy', String(half));
  track.setAttribute('r', String(RING_R));
  track.setAttribute('fill', 'none');
  track.setAttribute('stroke-width', '10');
  track.style.stroke = 'var(--color-chart-track)';

  const fill = svgEl('circle');
  fill.classList.add('v2-progress__ring-fill');
  fill.setAttribute('cx', String(half));
  fill.setAttribute('cy', String(half));
  fill.setAttribute('r', String(RING_R));
  fill.setAttribute('fill', 'none');
  fill.setAttribute('stroke-width', '10');
  fill.setAttribute('stroke-linecap', 'round');
  // 周长入 dasharray，按比例收缩 dashoffset；-90° 起笔让环从正上方顺时针填充
  fill.setAttribute('stroke-dasharray', String(RING_C));
  fill.setAttribute('stroke-dashoffset', String(RING_C * (1 - spec.value / 100)));
  fill.setAttribute('transform', `rotate(-90 ${half} ${half})`);
  fill.style.stroke = 'var(--color-chart-overall)';
  svg.append(track, fill);

  const center = el('span', 'v2-progress__ring-value');
  center.setAttribute('data-testid', 'v2-progress-ring-value');
  center.style.position = 'absolute';
  center.style.left = '0';
  center.style.right = '0';
  center.style.top = '0';
  center.style.bottom = '0';
  center.style.display = 'flex';
  center.style.alignItems = 'center';
  center.style.justifyContent = 'center';
  center.style.fontWeight = '700';
  center.style.fontSize = 'var(--font-size-md)';
  center.style.color = 'var(--color-text)';
  center.textContent = `${spec.value}%`;
  ringBox.append(svg, center);

  // 标题行在环上方（无 label/hint 时整行省略，只留环）
  if (spec.label || spec.hint) {
    const head = el('div', 'v2-progress__head');
    if (spec.label) head.append(text('span', 'v2-progress__label', spec.label));
    if (spec.hint) head.append(text('span', 'v2-progress__hint', spec.hint));
    box.append(head);
  }
  box.append(ringBox);
  return box;
}

function renderList(spec: ListSpec): HTMLElement {
  const box = el('div', `v2-list v2-list--${spec.tone}`);
  if (spec.title) box.append(text('h4', 'v2-list__title', spec.title));
  const list = el(spec.ordered ? 'ol' : 'ul', 'v2-list__items');
  for (const item of spec.items) list.append(text('li', undefined, item));
  box.append(list);
  return box;
}

function renderAudio(spec: AudioSpec, ctx: RenderContext): HTMLElement {
  const box = el('div', 'v2-audio');
  box.append(text('p', 'v2-audio__text', spec.text));
  const speech = ctx.speech;
  if (!speech || !speech.supported) {
    box.append(text('p', 'v2-audio__unsupported', '当前浏览器不支持语音朗读，仅展示文本。'));
    return box;
  }
  // 窄化后的常量引用（闭包内保持非空类型）
  const engine = speech;
  const id = `v2-audio:${spec.text}`;
  const btn = el('button', 'btn btn--ghost btn--sm v2-audio__btn');
  btn.type = 'button';
  const idleLabel = spec.label ?? '🔊 朗读';
  function sync(): void {
    const active = engine.currentId === id && engine.state !== 'idle';
    btn.textContent = active ? '⏹ 停止' : idleLabel;
    btn.setAttribute('aria-pressed', String(active));
  }
  btn.addEventListener('click', () => {
    if (engine.currentId === id && engine.state !== 'idle') engine.stop();
    else engine.play(id, spec.text, spec.rate ?? 1);
  });
  engine.subscribe(sync);
  sync();
  box.append(btn);
  return box;
}

function renderTimer(spec: TimerSpec): HTMLElement {
  const box = el('div', 'v2-timer');
  const clock = text('span', 'v2-timer__clock', formatClock(spec.seconds));
  if (spec.label) box.append(text('span', 'v2-timer__label', spec.label));
  box.append(clock);

  const startBtn = el('button', 'btn btn--ghost btn--sm');
  startBtn.type = 'button';
  startBtn.textContent = '开始';
  const resetBtn = el('button', 'btn btn--ghost btn--sm');
  resetBtn.type = 'button';
  resetBtn.textContent = '重置';
  box.append(startBtn, resetBtn);

  let remain = spec.seconds;
  let running = false;
  let timer: ReturnType<typeof setInterval> | null = null;

  function stopTicking(): void {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function sync(): void {
    clock.textContent = formatClock(remain);
    startBtn.textContent = running ? '暂停' : '开始';
    box.classList.toggle('v2-timer--running', running);
    box.classList.toggle('v2-timer--done', remain === 0);
  }

  startBtn.addEventListener('click', () => {
    if (remain === 0) return;
    running = !running;
    if (running) {
      timer = setInterval(() => {
        // 元素已从文档摘除（翻页/重渲染）时自清理，防监听泄漏
        if (!box.isConnected) {
          stopTicking();
          return;
        }
        remain = Math.max(0, remain - 1);
        sync();
        if (remain === 0) {
          running = false;
          stopTicking();
          sync();
        }
      }, 1000);
    } else {
      stopTicking();
    }
    sync();
  });
  resetBtn.addEventListener('click', () => {
    running = false;
    stopTicking();
    remain = spec.seconds;
    sync();
  });
  sync();
  return box;
}

/* -------------------- 注册表 + 入口 -------------------- */

/** 原语注册表：白名单 type → 纯渲染函数（唯一渲染通道） */
const REGISTRY: Record<string, (spec: never, ctx: RenderContext) => HTMLElement> = {
  card: renderCard as (spec: never, ctx: RenderContext) => HTMLElement,
  quiz: renderQuiz as (spec: never, ctx: RenderContext) => HTMLElement,
  progress: renderProgress as (spec: never, ctx: RenderContext) => HTMLElement,
  list: renderList as (spec: never, ctx: RenderContext) => HTMLElement,
  audio: renderAudio as (spec: never, ctx: RenderContext) => HTMLElement,
  timer: renderTimer as (spec: never, ctx: RenderContext) => HTMLElement,
};

/**
 * 渲染入口（纯函数）：白名单外 / 校验失败 → 降级占位节点，永不抛异常。
 * 返回节点未挂载，由调用方决定插入位置。
 */
export function renderComponent(raw: unknown, ctx: RenderContext = {}): HTMLElement {
  const spec = parseComponentSpec(raw);
  if (spec === null) {
    const fallback = el('div', 'v2-comp v2-comp--invalid');
    fallback.setAttribute('data-testid', 'v2-comp-invalid');
    const type = typeof raw === 'object' && raw !== null && isStr((raw as { type?: unknown }).type)
      ? (raw as { type: string }).type
      : String(raw);
    fallback.append(text('span', undefined, `⚠ 不支持的组件（type: ${type}），已按纯文本处理。`));
    return fallback;
  }
  const node = REGISTRY[spec.type]!(spec as never, ctx);
  node.classList.add('v2-comp');
  node.setAttribute('data-comp-type', spec.type);
  return node;
}

/** 是否白名单内类型（注册表查询前的快速判定） */
export function isWhitelisted(type: unknown): boolean {
  return isStr(type) && COMPONENT_WHITELIST.includes(type);
}

/* -------------------- 围栏提取（模型输出 → 组件流） -------------------- */

const FENCE_RE = /```component[^\n]*\n([\s\S]*?)```/g;

export interface ExtractResult {
  /** 去掉组件围栏后的正文 */
  cleanText: string;
  /** 依序解析出的合法 spec（坏 JSON / 非法形状被跳过，不中断） */
  specs: ComponentSpec[];
  /** 被跳过的坏围栏数量 */
  skipped: number;
}

/** 从模型回复文本中提取 ```component 围栏（纯函数） */
export function extractComponents(reply: string): ExtractResult {
  const specs: ComponentSpec[] = [];
  let skipped = 0;
  const cleanText = reply.replace(FENCE_RE, (_match, body: string) => {
    try {
      const spec = parseComponentSpec(JSON.parse(body));
      if (spec === null) skipped += 1;
      else specs.push(spec);
    } catch {
      skipped += 1;
    }
    return '';
  });
  return { cleanText: cleanText.replace(/\n{3,}/g, '\n\n').trim(), specs, skipped };
}

/** spec → 围栏文本（离线剧本 / 测试构造回复用） */
export function toComponentFence(spec: ComponentSpec): string {
  return `\`\`\`component\n${JSON.stringify(spec)}\n\`\`\``;
}
