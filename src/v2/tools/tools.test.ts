import { describe, it, expect } from 'vitest';
import {
  getLearningState,
  queryVocab,
  queryWrongbook,
  recordAnswer,
  executeTool,
  V2_TOOL_DEFS,
} from './index';
import type { StorageLike } from '../../store/progress';
import { saveProgress, STORAGE_KEY as PROGRESS_KEY } from '../../store/progress';
import { loadWrongBook, STORAGE_KEY as WRONG_KEY } from '../../store/wrongbook';
import { loadDaily, dayKey, ACTIVITY_STORAGE_KEY } from '../../store/daily';
import { loadStats } from '../../store/stats';
import { createCard } from '../../srs/sm2';

const NOW = Date.UTC(2026, 10, 20, 4, 0, 0); // 2026-11-20 12:00 本地（+08）

function memory(initial: Record<string, string> = {}): StorageLike {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => void store.set(k, v),
  };
}

/** unit1 词表里取两个真实词 id，用于构造已学进度 */
function learnedWordIds(): string[] {
  const { items } = queryVocab({ unit: 'unit1', limit: 2 }, { now: () => NOW });
  return items.map((w) => w.wordId);
}

describe('数据工具 · get_learning_state（T4）', () => {
  it('空状态：全 0 + 默认目标 + 单元清单', () => {
    const state = getLearningState({ storage: memory(), now: () => NOW });
    expect(state.learnedWords).toBe(0);
    expect(state.totalWords).toBeGreaterThan(100);
    expect(state.dueReviews).toBe(0);
    expect(state.today).toEqual({ vocab: 0, vocabGoal: 10, exercises: 0, exercisesGoal: 10 });
    expect(state.overall).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.wrongbook.total).toBe(0);
    expect(state.units.length).toBeGreaterThan(0);
    expect(state.units[0]!.id).toBe('unit1');
  });

  it('已学 + 到期 + 今日活动 + 错题本：四份 store 汇总', () => {
    const ids = learnedWordIds();
    const storage = memory();
    saveProgress(
      {
        version: 1,
        cards: {
          [ids[0]!]: createCard(ids[0]!, NOW - 1), // 已到期
          [ids[1]!]: createCard(ids[1]!, NOW + 86_400_000), // 未到期
        },
      },
      storage,
    );
    storage.setItem(WRONG_KEY, JSON.stringify({
      version: 1,
      entries: {
        'w:x': { exerciseId: 'w:x', module: 'vocab', stem: 's', yourAnswer: 'a', correctAnswer: 'b', explanation: 'e', wrongCount: 2, lastWrongAt: NOW },
        g1: { exerciseId: 'g1', module: 'grammar', stem: 's', yourAnswer: 'a', correctAnswer: 'b', explanation: 'e', wrongCount: 1, lastWrongAt: NOW },
      },
    }));
    storage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify({
      version: 1,
      days: { [dayKey(NOW)]: { vocab: 3, exercises: 5 } },
    }));
    const state = getLearningState({ storage, now: () => NOW });
    expect(state.learnedWords).toBe(2);
    expect(state.dueReviews).toBe(1);
    expect(state.wrongbook).toEqual({ total: 2, byModule: { vocab: 1, grammar: 1 } });
    expect(state.today).toEqual({ vocab: 3, vocabGoal: 10, exercises: 5, exercisesGoal: 10 });
  });
});

describe('数据工具 · query_vocab（T4）', () => {
  it('关键词命中拼写与中文释义（不区分大小写）', () => {
    const { items, total } = queryVocab({ keyword: 'ADAPT', limit: 5 }, { now: () => NOW });
    expect(total).toBeGreaterThanOrEqual(items.length);
    for (const item of items) {
      expect(item.word.toLowerCase().includes('adapt') || item.meaning.includes('ADAPT')).toBe(true);
    }
  });

  it('单元过滤 + limit 上限收敛', () => {
    const all = queryVocab({ unit: 'unit1', limit: 999 }, { now: () => NOW });
    expect(all.items.length).toBeLessThanOrEqual(20);
    expect(all.items.every((w) => w.unit === 'unit1')).toBe(true);
  });

  it('非法单元忽略过滤（回全量词表）', () => {
    const r = queryVocab({ unit: 'unit999' }, { now: () => NOW });
    expect(r.total).toBeGreaterThan(20);
  });
});

describe('数据工具 · query_wrongbook（T4）', () => {
  it('模块过滤 + 排序（最近优先）', () => {
    const storage = memory();
    storage.setItem(WRONG_KEY, JSON.stringify({
      version: 1,
      entries: {
        a: { exerciseId: 'a', module: 'grammar', stem: 'a', yourAnswer: '', correctAnswer: '', explanation: '', wrongCount: 1, lastWrongAt: 1 },
        b: { exerciseId: 'b', module: 'vocab', stem: 'b', yourAnswer: '', correctAnswer: '', explanation: '', wrongCount: 3, lastWrongAt: 3 },
        c: { exerciseId: 'c', module: 'vocab', stem: 'c', yourAnswer: '', correctAnswer: '', explanation: '', wrongCount: 1, lastWrongAt: 2 },
      },
    }));
    const vocabOnly = queryWrongbook({ module: 'vocab' }, { storage, now: () => NOW });
    expect(vocabOnly.total).toBe(2);
    expect(vocabOnly.items.map((e) => e.exerciseId)).toEqual(['b', 'c']);
    const all = queryWrongbook({}, { storage, now: () => NOW });
    expect(all.items[0]!.exerciseId).toBe('b');
  });

  it('空错题本安全返回空列表', () => {
    const r = queryWrongbook({ module: 'reading' }, { storage: memory(), now: () => NOW });
    expect(r.total).toBe(0);
    expect(r.items).toEqual([]);
  });
});

