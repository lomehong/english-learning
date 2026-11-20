#!/usr/bin/env node
/* 刷新 worktree shots/home-*.png：旧图拍摄于功能合入前（错误版本的截图）。
 * 以当前构建重拍四档视口，并把本票功能（今日进度状态行）滚入镜内。退出码 0 = 全部成功。 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const playwright = require('D:/Develop/Coder/Rust/supper-agent/frontend/app/node_modules/playwright');

const URL_BASE = 'http://127.0.0.1:4174/';
const SEL = "[data-testid='home-today-status']";
const VIEWS = [
  [1280, 'home-1280.png'],
  [768, 'home-768.png'],
  [390, 'home-390.png'],
  [360, 'home-360.png'],
];

const browser = await playwright.chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-gpu'],
});

let failed = 0;
try {
  for (const [w, file] of VIEWS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(URL_BASE, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(400);
    const target = page.locator(SEL).first();
    await target.scrollIntoViewIfNeeded({ timeout: 8000 });
    await page.waitForTimeout(200);
    const box = await target.boundingBox();
    const text = (await target.textContent()).replace(/\s+/g, ' ').trim();
    const inFrame = box && box.y >= 0 && box.y + box.height <= 900;
    await page.screenshot({ path: `shots/${file}`, fullPage: false });
    const ok = !!inFrame && text === '今天还没有学习记录，去词汇模块开始吧。';
    if (!ok) failed += 1;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${file} @${w}px  status-line box=${JSON.stringify(box)} text=${JSON.stringify(text)}`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
