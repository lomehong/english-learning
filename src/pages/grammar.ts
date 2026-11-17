import {
  getGrammarPoints,
  getGrammarExercises,
  getGrammarPoint,
  checkFillAnswer,
} from '../data/grammar';
import { UNIT_META, unitTitle, type UnitId } from '../data/units';
import {
  loadWrongBook,
  saveWrongBook,
  recordWrong,
  emptyWrongBook,
  type WrongBook,
} from '../store/wrongbook';
import { recordAnswerAndSave } from '../store/stats';
import type { FillExercise, GrammarExercise, GrammarPoint, McqExercise, WrongEntry } from '../types';
import type { GrammarDeps } from './deps';
import { buildUnitSwitcher, currentUnit } from './unit-switch';

/** /grammar 页：单元切换 + 讲解卡 + 专项练习（即时判分/解析/错题自动入本） */

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
const TYPE_LABEL: Record<GrammarExercise['type'], string> = { mcq: '单选', fill: '填空' };

function correctAnswerOf(exercise: GrammarExercise): string {
  return exercise.type === 'mcq' ? exercise.options[exercise.answerIndex] : exercise.answer;
}

/* ---------- 讲解卡 ---------- */

function buildPointCard(point: GrammarPoint, unit: UnitId): HTMLElement {
  const card = document.createElement('article');
  card.className = 'grammar-card card';
  card.dataset.point = point.id;
  card.innerHTML = `
    <div class="grammar-card__head">
      <h3 class="grammar-card__title">${point.title}</h3>
      <span class="grammar-card__unit">Unit ${UNIT_META[unit].no}</span>
    </div>
    <p class="grammar-card__tagline">${point.tagline}</p>
    <dl class="grammar-form">
      ${point.forms
        .map((f) => `<div class="grammar-form__row"><dt>${f.label}</dt><dd>${f.detail}</dd></div>`)
        .join('')}
    </dl>
    <h4 class="grammar-card__sub">用法要点</h4>
    <ul class="grammar-card__usage">
      ${point.usages.map((u) => `<li>${u}</li>`).join('')}
    </ul>
    <h4 class="grammar-card__sub">常见时间标志</h4>
    <div class="grammar-card__markers">
      ${point.markers.map((m) => `<span class="marker-chip">${m}</span>`).join('')}
    </div>
    <h4 class="grammar-card__sub">例句</h4>
    <ul class="grammar-card__examples">
      ${point.examples
        .map(
          (e) =>
            `<li class="grammar-card__example"><p class="grammar-card__example-en">${e.en}</p><p class="grammar-card__example-zh">${e.zh}</p></li>`,
        )
        .join('')}
    </ul>
    <h4 class="grammar-card__sub">易错点</h4>
    <ul class="grammar-card__tips">
      ${point.tips.map((t) => `<li>${t}</li>`).join('')}
    </ul>`;
  return card;
}

/* ---------- 练习题 ---------- */

interface AnswerCallback {
  (correct: boolean, exercise: GrammarExercise, yourAnswer: string): void;
}

/** 判分后追加结果区（作答含用户输入，全部走 textContent 组合，不做 innerHTML 拼接） */
function appendResult(
  item: HTMLElement,
  correct: boolean,
  yourAnswer: string,
  correctAnswer: string,
  explanation: string,
): void {
  const result = document.createElement('div');
  result.className = 'exercise__result';

  const verdict = document.createElement('p');
  verdict.className = 'exercise__verdict';
  verdict.textContent = correct ? '✓ 回答正确' : '✗ 回答错误';

  const yours = document.createElement('p');
  yours.className = 'exercise__yours';
  yours.append('你的答案：', yourAnswer);

  result.append(verdict, yours);

  if (!correct) {
    const answerLine = document.createElement('p');
    answerLine.className = 'exercise__answer';
    answerLine.textContent = `正确答案：${correctAnswer}`;
    result.append(answerLine);
  }

  const exp = document.createElement('p');
  exp.className = 'exercise__explanation';
  const expLabel = document.createElement('strong');
  expLabel.textContent = '解析：';
  exp.append(expLabel, explanation);
  result.append(exp);

  item.append(result);
  item.classList.add(correct ? 'exercise--correct' : 'exercise--wrong');
}

