import { unit1Passages, countWords, QUESTION_TYPE_LABEL } from '../data/unit1-reading';
import { getWord } from '../data/words';
import { loadProgress, saveProgress, type Progress } from '../store/progress';
import { createCard } from '../srs/sm2';
import type { ReadingPassage, ReadingQuestion, Word } from '../types';
import type { ReadingDeps } from './deps';

/**
 * /reading 页：Unit 1 主题短文 + 阅读理解（答题即时判分 / 解析）
 * + 生词点击加入词汇本（与词汇模块共享 progress 存储）
 */

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
const TOTAL = unit1Passages.reduce((n, p) => n + p.questions.length, 0);

/* ---------- 生词渲染 ---------- */

/** 把一个空格分隔的 token 拆为「前导符号 + 字母串 + 其余」三段 */
function splitToken(token: string): { prefix: string; core: string; suffix: string } {
  const m = token.match(/^([^A-Za-z]*)([A-Za-z][A-Za-z'’-]*)?([\s\S]*)$/);
  if (!m) return { prefix: token, core: '', suffix: '' };
  return { prefix: m[1], core: m[2] ?? '', suffix: m[3] };
}

/** 渲染一个段落：命中生词表的词包成可点击 span，其余按原文输出 */
function buildParagraph(text: string, glossByForm: Map<string, Word>): HTMLParagraphElement {
  const p = document.createElement('p');
  p.className = 'passage__para';
  text.split(/\s+/).forEach((token, i) => {
    if (i > 0) p.append(' ');
    const { prefix, core, suffix } = splitToken(token);
    const word = core ? glossByForm.get(core.toLowerCase()) : undefined;
    if (!word) {
      p.append(token);
      return;
    }
    p.append(prefix, buildWordSpan(core, word), suffix);
  });
  return p;
}

function buildWordSpan(form: string, word: Word): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'reading-word';
  span.dataset.wordId = word.id;
  span.setAttribute('role', 'button');
  span.setAttribute('tabindex', '0');
  span.setAttribute('aria-pressed', 'false');
  span.setAttribute('aria-label', `生词 ${word.word}：${word.meaning}，点击加入词汇本`);
  span.title = `${word.word} ${word.phonetic} ${word.pos} ${word.meaning}`;
  span.textContent = form; // 保留原文大小写
  return span;
}

/* ---------- 题目渲染（结构与语法模块单选题一致） ---------- */

/** 判分后追加结果区（内容全部走 textContent 组合，不做 innerHTML 拼接） */
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
  yours.textContent = `你的答案：${yourAnswer}`;

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

function buildQuestion(
  question: ReadingQuestion,
  index: number,
  onAnswered: (correct: boolean) => void,
): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'exercise exercise--reading';
  item.dataset.question = question.id;

  const head = document.createElement('div');
  head.className = 'exercise__head';
  const no = document.createElement('span');
  no.className = 'exercise__no';
  no.textContent = `第 ${index + 1} 题`;
  const type = document.createElement('span');
  type.className = 'badge';
  type.textContent = QUESTION_TYPE_LABEL[question.type];
  head.append(no, type);

  const stem = document.createElement('p');
  stem.className = 'exercise__stem';
  stem.textContent = question.stem;

  const body = document.createElement('div');
  body.className = 'exercise__options';
  let done = false;

  question.options.forEach((option, i) => {
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
      const correct = i === question.answerIndex;
      for (const b of [...body.querySelectorAll<HTMLButtonElement>('button.option')]) b.disabled = true;
      button.classList.add(correct ? 'option--correct' : 'option--wrong');
      if (!correct) {
        body.children[question.answerIndex].classList.add('option--correct');
      }
      appendResult(
        item,
        correct,
        question.options[i],
        question.options[question.answerIndex],
        question.explanation,
      );
      onAnswered(correct);
    });
    body.append(button);
  });

  item.append(head, stem, body);
  return item;
}

/* ---------- 页面 ---------- */

