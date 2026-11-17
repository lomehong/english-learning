import type { ReadingPassage } from '../types';

/**
 * 人教2019必修一 Unit 2（Travelling Around）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 2 词表），避免任何教材原文版权问题。
 * id 约定：u2- 前缀标识 Unit 2（错题本/学习报告按前缀归入单元维度）。
 */

export const unit2Passages: ReadingPassage[] = [
  {
    id: 'u2-p1',
    title: 'A Weekend in an Ancient Town',
    genre: '记叙文',
    paragraphs: [
      'Last month my cousin and I travelled to Pingyao, an ancient town and a world-famous historical site. It was the final destination of our summer trip.',
      'Before we set off, Dad had booked a small flat inside the town on his phone, and Mum packed some warm clothes. On the first morning, we rented bicycles and rode along the narrow streets between grey stone houses. The town stood on an old trade road of a powerful empire, and its walls are amazing.',
      'We stopped every few minutes to admire the view from the top of the wall. "This is the best sight of the whole trip," my cousin said. On the way home, we both left happy comments about the town online.',
    ],
    glossary: [
      { wordId: 'site', forms: ['site'] },
      { wordId: 'destination', forms: ['destination'] },
      { wordId: 'flat', forms: ['flat'] },
      { wordId: 'pack', forms: ['packed'] },
      { wordId: 'rent', forms: ['rented'] },
      { wordId: 'narrow', forms: ['narrow'] },
      { wordId: 'powerful', forms: ['powerful'] },
      { wordId: 'empire', forms: ['empire'] },
      { wordId: 'amazing', forms: ['amazing'] },
      { wordId: 'admire', forms: ['admire'] },
      { wordId: 'view', forms: ['view'] },
      { wordId: 'sight', forms: ['sight'] },
      { wordId: 'comment', forms: ['comments'] },
    ],
    questions: [
      {
        id: 'u2-r1-1',
        type: 'detail',
        stem: 'How did the writer and his cousin travel around the town on the first morning?',
        options: ['On foot.', 'By bicycle.', 'By bus.', 'By train.'],
        answerIndex: 1,
        explanation:
          '由第二段 "we rented bicycles and rode along the narrow streets" 可知，第一天上午他们租自行车游览古镇，故选 B；A、C、D 原文均未提及。',
      },
      {
        id: 'u2-r1-2',
        type: 'detail',
        stem: 'What did the writer\u2019s cousin think of the view from the top of the wall?',
        options: [
          'It was the best sight of the whole trip.',
          'It was not worth stopping for.',
          'It was worse than the stone houses.',
          'It was too common to remember.',
        ],
        answerIndex: 0,
        explanation:
          '由第三段 "This is the best sight of the whole trip," my cousin said 可知，表弟认为城墙上的景色是整个旅程中最好的风景，故选 A；B、C、D 与原文语气不符。',
      },
      {
        id: 'u2-r1-3',
        type: 'main-idea',
        stem: 'What is the passage mainly about?',
        options: [
          'The writer\u2019s weekend trip to an ancient town.',
          'The trade history of a powerful empire.',
          'How to book a flat in a big city.',
          'The best way to travel with parents.',
        ],
        answerIndex: 0,
        explanation:
          '全文按时间顺序记叙了作者一家去平遥古镇的周末旅行：预订住处、租自行车游窄巷、登城墙赏景、回家后留言，可概括为“一次古镇周末之旅”，故选 A；B 只是背景细节，C、D 并非全文主旨。',
      },
    ],
  },
  {
    id: 'u2-p2',
    title: 'Before You Visit the Terracotta Army',
    genre: '应用文',
    paragraphs: [
      'Welcome to Xi\u2019an! Here is what you need to know before you visit the Terracotta Army.',
      'First, buy your tickets on the official website at least three days ahead. Take your passport with you. Foreign visitors do not need to apply for an extra visa, but the ticket office will check it.',
      'Second, get some local currency before you arrive, because small shops only take cash. Inside the museum you can pay by credit card.',
      'Third, please send us any special request before 6 p.m., for example, if you need a guide who speaks English. The museum is a famous historical site, so touch nothing and follow your guide.',
      'Millions of travellers have already admired this amazing sight. See you in Xi\u2019an!',
    ],
    glossary: [
      { wordId: 'official', forms: ['official'] },
      { wordId: 'apply', forms: ['apply'] },
      { wordId: 'visa', forms: ['visa'] },
      { wordId: 'currency', forms: ['currency'] },
      { wordId: 'credit', forms: ['credit'] },
      { wordId: 'request', forms: ['request'] },
      { wordId: 'site', forms: ['site'] },
      { wordId: 'admire', forms: ['admired'] },
      { wordId: 'amazing', forms: ['amazing'] },
      { wordId: 'sight', forms: ['sight'] },
    ],
    questions: [
      {
        id: 'u2-r2-1',
        type: 'detail',
        stem: 'How can visitors buy tickets for the Terracotta Army?',
        options: [
          'At the gate on the visiting day.',
          'On the official website ahead of time.',
          'By calling the guide before 6 p.m.',
          'From the small shops near the museum.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "buy your tickets on the official website at least three days ahead" 可知，游客需提前至少三天在官方网站购票，故选 B；A、C、D 均与原文不符。',
      },
      {
        id: 'u2-r2-2',
        type: 'detail',
        stem: 'What should visitors do if they need an English-speaking guide?',
        options: [
          'Apply for an extra visa first.',
          'Pay for the tickets in cash.',
          'Send the museum a special request before 6 p.m.',
          'Bring two passports to the ticket office.',
        ],
        answerIndex: 2,
        explanation:
          '由第四段 "please send us any special request before 6 p.m., for example, if you need a guide who speaks English" 可知，需要英文讲解员的游客应在下午六点前向馆方提出特别请求，故选 C；A、B、D 均与原文不符。',
      },
      {
        id: 'u2-r2-3',
        type: 'purpose',
        stem: 'Why does the writer write this passage?',
        options: [
          'To describe a family trip to an ancient town.',
          'To sell tickets for a bus tour around Xi\u2019an.',
          'To introduce the trade history of an old empire.',
          'To give visitors some tips before their visit.',
        ],
        answerIndex: 3,
        explanation:
          '本文是一则参观须知：开头 "Here is what you need to know before you visit…" 点明目的，正文用 First / Second / Third 分条给出购票、货币、讲解预约等建议，可推断写作目的是为游客提供参观前的提示，故选 D；A、C 与本文无关，B 未提及。',
      },
    ],
  },
];
