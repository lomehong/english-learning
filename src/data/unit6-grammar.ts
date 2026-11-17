import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修二 Unit 1（Cultural Heritage）语法点：关系副词 / 介词+关系代词 */

export const unit6GrammarPoints: GrammarPoint[] = [
  {
    id: 'relative-adverbs',
    title: '关系副词 when / where / why 引导的限制性定语从句',
    tagline: '在定语从句中作状语：when 表时间、where 表地点、why 表原因。',
    forms: [
      { label: '时间', detail: '先行词为时间名词 + when + 从句（when = 介词 + which）' },
      { label: '地点', detail: '先行词为地点名词 + where + 从句（where = 介词 + which）' },
      { label: '原因', detail: '先行词为 reason + why + 从句（why = for which）' },
    ],
    usages: [
      '关系副词在从句中充当状语，修饰从句的谓语动词',
      '先行词是表时间、地点或原因的名词时，优先考虑关系副词',
      '从句中缺主语或宾语时用关系代词（that / which 等），不缺成分时才用关系副词',
    ],
    markers: ['when', 'where', 'why', 'the time', 'the place', 'the reason'],
    examples: [
      { en: 'I will never forget the day when we visited the museum.', zh: '我永远不会忘记我们参观博物馆的那一天。' },
      { en: 'This is the town where the old temple was found.', zh: '这就是发现古庙的那座小镇。' },
      { en: 'Nobody knows the reason why the ancient city disappeared.', zh: '没有人知道那座古城消失的原因。' },
    ],
    tips: [
      '判断方法：把先行词放回从句，能加介词（on that day / in the town）就用关系副词',
      '先行词是 point / situation / case 等表抽象地点的名词时，也用 where',
    ],
  },
  {
    id: 'relative-preposition',
    title: '“介词 + which / whom” 引导的限制性定语从句',
    tagline: '介词提前到关系代词之前：指物用 which，指人用 whom，介词不能与 whom/which 分开重复。',
    forms: [
      { label: '指物', detail: '先行词 + 介词 + which + 从句（the wall on which carvings were made）' },
      { label: '指人', detail: '先行词 + 介词 + whom + 从句（the expert from whom we learned a lot）' },
      { label: '复合结构', detail: '先行词 + 介词 + which/whose + 名词（the age in which… / the house whose roof…）' },
    ],
    usages: [
      '介词的选择取决于从句动词或形容词的固定搭配（learn from / be famous for）',
      '介词也可由先行词的习惯搭配决定（the day on which、the way in which）',
      '“介词 + which” 可替换 when / where / why 等关系副词，语气更正式',
    ],
    markers: ['on which', 'in which', 'from which', 'with which', 'of whom', 'for whom'],
    examples: [
      { en: 'The bridge over which we walked was built in the Ming Dynasty.', zh: '我们走过的那座桥建于明代。' },
      { en: 'The professor, from whom we learned a lot, will give a talk on heritage.', zh: '我们将从那位教授那里学到很多，他要作一个关于文化遗产的讲座。' },
      { en: 'This is the house in which the famous poet lived for ten years.', zh: '这就是那位著名诗人住过十年的房子。' },
    ],
    tips: [
      '介词提前后，关系代词只能用 which（物）或 whom（人），不能用 that 或 who',
      '固定短语中的介词一般不提前：look after the relics 不能写成 after which',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），语境取自 Unit 2 Cultural Heritage 主题 */
export const unit6Exercises: GrammarExercise[] = [
  {
    id: 'u6-g1',
    type: 'mcq',
    pointId: 'relative-adverbs',
    stem: 'The village ______ the ancient wall paintings were discovered lies in a deep valley.',
    options: ['which', 'that', 'where', 'who'],
    answerIndex: 2,
    explanation:
      '从句中不缺主语或宾语，缺的是地点状语（paintings were discovered in the village），先行词 village 表地点，故用关系副词 where。',
  },
  {
    id: 'u6-g2',
    type: 'mcq',
    pointId: 'relative-adverbs',
    stem: 'I still remember the summer ______ we helped repair the old temple on the mountain.',
    options: ['when', 'which', 'where', 'what'],
    answerIndex: 0,
    explanation:
      '先行词 summer 表时间，从句成分完整、只缺时间状语（we helped repair it in the summer），故用关系副词 when。',
  },
  {
    id: 'u6-g3',
    type: 'mcq',
    pointId: 'relative-adverbs',
    stem: 'Could you explain the reason ______ the committee turned down the proposal?',
    options: ['which', 'why', 'how', 'when'],
    answerIndex: 1,
    explanation:
      '先行词 reason 与从句 the committee turned down the proposal 之间缺原因状语，故用关系副词 why（= for which）。',
  },
  {
    id: 'u6-g4',
    type: 'mcq',
    pointId: 'relative-preposition',
    stem: 'The old bridge ______ the villagers walked every day was damaged by the flood.',
    options: ['across which', 'across that', 'which across', 'that across'],
    answerIndex: 0,
    explanation:
      '介词提前时关系代词指物只能用 which：walk across the bridge → across which；含介词时不能用 that。',
  },
  {
    id: 'u6-g5',
    type: 'mcq',
    pointId: 'relative-preposition',
    stem: 'The scientist ______ we heard the report has studied the caves for twenty years.',
    options: ['by whom', 'from whom', 'who from', 'that from'],
    answerIndex: 1,
    explanation:
      'hear the report from the scientist 中介词 from 提前，指人用 whom：from whom；介词不能后置到关系代词之后。',
  },
  {
    id: 'u6-g6',
    type: 'mcq',
    pointId: 'relative-preposition',
    stem: 'The Digital Age is an exhibition ______ visitors can see how relics are repaired.',
    options: ['in which', 'which', 'who', 'when'],
    answerIndex: 0,
    explanation:
      '先行词 exhibition 是抽象地点，可用 where 或“介词 + which”；四个选项中只有 in which（= where）符合。',
  },
  {
    id: 'u6-f1',
    type: 'fill',
    pointId: 'relative-adverbs',
    stem: 'The town ______ my grandfather was born is famous for its old stone houses. （填关系副词）',
    answer: 'where',
    explanation:
      '先行词 town 表地点，从句 was born 缺地点状语，填关系副词 where（= in which）。',
  },
  {
    id: 'u6-f2',
    type: 'fill',
    pointId: 'relative-adverbs',
    stem: '1972 was the year ______ the first team of experts arrived to study the temple. （填关系副词）',
    answer: 'when',
    explanation:
      '先行词 year 表时间，从句成分完整、缺时间状语，填关系副词 when（= in which）。',
  },
  {
    id: 'u6-f3',
    type: 'fill',
    pointId: 'relative-preposition',
    stem: 'The museum has a lab ______ rare paintings are carefully checked. （填“介词 + which”）',
    answer: 'in which',
    explanation:
      '先行词 lab 表地点，check paintings in the lab，介词 in 提前接 which，填 in which（相当于 where）。',
  },
  {
    id: 'u6-f4',
    type: 'fill',
    pointId: 'relative-preposition',
    stem: 'Ms Yang is the expert ______ the public can ask questions about heritage protection. （填“介词 + whom”）',
    answer: 'of whom',
    explanation:
      'ask questions of sb. 表示“向某人提问”，介词 of 提前，指人用 whom，填 of whom。',
  },
];

const pointById = new Map(unit6GrammarPoints.map((p) => [p.id, p]));

export function getGrammarPoint(id: string): GrammarPoint | undefined {
  return pointById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit6GrammarPoints, exercises: unit6Exercises };
