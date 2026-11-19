import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderHome } from '../pages/home';
import { resetUnitState } from '../pages/unit-switch';

/**
 * 首页「七大模块入口」布局回归：
 * 旧实现 repeat(auto-fill, minmax(15rem, 1fr)) 在桌面（--page-max-width: 64rem →
 * 网格约 992px）落到 3 列，7 卡 = 3+3+1，末行只剩一张孤卡。
 * 新实现按断点分档的固定跨列：
 *   桌面（>56rem）12 轨：前 4 卡 span 3 + 后 3 卡 span 4 → 4+3 两行铺满；
 *   中屏（≤56rem）2 轨：前 6 卡各 1 轨 + 末卡 1/-1 跨满 → 2+2+2+1(满行)；
 *   小屏（≤40rem）单轨 minmax(0, 1fr)：贴容器宽 → 390px 无横向溢出。
 * 布局在 CSS 文件里，jsdom 不加载样式表，因此这里直接解析 base.css
 * 断言三个档位的轨道/跨列规则，并用网格自动放置模拟验证「无孤卡行」。
 */

// jsdom 环境下 import.meta.url 不是 file: 协议，改用进程工作区根解析源码路径
const css = readFileSync(join(process.cwd(), 'src', 'styles', 'base.css'), 'utf8');

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
  return m ? m[1] : null;
}

/** .module-grid 的 grid-template-columns 值（空白归一） */
function gridColumns(segment: string): string {
  const body = ruleBody(segment, /\.module-grid\s*\{([^}]*)\}/);
  const m = body ? /grid-template-columns:\s*([^;]+);/.exec(body) : null;
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

/** .module-card（基础规则）的跨列 span 数 */
function cardSpan(segment: string): number | null {
  const body = ruleBody(segment, /\.module-card\s*\{([^}]*)\}/);
  const m = body ? /grid-column:\s*span\s+(\d+)/.exec(body) : null;
  return m ? Number(m[1]) : null;
}

/** .module-card:nth-child(n + 5) 的跨列 span 数 */
function wideCardSpan(segment: string): number | null {
  const body = ruleBody(segment, /\.module-card:nth-child\(\s*n\s*\+\s*5\s*\)\s*\{([^}]*)\}/);
  const m = body ? /grid-column:\s*span\s+(\d+)/.exec(body) : null;
  return m ? Number(m[1]) : null;
}

/** 某档位里涉及 .module-card 的规则的 grid-column 值列表（用于核对跨列复位） */
function cardGridColumns(segment: string): { selector: string; gridColumn: string | null }[] {
  const out: { selector: string; gridColumn: string | null }[] = [];
  for (const m of segment.matchAll(/([^{}]+?)\{([^{}]*)\}/g)) {
    const selector = m[1].replace(/\s+/g, ' ').trim();
    if (!selector.includes('.module-card')) continue;
    const decl = /grid-column:\s*([^;]+);/.exec(m[2]);
    out.push({ selector, gridColumn: decl ? decl[1].replace(/\s+/g, ' ').trim() : null });
  }
  return out;
}

/** CSS Grid 稀疏自动放置的简化模拟：按序放卡，当前行放不下就换行 */
function place(spans: number[], tracks: number): number[][] {
  const rows: number[][] = [];
  let current: number[] = [];
  let used = 0;
  for (const span of spans) {
    const width = Math.min(span, tracks);
    if (used + width > tracks && current.length > 0) {
      rows.push(current);
      current = [];
      used = 0;
    }
    current.push(width);
    used += width;
  }
  if (current.length > 0) rows.push(current);
  return rows;
}

/** 行内卡片占的轨道数合计 */
const rowTracks = (row: number[]): number => row.reduce((a, b) => a + b, 0);

