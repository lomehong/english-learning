import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修一 Unit 3（Sports and Fitness）语法点：一般过去时 / 一般将来时 */

export const unit3GrammarPoints: GrammarPoint[] = [
  {
    id: 'simple-past',
    title: '一般过去时',
    tagline: '表示过去某一时间发生或完成的动作，以及过去存在的状态。',
    forms: [
      { label: '肯定', detail: '主语 + 动词过去式（规则动词 + -ed）' },
      { label: '否定', detail: '主语 + didn\u2019t + 动词原形' },
      { label: '疑问', detail: 'Did + 主语 + 动词原形…?' },
    ],
    usages: [
      '表示在过去某一时间点发生或完成的动作，常带明确的过去时间状语',
      '表示过去一段时间内持续或反复发生的动作',
      '叙述过去连续发生的一连串动作（讲故事、赛后复盘等）',
    ],
    markers: ['yesterday', 'last week / night', '... ago', 'in 2020', 'just now', 'last year'],
    examples: [
      { en: 'Our school held a sports meeting last Friday.', zh: '上周五我们学校举行了一场运动会。' },
      { en: 'She trained hard and finally won the gold medal.', zh: '她刻苦训练，最终赢得了金牌。' },
      { en: 'They didn\u2019t compete in the championship because of the injury.', zh: '因为伤病，他们没有参加锦标赛。' },
    ],
    tips: [
      '规则动词过去式加 -ed：train → trained；以 e 结尾只加 -d：compete → competed',
      '不规则动词需逐个记忆：win → won，hold → held，hurt → hurt',
      '否定句与疑问句用 didn\u2019t / Did + 动词原形：不说 didn\u2019t won，要说 didn\u2019t win',
    ],
  },
  {
    id: 'simple-future',
    title: '一般将来时（will / be going to）',
    tagline: '表示将来要发生的动作或存在的状态，以及计划、打算做的事。',
    forms: [
      { label: '肯定', detail: '主语 + will + 动词原形 / 主语 + am/is/are going to + 动词原形' },
      { label: '否定', detail: '主语 + won\u2019t + 动词原形 / 主语 + am/is/are not going to + 动词原形' },
      { label: '疑问', detail: 'Will + 主语 + 动词原形…? / Am/Is/Are + 主语 + going to + 动词原形…?' },
    ],
    usages: [
      'will 表示对将来的预测、临时的决定或客观必然的结果',
      'be going to 表示事先计划好的打算，或根据现有迹象做出的判断',
      '表示安排好的近期活动时，可用进行时表将来（The match is starting soon）',
    ],
    markers: ['tomorrow', 'next week / month', 'soon', 'later', 'in two days', 'tonight'],
    examples: [
      { en: 'The marathon will take place in our city next month.', zh: '下个月马拉松比赛将在我们市举行。' },
      { en: 'We are going to train on the track every morning.', zh: '我们打算每天早晨在跑道上训练。' },
      { en: 'Look at those clouds — it is going to rain.', zh: '看那些云——快要下雨了。（有迹象）' },
    ],
    tips: [
      'will 后接动词原形：不说 will trains，要说 will train',
      'be going to 中 be 动词随主语变化：I am / He is / We are going to compete',
      '临时决定用 will，事先计划用 be going to，两者不要混用',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 3 Sports and Fitness */
export const unit3Exercises: GrammarExercise[] = [
  {
    id: 'u3-g1',
    type: 'mcq',
    pointId: 'simple-past',
    stem: 'Our school ______ a sports meeting last Friday, and our class won three medals.',
    options: ['holds', 'held', 'will hold', 'is holding'],
    answerIndex: 1,
    explanation:
      '“last Friday” 是明确的过去时间，用一般过去时；hold 的过去式是 held（不规则变化），故选 held。',
  },
  {
    id: 'u3-g2',
    type: 'mcq',
    pointId: 'simple-future',
    stem: 'Look at the dark clouds! It ______ rain before the match begins.',
    options: ['is going to', 'was going to', 'will be', 'has gone to'],
    answerIndex: 0,
    explanation:
      '根据现有迹象（乌云）判断即将发生的事，用 be going to；主语 It 后接 is going to，故选 is going to。',
  },
  {
    id: 'u3-g3',
    type: 'mcq',
    pointId: 'simple-past',
    stem: '— Did your team ______ in the school basketball championship? — Yes, and we got first place.',
    options: ['competed', 'competes', 'compete', 'competing'],
    answerIndex: 2,
    explanation:
      '一般过去时的一般疑问句用 Did + 主语 + 动词原形，already 体现过去的助动词 did 已出现，动词要用原形 compete，故选 compete。',
  },
  {
    id: 'u3-g4',
    type: 'mcq',
    pointId: 'simple-future',
    stem: 'More than two hundred athletes ______ in the city marathon next Sunday.',
    options: ['will compete', 'competed', 'compete', 'were competing'],
    answerIndex: 0,
    explanation:
      '“next Sunday” 表将来，用一般将来时 will + 动词原形；故选 will compete。',
  },
  {
    id: 'u3-g5',
    type: 'mcq',
    pointId: 'simple-past',
    stem: 'The young boxer ______ his opponent and became national champion last year.',
    options: ['beats', 'will beat', 'beat', 'is beating'],
    answerIndex: 2,
    explanation:
      '由 “last year” 与 became 可知叙述过去的事，用一般过去时；beat 的过去式仍是 beat（不规则变化），故选 beat。',
  },
  {
    id: 'u3-g6',
    type: 'mcq',
    pointId: 'simple-future',
    stem: 'We ______ volleyball in the gym this afternoon. Would you like to join us?',
    options: ['played', 'are going to play', 'play', 'have played'],
    answerIndex: 1,
    explanation:
      '事先约好今天下午去打排球，是计划好的打算，用 be going to；主语 we 后接 are going to play，故选 are going to play。',
  },
  {
    id: 'u3-g7',
    type: 'fill',
    pointId: 'simple-past',
    stem: 'Last month, our coach ______ (take) us to watch a boxing match in the new stadium.',
    answer: 'took',
    explanation:
      '“Last month” 表过去，用一般过去时；take 的过去式是不规则的 took。',
  },
  {
    id: 'u3-g8',
    type: 'fill',
    pointId: 'simple-past',
    stem: 'She didn\u2019t ______ (give) up although she injured her knee in the race.',
    answer: 'give',
    explanation:
      '否定句用 didn\u2019t + 动词原形，虽然动作发生在过去，助动词 didn\u2019t 已体现过去，动词用原形 give。',
  },
  {
    id: 'u3-g9',
    type: 'fill',
    pointId: 'simple-future',
    stem: 'Don\u2019t worry. I ______ (tell) you the results of the fitness test as soon as they come out.',
    answer: 'will tell',
    acceptable: ['shall tell'],
    explanation:
      '主句表示将要发生的动作，用 will + 动词原形；as soon as 引导的时间状语从句用一般现在时表将来。',
  },
  {
    id: 'u3-g10',
    type: 'fill',
    pointId: 'simple-future',
    stem: 'My friends and I ______ (be) going to run a marathon for charity next year.',
    answer: 'are',
    explanation:
      'be going to 结构中 be 动词随主语变化；主语 My friends and I 是复数，用 are。',
  },
];
