/**
 * 学习闭环进度条（T5）：消息流上方的常驻步骤条。
 *
 * 展示「计划 → 词汇 → 小测 → 错题 → 进度」五步的可追踪状态
 * （pending / active / done）与计数（词卡 x/y、小测 a/b、错题 +n），
 * 数据只来自 LoopSnapshot（loop.ts 的 reducer）。
 *
 * 构造约束与 v2 其余组件一致：document.createElement + textContent，
 * 不用 innerHTML / eval；update 为幂等同步，可任意次调用。
 */

import { LOOP_STEPS, type LoopSnapshot, type LoopStepId } from '../loop';

export interface LoopTicker {
  root: HTMLElement;
  /** 幂等同步快照（状态 / 计数 / 完成徽标） */
  update(snapshot: LoopSnapshot): void;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/** 各步骤的状态点文案：序号待办 / ▶ 进行 / ✓ 完成 */
function dotText(id: LoopStepId, status: string): string {
  if (status === 'done') return '✓';
  if (status === 'active') return '▶';
  return String(LOOP_STEPS.findIndex((s) => s.id === id) + 1);
}

/** 各步骤的计数角标（无计数为空串，占位防布局跳动） */
function metaText(id: LoopStepId, snap: LoopSnapshot): string {
  switch (id) {
    case 'cards':
      return snap.cards.total > 0 ? `${snap.cards.shown}/${snap.cards.total} 词` : '';
    case 'quiz':
      return snap.quiz.total > 0 ? `${snap.quiz.answered}/${snap.quiz.total} 题` : '';
    case 'wrongbook':
      return snap.wrongAdded > 0 ? `+${snap.wrongAdded} 入本` : '';
    default:
      return '';
  }
}

export function createLoopTicker(): LoopTicker {
  const root = el('nav', 'v2-loop');
  root.setAttribute('data-testid', 'v2-loop');
  root.setAttribute('aria-label', '学习闭环进度');

  const caption = el('span', 'v2-loop__caption');
  caption.textContent = '学习闭环';

  const list = el('ol', 'v2-loop__steps');
  const dots = new Map<LoopStepId, HTMLElement>();
  const metas = new Map<LoopStepId, HTMLElement>();
  const stepNodes = new Map<LoopStepId, HTMLElement>();
  for (const step of LOOP_STEPS) {
    const item = el('li', 'v2-loop__step');
    item.setAttribute('data-loop-step', step.id);
    item.setAttribute('data-status', 'pending');
    const dot = el('span', 'v2-loop__dot');
    dot.textContent = dotText(step.id, 'pending');
    const label = el('span', 'v2-loop__label');
    label.textContent = step.label;
    const meta = el('span', 'v2-loop__meta');
    item.append(dot, label, meta);
    list.append(item);
    dots.set(step.id, dot);
    metas.set(step.id, meta);
    stepNodes.set(step.id, item);
  }

  const doneBadge = el('span', 'v2-loop__done');
  doneBadge.setAttribute('data-testid', 'v2-loop-done');
  doneBadge.hidden = true;
  doneBadge.textContent = '本轮闭环完成 ✓';

  root.append(caption, list, doneBadge);

  return {
    root,
    update(snapshot) {
      for (const step of LOOP_STEPS) {
        const status = snapshot.steps[step.id];
        const node = stepNodes.get(step.id)!;
        node.setAttribute('data-status', status);
        dots.get(step.id)!.textContent = dotText(step.id, status);
        metas.get(step.id)!.textContent = metaText(step.id, snapshot);
      }
      const complete = LOOP_STEPS.every((s) => snapshot.steps[s.id] === 'done');
      doneBadge.hidden = !complete;
      root.classList.toggle('v2-loop--complete', complete);
    },
  };
}
