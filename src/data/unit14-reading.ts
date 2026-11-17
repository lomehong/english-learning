import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修二 Unit 4（Journey Across a Vast Land）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 4 词表），避免任何教材原文版权问题。
 */

export const unit14Passages: ReadingPassage[] = [
  {
    id: 'u14-p1',
    title: 'A Train Ride Across Canada',
    genre: '记叙文',
    paragraphs: [
      'Last summer, my cousin and I took a train from Vancouver to Montreal, crossing a vast land of forests and lakes. We sat by the window for hours, watching maple trees, rivers and distant mountains pass by.',
      'We chose to go aboard the rail carriage deliberately. The journey took four days, and each day brought a new highlight: a quiet bay at dawn, wildlife along the track, and the spectacular Rocky Mountains at dusk. At one stop, an old photographer told us that people once crossed this border on horseback.',
      'On the last evening, we wandered through an urban market in Toronto, tasting food from many countries. When the train reached Montreal, we were tired but happy. That breathtaking journey taught us a simple lesson: the world is wider than any screen.',
    ],
    glossary: [
      { wordId: 'maple', forms: ['maple'] },
      { wordId: 'aboard', forms: ['aboard'] },
      { wordId: 'rail', forms: ['rail'] },
      { wordId: 'carriage', forms: ['carriage'] },
      { wordId: 'highlight', forms: ['highlight'] },
      { wordId: 'spectacular', forms: ['spectacular'] },
      { wordId: 'dusk', forms: ['dusk'] },
      { wordId: 'photographer', forms: ['photographer'] },
      { wordId: 'border', forms: ['border'] },
      { wordId: 'wander', forms: ['wandered'] },
      { wordId: 'urban', forms: ['urban'] },
      { wordId: 'breathtaking', forms: ['breathtaking'] },
    ],
    questions: [
      {
        id: 'u14-r1-1',
        type: 'detail',
        stem: 'How long did the train journey from Vancouver to Montreal take?',
        options: [
          'Four days.',
          'Two weeks.',
          'One week.',
          'A single night.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "The journey took four days" 可知这段火车旅程花了四天，故选 A。',
      },
      {
        id: 'u14-r1-2',
        type: 'detail',
        stem: 'What did the old photographer tell them at one stop?',
        options: [
          'People once crossed the border on horseback.',
          'The Rocky Mountains were closed to visitors.',
          'The railway would soon be replaced by airlines.',
          'Wildlife was dangerous along the track.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "an old photographer told us that people once crossed this border on horseback" 可知老摄影师告诉他们过去人们骑马跨越边界，故选 A。',
      },
      {
        id: 'u14-r1-3',
        type: 'main-idea',
        stem: 'What lesson did the writer learn from the journey?',
        options: [
          'The world is wider than any screen.',
          'Travelling by train is always cheap.',
          'Big cities are better than mountains.',
          'Long journeys are too tiring to enjoy.',
        ],
        answerIndex: 0,
        explanation:
          '由末段 "That breathtaking journey taught us a simple lesson: the world is wider than any screen" 可知作者领悟到世界比任何屏幕都广阔，故选 A。',
      },
    ],
  },
  {
    id: 'u14-p2',
    title: 'Slow Travel: Seeing More by Moving Less',
    genre: '说明文',
    paragraphs: [
      'In recent years, slow travel has become popular among young people. Instead of rushing from one airport to another, they plan their trips around a single region. They get off at small stations, wander around antique shops, and watch the departure board calmly.',
      'Supporters say that slow travel is not a waste of time. A continental trip by rail, for example, produces much less pollution than the same journey by plane. Travellers also experience how daily life literally changes from city to city, and they return home with deeper memories.',
      'Of course, this way of travelling is not perfect for everyone. It asks for time, patience and a light bag. But if you have a long holiday, why not proceed at a gentler speed? Sometimes the richest part of a journey is not the destination, but everything in between.',
    ],
    glossary: [
      { wordId: 'wander', forms: ['wander'] },
      { wordId: 'antique', forms: ['antique'] },
      { wordId: 'departure', forms: ['departure'] },
      { wordId: 'continental', forms: ['continental'] },
      { wordId: 'rail', forms: ['rail'] },
      { wordId: 'literally', forms: ['literally'] },
      { wordId: 'proceed', forms: ['proceed'] },
    ],
    questions: [
      {
        id: 'u14-r2-1',
        type: 'detail',
        stem: 'How do slow travellers usually plan their trips?',
        options: [
          'They plan them around a single region.',
          'They visit as many countries as possible.',
          'They follow guided tour groups.',
          'They change hotels every single night.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "they plan their trips around a single region" 可知慢旅行者围绕单一地区规划行程，故选 A；B、C、D 与“慢旅行”理念相反或未提及。',
      },
      {
        id: 'u14-r2-2',
        type: 'inference',
        stem: 'What can we infer about a continental trip by rail in Paragraph 2?',
        options: [
          'It is more environmentally friendly than flying.',
          'It is much faster than taking a plane.',
          'It costs far more than other ways of travel.',
          'It is only suitable for business travellers.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "produces much less pollution than the same journey by plane" 可推知乘火车横贯大陆的旅行比坐飞机更环保，故选 A；B 与文中“慢”的特征相反，C、D 无依据。',
      },
      {
        id: 'u14-r2-3',
        type: 'purpose',
        stem: 'Why does the author write the last paragraph?',
        options: [
          'To invite readers with long holidays to try travelling slowly.',
          'To warn readers against all kinds of long journeys.',
          'To prove that planes should never be used.',
          'To complain about crowded train stations.',
        ],
        answerIndex: 0,
        explanation:
          '末段先承认慢旅行并非人人适合，再以“为何不放慢速度”的建议收尾，写作意图是向有长假期的读者发出尝试慢旅行的邀请，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit14Passages;
