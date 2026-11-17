import { describe, it, expect } from 'vitest';
import type { FillExercise, McqExercise } from '../types';
import {
  unit1GrammarPoints,
  unit1Exercises,
  getGrammarPoint,
  checkFillAnswer,
} from './unit1-grammar';

describe('语法点讲解卡数据', () => {
  it('内置「一般现在时」与「现在进行时」两张讲解卡', () => {
    expect(unit1GrammarPoints.map((p) => p.id).sort()).toEqual([
      'present-continuous',
      'simple-present',
    ]);
  });

  it('每张讲解卡内容完整（构成/用法/标志词/例句/易错点）', () => {
    for (const point of unit1GrammarPoints) {
      expect(point.title.trim().length).toBeGreaterThan(0);
      expect(point.tagline.trim().length).toBeGreaterThan(0);
      // 肯定 / 否定 / 疑问三种构成
      expect(point.forms.length).toBeGreaterThanOrEqual(3);
      expect(new Set(point.forms.map((f) => f.label)).size).toBe(point.forms.length);
      expect(point.usages.length).toBeGreaterThanOrEqual(3);
      expect(point.markers.length).toBeGreaterThanOrEqual(4);
      expect(point.examples.length).toBeGreaterThanOrEqual(3);
      expect(point.examples.every((e) => e.en.trim() !== '' && e.zh.trim() !== '')).toBe(true);
      expect(point.tips.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('getGrammarPoint 按 id 查询，未知 id 返回 undefined', () => {
    expect(getGrammarPoint('simple-present')?.title).toContain('一般现在时');
    expect(getGrammarPoint('nope')).toBeUndefined();
  });
});

describe('Unit 1 语法练习题数据', () => {
  it('共 10 题，id 唯一，含单选与填空两种题型', () => {
    expect(unit1Exercises).toHaveLength(10);
    expect(new Set(unit1Exercises.map((e) => e.id)).size).toBe(10);
    const types = new Set(unit1Exercises.map((e) => e.type));
    expect(types).toEqual(new Set(['mcq', 'fill']));
  });

  it('每题关联的语法点都存在，题干与解析非空', () => {
    for (const exercise of unit1Exercises) {
      expect(getGrammarPoint(exercise.pointId)).toBeDefined();
      expect(exercise.stem.trim().length).toBeGreaterThan(0);
      expect(exercise.explanation.trim().length).toBeGreaterThanOrEqual(8);
    }
  });

  it('单选题：不少于 6 题，四个选项互不相同，答案下标合法', () => {
    const mcqs = unit1Exercises.filter((e): e is McqExercise => e.type === 'mcq');
    expect(mcqs.length).toBeGreaterThanOrEqual(6);
    for (const mcq of mcqs) {
      expect(mcq.options).toHaveLength(4);
      expect(new Set(mcq.options).size).toBe(4);
      expect(mcq.answerIndex).toBeGreaterThanOrEqual(0);
      expect(mcq.answerIndex).toBeLessThan(mcq.options.length);
      expect(mcq.options[mcq.answerIndex].trim().length).toBeGreaterThan(0);
    }
  });

  it('填空题：不少于 4 题，题干含空位，标准答案能通过判分', () => {
    const fills = unit1Exercises.filter((e): e is FillExercise => e.type === 'fill');
    expect(fills.length).toBeGreaterThanOrEqual(4);
    for (const fill of fills) {
      expect(fill.stem).toContain('______');
      expect(fill.answer.trim().length).toBeGreaterThan(0);
      expect(checkFillAnswer(fill, fill.answer)).toBe(true);
    }
  });

  it('两个语法点均有练习题覆盖', () => {
    for (const point of unit1GrammarPoints) {
      expect(unit1Exercises.some((e) => e.pointId === point.id)).toBe(true);
    }
  });
});

describe('填空答案判定', () => {
  it('忽略大小写、首尾空格与多余空格', () => {
    const fill = unit1Exercises.find((e): e is FillExercise => e.type === 'fill')!;
    const padded = `  ${fill.answer.toUpperCase().split(' ').join('  ')} `;
    expect(checkFillAnswer(fill, padded)).toBe(true);
  });

  it('错误答案判为错误', () => {
    const fill = unit1Exercises.find((e): e is FillExercise => e.type === 'fill')!;
    expect(checkFillAnswer(fill, 'definitely-wrong')).toBe(false);
    expect(checkFillAnswer(fill, '')).toBe(false);
  });

  it('可接受等价形式（如 doesn\'t 展开为 does not）', () => {
    const withAlt = unit1Exercises.find(
      (e): e is FillExercise => e.type === 'fill' && (e.acceptable?.length ?? 0) > 0,
    )!;
    expect(withAlt).toBeDefined();
    expect(checkFillAnswer(withAlt, withAlt.acceptable![0])).toBe(true);
  });
});
