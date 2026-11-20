/**
 * /v2 演示消息种子（T3 验收 / 宣发演示通道）
 *
 * 外部（验收引擎、演示脚本）向 localStorage 预置一段对话剧本：
 *   v2_demo_messages = [{ role: 'assistant', content?: '...', dsl?: [组件Spec, ...] }, ...]
 *
 * 壳层挂载时读取并按正常消息渲染：正文走围栏提取管线，dsl 数组逐个交给
 * DSL 渲染器（白名单校验 + 非法节点降级占位），因此种子通道与模型回复
 * 走同一条受控渲染路径——不存在仅种子可用的旁路原语。
 *
 * 本文件纯函数 + 只读 storage：坏 JSON / 非法形状静默收敛为空或跳过，
 * 绝不抛异常打断页面。
 */

import type { StorageLike } from '../store/progress';

/** localStorage 键名（与验收 evidence.seedLocalStorage 约定一致） */
export const DEMO_MESSAGES_KEY = 'v2_demo_messages';

/** 单条演示消息（归一化后）：content 与 dsl 至少有一非空才会保留 */
export interface DemoMessage {
  role: 'user' | 'assistant';
  content: string;
  /** 原始组件节点（unknown）：合法性由 DSL 渲染器判定，坏节点降级占位 */
  dsl: unknown[];
}

/** 上限：防坏种子把消息流撑爆 */
const MAX_MESSAGES = 50;
const MAX_DSL_NODES = 20;

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * 原始 unknown → 演示消息列表（纯函数）：
 * - 顶层不是数组 → 空列表；
 * - 每条：role 只接受 user / assistant（其余丢弃），content 缺省空串，
 *   dsl 只接受数组（截断到 MAX_DSL_NODES），其余字段忽略；
 * - content 与 dsl 双空的条目不渲染，直接丢弃。
 */
export function parseDemoMessages(raw: unknown): DemoMessage[] {
  if (!Array.isArray(raw)) return [];
  const out: DemoMessage[] = [];
  for (const entry of raw) {
    if (out.length >= MAX_MESSAGES) break;
    if (!isObj(entry)) continue;
    if (entry.role !== 'user' && entry.role !== 'assistant') continue;
    const content = typeof entry.content === 'string' ? entry.content : '';
    const dsl = Array.isArray(entry.dsl) ? entry.dsl.slice(0, MAX_DSL_NODES) : [];
    if (content.trim() === '' && dsl.length === 0) continue;
    out.push({ role: entry.role, content, dsl });
  }
  return out;
}

/** 从 storage 读取种子（读失败 / 无种子 → 空列表，不抛异常） */
export function loadDemoMessages(storage: StorageLike): DemoMessage[] {
  let raw: string | null = null;
  try {
    raw = storage.getItem(DEMO_MESSAGES_KEY);
  } catch {
    return [];
  }
  if (raw === null || raw.trim() === '') return [];
  try {
    return parseDemoMessages(JSON.parse(raw));
  } catch {
    return [];
  }
}
