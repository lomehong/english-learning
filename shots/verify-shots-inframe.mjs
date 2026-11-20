#!/usr/bin/env node
/* 逐张复核产物截图：按 preview-capture.mjs 的同一流程重放每个场景，
 * 断言截图瞬间 selector 的包围盒完全落在 1440x900 视口内（功能必须入镜），
 * 并把状态行文本一并断言。退出码 0 = 全部入镜。 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const playwright = require('D:/Develop/Coder/Rust/supper-agent/frontend/app/node_modules/playwright');

const plan = JSON.parse(readFileSync('D:/Develop/Coder/Rust/supper-agent/.m0/artifacts/ticket-15-1795184637604382/preview-plan.json', 'utf8'));
const today = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

const EXPECT_TEXT = {
  0: '今天还没有学习记录，去词汇模块开始吧。',
  1: null, // 词汇页：只验 storage-hint 入镜
  2: '今日已完成 40%，继续加油！',
  3: '今日目标已达成（100%），保持节奏，继续加油！',
};

const browser = await playwright.chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-gpu'],
});

let failed = 0;
try {
  for (const [i, sc] of plan.scenarios.entries()) {
    const ctx = await browser.newContext({ viewport: { width: plan.width, height: plan.height } });
    const page = await ctx.newPage();
    if (sc.seedLocalStorage) {
      const seed = { ...sc.seedLocalStorage };
      // 日期键以复核当日为准重放（与拍摄日同一天时等价）
      for (const k of Object.keys(seed)) seed[k] = seed[k].replaceAll(/\d{4}-\d{2}-\d{2}/g, today);
      await page.addInitScript((kv) => {
        for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, String(v));
      }, seed);
    }
    await page.goto(plan.url.replace(/\/$/, '') + sc.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    if (sc.click) await page.locator(sc.click).first().click({ timeout: 8000 });
    await page.waitForTimeout(Math.min(Math.max(Number(sc.waitMs) || 400, 0), 10000));
    const target = page.locator(sc.selector).first();
    await target.scrollIntoViewIfNeeded({ timeout: 8000 });
    await page.waitForTimeout(200);
    const box = await target.boundingBox();
    const text = (await target.textContent()).replace(/\s+/g, ' ').trim();
    const inFrame = box && box.y >= 0 && box.y + box.height <= plan.height && box.x >= 0 && box.x + box.width <= plan.width;
    const textOk = EXPECT_TEXT[i] === null || text === EXPECT_TEXT[i];
    const ok = !!inFrame && textOk;
    if (!ok) failed += 1;
    console.log(`${ok ? 'PASS' : 'FAIL'}  场景${i + 1} selector=${sc.selector} box=${JSON.stringify(box)} inFrame=${!!inFrame} text=${JSON.stringify(text)}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(failed ? `\n${failed} scenario(s) failed` : '\nall scenarios in-frame');
process.exit(failed ? 1 : 0);
