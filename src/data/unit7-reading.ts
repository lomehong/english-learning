import type { ReadingPassage } from '../types';

/**
 * 人教2019必修三 Unit 2（Morals and Virtues）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 7 词表），避免任何教材原文版权问题。
 */

export const unit7Passages: ReadingPassage[] = [
  {
    id: 'u7-p1',
    title: 'The Wallet on the Bus',
    genre: '记叙文',
    paragraphs: [
      'On a cold Friday evening, Chen Hao found a leather wallet under a seat on the school bus. Inside it there was a large amount of money — more than his family could spend in a month. At that moment, he faced a real moral dilemma: his mother was worrying about his tuition for the new term, and nobody had seen him pick up the wallet.',
      'Chen Hao remembered the principle his grandfather had taught him: honesty is worth more than precious gold. After a short struggle in his heart, he handed the wallet to the driver and asked him to broadcast it. Twenty minutes later, an old man hurried onto the bus, looking pale and anxious.',
      'The wallet was returned to its owner, who responded with tears in his eyes. "You could have kept it," the old man said, "but you chose to give it back." The next Monday, the school elected Chen Hao as one of the "Stars of Virtue". He did not become rich, but he won something more valuable: the trust and respect of everyone around him.',
    ],
    glossary: [
      { wordId: 'moral', forms: ['moral'] },
      { wordId: 'dilemma', forms: ['dilemma'] },
      { wordId: 'tuition', forms: ['tuition'] },
      { wordId: 'principle', forms: ['principle'] },
      { wordId: 'precious', forms: ['precious'] },
      { wordId: 'respond', forms: ['responded'] },
      { wordId: 'elect', forms: ['elected'] },
      { wordId: 'virtue', forms: ['Virtue'] },
      { wordId: 'trust', forms: ['trust'] },
    ],
    questions: [
      {
        id: 'u7-r1-1',
        type: 'detail',
        stem: 'What made Chen Hao\u2019s choice difficult?',
        options: [
          'The driver asked him to keep the wallet.',
          'His family needed money for his tuition.',
          'The wallet belonged to one of his classmates.',
          'He did not know how to open the wallet.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "his mother was worrying about his tuition for the new term, and nobody had seen him pick up the wallet" 可知家里正为学费发愁，使他面临两难，故选 B。',
      },
      {
        id: 'u7-r1-2',
        type: 'detail',
        stem: 'How did the wallet finally get back to its owner?',
        options: [
          'Chen Hao gave it to the driver to broadcast it.',
          'The old man found Chen Hao\u2019s home himself.',
          'The teacher took it to the police station.',
          'Chen Hao kept it until the old man called him.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "he handed the wallet to the driver and asked him to broadcast it" 可知他把钱包交给司机广播寻找失主，故选 A。',
      },
      {
        id: 'u7-r1-3',
        type: 'inference',
        stem: 'What can we learn from the last paragraph?',
        options: [
          'Chen Hao regretted returning the wallet.',
          'Honesty brings people trust and respect.',
          'The old man paid Chen Hao a lot of money.',
          'Only poor students can become Stars of Virtue.',
        ],
        answerIndex: 1,
        explanation:
          '末段 "he won something more valuable: the trust and respect of everyone" 点明诚实换来了信任与尊重，可推知选 B；A 与全文主旨相反，C、D 文中未提及。',
      },
    ],
  },
  {
    id: 'u7-p2',
    title: 'A Doctor Who Chose to Stay',
    genre: '人物故事',
    paragraphs: [
      'When Dr Lin graduated from medical school, big-city hospitals offered her well-paid jobs. Her classmates were surprised, however, when she elected to work as a village physician in a poor mountain area. Some relatives even complained that she was wasting her talent and delaying her own marriage.',
      'Dr Lin responded with a quiet smile. "The villagers need a doctor more than a city does," she said. In the village, she takes care of more than a thousand patients. She assists at births in the middle of the night, and when an old man fainted in the fields last summer, she rushed there within ten minutes and saved his life.',
      'Every evening, after her long day\u2019s work, she still scans medical journals to keep learning. Her kindness and affection have won the hearts of the whole village. To illustrate what a meaningful life is, she often says, "Being trusted by my patients is my greatest happiness." Her story tells us that a generous heart matters more than a rich wallet.',
    ],
    glossary: [
      { wordId: 'physician', forms: ['physician'] },
      { wordId: 'elect', forms: ['elected'] },
      { wordId: 'complain', forms: ['complained'] },
      { wordId: 'respond', forms: ['responded'] },
      { wordId: 'assist', forms: ['assists'] },
      { wordId: 'faint', forms: ['fainted'] },
      { wordId: 'scan', forms: ['scans'] },
      { wordId: 'kindness', forms: ['kindness'] },
      { wordId: 'affection', forms: ['affection'] },
      { wordId: 'illustrate', forms: ['illustrate'] },
      { wordId: 'generous', forms: ['generous'] },
    ],
    questions: [
      {
        id: 'u7-r2-1',
        type: 'detail',
        stem: 'Why were Dr Lin\u2019s classmates surprised?',
        options: [
          'She refused all the medical schools.',
          'She chose to work in a poor mountain village.',
          'She got married soon after graduation.',
          'She left the hospital without saying goodbye.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "she elected to work as a village physician in a poor mountain area" 及同学的反应可知，令他们吃惊的是她选择去贫困山村当医生，故选 B。',
      },
      {
        id: 'u7-r2-2',
        type: 'detail',
        stem: 'What does Dr Lin do to keep learning after work?',
        options: [
          'She attends night classes in the city.',
          'She writes books for medical schools.',
          'She scans medical journals every evening.',
          'She asks her classmates for lecture notes.',
        ],
        answerIndex: 2,
        explanation:
          '由第三段 "she still scans medical journals to keep learning" 可知她每晚浏览医学期刊坚持学习，故选 C。',
      },
      {
        id: 'u7-r2-3',
        type: 'main-idea',
        stem: 'What is the best title for this passage?',
        options: [
          'A Well-Paid Job in a Big City',
          'The Difficult Life of a Medical Student',
          'How to Become a Village Doctor',
          'A Meaningful Life in Service of Others',
        ],
        answerIndex: 3,
        explanation:
          '全文讲述林医生放弃高薪扎根山村、服务病人的故事，末段点题 "a meaningful life"，概括可知最佳标题是 D。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7Passages;
