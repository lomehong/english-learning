import { describe, it, expect } from 'vitest';
import {
  createToolCard,
  isToolError,
  summarizeToolArgs,
  summarizeToolResult,
} from './toolcard';

describe('工具调用结果卡 · 摘要纯函数（T4）', () => {
  it('summarizeToolArgs：空对象 / 键值对 / 截断', () => {
    expect(summarizeToolArgs(undefined)).toBe('{}');
    expect(summarizeToolArgs({})).toBe('{}');
    expect(summarizeToolArgs({ keyword: 'adapt', limit: 5 })).toBe('{keyword: adapt, limit: 5}');
    expect(summarizeToolArgs({ keyword: 'x'.repeat(200) })).toMatch(/…$/);
    expect(summarizeToolArgs({ unit: 'unit1' })).toBe('{unit: unit1}');
  });

  it('isToolError：识别 { error, message } 结构', () => {
    expect(isToolError({ error: 'invalid_arguments', message: 'x' })).toBe(true);
    expect(isToolError({ total: 0, items: [] })).toBe(false);
    expect(isToolError(null)).toBe(false);
    expect(isToolError('x')).toBe(false);
  });

  it('query_wrongbook 摘要：总数 + 逐条「题干 → 正确答案（错 n 次）」+ 折叠提示', () => {
    const lines = summarizeToolResult('query_wrongbook', {
      total: 4,
      items: [
        { exerciseId: 'demo-1', stem: 'apple 的中文', correctAnswer: '苹果', wrongCount: 1 },
        { exerciseId: 'w:x', stem: '适应 →', correctAnswer: 'adapt', wrongCount: 3 },
        { exerciseId: 'g2', stem: '语法题', correctAnswer: '答案', wrongCount: 2 },
        { exerciseId: 'r1', stem: '阅读题', correctAnswer: '答', wrongCount: 1 },
      ],
    });
    expect(lines[0]).toBe('错题共 4 条');
    expect(lines[1]).toBe('apple 的中文 → 苹果（错 1 次）');
    expect(lines).toHaveLength(5); // 3 条 + 折叠行
    expect(lines[4]).toBe('…其余 1 条略');
  });

  it('get_learning_state / query_vocab / record_answer 摘要：各自的关键行', () => {
    const state = summarizeToolResult('get_learning_state', {
      learnedWords: 12, totalWords: 2400, dueReviews: 3, overall: 0.4, streak: 2, wrongbook: { total: 1 },
    });
    expect(state.join(' ')).toContain('已学词汇 12 / 2400');
    expect(state.join(' ')).toContain('错题本 1 条');

    const vocab = summarizeToolResult('query_vocab', {
      total: 2,
      items: [
        { word: 'adapt', meaning: '适应' },
        { word: 'adopt', meaning: '采纳' },
      ],
    });
    expect(vocab[0]).toBe('命中 2 条词条');
    expect(vocab).toContain('adapt — 适应');

    const record = summarizeToolResult('record_answer', {
      ok: true,
      message: '已记录：vocab 模块答对',
      recorded: { today: { vocab: 1, exercises: 2 } },
    });
    expect(record).toContain('已记录：vocab 模块答对');
    expect(record).toContain('今日已记 1 词 / 2 题');
  });

  it('错误结果 / 未知形状兜底：结构化错误行 + JSON 预览，不抛异常', () => {
    expect(summarizeToolResult('query_vocab', { error: 'invalid_arguments', message: '缺少必填参数' })).toEqual([
      '错误 invalid_arguments：缺少必填参数',
    ]);
    expect(summarizeToolResult('mystery_tool', { anything: true })[0]).toContain('"anything":true');
    expect(summarizeToolResult('query_wrongbook', null)[0]).toBe('错题共 0 条');
  });
});

describe('工具调用结果卡 · DOM（T4）', () => {
  it('生命周期：创建为「调用中」→ finish 回填结果、状态与配色切换', () => {
    const card = createToolCard('query_wrongbook', { module: 'vocab' });
    expect(card.root.getAttribute('data-testid')).toBe('v2-toolcard');
    expect(card.root.getAttribute('data-tool-name')).toBe('query_wrongbook');
    expect(card.root.classList.contains('v2-toolcard--running')).toBe(true);
    expect(card.root.querySelector('.v2-toolcard__name')!.textContent).toBe('query_wrongbook');
    expect(card.root.querySelector('.v2-toolcard__args')!.textContent).toBe('{module: vocab}');
    const lines = card.root.querySelector('.v2-toolcard__lines') as HTMLElement;
    expect(lines.hidden).toBe(true);
    expect(card.root.querySelector('.v2-toolcard__state')!.textContent).toBe('调用中…');

    card.finish(true, {
      total: 1,
      items: [{ exerciseId: 'demo-1', stem: 'apple 的中文', correctAnswer: '苹果', wrongCount: 1 }],
    });
    expect(card.root.classList.contains('v2-toolcard--running')).toBe(false);
    expect(card.root.classList.contains('v2-toolcard--ok')).toBe(true);
    expect(lines.hidden).toBe(false);
    expect(lines.textContent).toContain('apple 的中文 → 苹果（错 1 次）');
    expect(card.root.querySelector('.v2-toolcard__state')!.textContent).toBe('✓ 完成');
  });

  it('失败态：fail 配色 + 错误摘要行', () => {
    const card = createToolCard('record_answer', { module: 'pe', correct: true });
    card.finish(false, { error: 'tool_failed', message: '非法模块 pe' });
    expect(card.root.classList.contains('v2-toolcard--fail')).toBe(true);
    expect(card.root.textContent).toContain('⚠ 失败');
    expect(card.root.textContent).toContain('非法模块 pe');
  });

  it('卡片先于正文：挂进消息主区后位于 body 之前（工具调用发生在回答前）', () => {
    const main = document.createElement('div');
    const body = document.createElement('div');
    body.className = 'v2-msg__body';
    main.append(createToolCard('get_learning_state', {}).root, body);
    expect(main.firstElementChild!.getAttribute('data-tool-name')).toBe('get_learning_state');
  });
});
