import type { WritingTask } from '../types';

/**
 * 人教2019必修三 Unit 1（Festivals and Celebrations）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 6 词表），
 * 体裁与要求对接教材单元写作板块（应用文邀请信 + 记叙文栏目投稿）。
 */

export const unit6WritingTasks: WritingTask[] = [
  {
    id: 'u6-w1',
    title: 'Inviting Your Teacher to the Culture Festival',
    genre: '应用文 · 邀请信',
    wordHint: '词数 80 左右',
    prompt:
      '你校将于下周五下午举办传统文化节（含传统服装展示、猜灯谜、做花灯等活动）。请用英语给外教 Mr Smith 写一封邀请信，邀请他参加：',
    requirements: [
      '说明写信目的：邀请他参加学校传统文化节；',
      '介绍活动的时间、地点及至少两项活动内容（如服装展示、猜灯谜、做花灯等）；',
      '表达期待他到来的心情，并请他回复是否能参加。',
    ],
    modelEssay: [
      'Dear Mr Smith,',
      'I am writing to invite you to our school culture festival, which will be held on the playground next Friday afternoon.',
      'There will be a wonderful costume show, where students wear traditional clothes from different cultures. In the library, you can guess the riddles on colourful lanterns and win small prizes. You can also learn to make paper lanterns with the art teacher. I am sure you will enjoy the charm of the festival.',
      'It would be a great honour if you could come. Looking forward to your reply.',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的、时间地点与活动、期待与回复）？',
      '活动内容是否写出至少两项（服装展示 / 猜灯谜 / 做花灯）？',
      '是否至少用到 3 个 Unit 6 词汇（如 festival / costume / lantern / riddle / charm）？',
      '邀请信格式是否完整（称呼、落款），语气是否真诚礼貌？',
      '词数是否 80 左右，是否避免逐句翻译中文提示？',
    ],
  },
  {
    id: 'u6-w2',
    title: 'My Favourite Festival',
    genre: '记叙文 · 校刊投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语校刊正以“My Favourite Festival”为题征稿。请根据以下要点，用英语写一篇短文投稿，介绍你最喜欢的节日（如春节、元宵节、中秋节等）：',
    requirements: [
      '点明你最喜欢的节日及其时间；',
      '描述节日中你家的典型庆祝方式（如团聚、饮食、活动等，至少两件）；',
      '说明你喜欢这个节日的原因（如家庭团聚、文化意义等）。',
    ],
    modelEssay: [
      'My Favourite Festival',
      'Of all the festivals in China, the Lantern Festival is my favourite. It falls on the fifteenth day of the first lunar month, marking the end of the New Year celebration.',
      'On that day, my whole family gathers at my grandparents\u2019 home. Grandma cooks sweet dumplings, which stand for happiness and reunion. After dinner, we carry lanterns to the park, guess the riddles written on them, and watch the fireworks light up the night sky. These are the most typical customs of the festival.',
      'I love the Lantern Festival not only for the delicious food and great fun, but also for its deep meaning. Whenever the lanterns are lit, I feel the warmth of my family and the charm of our traditional culture.',
    ],
    checklist: [
      '是否按「节日及时间 — 庆祝方式 — 喜欢的原因」组织，三个要点齐全？',
      '庆祝方式是否具体（团聚、饮食、活动至少写出两件）？',
      '是否至少用到 3 个 Unit 6 词汇（如 lantern / gather / riddle / firework / typical / charm）？',
      '叙述是否使用一般现在时（习惯性活动），时态是否一致？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6WritingTasks;
