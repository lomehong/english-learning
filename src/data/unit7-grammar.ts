import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修二 Unit 2（Wildlife Protection）语法点：现在进行时的被动语态 / 一般现在时的被动语态 */

export const unit7GrammarPoints: GrammarPoint[] = [
  {
    id: 'present-continuous-passive',
    title: '现在进行时的被动语态',
    tagline: '表示此刻或现阶段正在被进行的动作：am / is / are + being + 过去分词。',
    forms: [
      { label: '肯定', detail: '主语 + am / is / are + being + 过去分词（+ by …）' },
      { label: '否定', detail: '主语 + am / is / are + not + being + 过去分词' },
      { label: '疑问', detail: 'Am / Is / Are + 主语 + being + 过去分词…?' },
    ],
    usages: [
      '表示说话时正在被进行的动作（The bridge is being repaired.）',
      '表示现阶段持续被进行的事，不一定此刻发生（The forests are being cut down.）',
      '强调动作的承受者，施动者不重要或未知时用 by 短语省略',
    ],
    markers: ['now', 'right now', 'at the moment', 'Look!', 'these days', 'currently'],
    examples: [
      { en: 'Look! The injured crane is being treated by the vets.', zh: '看！兽医们正在救治那只受伤的鹤。' },
      { en: 'The old nature reserve is being turned into a national park.', zh: '那个老保护区正在被建成国家公园。' },
      { en: 'Wetlands are not being protected well in some areas.', zh: '一些地区的湿地没有得到良好保护。' },
    ],
    tips: [
      'being 不能遗漏：is being done 才是进行被动，is done 是一般被动',
      '不及物动词（happen, rise 等）没有被动语态',
    ],
  },
  {
    id: 'simple-present-passive',
    title: '一般现在时的被动语态',
    tagline: '表示经常性、习惯性被进行的动作或客观现状：am / is / are + 过去分词。',
    forms: [
      { label: '肯定', detail: '主语 + am / is / are + 过去分词（+ by …）' },
      { label: '否定', detail: '主语 + am / is / are + not + 过去分词' },
      { label: '疑问', detail: 'Am / Is / Are + 主语 + 过去分词…?' },
    ],
    usages: [
      '表示客观事实或普遍现状（The species is listed as endangered.）',
      '表示按规定、法律经常发生的动作（Hunting is forbidden in the reserve.）',
      '主语是动作承受者且无需说明施动者时使用',
    ],
    markers: ['always', 'usually', 'often', 'every year', 'nowadays', 'by law'],
    examples: [
      { en: 'Every year thousands of trees are planted along the river.', zh: '每年河沿岸都种下数千棵树。' },
      { en: 'The antelope is protected by strict laws.', zh: '羚羊受到严格法律的保护。' },
      { en: 'Are wild horses trained to return to the grassland?', zh: '野马被训练重返草原吗？' },
    ],
    tips: [
      '被动语态中 be 动词要与主语保持人称和数的一致',
      '与现在进行时被动区分：经常性动作用 is done，正在进行用 is being done',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），语境取自 Unit 2 Wildlife Protection 主题 */
export const unit7Exercises: GrammarExercise[] = [
  {
    id: 'u7-g1',
    type: 'mcq',
    pointId: 'present-continuous-passive',
    stem: 'Listen! A new plan for the wildlife reserve ______ at the meeting right now.',
    options: ['is discussed', 'is being discussed', 'has discussed', 'discusses'],
    answerIndex: 1,
    explanation:
      '“right now” 表示此刻正在进行的动作，plan 与 discuss 是被动关系，用现在进行时的被动语态 is being discussed。',
  },
  {
    id: 'u7-g2',
    type: 'mcq',
    pointId: 'present-continuous-passive',
    stem: 'These days the old forest ______ down to make room for farms, which worries the scientists.',
    options: ['cuts', 'is cutting', 'is being cut', 'has been cut down now'],
    answerIndex: 2,
    explanation:
      '“these days” 表示现阶段持续发生的事，forest 与 cut down 是被动关系，用 is being cut；D 项结构杂糅且时态不符。',
  },
  {
    id: 'u7-g3',
    type: 'mcq',
    pointId: 'present-continuous-passive',
    stem: '— Where is the injured seal? — It ______ in the animal hospital.',
    options: ['is being looked after', 'looks after', 'looked after', 'is looking after'],
    answerIndex: 0,
    explanation:
      'seal 与 look after 是被动关系且表示此刻正在被照料，用 is being looked after；look after 是固定短语，被动语态不拆分介词。',
  },
  {
    id: 'u7-g4',
    type: 'mcq',
    pointId: 'simple-present-passive',
    stem: 'Hunting ______ in this nature reserve all year round.',
    options: ['forbids', 'is forbidden', 'is being forbidden', 'forbidden'],
    answerIndex: 1,
    explanation:
      '“all year round” 表示按规定长期存在的现状，hunting 与 forbid 是被动关系，用一般现在时的被动语态 is forbidden。',
  },
  {
    id: 'u7-g5',
    type: 'mcq',
    pointId: 'simple-present-passive',
    stem: 'The number of the tigers ______ by the rangers every winter.',
    options: ['records', 'recorded', 'is recorded', 'is being recording'],
    answerIndex: 2,
    explanation:
      '“every winter” 表示经常性动作，the number 与 record 是被动关系，用 is recorded；D 项 being 后接了现在分词，结构错误。',
  },
  {
    id: 'u7-g6',
    type: 'mcq',
    pointId: 'present-continuous-passive',
    stem: 'Look! The new wetland park ______ near the city, and it will open next year.',
    options: ['builds', 'is built', 'is being built', 'built'],
    answerIndex: 2,
    explanation:
      '“Look!” 提示动作此刻正在进行，park 与 build 是被动关系，用现在进行时的被动语态 is being built。',
  },
  {
    id: 'u7-f1',
    type: 'fill',
    pointId: 'present-continuous-passive',
    stem: 'Be quiet! The baby pandas ______ (feed) by the keepers at the moment.',
    answer: 'are being fed',
    explanation:
      '“at the moment” 提示此刻正在进行，pandas 与 feed 是被动关系，主语复数，填 are being fed。',
  },
  {
    id: 'u7-f2',
    type: 'fill',
    pointId: 'present-continuous-passive',
    stem: 'The river ______ (not / pollute) now because the factory has been closed.',
    answer: "isn't being polluted",
    acceptable: ['is not being polluted'],
    explanation:
      'now 提示现阶段，river 与 pollute 是被动关系，否定式在 is 后加 not，填 isn\u2019t being polluted。',
  },
  {
    id: 'u7-f3',
    type: 'fill',
    pointId: 'simple-present-passive',
    stem: 'Every spring the birds ______ (count) by volunteers in this forest.',
    answer: 'are counted',
    explanation:
      '“every spring” 表示经常性动作，birds 与 count 是被动关系，主语复数，填 are counted。',
  },
  {
    id: 'u7-f4',
    type: 'fill',
    pointId: 'simple-present-passive',
    stem: 'The rare plant ______ (list) as a protected species nowadays.',
    answer: 'is listed',
    explanation:
      '“nowadays” 表示客观现状，plant 与 list 是被动关系，主语单数，填 is listed。',
  },
];

const pointById = new Map(unit7GrammarPoints.map((p) => [p.id, p]));

export function getGrammarPoint(id: string): GrammarPoint | undefined {
  return pointById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit7GrammarPoints, exercises: unit7Exercises };
