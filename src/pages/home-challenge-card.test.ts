import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  TODAY_CHALLENGE_EMPTY_TEXT,
  TODAY_CHALLENGE_TITLE,
  buildTodayChallengeCard,
  buildTodayChallengeViewModel,
  getTodayChallengeSnapshot,
  renderHome,
  renderTodayChallengeCard,
} from './home';
import { emptyDaily, recordActivity, type DailyActivity, type DailyGoal } from '../store/daily';
import { resetUnitState } from './unit-switch';

/**
 * 首页「今日挑战」卡片：空态 / 非空态严格互斥。
 * - 空态：section.today-challenge 内唯一子节点为原生 a.today-challenge__empty-link[href=/vocabulary]，
 *   文案精确为「今天还没有学习记录，去词汇模块开始吧」，不渲染进度文案与统计；
 * - 非空态：标题 + 「今日挑战进度 N%」+ ul.today-challenge__stats 统计列表，不生成整卡链接；
 * - 百分比与统计值直接复用计算层 buildTodayChallengeViewModel（与数据层同口径），渲染层不重复计算。
 */

/** 本地正午（跨时区稳定，不落日期边界）：2026-01-18 周日 */
const NOW = new Date(2026, 0, 18, 12, 0, 0, 0).getTime();
const GOAL: DailyGoal = { version: 1, vocab: 10, exercises: 10 };

function dailyWith(vocab: number, exercises: number): DailyActivity {
  let daily = emptyDaily();
  if (vocab > 0) daily = recordActivity(daily, 'vocab', NOW, vocab);
  if (exercises > 0) daily = recordActivity(daily, 'exercises', NOW, exercises);
  return daily;
}

/** 用固定数据源渲染首页（不落真实 localStorage，日期稳定） */
function renderWith(daily: DailyActivity): HTMLElement {
  const root = document.createElement('div');
  renderHome(root, { loadDaily: () => daily, loadGoal: () => GOAL, now: () => NOW });
  return root;
}

function cardOf(root: HTMLElement): HTMLElement {
  const card = root.querySelector<HTMLElement>('[data-testid="today-challenge-card"]');
  expect(card, '首页应挂载今日挑战卡').toBeTruthy();
  return card!;
}

/** 计算层同口径视图模型（测试期望值的唯一来源） */
function viewOf(daily: DailyActivity) {
  return buildTodayChallengeViewModel(
    getTodayChallengeSnapshot({ loadDaily: () => daily, loadGoal: () => GOAL, now: () => NOW }),
  );
}

function storage(): Storage | undefined {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  return g._localStorage ?? g.localStorage;
}

beforeEach(() => {
  resetUnitState();
  storage()?.clear();
  history.replaceState(null, '', '/');
});

afterEach(() => {
  resetUnitState();
  history.replaceState(null, '', '/');
});

describe('今日挑战卡 · 空态', () => {
  it('今日无记录：整卡唯一子节点为原生 /vocabulary 链接，文案精确', () => {
    const card = cardOf(renderWith(emptyDaily()));

    expect(card.tagName).toBe('SECTION');
    expect(card.classList.contains('today-challenge')).toBe(true);
    expect(card.classList.contains('today-challenge--empty')).toBe(true);
    expect(card.dataset.state).toBe('empty');
    expect(card.children).toHaveLength(1);

    const link = card.firstElementChild!;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/vocabulary');
    expect(link.classList.contains('today-challenge__empty-link')).toBe(true);
    expect(link.getAttribute('data-testid')).toBe('today-challenge-empty-link');
    expect(link.getAttribute('aria-label')).toBeTruthy();
    expect(link.getAttribute('data-link')).not.toBeNull();
    // 整卡即链接：a 以块级铺满卡片（无样式票时也能点击卡片任意位置）
    expect(link.getAttribute('style')).toContain('display:block');
    expect(link.textContent).toBe('今天还没有学习记录，去词汇模块开始吧');
    expect(card.textContent).toBe(TODAY_CHALLENGE_EMPTY_TEXT);
  });

  it('空态不渲染进度文案与统计列表（两态互斥）', () => {
    const card = cardOf(renderWith(emptyDaily()));

    expect(card.querySelector('[data-testid="today-challenge-progress"]')).toBeNull();
    expect(card.querySelector('.today-challenge__stats')).toBeNull();
    expect(card.querySelector('[data-testid="today-challenge-stats"]')).toBeNull();
    expect(card.querySelectorAll('li')).toHaveLength(0);
    expect(card.textContent).not.toContain('进度');
  });
});

