/* T5 对话内学习闭环 · 验收场景 DOM 自证：
   /v2 无任何预置（seedLocalStorage=[]，离线陪学模式）→
   在输入框填「今天学什么」→ 点发送按钮 → 断言：
   1) 依次展示计划卡（今日学习计划）与首组词汇卡（word-en ≥ 4），
      闭环进度条常驻（计划 done / 词汇 active 带计数）；
   2) 继续对话内小测：逐题作答（第 1 题按词表数据确定性答错）→
      错题入本（store 落盘 1 条 vocab 错题）→ 进度更新
      （收尾回执含「本轮小测」「今日进度已更新」）；
   3) 五步进度条全部 done + 「本轮闭环完成」徽标；
   4) 版本身份护栏（防「截图是 v1 版本」回归）：URL 是 /v2、v2 对话壳
      根节点存在、顶栏标题「对话式陪学」、v1 页头不在场；
   5) 全程无控制台异常（favicon 404 为全站既有噪音），并留存两张截图
      （① 计划卡与词汇卡 ② 闭环完成态）。 */
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire('D:/Develop/Coder/Rust/supper-agent/frontend/app/node_modules/playwright/index.mjs');
const { chromium } = require('playwright');

const BASE = process.env.V2_BASE ?? 'http://127.0.0.1:4174';
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'shots', 't5-loop-preview');
mkdirSync(OUT, { recursive: true });

/* 词表数据（与页面同源）：用于从题干反推正确选项，构造确定性错答 */
const dataDir = resolve(HERE, '../src/data');
const meaningToWord = new Map();
const wordToMeaning = new Map();
for (const file of readdirSync(dataDir)) {
  if (!/^unit\d+-words\.json$/.test(file)) continue;
  for (const w of JSON.parse(readFileSync(join(dataDir, file), 'utf8'))) {
    meaningToWord.set(w.meaning, w.word);
    wordToMeaning.set(w.word, w.meaning);
  }
}
function resolveCorrectOption(stem) {
  let m = /^「(.+)」对应的单词是？$/.exec(stem);
  if (m) return meaningToWord.get(m[1]) ?? null;
  m = /^(\S+) .* 的意思是？$/.exec(stem);
  if (m) return wordToMeaning.get(m[1]) ?? null;
  return null;
}

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

await page.goto(BASE + '/v2', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
await page.waitForTimeout(600);

/* ---------- 第一幕：今天学什么 → 计划卡 + 词汇卡 ---------- */
const input = page.getByLabel(/输入框/);
await input.fill('今天学什么');
await page.getByRole('button', { name: '发送' }).click();

await page.waitForSelector('.v2-msg--assistant .v2-card__word-en', { timeout: 15000 });
await page.waitForTimeout(400); // 流式收尾 + 进度条同步

const snap1 = await page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const planCard = qa('.v2-msg--assistant .v2-card').find((n) =>
    n.querySelector('.v2-card__title')?.textContent?.includes('今日学习计划'),
  );
  const step = (id) => q(`.v2-loop__step[data-loop-step="${id}"]`);
  return {
    path: location.pathname,
    hasV2Root: !!q('[data-testid="v2-root"]'),
    topbarTitle: q('.v2-topbar__name')?.textContent ?? '',
    v1Header: !!q('.site-header, .site-header__nav'),
    userBubble: q('.v2-msg--user .v2-msg__body')?.textContent ?? '',
    planCardText: planCard?.textContent ?? '',
    planCardBadge: planCard?.querySelector('.v2-card__badge')?.textContent ?? '',
    wordCards: qa('.v2-msg--assistant .v2-card__word-en').map((n) => n.textContent),
    audioCount: qa('.v2-msg--assistant .v2-audio').length,
    progressRing: !!q('.v2-msg--assistant [data-testid="v2-progress-ring"]'),
    bodyText: q('.v2-msg--assistant .v2-msg__body')?.textContent ?? '',
    loopPlan: step('plan')?.getAttribute('data-status'),
    loopCards: step('cards')?.getAttribute('data-status'),
    loopCardsText: step('cards')?.textContent ?? '',
    loopQuiz: step('quiz')?.getAttribute('data-status'),
  };
});