describe('首页七大模块入口 · 布局档位（base.css）', () => {
  it('桌面档：12 轨网格 + 前 4 卡 span 3 / 后 3 卡 span 4 → 4+3 两行铺满，无孤卡行（1440px）', () => {
    // 页宽上限 --page-max-width: 64rem，视口 ≥1440px 时网格恒为约 992px，布局不再随视口变化
    expect(gridColumns(css)).toBe('repeat(12, minmax(0, 1fr))');
    expect(gridColumns(css)).not.toMatch(/auto-(?:fill|fit)/); // auto-fill 是旧孤行的根因
    const base = cardSpan(css);
    const wide = wideCardSpan(css);
    expect(base).toBe(3);
    expect(wide).toBe(4);

    const spans = [base!, base!, base!, base!, wide!, wide!, wide!]; // 7 卡（数量由下方 DOM 用例锚定）
    const rows = place(spans, 12);
    expect(rows).toEqual([
      [3, 3, 3, 3],
      [4, 4, 4],
    ]); // 4+3：两行都铺满 12 轨
    expect(rows.every((row) => row.length >= 2)).toBe(true); // 任何行都不是单卡孤行
    expect(rows.every((row) => rowTracks(row) === 12)).toBe(true); // 无留空尾轨
  });

  it('中屏档（≤56rem）：两列 + 末卡跨满整行 → 2+2+2+1(满行)，无窄孤卡', () => {
    const mid = mediaBody('56rem');
    expect(gridColumns(mid)).toBe('repeat(2, minmax(0, 1fr))');
    // 桌面档的 span 3 / span 4 必须复位为 auto，否则 2 轨网格被撑出横向溢出
    const cardRules = cardGridColumns(mid);
    expect(cardRules.some((r) => r.gridColumn === 'auto')).toBe(true);
    expect(cardRules.some((r) => r.gridColumn?.match(/span/))).toBe(false);
    // 末卡 1 / -1 跨满两轨
    const last = ruleBody(mid, /\.module-card:last-child\s*\{([^}]*)\}/);
    expect(last && /grid-column:\s*1\s*\/\s*-1\s*;/.test(last)).toBe(true);

    const rows = place([1, 1, 1, 1, 1, 1, 2], 2);
    expect(rows).toEqual([
      [1, 1],
      [1, 1],
      [1, 1],
      [2],
    ]);
    // 单卡行只允许出现在「跨满整轨」的形态（宽卡），不允许窄孤卡
    expect(rows.every((row) => row.length >= 2 || rowTracks(row) === 2)).toBe(true);
  });

  it('小屏档（≤40rem）：单列 minmax(0, 1fr) + 跨列全部复位 → 390px 无横向溢出', () => {
    const small = mediaBody('40rem');
    // minmax(0, 1fr)：轨道最小宽为 0，长内容只能换行、不能把轨道撑出容器
    expect(gridColumns(small)).toBe('minmax(0, 1fr)');
    const cardRules = cardGridColumns(small);
    expect(cardRules.length).toBeGreaterThan(0);
    expect(cardRules.every((r) => r.gridColumn === 'auto')).toBe(true); // span 3/4 与 1/-1 全部归位
  });
});

describe('首页七大模块入口 · 结构（home.ts）', () => {
  beforeEach(() => {
    resetUnitState();
    history.replaceState(null, '', '/');
  });

  afterEach(() => {
    resetUnitState();
    history.replaceState(null, '', '/');
  });

  it('7 张卡齐全：编号 01–07、入口链接与标题逐卡对应（不删模块、不改编号/链接/文案）', () => {
    const root = document.createElement('div');
    document.body.append(root);
    renderHome(root);

    const cards = [...root.querySelectorAll('a.module-card')];
    expect(cards).toHaveLength(7); // 与上媒体档位模拟用的 7 卡数量互相锚定
    expect(cards.map((c) => c.querySelector('.module-card__no')?.textContent)).toEqual([
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
    ]);
    expect(cards.map((c) => c.getAttribute('href'))).toEqual([
      '/vocabulary',
      '/grammar',
      '/reading',
      '/listening',
      '/writing',
      '/mistakes',
      '/report',
    ]);
    expect(cards.map((c) => c.querySelector('.module-card__title')?.textContent)).toEqual([
      '词汇',
      '语法',
      '阅读',
      '听力',
      '写作',
      '错题本',
      '学习报告',
    ]);
    root.remove();
  });
});
