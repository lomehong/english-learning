import { describe, it, expect, beforeEach } from 'vitest';
import {
  BACKUP_VERSION,
  BackupFormatError,
  createBackup,
  serializeBackup,
  parseBackup,
  importBackup,
  importBackupFromText,
  mergeProgress,
  mergeWrongBook,
  mergeWritingDrafts,
  mergeStats,
  pickCard,
  pickStat,
  emptyBackup,
  type BackupData,
} from './backup';
import { createCard, scheduleCard, DAY_MS } from '../srs/sm2';
import { emptyProgress, loadProgress, STORAGE_KEY as PROGRESS_KEY, type Progress } from './progress';
import {
  emptyWrongBook,
  loadWrongBook,
  recordWrong,
  STORAGE_KEY as WRONGBOOK_KEY,
} from './wrongbook';
import {
  emptyWritingDrafts,
  loadWritingDrafts,
  putDraft,
  STORAGE_KEY as WRITING_KEY,
} from './writing';
import { emptyStats, loadStats, recordAnswer, STORAGE_KEY as STATS_KEY } from './stats';
import type { StorageLike } from './progress';

const NOW = Date.UTC(2026, 0, 1);

/** 全新内存存储（隔离每个用例） */
function memoryStorage(seed: Record<string, string> = {}): StorageLike {
  const memory = new Map<string, string>(Object.entries(seed));
  return {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => void memory.set(k, v),
  };
}

/** 构造一份「另一台设备」的完整备份 */
function sampleBackup(): BackupData {
  const progress = emptyProgress();
  progress.cards['apply'] = createCard('apply', NOW - 3 * DAY_MS);
  progress.cards['apply'] = scheduleCard(progress.cards['apply']!, 'good', NOW - 2 * DAY_MS);
  progress.cards['visa'] = createCard('visa', NOW - DAY_MS);

  let wrong = emptyWrongBook();
  wrong = recordWrong(
    wrong,
    {
      exerciseId: 'u2-g1',
      module: 'grammar',
      stem: 'She ______ to the travel office.',
      yourAnswer: 'has been',
      correctAnswer: 'has gone',
      explanation: 'have gone to 表示去了未归。',
    },
    NOW - 1000,
  );
  wrong = recordWrong(
    wrong,
    {
      exerciseId: 'u2-r1-1',
      module: 'reading',
      stem: 'How did the writer travel?',
      yourAnswer: 'On foot.',
      correctAnswer: 'By bicycle.',
      explanation: '由第二段可知。',
    },
    NOW - 2000,
  );

  const writing = putDraft(emptyWritingDrafts(), 'u2-w1', 'Dear Tom, I am going to Xi an.', NOW - 500);

  let stats = emptyStats();
  stats = recordAnswer(stats, 'grammar', true, 'unit2');
  stats = recordAnswer(stats, 'grammar', false, 'unit2');
  stats = recordAnswer(stats, 'listening', true, 'unit2');

  return {
    version: BACKUP_VERSION,
    app: 'english-learning',
    exportedAt: NOW,
    progress,
    wrongbook: wrong,
    writing,
    stats,
  };
}

