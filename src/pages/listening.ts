import { unit1Listenings, countScriptWords, LISTENING_QUESTION_TYPE_LABEL } from '../data/unit1-listening';
import { defaultListeningDeps, type ListeningDeps } from './deps';
import type { ListeningMaterial, ListeningQuestion } from '../types';

/**
 * /listening 页：Unit 1 主题听力材料 ×2（自编 · 约 80 词/段），
 * 浏览器 speechSynthesis 本地朗读（播放/暂停/继续/重听 + 语速可调，无外部 TTS），
 * 每段 3 道听力理解题，答题即时判分并附解析；答完该段可查看原文。
 */

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
const TOTAL = unit1Listenings.reduce((n, m) => n + m.questions.length, 0);

/** 语速档位：0.6–1.4，步进 0.1，默认 1.0 */
const RATE_MIN = 0.6;
const RATE_MAX = 1.4;
const RATE_STEP = 0.1;
const RATE_DEFAULT = 1;

/** 朗读文本 = 原文各行以空格拼接（对话体的说话人标签一并朗读） */
function scriptText(material: ListeningMaterial): string {
  return material.script.join(' ');
}

/* ---------- 题目渲染（结构与阅读/语法模块单选题一致） ---------- */

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

function buildQuestion(question: ListeningQuestion, index: number, onAnswered: (correct: boolean) => void): HTMLLIElement {
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
        question.options[i] ?? '',
        question.options[question.answerIndex] ?? '',
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

/**
 * 渲染 /listening 页。
 * @returns 清理函数：路由离开时调用（停止朗读、销毁引擎、退订）。
 */
export function renderListening(root: HTMLElement, deps?: ListeningDeps): () => void {
  const d: ListeningDeps = deps ?? defaultListeningDeps();
  const engine = d.createEngine();

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
        <a class="btn btn--ghost" href="/reading" data-link>阅读</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';

  const listenStat = document.createElement('span');
  listenStat.className = 'stat-chip';
  listenStat.setAttribute('data-testid', 'listening-stat');
  listenStat.textContent = `已答 0 / ${TOTAL} · 答对 0`;

  const head = document.createElement('div');
  head.className = 'page-head';
  const title = document.createElement('h1');
  title.className = 'page-head__title';
  title.textContent = '听力 · 必修一 Unit 1';
  const headSpacer = document.createElement('span');
  headSpacer.className = 'page-head__spacer';
  head.append(title, headSpacer, listenStat);

  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent = `${unit1Listenings.length} 段「Teenage Life」主题听力材料（自编 · 约 80 词/段），由本机浏览器语音合成朗读：支持播放 / 暂停 / 继续 / 重听，语速可调，不依赖任何外部 TTS 服务。每段配 ${unit1Listenings[0]?.questions.length ?? 0} 道听力理解题，答题即时判分并附解析；答完该段全部题目后可查看听力原文。`;

  page.append(head, intro);

  if (!engine.supported) {
    const notice = document.createElement('div');
    notice.className = 'listening-notice';
    notice.setAttribute('data-testid', 'listening-unsupported');
    notice.textContent = '当前浏览器不支持语音合成（Web Speech API），无法朗读。题目仍可作答，建议使用 Chrome / Edge 等现代浏览器。';
    page.append(notice);
  }

  /* ---------- 播放器同步：跟随引擎状态刷新所有段落按钮 ---------- */

  interface PlayerView {
    id: string;
    playButton: HTMLButtonElement;
    card: HTMLElement;
  }
  const players: PlayerView[] = [];

  function syncPlayers(): void {
    for (const p of players) {
      const mine = engine.currentId === p.id;
      const playing = mine && engine.state === 'playing';
      const paused = mine && engine.state === 'paused';
      p.playButton.textContent = playing ? '⏸ 暂停' : paused ? '▶ 继续' : '▶ 播放';
      p.playButton.setAttribute('aria-label', playing ? '暂停朗读' : paused ? '继续朗读' : '播放本段听力');
      p.card.classList.toggle('listening-player--active', mine && engine.state !== 'idle');
    }
  }
  const unsubscribe = engine.subscribe(syncPlayers);

  /* ---------- 每段：播放器卡 + 3 道题 + 原文 ---------- */

  unit1Listenings.forEach((material: ListeningMaterial, mIndex: number) => {
    const section = document.createElement('section');
    section.className = 'listening-passage';
    section.dataset.passage = material.id;

    const passageTitle = document.createElement('h2');
    passageTitle.className = 'section-title';
    passageTitle.textContent = `Passage ${mIndex + 1} · ${material.title}`;

    const card = document.createElement('article');
    card.className = 'listening-player card';
    card.setAttribute('data-testid', `player-${material.id}`);

    const cardHead = document.createElement('div');
    cardHead.className = 'listening-player__head';
    const cardTitle = document.createElement('h3');
    cardTitle.className = 'listening-player__title';
    cardTitle.textContent = material.title;
    const genre = document.createElement('span');
    genre.className = 'badge';
    genre.textContent = material.genre;
    const wordsChip = document.createElement('span');
    wordsChip.className = 'stat-chip';
    wordsChip.textContent = `约 ${countScriptWords(material.script)} 词`;
    cardHead.append(cardTitle, genre, wordsChip);

    /* 控制条：播放/暂停 · 重听 · 语速 */
    const controls = document.createElement('div');
    controls.className = 'listening-player__controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', `Passage ${mIndex + 1} 朗读控制`);

    let rate = RATE_DEFAULT;

    const playButton = document.createElement('button');
    playButton.type = 'button';
    playButton.className = 'btn btn--primary listening-player__play';
    playButton.setAttribute('data-testid', `listen-play-${material.id}`);
    playButton.textContent = '▶ 播放';
    playButton.disabled = !engine.supported;
    playButton.addEventListener('click', () => {
      const mine = engine.currentId === material.id;
      if (mine && engine.state === 'playing') engine.pause();
      else if (mine && engine.state === 'paused') engine.resume();
      else engine.play(material.id, scriptText(material), rate);
    });

    const replayButton = document.createElement('button');
    replayButton.type = 'button';
    replayButton.className = 'btn btn--ghost listening-player__replay';
    replayButton.setAttribute('data-testid', `listen-replay-${material.id}`);
    replayButton.textContent = '↺ 重听';
    replayButton.disabled = !engine.supported;
    replayButton.addEventListener('click', () => {
      engine.play(material.id, scriptText(material), rate);
    });

    const rateLabel = document.createElement('label');
    rateLabel.className = 'listening-player__rate';
    const rateText = document.createElement('span');
    rateText.textContent = '语速';
    const rateInput = document.createElement('input');
    rateInput.type = 'range';
    rateInput.min = String(RATE_MIN);
    rateInput.max = String(RATE_MAX);
    rateInput.step = String(RATE_STEP);
    rateInput.value = String(RATE_DEFAULT);
    rateInput.setAttribute('data-testid', `listen-rate-${material.id}`);
    rateInput.disabled = !engine.supported;
    rateInput.setAttribute('aria-label', `Passage ${mIndex + 1} 朗读语速`);
    const rateValue = document.createElement('span');
    rateValue.className = 'listening-player__rate-value';
    rateValue.setAttribute('data-testid', `listen-rate-label-${material.id}`);
    rateValue.textContent = `${RATE_DEFAULT.toFixed(1)}×`;
    rateInput.addEventListener('input', () => {
      rate = Number(rateInput.value);
      rateValue.textContent = `${rate.toFixed(1)}×`;
      // 正在朗读/暂停本段时调整语速：utterance 不支持热改，从本段开头以新语速重读
      if (engine.currentId === material.id) {
        engine.play(material.id, scriptText(material), rate);
      }
    });
    rateLabel.append(rateText, rateInput, rateValue);

    controls.append(playButton, replayButton, rateLabel);

    const hint = document.createElement('p');
    hint.className = 'listening-player__hint';
    hint.textContent = '浏览器本地朗读 · 朗读中调整语速将从本段开头重读';

    card.append(cardHead, controls, hint);

    players.push({ id: material.id, playButton, card });

    /* 题目：即时判分 + 统计 + 解锁原文 */
    const qTitle = document.createElement('h3');
    qTitle.className = 'section-title section-title--sub';
    qTitle.textContent = '听力理解（答题即时判分 · 含解析）';

    const list = document.createElement('ol');
    list.className = 'exercise-list';

    const transcript = document.createElement('article');
    transcript.className = 'listening-transcript card';
    transcript.setAttribute('data-testid', `listen-transcript-${material.id}`);
    transcript.hidden = true;
    const transcriptTitle = document.createElement('h3');
    transcriptTitle.className = 'listening-transcript__title';
    transcriptTitle.textContent = '听力原文';
    transcript.append(transcriptTitle);
    for (const line of material.script) {
      const p = document.createElement('p');
      p.className = 'listening-transcript__line';
      p.textContent = line;
      transcript.append(p);
    }

    const toggleWrap = document.createElement('div');
    toggleWrap.className = 'listening-transcript-toggle';
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'btn btn--ghost';
    toggleButton.setAttribute('data-testid', `listen-transcript-toggle-${material.id}`);
    toggleButton.textContent = '查看听力原文';
    toggleButton.disabled = true; // 答完本段全部题目后解锁
    toggleButton.addEventListener('click', () => {
      transcript.hidden = !transcript.hidden;
      toggleButton.textContent = transcript.hidden ? '查看听力原文' : '收起听力原文';
    });
    toggleWrap.append(toggleButton);

    let answeredHere = 0;
    const onAnswered = (correct: boolean): void => {
      answered += 1;
      if (correct) correctCount += 1;
      listenStat.textContent = `已答 ${answered} / ${TOTAL} · 答对 ${correctCount}`;
      answeredHere += 1;
      if (answeredHere === material.questions.length) toggleButton.disabled = false;
    };

    material.questions.forEach((q, i) => list.append(buildQuestion(q, i, onAnswered)));

    section.append(passageTitle, card, qTitle, list, toggleWrap, transcript);
    page.append(section);
  });

  syncPlayers();
  root.append(header, page);

  /* 路由离开本页时停止朗读并释放引擎（由 router 调用） */
  return () => {
    unsubscribe();
    engine.destroy();
  };
}
