import type { WritingTask } from '../types';

/**
 * 人教2019必修三 Unit 5（The Value of Money）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 10 词表），
 * 体裁与要求对接教材单元写作板块（应用文发言稿 + 记叙文校刊投稿）。
 */

export const unit10WritingTasks: WritingTask[] = [
  {
    id: 'u25-w1',
    title: 'My View on Pocket Money',
    genre: '应用文 · 演讲稿',
    wordHint: '词数 80 左右',
    prompt:
      '你校英语角将组织以“How to Use Pocket Money Wisely”为题的演讲比赛。请根据以下要点，用英语写一篇演讲稿：',
    requirements: [
      '点明话题：零花钱虽少，用得明智并不容易；',
      '提出至少两条明智使用零花钱的建议（如记账、储蓄、理性消费、帮助他人等）；',
      '总结观点：做金钱的主人，而不是奴隶。',
    ],
    modelEssay: [
      'Good afternoon, everyone. The topic of my speech today is how to use pocket money wisely.',
      'Pocket money is small in amount, but using it wisely is not easy. Here are my suggestions. First, keep a record of every purchase, so you know where your money goes. Second, save part of it every week for something truly important. Third, think twice before buying: ask yourself whether you need it or just want it.',
      'In short, money is a good servant but a bad master. Let us be the wise manager of our pocket money.',
      'Thank you for listening.',
    ],
    checklist: [
      '是否涵盖全部三个要点（话题、至少两条建议、总结）？',
      '建议是否具体可行（记账 / 储蓄 / 理性消费 / 助人等）？',
      '是否至少用到 2 个 Unit 10 词汇（如 money / amount / wisely 等，或 bet / manner / seek 等单元词）？',
      '演讲稿格式是否完整（称呼、开场、结尾致谢）？',
      '词数是否 80 左右，是否避免逐句翻译中文提示？',
    ],
  },
  {
    id: 'u25-w2',
    title: 'An Unforgettable Lesson about Money',
    genre: '记叙文 · 校刊投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语校刊“Money and Life”栏目正在征稿。请根据以下要点，用英语写一篇短文，讲述一次让你重新认识金钱价值的经历：',
    requirements: [
      '交代事件背景：时间、地点、人物（如：为买某物攒钱、遇到需要帮助的人等）；',
      '叙述事件经过与你的选择（如：把攒下的钱用于更有意义的事）；',
      '谈谈这件事让你对金钱价值的新认识（如：金钱是工具、助人更有价值等）。',
    ],
    modelEssay: [
      'An Unforgettable Lesson about Money',
      'Last term, I saved every coin of my pocket money for three months, because I wanted to buy an expensive model plane.',
      'One rainy afternoon, on my way to the shop, I met our old neighbour, Mr Wang, staring helplessly at his broken umbrella at the bus stop. His medicine had cost a large amount of money that month. Without thinking too much, I took out all my savings and bought him a new umbrella and some fruit.',
      'I did not get my model plane that day, but I got something better. Mr Wang\u2019s warm smile taught me a lesson that no shop could sell: money itself has no value until it is used where it is truly needed. Now I still save money, but I always ask myself first — what is it really for?',
    ],
    checklist: [
      '是否按「背景 — 经过与选择 — 新认识」组织，三个要点齐全？',
      '叙述是否具体（时间、地点、人物、动作），内容是否真实可信？',
      '是否至少用到 2 个 Unit 10 词汇（如 amount / stare / indeed / seek / unpaid 等）？',
      '叙述过去的经历是否使用一般过去时，时态是否一致？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10WritingTasks;
