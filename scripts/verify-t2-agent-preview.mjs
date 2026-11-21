/* T2 Agent 运行时 · 预览场景 DOM 自证：fill「今天学什么」→ 点发送 →
   断言助手占位回复上屏（正文 + 组件）且无控制台异常，并留存截图。

   版本身份护栏（防「截图是 v1 版本」回归）：每个场景截图前都断言
   —— URL 是 /v2、v2 对话壳根节点存在、顶栏标题是「对话式陪学」、
      v1 侧边导航 / v1 首页元素不在场 —— 全部通过才允许落盘截图。 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire('D:/Develop/Coder/Rust/supper-agent/frontend/app/node_modules/playwright/index.mjs');
const { chromium } = require('playwright');

// 默认对准 vite.config.ts 固定的预览端口 4174（strictPort，被占即失败）；
// 可用 V2_BASE 覆盖（如指到 dev 服务器）
const BASE = process.env.V2_BASE ?? 'http://127.0.0.1:4174';
const OUT = new URL('../shots/t2-agent-preview/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
mkdirSync(OUT, { recursive: true });

const SEED_WRONG = "{\"version\":1,\"entries\":{\"w:demo-adapt\":{\"exerciseId\":\"w:demo-adapt\",\"module\":\"vocab\",\"stem\":\"「适应；改编」对应的单词是？\",\"yourAnswer\":\"adopt\",\"correctAnswer\":\"adapt\",\"explanation\":\"adapt vt. 适应；改编\",\"wrongCount\":2,\"lastWrongAt\":1732080000000}}}";

const results = [];
const check = (scene, name, cond, detail = '') => {
  results.push({ scene, name, pass: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'} [${scene}] ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox', '--disable-gpu'] });

/** 既有环境噪音：全站（含 v1）均无 favicon.ico，浏览器自动请求必 404，
    与 /v2 页面逻辑无关（修它需改 index.html，超出本票「仅 src/v2/」范围）。 */
const isPreexistingNoise = (text, loc) => {
  if (/favicon\.ico/.test(text) || /\/favicon\.ico$/.test(loc?.url ?? '')) return true;
  return false;
};

async function scene({ label, shot, viewport, seed, fill, click, waitMs, asserts }) {
  const ctx = await browser.newContext({ viewport: viewport ?? { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && !isPreexistingNoise(m.text(), m.location())) consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  if (seed) {
    await page.addInitScript((kv) => { for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); }, seed);
  }
  await page.goto(BASE + '/v2', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  if (fill) await page.locator(fill.selector).first().fill(fill.text, { timeout: 8000 });
  if (click) await page.locator(click).first().click({ timeout: 8000 });
  await page.waitForTimeout(waitMs ?? 400);
  const snap = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const t = (s) => q(s)?.textContent ?? '';
    return {
      path: location.pathname,
      hasV2Root: !!q('[data-testid="v2-root"]'),
      topbarTitle: t('.v2-topbar__name'),
      // v1 全部页面（home/vocabulary/grammar/…）都带 site-header 页头：
      // 它在场即说明截到的是 v1 版本
      v1Sidebar: !!q('.site-header, .site-header__nav'),
      v1HomeEntry: !!q('[data-testid="home-v2-entry"], .home-hero, .module-card'),
      mode: t('[data-testid="v2-mode"]'),
      welcome: !!q('[data-testid="v2-welcome"]'),
      chips: document.querySelectorAll('.v2-chip').length,
      userMsgs: document.querySelectorAll('.v2-msg--user').length,
      asstText: t('.v2-msg--assistant .v2-msg__body'),
      status: t('.v2-msg--assistant .v2-msg__status'),
      statusHidden: q('.v2-msg--assistant .v2-msg__status')?.hidden ?? true,
      cards: [...document.querySelectorAll('.v2-card__word-en')].map((n) => n.textContent),
      trackNow: q('.v2-progress__track')?.getAttribute('aria-valuenow') ?? null,
      wrongList: t('.v2-list--wrong'),
      compTypes: [...document.querySelectorAll('[data-comp-type]')].map((n) => n.getAttribute('data-comp-type')),
      bodyHasFence: t('.v2-msg--assistant .v2-msg__body').includes('```'),
    };
  });

  // 版本身份护栏：截图必须是 v2 对话壳，绝不允许截到 v1 页面
  check(label, 'URL 为 /v2（非 v1 页面）', snap.path === '/v2', snap.path);
  check(label, 'v2 对话壳根节点在场', snap.hasV2Root);
  check(label, '顶栏标题为「对话式陪学」', snap.topbarTitle.includes('对话式陪学'), snap.topbarTitle);
  check(label, 'v1 侧边导航不在场', !snap.v1Sidebar);
  check(label, 'v1 首页元素不在场', !snap.v1HomeEntry);

  await asserts(snap, consoleErrors);
  // 护栏或断言失败时不落盘截图（避免旧版截图混入验收材料）
  if (results.some((r) => !r.pass && r.scene === label)) {
    console.log(`SKIP 截图 ${shot}（存在失败断言，拒绝写入可能误导的截图）`);
  } else {
    await page.screenshot({ path: OUT + shot, fullPage: false });
  }
  await ctx.close();
}

