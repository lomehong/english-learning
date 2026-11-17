import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修一 Unit 5（Working the Land）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 5 词表），
 * 体裁与要求对接教材单元写作板块（活动通知 + 劳动实践投稿）。
 */

export const unit10WritingTasks: WritingTask[] = [
  {
    id: 'u10-w1',
    title: 'Notice: Farm Work Week',
    genre: '应用文 · 活动通知',
    wordHint: '词数 80 左右',
    prompt:
      '你校将组织学生到校外劳动实践基地“阳光农场（Sunshine Farm）”开展为期一周的农耕劳动实践。请以学生会的名义用英语写一则通知，内容包括：',
    requirements: [
      '说明活动的时间、地点与参加对象；',
      '介绍实践活动内容（如收割小麦、学习脱粒、了解有机种植等）；',
      '提醒注意事项（着装、午餐安排等）。',
    ],
    modelEssay: [
      'Notice',
      'In order to learn more about working the land, our school will organise a Farm Work Week at Sunshine Farm from June 3 to 7. All Senior Two students will take part in it.',
      'During the week, you will harvest wheat, learn how to turn it into grain, and visit the organic fields, where natural fertiliser keeps the soil healthy.',
      'Please wear old shoes and hats, and bring your own lunch on Monday. For further information, come to the Student Union office before Friday.',
      'The Student Union',
    ],
    checklist: [
      '是否涵盖全部三个要点（时间地点对象 / 实践内容 / 注意事项）？',
      '通知格式是否完整（标题、正文、落款）？',
      '是否至少用到 3 个 Unit 5 词汇（如 harvest / wheat / grain / organic / soil / fertiliser）？',
      '语言是否简洁清楚，信息是否准确无歧义？',
      '词数是否 80 左右？',
    ],
  },
  {
    id: 'u10-w2',
    title: 'A Day on Sunshine Farm',
    genre: '记叙文 · 劳动实践投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语报“Labour and Life”栏目正在征稿。请根据你在农场劳动实践的经历（真实或想象），用英语写一篇短文投稿，题目为“A Day on Sunshine Farm”：',
    requirements: [
      '交代劳动的时间、地点与任务；',
      '记叙劳动过程中的一个具体场景或细节；',
      '总结你的收获或对劳动、粮食的新认识。',
    ],
    modelEssay: [
      'A Day on Sunshine Farm',
      'Last Friday, our class spent a whole day working on Sunshine Farm, thirty kilometres east of our city.',
      'In the morning, we harvested wheat under the bright sun. Having worked for two hours, I finally understood why farmers bend their backs again and again. Later, an old farmer showed us how to turn the wheat into grain, and explained that natural fertiliser keeps the soil healthy without any pesticide.',
      'Every grain on my plate now carries a new meaning. Working the land taught me patience and respect, and I will never waste my food again.',
    ],
    checklist: [
      '是否按「时间地点任务 — 具体场景 — 收获认识」组织，三个要点齐全？',
      '劳动场景是否具体可感（有动作、对话或细节）？',
      '是否至少用到 3 个 Unit 5 词汇（如 harvest / wheat / grain / soil / fertiliser / pesticide）？',
      '是否使用动词-ing形式作状语（如 Having worked for two hours, …）？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10WritingTasks;
