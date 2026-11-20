import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderHome } from '../pages/home';
import { renderVocabulary } from '../pages/vocabulary';
import { resetUnitState } from '../pages/unit-switch';
import { THEME_LABELS, THEME_SETTINGS } from '../theme/theme';

/**
 * 首页页头 × 全局主题切换器 · 360px 窄屏遮挡回归：
 * 切换器 fixed 于视口右上角（z-index:100）；91rem 档给页头预留 padding-right:13.5rem
 * 让位。但 360px（22.5rem）下品牌行（衬线 8 字 + 印章标记 ≈ 11.2rem）与让位后剩余
 * 内容宽（22.5 − 2×1rem 留白 − 13.5rem ≈ 7.5rem）同行放不下，nowrap 品牌溢入让位区
 * 被固定切换器盖住。修复只动首页页头：≤40rem 档取消右侧让位、改为顶部让位横带——
 * 页头内容整体下移到切换器横带（top 0.5rem + 高约 2.33rem）之下，两者垂直错开。
 * 布局在 CSS 文件里，jsdom 不加载样式表，因此解析 base.css/tokens.css 断言规则，
 * 并用与 module-grid.test.ts 同款的几何模拟验证 360/390px 无重叠、无横向溢出；
 * 768/1280px（>40rem）不命中新规则，91rem 让位保持原样 → 布局不回归。
 */

// jsdom 环境下 import.meta.url 不是 file: 协议，改用进程工作区根解析源码路径
const css = readFileSync(join(process.cwd(), 'src', 'styles', 'base.css'), 'utf8');
const tokens = readFileSync(join(process.cwd(), 'src', 'styles', 'tokens.css'), 'utf8');

/** 与 home.ts 页头品牌文案一致（下方 DOM 用例锚定长度，供几何模拟取字宽） */
const BRAND_TEXT = '高中英语学习系统';

/** 取 @media (max-width: Xrem) 块体（花括号配对，块内不再嵌套媒体查询） */
function mediaBody(maxWidth: string): string {
  const header = `@media (max-width: ${maxWidth})`;
  const start = css.indexOf(header);
  expect(start, `base.css 应包含 ${header}`).toBeGreaterThanOrEqual(0);
  const open = css.indexOf('{', start);
  let depth = 1;
  let i = open + 1;
  while (i < css.length && depth > 0) {
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}') depth -= 1;
    i += 1;
  }
  return css.slice(open + 1, i - 1);
}

/** 在无嵌套的 CSS 片段里取第一条匹配规则的声明体 */
function ruleBody(segment: string, selectorRe: RegExp): string | null {
  const m = selectorRe.exec(segment);
  return m ? m[1]! : null;
}

/** tokens.css 里的 rem 型令牌值（--space-1 等） */
function tokenRem(name: string): number {
  const m = new RegExp(`--${name}:\\s*([\\d.]+)rem`).exec(tokens);
  if (!m) throw new Error(`tokens.css 应定义 --${name}（rem 值）`);
  return Number(m[1]);
}

/** 长度声明换算为 rem：支持 `Nrem` / `Npx` / `var(--t)` / `calc(a + b)` */
function lenRem(decl: string): number {
  const calc = /calc\((.+)\)/.exec(decl)?.[1] ?? decl;
  let total = 0;
  for (const part of calc.split('+').map((s) => s.trim())) {
    if (!part) continue;
    const varName = /var\(--([\w-]+)\)/.exec(part)?.[1];
    if (varName) total += tokenRem(varName);
    else if (part.endsWith('rem')) total += Number(part.slice(0, -3));
    else if (part.endsWith('px')) total += Number(part.slice(0, -2)) / 16;
    else total += Number(part);
  }
  return total;
}

function declOf(body: string, prop: string): string {
  const m = new RegExp(`${prop}:\\s*([^;]+);`).exec(body);
  if (!m) throw new Error(`声明体应包含 ${prop}（实际：${body}）`);
  return m[1]!.trim();
}

/** 声明值开头的像素数（如 `1px solid …` → 1） */
function leadingPx(decl: string): number {
  const m = /^(\d+)px/.exec(decl.trim());
  if (!m) throw new Error(`声明值应以 Npx 开头（实际：${decl}）`);
  return Number(m[1]);
}

/** 声明值开头的 em 数（如 `0.58em` → 0.58） */
function leadingEm(decl: string): number {
  const m = /^([\d.]+)em/.exec(decl.trim());
  if (!m) throw new Error(`声明值应以 Nem 开头（实际：${decl}）`);
  return Number(m[1]);
}

