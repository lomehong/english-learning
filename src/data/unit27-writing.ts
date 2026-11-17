import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修三 Unit 2（Healthy Lifestyle）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 2 词表），
 * 体裁与要求对接教材单元写作板块（倡议书 + 习惯改变记叙文）。
 */

export const unit27WritingTasks: WritingTask[] = [
  {
    id: 'u27-w1',
    title: 'Living a Healthy Life',
    genre: '应用文 · 健康生活倡议书',
    wordHint: '词数 80 左右',
    prompt:
      '你校学生会注意到部分同学熬夜、常喝含糖饮料、缺乏运动。请用英语为校刊写一份倡议书，号召大家养成健康的生活习惯：',
    requirements: [
      '指出当前存在的不健康现象；',
      '提出至少三条具体建议（作息、饮食、运动等）；',
      '发出号召，展望改变后的效果。',
    ],
    modelEssay: [
      'A Proposal for a Healthy Lifestyle',
      'Dear schoolmates,',
      'Recently, some of us stay up late, order sugary drinks, and hardly take exercise. It is time to make a change.',
      'First, go to bed before ten so that we can stay energetic in class. Second, choose water and fruit instead of snacks full of sugar. Third, spend thirty minutes a day on sports such as jogging or basketball.',
      'Small habits make a big difference. Let us start today and build a stronger, happier school together!',
      'The Student Union',
    ],
    checklist: [
      '是否涵盖全部三个要点（现象 / 建议 / 号召）？',
      '建议是否具体可行（时间、时长、做法明确）？',
      '是否使用 so that 等本单元语法结构连接目的？',
      '是否至少用到 3 个 Unit 2 词汇（如 lifestyle / sugary / energetic / jog / balanced）？',
      '词数是否 80 左右，是否保留标题与落款？',
    ],
  },
  {
    id: 'u27-w2',
    title: 'How I Changed My Habits',
    genre: '记叙文 · 亲身经历',
    wordHint: '词数 100 左右',
    prompt:
      '请以“How I Changed My Habits”为题，用英语写一篇记叙文，讲述你（或身边的人）改变不健康生活习惯的一段经历：',
    requirements: [
      '描述原来的不健康习惯及其影响；',
      '记叙改变的过程（谁帮助了你、具体做了什么）；',
      '说明改变后的结果与你的感悟。',
    ],
    modelEssay: [
      'How I Changed My Habits',
      'A year ago, I was a tired boy with an unhealthy lifestyle. I stayed up playing games, drank sugary drinks every day, and never did any exercise. My weight grew, and I often felt sleepy in class.',
      'Last spring, my PE teacher had a serious talk with me. He advised me to start with small goals: sleep before ten, walk after dinner, and eat more vegetables and protein. My mother also helped me plan balanced meals rich in fibre.',
      'It was hard at first, but I kept going. Now I jog three times a week, and my body feels light and strong. More importantly, I have learnt that taking care of health is a daily choice, not a one-day task.',
    ],
    checklist: [
      '是否按「旧习惯 — 改变过程 — 结果感悟」组织，三个要点齐全？',
      '记叙是否有具体细节（时间、人物、做法），而不是空泛陈述？',
      '是否至少用到 3 个 Unit 2 词汇（如 lifestyle / sugary / protein / fibre / balanced / jog）？',
      '是否使用 unless 或 so that 等本单元语法结构？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit27WritingTasks;