describe('数据工具 · record_answer（T4：学习闭环记账）', () => {
  it('词汇答错：SRS 调度 + 统计 + 今日活动 + 错题入本', () => {
    const storage = memory();
    const [id] = learnedWordIds();
    const result = recordAnswer(
      { module: 'vocab', correct: false, wordId: id, grade: 'again', stem: '题干', yourAnswer: 'x', correctAnswer: 'y', explanation: '解析' },
      { storage, now: () => NOW },
    );
    expect(result.ok).toBe(true);
    expect(result.recorded.wrongbookAdded).toBe(true);
    expect(result.recorded.srs).toMatchObject({ intervalDays: 0 });

    const progress = JSON.parse(storage.getItem(PROGRESS_KEY)!) as { cards: Record<string, unknown> };
    expect(progress.cards[id]).toBeTruthy();
    const wrong = loadWrongBook(storage);
    expect(wrong.entries[`w:${id}`]).toBeTruthy();
    expect(wrong.entries[`w:${id}`].wrongCount).toBe(1);
    const stats = loadStats(storage);
    expect(stats.modules.vocab).toEqual({ answered: 1, correct: 0 });
    const daily = loadDaily(storage);
    expect(daily.days[dayKey(NOW)]).toMatchObject({ exercises: 1, vocab: 1 }); // 新词首答 → vocab+1
  });

  it('词汇答对且原在错题本：掌握出本', () => {
    const storage = memory();
    const [id] = learnedWordIds();
    recordAnswer({ module: 'vocab', correct: false, wordId: id }, { storage, now: () => NOW });
    const result = recordAnswer({ module: 'vocab', correct: true, wordId: id, grade: 'good' }, { storage, now: () => NOW });
    expect(result.recorded.wrongbookRemoved).toBe(true);
    expect(loadWrongBook(storage).entries[`w:${id}`]).toBeUndefined();
    // 两次作答 → vocab 1（新词首答）/ exercises 2
    const daily = loadDaily(storage);
    expect(daily.days[dayKey(NOW)]).toEqual({ vocab: 1, exercises: 2 });
  });

  it('通用模块答错：入本；同题再错累加 wrongCount', () => {
    const storage = memory();
    const r1 = recordAnswer(
      { module: 'grammar', correct: false, exerciseId: 'g9', stem: 's', yourAnswer: 'a', correctAnswer: 'b', explanation: 'e' },
      { storage, now: () => NOW },
    );
    expect(r1.ok).toBe(true);
    recordAnswer(
      { module: 'grammar', correct: false, exerciseId: 'g9', stem: 's', yourAnswer: 'a2', correctAnswer: 'b', explanation: 'e' },
      { storage, now: () => NOW },
    );
    const wrong = loadWrongBook(storage);
    expect(wrong.entries['g9']!.wrongCount).toBe(2);
    expect(wrong.entries['g9']!.module).toBe('grammar');
  });

  it('非法模块 / 词表外 id：ok=false 且不落盘', () => {
    const storage = memory();
    const bad = recordAnswer({ module: 'pe', correct: true }, { storage, now: () => NOW });
    expect(bad.ok).toBe(false);
    const outside = recordAnswer({ module: 'vocab', correct: true, wordId: 'no-such-word' }, { storage, now: () => NOW });
    expect(outside.ok).toBe(false);
    expect(storage.getItem(PROGRESS_KEY)).toBeNull();
    expect(storage.getItem(WRONG_KEY)).toBeNull();
  });

  it('executeTool 分发：四工具同名接线 + 未知工具报错', () => {
    const ctx = { storage: memory(), now: () => NOW };
    expect((executeTool('get_learning_state', {}, ctx) as { totalWords: number }).totalWords).toBeGreaterThan(0);
    expect((executeTool('query_vocab', { keyword: 'the' }, ctx) as { items: unknown[] }).items).toBeDefined();
    expect((executeTool('query_wrongbook', {}, ctx) as { total: number }).total).toBe(0);
    expect((executeTool('record_answer', { module: 'vocab', correct: true, wordId: learnedWordIds()[0] }, ctx) as { ok: boolean }).ok).toBe(true);
    expect(executeTool('nope', {})).toEqual({ error: '未知工具 nope' });
    expect(V2_TOOL_DEFS.map((t) => t.function.name)).toEqual([
      'get_learning_state',
      'query_vocab',
      'query_wrongbook',
      'record_answer',
    ]);
  });
});
