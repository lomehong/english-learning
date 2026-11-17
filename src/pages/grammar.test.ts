import { describe, it, expect } from 'vitest';
import { renderGrammar } from './grammar';
import { emptyWrongBook, type WrongBook } from '../store/wrongbook';
import { unit1Exercises } from '../data/unit1-grammar';
import type { McqExercise } from '../types';
import type { GrammarDeps } from './deps';

const NOW = Date.UTC(2026, 0, 1);

/** 第一道单选题（g1）的正确/错误选项按钮选择器（从数据推导，不依赖 DOM 泄露答案） */
function g1Options(container: HTMLElement): { correct: HTMLButtonElement; wrong: HTMLButtonElement } {
  const g1 = unit1Exercises.find((e) => e.id === 'g1') as McqExercise;
  const rightText = g1.options[g1.answerIndex];
  const buttons = [...container.querySelectorAll<HTMLButtonElement>('.exercise[data-type="mcq"] button.option')];
  const correct = buttons.find((b) => b.textContent!.includes(rightText))!;
  const wrong = buttons.find((b) => !b.textContent!.includes(rightText))!;
  return { correct, wrong };
}

function makeDeps(initial: WrongBook = emptyWrongBook()): GrammarDeps & { saved: WrongBook[] } {
  let state = initial;
  const saved: WrongBook[] = [];
  return {
    load: () => state,
    save: (b) => {
      state = b;
      saved.push(b);
    },
    now: () => NOW,
    saved,
  };
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function submit(form: Element): void {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('语法页 · 讲解卡', () => {
  it('渲染「一般现在时」与「现在进行时」两张讲解卡', () => {
    const container = document.createElement('div');
    renderGrammar(container, makeDeps());

    const cards = container.querySelectorAll('.grammar-card');
    expect(cards).toHaveLength(2);
    expect(container.textContent).toContain('一般现在时');
    expect(container.textContent).toContain('现在进行时');
    expect(container.textContent).toContain('客观事实');
    expect(container.querySelectorAll('.grammar-card__example').length).toBeGreaterThanOrEqual(6);
  });
});

describe('语法页 · 练习判分', () => {
  it('渲染 10 道题：单选题含四个选项，填空题含输入框与提交按钮', () => {
    const container = document.createElement('div');
    renderGrammar(container, makeDeps());

    const exercises = container.querySelectorAll('.exercise');
    expect(exercises).toHaveLength(10);

    const mcq = container.querySelector('.exercise[data-type="mcq"]')!;
    expect(mcq.querySelectorAll('button.option')).toHaveLength(4);

    const fill = container.querySelector('.exercise[data-type="fill"]')!;
    expect(fill.querySelector('input.exercise__input')).toBeTruthy();
    expect([...fill.querySelectorAll('button')].some((b) => b.textContent!.includes('提交'))).toBe(true);
  });

  it('单选答对：即时判分正确、展示解析、选项锁定、不写错题本', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderGrammar(container, deps);

    const first = container.querySelector('.exercise[data-type="mcq"]')!;
    click(g1Options(container).correct);

    expect(first.classList.contains('exercise--correct')).toBe(true);
    expect(first.textContent).toContain('解析');
    expect(first.textContent).toContain('现在进行时');
    expect([...first.querySelectorAll<HTMLButtonElement>('button.option')].every((b) => b.disabled)).toBe(true);
    expect(deps.saved).toHaveLength(0);
    expect(container.querySelector('[data-testid="drill-stat"]')!.textContent).toContain('已答 1 / 10');
    expect(container.querySelector('[data-testid="drill-stat"]')!.textContent).toContain('答对 1');
  });

  it('单选答错：判分错误、给出正确答案、自动写入错题本并显示', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderGrammar(container, deps);

    const first = container.querySelector('.exercise[data-type="mcq"]')!;
    click(g1Options(container).wrong);

    expect(first.classList.contains('exercise--wrong')).toBe(true);
    expect(first.textContent).toContain('正确答案');
    expect(first.textContent).toContain('is singing');
    expect(first.querySelector('.exercise__result')!.textContent).toContain('sings');

    // 错题自动入本（经 deps.save 持久化）
    expect(deps.saved).toHaveLength(1);
    const entry = deps.load().entries['g1'];
    expect(entry).toBeDefined();
    expect(entry.wrongCount).toBe(1);
    expect(entry.lastWrongAt).toBe(NOW);

    // 错题本区域展示该错题
    const wrongbook = container.querySelector('[data-testid="wrongbook"]')!;
    expect(wrongbook.textContent).toContain('Listen! Someone');
    expect(wrongbook.querySelector('[data-testid="wrong-count"]')!.textContent).toContain('1');
  });

  it('填空答对（等价形式）：忽略大小写与空格差异', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderGrammar(container, deps);

    const g8 = container.querySelector('.exercise[data-exercise="g8"]')!;
    const input = g8.querySelector<HTMLInputElement>('input.exercise__input')!;
    input.value = '  Does Not Like. ';
    submit(g8.querySelector('form.exercise__fill')!);

    expect(g8.classList.contains('exercise--correct')).toBe(true);
    expect(deps.saved).toHaveLength(0);
  });

  it('填空答错：判分错误、展示正确答案、写入错题本', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderGrammar(container, deps);

    const g9 = container.querySelector('.exercise[data-exercise="g9"]')!;
    const input = g9.querySelector<HTMLInputElement>('input.exercise__input')!;
    input.value = 'is running';
    submit(g9.querySelector('form.exercise__fill')!);

    expect(g9.classList.contains('exercise--wrong')).toBe(true);
    expect(g9.querySelector('.exercise__result')!.textContent).toContain('are running');
    expect(deps.load().entries['g9']).toBeDefined();
  });

  it('每题只能作答一次：判分后再次点击不再重复判分', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderGrammar(container, deps);

    click(g1Options(container).wrong);
    click(g1Options(container).wrong);

    expect(deps.saved).toHaveLength(1);
    expect(deps.load().entries['g1'].wrongCount).toBe(1);
  });
});

