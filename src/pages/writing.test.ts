import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderWriting } from './writing';
import { unit1WritingTasks } from '../data/unit1-writing';
import { unit2WritingTasks } from '../data/unit2-writing';
import { countEssayWords } from '../data/writing';
import { emptyWritingDrafts, putDraft, type WritingDrafts } from '../store/writing';
import { setUnit, resetUnitState } from './unit-switch';
import type { WritingDeps } from './deps';

const NOW = Date.UTC(2026, 0, 1);

function makeDeps(initial: WritingDrafts = emptyWritingDrafts()): WritingDeps & { saved: WritingDrafts[] } {
  let state = initial;
  const saved: WritingDrafts[] = [];
  return {
    load: () => state,
    save: (drafts) => {
      state = drafts;
      saved.push(drafts);
    },
    now: () => NOW,
    saved,
  };
}

function type(el: HTMLTextAreaElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('写作页 · 渲染', () => {
  it('渲染 2 个写作任务：题目要求 / 要点 / 编辑器 / 自评清单 / 参考范文', () => {
    const container = document.createElement('div');
    renderWriting(container, makeDeps());

    const tasks = container.querySelectorAll('.writing-task');
    expect(tasks).toHaveLength(2);
    expect(container.textContent).toContain('Task 1 · Inviting a Friend to Join a Club');
    expect(container.textContent).toContain('应用文 · 邀请信');
    expect(container.textContent).toContain('记叙文 · 栏目投稿');
    expect(container.textContent).toContain('词数 80 左右');

    for (const task of unit1WritingTasks) {
      const section = container.querySelector(`[data-task="${task.id}"]`)!;
      expect(section.querySelectorAll('.writing-requirements li').length).toBe(task.requirements.length);
      expect(section.querySelectorAll('.writing-checklist__item input[type="checkbox"]')).toHaveLength(
        task.checklist.length,
      );
      const model = section.querySelector(`[data-testid="model-essay-${task.id}"]`)!;
      expect(model.textContent).toContain(task.modelEssay[0]!);
      expect(section.querySelector('details.writing-model')).toBeTruthy();
    }
  });

  it('无草稿时：编辑器为空、状态「暂无草稿」、词数为 0', () => {
    const container = document.createElement('div');
    renderWriting(container, makeDeps());

    const textarea = container.querySelector<HTMLTextAreaElement>('[data-testid="draft-editor-w1"]')!;
    expect(textarea.value).toBe('');
    expect(container.querySelector('[data-testid="draft-status-w1"]')!.textContent).toBe('暂无草稿');
    expect(container.querySelector('[data-testid="word-count-w1"]')!.textContent).toContain('已写 0 词');
  });

  it('已有草稿时回显：内容、状态与词数', () => {
    const drafts = putDraft(emptyWritingDrafts(), 'w1', 'Dear Tom, how are you?', NOW);
    const container = document.createElement('div');
    renderWriting(container, makeDeps(drafts));

    const textarea = container.querySelector<HTMLTextAreaElement>('[data-testid="draft-editor-w1"]')!;
    expect(textarea.value).toBe('Dear Tom, how are you?');
    expect(container.querySelector('[data-testid="draft-status-w1"]')!.textContent).toContain('草稿已保存');
    expect(container.querySelector('[data-testid="word-count-w1"]')!.textContent).toContain('已写 5 词');
    // 另一任务不受影响
    expect(container.querySelector('[data-testid="draft-status-w2"]')!.textContent).toBe('暂无草稿');
  });
});

describe('写作页 · 草稿保存（localStorage 接缝）', () => {
  it('输入即自动保存：内容/更新时间持久化，词数与状态同步', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderWriting(container, deps);

    const textarea = container.querySelector<HTMLTextAreaElement>('[data-testid="draft-editor-w2"]')!;
    type(textarea, 'My school life is busy but interesting.');

    const draft = deps.load().drafts['w2']!;
    expect(draft).toEqual({ content: 'My school life is busy but interesting.', updatedAt: NOW });
    expect(deps.saved).toHaveLength(1);
    expect(container.querySelector('[data-testid="draft-status-w2"]')!.textContent).toContain('草稿已保存');
    expect(container.querySelector('[data-testid="word-count-w2"]')!.textContent).toContain(
      `已写 ${countEssayWords('My school life is busy but interesting.')} 词`,
    );
  });

  it('清空草稿：移除存储条目并重置编辑器', () => {
    const deps = makeDeps(putDraft(emptyWritingDrafts(), 'w1', 'old draft', NOW));
    const container = document.createElement('div');
    renderWriting(container, deps);

    click(container.querySelector<HTMLButtonElement>('[data-testid="draft-clear-w1"]')!);

    expect(deps.load().drafts['w1']).toBeUndefined();
    const textarea = container.querySelector<HTMLTextAreaElement>('[data-testid="draft-editor-w1"]')!;
    expect(textarea.value).toBe('');
    expect(container.querySelector('[data-testid="draft-status-w1"]')!.textContent).toBe('暂无草稿');
    expect(container.querySelector('[data-testid="word-count-w1"]')!.textContent).toContain('已写 0 词');
  });

  it('空白内容不产生空草稿（等同删除）', () => {
    const deps = makeDeps(putDraft(emptyWritingDrafts(), 'w1', 'old draft', NOW));
    const container = document.createElement('div');
    renderWriting(container, deps);

    type(container.querySelector<HTMLTextAreaElement>('[data-testid="draft-editor-w1"]')!, '   ');

    expect(deps.load().drafts['w1']).toBeUndefined();
    expect(container.querySelector('[data-testid="draft-status-w1"]')!.textContent).toBe('暂无草稿');
  });
});

