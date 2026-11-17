import { getWord, getWordUnit, allWords } from '../data/words';
import { scheduleCard, AGAIN_DELAY_MS } from '../srs/sm2';
import type { Card, Grade } from '../types';
import type { Progress } from '../store/progress';
import { loadWrongBook, saveWrongBook, recordWrong, removeEntry } from '../store/wrongbook';
import { recordAnswerAndSave } from '../store/stats';
import { createFlipCard, type VocabDeps } from './deps';

/** 到期队列计算：due <= now，按到期时间升序（与渲染解耦） */
export function computeDueCards(progress: Progress, now: number): Card[] {
  return Object.values(progress.cards)
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due);
}

/** 词汇错题的持久化 id（w: 前缀，供错题本页按模块过滤与「去重练」跳转） */
function vocabWrongId(wordId: string): string {
  return `w:${wordId}`;
}

/** 复习评分的错题本联动：again=记为词汇错题；重练后非 again=掌握出本 */
function syncVocabWrong(wordId: string, grade: Grade, at: number): void {
  if (!getWord(wordId)) return; // 词表外脏数据不记
  if (grade === 'again') {
    const word = getWord(wordId)!;
    saveWrongBook(
      recordWrong(
        loadWrongBook(),
        {
          exerciseId: vocabWrongId(wordId),
          module: 'vocab',
          stem: `${word.word} ${word.phonetic}`,
          yourAnswer: '复习时未想起释义（重来）',
          correctAnswer: word.meaning,
          explanation: `${word.pos} ${word.meaning} · 例句：${word.example}（${word.exampleZh}）`,
        },
        at,
      ),
    );
  } else {
    const book = loadWrongBook();
    if (book.entries[vocabWrongId(wordId)]) saveWrongBook(removeEntry(book, vocabWrongId(wordId)));
  }
}

/** 复习页：到期队列 + 四档评分（again/hard/good/easy） */
export function renderReview(
  container: HTMLElement,
  deps: VocabDeps,
  options: { gotoLearn?: () => void } = {},
): void {
  const progress = deps.load();
  const sessionTotal = computeDueCards(progress, deps.now()).length;
  let sessionDone = 0;

  /** 按钮副标题：该档之后的下次复习时间预览 */
  function intervalLabel(grade: Grade, card: Card): string {
    const next = scheduleCard(card, grade, deps.now());
    if (grade === 'again') return `${Math.round(AGAIN_DELAY_MS / 60000)} 分钟后`;
    if (next.intervalDays === 1) return '1 天后';
    return `${next.intervalDays} 天后`;
  }

  function render(): void {
    container.innerHTML = '';
    const now = deps.now();
    const queue = computeDueCards(progress, now);

    if (queue.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      const learnedTotal = Object.keys(progress.cards).length;
      empty.innerHTML = `
        <h2 class="empty-state__title">🎉 暂无到期单词</h2>
        <p class="empty-state__desc">
          已学 ${learnedTotal} / ${allWords.length} 词（两单元合计），到期单词复习完后会在这里排队。
        </p>`;
      const goLearn = document.createElement('button');
      goLearn.type = 'button';
      goLearn.className = 'btn btn--primary';
      goLearn.textContent = '去学习新词 →';
      goLearn.addEventListener('click', () => options.gotoLearn?.());
      empty.append(goLearn);
      container.append(empty);
      return;
    }

    const card = queue[0];
    const word = getWord(card.id);

    const bar = document.createElement('div');
    bar.className = 'queue-bar';
    const track = document.createElement('div');
    track.className = 'progress-track';
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    const done = sessionTotal === 0 ? 0 : sessionDone;
    const total = Math.max(sessionTotal, done + queue.length);
    fill.style.width = `${total === 0 ? 0 : Math.round((done / total) * 100)}%`;
    track.append(fill);
    const remain = document.createElement('span');
    remain.className = 'card-nav__counter';
    remain.textContent = `剩余 ${queue.length} 词`;
    bar.append(track, remain);

    if (!word) {
      // 进度中存在词表外的脏数据：跳过并清理，保证队列可用
      delete progress.cards[card.id];
      deps.save(progress);
      render();
      return;
    }

    const flipCard = createFlipCard(word);

    const actions = document.createElement('div');
    actions.className = 'grade-actions';
    const grades: Array<{ grade: Grade; label: string; className: string }> = [
      { grade: 'again', label: '重来', className: 'btn--again' },
      { grade: 'hard', label: '困难', className: 'btn--hard' },
      { grade: 'good', label: '良好', className: 'btn--good' },
      { grade: 'easy', label: '简单', className: 'btn--easy' },
    ];
    for (const { grade, label, className } of grades) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn btn--grade ${className}`;
      btn.setAttribute('data-grade', grade);
      btn.innerHTML = `<span>${label}</span><small>${intervalLabel(grade, card)}</small>`;
      btn.addEventListener('click', () => {
        progress.cards[card.id] = scheduleCard(card, grade, deps.now());
        deps.save(progress);
        sessionDone += 1;
        // 学习报告数据源（按单词所属单元计入单元维度）+ 词汇错题联动（again 记错、掌握出本）
        recordAnswerAndSave('vocab', grade !== 'again', getWordUnit(card.id) ?? 'unit1');
        syncVocabWrong(card.id, grade, deps.now());
        render();
      });
      actions.append(btn);
    }

    const hint = document.createElement('p');
    hint.className = 'flip-card__hint';
    hint.style.cssText = 'text-align:center;margin-top:var(--space-3);';
    hint.textContent = '先翻面回忆，再选择掌握程度';
    hint.dataset.hint = 'grade-hint';

    container.append(bar, flipCard.el, hint, actions);
  }

  render();
}