function buildMcq(item: HTMLElement, exercise: McqExercise, onAnswered: AnswerCallback): HTMLElement {
  const body = document.createElement('div');
  body.className = 'exercise__options';
  let done = false;

  exercise.options.forEach((option, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    const key = document.createElement('span');
    key.className = 'option__key';
    key.textContent = `${OPTION_KEYS[i]}.`;
    button.append(key, ` ${option}`);

    button.addEventListener('click', () => {
      if (done) return;
      done = true;
      const correct = i === exercise.answerIndex;
      for (const b of [...body.querySelectorAll<HTMLButtonElement>('button.option')]) b.disabled = true;
      button.classList.add(correct ? 'option--correct' : 'option--wrong');
      if (!correct) {
        body.children[exercise.answerIndex].classList.add('option--correct');
      }
      appendResult(
        item,
        correct,
        exercise.options[i],
        exercise.options[exercise.answerIndex],
        exercise.explanation,
      );
      onAnswered(correct, exercise, exercise.options[i]);
    });
    body.append(button);
  });
  return body;
}

function buildFill(
  item: HTMLElement,
  exercise: FillExercise,
  index: number,
  onAnswered: AnswerCallback,
): HTMLElement {
  const form = document.createElement('form');
  form.className = 'exercise__fill';
  let done = false;

  const input = document.createElement('input');
  input.className = 'exercise__input';
  input.type = 'text';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.placeholder = '填入你的答案';
  input.setAttribute('aria-label', `第 ${index + 1} 题作答`);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn btn--primary';
  submit.textContent = '提交';

  form.append(input, submit);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (done) return;
    const value = input.value.trim();
    if (value === '') {
      input.focus();
      return;
    }
    done = true;
    input.disabled = true;
    submit.disabled = true;
    const correct = checkFillAnswer(exercise, value);
    appendResult(item, correct, value, exercise.answer, exercise.explanation);
    onAnswered(correct, exercise, value);
  });
  return form;
}

function buildExercise(exercise: GrammarExercise, index: number, onAnswered: AnswerCallback): HTMLElement {
  const item = document.createElement('li');
  item.className = 'exercise card';
  item.dataset.exercise = exercise.id;
  item.dataset.type = exercise.type;
  item.innerHTML = `
    <div class="exercise__head">
      <span class="exercise__no">第 ${index + 1} 题</span>
      <span class="badge">${TYPE_LABEL[exercise.type]}</span>
      <span class="exercise__point">${getGrammarPoint(exercise.pointId)?.title ?? ''}</span>
    </div>
    <p class="exercise__stem">${exercise.stem}</p>`;
  item.append(
    exercise.type === 'mcq'
      ? buildMcq(item, exercise, onAnswered)
      : buildFill(item, exercise, index, onAnswered),
  );
  return item;
}

/* ---------- 错题本 ---------- */

function buildWrongItem(entry: WrongEntry): HTMLElement {
  const item = document.createElement('article');
  item.className = 'wrong-item card';

  const stem = document.createElement('p');
  stem.className = 'wrong-item__stem';
  stem.textContent = entry.stem;

  const answers = document.createElement('p');
  answers.className = 'wrong-item__answers';
  const yours = document.createElement('span');
  yours.className = 'wrong-item__yours';
  yours.textContent = `你的答案：${entry.yourAnswer}`;
  const right = document.createElement('span');
  right.className = 'wrong-item__right';
  right.textContent = `正确答案：${entry.correctAnswer}`;
  answers.append(yours, right);

  const meta = document.createElement('p');
  meta.className = 'wrong-item__meta';
  meta.textContent = `累计答错 ${entry.wrongCount} 次`;

  const exp = document.createElement('p');
  exp.className = 'wrong-item__explanation';
  const label = document.createElement('strong');
  label.textContent = '解析：';
  exp.append(label, entry.explanation);

  item.append(stem, answers, meta, exp);
  return item;
}

/* ---------- 页面 ---------- */

