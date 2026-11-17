import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修一 Unit 2（Travelling Around）语法点：现在完成时 / 过去进行时 */

export const unit2GrammarPoints: GrammarPoint[] = [
  {
    id: 'present-perfect',
    title: '现在完成时',
    tagline: '表示过去发生的动作对现在造成的影响或结果，或从过去一直持续到现在的动作或状态。',
    forms: [
      { label: '肯定', detail: '主语 + have / has + 过去分词' },
      { label: '否定', detail: '主语 + haven\u2019t / hasn\u2019t + 过去分词' },
      { label: '疑问', detail: 'Have / Has + 主语 + 过去分词…?' },
    ],
    usages: [
      '表示过去发生的动作对现在产生了影响或结果（动作已结束，后果仍在）',
      '表示过去开始并持续到现在（刚结束）的动作或状态，常与 for / since 引出的时间段连用',
      '表示到目前为止的经历或经验，常与 ever / never / before / twice 等连用',
    ],
    markers: ['already', 'yet', 'just', 'ever', 'never', 'before', 'so far', 'recently', 'for + 时间段', 'since + 时间点'],
    examples: [
      { en: 'I have just booked two train tickets to Xi\u2019an.', zh: '我刚订了两张去西安的火车票。' },
      { en: 'We have stayed in this flat since last Friday.', zh: '从上周五起我们就住在这套公寓里。' },
      { en: 'She has never applied for a visa before.', zh: '她以前从未申请过签证。' },
    ],
    tips: [
      'have been to 表示“去过（人已回来）”，have gone to 表示“去了（人不在原地）”，两者不可混用',
      '终止性动词（come / buy / die / join 等）不能与 for / since 引出的时间段连用：不说 He has come here for two days',
      '主语是第三人称单数时用 has，其余人称用 have；过去分词写法要与一般过去式区分（go → gone）',
    ],
  },
  {
    id: 'past-continuous',
    title: '过去进行时',
    tagline: '表示过去某一时刻或某一段时间正在进行的动作。',
    forms: [
      { label: '肯定', detail: '主语 + was / were + 动词-ing' },
      { label: '否定', detail: '主语 + was / were + not + 动词-ing' },
      { label: '疑问', detail: 'Was / Were + 主语 + 动词-ing…?' },
    ],
    usages: [
      '表示过去某一时刻正在进行的动作，常与 at six yesterday / at that time 等时间点连用',
      '表示过去某段时间内持续进行的动作，不一定是整段一直在做',
      '与 always 连用表示过去的反复（常带抱怨或赞叹的感情色彩）',
      'when 引出的短动作打断 while 引出的长动作：A was doing… when B did…',
    ],
    markers: ['at this time yesterday', 'at eight last night', 'at that moment', 'when…', 'while…', 'all morning'],
    examples: [
      { en: 'At eight yesterday evening, we were packing for the trip.', zh: '昨天晚上八点，我们正在为旅行收拾行李。' },
      { en: 'The guide was telling a story when the bus stopped.', zh: '大巴停下时，导游正在讲故事。' },
      { en: 'While Dad was booking tickets online, Mum was checking the map.', zh: '爸爸在网上订票时，妈妈在看地图。' },
    ],
    tips: [
      'be 动词用过去式：单数主语（I / he / she / it）用 was，复数主语（we / you / they）用 were',
      'while 通常连接两个同时进行的过去进行时动作；when 多引出一般过去时的短动作',
      '动词-ing 变化规则：直接加（read→reading）；去 e 加（make→making）；双写加（plan→planning）',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 2 Travelling Around */
export const unit2Exercises: GrammarExercise[] = [
  {
    id: 'u2-g1',
    type: 'mcq',
    pointId: 'present-perfect',
    stem: '— Where is Lucy? — She ______ to the travel office. She will be back in an hour.',
    options: ['has been', 'has gone', 'went', 'is going'],
    answerIndex: 1,
    explanation:
      '由答语“她一小时后回来”可知 Lucy 现在不在原地，应用 have gone to 表示“去了某地（人未回）”；she 后用 has，故选 has gone。has been to 表示“去过且已回来”，与语境矛盾。',
  },
  {
    id: 'u2-g2',
    type: 'mcq',
    pointId: 'present-perfect',
    stem: 'I ______ the old town of Lijiang twice. The narrow streets there are amazing!',
    options: ['have gone to', 'have been to', 'went to', 'am going to'],
    answerIndex: 1,
    explanation:
      '“去过某地（人已回来）”用 have been to；twice 表示到此为止的经历，与现在完成时连用，故选 have been to。A 项 have gone to 表示“去了未归”，C 项与 twice 的经历含义不搭。',
  },
  {
    id: 'u2-g3',
    type: 'mcq',
    pointId: 'present-perfect',
    stem: 'My uncle ______ in this tourist city since 2015, so he knows every famous site.',
    options: ['lived', 'lives', 'has lived', 'is living'],
    answerIndex: 2,
    explanation:
      '“since 2015” 表示从过去持续到现在的状态，用现在完成时；my uncle 是第三人称单数，助动词用 has，故选 has lived。',
  },
  {
    id: 'u2-g4',
    type: 'mcq',
    pointId: 'past-continuous',
    stem: 'When I walked past the booking office, the clerk ______ tickets for a tour group.',
    options: ['printed', 'was printing', 'has printed', 'prints'],
    answerIndex: 1,
    explanation:
      '“When I walked past…（当我走过时）” 表示过去某一时刻，此刻正在进行的动作用过去进行时；the clerk 是单数，be 动词用 was，故选 was printing。',
  },
  {
    id: 'u2-g5',
    type: 'mcq',
    pointId: 'past-continuous',
    stem: '— Did you watch the travel show last night? — No, at eight I ______ my suitcase for the trip.',
    options: ['pack', 'packed', 'have packed', 'was packing'],
    answerIndex: 3,
    explanation:
      '“at eight（昨晚八点）” 是过去的具体时刻，该时刻正在进行的动作用过去进行时；I 对应 was，故选 was packing。',
  },
  {
    id: 'u2-g6',
    type: 'mcq',
    pointId: 'past-continuous',
    stem: 'While my mother ______ train tickets online, my father was packing our suitcases.',
    options: ['was booking', 'booked', 'has booked', 'books'],
    answerIndex: 0,
    explanation:
      'while 连接两个同时进行的动作，主句用的是 was packing（过去进行时），while 从句也应保持过去进行时；my mother 是单数，用 was，故选 was booking。',
  },
  {
    id: 'u2-g7',
    type: 'fill',
    pointId: 'present-perfect',
    stem: 'We ______ (learn) English for more than eight years.',
    answer: 'have learned',
    acceptable: ['have learnt'],
    explanation:
      '“for more than eight years” 表示从过去持续到现在的动作，用现在完成时；we 后接 have；learn 的过去分词为 learned（英式亦作 learnt），填 have learned。',
  },
  {
    id: 'u2-g8',
    type: 'fill',
    pointId: 'present-perfect',
    stem: 'Tom ______ (not / visit) the Terracotta Warriors yet.',
    answer: "hasn't visited",
    acceptable: ['has not visited'],
    explanation:
      '“yet” 常与现在完成时否定式连用；Tom 是第三人称单数，否定用 hasn\u2019t 加过去分词；visit 为规则动词，填 hasn\u2019t visited。',
  },
  {
    id: 'u2-g9',
    type: 'fill',
    pointId: 'past-continuous',
    stem: 'At six o\u2019clock yesterday afternoon, the tourists ______ (wait) for the train to Xi\u2019an.',
    answer: 'were waiting',
    explanation:
      '“At six o\u2019clock yesterday afternoon” 是过去的具体时刻，该时刻正在进行的动作用过去进行时；the tourists 为复数，be 动词用 were，填 were waiting。',
  },
  {
    id: 'u2-g10',
    type: 'fill',
    pointId: 'past-continuous',
    stem: 'Last night I ______ (admire) the view from the plane when it started to rain.',
    answer: 'was admiring',
    explanation:
      'when 引出的短动作（started）打断正在进行的长动作，长动作用过去进行时；主语 I 对应 was；admire 直接加 -ing，填 was admiring。',
  },
];
