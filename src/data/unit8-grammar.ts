import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修三 Unit 3（Diverse Cultures）语法点：主谓一致（语法一致与意义一致 / 就近原则） */

export const unit8GrammarPoints: GrammarPoint[] = [
  {
    id: 'sva-grammatical',
    title: '主谓一致：语法一致与意义一致',
    tagline: '谓语动词在人称和数上与主语保持一致：先看形式，再看意义。',
    forms: [
      { label: '语法一致', detail: '单数主语 + 单数谓语；复数主语 + 复数谓语' },
      { label: 'and 连接', detail: 'A and B + 复数谓语；同一人/物（一个冠词）+ 单数谓语' },
      { label: '意义一致', detail: '时间/金钱/距离等总量视为整体 + 单数谓语' },
    ],
    usages: [
      'and 连接两个不同主语时谓语用复数；指同一人或同一事物（后一个无冠词）时用单数',
      'family, class, team 等集体名词：强调整体用单数，强调成员用复数',
      '时间、金钱、距离、重量的总量作主语时看作一个整体，谓语用单数',
      'each / every / either / neither + 单数名词作主语时，谓语用单数；every… and every… 亦然',
      'the number of + 复数名词作主语，谓语用单数；a number of + 复数名词，谓语用复数',
    ],
    markers: ['and', 'every … and every …', 'each of', 'Ten years / Twenty dollars', 'The number of'],
    examples: [
      { en: 'Every culture and every festival has its own story.', zh: '每种文化和每个节日都有自己的故事。' },
      { en: 'Twenty dollars is enough for the museum tickets.', zh: '二十美元足够买博物馆门票了。' },
      { en: 'The number of immigrant families is growing quickly.', zh: '移民家庭的数量增长很快。' },
    ],
    tips: [
      'the number of… 作主语谓语用单数，a number of…（许多）谓语用复数，二者勿混',
      '并列表单一概念时用单数：The singer and dancer is my aunt.（歌手兼舞者是同一人）',
      '学科名以 -s 结尾（physics, maths）仍作单数看待',
    ],
  },
  {
    id: 'sva-proximity',
    title: '主谓一致：就近原则',
    tagline: '谓语动词与离它最近的主语保持人称和数的一致。',
    forms: [
      { label: 'or / nor', detail: 'A or B / Neither A nor B + 与 B 一致的谓语' },
      { label: 'either … or', detail: 'Either A or B + 与 B 一致的谓语' },
      { label: 'not only … but also', detail: 'Not only A but also B + 与 B 一致的谓语' },
      { label: 'There be', detail: 'There be + 与最近的主语一致的动词' },
    ],
    usages: [
      'or, nor, either…or, neither…nor, not only…but also 连接并列主语时，谓语与最近的主语一致',
      'There be 句型遵循就近原则：There is a museum and two markets here.',
      '疑问句中助动词也与最近的主语一致：Is either your sister or your brothers coming?',
      '就远/就近易混：as well as, with, together with 连接主语时谓语与前面的主语一致（不受后面影响）',
    ],
    markers: ['or', 'either … or', 'neither … nor', 'not only … but also', 'There be'],
    examples: [
      { en: 'Neither the visitors nor the guide was satisfied with the plan.', zh: '游客们和导游都不满意这个方案。' },
      { en: 'Not only the food but also the music is amazing in this district.', zh: '这个街区不仅美食出色，音乐也棒极了。' },
      { en: 'There is a folk market and several snack bars downtown.', zh: '市中心有一个民俗集市和几家小吃店。' },
    ],
    tips: [
      '就近原则只看最近的主语，不看并列的另一部分',
      'with / as well as / together with 不触发就近原则，谓语与其前面的主语一致',
      'neither…nor 连接的两个主语都参与否定，但谓语只与后者一致',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自必修三 Unit 3 Diverse Cultures */
export const unit8Exercises: GrammarExercise[] = [
  {
    id: 'u8-g1',
    type: 'mcq',
    pointId: 'sva-proximity',
    stem: 'Neither the visitors nor the guide ______ satisfied with the crowded market.',
    options: ['was', 'were', 'have been', 'are'],
    answerIndex: 0,
    explanation:
      'neither … nor 连接并列主语时谓语与最近的主语 the guide（单数）一致，且语境为过去，故选 A。',
  },
  {
    id: 'u8-g2',
    type: 'mcq',
    pointId: 'sva-grammatical',
    stem: 'Every student and every teacher ______ invited to the international culture festival.',
    options: ['are', 'is', 'have been', 'were'],
    answerIndex: 1,
    explanation:
      'every … and every … 连接并列单数主语时，谓语动词用单数，故选 B。',
  },
  {
    id: 'u8-g3',
    type: 'mcq',
    pointId: 'sva-grammatical',
    stem: 'Twenty kilometres ______ not a short distance for young children to walk.',
    options: ['are', 'is', 'were', 'have been'],
    answerIndex: 1,
    explanation:
      '距离总量作主语时视为一个整体，谓语动词用单数，故选 B。',
  },
  {
    id: 'u8-g4',
    type: 'mcq',
    pointId: 'sva-proximity',
    stem: 'Not only the jazz band but also the folk singers ______ performing in the square tonight.',
    options: ['is', 'was', 'are', 'has been'],
    answerIndex: 2,
    explanation:
      'not only … but also 连接并列主语时谓语与最近的主语 the folk singers（复数）一致，故选 C。',
  },
  {
    id: 'u8-g5',
    type: 'mcq',
    pointId: 'sva-grammatical',
    stem: 'The number of immigrant families in this district ______ growing every year.',
    options: ['are', 'is', 'have been', 'were'],
    answerIndex: 1,
    explanation:
      'the number of …（……的数量）作主语时谓语动词用单数，故选 B；a number of … 才用复数。',
  },
  {
    id: 'u8-g6',
    type: 'mcq',
    pointId: 'sva-proximity',
    stem: 'Either the students or their teacher ______ going to accept the award on the stage.',
    options: ['are', 'is', 'am', 'were'],
    answerIndex: 1,
    explanation:
      'either … or 连接并列主语时谓语与最近的主语 their teacher（单数）一致，故选 B。',
  },
  {
    id: 'u8-f1',
    type: 'fill',
    pointId: 'sva-grammatical',
    stem: 'Both the museum and the old church ______ (be) worth visiting in the historical district.',
    answer: 'are',
    explanation:
      'both … and 连接两个不同主语，谓语动词用复数，填 are。',
  },
  {
    id: 'u8-f2',
    type: 'fill',
    pointId: 'sva-grammatical',
    stem: 'Each of the immigrants ______ (have) a moving story to tell about the new land.',
    answer: 'has',
    explanation:
      'each of + 复数名词作主语，强调个体，谓语动词用单数，填 has。',
  },
  {
    id: 'u8-f3',
    type: 'fill',
    pointId: 'sva-proximity',
    stem: 'There ______ (be) a folk market and several snack bars in the downtown district.',
    answer: 'is',
    explanation:
      'There be 句型遵循就近原则，与最近的主语 a folk market（单数）一致，填 is。',
  },
  {
    id: 'u8-f4',
    type: 'fill',
    pointId: 'sva-grammatical',
    stem: 'Physics ______ (be) my favourite subject because we learn how the world works.',
    answer: 'is',
    explanation:
      '学科名 physics 以 -s 结尾，但意义上是单数，谓语动词用单数，填 is。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit8GrammarPoints, exercises: unit8Exercises };
