import { describe, it, expect } from 'vitest';
import { unit1WritingTasks } from './unit1-writing';
import { unit2WritingTasks } from './unit2-writing';
import { unit3WritingTasks } from './unit3-writing';
import { countEssayWords, getWritingTask, getWritingTasksByUnit } from './writing';

/** 写作任务数据完整性（两单元共用同一套约束） */
function expectWritingTasksValid(tasks: typeof unit1WritingTasks, label: string): void {
  it(`${label}：内置 2 个主题写作任务，id 唯一且可按 id 查询`, () => {
    expect(tasks).toHaveLength(2);
    const ids = tasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
    for (const id of ids) expect(getWritingTask(id)?.id).toBe(id);
  });

  it(`${label}：每个任务要素齐全：情境 / 要点 / 范文 / 自评清单 / 词数要求`, () => {
    for (const task of tasks) {
      expect(task.title).not.toBe('');
      expect(task.genre).toContain('·');
      expect(task.wordHint).toContain('词数');
      expect(task.prompt.length).toBeGreaterThanOrEqual(20);
      expect(task.requirements.length).toBeGreaterThanOrEqual(3);
      expect(task.checklist.length).toBeGreaterThanOrEqual(4);
      expect(task.modelEssay.join(' ').length).toBeGreaterThan(0);
    }
  });
}

describe('写作数据 · Unit 1（人教2019必修一）', () => {
  expectWritingTasksValid(unit1WritingTasks, 'Unit 1');

  it('getWritingTask 未知 id 返回 undefined', () => {
    expect(getWritingTask('w404')).toBeUndefined();
  });

  it('范文词数与词数要求匹配（80 左右 / 100 左右，允许 ±30）', () => {
    const [w1, w2] = unit1WritingTasks;
    const n1 = countEssayWords(w1!.modelEssay.join(' '));
    const n2 = countEssayWords(w2!.modelEssay.join(' '));
    expect(Math.abs(n1 - 80)).toBeLessThanOrEqual(30);
    expect(Math.abs(n2 - 100)).toBeLessThanOrEqual(30);
  });

  it('范文与清单复用 Unit 1 词表词汇', () => {
    const w1 = unit1WritingTasks[0]!;
    const w2 = unit1WritingTasks[1]!;
    expect(w1.modelEssay.join(' ').toLowerCase()).toContain('volunteer');
    expect(w1.checklist.join('')).toContain('suitable');
    expect(w2.modelEssay.join(' ').toLowerCase()).toContain('debate');
    expect(w2.modelEssay.join(' ').toLowerCase()).toContain('freshman');
  });

  it('countEssayWords 只计含字母的 token（与阅读/听力同口径）', () => {
    expect(countEssayWords('')).toBe(0);
    expect(countEssayWords('   ')).toBe(0);
    expect(countEssayWords('Dear Tom,')).toBe(2);
    expect(countEssayWords('I am 16 years old. — Li Hua')).toBe(6);
  });
});

describe('写作数据 · Unit 2（Travelling Around）', () => {
  expectWritingTasksValid(unit2WritingTasks, 'Unit 2');

  it('任务 id 均带 u2- 前缀，与 Unit 1 不冲突', () => {
    const unit1Ids = new Set(unit1WritingTasks.map((t) => t.id));
    for (const task of unit2WritingTasks) {
      expect(task.id.startsWith('u2-')).toBe(true);
      expect(unit1Ids.has(task.id)).toBe(false);
    }
  });

  it('范文词数与词数要求匹配（80 左右 / 100 左右，允许 ±30）', () => {
    const [w1, w2] = unit2WritingTasks;
    const n1 = countEssayWords(w1!.modelEssay.join(' '));
    const n2 = countEssayWords(w2!.modelEssay.join(' '));
    expect(Math.abs(n1 - 80)).toBeLessThanOrEqual(30);
    expect(Math.abs(n2 - 100)).toBeLessThanOrEqual(30);
  });

  it('范文与清单复用 Unit 2 词表词汇与语法点', () => {
    const w1 = unit2WritingTasks[0]!;
    const w2 = unit2WritingTasks[1]!;
    const essay1 = w1.modelEssay.join(' ').toLowerCase();
    const essay2 = w2.modelEssay.join(' ').toLowerCase();
    // Unit 2 词汇
    expect(essay1).toContain('rent');
    expect(essay1).toContain('official');
    expect(essay2).toContain('narrow');
    expect(essay2).toContain('amazing');
    // Unit 2 语法点：现在完成时 / 过去进行时
    expect(essay1).toContain('has already rented');
    expect(essay2).toContain('were riding');
    // 清单提到单元词汇与语法
    expect(w1.checklist.join('')).toContain('Unit 2');
    expect(w2.checklist.join('')).toContain('过去进行时');
  });
});

describe('写作数据 · Unit 3（Sports and Fitness）', () => {
  expectWritingTasksValid(unit3WritingTasks, 'Unit 3');

  it('任务 id 均带 u3- 前缀，与前两单元不冲突', () => {
    const otherIds = new Set([...unit1WritingTasks, ...unit2WritingTasks].map((t) => t.id));
    for (const task of unit3WritingTasks) {
      expect(task.id.startsWith('u3-')).toBe(true);
      expect(otherIds.has(task.id)).toBe(false);
    }
  });

  it('范文词数与词数要求匹配（80 左右 / 100 左右，允许 ±30）', () => {
    const [w1, w2] = unit3WritingTasks;
    const n1 = countEssayWords(w1!.modelEssay.join(' '));
    const n2 = countEssayWords(w2!.modelEssay.join(' '));
    expect(Math.abs(n1 - 80)).toBeLessThanOrEqual(30);
    expect(Math.abs(n2 - 100)).toBeLessThanOrEqual(30);
  });

  it('范文与清单复用 Unit 3 词表词汇与语法点', () => {
    const w1 = unit3WritingTasks[0]!;
    const w2 = unit3WritingTasks[1]!;
    const essay1 = w1.modelEssay.join(' ').toLowerCase();
    const essay2 = w2.modelEssay.join(' ').toLowerCase();
    // Unit 3 词汇
    expect(essay1).toContain('fitness');
    expect(essay1).toContain('gym');
    expect(essay2).toContain('stadium');
    expect(essay2).toContain('determination');
    // Unit 3 语法点：一般过去时 / 一般将来时
    expect(essay1).toContain('joined');
    expect(essay1).toContain('will compete');
    expect(essay2).toContain('missed');
    expect(essay2).toContain('will train');
    // 清单提到单元词汇与语法
    expect(w1.checklist.join('')).toContain('Unit 3');
    expect(w2.checklist.join('')).toContain('一般过去时');
  });
});

describe('写作注册表（按单元取用）', () => {
  it('getWritingTasksByUnit 按单元返回；getWritingTask 跨单元可查', () => {
    expect(getWritingTasksByUnit('unit1')).toBe(unit1WritingTasks);
    expect(getWritingTasksByUnit('unit2')).toBe(unit2WritingTasks);
    expect(getWritingTasksByUnit('unit3')).toBe(unit3WritingTasks);
    expect(getWritingTask('u2-w1')?.genre).toContain('电子邮件');
    expect(getWritingTask('u2-w2')?.genre).toContain('游记');
    expect(getWritingTask('u3-w1')?.genre).toContain('演讲稿');
    expect(getWritingTask('u3-w2')?.genre).toContain('校刊投稿');
  });
});
