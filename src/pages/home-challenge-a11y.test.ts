import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderHome, TODAY_CHALLENGE_EMPTY_TEXT } from './home';
import { renderVocabulary } from './vocabulary';
import { createRouter, type Route } from '../router';
import { emptyDaily, recordActivity, type DailyActivity, type DailyGoal } from '../store/daily';
import { resetUnitState } from './unit-switch';

/**
 * 首页「今日挑战」卡片 · 可访问性与跳转验收：
 * - 空态整卡为原生 <a href="/vocabulary">：Tab 可聚焦、无负 tabindex / aria-hidden、
 *   aria-label 可读且与可见文案一致；
 * - 焦点样式落在 base.css（:focus-visible 描边 + 底色，整卡 :focus-within 边框 + 阴影），
 *   键盘与鼠标都能看到聚焦 / 悬停反馈；
 * - 点击 / Enter 激活后 URL 变为 /vocabulary（router 拦截 data-link，SPA 免刷新）；
 * - 非空态卡片只读：卡内无任何链接、无可聚焦元素，点击不改 URL。
 *
 * 本文件只做验收断言，不改渲染逻辑；日期固定为本地正午，跨时区稳定。
 */

/** 本地正午（跨时区稳定，不落日期边界）：2026-01-18 周日 */
const NOW = new Date(2026, 0, 18, 12, 0, 0, 0).getTime();
const GOAL: DailyGoal = { version: 1, vocab: 10, exercises: 10 };

const css = readFileSync(join(process.cwd(), 'src', 'styles', 'base.css'), 'utf8');

/** 首页固定数据源（空态）：不读真实 localStorage，避免用例互相污染 */
function emptyDeps() {
  return { loadDaily: () => emptyDaily(), loadGoal: () => GOAL, now: () => NOW };
}

/** 首页固定数据源（非空态）：今日 3 词 */
function activeDeps(): { loadDaily: () => DailyActivity; loadGoal: () => DailyGoal; now: () => number } {
  const daily = recordActivity(emptyDaily(), 'vocab', NOW, 3);
  return { loadDaily: () => daily, loadGoal: () => GOAL, now: () => NOW };
}

let root: HTMLElement | null = null;
let cleanup: (() => void) | null = null;

/** 挂载首页并把空态链接交给用例（元素在文档里，focus 才生效） */
function mountEmptyHome(): { root: HTMLElement; link: HTMLAnchorElement; card: HTMLElement } {
  root = document.createElement('div');
  document.body.append(root);
  renderHome(root, emptyDeps());

  const card = root.querySelector<HTMLElement>('[data-testid="today-challenge-card"]');
  expect(card, '首页应挂载今日挑战卡').toBeTruthy();
  const link = card!.querySelector<HTMLAnchorElement>('[data-testid="today-challenge-empty-link"]');
  expect(link, '空态整卡应为 /vocabulary 链接').toBeTruthy();
  return { root, link: link!, card: card! };
}

/** 挂载真实 router（/ 首页 + /vocabulary 词汇页），验证点击后的 URL 与页面切换 */
function mountRoutedHome(): { root: HTMLElement; link: HTMLAnchorElement } {
  history.replaceState(null, '', '/');
  root = document.createElement('div');
  document.body.append(root);

  const routes: Route[] = [
    { path: '/', render: (el) => renderHome(el, emptyDeps()) },
    { path: '/vocabulary', render: (el) => renderVocabulary(el) },
  ];
  cleanup = createRouter(root, routes).destroy;

  const link = root.querySelector<HTMLAnchorElement>('[data-testid="today-challenge-empty-link"]');
  expect(link, '空态链接应已挂载在首页').toBeTruthy();
  return { root, link: link! };
}

beforeEach(() => {
  resetUnitState();
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  (g._localStorage ?? g.localStorage)?.clear();
  history.replaceState(null, '', '/');
});

afterEach(() => {
  cleanup?.();
  cleanup = null;
  root?.remove();
  root = null;
  resetUnitState();
  history.replaceState(null, '', '/');
});

