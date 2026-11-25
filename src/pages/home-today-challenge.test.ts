import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  buildTodayChallengeViewModel,
  escapeHtml,
  getTodayChallengeSnapshot,
  normalizeTodayChallenge,
  toNonNegativeNumber,
  type TodayChallengeViewModel,
} from './home';
import {
  ACTIVITY_STORAGE_KEY,
  GOAL_STORAGE_KEY,
  emptyDaily,
  loadDaily,
  loadGoal,
  recordActivity,
  saveDaily,
  saveGoal,
} from '../store/daily';

/**
 * 首页今日挑战数据适配与状态计算层（纯函数）：
 * - getTodayChallengeSnapshot 只读现有 store（每日目标 + 每日活动），异常返回 null、无网络请求；
 * - toNonNegativeNumber / normalizeTodayChallenge 收敛计数与 stats；
 * - buildTodayChallengeViewModel 决定空态（raw 为空 / 读取异常 / 完成数<=0 / 总数<=0）、
 *   百分比 N = clamp(round(completed/total*100), 1, 100)、文案「今日挑战进度 N%」；
 * - stats 归一化为键值字符串列表并在展示层转义（防注入）。
 */

/** 本地正午（跨时区稳定，不落日期边界）：2026-01-18 周日 */
const NOW = new Date(2026, 0, 18, 12, 0, 0, 0).getTime();

const GOAL = { version: 1, vocab: 10, exercises: 10 } as const;

/** 与 store 测试同款：绕过 Node≥26 实验性全局 localStorage 遮蔽，取 jsdom 实例 */
function testStorage(): Storage {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  const s = g._localStorage ?? g.localStorage;
  if (!s) throw new Error('测试环境无可用 localStorage');
  return s;
}

/** 断言空态三要素：empty / percent=0 / 无进度文案 */
function expectEmpty(vm: TodayChallengeViewModel): void {
  expect(vm.empty).toBe(true);
  expect(vm.percent).toBe(0);
  expect(vm.progressText).toBe('');
}

beforeEach(() => {
  testStorage().clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('今日挑战 · 导出与读取接缝', () => {
  it('五个能力均以函数导出，可被测试直接导入', () => {
    expect(typeof getTodayChallengeSnapshot).toBe('function');
    expect(typeof toNonNegativeNumber).toBe('function');
    expect(typeof normalizeTodayChallenge).toBe('function');
    expect(typeof buildTodayChallengeViewModel).toBe('function');
    expect(typeof escapeHtml).toBe('function');
  });

  it('快照只读现有 store：今日完成数 / 目标总数 / 词汇与练习两项 stats', () => {
    // 今日 3 词 + 5 题，目标 10 + 10 → 8 / 20
    const daily = recordActivity(recordActivity(emptyDaily(), 'vocab', NOW, 3), 'exercises', NOW, 5);

    const raw = getTodayChallengeSnapshot({ loadDaily: () => daily, loadGoal: () => GOAL, now: () => NOW });

    expect(raw).not.toBeNull();
    expect(raw!.completedCount).toBe(8);
    expect(raw!.totalCount).toBe(20);
    expect(raw!.stats).toEqual([
      { label: '词汇', value: '3/10' },
      { label: '练习', value: '5/10' },
    ]);
  });

  it('快照走现有 localStorage 约定键（每日活动 / 每日目标）：重新读取结果一致', () => {
    saveDaily(recordActivity(emptyDaily(), 'exercises', NOW, 19), testStorage());
    saveGoal(GOAL, testStorage());

    // 模拟刷新：每次从同一份本地存储现读（与页面默认 deps 同路径）
    const read = () =>
      getTodayChallengeSnapshot({
        loadDaily: () => loadDaily(testStorage()),
        loadGoal: () => loadGoal(testStorage()),
        now: () => NOW,
      });

    expect(read()).toMatchObject({ completedCount: 19, totalCount: 20 });
    expect(read()).toMatchObject({ completedCount: 19, totalCount: 20 });
    // 只读：不新增任何本地写入
    expect(testStorage().getItem(ACTIVITY_STORAGE_KEY)).toBeTruthy();
    expect(testStorage().getItem(GOAL_STORAGE_KEY)).toBeTruthy();
  });

  it('读取异常（loader 抛错）→ 快照返回 null，视图模型为空态', () => {
    const raw = getTodayChallengeSnapshot({
      loadDaily: () => {
        throw new Error('storage blocked');
      },
      loadGoal: () => GOAL,
      now: () => NOW,
    });

    expect(raw).toBeNull();
    expectEmpty(buildTodayChallengeViewModel(raw));
  });

  it('存储层 getItem 抛错 → 快照仍是 0 完成数，视图模型为空态（不崩溃）', () => {
    const blocked = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => undefined,
    };

    const raw = getTodayChallengeSnapshot({
      loadDaily: () => loadDaily(blocked),
      loadGoal: () => loadGoal(blocked),
      now: () => NOW,
    });

    expect(raw).not.toBeNull();
    expect(raw!.completedCount).toBe(0);
    expectEmpty(buildTodayChallengeViewModel(raw));
  });

  it('本地数据损坏（坏 JSON）→ 空态而不是异常', () => {
    testStorage().setItem(ACTIVITY_STORAGE_KEY, '{not-valid-json');
    testStorage().setItem(GOAL_STORAGE_KEY, '###');

    const raw = getTodayChallengeSnapshot({
      loadDaily: () => loadDaily(testStorage()),
      loadGoal: () => loadGoal(testStorage()),
      now: () => NOW,
    });

    expectEmpty(buildTodayChallengeViewModel(raw));
  });

  it('不发起网络请求、不写 localStorage（只读适配）', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    saveDaily(recordActivity(emptyDaily(), 'vocab', NOW, 3), testStorage());
    const activityBefore = testStorage().getItem(ACTIVITY_STORAGE_KEY);
    const goalBefore = testStorage().getItem(GOAL_STORAGE_KEY);

    const vm = buildTodayChallengeViewModel(
      getTodayChallengeSnapshot({
        loadDaily: () => loadDaily(testStorage()),
        loadGoal: () => loadGoal(testStorage()),
        now: () => NOW,
      }),
    );

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(testStorage().getItem(ACTIVITY_STORAGE_KEY)).toBe(activityBefore);
    // 默认目标不会被快照读取改写
    expect(testStorage().getItem(GOAL_STORAGE_KEY)).toBe(goalBefore);
    expect(vm.empty).toBe(false);
  });
});