describe('今日挑战卡 · 非空态', () => {
  it('今日有记录：标题 + 计算层百分比 + ul 统计，无整卡 /vocabulary 链接', () => {
    const daily = dailyWith(3, 5);
    const view = viewOf(daily);
    const card = cardOf(renderWith(daily));

    expect(card.tagName).toBe('SECTION');
    expect(card.dataset.state).toBe('active');
    expect(card.querySelector('.today-challenge__title')!.textContent).toBe(TODAY_CHALLENGE_TITLE);
    expect(card.textContent).toContain(TODAY_CHALLENGE_TITLE);

    const progress = card.querySelector('[data-testid="today-challenge-progress"]')!;
    expect(progress.textContent).toBe(`今日挑战进度 ${view.percent}%`);
    expect(progress.textContent).toBe('今日挑战进度 40%');

    const stats = card.querySelector<HTMLUListElement>(
      'ul.today-challenge__stats[data-testid="today-challenge-stats"]',
    )!;
    expect(stats).toBeTruthy();
    const items = [...stats.querySelectorAll('li')];
    expect(items).toHaveLength(view.stats.length);
    expect(items.map((li) => li.querySelector('.today-challenge__stat-label')!.textContent)).toEqual(
      view.stats.map((stat) => stat.label),
    );
    expect(items.map((li) => li.querySelector('.today-challenge__stat-value')!.textContent)).toEqual(
      view.stats.map((stat) => stat.value),
    );
    expect(stats.textContent).toContain('词汇');
    expect(stats.textContent).toContain('3/10');
    expect(stats.textContent).toContain('练习');
    expect(stats.textContent).toContain('5/10');

    expect(card.querySelector('[data-testid="today-challenge-empty-link"]')).toBeNull();
    expect(card.querySelector('a')).toBeNull();
    expect(card.textContent).not.toContain(TODAY_CHALLENGE_EMPTY_TEXT);
  });

  it('超额完成：百分比封顶 100%', () => {
    const daily = dailyWith(12, 15);
    const view = viewOf(daily);
    expect(view.percent).toBe(100);

    const progress = cardOf(renderWith(daily)).querySelector('[data-testid="today-challenge-progress"]')!;
    expect(progress.textContent).toBe('今日挑战进度 100%');
  });
});