describe('备份 · 导出与解析', () => {
  it('createBackup 打包四份数据，serializeBackup 往返一致', () => {
    const storage = memoryStorage();
    importBackup(sampleBackup(), storage);

    const backup = createBackup(storage, NOW);
    expect(backup.version).toBe(1);
    expect(backup.exportedAt).toBe(NOW);
    expect(Object.keys(backup.progress.cards).sort()).toEqual(['apply', 'visa']);
    expect(Object.keys(backup.wrongbook.entries).sort()).toEqual(['u2-g1', 'u2-r1-1']);
    expect(backup.writing.drafts['u2-w1']?.content).toContain('Dear Tom');
    expect(backup.stats.units.unit2.grammar).toEqual({ answered: 2, correct: 1 });

    const parsed = parseBackup(serializeBackup(backup));
    expect(parsed).toEqual(backup);
  });

  it('解析非法内容：非 JSON / 数组 / 版本不符 / 缺段 → 抛 BackupFormatError', () => {
    expect(() => parseBackup('not-json')).toThrow(BackupFormatError);
    expect(() => parseBackup('[1,2,3]')).toThrow(BackupFormatError);
    expect(() => parseBackup(JSON.stringify({ version: 99 }))).toThrow(BackupFormatError);
    expect(() => parseBackup(JSON.stringify({ version: 1 }))).toThrow(/progress/);
    expect(() =>
      parseBackup(
        JSON.stringify({ version: 1, progress: { version: 1 }, wrongbook: { version: 1 }, writing: { version: 1 }, stats: 'x' }),
      ),
    ).toThrow(/stats/);
  });

  it('字段级脏数据被安全清洗：坏卡片剔除、坏草稿剔除、统计归一化', () => {
    const raw = {
      version: 1,
      exportedAt: NOW,
      progress: { version: 1, cards: { apply: { id: 'apply', ease: 2.5 }, visa: createCard('visa', NOW) } },
      wrongbook: { version: 1, entries: {} },
      writing: { version: 1, drafts: { 'u2-w1': { content: 'ok', updatedAt: NOW }, bad: { content: 1 } } },
      stats: { version: 1, modules: { grammar: { answered: 3, correct: 9 } } },
    };
    const parsed = parseBackup(JSON.stringify(raw));
    expect(Object.keys(parsed.progress.cards)).toEqual(['visa']);
    expect(Object.keys(parsed.writing.drafts)).toEqual(['u2-w1']);
    expect(parsed.stats.modules.grammar).toEqual({ answered: 3, correct: 3 });
  });
});

describe('备份 · 合并去重规则（纯函数）', () => {
  it('pickCard：复习次数多者胜，次数相同早到期者胜', () => {
    const a = { ...createCard('w', 0), reps: 3, due: 500 };
    const b = { ...createCard('w', 0), reps: 5, due: 900 };
    expect(pickCard(a, b)).toBe(b);
    const c = { ...createCard('w', 0), reps: 5, due: 300 };
    expect(pickCard(b, c)).toBe(c);
  });

  it('mergeProgress：交集按 pickCard 去重，并集保留双方', () => {
    const current = emptyProgress();
    current.cards['teenage'] = { ...createCard('teenage', 0), reps: 1, due: 100 };
    current.cards['volunteer'] = createCard('volunteer', 0);

    const incoming = emptyProgress();
    incoming.cards['teenage'] = { ...createCard('teenage', 0), reps: 4, due: 900 };
    incoming.cards['apply'] = createCard('apply', 0);

    const merged = mergeProgress(current, incoming);
    expect(Object.keys(merged.cards).sort()).toEqual(['apply', 'teenage', 'volunteer']);
    expect(merged.cards['teenage']!.reps).toBe(4); // 备份复习次数更多 → 胜出
  });

  it('mergeWrongBook：同题去重（次数取大、时间取近），不同题全部保留', () => {
    const current = emptyWrongBook();
    let currentBook = recordWrong(
      current,
      {
        exerciseId: 'g1',
        module: 'grammar',
        stem: 's1',
        yourAnswer: 'a1',
        correctAnswer: 'c1',
        explanation: 'e1',
      },
      NOW - 10,
    );
    currentBook = recordWrong(
      currentBook,
      {
        exerciseId: 'g1',
        module: 'grammar',
        stem: 's1',
        yourAnswer: 'a2',
        correctAnswer: 'c1',
        explanation: 'e1',
      },
      NOW - 5,
    );

    const incoming = emptyWrongBook();
    const incomingBook = recordWrong(
      incoming,
      {
        exerciseId: 'g1',
        module: 'grammar',
        stem: 's1',
        yourAnswer: 'a3',
        correctAnswer: 'c1',
        explanation: 'e1',
      },
      NOW,
    );

    const merged = mergeWrongBook(currentBook, incomingBook);
    expect(Object.keys(merged.entries)).toEqual(['g1']);
    expect(merged.entries['g1']!.wrongCount).toBe(2); // 本地已错 2 次 > 备份 1 次
    expect(merged.entries['g1']!.lastWrongAt).toBe(NOW); // 备份时间更近 → 正文取备份、时间取最近
    expect(merged.entries['g1']!.yourAnswer).toBe('a3');
  });

  it('mergeWritingDrafts：同一任务保留更新时间较新的草稿', () => {
    const current = putDraft(emptyWritingDrafts(), 'w1', 'local draft', NOW - 100);
    const current2 = putDraft(current, 'w2', 'only local', NOW);
    const incoming = putDraft(emptyWritingDrafts(), 'w1', 'remote draft', NOW - 50);
    const incoming2 = putDraft(incoming, 'u2-w1', 'only remote', NOW - 10);

    const merged = mergeWritingDrafts(current2, incoming2);
    expect(merged.drafts['w1']!.content).toBe('remote draft'); // 更新时间更新
    expect(merged.drafts['w2']!.content).toBe('only local');
    expect(merged.drafts['u2-w1']!.content).toBe('only remote');
  });

  it('pickStat / mergeStats：取记录更完整的一方，不双算', () => {
    expect(pickStat({ answered: 3, correct: 1 }, { answered: 5, correct: 2 })).toEqual({
      answered: 5,
      correct: 2,
    });
    expect(pickStat({ answered: 5, correct: 3 }, { answered: 5, correct: 2 })).toEqual({
      answered: 5,
      correct: 3,
    });

    let current = emptyStats();
    current = recordAnswer(current, 'grammar', true, 'unit1');
    current = recordAnswer(current, 'reading', true, 'unit1');

    let incoming = emptyStats();
    incoming = recordAnswer(incoming, 'grammar', true, 'unit2');
    incoming = recordAnswer(incoming, 'grammar', true, 'unit2');
    incoming = recordAnswer(incoming, 'grammar', false, 'unit2');
    incoming = recordAnswer(incoming, 'listening', true, 'unit2');

    const merged = mergeStats(current, incoming);
    expect(merged.modules.grammar).toEqual({ answered: 3, correct: 2 }); // 备份 3>本地 1
    expect(merged.modules.reading).toEqual({ answered: 1, correct: 1 }); // 本地独有
    expect(merged.modules.listening).toEqual({ answered: 1, correct: 1 }); // 备份独有
    expect(merged.units.unit1.grammar).toEqual({ answered: 1, correct: 1 });
    expect(merged.units.unit2.grammar).toEqual({ answered: 3, correct: 2 });
  });
});