describe('今日挑战 · 空态判定', () => {
  it('raw 为 null / undefined → 空态', () => {
    expectEmpty(buildTodayChallengeViewModel(null));
    expectEmpty(buildTodayChallengeViewModel(undefined));
  });

  it('0/20：完成数为 0 → 空态（有目标但还没开始）', () => {
    const vm = buildTodayChallengeViewModel({ completedCount: 0, totalCount: 20 });
    expectEmpty(vm);
    expect(vm.completedCount).toBe(0);
    expect(vm.totalCount).toBe(20);
  });

  it('20/0：总数为 0 → 空态（无有效目标，避免除零）', () => {
    expectEmpty(buildTodayChallengeViewModel({ completedCount: 20, totalCount: 0 }));
  });

  it('0/0 与缺失计数字段 → 空态', () => {
    expectEmpty(buildTodayChallengeViewModel({}));
    expectEmpty(buildTodayChallengeViewModel({ stats: { 词汇: '0/10' } }));
  });

  it('normalizeTodayChallenge：null / undefined / 非对象 → null；对象 → 归一化结果', () => {
    expect(normalizeTodayChallenge(null)).toBeNull();
    expect(normalizeTodayChallenge(undefined)).toBeNull();
    expect(normalizeTodayChallenge('0/20')).toBeNull();
    expect(normalizeTodayChallenge(42)).toBeNull();
    expect(normalizeTodayChallenge({ completedCount: 19, totalCount: 20 })).toMatchObject({
      completedCount: 19,
      totalCount: 20,
    });
  });
});

describe('今日挑战 · 百分比（clamp round 口径）', () => {
  it('19/20 → 95%，文案「今日挑战进度 95%」', () => {
    const vm = buildTodayChallengeViewModel({ completedCount: 19, totalCount: 20 });
    expect(vm.empty).toBe(false);
    expect(vm.percent).toBe(95);
    expect(vm.progressText).toBe('今日挑战进度 95%');
  });

  it('25/20（超额）→ 100%，百分比封顶', () => {
    const vm = buildTodayChallengeViewModel({ completedCount: 25, totalCount: 20 });
    expect(vm.percent).toBe(100);
    expect(vm.progressText).toBe('今日挑战进度 100%');
  });

  it('1/1000 → 1%，百分比下限为 1（只要有完成就可见）', () => {
    const vm = buildTodayChallengeViewModel({ completedCount: 1, totalCount: 1000 });
    expect(vm.percent).toBe(1);
    expect(vm.progressText).toBe('今日挑战进度 1%');
  });

  it('8/20 → 40%（常规进度）', () => {
    expect(buildTodayChallengeViewModel({ completedCount: 8, totalCount: 20 }).progressText).toBe(
      '今日挑战进度 40%',
    );
  });

  it('19.6/20 → 98%（四舍五入）', () => {
    expect(buildTodayChallengeViewModel({ completedCount: 19.6, totalCount: 20 }).percent).toBe(98);
  });
});

