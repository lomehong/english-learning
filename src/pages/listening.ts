import { getListeningsByUnit, countScriptWords, LISTENING_QUESTION_TYPE_LABEL } from '../data/listening';
import { BOOK_LABELS, UNIT_META, unitTitle, type UnitId } from '../data/units';
import {
  loadWrongBook,
  saveWrongBook,
  recordWrong,
  type WrongBook,
} from '../store/wrongbook';
import { recordAnswerAndSave } from '../store/stats';
import { recordActivityAndSave } from '../store/daily';
import type { ListeningMaterial, ListeningQuestion } from '../types';
import type { SpeechEngine, PlayerState } from '../speech/tts';
import { buildEmptyState, defaultListeningDeps, type ListeningDeps } from './deps';
import { buildUnitBadge, currentUnit } from './unit-switch';
import { buildSiteFooter, buildSiteHeader } from './site-chrome';

/**
 * /listening 页：单元切换 + 主题听力材料 ×2，浏览器 speechSynthesis 本地朗读
 * （播放/暂停/继续/停止 + 三档语速），答题即时判分 / 解析，
 * 错题自动入本、作答计入统计（错题本 / 学习报告页的数据源）。
 *
 * 路由离开时需停止朗读并释放订阅 → render 返回清理函数交给 router；
 * 单元切换时同样先停止朗读再重建内容。
 */

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
/** 三档语速（慢速跟读 / 常速考试 / 快速进阶） */
const RATES = [0.8, 1.0, 1.2] as const;

/* ---------- 题目渲染（结构与阅读模块单选题一致） ---------- */

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
  question: ListeningQuestion,
  index: number,
  onAnswered: (correct: boolean, question: ListeningQuestion, yourAnswer: string) => void,
): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'exercise exercise--listening';
  item.dataset.question = question.id;

  const head = document.createElement('div');
  head.className = 'exercise__head';
  const no = document.createElement('span');
  no.className = 'exercise__no';
  no.textContent = `第 ${index + 1} 题`;
  const type = document.createElement('span');
  type.className = 'badge';
  type.textContent = LISTENING_QUESTION_TYPE_LABEL[question.type];
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
      onAnswered(correct, question, question.options[i]);
    });
    body.append(button);
  });

  item.append(head, stem, body);
  return item;
}

/* ---------- 播放器 ---------- */

/** 单条材料的播放器：播放/暂停/继续三态 + 停止 + 语速选择 + 原文折叠 */
function buildPlayer(material: ListeningMaterial, engine: SpeechEngine): {
  el: HTMLElement;
  sync: () => void;
} {
  const el = document.createElement('div');
  el.className = 'listening-player';

  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'btn btn--primary btn--sm';
  play.setAttribute('data-testid', `play-${material.id}`);
  play.textContent = '▶ 播放';
  play.setAttribute('aria-label', `播放材料 ${material.title}`);

  const stop = document.createElement('button');
  stop.type = 'button';
  stop.className = 'btn btn--ghost btn--sm';
  stop.setAttribute('data-testid', `stop-${material.id}`);
  stop.textContent = '⏹ 停止';
  stop.setAttribute('aria-label', `停止播放材料 ${material.title}`);

  const rateLabel = document.createElement('label');
  rateLabel.className = 'listening-player__rate';
  rateLabel.textContent = '语速 ';
  const rate = document.createElement('select');
  rate.setAttribute('data-testid', `rate-${material.id}`);
  rate.setAttribute('aria-label', `材料 ${material.title} 语速`);
  for (const value of RATES) {
    const option = document.createElement('option');
    option.value = String(value);
    option.textContent = value === 1.0 ? '1.0 常速' : value === 0.8 ? '0.8 慢速' : '1.2 快速';
    if (value === 1.0) option.selected = true;
    rate.append(option);
  }
  rateLabel.append(rate);

  const stateChip = document.createElement('span');
  stateChip.className = 'stat-chip';
  stateChip.setAttribute('data-testid', `player-state-${material.id}`);
  stateChip.textContent = '未播放';

  const text = material.script.join(' ');

  play.addEventListener('click', () => {
    if (engine.currentId === material.id) {
      if (engine.state === 'playing') {
        engine.pause();
        return;
      }
      if (engine.state === 'paused') {
        engine.resume();
        return;
      }
    }
    engine.play(material.id, text, Number(rate.value));
  });
  stop.addEventListener('click', () => engine.stop());

  const STATE_TEXT: Record<PlayerState, string> = { idle: '未播放', playing: '播放中', paused: '已暂停' };

  function sync(): void {
    const mine = engine.currentId === material.id;
    const state = mine ? engine.state : 'idle';
    play.textContent = state === 'playing' ? '⏸ 暂停' : state === 'paused' ? '▶ 继续' : '▶ 播放';
    stateChip.textContent = STATE_TEXT[state];
    play.disabled = !engine.supported;
    stop.disabled = !engine.supported || !mine;
  }

  el.append(play, stop, rateLabel, stateChip);
  return { el, sync };
}