/* 版本身份护栏：截图必须是 v2 对话壳，绝不允许截到 v1 页面 */
check('URL 为 /v2（非 v1 页面）', snap1.path === '/v2', snap1.path);
check('v2 对话壳根节点在场', snap1.hasV2Root);
check('顶栏标题为「对话式陪学」', snap1.topbarTitle.includes('对话式陪学'), snap1.topbarTitle);
check('v1 页头不在场', !snap1.v1Header);

/* 交互链路：fill/click 生效（用户气泡上屏） */
check('输入「今天学什么」已发送（用户气泡可见）', snap1.userBubble.includes('今天学什么'), snap1.userBubble);

/* 计划卡与词汇卡依次展示（界面判据） */
check('计划卡在场：今日学习计划（含错题/进度闭环条目）', snap1.planCardText.includes('词汇') && snap1.planCardText.includes('小测') && snap1.planCardText.includes('错题'), snap1.planCardText.slice(0, 60));
check('计划卡带单元徽标 unit1', snap1.planCardBadge === 'unit1', snap1.planCardBadge);
check('词汇卡 ≥ 4 张（英文拼写正面）', snap1.wordCards.length >= 4 && snap1.wordCards.every((w) => /^[a-zA-Z]+$/.test(w)), JSON.stringify(snap1.wordCards));
check('每词一张跟读卡', snap1.audioCount >= snap1.wordCards.length, `audio=${snap1.audioCount}`);
check('进度环组件在场（今日完成度）', snap1.progressRing);

/* 闭环进度条：可追踪状态 */
check('进度条：计划 done', snap1.loopPlan === 'done', String(snap1.loopPlan));
check('进度条：词汇 active 带计数（4/N 词）', snap1.loopCards === 'active' && /4\/\d+ 词/.test(snap1.loopCardsText), snap1.loopCardsText);
check('进度条：小测 pending', snap1.loopQuiz === 'pending', String(snap1.loopQuiz));

/* 视口内真实占位（截图可见性的几何证明，替代人眼）：
   先把计划卡滚入视口（流式自动滚动停在底部，早期卡片可能在视口上方） */
const planCardLocator = page.locator('.v2-msg--assistant .v2-card', { hasText: '今日学习计划' }).first();
await planCardLocator.scrollIntoViewIfNeeded();
await page.waitForTimeout(250);
const planBox = await planCardLocator.boundingBox();
check(
  '计划卡在视口内占位（宽>200px 高>60px 且 0≤y<900）',
  !!planBox && planBox.width > 200 && planBox.height > 60 && planBox.y >= 0 && planBox.y < 900,
  planBox ? `${Math.round(planBox.width)}x${Math.round(planBox.height)} @y${Math.round(planBox.y)}` : 'null',
);
const wordBox = await page.locator('.v2-msg--assistant .v2-card__word-en').first().boundingBox();
check(
  '词汇卡在视口内占位（宽>40px 高>12px 且 0≤y<900）',
  !!wordBox && wordBox.width > 40 && wordBox.height > 12 && wordBox.y >= 0 && wordBox.y < 900,
  wordBox ? `${Math.round(wordBox.width)}x${Math.round(wordBox.height)} @y${Math.round(wordBox.y)}` : 'null',
);

check('第一幕无脚本报错', consoleErrors.length === 0, consoleErrors.join(' | ').slice(0, 200));
if (results.every((r) => r.pass)) {
  await page.screenshot({ path: join(OUT, 't5-loop-plan-and-cards.png'), fullPage: false });
  console.log(`shot: ${join(OUT, 't5-loop-plan-and-cards.png')}`);
}

/* ---------- 第二幕：小测 → 错题入本 → 进度更新 ---------- */
await input.fill('来一组小测');
await page.getByRole('button', { name: '发送' }).click();
await page.waitForSelector('.v2-msg--assistant .v2-quiz', { timeout: 15000 });
await page.waitForTimeout(400);

const quizCount = await page.locator('.v2-msg--assistant .v2-quiz').count();
check('小测组件上屏（≥2 题）', quizCount >= 2, `count=${quizCount}`);
check(
  '进度条：小测 active 带题数',
  (await page.locator('.v2-loop__step[data-loop-step="quiz"]').getAttribute('data-status')) === 'active',
);

