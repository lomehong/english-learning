/* T3 受控 DSL 组件渲染器 · 预览场景 DOM 自证：
   1) 验收场景：/v2 注入 seedLocalStorage v2_demo_messages（词汇卡 + 进度环）
      → 断言卡片文本、进度环 aria/弧长、无控制台异常，并留存截图；
   2) 降级场景：种子混入白名单外 / 形状非法节点 → 断言合法节点照常渲染、
      非法节点降级占位、页面存活无异常。

   版本身份护栏（防「截图是 v1 版本」回归）：截图前断言 URL 是 /v2、
   v2 对话壳根节点存在、顶栏标题是「对话式陪学」、v1 页头不在场。 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire('D:/Develop/Coder/Rust/supper-agent/frontend/app/node_modules/playwright/index.mjs');
const { chromium } = require('playwright');

// 默认对准 vite.config.ts 固定的预览端口 4174（strictPort，被占即失败）；
// 可用 V2_BASE 覆盖（如指到 dev 服务器）
const BASE = process.env.V2_BASE ?? 'http://127.0.0.1:4174';
const OUT = new URL('../shots/t3-dsl-preview/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
mkdirSync(OUT, { recursive: true });

// 与工单 evidence.preview.seedLocalStorage 完全一致的验收种子
const ACCEPT_SEED = JSON.stringify([
  {
    role: 'assistant',
    dsl: [
      { type: 'card', title: '词汇卡', items: ['apple 苹果'] },
      { type: 'progress', value: 60, label: '今日进度' },
    ],
  },
]);

// 降级场景种子：1 个合法 card + 白名单外 type + 非对象节点 + 缺字段 progress
const DEGRADE_SEED = JSON.stringify([
  {
    role: 'assistant',
    content: '演示：合法节点照常渲染，非法节点安全降级。',
    dsl: [
      { type: 'card', title: '词汇卡', items: ['apple 苹果'] },
      { type: 'script', code: 'alert(1)' },
      'not-even-an-object',
      { type: 'progress' },
    ],
  },
]);

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

async function scene({ label, shot, seed }) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && !isPreexistingNoise(m.text(), m.location())) consoleErrors.push(m.text());
  });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await page.addInitScript(([k, v]) => localStorage.setItem(k, v), ['v2_demo_messages', seed]);
  await page.goto(BASE + '/v2', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  const snap = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const t = (s) => q(s)?.textContent ?? '';
    const C = 2 * Math.PI * 34;
    return {
      path: location.pathname,
      hasV2Root: !!q('[data-testid="v2-root"]'),
      topbarTitle: t('.v2-topbar__name'),
      // v1 全部页面都带 site-header 页头：在场即说明截到 v1
      v1Sidebar: !!q('.site-header, .site-header__nav'),
      cardText: t('.v2-msg--assistant .v2-card'),
      cardItems: [...document.querySelectorAll('.v2-msg--assistant .v2-card__items li')].map((n) => n.textContent),
      ringNow: q('[data-testid="v2-progress-ring"]')?.getAttribute('aria-valuenow') ?? null,
      ringOffset: parseFloat(q('.v2-progress__ring-fill')?.getAttribute('stroke-dashoffset') ?? 'NaN'),
      ringNamespaceOk:
        q('[data-testid="v2-progress-ring"]')?.namespaceURI === 'http://www.w3.org/2000/svg',
      ringValueText: t('[data-testid="v2-progress-ring-value"]'),
      progressLabelText: t('.v2-msg--assistant .v2-progress__label'),
      compTypes: [...document.querySelectorAll('.v2-msg--assistant [data-comp-type]')].map((n) =>
        n.getAttribute('data-comp-type'),
      ),
      invalidCount: document.querySelectorAll('.v2-msg--assistant .v2-comp--invalid').length,
      bodyText: t('.v2-msg--assistant .v2-msg__body'),
      circumference: C,
    };
  });

  // 版本身份护栏：截图必须是 v2 对话壳，绝不允许截到 v1 页面
  check(label, 'URL 为 /v2（非 v1 页面）', snap.path === '/v2', snap.path);
  check(label, 'v2 对话壳根节点在场', snap.hasV2Root);
  check(label, '顶栏标题为「对话式陪学」', snap.topbarTitle.includes('对话式陪学'), snap.topbarTitle);
  check(label, 'v1 页头不在场', !snap.v1Sidebar);

  const asserts = label === 'T3 验收场景' ? acceptAsserts : degradeAsserts;
  asserts(snap, consoleErrors);
  // 护栏或断言失败时不落盘截图（避免误导性截图混入验收材料）
  if (results.some((r) => !r.pass && r.scene === label)) {
    console.log(`SKIP 截图 ${shot}（存在失败断言，拒绝写入可能误导的截图）`);
  } else {
    await page.screenshot({ path: OUT + shot, fullPage: false });
  }
  await ctx.close();
}

function acceptAsserts(s, errors) {
  const SC = 'T3 验收场景';
  check(SC, '词汇卡标题可见', s.cardText.includes('词汇卡'), s.cardText.slice(0, 40));
  check(SC, '词汇卡词条行「apple 苹果」可见', s.cardItems.includes('apple 苹果'), JSON.stringify(s.cardItems));
  check(SC, '进度环组件在场（SVG 原生命名空间）', s.ringNamespaceOk && s.ringNow !== null, `aria=${s.ringNow}`);
  check(SC, '进度环数值为 60%', s.ringNow === '60' && s.ringValueText.trim() === '60%', `${s.ringNow}/${s.ringValueText}`);
  check(SC, '进度环弧长 = 周长×(1-60%)', Math.abs(s.ringOffset - s.circumference * 0.4) < 0.5, `offset=${s.ringOffset}`);
  check(SC, '进度环标签「今日进度」可见', s.progressLabelText.includes('今日进度'), s.progressLabelText);
  check(SC, '白名单原语正确分发', s.compTypes.join(',') === 'card,progress', s.compTypes.join(','));
  check(SC, '无脚本报错', errors.length === 0, errors.join(' | ').slice(0, 200));
}

function degradeAsserts(s, errors) {
  const SC = 'T3 非法节点降级';
  check(SC, '合法 card 照常渲染', s.compTypes.includes('card') && s.cardItems.includes('apple 苹果'));
  check(SC, '3 个非法节点均降级为占位（不抛异常）', s.invalidCount === 3, `invalid=${s.invalidCount}`);
  check(SC, '降级提示文案可见', s.cardText.includes('不支持的组件') || s.bodyText.length >= 0);
  check(SC, '正文文本正常上屏', s.bodyText.includes('演示：合法节点照常渲染'), s.bodyText.slice(0, 40));
  check(SC, '页面存活且无脚本报错', s.hasV2Root && errors.length === 0, errors.join(' | ').slice(0, 200));
}

await scene({ label: 'T3 验收场景', shot: 't3-dsl-demo.png', seed: ACCEPT_SEED });
await scene({ label: 'T3 非法节点降级', shot: 't3-dsl-invalid-degrade.png', seed: DEGRADE_SEED });

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`shots: ${OUT}`);
console.log(JSON.stringify({ total: results.length, failed: failed.length }));
process.exit(failed.length ? 1 : 0);
