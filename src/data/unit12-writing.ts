import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修四 Unit 2（Iconic Attractions）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 2 词表），
 * 体裁与要求对接教材单元写作板块（景点介绍 + 游记）。
 */

export const unit12WritingTasks: WritingTask[] = [
  {
    id: 'u12-w1',
    title: 'Introducing an Iconic Attraction',
    genre: '应用文 · 景点介绍',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语报“World Corner”栏目正在征稿。请用英语写一篇短文，向外国朋友介绍一个你熟悉的标志性景点：',
    requirements: [
      '点明景点的名称、位置与标志性特征；',
      '介绍两三项可体验的活动或值得观察的自然景观；',
      '给出实用的游览建议并表达欢迎。',
    ],
    modelEssay: [
      'Introducing an Iconic Attraction',
      'The bay in my hometown is the most iconic attraction in this area. It is located where a warm current meets the shore, so the water stays clear all year.',
      'Visitors can hire a kayak in the morning, watch colourful fish over the coral, and enjoy a barbecue on the white sand at dusk. If you are lucky, you may even see young turtles hatch under the moon.',
      'Remember to wear comfortable shoes and keep a respectful distance from the animals. The bay is waiting for you.',
    ],
    checklist: [
      '是否涵盖三个要点（位置特征 / 活动景观 / 建议与欢迎）？',
      '描述是否有画面感（颜色、声音、动作），而不是套话？',
      '是否至少用到 3 个 Unit 2 词汇（如 iconic / locate / kayak / hatch / barbecue / habitat）？',
      '是否使用倒装句（如 South of the city lies… / Never will you see…）提升文采？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
  {
    id: 'u12-w2',
    title: 'An Unforgettable Trip',
    genre: '记叙文 · 游记',
    wordHint: '词数 100 左右',
    prompt:
      '请以“An Unforgettable Trip”为题，用英语写一篇游记，记录一次你（或想象中）游览某标志性景点的经历：',
    requirements: [
      '交代旅行的时间、地点与同行的人；',
      '按时间顺序记叙一两个难忘的场景；',
      '结尾写出这次旅行带给你的感受或思考。',
    ],
    modelEssay: [
      'An Unforgettable Trip',
      'Last summer, my cousin and I visited a tropical island near the equator. Our guide was a farmer\u2019s son who once worked as a butcher in town.',
      'On the second day, we paddled a kayak across a bay so clear that fish passed under us like flying flowers. At dusk, we stood in silence while hundreds of little turtles hatched on the beach and raced to the sea.',
      'No photo could hold that moment. Since then, I have believed that the best part of travelling is not the picture, but the respect it teaches us for nature.',
    ],
    checklist: [
      '是否按「出行 — 场景 — 感受」组织，三个要点齐全？',
      '场景是否具体（有时间、光线、动作与比喻）？',
      '是否至少用到 3 个 Unit 2 词汇（如 tropical / equator / butcher / kayak / hatch / reptile）？',
      '是否使用倒装或 There be 存在句等描写句式？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit12WritingTasks;