/* ---- 固定切换器的几何足迹（值全部回源解析自 CSS，避免漂移） ---- */

/** 切换器按钮内容行高（继承 body，取 body 规则里的 line-height） */
function bodyLineHeight(): number {
  for (const m of css.matchAll(/(?:^|,)\s*body\s*\{([^}]*)\}/gm)) {
    const lh = /line-height:\s*([\d.]+)\s*;/.exec(m[1]!);
    if (lh) return Number(lh[1]);
  }
  throw new Error('base.css 的 body 规则应声明 line-height');
}

const switcherBase = ruleBody(css, /\.theme-switcher\s*\{([^}]*)\}/)!;
const switcherBtn = ruleBody(css, /\.theme-switcher__btn\s*\{([^}]*)\}/)!;

/** 小屏（≤40rem）切换器顶缘偏移：该档 top 归一为 space-2 */
const switcherTopSmall = lenRem(declOf(mediaBody('40rem').match(/\.theme-switcher\s*\{([^}]*)\}/)![1]!, 'top'));

/** 切换器高度 = 按钮行盒 + 按钮 padding×2 + 容器 padding×2 + 边框×2 */
function switcherHeightRem(): number {
  const lineHeight = bodyLineHeight();
  const xs = tokenRem('font-size-xs');
  // padding 简写第一位是竖直方向（上下），几何高度取 [0]
  const btnPaddingY = lenRem(declOf(switcherBtn, 'padding').split(/\s+/)[0]!);
  const boxPadding = lenRem(declOf(switcherBase, 'padding'));
  const borderPx = leadingPx(declOf(switcherBase, 'border'));
  return xs * lineHeight + 2 * btnPaddingY + 2 * boxPadding + (2 * borderPx) / 16;
}

/** 切换器宽度 = Σ(标签字数 × xs + 按钮 padding×2) + 按钮间 gap×2 + 容器 padding×2 + 边框×2 */
function switcherWidthRem(): number {
  const xs = tokenRem('font-size-xs');
  // padding 简写第二位是水平方向（左右），几何宽度取 [1]
  const btnPaddingX = lenRem(declOf(switcherBtn, 'padding').split(/\s+/)[1]!);
  const gap = lenRem(declOf(switcherBase, 'gap'));
  const boxPadding = lenRem(declOf(switcherBase, 'padding'));
  const borderPx = leadingPx(declOf(switcherBase, 'border'));
  const labelsWidth = THEME_SETTINGS.reduce(
    (sum, setting) => sum + THEME_LABELS[setting].length * xs + 2 * btnPaddingX,
    0,
  );
  const gaps = (THEME_SETTINGS.length - 1) * gap;
  return labelsWidth + gaps + 2 * boxPadding + (2 * borderPx) / 16;
}

/** 品牌行宽：印章标记（0.58em）+ 右距 + 8 个全角字（font-size-lg，CJK 字宽 ≈ 1em） */
function brandRowWidthRem(): number {
  const brandRule = ruleBody(css, /\.site-header__brand\s*\{([^}]*)\}/)!;
  const markRule = ruleBody(css, /\.site-header__brand::before\s*\{([^}]*)\}/)!;
  const lg = lenRem(declOf(brandRule, 'font-size'));
  const markEm = leadingEm(declOf(markRule, 'width'));
  const markGap = lenRem(declOf(markRule, 'margin-right'));
  return markEm * lg + markGap + BRAND_TEXT.length * lg;
}

