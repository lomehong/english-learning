import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修一 Unit 4（Natural Disasters）语法点：过去完成时 / 一般过去时的被动语态 */

export const unit4GrammarPoints: GrammarPoint[] = [
  {
    id: 'past-perfect',
    title: '过去完成时',
    tagline: '表示过去某一动作或时间之前已经发生或完成的动作（“过去的过去”）。',
    forms: [
      { label: '肯定', detail: '主语 + had + 过去分词' },
      { label: '否定', detail: '主语 + had not (hadn\u2019t) + 过去分词' },
      { label: '疑问', detail: 'Had + 主语 + 过去分词…?' },
    ],
    usages: [
      '表示在过去某一时刻或动作之前已完成的动作，常与 by the time / before / when 连用',
      '叙述灾害、故事时交代背景：先发生的事用过去完成时，后发生的事用一般过去时',
      '与 for / since 连用，表示到过去某一时间为止持续了多久',
    ],
    markers: ['by the time', 'before', 'when', 'by + 过去时间点', 'already', 'by then'],
    examples: [
      { en: 'By the time the rescue team arrived, most villagers had left the village.', zh: '救援队到达时，大多数村民已经离开了村子。' },
      { en: 'When we got to the shelter, the storm had already stopped.', zh: '我们到达避难所时，暴风雨已经停了。' },
      { en: 'She told me that she had survived three floods.', zh: '她告诉我她经历过三次洪水都幸存了下来。' },
    ],
    tips: [
      '过去完成时不能单独使用，必须以过去某一时间或动作为参照（“过去的过去”）',
      'had 与所有人称一致：I/He/They had left，不随主语变化',
      '先发生 → had done，后发生 → did：不说 when the team arrived the villagers left before，要说 the villagers had left before the team arrived',
    ],
  },
  {
    id: 'past-passive',
    title: '一般过去时的被动语态',
    tagline: '表示过去发生的被动动作：主语是动作的承受者（was/were + 过去分词）。',
    forms: [
      { label: '肯定', detail: '主语 + was / were + 过去分词' },
      { label: '否定', detail: '主语 + was / were not + 过去分词' },
      { label: '疑问', detail: 'Was / Were + 主语 + 过去分词…?' },
    ],
    usages: [
      '强调动作的承受者（受灾的对象）：The city was destroyed in the earthquake.',
      '不知道或不必说出动作的执行者：The road was repaired last week.',
      '报道灾害事件常用被动语态，突出“发生了什么”而不是“谁做的”',
    ],
    markers: ['was / were + done', 'in 2020', 'last night', 'by the rescue team', 'in the earthquake'],
    examples: [
      { en: 'Thousands of houses were destroyed by the flood.', zh: '数千栋房屋被洪水摧毁了。' },
      { en: 'The injured people were sent to hospital at once.', zh: '伤员立刻被送去了医院。' },
      { en: 'A safe route was found by the local guide.', zh: '一条安全的路线由当地向导找到了。' },
    ],
    tips: [
      'be 动词随主语变化：单数 / 不可数用 was，复数用 were',
      '被动语态不能再沿用原动词的过去式：不说 was destroyed 的主动误写 was destroy',
      '需要说明执行者时用 by 引出：The village was flooded by the heavy rain.',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 4 Natural Disasters */
export const unit4Exercises: GrammarExercise[] = [
  {
    id: 'u4-g1',
    type: 'mcq',
    pointId: 'past-perfect',
    stem: 'By the time the rescue team arrived at the village, most villagers ______ to a safe place.',
    options: ['had moved', 'have moved', 'moved', 'were moving'],
    answerIndex: 0,
    explanation:
      '“by the time + 一般过去时” 表示“到过去某一时刻为止”，先完成的动作用过去完成时 had moved，故选 A。',
  },
  {
    id: 'u4-g2',
    type: 'mcq',
    pointId: 'past-passive',
    stem: 'The bridge ______ by the flood last summer, and it cost millions to rebuild it.',
    options: ['destroyed', 'was destroyed', 'has destroyed', 'is destroyed'],
    answerIndex: 1,
    explanation:
      '主语 the bridge 是动作 destroy 的承受者，且时间状语 last summer 表过去，用一般过去时的被动语态 was destroyed，故选 B。',
  },
  {
    id: 'u4-g3',
    type: 'mcq',
    pointId: 'past-perfect',
    stem: 'When we reached the shelter, we were shocked to find that the storm ______ .',
    options: ['stops', 'has stopped', 'had stopped', 'was stopping'],
    answerIndex: 2,
    explanation:
      '“到达避难所”（一般过去时）之前暴风雨“已经停止”，先于过去发生的动作用过去完成时 had stopped，故选 C。',
  },
  {
    id: 'u4-g4',
    type: 'mcq',
    pointId: 'past-passive',
    stem: 'All the victims ______ to hospital as soon as the road was cleared.',
    options: ['sent', 'were sent', 'are sent', 'had sent'],
    answerIndex: 1,
    explanation:
      '主语 all the victims 是“被送往”医院的对象，句子叙述过去发生的事，复数主语用 were sent，故选 B。',
  },
  {
    id: 'u4-g5',
    type: 'mcq',
    pointId: 'past-passive',
    stem: 'The old temple in the mountains ______ in the earthquake and now only ruins remain.',
    options: ['was damaged', 'damaged', 'was damaging', 'is damaging'],
    answerIndex: 0,
    explanation:
      '寺庙是“被损坏”的对象，需用被动语态；时间指地震（过去），单数主语用 was damaged，故选 A。',
  },
  {
    id: 'u4-g6',
    type: 'mcq',
    pointId: 'past-perfect',
    stem: 'She said she ______ first aid training before she became a volunteer rescuer.',
    options: ['will have', 'has had', 'had had', 'was having'],
    answerIndex: 2,
    explanation:
      '主句 said 是过去时，参加急救培训发生在“说”之前，即“过去的过去”，用过去完成时 had had（第一个 had 是助动词，第二个是实义动词“参加/接受”），故选 C。',
  },
  {
    id: 'u4-f1',
    type: 'fill',
    pointId: 'past-perfect',
    stem: 'When the firefighters came, the family ______ already ______ (leave) the burning building.',
    answer: 'had left',
    explanation:
      '消防员到来（过去时）之前，一家人“已经离开”，先发生的动作用过去完成式；already 放在 had 与过去分词之间，填 had left。',
  },
  {
    id: 'u4-f2',
    type: 'fill',
    pointId: 'past-passive',
    stem: 'Many roads ______ ______ (sweep) away by the flood, so the village was cut off.',
    answer: 'were swept',
    explanation:
      '主语 many roads 是“被冲走”的对象，句子叙述过去的事，复数主语用 were swept；sweep 的过去分词为 swept，填 were swept。',
  },
  {
    id: 'u4-f3',
    type: 'fill',
    pointId: 'past-passive',
    stem: 'A temporary shelter ______ ______ (set) up near the school for the homeless villagers.',
    answer: 'was set',
    explanation:
      '避难所是“被搭建”的对象，动作发生在过去，单数主语用 was set（set up 的被动形式），填 was set。',
  },
  {
    id: 'u4-f4',
    type: 'fill',
    pointId: 'past-perfect',
    stem: 'By the time the reporter arrived, people ______ (unite) to clean up the street.',
    answer: 'had united',
    explanation:
      '“by the time + 一般过去时” 提示动作在其之前已完成，动词 unite 用过去完成式 had united。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit4GrammarPoints, exercises: unit4Exercises };
