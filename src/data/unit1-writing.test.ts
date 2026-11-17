import { describe, it, expect } from 'vitest';
import { unit1WritingTasks, getWritingTask, countEssayWords } from './unit1-writing';

describe('写作数据 · Unit 1（人教2019必修一）', () => {
  it('内置 2 个主题写作任务，id 唯一且可按 id 查询', () => {
    expect(unit1WritingTasks).toHaveLength(2);
    const ids = unit1WritingTasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(2);
    for (const id of ids) expect(getWritingTask(id)?.id).toBe(id);
    expect(getWritingTask('w404')).toBeUndefined();
  });

  it('每个任务要素齐全：情境 / 要点 / 范文 / 自评清单 / 词数要求', () => {
    for (const task of unit1WritingTasks) {
      expect(task.title).not.toBe('');
      expect(task.genre).toContain('·');
      expect(task.wordHint).toContain('词数');
      expect(task.prompt.length).toBeGreaterThanOrEqual(20);
      expect(task.requirements.length).toBeGreaterThanOrEqual(3);
      expect(task.checklist.length).toBeGreaterThanOrEqual(4);
      expect(task.modelEssay.join(' ').length).toBeGreaterThan(0);
    }
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
