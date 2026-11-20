/* T2 Agent 运行时 · 预览场景 DOM 自证：fill「今天学什么」→ 点发送 →
   断言助手占位回复上屏（正文 + 组件）且无控制台异常，并留存截图。 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire('D:/Develop/Coder/Rust/supper-agent/frontend/app/node_modules/playwright/index.mjs');
const { chromium } = require('playwright');

const BASE = 'http://127.0.0.1:4175';
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
      mode: t('[data-testid="v2-mode"]'),
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
  await asserts(snap, consoleErrors);
  await page.screenshot({ path: OUT + shot, fullPage: false });
  await ctx.close();
}

await scene({
  label: 'T2 对话发送与回复',
  shot: 't2-send-reply.png',
  fill: { selector: '[data-testid="v2-input"]', text: '今天学什么' },
  click: '[data-testid="v2-send"]',
  waitMs: 2000,
  asserts: (s, errors) => {
    check('T2', '离线占位模式徽标', s.mode.includes('离线陪学'), s.mode);
    check('T2', '用户消息已上屏', s.userMsgs === 1);
    check('T2', '助手占位回复含今日目标', s.asstText.includes('今日目标'), s.asstText.slice(0, 40));
    check('T2', '助手占位回复含今日计划正文', s.asstText.includes('今天的计划'));
    check('T2', '正文无围栏 JSON 原文', !s.bodyHasFence);
    check('T2', '首组词汇卡 ≥1', s.cards.length >= 1, `cards=${s.cards.length}`);
    check('T2', '进度组件出现（track）', s.trackNow !== null, `aria=${s.trackNow}`);
    check('T2', '无控制台异常', errors.length === 0, errors.join(' | ').slice(0, 200));
  },
});

await scene({
  label: 'T2 工具调用证据（预置错题 → 复习错题）',
  shot: 't2-tool-call.png',
  seed: { 'english-learning.wrongbook.v1': SEED_WRONG },
  fill: { selector: '[data-testid="v2-input"]', text: '复习错题' },
  click: '[data-testid="v2-send"]',
  waitMs: 1400,
  asserts: (s, errors) => {
    check('T2-tool', '工具调用状态可见', !s.statusHidden && s.status.includes('✓ query_wrongbook 完成'), s.status);
    check('T2-tool', '结果卡正文回读预置错题', s.asstText.includes('错题本共 1 条'), s.asstText.slice(0, 40));
    check('T2-tool', '错题列表卡（list wrong）', s.wrongList.includes('adapt') && s.wrongList.includes('adopt'));
    check('T2-tool', '无控制台异常', errors.length === 0, errors.join(' | ').slice(0, 200));
  },
});

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`shots: ${OUT}`);
console.log(JSON.stringify({ total: results.length, failed: failed.length }));
process.exit(failed.length ? 1 : 0);
