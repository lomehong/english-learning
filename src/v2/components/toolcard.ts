/**
 * 工具调用结果卡（T4）：把一次 tool-start → tool-end 渲染成消息流里的常驻卡片。
 *
 * - 远程 Agent（function calling）与离线剧本（withTool）推同一套工具事件，
 *   壳层把事件喂给本模块：调用中显示「调用中…」，结束回填结构化结果摘要；
 * - 摘要按工具定制（query_wrongbook 列出错题条目、record_answer 复述记账
 *   明细……），未知形状兜底为截断 JSON——卡片永远可读、绝不抛异常；
 * - 与 chat.ts 同规约：只用 createElement + textContent，不碰超文本注入。
 */

interface NodeLike {
  createElement<K extends keyof HTMLElementTagNameMap>(tag: K): HTMLElementTagNameMap[K];
}

function el(doc: NodeLike, tag: keyof HTMLElementTagNameMap, className?: string): HTMLElement {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  return node;
}

function text(doc: NodeLike, tag: keyof HTMLElementTagNameMap, className: string | undefined, content: string): HTMLElement {
  const node = el(doc, tag, className);
  node.textContent = content;
  return node;
}

function truncate(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max)}…`;
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}

/** 入参摘要：{} / {keyword: adapt, unit: unit1}（截断，供卡片头部展示） */
export function summarizeToolArgs(args: unknown): string {
  if (!isObj(args) || Object.keys(args).length === 0) return '{}';
  const parts = Object.entries(args).map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
  return truncate(`{${parts.join(', ')}}`, 80);
}

/** 错误形状（工具注册表 / executeTool 约定：{ error, message }） */
export function isToolError(result: unknown): boolean {
  return isObj(result) && typeof result.error === 'string';
}

/**
 * 结果摘要（纯函数）：按工具名给出人话行；最多 5 行，每行截断。
 * 未知工具 / 未知形状兜底 JSON 预览，永不抛异常。
 */
export function summarizeToolResult(name: string, result: unknown): string[] {
  const lines: string[] = [];
  const r = isObj(result) ? result : {};
  if (isToolError(r)) {
    lines.push(`错误 ${str(r.error) || 'unknown'}：${str(r.message) || '（无详细信息）'}`);
    return lines;
  }
  if (name === 'get_learning_state') {
    const wrong = isObj(r.wrongbook) ? r.wrongbook : {};
    lines.push(
      `已学词汇 ${num(r.learnedWords) ?? '?'} / ${num(r.totalWords) ?? '?'} · 到期复习 ${num(r.dueReviews) ?? 0} 个`,
      `今日完成 ${Math.round((num(r.overall) ?? 0) * 100)}% · 连续学习 ${num(r.streak) ?? 0} 天`,
      `错题本 ${num(wrong.total) ?? 0} 条`,
    );
  } else if (name === 'query_vocab') {
    const items = Array.isArray(r.items) ? r.items.filter(isObj) : [];
    lines.push(`命中 ${num(r.total) ?? items.length} 条词条`);
    for (const w of items.slice(0, 3)) lines.push(truncate(`${str(w.word)} — ${str(w.meaning)}`, 64));
    if (items.length > 3) lines.push(`…其余 ${items.length - 3} 条略`);
  } else if (name === 'query_wrongbook') {
    const items = Array.isArray(r.items) ? r.items.filter(isObj) : [];
    lines.push(`错题共 ${num(r.total) ?? items.length} 条`);
    for (const e of items.slice(0, 3)) {
      lines.push(truncate(`${str(e.stem)} → ${str(e.correctAnswer)}（错 ${num(e.wrongCount) ?? 1} 次）`, 64));
    }
    if (items.length > 3) lines.push(`…其余 ${items.length - 3} 条略`);
  } else if (name === 'record_answer') {
    const recorded = isObj(r.recorded) ? r.recorded : {};
    const today = isObj(recorded.today) ? recorded.today : {};
    if (str(r.message) !== '') lines.push(str(r.message));
    lines.push(`今日已记 ${num(today.vocab) ?? 0} 词 / ${num(today.exercises) ?? 0} 题`);
  } else {
    lines.push(truncate(JSON.stringify(result) ?? 'null', 160));
  }
  return lines.slice(0, 5);
}

/* -------------------- 卡片 -------------------- */

export interface ToolCard {
  root: HTMLElement;
  /** 工具执行结束：回填结果摘要并切换状态样式（ok / 失败分色） */
  finish(ok: boolean, result: unknown): void;
}

const doc: NodeLike = document;

/**
 * 创建一张工具调用结果卡（调用中状态）：
 * 卡片常驻消息流（不随状态行自动隐藏），截图 / 回看均可见。
 */
export function createToolCard(name: string, args: unknown): ToolCard {
  const root = el(doc, 'div', 'v2-toolcard v2-toolcard--running');
  root.setAttribute('data-testid', 'v2-toolcard');
  root.setAttribute('data-tool-name', name);

  const head = el(doc, 'div', 'v2-toolcard__head');
  head.append(
    text(doc, 'span', 'v2-toolcard__icon', '🔧'),
    text(doc, 'code', 'v2-toolcard__name', name),
    text(doc, 'span', 'v2-toolcard__args', summarizeToolArgs(args)),
  );
  const state = text(doc, 'span', 'v2-toolcard__state', '调用中…');
  head.append(state);

  const lines = el(doc, 'ul', 'v2-toolcard__lines');
  lines.hidden = true;

  root.append(head, lines);
  return {
    root,
    finish(ok, result) {
      root.classList.remove('v2-toolcard--running');
      root.classList.add(ok ? 'v2-toolcard--ok' : 'v2-toolcard--fail');
      state.textContent = ok ? '✓ 完成' : '⚠ 失败';
      lines.replaceChildren();
      for (const line of summarizeToolResult(name, result)) {
        lines.append(text(doc, 'li', 'v2-toolcard__line', line));
      }
      lines.hidden = false;
    },
  };
}
