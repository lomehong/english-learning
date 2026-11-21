import { describe, it, expect } from 'vitest';
import { createOfflineTutor } from './offline';
import { extractComponents } from '../components/dsl';
import type { AgentEvent, ChatMessage } from '../types';
import type { StorageLike } from '../../store/progress';
import { loadWrongBook } from '../../store/wrongbook';
import { loadProgress } from '../../store/progress';
import { loadStats } from '../../store/stats';
import { loadDaily, dayKey } from '../../store/daily';
import { queryVocab, getLearningState } from '../tools';

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

/** 跑一轮对话，收集事件与最终消息 */
async function turn(
  tutor: ReturnType<typeof makeTutor>,
  history: ChatMessage[],
): Promise<{ deltas: string; message: ChatMessage | null }> {
  const parts: string[] = [];
  const message = await tutor.run(history, (event) => {
    if (event.type === 'text-delta') parts.push(event.text);
  });
  return { deltas: parts.join(''), message };
}

function withUser(text: string): ChatMessage[] {
  return [{ role: 'user', content: text }];
}

describe('离线陪学剧本（T5：学习闭环）', () => {
  it('Agent 形状：offline=true，label=离线陪学', () => {
    const tutor = makeTutor(memory());
    expect(tutor.offline).toBe(true);
    expect(tutor.label).toBe('离线陪学');
    expect(tutor.stage).toBe('idle');
  });

  it('「开始今天的学习」→ 每日计划：真实状态 + progress 组件 + 首组词汇卡（card/audio/timer）', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    const { deltas, message } = await turn(tutor, withUser('开始今天的学习'));

    // 流式增量与最终消息一致
    expect(deltas).toBe(message!.content);
    const { specs, cleanText } = extractComponents(message!.content);
    expect(cleanText).toContain('今日目标');
    expect(cleanText).toContain('先攻 unit1');

    const types = specs.map((s) => s.type);
    expect(types).toContain('progress');
    expect(types).toContain('timer');
    // 计划卡（T5）：闭环四步写进一张卡；首组 4 词另有 4 张词卡
    const cardSpecs = specs.filter((s) => s.type === 'card');
    const planCard = cardSpecs.find((s) => s.word === undefined)!;
    expect(planCard.title).toBe('今日学习计划');
    expect(planCard.items?.join(' ')).toContain('错题');
    expect(cardSpecs.filter((s) => s.word !== undefined)).toHaveLength(4);
    expect(types.filter((t) => t === 'audio').length).toBeGreaterThanOrEqual(4); // 每词可跟读
    expect(tutor.stage).toBe('cards');

    // 计划数据来自真实 store（此刻未记账，完成度 0）
    const progress = specs.find((s) => s.type === 'progress')!;
    expect(progress).toMatchObject({ type: 'progress', value: 0 });
  });

  it('「继续」→ 下一组卡；未学词耗尽后提示去小测', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    await turn(tutor, withUser('开始今天的学习'));
    const second = await turn(tutor, withUser('继续'));
    const secondSpecs = extractComponents(second.message!.content).specs;
    expect(secondSpecs.filter((s) => s.type === 'card').length).toBeGreaterThan(0);

    // 把剩余组全部走完
    for (let i = 0; i < 30; i += 1) {
      const next = await turn(tutor, withUser('继续'));
      if (next.message!.content.includes('直接上小测')) break;
    }
    const exhausted = await turn(tutor, withUser('继续'));
    expect(exhausted.message!.content).toContain('直接上小测');
  });

  it('闭环主链路：小测作答 → record_answer 记账 → 错题入本 → 进度更新（全程对话内）', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    await turn(tutor, withUser('开始今天的学习'));

    const quizTurn = await turn(tutor, withUser('来一组小测'));
    const quizSpecs = extractComponents(quizTurn.message!.content).specs.filter((s) => s.type === 'quiz');
    expect(quizSpecs.length).toBeGreaterThanOrEqual(2);
    expect(quizSpecs.length).toBeLessThanOrEqual(5);
    expect(quizTurn.message!.content).toContain('小测开始');
    expect(tutor.stage).toBe('quiz');

    // 逐题作答：第一题故意答错（选项取非 answerIndex），其余答对
    for (let i = 0; i < quizSpecs.length; i += 1) {
      const q = quizSpecs[i] as { id: string; answerIndex: number; options: string[] };
      const wrongIndex = (q.answerIndex + 1) % q.options.length;
      const answerWrong = i === 0;
      const note = tutor.handleQuizAnswer({
        id: q.id,
        correct: !answerWrong,
        choiceIndex: answerWrong ? wrongIndex : q.answerIndex,
        choice: q.options[answerWrong ? wrongIndex : q.answerIndex]!,
      });
      expect(note).not.toBeNull();
      if (i < quizSpecs.length - 1) {
        expect(note).toContain('还剩');
      } else {
        // 最后一题 → 收尾汇总：进度更新 + 错题本状态
        expect(note).toContain('本轮小测');
        expect(note).toContain('今日完成度');
        const noteSpecs = extractComponents(note!).specs;
        expect(noteSpecs.map((s) => s.type)).toContain('progress');
      }
    }
    expect(tutor.stage).toBe('idle');

    // 闭环状态（T5 tracker）：五步全部 done，本轮完成时间已盖戳
    // （词汇步在开测时收口——正常流「学完才测」，见 loop.ts quiz-started）
    const loopSnap = tutor.loop.get();
    expect(loopSnap.steps).toEqual({
      plan: 'done',
      cards: 'done',
      quiz: 'done',
      wrongbook: 'done',
      progress: 'done',
    });
    expect(loopSnap.quiz).toEqual({ answered: quizSpecs.length, total: quizSpecs.length, correct: quizSpecs.length - 1 });
    expect(loopSnap.wrongAdded).toBe(1);
    expect(loopSnap.finishedAt).not.toBeNull();

    // ---- store 侧断言：记账真实落盘 ----
    const wrong = loadWrongBook(storage);
    expect(Object.keys(wrong.entries)).toHaveLength(1); // 第一题答错入本
    expect(Object.values(wrong.entries)[0]!.module).toBe('vocab');

    const progress = loadProgress(storage);
    expect(Object.keys(progress.cards).length).toBe(quizSpecs.length); // 每题一词入 SRS
    const stats = loadStats(storage);
    expect(stats.modules.vocab).toEqual({ answered: quizSpecs.length, correct: quizSpecs.length - 1 });
    const daily = loadDaily(storage);
    expect(daily.days[dayKey(NOW)]).toMatchObject({ vocab: quizSpecs.length, exercises: quizSpecs.length });

    // 状态汇总反映新进度
    const state = getLearningState({ storage, now: () => NOW });
    expect(state.learnedWords).toBe(quizSpecs.length);
    expect(state.wrongbook.total).toBe(1);
  });

  it('闭环跟踪（T5 tracker）：出卡累计 → 出题 → 零错题收尾 → 错题复盘 → 新计划重置', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);

    await turn(tutor, withUser('开始今天的学习'));
    let snap = tutor.loop.get();
    expect(snap.steps.plan).toBe('done');
    expect(snap.steps.cards).toBe('active');
    expect(snap.cards).toEqual({ shown: 4, total: snap.cards.total });
    expect(snap.cards.total).toBeGreaterThan(4);

    await turn(tutor, withUser('继续'));
    expect(tutor.loop.get().cards.shown).toBe(8); // 累计出卡

    const quizTurn = await turn(tutor, withUser('来一组小测'));
    expect(tutor.loop.get().quiz.total).toBeGreaterThanOrEqual(2);
    expect(tutor.loop.get().steps.quiz).toBe('active');

    // 全部答对（零错题）：quiz-finished 把错题步按「无需入本」完成，progress 收尾盖戳
    const quizSpecs = extractComponents(quizTurn.message!.content).specs.filter((s) => s.type === 'quiz');
    for (const q of quizSpecs) {
      const quiz = q as { id: string; answerIndex: number; options: string[] };
      tutor.handleQuizAnswer({
        id: quiz.id,
        correct: true,
        choiceIndex: quiz.answerIndex,
        choice: quiz.options[quiz.answerIndex]!,
      });
    }
    snap = tutor.loop.get();
    // 开测即收口词汇步（loop.ts quiz-started 语义），其余四步随后完成
    expect(snap.steps).toEqual({ plan: 'done', cards: 'done', quiz: 'done', wrongbook: 'done', progress: 'done' });
    expect(snap.wrongAdded).toBe(0);
    expect(snap.finishedAt).not.toBeNull();

    // 错题复盘完成错题步（新一轮闭环从 pending 开始）
    await turn(tutor, withUser('开始今天的学习'));
    expect(tutor.loop.get().steps.wrongbook).toBe('pending');
    await turn(tutor, withUser('看看错题本'));
    expect(tutor.loop.get().steps.wrongbook).toBe('done');

    // 新计划是唯一重置点
    await turn(tutor, withUser('开始今天的学习'));
    const reset = tutor.loop.get();
    expect(reset.steps.quiz).toBe('pending');
    expect(reset.steps.progress).toBe('pending');
    expect(reset.finishedAt).toBeNull();
  });

  it('剧本数据读取发工具事件：tool-start / tool-end 成对且成功（壳层可见工具调用）', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    const events: AgentEvent[] = [];
    await tutor.run(withUser('看看错题本'), (event) => events.push(event));

    const names = (type: 'tool-start' | 'tool-end') =>
      events.filter((e) => e.type === type).map((e) => (e as { name: string }).name);
    expect(names('tool-start')).toContain('query_wrongbook');
    expect(names('tool-start')).toEqual(names('tool-end')); // 成对收口
    expect(events.filter((e) => e.type === 'tool-end').every((e) => e.type === 'tool-end' && e.ok)).toBe(true);

    const planEvents: AgentEvent[] = [];
    await tutor.run(withUser('开始今天的学习'), (event) => planEvents.push(event));
    const planNames = planEvents.filter((e) => e.type === 'tool-start').map((e) => (e as { name: string }).name);
    expect(planNames).toContain('get_learning_state');
    expect(planNames).toContain('query_vocab');
    // 工具事件先于正文流式输出（状态行先出现，再打字机输出）
    const firstDelta = planEvents.findIndex((e) => e.type === 'text-delta');
    const lastToolEnd = planEvents.map((e) => e.type).lastIndexOf('tool-end');
    expect(lastToolEnd).toBeLessThan(firstDelta);
  });

  it('错题复盘：查错题本（有错题时渲染 list wrong 组件）', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    await turn(tutor, withUser('来一组小测'));
    const { message: quizMsg } = await turn(tutor, withUser('来一组小测'));
    const quizSpecs = extractComponents(quizMsg!.content).specs.filter((s) => s.type === 'quiz');
    const q = quizSpecs[0] as { id: string; answerIndex: number; options: string[] };
    tutor.handleQuizAnswer({
      id: q.id,
      correct: false,
      choiceIndex: (q.answerIndex + 1) % q.options.length,
      choice: q.options[(q.answerIndex + 1) % q.options.length]!,
    });

    const wrongTurn = await turn(tutor, withUser('看看错题本'));
    const { specs, cleanText } = extractComponents(wrongTurn.message!.content);
    expect(cleanText).toContain('错题本共 1 条');
    expect(specs.find((s) => s.type === 'list')).toMatchObject({ type: 'list', tone: 'wrong' });
  });

  it('换单元：「背 unit2 的词」切换教学单元', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    const { message } = await turn(tutor, withUser('背 unit2 的词'));
    expect(message!.content).toContain('先攻 unit2');
    const cards = extractComponents(message!.content).specs.filter((s) => s.type === 'card');
    for (const card of cards) {
      expect(card).toMatchObject({ badge: 'unit2' });
    }
  });

  it('直接问词：查词出卡；无意图给指令引导', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    const { specs, cleanText } = extractComponents(
      (await turn(tutor, withUser('adapt 什么意思'))).message!.content,
    );
    expect(cleanText).toContain('查到了');
    expect(specs.some((s) => s.type === 'card')).toBe(true);

    const idle = await turn(tutor, withUser('啦啦啦'));
    expect(idle.message!.content).toContain('开始今天的学习');
  });

  it('重复作答同一题被忽略；未知 quiz id 返回 null', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    await turn(tutor, withUser('来一组小测'));
    const { message } = await turn(tutor, withUser('来一组小测'));
    const quizSpecs = extractComponents(message!.content).specs.filter((s) => s.type === 'quiz');
    const q = quizSpecs[0] as { id: string; answerIndex: number; options: string[] };
    const first = tutor.handleQuizAnswer({
      id: q.id,
      correct: true,
      choiceIndex: q.answerIndex,
      choice: q.options[q.answerIndex]!,
    });
    expect(first).not.toBeNull();
    const dup = tutor.handleQuizAnswer({
      id: q.id,
      correct: true,
      choiceIndex: q.answerIndex,
      choice: q.options[q.answerIndex]!,
    });
    expect(dup).toBeNull();
    expect(tutor.handleQuizAnswer({ id: 'ghost', correct: true, choiceIndex: 0, choice: 'x' })).toBeNull();
    // 重复作答不重复记账
    const stats = loadStats(storage);
    expect(stats.modules.vocab.answered).toBe(1);
  });

  it('quiz 选项来自词表真实释义/拼写（可判分）', async () => {
    const storage = memory();
    const tutor = makeTutor(storage);
    await turn(tutor, withUser('开始今天的学习'));
    const { message } = await turn(tutor, withUser('来一组小测'));
    const quizSpecs = extractComponents(message!.content).specs.filter((s) => s.type === 'quiz');
    for (const q of quizSpecs) {
      const quiz = q as { options: string[]; answerIndex: number };
      const answer = quiz.options[quiz.answerIndex]!;
      const { items } = queryVocab({ keyword: answer, limit: 20 }, { storage, now: () => NOW });
      // 答案要么是词表里的拼写，要么是词表里的释义文本
      expect(items.some((w) => w.word === answer || w.meaning === answer || answer.includes(' '))).toBe(true);
    }
  });
});