await scene({
  label: 'T2 初始欢迎',
  shot: 't2-welcome.png',
  waitMs: 400,
  asserts: (s, errors) => {
    check('T2 初始欢迎', '离线陪学模式徽标', s.mode.includes('离线陪学'), s.mode);
    check('T2 初始欢迎', '欢迎卡在场', s.welcome);
    check('T2 初始欢迎', '快捷指令 chips ≥1', s.chips >= 1, `chips=${s.chips}`);
    check('T2 初始欢迎', '无控制台异常', errors.length === 0, errors.join(' | ').slice(0, 200));
  },
});

await scene({
  label: 'T2 对话发送与回复',
  shot: 't2-send-reply.png',
  fill: { selector: '[data-testid="v2-input"]', text: '今天学什么' },
  click: '[data-testid="v2-send"]',
  waitMs: 2000,
  asserts: (s, errors) => {
    check('T2 对话发送与回复', '离线占位模式徽标', s.mode.includes('离线陪学'), s.mode);
    check('T2 对话发送与回复', '用户消息已上屏', s.userMsgs === 1);
    check('T2 对话发送与回复', '助手占位回复含今日目标', s.asstText.includes('今日目标'), s.asstText.slice(0, 40));
    check('T2 对话发送与回复', '助手占位回复含今日计划正文', s.asstText.includes('今天的计划'));
    check('T2 对话发送与回复', '正文无围栏 JSON 原文', !s.bodyHasFence);
    check('T2 对话发送与回复', '首组词汇卡 ≥1', s.cards.length >= 1, `cards=${s.cards.length}`);
    check('T2 对话发送与回复', '进度组件出现（track）', s.trackNow !== null, `aria=${s.trackNow}`);
    check('T2 对话发送与回复', '无控制台异常', errors.length === 0, errors.join(' | ').slice(0, 200));
  },
});

await scene({
  label: 'T2 工具调用证据',
  shot: 't2-tool-call.png',
  seed: { 'english-learning.wrongbook.v1': SEED_WRONG },
  fill: { selector: '[data-testid="v2-input"]', text: '复习错题' },
  click: '[data-testid="v2-send"]',
  waitMs: 1400,
  asserts: (s, errors) => {
    check('T2 工具调用证据', '工具调用状态可见', !s.statusHidden && s.status.includes('✓ query_wrongbook 完成'), s.status);
    check('T2 工具调用证据', '结果卡正文回读预置错题', s.asstText.includes('错题本共 1 条'), s.asstText.slice(0, 40));
    check('T2 工具调用证据', '错题列表卡（list wrong）', s.wrongList.includes('adapt') && s.wrongList.includes('adopt'));
    check('T2 工具调用证据', '无控制台异常', errors.length === 0, errors.join(' | ').slice(0, 200));
  },
});

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`shots: ${OUT}`);
console.log(JSON.stringify({ total: results.length, failed: failed.length }));
process.exit(failed.length ? 1 : 0);
