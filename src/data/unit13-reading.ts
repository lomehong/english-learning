import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修四 Unit 3（Sea Exploration）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 3 词表），避免任何教材原文版权问题。
 */

export const unit13Passages: ReadingPassage[] = [
  {
    id: 'u13-p1',
    title: 'The Log of a Young Sailor',
    genre: '记叙文',
    paragraphs: [
      'Li Wei found the old log in his grandfather\u2019s wooden chest. Its pages recorded a voyage from Shanghai to the Indian Ocean in 1962, when the merchant fleet still sailed by wind and star instead of engine.',
      'As a boy, Li Wei had heard that his grandfather once withdrew from a storm to save the crew. Now the log proved it: in the fourth week, the captain ordered the ships to turn back, and every sailor returned home safe. The last page held a simple drawing of a coral island, a sight to behold, his grandfather wrote, worth the whole journey.',
      'Li Wei closed the book with a mixture of pride and gratitude. That summer, he applied to a marine institute, hoping one day to possess a log of his own and to write the first line of a new voyage.',
    ],
    glossary: [
      { wordId: 'log', forms: ['log'] },
      { wordId: 'voyage', forms: ['voyage'] },
      { wordId: 'merchant', forms: ['merchant'] },
      { wordId: 'fleet', forms: ['fleet'] },
      { wordId: 'withdraw', forms: ['withdrew'] },
      { wordId: 'coral', forms: ['coral'] },
      { wordId: 'behold', forms: ['behold'] },
      { wordId: 'mixture', forms: ['mixture'] },
      { wordId: 'marine', forms: ['marine'] },
      { wordId: 'possess', forms: ['possess'] },
    ],
    questions: [
      {
        id: 'u13-r1-1',
        type: 'detail',
        stem: 'What did the old log record according to Paragraph 1?',
        options: [
          'A voyage from Shanghai to the Indian Ocean in 1962.',
          'A fishing competition in 1950.',
          'A storm that destroyed the whole fleet.',
          'A map of hidden treasure islands.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "recorded a voyage from Shanghai to the Indian Ocean in 1962" 可知日志记录了 1962 年的一次航行，故选 A；其余选项文中均未提及。',
      },
      {
        id: 'u13-r1-2',
        type: 'detail',
        stem: 'Why did the captain order the ships to turn back?',
        options: [
          'To save the crew from a storm.',
          'To catch a school of fish.',
          'To visit a coral island again.',
          'To repair the broken engine.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "withdrew from a storm to save the crew" 可知船长为使船员避开风暴而下令返航，故选 A；B、C、D 均与原文不符。',
      },
      {
        id: 'u13-r1-3',
        type: 'inference',
        stem: 'What can we infer about Li Wei from the last paragraph?',
        options: [
          'The log influenced his choice of future career.',
          'He decided to sell the log for money.',
          'He lost interest in the sea after reading it.',
          'He found the log difficult to understand.',
        ],
        answerIndex: 0,
        explanation:
          '由末段他报考海洋研究所并希望拥有自己的航海日志可知，这本日志影响了他的职业选择，故选 A；B、C、D 均与文意相反或无据。',
      },
    ],
  },
  {
    id: 'u13-p2',
    title: 'Should We Explore the Deep Sea?',
    genre: '应用文 · 专栏评论',
    paragraphs: [
      'The sea covers most of our planet, yet much of it remains unknown. Some people argue that deep-sea expeditions cost too much money and disturb marine life. Others reply that ocean research protects the very same life we worry about.',
      'Facts support the second view. With wider coverage of the ocean, scientists can follow storms, guard sea roads and help nations in their negotiations over fishing rights. A recent report on ancient trading routes was applauded around the world, and several countries have extended their joint research programmes ever since.',
      'The mercy of the sea feeds billions of people, and its rising level touches every coast. To understand the ocean is to protect ourselves; that is why the long voyage of exploration must go on.',
    ],
    glossary: [
      { wordId: 'expedition', forms: ['expeditions'] },
      { wordId: 'marine', forms: ['marine'] },
      { wordId: 'coverage', forms: ['coverage'] },
      { wordId: 'negotiation', forms: ['negotiations'] },
      { wordId: 'applaud', forms: ['applauded'] },
      { wordId: 'extend', forms: ['extended'] },
      { wordId: 'merciful', forms: ['mercy'] },
      { wordId: 'voyage', forms: ['voyage'] },
    ],
    questions: [
      {
        id: 'u13-r2-1',
        type: 'detail',
        stem: 'What do some people worry about deep-sea expeditions?',
        options: [
          'They cost too much and disturb marine life.',
          'They make fishing boats cheaper.',
          'They move storms towards the land.',
          'They pollute the drinking water.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "cost too much money and disturb marine life" 可知反对者担心花费高且打扰海洋生物，故选 A；B、C、D 均无依据。',
      },
      {
        id: 'u13-r2-2',
        type: 'detail',
        stem: 'According to Paragraph 2, what happened after the report on ancient trading routes came out?',
        options: [
          'It was applauded around the world.',
          'It was refused by most scientists.',
          'It was sold to a private museum.',
          'It was forgotten at once.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "was applauded around the world, and several countries have extended their joint research programmes" 可知报告广受赞誉并促成多国扩大合作，故选 A。',
      },
      {
        id: 'u13-r2-3',
        type: 'main-idea',
        stem: 'What is the writer\u2019s main purpose in the passage?',
        options: [
          'To explain why sea exploration should continue.',
          'To describe a famous sailor\u2019s childhood.',
          'To list the fish sold at the market.',
          'To warn readers against sailing at night.',
        ],
        answerIndex: 0,
        explanation:
          '作者先摆出争议，再用事实反驳，最后以“了解海洋就是保护我们自己”收束，可见写作目的是论证海洋探索应当继续，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit13Passages;
