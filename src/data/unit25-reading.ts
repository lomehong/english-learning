import type { ReadingPassage } from '../types';

/**
 * 人教2019必修三 Unit 5（The Value of Money）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 10 词表），避免任何教材原文版权问题。
 */

export const unit10Passages: ReadingPassage[] = [
  {
    id: 'u25-p1',
    title: 'The Unbelievable Banknote',
    genre: '记叙文',
    paragraphs: [
      'Jack was a poor young sailor whose clothes were almost in rags. One day, by accident, he was chosen by two rich old brothers for a strange bet: they believed that a man with a million-pound banknote but no other money could survive in London for a month, and they gave Jack exactly such a banknote.',
      'When Jack walked into a small restaurant and ordered a steak with a pineapple dessert, the owner first treated him in a rude manner. But the moment Jack took out the banknote to pay, the owner stared at it and could not say a word. Everything changed within a minute: the best table was offered, the meal became free, and the owner even called him "sir" again and again. Indeed, the same thing happened in tailor\u2019s shops and hotels all over the city.',
      'At the end of the month, Jack returned the banknote untouched and got a good job from one brother. "The bet was unbelievable," he told his friends later, "but it taught me a true lesson: the money itself did nothing for me — what really opened those doors was the way people looked at it."',
    ],
    glossary: [
      { wordId: 'bet', forms: ['bet'] },
      { wordId: 'banknote', forms: ['banknote'] },
      { wordId: 'rude', forms: ['rude'] },
      { wordId: 'steak', forms: ['steak'] },
      { wordId: 'pineapple', forms: ['pineapple'] },
      { wordId: 'dessert', forms: ['dessert'] },
      { wordId: 'stare', forms: ['stared'] },
      { wordId: 'indeed', forms: ['Indeed'] },
      { wordId: 'unbelievable', forms: ['unbelievable'] },
      { wordId: 'rag', forms: ['rags'] },
      { wordId: 'accident', forms: ['accident'] },
    ],
    questions: [
      {
        id: 'u25-r1-1',
        type: 'detail',
        stem: 'Why did the two brothers give Jack a million-pound banknote?',
        options: [
          'To pay him for his work on their ship.',
          'To test whether a man could live on it for a month.',
          'To help him open a restaurant in London.',
          'To buy his old clothes as a joke.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "they believed that a man with a million-pound banknote… could survive in London for a month" 可知这是兄弟俩打赌做的试验，故选 B。',
      },
      {
        id: 'u25-r1-2',
        type: 'detail',
        stem: 'How did the restaurant owner change after seeing the banknote?',
        options: [
          'He drove Jack out of the restaurant.',
          'He called the police at once.',
          'He became extremely polite and offered a free meal.',
          'He asked Jack to pay with small changes.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "the best table was offered, the meal became free, and the owner even called him sir" 可知店主变得极其客气还免单，故选 C。',
      },
      {
        id: 'u25-r1-3',
        type: 'inference',
        stem: 'What lesson did Jack learn from the experience?',
        options: [
          'Money itself did nothing; it was people\u2019s attitude towards it that opened doors.',
          'A large banknote can buy real friendship.',
          'Poor people should never enter fine restaurants.',
          'It is easy to become rich in a big city.',
        ],
        answerIndex: 0,
        explanation:
          '末段 "the money itself did nothing for me — what really opened those doors was the way people looked at it" 点明：起作用的不是钱本身而是人们对钱的态度，故选 A。',
      },
    ],
  },
  {
    id: 'u25-p2',
    title: 'What Money Can and Cannot Do',
    genre: '议论文',
    paragraphs: [
      'Money plays a big part in modern life. With a certain amount of money, we can buy food, books and medicine; a wise businessman may use it to create jobs for hundreds of people. Nobody can deny that money makes many good things possible.',
      'However, there is a long list of things that money can never buy. It can buy a bed, but not sleep; it can buy a clock, but not time; it can buy medicine, but not health. A million-pound banknote permits its owner to buy the most expensive steak in town, yet it cannot permit him to win true friendship. As a saying goes, the most precious things in life are unpaid.',
      'So the real question is not how much money we have, but how we use it and how we see it. If we seek money as a tool to help others — like the unpaid volunteers and generous donors around us — it becomes a bridge to happiness. If we treat it as the goal of life, we may lose something far more valuable. That is why many people say: make money your servant, never your master.',
    ],
    glossary: [
      { wordId: 'amount', forms: ['amount'] },
      { wordId: 'businessman', forms: ['businessman'] },
      { wordId: 'banknote', forms: ['banknote'] },
      { wordId: 'permit', forms: ['permits'] },
      { wordId: 'steak', forms: ['steak'] },
      { wordId: 'unpaid', forms: ['unpaid'] },
      { wordId: 'seek', forms: ['seek'] },
    ],
    questions: [
      {
        id: 'u25-r2-1',
        type: 'detail',
        stem: 'What good things can money do according to Paragraph 1?',
        options: [
          'It can create jobs and buy daily necessities.',
          'It can buy sleep and health directly.',
          'It can always win true friendship.',
          'It can make people live forever.',
        ],
        answerIndex: 0,
        explanation:
          '由首段 "we can buy food, books and medicine; a wise businessman may use it to create jobs" 可知钱能购买生活必需品并创造就业，故选 A；B、C 与第二段相反。',
      },
      {
        id: 'u25-r2-2',
        type: 'inference',
        stem: 'What does the sentence "the most precious things in life are unpaid" mean?',
        options: [
          'The best things in life, like love and friendship, cannot be bought with money.',
          'Workers should work for free all their lives.',
          'Precious things are always the cheapest in shops.',
          'Only unpaid volunteers can be happy.',
        ],
        answerIndex: 0,
        explanation:
          '结合上文“钱买得到床却买不到睡眠、买得到药却买不到健康”可推知：人生最珍贵的东西（如爱、友谊、健康）无法用金钱购买，故选 A。',
      },
      {
        id: 'u25-r2-3',
        type: 'main-idea',
        stem: 'What is the best title for this passage?',
        options: [
          'How to Become a Rich Businessman',
          'The Best Steak in Town',
          'A List of Things You Should Buy',
          'Money: A Servant, Not a Master',
        ],
        answerIndex: 3,
        explanation:
          '末段点题 "make money your servant, never your master"，全文讨论金钱能与不能做的事，概括可知最佳标题为 D。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10Passages;
