import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修三 Unit 3（Environmental Protection）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 3 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit28Listenings: ListeningMaterial[] = [
  {
    id: 'u28-l1',
    title: 'Green Week Is Coming',
    genre: '独白',
    script: [
      'Attention, please. Next week our school will hold its first Green Week.',
      'On Monday, we will clean the small river behind the school and collect plastic waste along its banks.',
      'On Wednesday, a scientist will give a talk on climate change and show how recycling saves energy.',
      'Students who join both activities will get a reusable bag as a small prize. Let us work together for a greener campus.',
      'Thank you for your support.',
    ],
    questions: [
      {
        id: 'u28-l1-q1',
        type: 'detail',
        stem: 'What will students do on Monday?',
        options: [
          'Clean the river behind the school.',
          'Listen to a talk on art.',
          'Plant trees on the hill.',
          'Visit a science museum.',
        ],
        answerIndex: 0,
        explanation:
          '由 "On Monday, we will clean the small river behind the school" 可知周一将清理学校后面的小河，故选 A；讲座在周三，其余选项未提及。',
      },
      {
        id: 'u28-l1-q2',
        type: 'detail',
        stem: 'What will the scientist talk about?',
        options: [
          'Space travel.',
          'Climate change and recycling.',
          'School history.',
          'Sports safety.',
        ],
        answerIndex: 1,
        explanation:
          '由 "a scientist will give a talk on climate change and show how recycling saves energy" 可知讲座主题是气候变化与回收利用，故选 B。',
      },
      {
        id: 'u28-l1-q3',
        type: 'inference',
        stem: 'What is the purpose of the Green Week?',
        options: [
          'To encourage students to protect the environment.',
          'To sell reusable bags.',
          'To raise money for the school.',
          'To welcome new teachers.',
        ],
        answerIndex: 0,
        explanation:
          '活动包括清河、听环保讲座并奖励参与的同学，可推知绿色周旨在鼓励学生环保，环保袋只是激励手段，故选 A。',
      },
    ],
  },
  {
    id: 'u28-l2',
    title: 'The No-Plastic Rule',
    genre: '对话',
    script: [
      'M: Have you heard about the no-plastic rule in our school shop?',
      'W: Yes. From next month, it will only sell paper bags and reusable bottles.',
      'M: That is great news. Plastic pollution is such a big problem.',
      'W: Exactly. My family also stopped buying disposable cups last year.',
      'M: Well done. I will bring my own bottle from tomorrow.',
      'W: Me too. Small changes like this really matter for the earth.',
    ],
    questions: [
      {
        id: 'u28-l2-q1',
        type: 'detail',
        stem: 'What will the school shop do from next month?',
        options: [
          'Sell paper bags and reusable bottles only.',
          'Close for a month.',
          'Give away free food.',
          'Move to another building.',
        ],
        answerIndex: 0,
        explanation:
          '由 "it will only sell paper bags and reusable bottles" 可知商店下月起只出售纸袋与可重复使用的瓶子，故选 A；B、C、D 均未提及。',
      },
      {
        id: 'u28-l2-q2',
        type: 'detail',
        stem: 'What did the woman\u2019s family stop buying last year?',
        options: [
          'Disposable cups.',
          'Paper bags.',
          'Glass bottles.',
          'Fresh fruit.',
        ],
        answerIndex: 0,
        explanation:
          '由 "My family also stopped buying disposable cups last year" 可知她家去年起不再购买一次性杯子，故选 A；B、C、D 与原文不符。',
      },
      {
        id: 'u28-l2-q3',
        type: 'inference',
        stem: 'What are the speakers\u2019 attitudes towards the rule?',
        options: [
          'Doubtful.',
          'Angry.',
          'Supportive.',
          'Uninterested.',
        ],
        answerIndex: 2,
        explanation:
          '男士称之为 great news，女士表示赞同并已身体力行，可推知两人都支持该规定，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit28Listenings;
