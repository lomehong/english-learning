import type { WritingTask } from '../types';

/**
 * 人教2019必修一 Unit 5（Languages Around the World）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 5 词表），
 * 体裁与要求对接教材单元写作板块（应用文邀请信 + 记叙文校刊投稿）。
 */

export const unit5WritingTasks: WritingTask[] = [
  {
    id: 'u5-w1',
    title: 'Inviting a Friend to the Language Festival',
    genre: '应用文 · 邀请信',
    wordHint: '词数 80 左右',
    prompt:
      '你校英语角下周将举办“世界语言文化节”活动。请用英语给你的交换生朋友 Max 写一封邀请信，邀请他参加活动并分享他学习语言的故事：',
    requirements: [
      '说明写信目的与活动的时间、地点；',
      '介绍活动内容（如语言主题讲座、方言短剧、多语歌曲表演等）；',
      '邀请 Max 分享他学习汉语的经历，并表示期待回复。',
    ],
    modelEssay: [
      'Dear Max,',
      'How is everything going? I am writing to invite you to our Language and Culture Festival, which will be held in the school hall from 3 to 5 p.m. next Friday.',
      'There will be a talk about languages around the world, a short play in a local dialect, and songs in several languages. The students who join in will also receive small gifts.',
      'Since you have studied Chinese for two years, we would love to hear the story of your learning journey. I am looking forward to your reply.',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（时间地点 / 活动内容 / 邀请分享与盼复）？',
      '是否使用定语从句（如 which will be held… / the students who join in…）？',
      '是否至少用到 3 个 Unit 5 词汇（如 language / dialect / native / expression / translate）？',
      '语气是否友好礼貌，称呼与落款格式是否完整？',
      '词数是否 80 左右，是否避免逐句翻译中文提示？',
    ],
  },
  {
    id: 'u5-w2',
    title: 'The Language I Want to Learn Best',
    genre: '记叙文 · 校刊投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语校刊正以“The Language I Want to Learn Best”为题征稿。请根据以下要点，用英语写一篇短文投稿，谈谈你最想学好的一门语言：',
    requirements: [
      '点明你最想学好的语言以及你现在的学习状况；',
      '说明想学好它的原因（至少两点，如交流、文化、兴趣等）；',
      '谈谈你今后的学习打算（至少两条具体做法）。',
    ],
    modelEssay: [
      'The Language I Want to Learn Best',
      'Of all the languages around the world, the one I want to learn best is French.',
      'Two years ago, I watched a French film whose songs touched my heart, and from then on I fell in love with this beautiful language. French is spoken by millions of people, so learning it will allow me to communicate with more friends and understand their culture. Although I still struggle with pronunciation and grammar, every new word brings me joy.',
      'To learn it well, I will listen to French songs every morning and keep a diary in simple French. I believe that a positive attitude and daily practice will open a new world for me.',
    ],
    checklist: [
      '是否按「点明语言 — 原因 — 打算」组织，三个要点齐全？',
      '是否使用定语从句（如 the one I want to learn best / a film whose songs…）？',
      '是否至少用到 3 个 Unit 5 词汇（如 pronunciation / grammar / communicate / struggle / attitude）？',
      '原因与学习打算是否具体（做法至少写出两条）？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit5WritingTasks;
