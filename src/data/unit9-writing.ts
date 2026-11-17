import type { WritingTask } from '../types';

/**
 * 人教2019必修三 Unit 4（Space Exploration）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 9 词表），
 * 体裁与要求对接教材单元写作板块（应用文活动通知 + 议论文校刊投稿）。
 */

export const unit9WritingTasks: WritingTask[] = [
  {
    id: 'u9-w1',
    title: 'A Notice about a Science Lecture',
    genre: '应用文 · 活动通知',
    wordHint: '词数 80 左右',
    prompt:
      '你校科技社将邀请航天局的一位科学家来校作题为“Space Exploration and Our Life”的科普讲座。请用英语以科技社名义写一则通知：',
    requirements: [
      '说明活动内容：讲座的主题与主讲人（航天局科学家）；',
      '交代活动的时间与地点（如：本周四下午 4:00—5:30，学校报告厅）；',
      '说明报名方式与注意事项（如：周三中午前向班长报名、按时到场等）。',
    ],
    modelEssay: [
      'Notice',
      'We are glad to tell you that a scientist from the national space agency will give a lecture titled "Space Exploration and Our Life" in the school hall from 4:00 to 5:30 this Thursday afternoon.',
      'In the lecture, the scientist will explain how satellites are launched into orbit and how they help us in daily life. Model rockets made by our science club will also be shown after the talk.',
      'If you are interested, please sign up with your monitor before noon this Wednesday. Everyone is welcome to attend on time. Do not miss it!',
      'The Science Club',
    ],
    checklist: [
      '是否涵盖全部三个要点（主题与主讲人、时间地点、报名方式）？',
      '通知格式是否完整（标题 Notice、落款），信息是否清楚？',
      '是否至少用到 3 个 Unit 9 词汇（如 space / agency / satellite / launch / orbit）？',
      '是否使用了通知常用句式（We are glad to tell you that… / Please sign up…）？',
      '词数是否 80 左右，是否避免逐句翻译中文提示？',
    ],
  },
  {
    id: 'u9-w2',
    title: 'Is Space Exploration Worth the Money?',
    genre: '议论文 · 校刊投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语校刊正以“Is Space Exploration Worth the Money?”为题征稿，有人认为应该把钱花在地球上，也有人认为太空探索物有所值。请根据以下要点用英语写一篇短文投稿：',
    requirements: [
      '引出话题：太空探索花费巨大，观点不一；',
      '列举太空探索的益处（至少两点，如：卫星服务生活、激励科学精神等）；',
      '表明你的观点并简述理由。',
    ],
    modelEssay: [
      'Is Space Exploration Worth the Money?',
      'Every year, huge amounts of money are spent launching rockets and spacecraft into space. Some people ask: is it really worth it?',
      'In my opinion, the answer is yes. First, space exploration improves our daily life. Weather satellites help farmers, and communication satellites connect people around the world. Second, it pushes science forward and trains young talents. Many students have started to study science because of the courage of astronauts and the wisdom of researchers. Moreover, exploring the universe helps us understand the earth better and protect our only home.',
      'Of course, problems on the earth should also be solved. But space programmes and daily life are not enemies; they support each other. As one astronaut said, the universe belongs to those who dare to explore it.',
    ],
    checklist: [
      '是否按「引出话题 — 益处（至少两点）— 个人观点」组织，三个要点齐全？',
      '是否使用了议论文常用连接词（First / Second / Moreover / In my opinion）？',
      '是否至少用到 3 个 Unit 9 词汇（如 space / rocket / satellite / astronaut / universe）？',
      '观点是否明确，理由是否支持观点？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9WritingTasks;
