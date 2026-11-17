import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修一 Unit 1（Teenage Life）语法点：一般现在时 / 现在进行时 */

export const unit1GrammarPoints: GrammarPoint[] = [
  {
    id: 'simple-present',
    title: '一般现在时',
    tagline: '表示经常性、习惯性的动作，或客观事实与普遍真理。',
    forms: [
      { label: '肯定', detail: '主语 + 动词原形（第三人称单数 + -s / -es）' },
      { label: '否定', detail: '主语 + don\u2019t / doesn\u2019t + 动词原形' },
      { label: '疑问', detail: 'Do / Does + 主语 + 动词原形…?' },
    ],
    usages: [
      '表示经常发生或习惯性的动作，常与频度副词连用',
      '表示客观事实或普遍真理（永远用一般现在时）',
      '表示主语的特征、性格、能力或现状',
    ],
    markers: ['always', 'usually', 'often', 'sometimes', 'never', 'every day / week', 'on Fridays'],
    examples: [
      { en: 'I usually get up at six in the morning.', zh: '我通常早上六点起床。' },
      { en: 'The earth moves around the sun.', zh: '地球绕着太阳转。（客观事实）' },
      { en: 'She doesn\u2019t like playing computer games.', zh: '她不喜欢玩电脑游戏。' },
    ],
    tips: [
      '第三人称单数作主语时，动词要加 -s / -es（study → studies）',
      '否定句、疑问句中要用动词原形：doesn\u2019t like，而不是 doesn\u2019t likes',
    ],
  },
  {
    id: 'present-continuous',
    title: '现在进行时',
    tagline: '表示说话瞬间或现阶段正在进行或发生的动作。',
    forms: [
      { label: '肯定', detail: '主语 + am / is / are + 动词-ing' },
      { label: '否定', detail: '主语 + am / is / are + not + 动词-ing' },
      { label: '疑问', detail: 'Am / Is / Are + 主语 + 动词-ing…?' },
    ],
    usages: [
      '表示说话时正在进行的活动',
      '表示现阶段（近段时间）持续进行的动作，不一定此刻发生',
      '与 always 连用，表示说话人的情感色彩（抱怨或赞叹）',
    ],
    markers: ['now', 'right now', 'at the moment', 'Look!', 'Listen!', 'these days'],
    examples: [
      { en: 'I am doing my homework now.', zh: '我现在正在做作业。' },
      { en: 'Look! The children are playing football.', zh: '看！孩子们正在踢足球。' },
      { en: 'He is always losing his keys.', zh: '他老是丢钥匙。（抱怨）' },
    ],
    tips: [
      'be 动词 am / is / are 要与主语保持一致，不能遗漏',
      '动词-ing 变化规则：直接加（clean→cleaning）；去 e 加（give→giving）；双写加（run→running）',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇取自 Unit 1 Teenage Life */
export const unit1Exercises: GrammarExercise[] = [
  {
    id: 'g1',
    type: 'mcq',
    pointId: 'present-continuous',
    stem: 'Listen! Someone ______ in the next room.',
    options: ['sings', 'is singing', 'sang', 'will sing'],
    answerIndex: 1,
    explanation:
      '“Listen!” 提示动作此刻正在进行，用现在进行时；someone 作主语，be 动词用 is，故选 is singing。',
  },
  {
    id: 'g2',
    type: 'mcq',
    pointId: 'simple-present',
    stem: 'My brother ______ to the school reading club every Friday afternoon.',
    options: ['go', 'goes', 'is going', 'went'],
    answerIndex: 1,
    explanation:
      '“every Friday afternoon” 表示每周惯例，用一般现在时；my brother 是第三人称单数，动词加 -es，故选 goes。',
  },
  {
    id: 'g3',
    type: 'mcq',
    pointId: 'simple-present',
    stem: 'The sun ______ in the east and sets in the west.',
    options: ['rises', 'is rising', 'rose', 'will rise'],
    answerIndex: 0,
    explanation:
      '太阳东升西落是客观事实，永远用一般现在时；the sun 是第三人称单数，故选 rises。',
  },
  {
    id: 'g4',
    type: 'mcq',
    pointId: 'present-continuous',
    stem: '— Where is Tom? — He ______ an experiment in the science lab.',
    options: ['does', 'did', 'is doing', 'has done'],
    answerIndex: 2,
    explanation:
      '问句问的是 Tom 此刻在哪里，答语表示现在正在进行的动作，用现在进行时；he 对应 be 动词 is，故选 is doing。',
  },
  {
    id: 'g5',
    type: 'mcq',
    pointId: 'present-continuous',
    stem: 'He is always ______ his classmates with their homework. What a nice boy!',
    options: ['help', 'helps', 'helped', 'helping'],
    answerIndex: 3,
    explanation:
      '“be always doing” 结构表示说话人的赞叹等感情色彩；is 后接动词-ing，故选 helping。',
  },
  {
    id: 'g6',
    type: 'mcq',
    pointId: 'present-continuous',
    stem: 'These days we ______ for the coming English speech contest.',
    options: ['prepare', 'are preparing', 'prepared', 'have prepared'],
    answerIndex: 1,
    explanation:
      '“these days” 表示现阶段持续进行的事，用现在进行时；we 对应 be 动词 are，故选 are preparing。',
  },
  {
    id: 'g7',
    type: 'fill',
    pointId: 'simple-present',
    stem: 'My sister usually ______ (study) English grammar on weekends.',
    answer: 'studies',
    explanation:
      '“usually … on weekends” 表示习惯性动作，用一般现在时；my sister 是第三人称单数，study 以辅音字母加 y 结尾，变 y 为 ies，填 studies。',
  },
  {
    id: 'g8',
    type: 'fill',
    pointId: 'simple-present',
    stem: 'Tom ______ (not / like) playing computer games after class.',
    answer: "doesn't like",
    acceptable: ['does not like'],
    explanation:
      '主语 Tom 为第三人称单数，否定句用 doesn\u2019t 加动词原形；like 接动名词 playing，填 doesn\u2019t like。',
  },
  {
    id: 'g9',
    type: 'fill',
    pointId: 'present-continuous',
    stem: 'Look! The children ______ (run) on the playground.',
    answer: 'are running',
    explanation:
      '“Look!” 提示动作正在进行，用现在进行时；the children 为复数，be 动词用 are；run 以重读闭音节结尾，双写 n 加 -ing，填 are running。',
  },
  {
    id: 'g10',
    type: 'fill',
    pointId: 'present-continuous',
    stem: 'Listen! Our teacher ______ (give) us a talk about teenage life.',
    answer: 'is giving',
    explanation:
      '“Listen!” 提示此刻正在进行，用现在进行时；our teacher 为第三人称单数，be 动词用 is；give 以不发音 e 结尾，去 e 加 -ing，填 is giving。',
  },
];

const pointById = new Map(unit1GrammarPoints.map((p) => [p.id, p]));

export function getGrammarPoint(id: string): GrammarPoint | undefined {
  return pointById.get(id);
}