/* 逐题作答：第 1 题按词表数据确定性答错，其余答对 */
let wrongStem = '';
for (let i = 0; i < quizCount; i += 1) {
  const quiz = page.locator('.v2-msg--assistant .v2-quiz').nth(i);
  const stem = (await quiz.locator('.v2-quiz__stem').textContent()) ?? '';
  const correct = resolveCorrectOption(stem);
  const options = quiz.locator('button.v2-quiz__option');
  const labels = [];
  for (let j = 0; j < (await options.count()); j += 1) {
    labels.push((await options.nth(j).locator('.v2-quiz__label').textContent()) ?? '');
  }
  const answerWrong = i === 0 && correct !== null && labels.includes(correct);
  const targetLabel = answerWrong ? labels.find((l) => l !== correct) : correct;
  if (targetLabel === undefined) continue; // 数据未命中（不构造对错，跳过）
  if (answerWrong) wrongStem = stem;
  const before = await page.locator('.v2-msg--note').count();
  await options.nth(labels.indexOf(targetLabel)).click();
  await page
    .waitForFunction(
      (n) => document.querySelectorAll('.v2-msg--note').length >= n,
      before + 1,
      { timeout: 5000 },
    )
    .catch(() => {});
}
await page.waitForTimeout(600);

const snap2 = await page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];
  const notes = qa('.v2-msg--note').map((n) => n.textContent ?? '');
  const step = (id) => q(`.v2-loop__step[data-loop-step="${id}"]`)?.getAttribute('data-status');
  let wrongbook = null;
  try {
    wrongbook = JSON.parse(localStorage.getItem('english-learning.wrongbook.v1') ?? 'null');
  } catch {
    wrongbook = null;
  }
  return {
    noteCount: notes.length,
    lastNote: notes.at(-1) ?? '',
    firstNote: notes[0] ?? '',
    steps: {
      plan: step('plan'),
      cards: step('cards'),
      quiz: step('quiz'),
      wrongbook: step('wrongbook'),
      progress: step('progress'),
    },
    doneBadgeHidden: q('[data-testid="v2-loop-done"]')?.hidden ?? true,
    doneBadgeText: q('[data-testid="v2-loop-done"]')?.textContent ?? '',
    wrongbookTotal: wrongbook ? Object.keys(wrongbook.entries ?? {}).length : 0,
    wrongbookModule: wrongbook ? Object.values(wrongbook.entries ?? {})[0]?.module : null,
  };
});

check('每题一条作答回执（消息流无中断）', snap2.noteCount === quizCount, `notes=${snap2.noteCount} quizzes=${quizCount}`);
check('首条回执提示错题入本', /错题本|已记录/.test(snap2.firstNote), snap2.firstNote.slice(0, 60));
check('收尾回执：本轮小测成绩', snap2.lastNote.includes('本轮小测'), snap2.lastNote.slice(0, 80));
check('收尾回执：错题已入本', snap2.lastNote.includes('错题已入本'), '');
check('收尾回执：今日进度已更新', snap2.lastNote.includes('今日进度已更新'), '');

/* store 落盘：错题入本真实发生（vocab 模块 1 条） */
check('错题入本落盘：wrongbook 1 条 vocab', snap2.wrongbookTotal === 1 && snap2.wrongbookModule === 'vocab', `total=${snap2.wrongbookTotal} module=${snap2.wrongbookModule}`);
check('确定性构造的第 1 题答错（题干非空）', wrongStem !== '', wrongStem.slice(0, 40));

/* 闭环进度条：五步全部完成 + 徽标 */
const allDone = ['plan', 'cards', 'quiz', 'wrongbook', 'progress'].every((k) => snap2.steps[k] === 'done');
check('进度条五步全部 done', allDone, JSON.stringify(snap2.steps));
check('「本轮闭环完成」徽标可见', snap2.doneBadgeHidden === false && snap2.doneBadgeText.includes('本轮闭环完成'), snap2.doneBadgeText);

check('全程无脚本报错', consoleErrors.length === 0, consoleErrors.join(' | ').slice(0, 200));

if (results.some((r) => !r.pass)) {
  console.log('SKIP 完成态截图（存在失败断言，拒绝写入可能误导的截图）');
} else {
  // 完成态截图聚焦收尾：滚到最后的作答回执（进度条在顶栏下常驻，始终可见）
  await page.locator('.v2-msg--note').last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path: join(OUT, 't5-loop-complete.png'), fullPage: false });
  console.log(`shot: ${join(OUT, 't5-loop-complete.png')}`);
}

await ctx.close();
await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(JSON.stringify({ total: results.length, failed: failed.length }));
process.exit(failed.length ? 1 : 0);
