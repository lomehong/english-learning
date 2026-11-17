import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修一 Unit 2（Looking into the Future）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 2 词表），
 * 体裁与要求对接教材单元写作板块（给未来自己的一封信 + 未来生活畅想投稿）。
 */

export const unit7WritingTasks: WritingTask[] = [
  {
    id: 'u7-w1',
    title: 'A Letter to Myself in 2035',
    genre: '应用文 · 给未来自己的信',
    wordHint: '词数 100 左右',
    prompt:
      '学校英语角正在开展“与未来的自己对话”活动。请以“A Letter to Myself in 2035”为题，用英语给你 2035 年的自己写一封信：',
    requirements: [
      '想象 2035 年你的职业与生活状态；',
      '描述那时科技（如人工智能、智能家居等）对你生活的影响（至少两点）；',
      '表达你对未来自己的期望或建议。',
    ],
    modelEssay: [
      'A Letter to Myself in 2035',
      'Dear me in 2035,',
      'How are you? I am writing this letter from my classroom in 2026. At this time tomorrow, I will be taking an English test, but tonight my thoughts are flying to you.',
      'I predict that by 2035 you will have started your career as a city designer. Artificial intelligence will manage your daily routine at home, and solar energy will make your life clean and sustainable. Perhaps you are working in a smart office, where efficient robots take care of repeated tasks.',
      'However busy you are, please stay curious and kind. Keep reading, keep exercising, and never stop learning. I hope the future me will be proud of the choices we are making today.',
      'Yours,',
      'Li Hua from 2026',
    ],
    checklist: [
      '是否涵盖全部三个要点（职业与生活 / 科技影响 / 期望建议）？',
      '是否使用将来进行时（如 I will be taking… / you will be working…）？',
      '是否至少用到 3 个 Unit 2 词汇（如 predict / artificial / intelligence / solar / sustainable / career）？',
      '书信格式是否完整（称呼、正文、落款），语气是否真诚自然？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
  {
    id: 'u7-w2',
    title: 'My Life in 2040',
    genre: '说明文 · 未来生活畅想投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语报正以“My Life in 2040”为题征稿。请结合科技发展对你日常生活的影响，用英语写一篇短文投稿，畅想 2040 年的一天：',
    requirements: [
      '描绘 2040 年某一天的学习或生活场景（如智能家居、出行方式等）；',
      '至少写出一个可能存在的问题（如隐私、过度依赖技术等）及应对想法；',
      '总结你对未来生活的总体态度。',
    ],
    modelEssay: [
      'My Life in 2040',
      'In 2040, my alarm will not simply ring; it will study the weather forecast and wake me up gently with morning light.',
      'After breakfast, a self-driving car will take me to school, and my virtual classmates from other cities will join the same classroom. At home, small sensors will detect any danger and protect my family, while artificial intelligence helps my parents with daily routines.',
      'Of course, such a life has its risks. If we depend on technology too much, we may lose some practical skills, and personal privacy needs careful protection. Therefore, I will keep learning to control the tools instead of being controlled by them.',
      'In short, I believe the future will be efficient and colourful, as long as we use technology wisely.',
    ],
    checklist: [
      '是否按「生活场景 — 潜在问题 — 总体态度」组织，三个要点齐全？',
      '是否使用将来进行时与一般将来时描述未来场景（如 will be studying / will take）？',
      '是否至少用到 3 个 Unit 2 词汇（如 forecast / virtual / sensor / privacy / efficient / transform）？',
      '问题与应对是否具体，而不是只喊口号？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7WritingTasks;
