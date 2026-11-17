import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修四 Unit 2（Iconic Attractions）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 2 词表），避免任何教材原文版权问题。
 */

export const unit12Passages: ReadingPassage[] = [
  {
    id: 'u32-p1',
    title: 'A Week on the Green Island',
    genre: '记叙文',
    paragraphs: [
      'Our plane landed in the hills, where a temperate wind greeted us instead of summer heat. The guide explained that although the island lies close to the equator, the high mountains keep the air cool and fresh all year.',
      'On the second day we walked through a tropical forest. The guide, a farmer\u2019s son who once worked as a butcher in town, named every herb we passed. Later, we hired a kayak and slid across a bay so clear that we could watch the fish without leaving the boat.',
      'The most iconic sight came at dusk. Hundreds of little turtles hatched on the sand and raced towards the sea, and we stood still until the last reptile disappeared into the waves. No camera could hold such a moment; we could only carry it home in our hearts.',
    ],
    glossary: [
      { wordId: 'temperate', forms: ['temperate'] },
      { wordId: 'equator', forms: ['equator'] },
      { wordId: 'tropical', forms: ['tropical'] },
      { wordId: 'butcher', forms: ['butcher'] },
      { wordId: 'herb', forms: ['herb'] },
      { wordId: 'kayak', forms: ['kayak'] },
      { wordId: 'iconic', forms: ['iconic'] },
      { wordId: 'hatch', forms: ['hatched'] },
      { wordId: 'reptile', forms: ['reptile'] },
    ],
    questions: [
      {
        id: 'u32-r1-1',
        type: 'detail',
        stem: 'Why is the air on the island cool although it lies close to the equator?',
        options: [
          'Because of the high mountains.',
          'Because of the cold sea currents.',
          'Because it rains every afternoon.',
          'Because of the thick city walls.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "the high mountains keep the air cool and fresh" 可知是高山使气温凉爽，故选 A；B、C、D 文中均未提及。',
      },
      {
        id: 'u32-r1-2',
        type: 'detail',
        stem: 'What do we know about the guide from Paragraph 2?',
        options: [
          'He once worked as a butcher in town.',
          'He was born on the mainland.',
          'He refused to enter the forest.',
          'He sold herbs to the visitors.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "a farmer\u2019s son who once worked as a butcher in town" 可知他曾在镇上做过肉商，故选 A；其余选项无依据或与原文相反。',
      },
      {
        id: 'u32-r1-3',
        type: 'inference',
        stem: 'How did the writer probably feel about the turtles at dusk?',
        options: [
          'Deeply moved by the scene.',
          'Bored by the slow animals.',
          'Afraid of the dark beach.',
          'Worried about the missing guide.',
        ],
        answerIndex: 0,
        explanation:
          '由末段 "No camera could hold such a moment; we could only carry it home in our hearts" 可推知作者深受触动，故选 A；B、C、D 与文中情感基调不符。',
      },
    ],
  },
  {
    id: 'u32-p2',
    title: 'Welcome to the Harbour City',
    genre: '应用文 · 城市旅游指南',
    paragraphs: [
      'The harbour is the most iconic attraction of this city. On its shore stands the white dome of the Opera House, which has become an icon of the whole country. The building is located on a point that was once the foundation of an old fort, and its roof shines like sails in the sun.',
      'A short ferry ride away, the great bridge carries walkers and cyclists across the strait. On weekends the state premier opens community events along the water, from street theatre to seaside barbecue parties, and the smell of grilled food mixes with the salt of the sea.',
      'Wildlife adds its own colour. Koalas sleep in nearby parks, and colourful birds visit hotel balconies at breakfast. Scientists study the distribution of these animals to protect their habitat, and visitors are asked to watch quietly from a distance.',
    ],
    glossary: [
      { wordId: 'iconic', forms: ['iconic'] },
      { wordId: 'dome', forms: ['dome'] },
      { wordId: 'icon', forms: ['icon'] },
      { wordId: 'locate', forms: ['located'] },
      { wordId: 'foundation', forms: ['foundation'] },
      { wordId: 'strait', forms: ['strait'] },
      { wordId: 'premier', forms: ['premier'] },
      { wordId: 'barbecue', forms: ['barbecue'] },
      { wordId: 'distribution', forms: ['distribution'] },
    ],
    questions: [
      {
        id: 'u32-r2-1',
        type: 'detail',
        stem: 'Where is the Opera House located according to the passage?',
        options: [
          'On a point that was once an old fort\u2019s foundation.',
          'At the top of a high mountain.',
          'In the middle of the great bridge.',
          'On a small boat in the strait.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "located on a point that was once the foundation of an old fort" 可知歌剧院建在旧要塞地基所在的岬角上，故选 A。',
      },
      {
        id: 'u32-r2-2',
        type: 'detail',
        stem: 'What do scientists study about the animals near the city?',
        options: [
          'Their distribution, in order to protect their habitat.',
          'The price of tickets to watch them.',
          'The colour of the birds\u2019 feathers.',
          'The food sold at the barbecue parties.',
        ],
        answerIndex: 0,
        explanation:
          '由第三段 "Scientists study the distribution of these animals to protect their habitat" 可知科学家研究动物分布以保护栖息地，故选 A。',
      },
      {
        id: 'u32-r2-3',
        type: 'main-idea',
        stem: 'What is the passage mainly about?',
        options: [
          'An introduction to a harbour city\u2019s iconic sights.',
          'A lesson on how bridges are built.',
          'The life of a state premier.',
          'The history of an old fort.',
        ],
        answerIndex: 0,
        explanation:
          '全文从歌剧院、大桥写到周末活动与野生动物，是围绕港口城市标志性景点的整体介绍，故选 A；B、C、D 均为局部细节或未展开。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit12Passages;
