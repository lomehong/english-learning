import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修二 Unit 4（Journey Across a Vast Land）语法点：现在完成进行时 + 含情态动词的被动语态 */

export const unit14GrammarPoints: GrammarPoint[] = [
  {
    id: 'present-perfect-progressive',
    title: '现在完成进行时（have / has been doing）',
    tagline: '从过去开始一直持续到现在的动作（常仍将继续）：强调“一直在做”，常与 for / since 及 all day 等时间状语连用。',
    forms: [
      { label: '肯定句', detail: '主语 + have/has been doing：We have been travelling along the old rail line since Monday.' },
      { label: '否定句', detail: '主语 + have/has not been doing：It has not been raining during the whole journey.' },
      { label: '疑问句', detail: 'Have/Has + 主语 + been doing?：Have you been waiting for the train long?' },
      { label: '时间标志', detail: 'since + 起点 / for + 时间段 / all day / recently / these days' },
    ],
    usages: [
      '表示动作从过去某一时刻开始，持续到现在，可能刚刚停止，也可能继续下去',
      '常与 since（自某时起）、for（长达一段时间）、all day、recently 等时间状语连用',
      '与现在完成时的区别：完成进行时强调动作的持续与进行，完成时强调动作的完成或结果',
      '延续性动词（travel / wait / wander / work / learn）常用完成进行时；瞬间动词一般不用进行体',
      '谓语由 have/has been + 现在分词构成，主语第三人称单数用 has',
    ],
    markers: ['have/has been doing', 'since + 过去时间点', 'for + 时间段', 'all day / all the way', 'recently / these days'],
    examples: [
      { en: 'The two friends have been chatting about the journey since the train left Vancouver.', zh: '自从火车离开温哥华，两位朋友一直在聊这次旅行。' },
      { en: 'We have been wandering around the urban market for three hours.', zh: '我们已经在这座城市集市里逛了三个小时了。' },
      { en: 'The photographer has been waiting at the bay since dawn.', zh: '摄影师从黎明起就一直在海湾边等候。' },
    ],
    tips: [
      '强调“看得见的劳累 / 痕迹”时用完成进行时更自然：He looks tired because he has been driving all day.',
      '状态动词（know / believe / own）一般不用完成进行时，用现在完成时',
      '注意 since 后接过去时间点或一般过去时从句，for 后接时间段，两者不可混用',
    ],
  },
  {
    id: 'modal-passive',
    title: '含情态动词的被动语态',
    tagline: '情态动词 + be + 过去分词：can / may / must / should 等后接被动式，说明“能够被 / 必须被 / 应该被”。',
    forms: [
      { label: '肯定句', detail: '主语 + 情态动词 + be + done：The departure time can be seen on the screen.' },
      { label: '否定句', detail: '主语 + 情态动词 + not + be + done：Wild animals should not be disturbed.' },
      { label: '疑问句', detail: '情态动词 + 主语 + be + done?：Must the tickets be booked in advance?' },
      { label: '含短语动词', detail: '短语动词的介词/副词不可拆分：The old carriage should be taken care of.' },
    ],
    usages: [
      '结构为“情态动词 + be + 及物动词的过去分词”，be 用原形，不随主语变化',
      '强调规则的告示、说明常用此结构：Photographs cannot be taken in the museum.',
      '否定式直接在情态动词后加 not；疑问式把情态动词提到主语之前',
      '含有情态动词的被动句变主动句时，宾语变主语，被动式还原为“情态动词 + do”',
    ],
    markers: ['can/could be done', 'may/might be done', 'must be done', 'should be done', 'cannot be done'],
    examples: [
      { en: 'The antique clocks in the museum cannot be photographed without permission.', zh: '未经许可不得拍摄博物馆里的古董钟。' },
      { en: 'The departure time must be checked before the long journey.', zh: '长途旅行前必须核对发车时间。' },
      { en: 'Tickets for the night train should be booked in advance.', zh: '夜车车票应该提前预订。' },
    ],
    tips: [
      '情态动词后必须接动词原形 be，不能说 can been done 或 can being done',
      '不及物动词（arrive / happen / rise）没有被动语态，不能误用',
      'need / want 表“需要被……”时可接 doing 主动形式表被动：The carriage needs cleaning.',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 4 Journey Across a Vast Land */
export const unit14Exercises: GrammarExercise[] = [
  {
    id: 'u14-g1',
    type: 'mcq',
    pointId: 'present-perfect-progressive',
    stem: 'We ______ along the old rail line since Monday, and the views are breathtaking.',
    options: ['have travelled', 'have been travelling', 'travelled', 'travel'],
    answerIndex: 1,
    explanation:
      'since Monday 表示从过去持续至今的动作，强调“一直在旅行”，应用现在完成进行时 have been travelling，故选 B；一般过去时与一般现在时均不能与 since 时间段搭配表持续。',
  },
  {
    id: 'u14-g2',
    type: 'mcq',
    pointId: 'present-perfect-progressive',
    stem: 'The wildlife photographer looks tired because he ______ for deer at dusk all day.',
    options: ['waits', 'waited', 'has been waiting', 'will wait'],
    answerIndex: 2,
    explanation:
      'all day 表示从早持续到现在的动作，且句中“看起来累”正是该动作的结果，应用现在完成进行时 has been waiting，故选 C。',
  },
  {
    id: 'u14-g3',
    type: 'mcq',
    pointId: 'modal-passive',
    stem: 'The spectacular waterfalls ______ from the observation tower on clear days.',
    options: ['can see', 'can be seen', 'can been seen', 'can seeing'],
    answerIndex: 1,
    explanation:
      '主语 the spectacular waterfalls 与 see 是被动关系（瀑布“被看到”），含情态动词的被动语态为 can be seen，故选 B；can been seen 与 can seeing 结构错误，can see 为主动式。',
  },
  {
    id: 'u14-g4',
    type: 'mcq',
    pointId: 'modal-passive',
    stem: 'The departure time of the night train ______ on the screen at the station.',
    options: ['can see', 'can be seen', 'can been seen', 'can saw'],
    answerIndex: 1,
    explanation:
      'departure time 与 see 是被动关系（发车时间“被看到”），应用 can be seen，故选 B；其余选项均不符合“情态动词 + be + 过去分词”的结构。',
  },
  {
    id: 'u14-g5',
    type: 'mcq',
    pointId: 'modal-passive',
    stem: 'This ancient map ______ with clean gloves in the library.',
    options: ['must handle', 'must be handled', 'must been handled', 'must being handled'],
    answerIndex: 1,
    explanation:
      'map 与 handle 是被动关系（地图“被拿取/处理”），含情态动词 must 的被动式为 must be handled，故选 B；must been / being handled 结构错误。',
  },
  {
    id: 'u14-g6',
    type: 'mcq',
    pointId: 'modal-passive',
    stem: 'Wild animals ______ with flash photography inside the national park.',
    options: ['should not disturb', 'should not be disturbed', 'should not been disturbed', 'should not disturbing'],
    answerIndex: 1,
    explanation:
      'wild animals 与 disturb 是被动关系（动物“被打扰”），否定的情态被动式为 should not be disturbed，故选 B；A 项为主动式，与句意矛盾。',
  },
  {
    id: 'u14-f1',
    type: 'fill',
    pointId: 'present-perfect-progressive',
    stem: 'The two friends ______ about their journey since the train left the station.（用 chat 的适当形式填空）',
    answer: 'have been chatting',
    explanation:
      'since 引导的时间状语表示动作从过去持续到现在，强调“一直在聊”，应用现在完成进行时 have been chatting。',
  },
  {
    id: 'u14-f2',
    type: 'fill',
    pointId: 'present-perfect-progressive',
    stem: 'We ______ around the urban market for three hours, but we still do not want to stop.（用 wander 的适当形式填空）',
    answer: 'have been wandering',
    explanation:
      'for three hours 表持续时间段，且“现在还不想停”说明动作仍在继续，应用现在完成进行时 have been wandering。',
  },
  {
    id: 'u14-f3',
    type: 'fill',
    pointId: 'modal-passive',
    stem: 'The tickets for the night train ______ in advance during the travel season.（用 must book 的适当语态填空）',
    answer: 'must be booked',
    explanation:
      'tickets 与 book 是被动关系（票“被预订”），含情态动词 must 的被动语态为 must be booked。',
  },
  {
    id: 'u14-f4',
    type: 'fill',
    pointId: 'modal-passive',
    stem: 'The old station ______ by tourists from all over the world.（用 can visit 的适当语态填空）',
    answer: 'can be visited',
    explanation:
      'the old station 与 visit 是被动关系（车站“被参观”），含情态动词 can 的被动语态为 can be visited。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit14GrammarPoints, exercises: unit14Exercises };
