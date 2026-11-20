/* T4 学习数据工具对接 · 验收场景 DOM 自证：
   /v2 预置错题（evidence.seedLocalStorage：localStorage['v1_wrongbook'] =
   [{id:'demo-1',question:'apple 的中文',answer:'苹果',wrongCount:1}]）
   → 在输入框填「复习错题」→ 点发送按钮 → 断言：
   1) query_wrongbook 工具调用结果卡常驻可见，摘要含预置错题
      （「错题共 1 条」「apple 的中文 → 苹果（错 1 次）」）；
   2) 助手正文与错题列表组件回读同一数据（同一工具数据源）；
   3) 版本身份护栏（防「截图是 v1 版本」回归）：URL 是 /v2、v2 对话壳
      根节点存在、顶栏标题「对话式陪学」、v1 页头不在场；
   4) 全程无控制台异常（favicon 404 为全站既有噪音），并留存截图。 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire('D:/Develop/Coder/Rust/supper-agent/frontend/app/node_modules/playwright/index.mjs');
const { chromium } = require('playwright');

const BASE = process.env.V2_BASE ?? 'http://127.0.0.1:4174';
const OUT = new URL('../shots/t4-wrongbook-preview/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
mkdirSync(OUT, { recursive: true });

// 与工单 evidence.preview.seedLocalStorage 完全一致的验收种子
const SEED_KEY = 'v1_wrongbook';
const SEED_VALUE = JSON.stringify([{ id: 'demo-1', question: 'apple 的中文', answer: '苹果', wrongCount: 1 }]);

const results = [];
const check = (name, cond, detail = '') => {
  results.push({ name, pass: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox', '--disable-gpu'] });

/** 既有环境噪音：全站（含 v1）均无 favicon.ico，浏览器自动请求必 404 */
const isPreexistingNoise = (text, loc) => {
  if (/favicon\.ico/.test(text) || /\/favicon\.ico$/.test(loc?.url ?? '')) return true;
  return false;
};

const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error' && !isPreexistingNoise(m.text(), m.location())) consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push(String(e)));

await page.addInitScript(([k, v]) => localStorage.setItem(k, v), [SEED_KEY, SEED_VALUE]);
await page.goto(BASE + '/v2', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
await page.waitForTimeout(600);

/* 交互态（与 evidence.preview.fill / click 对应）：输入框 → 复习错题，发送按钮 */
const input = page.getByLabel(/输入框/);
await input.fill('复习错题');
await page.getByRole('button', { name: '发送' }).click();

/* 终态：结果卡完成 + 错题列表组件上屏（流式回复渲染完毕） */
await page.waitForSelector('.v2-msg--assistant .v2-toolcard--ok', { timeout: 15000 });
await page.waitForSelector('.v2-msg--assistant .v2-list--wrong', { timeout: 15000 });
await page.waitForTimeout(2200); // 越过状态行 1.6s 自动隐藏，证明「卡片常驻」而非状态行

const snap = await page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  const t = (s) => q(s)?.textContent ?? '';
  const card = q('.v2-msg--assistant [data-tool-name="query_wrongbook"]');
  return {
    path: location.pathname,
    hasV2Root: !!q('[data-testid="v2-root"]'),
    topbarTitle: t('.v2-topbar__name'),
    v1Header: !!q('.site-header, .site-header__nav'),
    userBubble: t('.v2-msg--user .v2-msg__body'),
    cardVisible: !!card && getComputedStyle(card).display !== 'none',
    cardText: card?.textContent ?? '',
    cardBeforeBody: !!card && !!card.closest('.v2-msg__main')?.firstElementChild?.contains(card),
    bodyText: t('.v2-msg--assistant .v2-msg__body'),
    listText: t('.v2-msg--assistant .v2-list--wrong'),
  };
});

/* 版本身份护栏：截图必须是 v2 对话壳，绝不允许截到 v1 页面 */
check('URL 为 /v2（非 v1 页面）', snap.path === '/v2', snap.path);
check('v2 对话壳根节点在场', snap.hasV2Root);
check('顶栏标题为「对话式陪学」', snap.topbarTitle.includes('对话式陪学'), snap.topbarTitle);
check('v1 页头不在场', !snap.v1Header);

/* 交互链路：输入框 + 发送按钮（fill/click 生效，用户气泡上屏） */
check('输入「复习错题」已发送（用户气泡可见）', snap.userBubble.includes('复习错题'), snap.userBubble);

/* 视口内真实占位（截图可见性的几何证明，替代人眼） */
const box = await page
  .getByTestId('v2-root')
  .locator('[data-tool-name="query_wrongbook"]')
  .boundingBox();
check(
  '结果卡在视口内占位（宽>200px 高>40px）',
  !!box && box.width > 200 && box.height > 40 && box.y < 900,
  box ? `${Math.round(box.width)}x${Math.round(box.height)} @y${Math.round(box.y)}` : 'null',
);

/* 工具调用结果卡（界面判据） */
check('query_wrongbook 工具调用结果卡在场且可见', snap.cardVisible);
check('结果卡摘要：错题共 1 条', snap.cardText.includes('错题共 1 条'), snap.cardText.slice(0, 80));
check('结果卡摘要：apple 的中文 → 苹果（错 1 次）', snap.cardText.includes('apple 的中文 → 苹果（错 1 次）'));
check('结果卡常驻于正文之前（先调用后作答）', snap.cardBeforeBody);

/* 同一数据源：正文与列表组件回读预置错题 */
check('助手正文回读「错题本共 1 条」', snap.bodyText.includes('错题本共 1 条'), snap.bodyText.slice(0, 60));
check('错题列表组件含预置条目', snap.listText.includes('apple 的中文') && snap.listText.includes('苹果'));

/* 稳定性 */
check('无脚本报错', consoleErrors.length === 0, consoleErrors.join(' | ').slice(0, 200));

if (results.some((r) => !r.pass)) {
  console.log('SKIP 截图（存在失败断言，拒绝写入可能误导的截图）');
} else {
  await page.screenshot({ path: OUT + 't4-wrongbook-toolcard.png', fullPage: false });
  console.log(`shot: ${OUT}t4-wrongbook-toolcard.png`);
}

await ctx.close();
await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(JSON.stringify({ total: results.length, failed: failed.length }));
process.exit(failed.length ? 1 : 0);
