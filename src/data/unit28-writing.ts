import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修三 Unit 3（Environmental Protection）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 3 词表），
 * 体裁与要求对接教材单元写作板块（环保倡议书 + 绿色生活记叙文）。
 */

export const unit28WritingTasks: WritingTask[] = [
  {
    id: 'u28-w1',
    title: 'Saving Water on Our Campus',
    genre: '应用文 · 环保倡议书',
    wordHint: '词数 80 左右',
    prompt:
      '你市水资源紧张，学校团委发起节水行动。请用英语为校广播站写一份倡议书，号召全校同学节约用水：',
    requirements: [
      '说明背景（城市缺水）与倡议目的；',
      '提出至少三条节水做法（用水习惯、循环利用等）；',
      '发出号召，说明坚持行动的意义。',
    ],
    modelEssay: [
      'Saving Water on Our Campus',
      'Dear schoolmates,',
      'Do you know our city is short of water? Every drop matters, so the Student Union calls on everyone to save water on campus.',
      'Please turn off taps fully after use and report broken ones in time. Bring your own cup instead of buying bottled drinks. Water from washing can be reused to clean the floor or water the flowers.',
      'If each of us saves a little every day, the school will save a river in a year. Let us act now!',
      'The Student Union',
    ],
    checklist: [
      '是否涵盖全部三个要点（背景目的 / 具体做法 / 号召）？',
      '建议是否具体可操作（关紧水龙头、自带水杯、一水多用）？',
      '是否使用被动结构（taps must be turned off / water can be reused）等本单元语法点？',
      '是否至少用到 2 个 Unit 3 词汇（如 recycle / reusable / pollution / conservation）或相关环保表达？',
      '词数是否 80 左右，是否保留标题与落款？',
    ],
  },
  {
    id: 'u28-w2',
    title: 'A Green Change in My Family',
    genre: '记叙文 · 家庭变化',
    wordHint: '词数 100 左右',
    prompt:
      '请以“A Green Change in My Family”为题，用英语写一篇记叙文，讲述你的家庭为保护环境而做出的改变：',
    requirements: [
      '交代改变的起因（某件事或某部影片）；',
      '记叙家人的具体做法（垃圾分类、绿色出行、回收等）；',
      '描述改变后的效果与全家人的感受。',
    ],
    modelEssay: [
      'A Green Change in My Family',
      'Last year, my family made a plan to live a greener life after watching a film about pollution.',
      'At first, the changes were small. We sorted our rubbish, took reusable bags to the market, and turned off lights when leaving rooms. My father sold his old car and began to ride a bicycle to work. My mother planted vegetables on the balcony, and I collected used batteries for recycling.',
      'Months later, the results surprised us. Our electricity bill dropped, and the bins at home were never full. We also felt healthier because we walked and cycled more.',
      'Now protecting the environment has become a happy habit rather than a hard task for us.',
    ],
    checklist: [
      '是否按「起因 — 做法 — 效果」组织，三个要点齐全？',
      '做法是否具体（每位家人至少一件事），有没有使用不定式被动式（batteries needed to be recycled 类结构）？',
      '是否至少用到 3 个 Unit 3 词汇（如 recycle / pollution / disposable / renewable / vegetation）或相关表达？',
      '时态是否以一般过去时与一般现在时为主，过渡是否自然？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit28WritingTasks;