export function renderGrammar(root: HTMLElement, deps?: GrammarDeps): void {
  const d: GrammarDeps = deps ?? {
    load: () => loadWrongBook(),
    save: (b) => saveWrongBook(b),
    now: () => Date.now(),
  };

  const unit = currentUnit();
  const points = getGrammarPoints(unit);
  const exercises = getGrammarExercises(unit);
  const TOTAL = exercises.length;

  let book: WrongBook = d.load();
  let answered = 0;
  let correctCount = 0;

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="site-header__brand" href="/" data-link>高一英语学习系统</a>
      <nav class="site-header__nav">
        <a class="btn btn--ghost" href="/" data-link>首页</a>
        <a class="btn btn--ghost" href="/vocabulary" data-link>词汇</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';

  const statChip = document.createElement('span');
  statChip.className = 'stat-chip';
  statChip.setAttribute('data-testid', 'drill-stat');
  statChip.textContent = `已答 0 / ${TOTAL} · 答对 0`;

  const head = document.createElement('div');
  head.className = 'page-head';
  const title = document.createElement('h1');
  title.className = 'page-head__title';
  title.textContent = `语法 · 必修一 ${unitTitle(unit)}（${UNIT_META[unit].titleZh}）`;
  const headSpacer = document.createElement('span');
  headSpacer.className = 'page-head__spacer';

  // 单元切换：URL 已更新后整页重渲（currentUnit 从 ?unit= 读取）
  const unitSwitcher = buildUnitSwitcher('/grammar', () => {
    root.replaceChildren();
    renderGrammar(root, d);
  });

  head.append(title, unitSwitcher.el, headSpacer, statChip);

  /* 讲解卡区 */
  const teach = document.createElement('section');
  teach.className = 'grammar-teach';
  const teachTitle = document.createElement('h2');
  teachTitle.className = 'section-title';
  teachTitle.textContent = `讲解卡 · ${points.map((p) => p.title).join(' / ')}`;
  const cards = document.createElement('div');
  cards.className = 'grammar-cards';
  for (const point of points) cards.append(buildPointCard(point, unit));
  teach.append(teachTitle, cards);

  /* 练习区 */
  const onAnswered: AnswerCallback = (correct, exercise, yourAnswer) => {
    answered += 1;
    if (correct) correctCount += 1;
    statChip.textContent = `已答 ${answered} / ${TOTAL} · 答对 ${correctCount}`;
    // 学习报告数据源：每次作答计入模块与单元统计
    recordAnswerAndSave('grammar', correct, unit);
    if (!correct) {
      book = recordWrong(
        book,
        {
          exerciseId: exercise.id,
          module: 'grammar',
          stem: exercise.stem,
          yourAnswer,
          correctAnswer: correctAnswerOf(exercise),
          explanation: exercise.explanation,
        },
        d.now(),
      );
      d.save(book);
      renderWrongbook();
    }
  };

  const drill = document.createElement('section');
  drill.className = 'grammar-drill';
  const drillTitle = document.createElement('h2');
  drillTitle.className = 'section-title';
  drillTitle.textContent = `专项练习 · ${TOTAL} 题（答题即时判分，错题自动进入错题本）`;
  const list = document.createElement('ol');
  list.className = 'exercise-list';
  exercises.forEach((exercise, index) => list.append(buildExercise(exercise, index, onAnswered)));
  drill.append(drillTitle, list);

  /* 错题本区 */
  const wrongbook = document.createElement('section');
  wrongbook.className = 'wrongbook';
  wrongbook.setAttribute('data-testid', 'wrongbook');

  const wbHead = document.createElement('div');
  wbHead.className = 'wrongbook__head';
  const wbTitle = document.createElement('h2');
  wbTitle.className = 'section-title';
  wbTitle.textContent = '错题本';
  const wbCount = document.createElement('span');
  wbCount.className = 'stat-chip';
  wbCount.setAttribute('data-testid', 'wrong-count');
  const wbSpacer = document.createElement('span');
  wbSpacer.className = 'page-head__spacer';
  const wbClear = document.createElement('button');
  wbClear.type = 'button';
  wbClear.className = 'btn btn--ghost';
  wbClear.setAttribute('data-testid', 'wrong-clear');
  wbClear.textContent = '清空错题本';
  wbHead.append(wbTitle, wbCount, wbSpacer, wbClear);

  const wbList = document.createElement('div');
  wbList.className = 'wrongbook__list';
  wbList.setAttribute('data-testid', 'wrong-list');

  const wbEmpty = document.createElement('p');
  wbEmpty.className = 'empty-state';
  wbEmpty.setAttribute('data-testid', 'wrong-empty');
  wbEmpty.textContent = '暂无错题 · 全部答对就是最好的复习';

  wrongbook.append(wbHead, wbList, wbEmpty);

  function renderWrongbook(): void {
    const entries = Object.values(book.entries).sort((a, b) => b.lastWrongAt - a.lastWrongAt);
    wbList.replaceChildren(...entries.map(buildWrongItem));
    wbList.hidden = entries.length === 0;
    wbEmpty.hidden = entries.length !== 0;
    wbCount.textContent = `共 ${entries.length} 题`;
    wbClear.disabled = entries.length === 0;
  }

  wbClear.addEventListener('click', () => {
    book = emptyWrongBook();
    d.save(book);
    renderWrongbook();
  });

  renderWrongbook();

  page.append(head, teach, drill, wrongbook);
  root.append(header, page);
}
