import type { ReadingPassage } from '../types';

/**
 * 人教2019必修三 Unit 1（Festivals and Celebrations）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 6 词表），避免任何教材原文版权问题。
 */

export const unit6Passages: ReadingPassage[] = [
  {
    id: 'u21-p1',
    title: 'The Lantern Festival Night',
    genre: '记叙文',
    paragraphs: [
      'On the fifteenth day of the first lunar month, Li Mei\u2019s family gathered at her grandparents\u2019 home to celebrate the Lantern Festival. Red lanterns hung in every window, and the children carried paper lanterns shaped like rabbits and fish through the yard, laughing all the way.',
      'After dinner, Grandpa told the children about the origin of the festival. \u201cMore than two thousand years ago,\u201d he said, \u201cpeople lit lanterns to pray for good luck. Some customs even had a religious meaning, but for farmers, this night was also a celebration of the coming spring.\u201d Then the whole family went out to guess the riddles written on the colourful lanterns.',
      'At nine o\u2019clock, fireworks lit up the sky above the river, and everyone cheered. \u201cEating sweet dumplings and watching lanterns \u2014 this is what a typical Lantern Festival is like,\u201d said Grandma with a smile. Li Mei felt grateful for the warmth of her family. However busy people are, they always try to come home for this charming night.',
    ],
    glossary: [
      { wordId: 'lantern', forms: ['lanterns', 'Lantern'] },
      { wordId: 'gather', forms: ['gathered'] },
      { wordId: 'origin', forms: ['origin'] },
      { wordId: 'religious', forms: ['religious'] },
      { wordId: 'riddle', forms: ['riddles'] },
      { wordId: 'firework', forms: ['fireworks'] },
      { wordId: 'typical', forms: ['typical'] },
      { wordId: 'grateful', forms: ['grateful'] },
      { wordId: 'charm', forms: ['charming'] },
    ],
    questions: [
      {
        id: 'u21-r1-1',
        type: 'detail',
        stem: 'What did the children do in the yard?',
        options: [
          'They carried paper lanterns.',
          'They set off fireworks by the river.',
          'They cooked sweet dumplings for dinner.',
          'They watched a parade in the street.',
        ],
        answerIndex: 0,
        explanation:
          '由首段 "the children carried paper lanterns shaped like rabbits and fish through the yard" 可知孩子们提着纸灯笼玩耍，故选 A；烟花是在河边观看的，C、D 未提及。',
      },
      {
        id: 'u21-r1-2',
        type: 'detail',
        stem: 'What did Grandpa say about the festival\u2019s origin?',
        options: [
          'It began as a feast only for farmers.',
          'People first lit lanterns to pray for good luck.',
          'It started two hundred years ago as a religious ceremony.',
          'It was created to celebrate the coming harvest.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "people lit lanterns to pray for good luck" 可知节日起源于点灯祈福，且距今两千多年，故选 B；C 的时间错误，原文说 two thousand years ago。',
      },
      {
        id: 'u21-r1-3',
        type: 'inference',
        stem: 'What can we infer about Li Mei at the end of the story?',
        options: [
          'She thought the festival had become too commercial.',
          'She found the riddles too difficult to guess.',
          'She felt the warmth of being with her family.',
          'She preferred fireworks to sweet dumplings.',
        ],
        answerIndex: 2,
        explanation:
          '末段 "Li Mei felt grateful for the warmth of her family" 表明她为家人团聚的温暖心怀感激，可推知选 C；A 是第二单元册别无关内容，文中未体现，B、D 均无依据。',
      },
    ],
  },
  {
    id: 'u21-p2',
    title: 'Why Do We Celebrate Harvest Festivals?',
    genre: '说明文',
    paragraphs: [
      'Long before supermarkets appeared, a good harvest meant life itself. If the crops failed, a whole village might starve before the next spring. No wonder ancient people held ceremonies at the end of every autumn to thank nature for the food they had received.',
      'Most harvest festivals share the same roots in agriculture, yet each culture celebrates in its own way. In China, families gather under the full moon and share mooncakes at the Mid-Autumn Festival. In some Western countries, people enjoy turkey and pumpkin pies to give thanks. Parades march through small towns, with music playing in the streets.',
      'Today some people complain that these festivals are too commercial, with shops selling expensive gifts everywhere. But the true charm remains the same: food on the table, family around it, and a grateful heart after a year of hard work.',
    ],
    glossary: [
      { wordId: 'harvest', forms: ['harvest'] },
      { wordId: 'starve', forms: ['starve'] },
      { wordId: 'ceremony', forms: ['ceremonies'] },
      { wordId: 'agriculture', forms: ['agriculture'] },
      { wordId: 'gather', forms: ['gather'] },
      { wordId: 'march', forms: ['march'] },
      { wordId: 'commercial', forms: ['commercial'] },
      { wordId: 'charm', forms: ['charm'] },
      { wordId: 'grateful', forms: ['grateful'] },
    ],
    questions: [
      {
        id: 'u21-r2-1',
        type: 'detail',
        stem: 'Why did ancient people hold ceremonies at the end of autumn?',
        options: [
          'To ask for rain in the coming spring.',
          'To thank nature for the food they received.',
          'To sell their crops in the market.',
          'To welcome visitors from other villages.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "held ceremonies at the end of every autumn to thank nature for the food they had received" 可知古代秋末举行仪式是为了感谢大自然赐予食物，故选 B。',
      },
      {
        id: 'u21-r2-2',
        type: 'detail',
        stem: 'What do Chinese families do at the Mid-Autumn Festival according to the passage?',
        options: [
          'They enjoy turkey and pumpkin pies.',
          'They watch parades in small towns.',
          'They share mooncakes under the full moon.',
          'They play games in the fields all night.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "families gather under the full moon and share mooncakes at the Mid-Autumn Festival" 可知中国家庭中秋团聚赏月、分享月饼，故选 C；A 是一些西方国家的习俗。',
      },
      {
        id: 'u21-r2-3',
        type: 'main-idea',
        stem: 'What is the best title or main idea for this passage?',
        options: [
          'Harvest festivals have different names in different countries.',
          'Harvest festivals thank nature and bring family together, though some worry about commercialisation.',
          'Ancient people often starved because they had no ceremonies.',
          'The Mid-Autumn Festival is the oldest harvest festival in the world.',
        ],
        answerIndex: 1,
        explanation:
          '全文先讲丰收节的由来（感谢自然、避免挨饿），再讲不同文化的庆祝方式，末段回应商业化担忧并点明团圆感恩的核心，概括可知选 B；A 只涉及局部，C、D 与原文不符。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6Passages;
