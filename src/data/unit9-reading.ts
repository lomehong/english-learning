import type { ReadingPassage } from '../types';

/**
 * 人教2019必修三 Unit 4（Space Exploration）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 9 词表），避免任何教材原文版权问题。
 */

export const unit9Passages: ReadingPassage[] = [
  {
    id: 'u9-p1',
    title: 'Reaching for the Stars',
    genre: '说明文',
    paragraphs: [
      'In 1957, the first man-made satellite was sent into orbit, and the age of space exploration began. Only four years later, a human being orbited the earth for the first time. Since then, thousands of spacecraft have been launched by different countries, and twelve astronauts have walked on the Moon.',
      'Behind every launch stands years of hard work. Space agencies design rockets, test vehicles again and again, and train astronauts for years. Trainees must endure both physical and mental tests: they practise in heavy suits, live in small rooms for weeks, and learn hundreds of procedures by heart. Even intelligent machines are checked thousands of times before they are allowed to fly.',
      'Why do people keep exploring the final frontier? Scientists say the universe holds answers to big questions: How did the earth appear? Is there life elsewhere? Many researchers have dedicated their whole lives to this ongoing search. Their spirit tells us that the road to the stars is built, step by step, by human courage and wisdom.',
    ],
    glossary: [
      { wordId: 'satellite', forms: ['satellite'] },
      { wordId: 'orbit', forms: ['orbit', 'orbited'] },
      { wordId: 'spacecraft', forms: ['spacecraft'] },
      { wordId: 'agency', forms: ['agencies'] },
      { wordId: 'vehicle', forms: ['vehicles'] },
      { wordId: 'endure', forms: ['endure'] },
      { wordId: 'mental', forms: ['mental'] },
      { wordId: 'procedure', forms: ['procedures'] },
      { wordId: 'intelligent', forms: ['intelligent'] },
      { wordId: 'frontier', forms: ['frontier'] },
      { wordId: 'universe', forms: ['universe'] },
      { wordId: 'dedicate', forms: ['dedicated'] },
      { wordId: 'ongoing', forms: ['ongoing'] },
    ],
    questions: [
      {
        id: 'u9-r1-1',
        type: 'detail',
        stem: 'What happened in 1957 according to the passage?',
        options: [
          'A human being orbited the earth.',
          'The first man-made satellite was sent into orbit.',
          'Twelve astronauts walked on the Moon.',
          'Thousands of rockets were sold to other countries.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "In 1957, the first man-made satellite was sent into orbit" 可知 1957 年第一颗人造卫星被送入轨道，故选 B；载人绕地是四年后，登月更晚。',
      },
      {
        id: 'u9-r1-2',
        type: 'detail',
        stem: 'What must astronaut trainees do during training?',
        options: [
          'Design rockets for the space agency.',
          'Live in small rooms for weeks and learn procedures.',
          'Walk on the Moon twice a year.',
          'Sell vehicles to space agencies.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "they practise in heavy suits, live in small rooms for weeks, and learn hundreds of procedures by heart" 可知学员需在小房间里生活数周并熟记大量程序，故选 B。',
      },
      {
        id: 'u9-r1-3',
        type: 'inference',
        stem: 'What can we infer from the last paragraph?',
        options: [
          'Space exploration has already answered all the big questions.',
          'People explore space because it is easy and cheap.',
          'Space exploration is a long journey carried on with courage and wisdom.',
          'Researchers are forced to dedicate their lives to space science.',
        ],
        answerIndex: 2,
        explanation:
          '末段 "the road to the stars is built, step by step, by human courage and wisdom" 表明太空探索是靠勇气与智慧一步步推进的漫长旅程，可推知选 C。',
      },
    ],
  },
  {
    id: 'u9-p2',
    title: 'A Day Aboard the Space Station',
    genre: '记叙文',
    paragraphs: [
      'Astronaut Li Wei keeps a diary about his life in orbit. "People think life here is like a science-fiction film," he writes, "but in fact it follows a strict plan." At six every morning, he is woken up by light, because the space station circles the earth every ninety minutes and the sun rises sixteen times a day.',
      'Without gravity, everything floats. The astronauts tie themselves to the wall to sleep, and drink water from special bags. Meals are carefully prepared on the ground, and each food bag is marked with names and dates. Two hours of exercise is required every day; otherwise, their muscles and bones would become weak in weightlessness.',
      'The main work is science. In the laboratory, Li Wei follows a procedure to grow plants and test new materials. Outside the window, the solar panels shine in the sunlight, providing power for everything on board. At night, he looks at the earth and remembers the morning when the rocket lifted off at the launch pad — his childhood ambition has finally come true. "Our planet is beautiful and lonely," he writes. "Someone has to explore the universe, and I am proud to be one of them."',
    ],
    glossary: [
      { wordId: 'astronaut', forms: ['Astronaut', 'astronauts'] },
      { wordId: 'gravity', forms: ['gravity'] },
      { wordId: 'procedure', forms: ['procedure'] },
      { wordId: 'solar', forms: ['solar'] },
      { wordId: 'panel', forms: ['panels'] },
      { wordId: 'universe', forms: ['universe'] },
      { wordId: 'rocket', forms: ['rocket'] },
      { wordId: 'ambition', forms: ['ambition'] },
      { wordId: 'launch', forms: ['launch'] },
    ],
    questions: [
      {
        id: 'u9-r2-1',
        type: 'detail',
        stem: 'Why is Li Wei woken up by light instead of an alarm clock?',
        options: [
          'He forgot to bring his alarm clock.',
          'The station circles the earth fast and the sun rises many times a day.',
          'The light system is broken in the laboratory.',
          'Astronauts are not allowed to use clocks.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "the space station circles the earth every ninety minutes and the sun rises sixteen times a day" 可知空间站绕地飞快、太阳每天升起十六次，故选 B。',
      },
      {
        id: 'u9-r2-2',
        type: 'detail',
        stem: 'Why do the astronauts exercise two hours every day?',
        options: [
          'To prepare for a walk on the Moon.',
          'To stop their muscles and bones from getting weak.',
          'To grow plants in the laboratory.',
          'To test new sportswear for the agency.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "Two hours of exercise is required every day; otherwise, their muscles and bones would become weak in weightlessness" 可知锻炼是为了防止失重导致肌肉骨骼变弱，故选 B。',
      },
      {
        id: 'u9-r2-3',
        type: 'purpose',
        stem: 'Why does the writer mention Li Wei\u2019s diary in the last paragraph?',
        options: [
          'To show his daily work and his pride in exploring the universe.',
          'To prove that life in space is boring and lonely.',
          'To ask readers to buy solar panels.',
          'To explain how to write a space diary.',
        ],
        answerIndex: 0,
        explanation:
          '末段引用日记内容：既介绍实验工作，又以 "I am proud to be one of them" 表达探索宇宙的自豪感，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9Passages;
