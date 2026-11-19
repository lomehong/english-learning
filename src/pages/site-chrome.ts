/**
 * 全站共享站点骨架（Issue #31 视觉重做）：
 * - 顶栏：品牌 + 完整模块导航（八个入口在**每个**页面一致出现），
 *   当前页高亮（class site-nav__link--current + aria-current="page"）；
 * - 页脚：次级导航 + 数据存放说明，闭合「页头 → 正文 → 页脚」的视觉层级。
 *
 * 各页面不再各自手写 nav 子集（旧实现每页导航链接不同，跨页跳转能力不一致）；
 * 样式全部走 tokens.css 语义令牌（base.css 的 .site-* 规则），无内联样式。
 */

export interface SiteNavItem {
  path: string;
  label: string;
}

/** 站点品牌（与首页 h1 文案共用口径：高中英语学习系统） */
export const SITE_BRAND = '高中英语学习系统';

/** 全站导航：首页 + 七个功能入口（顺序与首页模块卡片一致） */
export const SITE_NAV_ITEMS: readonly SiteNavItem[] = [
  { path: '/', label: '首页' },
  { path: '/vocabulary', label: '词汇' },
  { path: '/grammar', label: '语法' },
  { path: '/reading', label: '阅读' },
  { path: '/listening', label: '听力' },
  { path: '/writing', label: '写作' },
  { path: '/mistakes', label: '错题本' },
  { path: '/report', label: '学习报告' },
];

/**
 * 顶栏：品牌链接回首页；导航项与 SITE_NAV_ITEMS 一致。
 * currentPath 命中的项标记 aria-current="page" 并加高亮类（视觉 + 辅助技术双重指示）。
 */
export function buildSiteHeader(currentPath: string): HTMLElement {
  const header = document.createElement('header');
  header.className = 'site-header';

  const brand = document.createElement('a');
  brand.className = 'site-header__brand';
  brand.href = '/';
  brand.setAttribute('data-link', '');
  brand.textContent = SITE_BRAND;

  const nav = document.createElement('nav');
  nav.className = 'site-header__nav';
  nav.setAttribute('aria-label', '主导航');
  for (const { path, label } of SITE_NAV_ITEMS) {
    const link = document.createElement('a');
    link.className = 'site-nav__link';
    link.href = path;
    link.setAttribute('data-link', '');
    link.textContent = label;
    if (path === currentPath) {
      link.classList.add('site-nav__link--current');
      link.setAttribute('aria-current', 'page');
    }
    nav.append(link);
  }

  const inner = document.createElement('div');
  inner.className = 'site-header__inner';
  inner.append(brand, nav);
  header.append(inner);
  return header;
}

/** 页脚：次级导航（同八个入口，不高亮）+ 数据说明 */
export function buildSiteFooter(): HTMLElement {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';

  const nav = document.createElement('nav');
  nav.className = 'site-footer__nav';
  nav.setAttribute('aria-label', '页脚导航');
  for (const { path, label } of SITE_NAV_ITEMS) {
    const link = document.createElement('a');
    link.className = 'site-footer__link';
    link.href = path;
    link.setAttribute('data-link', '');
    link.textContent = label;
    nav.append(link);
  }

  const meta = document.createElement('p');
  meta.className = 'site-footer__meta';
  meta.textContent = `${SITE_BRAND} · 人教2019 七册 35 单元 · 学习进度保存在本机浏览器`;

  const inner = document.createElement('div');
  inner.className = 'site-footer__inner';
  inner.append(nav, meta);
  footer.append(inner);
  return footer;
}
