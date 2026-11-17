import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修三 Unit 5（The Value of Money）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 10 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit10Listenings: ListeningMaterial[] = [
  {
    id: 'u25-l1',
    title: 'A Talk on Pocket Money',
    genre: '独白',
    script: [
      'Good afternoon, boys and girls. Today I would like to say a few words about pocket money, because some students complain that theirs always runs out too soon.',
      'Here are three simple suggestions. First, keep a small record book: write down the amount of every purchase, so you know where your money has gone. Second, save part of your pocket money every week, even if it is only five yuan. Small amounts grow into something bigger than you expect. Third, think twice before you buy: ask yourself whether you really need it, or whether you just want it at that moment.',
      'Remember, money itself is neither good nor bad. What matters is the manner in which we use it. I hope these tips will help you become a wise manager of your own money.',
    ],
    questions: [
      {
        id: 'u25-l1-1',
        type: 'detail',
        stem: 'Why does the speaker mention some students\u2019 complaint?',
        options: [
          'To introduce the topic of managing pocket money.',
          'To ask the school to give more pocket money.',
          'To show that record books are expensive.',
          'To prove that saving money is impossible.',
        ],
        answerIndex: 0,
        explanation:
          '说话人由“零花钱总是很快花光”的抱怨引出今天的话题——如何管理零花钱，随后给出三条建议，故选 A。',
      },
      {
        id: 'u25-l1-2',
        type: 'detail',
        stem: 'What should students write down in a record book?',
        options: [
          'The amount of every purchase.',
          'The names of every friend.',
          'The prices of books only.',
          'The time they get up every day.',
        ],
        answerIndex: 0,
        explanation:
          '由 "write down the amount of every purchase, so you know where your money has gone" 可知记录本上要记下每笔花销的金额，故选 A。',
      },
      {
        id: 'u25-l1-3',
        type: 'inference',
        stem: 'What does the speaker think of money?',
        options: [
          'It is the most important thing in life.',
          'It is neither good nor bad in itself.',
          'It is too dangerous for students to hold.',
          'It can always buy happiness.',
        ],
        answerIndex: 1,
        explanation:
          '由 "money itself is neither good nor bad. What matters is the manner in which we use it" 可知说话人认为金钱本身无好坏，关键在使用方式，故选 B。',
      },
    ],
  },
  {
    id: 'u25-l2',
    title: 'Choosing a Birthday Gift',
    genre: '对话',
    script: [
      'M: Mum\u2019s birthday is coming. I am thinking about a gold watch for her, but it costs a large amount of money, and my savings are not enough.',
      'W: A gold watch? That is really expensive. Has Mum ever said she wanted one?',
      'M: Not really. I just want to show how much I love her.',
      'W: I believe what she needs is not the price but the heart. Look at this silk scarf — it is good quality and costs little. We can also make a birthday dinner and a card by ourselves.',
      'M: That sounds warm indeed. But is it enough? Everyone will stare at the small gift at the party…',
      'W: Trust me, a scarf made with love plus a homemade dinner means far more than an unpaid debt for a watch. Mum never seeks expensive things.',
      'M: You are right. Let us buy the scarf and cook the dinner together.',
    ],
    questions: [
      {
        id: 'u25-l2-1',
        type: 'detail',
        stem: 'What gift does the boy want to buy at first?',
        options: [
          'A silk scarf.',
          'A gold watch.',
          'A birthday card.',
          'A homemade dinner.',
        ],
        answerIndex: 1,
        explanation:
          '由 "I am thinking about a gold watch for her" 可知男孩起初想买金表，故选 B。',
      },
      {
        id: 'u25-l2-2',
        type: 'detail',
        stem: 'What does the girl think matters most in a gift?',
        options: [
          'Its price.',
          'Its weight.',
          'The love behind it.',
          'Whether friends will stare at it.',
        ],
        answerIndex: 2,
        explanation:
          '由 "what she needs is not the price but the heart" 以及 "a scarf made with love… means far more" 可知女孩认为心意比价格更重要，故选 C。',
      },
      {
        id: 'u25-l2-3',
        type: 'inference',
        stem: 'What will they probably do for their mother\u2019s birthday?',
        options: [
          'Borrow money to buy the gold watch.',
          'Buy a scarf and make dinner and a card themselves.',
          'Ask Mum to choose a gift herself.',
          'Hold a party without any gift.',
        ],
        answerIndex: 1,
        explanation:
          '结尾男孩接受建议 "Let us buy the scarf and cook the dinner together"，再结合自制贺卡的计划，可推知他们会买丝巾并亲手做饭做卡，故选 B。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10Listenings;
