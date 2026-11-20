import { describe, it, expect } from 'vitest';
import { createOfflineTutor } from './offline';
import { extractComponents } from '../components/dsl';
import type { ChatMessage } from '../types';
import type { StorageLike } from '../../store/progress';

/**
 * 本票（T2）验收场景钉子：/v2 预览的「对话发送与回复」用的是这句原话——
 *   fill「今天学什么」→ click 发送 → 截图断言助手回复上屏。
 * 话术与 scripts/verify-t2-agent-preview.mjs 的 DOM 断言一一对应：
 * 若剧本路由改动导致这句不再出「每日计划」回复，截图会退化，本测试先红。
 */

const NOW = Date.UTC(2026, 10, 20, 4, 0, 0);

function memory(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => void store.set(k, v),
  };
}

function makeTutor(storage: StorageLike) {
  return createOfflineTutor({ storage, now: () => NOW, delay: async () => {} });
}

async function reply(tutor: ReturnType<typeof makeTutor>, text: string): Promise<string> {
  const history: ChatMessage[] = [{ role: 'user', content: text }];
  const message = await tutor.run(history, () => {});
  if (!message) throw new Error('agent 未返回消息');
  return message.content;
}

describe('T2 验收场景钉子（/v2「对话发送与回复」）', () => {
  it('「今天学什么」走每日计划剧本：今日目标 + 今天的计划 + 词汇卡 + progress/timer', async () => {
    const tutor = makeTutor(memory());
    const content = await reply(tutor, '今天学什么');

    // 对应截图断言：asstText 含「今日目标」「今天的计划」
    const { specs, cleanText } = extractComponents(content);
    expect(cleanText).toContain('今日目标');
    expect(cleanText).toContain('今天的计划');

    // 对应截图断言：首组词汇卡 ≥1、进度组件（track）出现
    expect(specs.filter((s) => s.type === 'card').length).toBeGreaterThanOrEqual(1);
    expect(specs.some((s) => s.type === 'progress')).toBe(true);
    expect(specs.some((s) => s.type === 'timer')).toBe(true);
    expect(tutor.stage).toBe('cards');

    // 对应截图断言：正文无围栏 JSON 原文（组件走 DSL 渲染，不漏 ```）
    expect(cleanText.includes('```')).toBe(false);
  });

  it('该话术派发的卡片可跟读（每词一张 audio 卡）', async () => {
    const tutor = makeTutor(memory());
    const content = await reply(tutor, '今天学什么');
    const { specs } = extractComponents(content);
    const cards = specs.filter((s) => s.type === 'card').length;
    const audios = specs.filter((s) => s.type === 'audio').length;
    expect(cards).toBeGreaterThan(0);
    expect(audios).toBe(cards);
  });
});
