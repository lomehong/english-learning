import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修二 Unit 5（Music）语法点：过去分词作状语 / 状语从句中的省略 */

export const unit10GrammarPoints: GrammarPoint[] = [
  {
    id: 'past-participle-adverbial',
    title: '过去分词作状语',
    tagline: '过去分词（短语）在句中作状语，修饰主句谓语，与主语是被动关系。',
    forms: [
      { label: '时间 / 原因', detail: '过去分词短语, + 主句（Asked about the song, she smiled.）' },
      { label: '条件', detail: '过去分词短语, + 主句（Given more time, we would win.）' },
      { label: '伴随 / 方式', detail: '主句, + 过去分词短语（He stood there, moved to tears.）' },
    ],
    usages: [
      '主语与分词是被动关系时用过去分词；主动关系则用现在分词',
      '可表时间、原因、条件、伴随、方式等，相当于对应的状语从句',
      '分词的逻辑主语必须与主句主语一致，否则不能用分词作状语',
    ],
    markers: ['Asked…', 'Given…', 'Seen from…', 'Moved by…', 'Tired of…', 'Compared with…'],
    examples: [
      { en: 'Moved by the melody, the audience stood up and clapped.', zh: '被旋律打动，观众起立鼓掌。' },
      { en: 'Seen from the hill, the village looks like a picture.', zh: '从山上看，这座村庄宛如一幅画。' },
      { en: 'Given another chance, the young band would perform better.', zh: '如果再给一次机会，这支年轻乐队会表演得更好。' },
    ],
    tips: [
      '判断口诀：主语“被怎样”用过去分词，“主动做”用现在分词',
      '分词作状语时其逻辑主语要与主句主语一致，不能“悬垂”',
    ],
  },
  {
    id: 'adverbial-ellipsis',
    title: '状语从句中的省略',
    tagline: '当从句主语与主句主语一致且谓语含 be 时，可省略“主语 + be”，只保留分词等成分。',
    forms: [
      { label: '被动省略', detail: 'When (it is) asked…, the composer smiled. → When asked…' },
      { label: '主动省略', detail: 'While (she was) practising… → While practising…' },
      { label: '固定省略', detail: 'If (it is) possible / When (you are) in trouble 等固定省略结构' },
    ],
    usages: [
      '时间、条件、让步状语从句中常用这种省略，使句子更简洁',
      '省略后的分词与主句主语仍保持逻辑上的一致',
      '从句主语与主句主语不同时不能省略，需保留完整从句',
    ],
    markers: ['when asked', 'while doing', 'if given', 'unless invited', 'though tired', 'as if hurt'],
    examples: [
      { en: 'When asked about her inspiration, the singer kept silent for a while.', zh: '当被问到灵感来源时，歌手沉默了一会儿。' },
      { en: 'While practising the violin, the girl forgot everything around her.', zh: '练习小提琴时，女孩忘记了周围的一切。' },
      { en: 'The pianist will not attend unless invited.', zh: '除非受到邀请，否则那位钢琴家不会出席。' },
    ],
    tips: [
      '省略必须同时满足两个条件：主语相同 + 谓语含有 be',
      '省略后从句不再出现主语和 be 动词，不能只省略其一',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），语境取自 Unit 5 Music 主题 */
export const unit10Exercises: GrammarExercise[] = [
  {
    id: 'u20-g1',
    type: 'mcq',
    pointId: 'past-participle-adverbial',
    stem: '______ by the folk song, the composer decided to write a new melody for his home town.',
    options: ['Moving', 'Moved', 'To move', 'Move'],
    answerIndex: 1,
    explanation:
      '主句主语 the composer 与 move 是被动关系（被感动），过去分词 Moved 作原因状语；Moving 表主动，不合逻辑。',
  },
  {
    id: 'u20-g2',
    type: 'mcq',
    pointId: 'past-participle-adverbial',
    stem: '______ from the stage, the hall looked like an ocean of stars.',
    options: ['Seeing', 'To see', 'Seen', 'Saw'],
    answerIndex: 2,
    explanation:
      '主句主语 the hall 与 see 是被动关系（大厅被从舞台上看），用过去分词 Seen 作状语。',
  },
  {
    id: 'u20-g3',
    type: 'mcq',
    pointId: 'adverbial-ellipsis',
    stem: 'When ______ about the award, the young conductor thanked his orchestra first.',
    options: ['asked', 'asking', 'to ask', 'asks'],
    answerIndex: 0,
    explanation:
      '省略结构 When (he was) asked…：主语 the conductor 与 ask 是被动关系，保留过去分词 asked。',
  },
  {
    id: 'u20-g4',
    type: 'mcq',
    pointId: 'adverbial-ellipsis',
    stem: 'While ______ the new song, the band worked in the studio until midnight.',
    options: ['recorded', 'recording', 'to record', 'records'],
    answerIndex: 1,
    explanation:
      '省略结构 While (the band was) recording…：主语 the band 与 record 是主动关系，保留现在分词 recording。',
  },
  {
    id: 'u20-g5',
    type: 'mcq',
    pointId: 'past-participle-adverbial',
    stem: '______ more time, the choir would have won the first prize.',
    options: ['Giving', 'Given', 'To give', 'Give'],
    answerIndex: 1,
    explanation:
      '主句主语 the choir 与 give 是被动关系（被给予），用过去分词 Given 作条件状语，相当于 If it had been given more time。',
  },
  {
    id: 'u20-g6',
    type: 'mcq',
    pointId: 'adverbial-ellipsis',
    stem: 'The famous singer never appears on TV shows unless ______.',
    options: ['invite', 'inviting', 'invited', 'to invite'],
    answerIndex: 2,
    explanation:
      '省略结构 unless (she is) invited：主语 the singer 与 invite 是被动关系，保留过去分词 invited。',
  },
  {
    id: 'u20-f1',
    type: 'fill',
    pointId: 'past-participle-adverbial',
    stem: '______ (touch) by the warm applause, the old musician bowed again and again.',
    answer: 'Touched',
    explanation:
      '主语 the old musician 与 touch 是被动关系（被打动），过去分词 Touched 作原因状语，置于句首。',
  },
  {
    id: 'u20-f2',
    type: 'fill',
    pointId: 'past-participle-adverbial',
    stem: '______ (compare) with last year, the number of the audience has grown a lot.',
    answer: 'Compared',
    explanation:
      '“Compared with + 名词” 是固定结构（与……相比），句首用过去分词 Compared。',
  },
  {
    id: 'u20-f3',
    type: 'fill',
    pointId: 'adverbial-ellipsis',
    stem: 'Though ______ (tire) after the long performance, the players smiled at the audience.',
    answer: 'tired',
    explanation:
      '省略结构 Though (they were) tired…：tired 本身是形容词化的过去分词，直接保留 tired。',
  },
  {
    id: 'u20-f4',
    type: 'fill',
    pointId: 'adverbial-ellipsis',
    stem: 'When ______ (invite) to the school art festival, the folk singer gladly said yes.',
    answer: 'invited',
    explanation:
      '省略结构 When (he was) invited…：主语 the folk singer 与 invite 是被动关系，保留过去分词 invited。',
  },
];

const pointById = new Map(unit10GrammarPoints.map((p) => [p.id, p]));

export function getGrammarPoint(id: string): GrammarPoint | undefined {
  return pointById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit10GrammarPoints, exercises: unit10Exercises };