describe('写作页 · 自评清单', () => {
  it('勾选条目实时更新进度', () => {
    const container = document.createElement('div');
    renderWriting(container, makeDeps());

    const progress = container.querySelector('[data-testid="check-progress-w1"]')!;
    expect(progress.textContent).toBe(`已勾选 0 / ${unit1WritingTasks[0]!.checklist.length}`);

    const boxes = [
      ...container.querySelectorAll<HTMLInputElement>('[data-task="w1"] .writing-checklist__item input'),
    ];
    boxes[0]!.checked = true;
    boxes[1]!.checked = true;
    boxes[1]!.dispatchEvent(new Event('change', { bubbles: true }));

    expect(progress.textContent).toBe(`已勾选 2 / ${unit1WritingTasks[0]!.checklist.length}`);
  });
});

describe('写作页 · 全局单元联动（Unit 2）', () => {
  beforeEach(() => {
    resetUnitState();
    history.replaceState(null, '', '/writing?unit=unit2');
  });

  afterEach(() => {
    resetUnitState();
    history.replaceState(null, '', '/writing');
  });

  it('?unit=unit2 直链渲染 Unit 2 写作任务与范文，草稿独立保存', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderWriting(container, deps);

    expect(container.querySelector('h1')!.textContent).toContain('Unit 2');
    expect(container.querySelector('h1')!.textContent).toContain('Travelling Around');
    expect(container.textContent).toContain('Task 1 · Emailing a Travel Plan to a Friend');
    expect(container.textContent).toContain('Task 2 · A Trip to Remember');
    expect(container.textContent).toContain('应用文 · 电子邮件');
    expect(container.textContent).toContain('记叙文 · 游记投稿');

    for (const task of unit2WritingTasks) {
      expect(container.querySelector(`[data-task="${task.id}"]`)).toBeTruthy();
      const model = container.querySelector(`[data-testid="model-essay-${task.id}"]`)!;
      expect(model.textContent).toContain(task.modelEssay[0]!);
    }

    // 草稿写入 u2- 任务 id，与 Unit 1 互不影响
    const textarea = container.querySelector<HTMLTextAreaElement>('[data-testid="draft-editor-u2-w1"]')!;
    type(textarea, 'Dear Tom, my family will travel to Xi an.');
    expect(deps.load().drafts['u2-w1']!.content).toContain('Dear Tom');
    expect(deps.load().drafts['w1']).toBeUndefined();
  });

  it('已有 Unit 2 草稿回显，清空按钮按任务生效', () => {
    const deps = makeDeps(putDraft(emptyWritingDrafts(), 'u2-w2', 'A Trip to Remember draft.', NOW));
    const container = document.createElement('div');
    renderWriting(container, deps);

    const textarea = container.querySelector<HTMLTextAreaElement>('[data-testid="draft-editor-u2-w2"]')!;
    expect(textarea.value).toBe('A Trip to Remember draft.');
    expect(container.querySelector('[data-testid="draft-status-u2-w2"]')!.textContent).toContain('草稿已保存');

    click(container.querySelector<HTMLButtonElement>('[data-testid="draft-clear-u2-w2"]')!);
    expect(deps.load().drafts['u2-w2']).toBeUndefined();
  });

  it('?unit=2 数字写法深链：初始加载即 Unit 2 写作任务', () => {
    history.replaceState(null, '', '/writing?unit=2');
    const container = document.createElement('div');
    renderWriting(container, makeDeps());

    expect(container.querySelector('h1')!.textContent).toContain('Unit 2');
    expect(container.querySelector('h1')!.textContent).toContain('Travelling Around');
    expect(container.querySelector('[data-task="u2-w1"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="draft-editor-u2-w1"]')).toBeTruthy();
    expect(container.querySelector('[data-task="w1"]')).toBeNull();
  });

  it('?unit=oops 非法值深链回退 Unit 1 写作任务', () => {
    history.replaceState(null, '', '/writing?unit=oops');
    const container = document.createElement('div');
    renderWriting(container, makeDeps());

    expect(container.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(container.querySelector('[data-task="w1"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="draft-editor-w1"]')).toBeTruthy();
    expect(container.querySelector('[data-task="u2-w1"]')).toBeNull();
  });

  it('全局单元切回 Unit 1（setUnit，首页切换器同一入口）后重挂载：内容重建为 Unit 1 任务', () => {
    const container = document.createElement('div');
    renderWriting(container, makeDeps());

    setUnit('unit1');
    history.replaceState(null, '', '/writing'); // 模块页重挂载（读全局状态）
    container.replaceChildren();
    renderWriting(container, makeDeps());

    expect(container.querySelector('h1')!.textContent).toContain('Unit 1');
    expect(container.querySelector('[data-task="w1"]')).toBeTruthy();
    expect(container.querySelector('[data-task="u2-w1"]')).toBeNull();
  });

  it('?unit=unit3 深链渲染 Unit 3 写作任务与范文（草稿独立保存）', () => {
    history.replaceState(null, '', '/writing?unit=unit3');
    const deps = makeDeps();
    const container = document.createElement('div');
    renderWriting(container, deps);

    expect(container.querySelector('h1')!.textContent).toContain('Unit 3');
    expect(container.querySelector('[data-task="u3-w1"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="draft-editor-u3-w1"]')).toBeTruthy();
    expect(container.textContent).toContain('An Unforgettable Match');

    const textarea = container.querySelector<HTMLTextAreaElement>('[data-testid="draft-editor-u3-w1"]')!;
    type(textarea, 'Dear classmates, I love badminton.');
    expect(deps.load().drafts['u3-w1']!.content).toContain('badminton');
  });
});