describe('今日挑战卡 · 空态链接可访问性', () => {
  it('整卡为原生 /vocabulary 链接：Tab 可聚焦（无负 tabindex / aria-hidden / inert）', () => {
    const { link, card } = mountEmptyHome();

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/vocabulary');
    expect(link.hasAttribute('data-link')).toBe(true); // router 拦截所需
    expect(link.tabIndex).toBe(0);
    expect(link.getAttribute('tabindex')).not.toBe('-1');
    expect(link.hasAttribute('aria-hidden')).toBe(false);
    expect(link.getAttribute('aria-disabled')).not.toBe('true');
    expect(link.closest('[inert]')).toBeNull();

    // 焦点确实落在链接上（Tab 序按文档顺序，无 tabindex 打断）
    link.focus();
    expect(document.activeElement).toBe(link);
    expect(link.matches(':focus')).toBe(true);

    // 整卡即链接：链接是卡片唯一子节点并以块级铺满，点击卡片任意位置都命中链接
    expect(card.children).toHaveLength(1);
    expect(card.firstElementChild).toBe(link);
    expect(link.style.display).toBe('block');
  });

  it('aria-label 可读：非空、与可见文案一致、明确指向词汇模块开始', () => {
    const { link } = mountEmptyHome();

    const label = link.getAttribute('aria-label');
    expect(label, '空态链接必须有 aria-label').toBeTruthy();
    expect(label!.trim()).not.toBe('');
    expect(label).toBe(TODAY_CHALLENGE_EMPTY_TEXT); // 朗读文本 = 可见文案，不出现两套说法
    expect(label).toContain('今天还没有学习记录');
    expect(label).toContain('词汇');
    expect(link.textContent).toBe(TODAY_CHALLENGE_EMPTY_TEXT);
    // 链接没有 role="button" 等错误角色覆盖原生语义
    expect(link.getAttribute('role')).toBeNull();
  });

  it('base.css 提供可见焦点样式：:focus-visible 描边 + 底色，整卡 :focus-within 边框 + 阴影', () => {
    const focusBody = /\.today-challenge__empty-link:focus-visible\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(focusBody, 'base.css 缺少 .today-challenge__empty-link:focus-visible').not.toBe('');
    expect(focusBody).toMatch(/outline:\s*2px\s+solid\s+var\(--color-primary\)/);
    // outline-offset 为负值：卡片 overflow:hidden 时焦点环仍完整可见
    expect(focusBody).toMatch(/outline-offset:\s*-4px/);
    expect(focusBody).toMatch(/background:\s*var\(--color-primary-soft\)/);

    const groupBody =
      /\.today-challenge\[data-state='empty'\]:focus-within\s*\{([^}]*)\}/.exec(css)?.[1] ?? '';
    expect(groupBody, '空态卡应有 :focus-within 焦点反馈').not.toBe('');
    expect(groupBody).toMatch(/border-color:\s*var\(--color-primary\)/);
    expect(groupBody).toMatch(/box-shadow:\s*var\(--shadow-md\)/);

    // 全局兜底：未命中组件规则时所有原生 a 仍有主色焦点环
    expect(css).toMatch(/a:focus-visible,[\s\S]*?outline:\s*2px solid var\(--color-primary\);/);
  });
});

describe('今日挑战卡 · 跳转验证（URL → /vocabulary）', () => {
  it('点击空态链接：router 拦截 data-link，URL 变为 /vocabulary 并渲染词汇页', () => {
    const { root: routedRoot, link } = mountRoutedHome();
    expect(location.pathname).toBe('/');

    link.focus();
    expect(document.activeElement).toBe(link);
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));

    expect(location.pathname).toBe('/vocabulary');
    expect(routedRoot.textContent).toContain('词汇 · 必修一 Unit 1');
    expect(routedRoot.textContent).toContain('标记已学');
    // 首页已卸载（SPA 渲染切换成功，而不是停留原页）
    expect(routedRoot.querySelector('[data-testid="today-challenge-card"]')).toBeNull();
  });

  it('Enter 激活：原生链接不拦截 Enter 默认行为，聚焦后激活与点击同样跳转 /vocabulary', () => {
    const { root: routedRoot, link } = mountRoutedHome();
    link.focus();
    expect(document.activeElement).toBe(link);

    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    // 应用不 preventDefault：Enter 激活交给浏览器原生 <a> 语义处理
    expect(link.dispatchEvent(enter)).toBe(true);

    // jsdom 不实现「Enter → click」的浏览器默认动作，这里按原生链接语义补发激活事件
    link.click();
    expect(location.pathname).toBe('/vocabulary');
    expect(routedRoot.textContent).toContain('标记已学');
  });
});

describe('今日挑战卡 · 非空态只读', () => {
  it('有学习记录时卡内无链接 / 无 href / 无 tabindex，点击整卡不改 URL', () => {
    root = document.createElement('div');
    document.body.append(root);
    renderHome(root, activeDeps());

    const card = root.querySelector<HTMLElement>('[data-testid="today-challenge-card"]')!;
    expect(card.dataset.state).toBe('active');
    expect(card.textContent).toContain('今日挑战');
    expect(card.textContent).not.toContain(TODAY_CHALLENGE_EMPTY_TEXT);

    // 只读：卡内没有任何跳转入口或可聚焦元素
    expect(card.querySelector('a')).toBeNull();
    expect(card.querySelector('[href]')).toBeNull();
    expect(card.querySelector('[tabindex]')).toBeNull();
    expect(card.hasAttribute('data-link')).toBe(false);
    expect(card.querySelector('[data-testid="today-challenge-empty-link"]')).toBeNull();

    // 点击卡片不会触发 /vocabulary 跳转
    card.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
    expect(location.pathname).toBe('/');
  });
});
