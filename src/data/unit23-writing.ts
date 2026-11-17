import type { WritingTask } from '../types';

/**
 * 人教2019必修三 Unit 3（Diverse Cultures）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 8 词表），
 * 体裁与要求对接教材单元写作板块（应用文电子邮件 + 议论文发言稿）。
 */

export const unit8WritingTasks: WritingTask[] = [
  {
    id: 'u23-w1',
    title: 'Introducing My Hometown to a Foreign Friend',
    genre: '应用文 · 电子邮件',
    wordHint: '词数 80 左右',
    prompt:
      '你的外国笔友 Peter 对中国的多元文化很感兴趣，来信希望你介绍一下你家乡的多彩文化。请用英语给他回一封电子邮件：',
    requirements: [
      '说明回信目的：介绍家乡的多元文化；',
      '从饮食、节日或风俗中选两个方面具体介绍（如地方小吃、民族节日等）；',
      '邀请他假期来家乡做客，亲身体验这里的文化。',
    ],
    modelEssay: [
      'Dear Peter,',
      'Thanks for your letter. You said you were interested in diverse cultures, so I would like to tell you something about my hometown.',
      'My hometown is home to people of several ethnic groups, so the cultures here are really diverse. In the old district downtown, you can try spicy rice noodles as well as mild mushroom soup, and the food street always smells wonderful. Every spring, there is a folk festival where people in traditional clothing sing and dance together.',
      'If you come to my hometown this summer, I will show you around myself. I am looking forward to your visit.',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的、两方面文化介绍、邀请做客）？',
      '文化介绍是否具体（饮食 / 节日 / 风俗至少两方面）？',
      '是否至少用到 3 个 Unit 8 词汇（如 diverse / ethnic / district / spicy / clothing）？',
      '电子邮件格式是否完整（称呼、落款），语气是否友好自然？',
      '词数是否 80 左右，是否避免逐句翻译中文提示？',
    ],
  },
  {
    id: 'u23-w2',
    title: 'Respecting Different Cultures',
    genre: '议论文 · 发言稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语角将举行以“Respecting Different Cultures”为主题的演讲活动。请根据以下要点，用英语写一篇发言稿：',
    requirements: [
      '点明主题：尊重不同文化的重要性；',
      '结合实例说明如何尊重多元文化（如：了解风俗、品尝饮食、参加节日活动等，至少两例）；',
      '发出呼吁：做多元文化的学习者和传播者。',
    ],
    modelEssay: [
      'Respecting Different Cultures',
      'Good afternoon, everyone. It is a great honour for me to speak here. My topic today is respecting different cultures.',
      'Our world is like a garden with all kinds of flowers, and cultural diversity makes it beautiful. However, respecting different cultures is not just a polite word. When we visit a historical district or a local family, we should learn about their customs first instead of laughing at them. When classmates from ethnic minority groups celebrate their festivals, we can join them, taste their food and enjoy the music together.',
      'Every culture has its own wisdom and charm. Let us keep an open mind, learn from each other and share our own culture as well. In this way, the world will understand us better, and we will understand the world better.',
      'Thank you for listening.',
    ],
    checklist: [
      '是否按「点题 — 实例说明 — 呼吁」组织，三个要点齐全？',
      '实例是否具体（了解风俗 / 品尝饮食 / 参加活动至少两例）？',
      '是否至少用到 3 个 Unit 8 词汇（如 culture / diversity / ethnic / historical / district）？',
      '发言稿格式是否完整（称呼、开场、结尾致谢）？',
      '词数是否 100 左右，是否有呼吁性的结尾句？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8WritingTasks;
