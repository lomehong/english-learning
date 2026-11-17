import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修三 Unit 4（Space Exploration）语法点：一般现在时的被动语态 / 现在完成时的被动语态 */

export const unit9GrammarPoints: GrammarPoint[] = [
  {
    id: 'present-simple-passive',
    title: '一般现在时的被动语态',
    tagline: '表示经常性、习惯性或客观事实的被动动作：主语是动作的承受者。',
    forms: [
      { label: '肯定', detail: '主语 + am / is / are + 过去分词' },
      { label: '否定', detail: '主语 + am / is / are not + 过去分词' },
      { label: '疑问', detail: 'Am / Is / Are + 主语 + 过去分词…?' },
    ],
    usages: [
      '表示经常性或习惯性的被动行为：The station is checked every week.',
      '陈述客观事实或普遍情况：Space food is specially prepared.',
      '强调动作的承受者，或不必说出执行者：The data is stored in the centre.',
      '需要说明执行者时用 by 引出：The satellite is controlled by the agency.',
    ],
    markers: ['is / are + done', 'every day', 'usually', 'often', 'by the agency', 'by scientists'],
    examples: [
      { en: 'The satellite is controlled by the space agency.', zh: '这颗卫星由航天局控制。' },
      { en: 'Rockets are usually launched in fine weather.', zh: '火箭通常在晴天发射。' },
      { en: 'The solar panels are cleaned by intelligent robots.', zh: '太阳能电池板由智能机器人清理。' },
    ],
    tips: [
      'be 动词随主语变化：单数用 is，复数用 are',
      '被动语态的动词一律用过去分词，不用原形或 -ing 形式',
      '不及物动词（happen, rise, take place）没有被动语态',
    ],
  },
  {
    id: 'u24-present-perfect-passive',
    title: '现在完成时的被动语态',
    tagline: '表示已经完成并对现在有影响的被动动作：has / have been + 过去分词。',
    forms: [
      { label: '肯定', detail: '主语 + has / have been + 过去分词' },
      { label: '否定', detail: '主语 + has / have not been + 过去分词' },
      { label: '疑问', detail: 'Has / Have + 主语 + been + 过去分词…?' },
    ],
    usages: [
      '动作已完成且结果影响现在：A new spacecraft has been sent to the Moon.',
      '常与 already, yet, just, so far, in recent years, since then 连用',
      '强调承受者而淡化执行者：More than fifty satellites have been launched.',
      '用于报道进展：The experiment has been finished on the station.',
    ],
    markers: ['has / have been done', 'already', 'so far', 'in recent years', 'since then', 'just'],
    examples: [
      { en: 'Many satellites have been sent into orbit since then.', zh: '从那时起，许多卫星已被送入轨道。' },
      { en: 'A new space laboratory has just been built.', zh: '一座新的空间实验室刚刚建成。' },
      { en: 'So far, six astronauts have been chosen for the mission.', zh: '到目前为止，已有六名宇航员入选这项任务。' },
    ],
    tips: [
      'has 用于第三人称单数，have 用于其他主语',
      'already 一般位于 has/have 与 been 之间：has already been done',
      '现在完成时的被动不能与具体的过去时间（in 2020）连用，此时用一般过去时的被动',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自必修三 Unit 4 Space Exploration */
export const unit9Exercises: GrammarExercise[] = [
  {
    id: 'u24-g1',
    type: 'mcq',
    pointId: 'present-simple-passive',
    stem: 'Rockets usually ______ from this centre in the early morning.',
    options: ['launch', 'are launched', 'have launched', 'launched'],
    answerIndex: 1,
    explanation:
      '主语 rockets 是“被发射”的对象，usually 表经常性，用一般现在时的被动语态 are launched，故选 B。',
  },
  {
    id: 'u24-g2',
    type: 'mcq',
    pointId: 'u24-present-perfect-passive',
    stem: 'So far, more than four hundred people ______ into space.',
    options: ['have been sent', 'have sent', 'are sent', 'were sending'],
    answerIndex: 0,
    explanation:
      '主语 people 是“被送入”太空的对象，so far 与现在完成时连用，用现在完成时的被动语态 have been sent，故选 A。',
  },
  {
    id: 'u24-g3',
    type: 'mcq',
    pointId: 'present-simple-passive',
    stem: 'The satellite signals ______ to the ground station twice a day.',
    options: ['send', 'sends', 'are sent', 'have sent'],
    answerIndex: 2,
    explanation:
      '信号是“被传送”的对象，twice a day 表经常性，复数主语用一般现在时的被动语态 are sent，故选 C。',
  },
  {
    id: 'u24-g4',
    type: 'mcq',
    pointId: 'u24-present-perfect-passive',
    stem: 'A new space suit ______ recently for the next mission.',
    options: ['has designed', 'has been designed', 'is designed', 'designed'],
    answerIndex: 1,
    explanation:
      '航天服是“被设计”的对象，recently 与现在完成时连用，单数主语用 has been designed，故选 B。',
  },
  {
    id: 'u24-g5',
    type: 'mcq',
    pointId: 'u24-present-perfect-passive',
    stem: 'The Moon ______ by human beings several times, but Mars only by robots.',
    options: ['has been visited', 'has visited', 'is visited', 'visits'],
    answerIndex: 0,
    explanation:
      '月球是“被访问”的对象，several times 表示到目前为止已完成的动作，用现在完成时的被动语态 has been visited，故选 A。',
  },
  {
    id: 'u24-g6',
    type: 'mcq',
    pointId: 'present-simple-passive',
    stem: 'Space food ______ specially so that it can be eaten in zero gravity.',
    options: ['prepares', 'prepared', 'is prepared', 'has prepared'],
    answerIndex: 2,
    explanation:
      '太空食品是“被专门制作”的对象，此处陈述一般情况，单数主语用一般现在时的被动语态 is prepared，故选 C。',
  },
  {
    id: 'u24-f1',
    type: 'fill',
    pointId: 'present-simple-passive',
    stem: 'Every year, many young people ______ ______ (admit) to the astronaut training centre.',
    answer: 'are admitted',
    explanation:
      '年轻人是“被录取”的对象，every year 表经常性，复数主语用一般现在时的被动语态，填 are admitted。',
  },
  {
    id: 'u24-f2',
    type: 'fill',
    pointId: 'u24-present-perfect-passive',
    stem: 'Since 2003, quite a few Chinese astronauts ______ ______ ______ (send) into space.',
    answer: 'have been sent',
    explanation:
      'since 2003 与现在完成时连用，astronauts 是“被送入”太空的对象，用现在完成时的被动语态，填 have been sent。',
  },
  {
    id: 'u24-f3',
    type: 'fill',
    pointId: 'present-simple-passive',
    stem: 'The used solar panels ______ ______ (recycle) to build new equipment every few years.',
    answer: 'are recycled',
    explanation:
      '电池板是“被回收”的对象，every few years 表经常性，复数主语用一般现在时的被动语态，填 are recycled。',
  },
  {
    id: 'u24-f4',
    type: 'fill',
    pointId: 'u24-present-perfect-passive',
    stem: 'So far, three space laboratories ______ ______ ______ (build) in orbit.',
    answer: 'have been built',
    explanation:
      'so far 与现在完成时连用，laboratories 是“被建造”的对象，复数主语用现在完成时的被动语态，填 have been built。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit9GrammarPoints, exercises: unit9Exercises };