describe('语法页 · 错题本', () => {
  it('初始为空状态，显示「暂无错题」', () => {
    const container = document.createElement('div');
    renderGrammar(container, makeDeps());
    const wrongbook = container.querySelector('[data-testid="wrongbook"]')!;
    expect(wrongbook.querySelector('[data-testid="wrong-empty"]')!.textContent).toContain('暂无错题');
  });

  it('清空错题本：条目移除并持久化空本', () => {
    const deps = makeDeps();
    const container = document.createElement('div');
    renderGrammar(container, deps);

    click(g1Options(container).wrong);
    expect(container.querySelectorAll('.wrong-item')).toHaveLength(1);

    click(container.querySelector<HTMLButtonElement>('[data-testid="wrong-clear"]')!);

    expect(container.querySelectorAll('.wrong-item')).toHaveLength(0);
    expect(deps.load().entries).toEqual({});
    expect(container.querySelector('[data-testid="wrong-empty"]')).toBeTruthy();
  });

  it('载入已有错题（上次会话答错）：列表直接展示', () => {
    const initial = emptyWrongBook();
    initial.entries['g7'] = {
      exerciseId: 'g7',
      stem: 'My sister usually ______ (study) English grammar on weekends.',
      yourAnswer: 'study',
      correctAnswer: 'studies',
      explanation: '一般现在时三单。',
      wrongCount: 3,
      lastWrongAt: NOW - 86400000,
    };
    const container = document.createElement('div');
    renderGrammar(container, makeDeps(initial));

    const wrongbook = container.querySelector('[data-testid="wrongbook"]')!;
    expect(wrongbook.querySelectorAll('.wrong-item')).toHaveLength(1);
    expect(wrongbook.textContent).toContain('studies');
    expect(wrongbook.querySelector('[data-testid="wrong-count"]')!.textContent).toContain('1');
  });
});
