import { describe, it, expect, afterEach } from 'vitest';
import { buildSiteFooter, buildSiteHeader, SITE_NAV_ITEMS } from './site-chrome';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';
import { renderWriting } from './writing';
import { renderMistakes } from './mistakes';
import { renderReport } from './report';
import { resetUnitState } from './unit-switch';

/**
 * Issue #31 视觉重做 · 全站骨架回归：
 * 统一顶栏（八个入口在每一页一致出现）+ 当前页高亮（aria-current 双指示）
 * + 页脚次级导航；首页 hero 与共享组件不再使用内联样式（样式只走令牌类）。
 */

// 与 store 测试同款：绕过 Node≥26 实验性全局 localStorage 遮蔽，取 jsdom 实例
function clearLocalStorage(): void {
  const g = globalThis as unknown as { _localStorage?: Storage; localStorage?: Storage };
  (g._localStorage ?? g.localStorage)?.clear();
}

const cleanups: Array<() => void> = [];

function mountPage(path: string, render: (root: HTMLElement) => void | (() => void)): HTMLElement {
  history.pushState(null, '', path);
  const root = document.createElement('div');
  const cleanup = render(root);
  if (typeof cleanup === 'function') cleanups.push(cleanup);
  return root;
}

const PAGES: Array<{ path: string; render: (root: HTMLElement) => void | (() => void) }> = [
  { path: '/', render: renderHome },
  { path: '/vocabulary', render: renderVocabulary },
  { path: '/grammar', render: renderGrammar },
  { path: '/reading', render: renderReading },
  { path: '/listening', render: renderListening },
  { path: '/writing', render: renderWriting },
  { path: '/mistakes', render: renderMistakes },
  { path: '/report', render: renderReport },
];

describe('全站骨架 · buildSiteHeader / buildSiteFooter', () => {
  afterEach(() => {
    for (const cleanup of cleanups.splice(0)) cleanup();
    resetUnitState();
    history.pushState(null, '', '/');
    clearLocalStorage();
  });

  it('导航项固定为「首页 + 七个模块入口」，顺序与首页模块卡片一致', () => {
    expect(SITE_NAV_ITEMS.map((i) => i.path)).toEqual([
      '/',
      '/vocabulary',
      '/grammar',
      '/reading',
      '/listening',
      '/writing',
      '/mistakes',
      '/report',
    ]);
  });

  it.each(SITE_NAV_ITEMS.map((i) => [i.path, i.label] as const))(
    '当前页 %s 高亮：aria-current="page" + 高亮类，其余入口不高亮',
    (path) => {
      const header = buildSiteHeader(path);
      const current = header.querySelector<HTMLAnchorElement>(`.site-nav__link[href="${path}"]`)!;
      expect(current.getAttribute('aria-current')).toBe('page');
      expect(current.classList.contains('site-nav__link--current')).toBe(true);

      const others = [...header.querySelectorAll<HTMLAnchorElement>('.site-nav__link')].filter(
        (a) => a.getAttribute('href') !== path,
      );
      expect(others).toHaveLength(SITE_NAV_ITEMS.length - 1);
      for (const link of others) {
        expect(link.getAttribute('aria-current')).toBeNull();
        expect(link.classList.contains('site-nav__link--current')).toBe(false);
      }
    },
  );

  it('品牌与全部导航入口都是 <a data-link>（走 SPA 内部跳转，不整页刷新）', () => {
    const header = buildSiteHeader('/');
    const brand = header.querySelector<HTMLAnchorElement>('.site-header__brand')!;
    expect(brand.getAttribute('href')).toBe('/');
    expect(brand.hasAttribute('data-link')).toBe(true);
    for (const link of header.querySelectorAll<HTMLAnchorElement>('.site-nav__link')) {
      expect(link.hasAttribute('data-link')).toBe(true);
    }
  });

  it('页脚含同一组八个入口（不高亮）与数据说明', () => {
    const footer = buildSiteFooter();
    const links = [...footer.querySelectorAll<HTMLAnchorElement>('.site-footer__link')];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(SITE_NAV_ITEMS.map((i) => i.path));
    for (const link of links) {
      expect(link.hasAttribute('data-link')).toBe(true);
      expect(link.getAttribute('aria-current')).toBeNull();
    }
    expect(footer.querySelector('.site-footer__meta')!.textContent).toContain('本机浏览器');
  });
});

describe('全站骨架 · 各页面接线', () => {
  afterEach(() => {
    for (const cleanup of cleanups.splice(0)) cleanup();
    resetUnitState();
    history.pushState(null, '', '/');
    clearLocalStorage();
  });

  it.each(PAGES.map((p) => [p.path, p.render] as const))(
    '%s 顶栏含完整八项导航与品牌，当前页高亮，页脚在 main 之后',
    (path, render) => {
      const root = mountPage(path, render);

      const header = root.querySelector<HTMLElement>('header.site-header')!;
      expect(header.querySelector('.site-header__brand')!.textContent).toBe('高中英语学习系统');
      for (const { path: href } of SITE_NAV_ITEMS) {
        expect(header.querySelector(`nav a[href="${href}"]`), `导航缺 ${href}`).toBeTruthy();
      }
      const current = header.querySelector(`.site-nav__link[href="${path}"]`)!;
      expect(current.getAttribute('aria-current')).toBe('page');

      // 结构顺序：header → main.page → footer（视觉层级：顶栏 / 正文 / 页脚）
      const footer = root.querySelector('footer.site-footer')!;
      const main = root.querySelector('main.page')!;
      expect(main).toBeTruthy();
      expect(footer.previousElementSibling).toBe(main);
    },
  );

  it('首页 hero 不使用内联样式（h1 与描述文案走 .hero* 类）', () => {
    const root = mountPage('/', renderHome);
    const hero = root.querySelector('.hero')!;
    expect(hero.querySelector('h1')!.textContent).toContain('高中英语学习系统');
    for (const el of [hero, ...Array.from(hero.querySelectorAll<HTMLElement>('*'))]) {
      expect(el.getAttribute('style')).toBeNull();
    }
  });
});
