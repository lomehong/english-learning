import { getWritingTasksByUnit, countEssayWords } from '../data/writing';
import { UNIT_META, unitTitle } from '../data/units';
import { putDraft, removeDraft, type WritingDrafts } from '../store/writing';
import type { WritingTask } from '../types';
import { defaultWritingDeps, type WritingDeps } from './deps';
import { buildUnitBadge, currentUnit } from './unit-switch';

/**
 * /writing 页：单元切换 + 主题写作任务 ×2。
 * 流程：读题目要求 → 编辑器写作（草稿自动保存 localStorage）→
 * 自评清单逐条勾选 → 展开参考范文对照修改。
 */

function buildTask(
  task: WritingTask,
  index: number,
  load: () => WritingDrafts,
  save: (drafts: WritingDrafts) => void,
  now: () => number,
): HTMLElement {
  const section = document.createElement('section');
  section.className = 'writing-task';
  section.dataset.task = task.id;

  const taskTitle = document.createElement('h2');
  taskTitle.className = 'section-title';
  taskTitle.textContent = `Task ${index + 1} · ${task.title}`;

  /* ---- 题目卡 ---- */
  const promptCard = document.createElement('article');
  promptCard.className = 'writing-prompt card';

  const promptHead = document.createElement('div');
  promptHead.className = 'passage__head';
  const promptTitle = document.createElement('h3');
  promptTitle.className = 'passage__title';
  promptTitle.textContent = task.title;
  const genre = document.createElement('span');
  genre.className = 'badge';
  genre.textContent = task.genre;
  const wordChip = document.createElement('span');
  wordChip.className = 'stat-chip';
  wordChip.textContent = task.wordHint;
  promptHead.append(promptTitle, genre, wordChip);

  const promptText = document.createElement('p');
  promptText.className = 'writing-prompt__text';
  promptText.textContent = task.prompt;

  const reqTitle = document.createElement('h4');
  reqTitle.className = 'writing-card__sub';
  reqTitle.textContent = '内容要点';
  const reqList = document.createElement('ul');
  reqList.className = 'writing-requirements';
  for (const item of task.requirements) {
    const li = document.createElement('li');
    li.textContent = item;
    reqList.append(li);
  }

  promptCard.append(promptHead, promptText, reqTitle, reqList);

  /* ---- 编辑器卡（草稿自动保存） ---- */
  const editorCard = document.createElement('article');
  editorCard.className = 'writing-editor card';

  const editorTitle = document.createElement('h4');
  editorTitle.className = 'writing-card__sub';
  editorTitle.textContent = '我的作文（草稿自动保存在本机浏览器）';

  const textarea = document.createElement('textarea');
  textarea.className = 'writing-editor__area';
  textarea.setAttribute('data-testid', `draft-editor-${task.id}`);
  textarea.rows = 10;
  textarea.spellcheck = false;
  textarea.placeholder = '在此输入你的作文，每输入一个字符都会自动保存草稿…';
  textarea.setAttribute('aria-label', `任务 ${index + 1} ${task.title} 作文编辑器`);
  textarea.value = load().drafts[task.id]?.content ?? '';

  const bar = document.createElement('div');
  bar.className = 'writing-editor__bar';
  const count = document.createElement('span');
  count.className = 'stat-chip';
  count.setAttribute('data-testid', `word-count-${task.id}`);
  const status = document.createElement('span');
  status.className = 'writing-editor__status';
  status.setAttribute('data-testid', `draft-status-${task.id}`);
  const barSpacer = document.createElement('span');
  barSpacer.className = 'page-head__spacer';
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'btn btn--ghost btn--sm';
  clear.setAttribute('data-testid', `draft-clear-${task.id}`);
  clear.textContent = '清空草稿';
  bar.append(count, status, barSpacer, clear);

  function syncEditor(): void {
    const words = countEssayWords(textarea.value);
    count.textContent = `已写 ${words} 词 · 要求 ${task.wordHint}`;
    status.textContent = textarea.value.trim() === '' ? '暂无草稿' : '✓ 草稿已保存';
  }

  textarea.addEventListener('input', () => {
    save(putDraft(load(), task.id, textarea.value, now()));
    syncEditor();
  });

  clear.addEventListener('click', () => {
    textarea.value = '';
    save(removeDraft(load(), task.id));
    syncEditor();
    textarea.focus();
  });

  syncEditor();
  editorCard.append(editorTitle, textarea, bar);

  /* ---- 自评清单卡 ---- */
  const checkCard = document.createElement('article');
  checkCard.className = 'writing-checklist card';

  const checkTitle = document.createElement('h4');
  checkTitle.className = 'writing-card__sub';
  checkTitle.textContent = '自评清单（写完逐条勾选）';
  const checkList = document.createElement('ul');
  checkList.className = 'writing-checklist__list';
  const checkProgress = document.createElement('span');
  checkProgress.className = 'stat-chip';
  checkProgress.setAttribute('data-testid', `check-progress-${task.id}`);

  function syncCheckProgress(): void {
    const boxes = [...checkList.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
    const checked = boxes.filter((b) => b.checked).length;
    checkProgress.textContent = `已勾选 ${checked} / ${boxes.length}`;
  }

  task.checklist.forEach((item, i) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    label.className = 'writing-checklist__item';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.dataset.check = String(i);
    const text = document.createElement('span');
    text.textContent = item;
    label.append(box, text);
    li.append(label);
    checkList.append(li);
  });
  checkList.addEventListener('change', syncCheckProgress);
  syncCheckProgress();

  checkCard.append(checkTitle, checkList, checkProgress);

  /* ---- 参考范文（折叠，先写后看） ---- */
  const model = document.createElement('details');
  model.className = 'writing-model card';
  const summary = document.createElement('summary');
  summary.className = 'writing-model__summary';
  summary.textContent = '参考范文（先独立完成，再对照修改）';
  const modelBody = document.createElement('div');
  modelBody.className = 'writing-model__body';
  modelBody.setAttribute('data-testid', `model-essay-${task.id}`);
  for (const para of task.modelEssay) {
    const p = document.createElement('p');
    p.className = 'writing-model__para';
    p.textContent = para;
    modelBody.append(p);
  }
  const modelFoot = document.createElement('p');
  modelFoot.className = 'passage__hint';
  modelFoot.textContent = `范文约 ${countEssayWords(task.modelEssay.join(' '))} 词 · ${task.wordHint}`;
  model.append(summary, modelBody, modelFoot);

  section.append(taskTitle, promptCard, editorCard, checkCard, model);
  return section;
}

