#!/usr/bin/env node
/* 打回修复自检（工单：首页今日进度状态行 截图打回）：
 * 1) 复现根因：1440x900 视口下 [data-testid=home-today-status] 是否在首屏外（旧截图拍不到本票功能）；
 * 2) 验证 selector 方案：scrollIntoViewIfNeeded 后功能区域完整入镜；
 * 3) 三态文案断言（空态 / 40% 进行中 / 100% 达标）+ 空态链接站内跳转断言。
 * 退出码：0 全部通过；1 有失败项。 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwright = require('D:/Develop/Coder/Rust/supper-agent/frontend/app/node_modules/playwright');

const URL_BASE = 'http://127.0.0.1:4174';
const SEL = "[data-testid='home-today-status']";
const today = (() => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
})();

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  :: ' + detail : ''}`);
};

const browser = await playwright.chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-gpu'],
});

try {
  /* --- 场景 1：空态（无 seed，全新上下文） --- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(URL_BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(400);

    const probe = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { exists: false };
      const r = el.getBoundingClientRect();
      return {
        exists: true,
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        vh: window.innerHeight,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        link: !!el.querySelector('a.home-today__start'),
        linkHref: el.querySelector('a.home-today__start')?.getAttribute('href') || null,
      };
    }, SEL);

    check('空态：状态行元素存在', probe.exists);
    check(
      '空态：文案=「今天还没有学习记录，去词汇模块开始吧。」',
      probe.text === '今天还没有学习记录，去词汇模块开始吧。',
      JSON.stringify(probe.text),
    );
    check('空态：引导链接 a.home-today__start → /vocabulary', probe.link && probe.linkHref === '/vocabulary');

    /* 根因复现：不滚动时状态行是否在 900px 视口外 */
    check(
      `根因复现：1440x900 不滚动时状态行在视口外，旧截图因此拍不到本票功能`,
      probe.exists && probe.top >= probe.vh,
      `top=${probe.top}, bottom=${probe.bottom}, viewport=${probe.vh}`,
    );

    /* selector 方案：滚动后入镜 */
    await page.locator(SEL).first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const after = await page.evaluate((sel) => {
      const r = document.querySelector(sel).getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: window.innerHeight };
    }, SEL);
    check(
      '修复：scrollIntoView 后状态行完整入镜（0 ≤ top 且 bottom ≤ 视口高）',
      after.top >= 0 && after.bottom <= after.vh,
      JSON.stringify(after),
    );

    /* 交互：点击空态链接 → 站内跳 /vocabulary */
    await page.locator('a.home-today__start').first().click({ timeout: 8000 });
    await page.waitForTimeout(600);
    const jump = await page.evaluate(() => ({
      path: location.pathname,
      vocab: !!document.querySelector("[data-testid='storage-hint']"),
    }));
    check('交互：点击链接站内跳转 /vocabulary 且词汇页渲染', jump.path === '/vocabulary' && jump.vocab, JSON.stringify(jump));
    await ctx.close();
  }

  /* --- 场景 2：有进度 40% --- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(([k1, v1, k2, v2]) => {
      localStorage.setItem(k1, v1);
      localStorage.setItem(k2, v2);
    }, [
      'english-learning.daily-activity.v1',
      JSON.stringify({ version: 1, days: { [today]: { vocab: 3, exercises: 5 } } }),
      'english-learning.daily-goal.v1',
      JSON.stringify({ version: 1, vocab: 10, exercises: 10 }),
    ]);
    const page = await ctx.newPage();
    await page.goto(URL_BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(400);
    const text = await page.locator(SEL).first().textContent();
    check('有进度：文案=「今日已完成 40%，继续加油！」', (text || '').trim() === '今日已完成 40%，继续加油！', JSON.stringify(text));
    await ctx.close();
  }

  /* --- 场景 3：达标 100% --- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(([k1, v1, k2, v2]) => {
      localStorage.setItem(k1, v1);
      localStorage.setItem(k2, v2);
    }, [
      'english-learning.daily-activity.v1',
      JSON.stringify({ version: 1, days: { [today]: { vocab: 10, exercises: 12 } } }),
      'english-learning.daily-goal.v1',
      JSON.stringify({ version: 1, vocab: 10, exercises: 10 }),
    ]);
    const page = await ctx.newPage();
    await page.goto(URL_BASE + '/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(400);
    const text = await page.locator(SEL).first().textContent();
    check(
      '达标：文案=「今日目标已达成（100%），保持节奏，继续加油！」',
      (text || '').trim() === '今日目标已达成（100%），保持节奏，继续加油！',
      JSON.stringify(text),
    );
    await ctx.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