describe('今日挑战卡 · 空态 / 非空态互斥', () => {
  it('同一份数据只命中一种状态：空态有链接无进度，非空态有进度无链接', () => {
    const samples: Array<{ label: string; daily: DailyActivity }> = [
      { label: '无记录', daily: emptyDaily() },
      { label: '仅词汇', daily: dailyWith(1, 0) },
      { label: '仅练习', daily: dailyWith(0, 1) },
      { label: '两维都有', daily: dailyWith(2, 3) },
    ];

    for (const { label, daily } of samples) {
      const card = cardOf(renderWith(daily));
      const view = viewOf(daily);
      const hasLink = card.querySelector('[data-testid="today-challenge-empty-link"]') !== null;
      const hasProgress = card.querySelector('[data-testid="today-challenge-progress"]') !== null;
      const hasStats = card.querySelector('.today-challenge__stats') !== null;

      if (view.empty) {
        expect(hasLink, `${label}：空态应有整卡链接`).toBe(true);
        expect(hasProgress, `${label}：空态不应有进度文案`).toBe(false);
        expect(hasStats, `${label}：空态不应有统计`).toBe(false);
      } else {
        expect(hasLink, `${label}：非空态不应有整卡链接`).toBe(false);
        expect(hasProgress, `${label}：非空态应有进度文案`).toBe(true);
        expect(hasStats, `${label}：非空态应有统计`).toBe(true);
      }
    }
  });

  it('buildTodayChallengeCard 直接渲染两态：空态链接 / 非空态统计，互不掺杂', () => {
    const emptyCard = buildTodayChallengeCard(buildTodayChallengeViewModel(null));
    expect(emptyCard.dataset.state).toBe('empty');
    expect(emptyCard.querySelector('a')!.getAttribute('href')).toBe('/vocabulary');
    expect(emptyCard.querySelector('.today-challenge__stats')).toBeNull();

    const activeCard = buildTodayChallengeCard(viewOf(dailyWith(2, 3)));
    expect(activeCard.dataset.state).toBe('active');
    expect(activeCard.querySelector('a')).toBeNull();
    expect(activeCard.querySelector('.today-challenge__stats')).toBeTruthy();
  });

  it('renderTodayChallengeCard 返回 HTML 字符串：两态标记与内容互斥', () => {
    const emptyHtml = renderTodayChallengeCard(buildTodayChallengeViewModel(null));
    expect(typeof emptyHtml).toBe('string');
    expect(emptyHtml).toContain('data-state="empty"');
    expect(emptyHtml).toContain('href="/vocabulary"');
    expect(emptyHtml).toContain(TODAY_CHALLENGE_EMPTY_TEXT);
    expect(emptyHtml).not.toContain('today-challenge__stats');
    expect(emptyHtml).not.toContain('今日挑战进度');

    const activeHtml = renderTodayChallengeCard(viewOf(dailyWith(2, 3)));
    expect(activeHtml).toContain('data-state="active"');
    expect(activeHtml).toContain(TODAY_CHALLENGE_TITLE);
    expect(activeHtml).toContain('today-challenge__stats');
    expect(activeHtml).not.toContain('href="/vocabulary"');
    expect(activeHtml).not.toContain(TODAY_CHALLENGE_EMPTY_TEXT);
  });
});

describe('今日挑战卡 · 首页接入与既有模块回归', () => {
  it('挑战卡位于 main 内、今日进度卡之前，今日进度 / v2 入口 / 七大模块入口均保留', () => {
    const root = renderWith(dailyWith(1, 1));

    const sections = [...root.querySelectorAll('main > *')];
    const challenge = sections.findIndex(
      (n) => (n as HTMLElement).dataset.testid === 'today-challenge-card',
    );
    const today = sections.findIndex((n) => (n as HTMLElement).dataset.testid === 'home-today');
    const v2 = sections.findIndex((n) => (n as HTMLElement).dataset.testid === 'home-v2-entry');
    const modules = sections.findIndex((n) => (n as HTMLElement).className.includes('home-modules'));

    expect(challenge).toBeGreaterThanOrEqual(0);
    expect(today).toBe(challenge + 1);
    expect(v2).toBe(today + 1);
    expect(modules).toBe(v2 + 1);
    expect(root.querySelectorAll('.module-grid .module-card')).toHaveLength(7);
  });

  it('读取异常降级为空态（适配层 try/catch，不白屏）', () => {
    const raw = getTodayChallengeSnapshot({
      loadDaily: () => {
        throw new Error('storage blocked');
      },
      loadGoal: () => GOAL,
      now: () => NOW,
    });
    expect(raw).toBeNull();

    const card = buildTodayChallengeCard(buildTodayChallengeViewModel(raw));
    expect(card.dataset.state).toBe('empty');
    expect(card.textContent).toBe(TODAY_CHALLENGE_EMPTY_TEXT);
  });
});