/* ---------- 页面 ---------- */

export function renderListening(root: HTMLElement, deps?: ListeningDeps): () => void {
  const d: ListeningDeps = deps ?? defaultListeningDeps();

  let teardown: (() => void) | null = null;

  function mount(): void {
    const engine = d.createEngine();
    const unit: UnitId = currentUnit();
    const materials = getListeningsByUnit(unit);
    const TOTAL = materials.reduce((n, m) => n + m.questions.length, 0);

    let book: WrongBook = loadWrongBook();
    let answered = 0;
    let correctCount = 0;

    const header = buildSiteHeader('/listening');
    const footer = buildSiteFooter();

    const page = document.createElement('main');
    page.className = 'page';

    const statChip = document.createElement('span');
    statChip.className = 'stat-chip';
    statChip.setAttribute('data-testid', 'listening-stat');
    statChip.textContent = `已答 0 / ${TOTAL} · 答对 0`;

    const head = document.createElement('div');
    head.className = 'page-head';
    const title = document.createElement('h1');
    title.className = 'page-head__title';
    title.textContent = `听力 · ${BOOK_LABELS[UNIT_META[unit].book]} ${unitTitle(unit)}（${UNIT_META[unit].titleZh}）`;

    // 全局单元：首页切换器维护（localStorage + ?unit=），此处只读展示
    const headSpacer = document.createElement('span');
    headSpacer.className = 'page-head__spacer';
    head.append(title, buildUnitBadge(unit), headSpacer, statChip);

    page.append(head);

    // 缺 unitN-listening.ts 数据时优雅降级为「暂无内容」（不渲染材料区，也不崩溃）
    if (materials.length === 0) {
      page.append(buildEmptyState('本单元听力内容暂无内容，敬请期待。'));
    } else {
      const intro = document.createElement('p');
      intro.className = 'page-intro';
      intro.textContent = `${materials.length} 段「${UNIT_META[unit].title}」主题听力材料（自编 · 浏览器本地语音合成朗读，无需外部音频）。先听音频完成每段 ${materials[0]?.questions.length ?? 0} 道理解题（答题即时判分并附解析），听不懂再点开原文对照；错题自动进入错题本。`;
      page.append(intro);
    }

    /** 答题即记统计（按当前单元计入单元维度）；答错另入错题本（错题本/学习报告页的数据源） */
    const onAnswered = (correct: boolean, question: ListeningQuestion, yourAnswer: string): void => {
      answered += 1;
      if (correct) correctCount += 1;
      statChip.textContent = `已答 ${answered} / ${TOTAL} · 答对 ${correctCount}`;
      recordAnswerAndSave('listening', correct, unit);
      // 学习计划数据源：当日练习题 +1
      recordActivityAndSave('exercises', Date.now());
      if (!correct) {
        book = recordWrong(
          book,
          {
            exerciseId: question.id,
            module: 'listening',
            stem: question.stem,
            yourAnswer,
            correctAnswer: question.options[question.answerIndex],
            explanation: question.explanation,
          },
          Date.now(),
        );
        saveWrongBook(book);
      }
    };

    const syncs: Array<() => void> = [];

    materials.forEach((material: ListeningMaterial, mIndex: number) => {
      const section = document.createElement('section');
      section.className = 'listening-material';
      section.dataset.material = material.id;

      const materialTitle = document.createElement('h2');
      materialTitle.className = 'section-title';
      materialTitle.textContent = `Material ${mIndex + 1} · ${material.title}`;

      const card = document.createElement('article');
      card.className = 'listening-card card';

      const cardHead = document.createElement('div');
      cardHead.className = 'passage__head';
      const cardTitle = document.createElement('h3');
      cardTitle.className = 'passage__title';
      cardTitle.textContent = material.title;
      const genre = document.createElement('span');
      genre.className = 'badge';
      genre.textContent = material.genre;
      const wordsChip = document.createElement('span');
      wordsChip.className = 'stat-chip';
      wordsChip.textContent = `约 ${countScriptWords(material.script)} 词`;
      cardHead.append(cardTitle, genre, wordsChip);

      const player = buildPlayer(material, engine);
      syncs.push(player.sync);
      if (!engine.supported) {
        const hint = document.createElement('p');
        hint.className = 'passage__hint';
        hint.setAttribute('data-testid', `tts-unsupported-${material.id}`);
        hint.textContent = '当前浏览器不支持语音合成（Web Speech API），无法朗读；可展开原文作读练。';
        card.append(cardHead, player.el, hint);
      } else {
        card.append(cardHead, player.el);
      }

      /* 原文折叠：默认隐藏，听完作答后可展开对照 */
      const scriptToggle = document.createElement('button');
      scriptToggle.type = 'button';
      scriptToggle.className = 'btn btn--ghost btn--sm listening-script__toggle';
      scriptToggle.setAttribute('data-testid', `script-toggle-${material.id}`);
      scriptToggle.setAttribute('aria-expanded', 'false');
      scriptToggle.setAttribute('aria-controls', `script-${material.id}`);
      scriptToggle.textContent = '查看听力原文';

      const script = document.createElement('div');
      script.className = 'listening-script';
      script.id = `script-${material.id}`;
      script.setAttribute('data-testid', `script-${material.id}`);
      script.hidden = true;
      const scriptList = document.createElement('ol');
      scriptList.className = 'listening-script__list';
      for (const line of material.script) {
        const li = document.createElement('li');
        li.className = 'listening-script__line';
        li.textContent = line;
        scriptList.append(li);
      }
      script.append(scriptList);

      scriptToggle.addEventListener('click', () => {
        const expanded = !script.hidden;
        script.hidden = expanded;
        scriptToggle.setAttribute('aria-expanded', String(!expanded));
        scriptToggle.textContent = expanded ? '查看听力原文' : '收起听力原文';
      });

      card.append(scriptToggle, script);

      const qTitle = document.createElement('h3');
      qTitle.className = 'section-title section-title--sub';
      qTitle.textContent = '听力理解（答题即时判分 · 含解析）';

      const list = document.createElement('ol');
      list.className = 'exercise-list';
      material.questions.forEach((q, i) => list.append(buildQuestion(q, i, onAnswered)));

      section.append(materialTitle, card, qTitle, list);
      page.append(section);
    });

    for (const sync of syncs) sync();

    root.append(header, page, footer);

    /* 引擎状态变化 → 同步所有播放器按钮文案/禁用态 */
    const unsubscribe = engine.subscribe(() => {
      for (const sync of syncs) sync();
    });

    teardown = () => {
      unsubscribe();
      engine.destroy();
    };
  }

  mount();

  /* 路由离开：停止朗读并释放订阅（由 router 调用） */
  return () => {
    teardown?.();
  };
}
