/**
 * v2 对话式学习入口 · 共享类型
 *
 * Agent 侧（远程 OpenAI 兼容运行时与离线陪学剧本共用同一套消息 / 事件形状）：
 * - ChatMessage 与 OpenAI chat completions 的消息结构保持字段兼容，
 *   tool_calls / tool_call_id 语义同协议，便于离线剧本走同一条渲染管线。
 */

/** 对话消息（OpenAI 兼容形状的子集） */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  /** 文本内容；纯 tool_calls 轮可能为空串 */
  content: string;
  /** assistant 轮携带的工具调用（协议原文：arguments 为 JSON 字符串） */
  tool_calls?: ToolCall[];
  /** tool 轮回传对应的调用 id */
  tool_call_id?: string;
  /** tool 轮的工具名 */
  name?: string;
}

/** 一次函数调用（OpenAI 兼容） */
export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    /** JSON 字符串（流式分片累加后才是完整 JSON） */
    arguments: string;
  };
}

/** 工具的 JSON Schema 定义（OpenAI function calling 形状） */
export interface ToolDef {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

/** Agent 运行期间推给壳层的事件（壳层只依赖这一条通道更新 UI） */
export type AgentEvent =
  | { type: 'text-delta'; text: string }
  | { type: 'tool-start'; name: string; args: unknown }
  | { type: 'tool-end'; name: string; ok: boolean; result: unknown }
  | { type: 'done' }
  | { type: 'error'; message: string };

/** 事件发射器 */
export type EmitFn = (event: AgentEvent) => void;

/** Agent 统一接口：远程运行时与离线剧本都实现它，壳层无差别接入 */
export interface Agent {
  /** 展示名（如「离线陪学」「gpt-4o-mini」） */
  readonly label: string;
  /** 是否为离线降级实现（无 key 时使用） */
  readonly offline: boolean;
  /**
   * 处理一轮对话：读 history（含最后一条 user 消息），流式 emit 事件，
   * 返回要追加进 history 的 assistant 消息（失败返回 null，error 事件已携带原因）。
   */
  run(history: ChatMessage[], emit: EmitFn): Promise<ChatMessage | null>;
}