describe('今日挑战 · 负值 / 非数字归一化', () => {
  it('toNonNegativeNumber：负数 / 非数字 / 空值 / NaN / Infinity → 0，数字字符串按数字解析', () => {
    expect(toNonNegativeNumber(-5)).toBe(0);
    expect(toNonNegativeNumber(-0.5)).toBe(0);
    expect(toNonNegativeNumber('abc')).toBe(0);
    expect(toNonNegativeNumber('')).toBe(0);
    expect(toNonNegativeNumber('   ')).toBe(0);
    expect(toNonNegativeNumber(null)).toBe(0);
    expect(toNonNegativeNumber(undefined)).toBe(0);
    expect(toNonNegativeNumber(Number.NaN)).toBe(0);
    expect(toNonNegativeNumber(Number.POSITIVE_INFINITY)).toBe(0);
    expect(toNonNegativeNumber(0)).toBe(0);
    expect(toNonNegativeNumber(19)).toBe(19);
    expect(toNonNegativeNumber('19')).toBe(19);
  });

  it('负完成数 → 空态（completedCount<=0）', () => {
    expectEmpty(buildTodayChallengeViewModel({ completedCount: -3, totalCount: 20 }));
  });

  it('负总数 → 空态（totalCount<=0）', () => {
    expectEmpty(buildTodayChallengeViewModel({ completedCount: 5, totalCount: -20 }));
  });

  it('非数字字段（字符串 / NaN / 对象）→ 按 0 处理，最终为空态', () => {
    expectEmpty(buildTodayChallengeViewModel({ completedCount: 'abc', totalCount: 'def' }));
    expectEmpty(buildTodayChallengeViewModel({ completedCount: Number.NaN, totalCount: 20 }));
    expectEmpty(buildTodayChallengeViewModel({ completedCount: {}, totalCount: 20 }));
    expectEmpty(buildTodayChallengeViewModel({ completedCount: 19, totalCount: {} }));
  });

  it('数字字符串计数可用：归一化后仍按数值计算百分比', () => {
    const vm = buildTodayChallengeViewModel({ completedCount: '19', totalCount: '20' });
    expect(vm.percent).toBe(95);
  });
});

describe('今日挑战 · stats 归一化与转义', () => {
  it('对象 stats → 键值字符串列表（label = 键，value = 值）', () => {
    const normalized = normalizeTodayChallenge({ completedCount: 8, totalCount: 20, stats: { 词汇: '3/10', 练习: '5/10' } });
    expect(normalized!.stats).toEqual([
      { label: '词汇', value: '3/10' },
      { label: '练习', value: '5/10' },
    ]);
  });

  it('数组 stats 支持键值对 / 对象项，空项丢弃', () => {
    const normalized = normalizeTodayChallenge({
      completedCount: 8,
      totalCount: 20,
      stats: [
        ['词汇', 3],
        { label: '练习', value: 5 },
        null,
        {},
        { label: '正确率', value: '62.5%' },
      ],
    });
    expect(normalized!.stats).toEqual([
      { label: '词汇', value: '3' },
      { label: '练习', value: '5' },
      { label: '正确率', value: '62.5%' },
    ]);
  });

  it('非法 stats（字符串 / 数字 / null）→ 空列表，不抛异常', () => {
    for (const stats of ['x', 42, null, undefined]) {
      expect(normalizeTodayChallenge({ completedCount: 8, totalCount: 20, stats })!.stats).toEqual([]);
    }
  });

  it('stats 转义：标签与值中的 HTML 元字符不原样进入展示文本（防注入）', () => {
    const vm = buildTodayChallengeViewModel({
      completedCount: 19,
      totalCount: 20,
      stats: {
        '<img src=x onerror=alert(1)>': '<script>alert("x")</script>',
        "词汇 & '练习'": '3/10 < 5/10',
      },
    });

    expect(vm.stats).toEqual([
      { label: '&lt;img src=x onerror=alert(1)&gt;', value: '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;' },
      { label: '词汇 &amp; &#39;练习&#39;', value: '3/10 &lt; 5/10' },
    ]);
    // 原样标签不得出现在拼装后的文本里
    const joined = vm.stats.map((s) => `${s.label}${s.value}`).join('');
    expect(joined).not.toContain('<script>');
    expect(joined).not.toContain('<img');
  });

  it('escapeHtml：五个元字符单趟转义，null/undefined → 空串', () => {
    expect(escapeHtml('& < > " \'')).toBe('&amp; &lt; &gt; &quot; &#39;');
    expect(escapeHtml('&amp;')).toBe('&amp;amp;'); // 单趟：已有实体只转义 & 一次
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(0)).toBe('0');
  });
});