/* ---------- 页面 ---------- */

export function renderWriting(root: HTMLElement, deps?: WritingDeps): void {
  const d: WritingDeps = deps ?? defaultWritingDeps();
  const unit = currentUnit();
  const tasks = getWritingTasksByUnit(unit);

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="site-header__brand" href="/" data-link>高一英语学习系统</a>
      <nav class="site-header__nav">
        <a class="btn btn--ghost" href="/" data-link>首页</a>
        <a class="btn btn--ghost" href="/listening" data-link>听力</a>
        <a class="btn btn--ghost" href="/mistakes" data-link>错题本</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';

  const head = document.createElement('div');
  head.className = 'page-head';
  const title = document.createElement('h1');
  title.className = 'page-head__title';
  title.textContent = `写作 · 必修一 ${unitTitle(unit)}（${UNIT_META[unit].titleZh}）`;

  // 全局单元：首页切换器维护（localStorage + ?unit=），此处只读展示
  head.append(title, buildUnitBadge(unit));

  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent =
    `${tasks.length} 个「${UNIT_META[unit].title}」主题写作任务（${tasks.map((t) => t.genre).join(' + ')}）：先读题目要求独立完成，草稿自动保存在本机浏览器（localStorage，键 english-learning.writing.v1）；写完对照自评清单逐条检查，再展开参考范文修改润色。`;

  page.append(head, intro);

  tasks.forEach((task, index) => {
    page.append(buildTask(task, index, d.load, d.save, d.now));
  });

  root.append(header, page);
}