export function renderReading(root: HTMLElement, deps?: ReadingDeps): void {
  const d: ReadingDeps = deps ?? {
    load: () => loadProgress(),
    save: (p) => saveProgress(p),
    now: () => Date.now(),
  };

  const progress: Progress = d.load();
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
        <a class="btn btn--ghost" href="/grammar" data-link>语法</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';

  /* 标题区：进度徽标 + 词汇本徽标 */
  const readStat = document.createElement('span');
  readStat.className = 'stat-chip';
  readStat.setAttribute('data-testid', 'reading-stat');
  readStat.textContent = `已答 0 / ${TOTAL} · 答对 0`;

  const vocabChip = document.createElement('span');
  vocabChip.className = 'stat-chip';
  vocabChip.setAttribute('data-testid', 'vocab-chip');
  renderVocabChip();

  const head = document.createElement('div');
  head.className = 'page-head';
  const title = document.createElement('h1');
  title.className = 'page-head__title';
  title.textContent = '阅读 · 必修一 Unit 1';
  const headSpacer = document.createElement('span');
  headSpacer.className = 'page-head__spacer';
  head.append(title, headSpacer, vocabChip, readStat);

  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent = `${unit1Passages.length} 篇「Teenage Life」主题短文（自编 · 约 120 词/篇）。完成每篇 ${unit1Passages[0]?.questions.length ?? 0} 道阅读理解，答题即时判分并附解析；正文中带虚线下划线的是生词，点击加入词汇本（与「词汇」模块共享，可在 词汇 → 复习 中巩固），再次点击可取消。`;

  page.append(head, intro);

  /* 生词收藏：写入与词汇模块同一份 progress（localStorage） */
  function toggleWord(wordId: string): void {
    if (progress.cards[wordId]) {
      delete progress.cards[wordId];
    } else {
      progress.cards[wordId] = createCard(wordId, d.now());
    }
    d.save(progress);
    syncWordStates();
    renderVocabChip();
  }

  function syncWordStates(): void {
    for (const el of page.querySelectorAll<HTMLSpanElement>('.reading-word')) {
      const wordId = el.dataset.wordId;
      if (!wordId) continue;
      const added = !!progress.cards[wordId];
      el.classList.toggle('reading-word--added', added);
      el.setAttribute('aria-pressed', String(added));
    }
  }

  function renderVocabChip(): void {
    vocabChip.textContent = `词汇本 ${Object.keys(progress.cards).length} 词`;
  }

  const onAnswered = (correct: boolean): void => {
    answered += 1;
    if (correct) correctCount += 1;
    readStat.textContent = `已答 ${answered} / ${TOTAL} · 答对 ${correctCount}`;
  };

  /* 每篇：短文卡（可点击生词）+ 3 道题 */
  unit1Passages.forEach((passage: ReadingPassage, pIndex: number) => {
    const section = document.createElement('section');
    section.className = 'reading-passage';
    section.dataset.passage = passage.id;

    const passageTitle = document.createElement('h2');
    passageTitle.className = 'section-title';
    passageTitle.textContent = `Passage ${pIndex + 1} · ${passage.title}`;

    const card = document.createElement('article');
    card.className = 'passage-card card';

    const cardHead = document.createElement('div');
    cardHead.className = 'passage__head';
    const cardTitle = document.createElement('h3');
    cardTitle.className = 'passage__title';
    cardTitle.textContent = passage.title;
    const genre = document.createElement('span');
    genre.className = 'badge';
    genre.textContent = passage.genre;
    const wordsChip = document.createElement('span');
    wordsChip.className = 'stat-chip';
    wordsChip.textContent = `约 ${countWords(passage.paragraphs)} 词`;
    cardHead.append(cardTitle, genre, wordsChip);

    const bodyEl = document.createElement('div');
    bodyEl.className = 'passage__body';
    bodyEl.setAttribute('data-testid', `passage-body-${passage.id}`);

    // 生词形式 → 词表条目（大小写不敏感；词表外的 id 静默跳过）
    const glossByForm = new Map<string, Word>();
    for (const entry of passage.glossary) {
      const word = getWord(entry.wordId);
      if (!word) continue;
      for (const form of entry.forms) glossByForm.set(form.toLowerCase(), word);
    }

    for (const text of passage.paragraphs) bodyEl.append(buildParagraph(text, glossByForm));
    bodyEl.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('.reading-word');
      if (target?.dataset.wordId) toggleWord(target.dataset.wordId);
    });
    bodyEl.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const target = (event.target as HTMLElement).closest<HTMLElement>('.reading-word');
      if (!target?.dataset.wordId) return;
      event.preventDefault();
      toggleWord(target.dataset.wordId);
    });

    const hint = document.createElement('p');
    hint.className = 'passage__hint';
    hint.textContent = `生词 × ${glossByForm.size}：虚线标注，点击加入词汇本`;

    card.append(cardHead, bodyEl, hint);

    const qTitle = document.createElement('h3');
    qTitle.className = 'section-title section-title--sub';
    qTitle.textContent = '阅读理解（答题即时判分 · 含解析）';

    const list = document.createElement('ol');
    list.className = 'exercise-list';
    passage.questions.forEach((q, i) => list.append(buildQuestion(q, i, onAnswered)));

    section.append(passageTitle, card, qTitle, list);
    page.append(section);
  });

  syncWordStates();

  root.append(header, page);
}
