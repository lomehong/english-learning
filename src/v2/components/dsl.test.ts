import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  renderComponent,
  parseComponentSpec,
  extractComponents,
  toComponentFence,
  formatClock,
  COMPONENT_WHITELIST,
} from './dsl';

const projectRoot = process.cwd();

describe('受控组件 DSL（T3）：白名单与安全', () => {
  it('白名单恰好是六个原语：card/quiz/progress/list/audio/timer', () => {
    expect([...COMPONENT_WHITELIST]).toEqual(['card', 'quiz', 'progress', 'list', 'audio', 'timer']);
  });

  it('源码守卫：渲染器禁用 innerHTML / eval / new Function（不受信文本不进 HTML）', () => {
    const source = readFileSync(join(projectRoot, 'src/v2/components/dsl.ts'), 'utf8');
    expect(source).not.toMatch(/\.innerHTML/); // 属性访问（文档注释里的词不算）
    expect(source).not.toMatch(/\beval\s*\(/);
    expect(source).not.toMatch(/\bnew\s+Function\s*\(/); // 构造调用（注释不算）
  });

  it('样式守卫：v2.css 不硬编码颜色（全部走主题令牌，三档主题生效）', () => {
    const css = readFileSync(join(projectRoot, 'src/styles/v2.css'), 'utf8');
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(css).not.toMatch(/rgba?\(\s*\d/);
    expect(css).toMatch(/@media \(max-width: 24\.375rem\)/); // 390px 断点存在
  });

  it('未知 type / 非法形状 → 降级占位节点，不抛异常', () => {
    for (const bad of [
      { type: 'script', code: 'alert(1)' },
      { type: 'iframe', src: 'https://evil.example' },
      { type: 'quiz', stem: 'x' }, // 缺 options
      { type: 'quiz', stem: 'x', options: ['a'], answerIndex: 0 }, // 选项不足
      { type: 'quiz', stem: 'x', options: ['a', 'b'], answerIndex: 5 }, // 越界答案
      { type: 'progress' }, // 缺 value
      { type: 'list', items: [] },
      { type: 'timer', seconds: 'soon' },
      null,
      'card',
    ]) {
      const node = renderComponent(bad);
      expect(node.classList.contains('v2-comp--invalid'), JSON.stringify(bad)).toBe(true);
    }
  });

  it('恶意载荷只进文本节点：脚本不会执行也不会成为标签', () => {
    const node = renderComponent({
      type: 'card',
      title: '<img src=x onerror=alert(1)>',
      meaning: '<script>evil()</script>',
    });
    expect(node.querySelector('script')).toBeNull();
    expect(node.querySelector('img')).toBeNull();
    expect(node.textContent).toContain('<img src=x onerror=alert(1)>');
  });
});

describe('DSL 原语渲染（T3）', () => {
  it('card：词条卡字段齐全渲染', () => {
    const node = renderComponent({
      type: 'card',
      title: 'n. 适应',
      word: 'adapt',
      phonetic: '/əˈdæpt/',
      pos: 'vt.',
      meaning: '适应；改编',
      example: 'She adapted quickly.',
      exampleZh: '她很快适应。',
      badge: 'unit1',
      lines: ['重点词 1', '重点词 2'],
    });
    expect(node.getAttribute('data-comp-type')).toBe('card');
    expect(node.textContent).toContain('adapt');
    expect(node.textContent).toContain('/əˈdæpt/');
    expect(node.textContent).toContain('适应；改编');
    expect(node.querySelectorAll('.v2-card__lines li')).toHaveLength(2);
  });

  it('card：items 列表行形态（词汇卡：标题 + 若干「单词 释义」行）', () => {
    const node = renderComponent({
      type: 'card',
      title: '词汇卡',
      items: ['apple 苹果', 'banana 香蕉', 42, ''],
    });
    expect(node.getAttribute('data-comp-type')).toBe('card');
    const rows = [...node.querySelectorAll('.v2-card__items li')].map((n) => n.textContent);
    expect(rows).toEqual(['apple 苹果', 'banana 香蕉']); // 非字符串行被过滤
    expect(node.textContent).toContain('词汇卡');
  });

  it('quiz：作答判分 + 回调 + 选项锁定', () => {
    const onQuizAnswer = vi.fn();
    const node = renderComponent(
      { type: 'quiz', id: 'q1', stem: '「适应」的英文是？', options: ['adopt', 'adapt', 'adept'], answerIndex: 1, explanation: 'adapt = 适应' },
      { onQuizAnswer },
    );
    const buttons = [...node.querySelectorAll('button.v2-quiz__option')] as HTMLButtonElement[];
    expect(buttons).toHaveLength(3);

    buttons[0]!.click(); // 答错
    expect(onQuizAnswer).toHaveBeenCalledWith({ id: 'q1', correct: false, choiceIndex: 0, choice: 'adopt' });
    expect(buttons.every((b) => b.disabled)).toBe(true);
    expect(buttons[1]!.classList.contains('v2-quiz__option--correct')).toBe(true);
    expect(buttons[0]!.classList.contains('v2-quiz__option--wrong')).toBe(true);
    const result = node.querySelector('.v2-quiz__result')!;
    expect((result as HTMLElement).hidden).toBe(false);
    expect(result.textContent).toContain('adapt = 适应');

    buttons[2]!.click(); // 已作答锁定：不再回调
    expect(onQuizAnswer).toHaveBeenCalledTimes(1);
  });

  it('quiz：答对路径回调 correct=true', () => {
    const onQuizAnswer = vi.fn();
    const node = renderComponent(
      { type: 'quiz', id: 'q2', stem: '1+1?', options: ['1', '2'], answerIndex: 1 },
      { onQuizAnswer },
    );
    ([...node.querySelectorAll('button.v2-quiz__option')] as HTMLButtonElement[])[1]!.click();
    expect(onQuizAnswer).toHaveBeenCalledWith({ id: 'q2', correct: true, choiceIndex: 1, choice: '2' });
  });

  it('progress：value 越界收敛到 0~100，环上 aria 与弧长同步', () => {
    const node = renderComponent({ type: 'progress', label: '今日完成度', value: 146, hint: 'x/y' });
    const ring = node.querySelector('[data-testid="v2-progress-ring"]')!;
    expect(ring.getAttribute('aria-valuenow')).toBe('100');
    expect(ring.getAttribute('aria-valuemin')).toBe('0');
    expect(ring.getAttribute('aria-valuemax')).toBe('100');
    expect(ring.getAttribute('aria-label')).toBe('今日完成度');
    expect(node.textContent).toContain('100%');
    // 弧长：满值时 dashoffset 归零（整圈填满）
    const full = node.querySelector('.v2-progress__ring-fill')!;
    expect(parseFloat(full.getAttribute('stroke-dashoffset')!)).toBeCloseTo(0, 5);

    const zero = renderComponent({ type: 'progress', value: -8 });
    const zeroRing = zero.querySelector('[data-testid="v2-progress-ring"]')!;
    expect(zeroRing.getAttribute('aria-valuenow')).toBe('0');
    // 零值时 dashoffset = 周长（整圈留空）
    const empty = zero.querySelector('.v2-progress__ring-fill')!;
    expect(parseFloat(empty.getAttribute('stroke-dashoffset')!)).toBeCloseTo(2 * Math.PI * 34, 5);
  });

  it('progress：进度环是 SVG 原生节点（createElementNS 通道，无标记拼接）', () => {
    const node = renderComponent({ type: 'progress', value: 60, label: '今日进度' });
    const ring = node.querySelector('[data-testid="v2-progress-ring"]')!;
    expect(ring.namespaceURI).toBe('http://www.w3.org/2000/svg');
    const fill = node.querySelector('.v2-progress__ring-fill')!;
    // 60%：dashoffset = 周长 × (1 - 0.6)
    expect(parseFloat(fill.getAttribute('stroke-dashoffset')!)).toBeCloseTo(2 * Math.PI * 34 * 0.4, 5);
    expect(node.textContent).toContain('60%');
    expect(node.textContent).toContain('今日进度');
  });

  it('list：ordered / tone 变体', () => {
    const node = renderComponent({ type: 'list', title: '错题', items: ['a', 'b'], ordered: true, tone: 'wrong' });
    expect(node.classList.contains('v2-list--wrong')).toBe(true);
    expect(node.querySelector('ol.v2-list__items')).toBeTruthy();
    expect(node.querySelectorAll('li')).toHaveLength(2);
  });

  it('audio：不支持语音时降级为纯文本提示；支持时挂朗读按钮', () => {
    const unsupported = renderComponent({ type: 'audio', text: 'hello world' });
    expect(unsupported.textContent).toContain('hello world');
    expect(unsupported.textContent).toContain('不支持语音朗读');

    const play = vi.fn();
    const stop = vi.fn();
    const supported = renderComponent(
      { type: 'audio', text: 'hello', rate: 9 }, // rate 越界收敛到 2
      {
        speech: {
          supported: true,
          play,
          stop,
          state: 'idle',
          currentId: null,
          subscribe: () => () => {},
        },
      },
    );
    const btn = supported.querySelector('button.v2-audio__btn') as HTMLButtonElement;
    btn.click();
    expect(play).toHaveBeenCalledWith(expect.any(String), 'hello', 2);
  });

  it('timer：mm:ss 展示 + 收敛', () => {
    expect(formatClock(195)).toBe('3:15');
    const node = renderComponent({ type: 'timer', seconds: 99999, label: '限时' });
    expect(node.querySelector('.v2-timer__clock')!.textContent).toBe('60:00');
  });
});

describe('围栏提取（模型输出 → 组件流）', () => {
  it('提取合法围栏、剥离正文；坏 JSON 跳过并计数', () => {
    const reply = [
      '先看计划：',
      '```component',
      JSON.stringify({ type: 'progress', value: 40, label: '今日' }),
      '```',
      '再来一张词卡：',
      '```component',
      '{ bad json',
      '```',
      '正文结束。',
    ].join('\n');
    const { cleanText, specs, skipped } = extractComponents(reply);
    expect(specs.map((s) => s.type)).toEqual(['progress']);
    expect(skipped).toBe(1);
    expect(cleanText).toContain('先看计划：');
    expect(cleanText).toContain('正文结束。');
    expect(cleanText).not.toContain('component');
  });

  it('非法形状（未知 type）计为 skipped', () => {
    const { specs, skipped } = extractComponents(
      `${toComponentFence({ type: 'progress', value: 10 })}\n\`\`\`component\n{"type":"nope"}\n\`\`\``,
    );
    expect(specs).toHaveLength(1);
    expect(skipped).toBe(1);
  });

  it('toComponentFence 产出的围栏可被解析回同一 spec（归一化补默认字段）', () => {
    const spec = { type: 'list' as const, items: ['x'] };
    const { specs } = extractComponents(`头\n${toComponentFence(spec)}\n尾`);
    expect(specs[0]).toMatchObject(spec);
    expect(specs[0]).toMatchObject({ ordered: false, tone: 'default' });
  });

  it('parseComponentSpec：白名单类型快速判定', () => {
    expect(parseComponentSpec({ type: 'timer', seconds: 30 })).not.toBeNull();
    expect(parseComponentSpec({ type: 'bomb' })).toBeNull();
  });
});