describe('首页页头 × 主题切换器 · 让位横带规则（base.css）', () => {
  const small = mediaBody('40rem');

  it('≤40rem：首页页头取消右侧 13.5rem 让位，改为顶部让位横带（垂直错开切换器）', () => {
    const home = ruleBody(small, /\.site-header--home\s+\.site-header__inner\s*\{([^}]*)\}/);
    expect(home, '≤40rem 应有首页页头专属规则 .site-header--home .site-header__inner').toBeTruthy();
    // 右侧让位复位：不再把品牌行挤进固定切换器下方（91rem 档的 13.5rem 在此被覆盖）
    expect(home).toMatch(/padding-right:\s*var\(--space-4\)\s*;/);
    expect(home).not.toMatch(/13\.5rem/);
    // 顶部让位：页头内容整体下移，从切换器横带之下排起
    expect(home).toMatch(/padding-top:\s*calc\(var\(--space-7\)\s*\+\s*var\(--space-2\)\)\s*;/);
  });

  it('让位横带只存在于 ≤40rem 档：768/1280px（>40rem）不命中，91rem 让位原样保留', () => {
    // 修饰类选择器全文件只出现一次，且就在 40rem 块内 → 大屏不命中
    const total = css.split('.site-header--home').length - 1;
    const inSmall = small.split('.site-header--home').length - 1;
    expect(inSmall).toBe(1);
    expect(total).toBe(inSmall);

    // 40rem ~ 91rem 档维持原让位：预留宽 ≥ 切换器宽 + 右缘偏移 + 间距
    const mid = mediaBody('91rem');
    const reserve = ruleBody(mid, /\.site-header__inner\s*\{([^}]*)\}/);
    expect(reserve).toMatch(/padding-right:\s*13\.5rem/);
    const needed = switcherWidthRem() + tokenRem('space-2') * 2;
    expect(13.5, `91rem 让位 13.5rem 应 ≥ 切换器需求 ${needed}rem`).toBeGreaterThanOrEqual(needed);
  });

  it('几何模拟 · 360/390px：品牌行顶缘在切换器底缘之下（无重叠），行宽不超内容宽（无横向滚动）', () => {
    const home = ruleBody(small, /\.site-header--home\s+\.site-header__inner\s*\{([^}]*)\}/)!;
    const headerRule = ruleBody(css, /\.site-header\s*\{([^}]*)\}/)!;
    const brandTop = lenRem(declOf(home, 'padding-top')) + leadingPx(declOf(headerRule, 'border-top')) / 16;
    const switcherBottom = switcherTopSmall + switcherHeightRem();
    // 验收 1：垂直错开（留 ≥ space-1 呼吸间距），横向无需再让位
    expect(brandTop - switcherBottom, `品牌行顶缘 ${brandTop}rem 应低于切换器底缘 ${switcherBottom}rem`).toBeGreaterThanOrEqual(tokenRem('space-1'));

    for (const vw of [360, 390]) {
      const vwRem = vw / 16;
      const contentWidth = vwRem - 2 * tokenRem('space-4'); // 页头内层左右留白（右让位已复位）
      expect(brandRowWidthRem(), `${vw}px 品牌行应放得下`).toBeLessThanOrEqual(contentWidth);
      expect(switcherWidthRem() + tokenRem('space-2'), `${vw}px 切换器应整体在视口内`).toBeLessThanOrEqual(vwRem);
    }

    // 反证旧布局不可行：品牌行 + 切换器同行放置的需求宽 > 360/390px 视口
    // （这也是 390px 采用同款让位横带、不视为回归的原因）
    const rowNeed = tokenRem('space-4') + brandRowWidthRem() + tokenRem('space-2') + switcherWidthRem() + tokenRem('space-2');
    expect(rowNeed).toBeGreaterThan(360 / 16);
    expect(rowNeed).toBeGreaterThan(390 / 16);
  });

  it('几何模拟 · 768/1280px：91rem 让位档品牌行与切换器横向不相交（布局不回归）', () => {
    for (const vw of [768, 1280]) {
      const vwRem = vw / 16;
      const contentWidth = vwRem - tokenRem('space-4') - 13.5; // 基础左留白 + 91rem 右让位
      expect(brandRowWidthRem(), `${vw}px 让位后品牌行应放得下`).toBeLessThanOrEqual(contentWidth);
    }
  });
});

describe('首页页头 × 主题切换器 · 结构挂载（home.ts）', () => {
  beforeEach(() => {
    resetUnitState();
    history.replaceState(null, '', '/');
  });

  afterEach(() => {
    resetUnitState();
    history.replaceState(null, '', '/');
  });

  it('首页页头带 site-header--home 修饰类（让位横带只命中首页）', () => {
    const root = document.createElement('div');
    document.body.append(root);
    renderHome(root);

    const header = root.querySelector('header.site-header')!;
    expect(header.classList.contains('site-header--home')).toBe(true);
    expect(header.querySelector('.site-header__brand')!.textContent).toBe(BRAND_TEXT);
    root.remove();
  });

  it('其他页面页头不带该修饰类：词头样式维持原行为（范围外页面不动）', () => {
    const host = document.createElement('div');
    document.body.append(host);
    renderVocabulary(host);

    expect(host.querySelector('header.site-header')).toBeTruthy();
    expect(host.querySelector('header.site-header')!.classList.contains('site-header--home')).toBe(false);
    host.remove();
  });
});