describe('备份 · 导入执行（合并去重 + 持久化）', () => {
  let storage: StorageLike;

  beforeEach(() => {
    storage = memoryStorage();
  });

  it('空备份导入空库：全部为 0 摘要，不报错', () => {
    const summary = importBackup(emptyBackup(), storage);
    expect(summary).toMatchObject({
      cardsAdded: 0,
      cardsMerged: 0,
      wrongAdded: 0,
      wrongMerged: 0,
      draftsAdded: 0,
      draftsMerged: 0,
      statsModulesUpdated: 0,
    });
  });

  it('本地有数据时导入：新增/合并计数正确，合并规则落地持久化', () => {
    // 本地：teenage 已学（reps=1）、g1 错 2 次、w1 本地旧草稿、grammar 答过 1 题
    const progress = emptyProgress();
    progress.cards['teenage'] = { ...createCard('teenage', 0), reps: 1, due: 100 };
    storage.setItem(PROGRESS_KEY, JSON.stringify(progress));

    let book = emptyWrongBook();
    for (let i = 0; i < 2; i += 1) {
      book = recordWrong(
        book,
        {
          exerciseId: 'g1',
          module: 'grammar',
          stem: 'Listen! Someone ______ in the next room.',
          yourAnswer: 'sings',
          correctAnswer: 'is singing',
          explanation: '现在进行时。',
        },
        NOW - 10,
      );
    }
    storage.setItem(WRONGBOOK_KEY, JSON.stringify(book));

    storage.setItem(
      WRITING_KEY,
      JSON.stringify(putDraft(emptyWritingDrafts(), 'w1', 'old local draft', NOW - 999)),
    );

    let stats = emptyStats();
    stats = recordAnswer(stats, 'grammar', true, 'unit1');
    storage.setItem(STATS_KEY, JSON.stringify(stats));

    // 备份（另一台设备）：teenage 复习更多、g1 错 1 次但时间更近、u2-g1/w1 新草稿/unit2 统计
    const incoming = sampleBackup();
    const remoteProgress = emptyProgress();
    remoteProgress.cards['teenage'] = { ...createCard('teenage', 0), reps: 6, due: NOW };
    remoteProgress.cards['apply'] = incoming.progress.cards['apply']!;
    remoteProgress.cards['visa'] = incoming.progress.cards['visa']!;
    const backup: BackupData = {
      ...incoming,
      progress: remoteProgress,
      wrongbook: mergeWrongBook(incoming.wrongbook, {
        version: 1,
        entries: {
          g1: {
            exerciseId: 'g1',
            module: 'grammar',
            stem: 'Listen! Someone ______ in the next room.',
            yourAnswer: 'is singing',
            correctAnswer: 'is singing',
            explanation: '现在进行时。',
            wrongCount: 1,
            lastWrongAt: NOW,
          },
        },
      }),
    };

    const summary = importBackup(backup, storage);

    // 计数：词汇 teenage 合并 + visa 新增；错题 g1 合并 + u2-g1/u2-r1-1 新增；
    // 草稿 w1 合并（本地旧）+ u2-w1 新增；统计 grammar(3>1) 与 listening(0<1) 更新
    expect(summary.cardsAdded).toBe(2); // apply + visa
    expect(summary.cardsMerged).toBe(1); // teenage
    expect(summary.wrongAdded).toBe(2);
    expect(summary.wrongMerged).toBe(1); // g1
    expect(summary.draftsAdded).toBe(1);
    expect(summary.draftsMerged).toBe(1);
    expect(summary.statsModulesUpdated).toBeGreaterThanOrEqual(2);

    // 落地校验
    const mergedProgress: Progress = loadProgress(storage);
    expect(mergedProgress.cards['teenage']!.reps).toBe(6);
    expect(mergedProgress.cards['visa']).toBeDefined();

    const mergedWrong = loadWrongBook(storage);
    expect(mergedWrong.entries['g1']!.wrongCount).toBe(2);
    expect(mergedWrong.entries['g1']!.lastWrongAt).toBe(NOW);
    expect(mergedWrong.entries['u2-g1']).toBeDefined();

    const mergedDrafts = loadWritingDrafts(storage);
    expect(mergedDrafts.drafts['w1']!.content).toBe('old local draft'); // 本地独有，保留
    expect(mergedDrafts.drafts['u2-w1']!.content).toBe('Dear Tom, I am going to Xi an.');

    const mergedStats = loadStats(storage);
    expect(mergedStats.modules.grammar).toEqual({ answered: 2, correct: 1 });
    expect(mergedStats.units.unit1.grammar).toEqual({ answered: 1, correct: 1 });
    expect(mergedStats.units.unit2.grammar).toEqual({ answered: 2, correct: 1 });
  });

  it('重复导入同一份备份：数据幂等（不翻倍、不重复计数）', () => {
    const backup = sampleBackup();
    const first = importBackup(backup, storage);
    expect(first.cardsAdded).toBe(2);
    expect(first.wrongAdded).toBe(2);

    const second = importBackup(backup, storage);
    expect(second.cardsAdded).toBe(0);
    expect(second.cardsMerged).toBe(2);
    expect(second.wrongAdded).toBe(0);
    expect(second.wrongMerged).toBe(2);
    expect(second.draftsAdded).toBe(0);

    const progress = loadProgress(storage);
    expect(Object.keys(progress.cards).sort()).toEqual(['apply', 'visa']);
    const wrong = loadWrongBook(storage);
    expect(wrong.entries['u2-g1']!.wrongCount).toBe(1);
  });

  it('importBackupFromText：坏文本抛 BackupFormatError 且不写入任何键', () => {
    expect(() => importBackupFromText('garbage', storage)).toThrow(BackupFormatError);
    expect(storage.getItem(PROGRESS_KEY)).toBeNull();
    expect(storage.getItem(STATS_KEY)).toBeNull();
  });
});
