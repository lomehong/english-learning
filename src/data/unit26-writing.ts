import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修三 Unit 1（Art）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 1 词表），
 * 体裁与要求对接教材单元写作板块（邀请信 + 参观见闻记叙文）。
 */

export const unit26WritingTasks: WritingTask[] = [
  {
    id: 'u26-w1',
    title: 'Inviting an Artist to Our School',
    genre: '应用文 · 邀请信',
    wordHint: '词数 80 左右',
    prompt:
      '你校艺术周将至。请用英语给本地画家陈先生写一封邀请信，邀请他来校作一场关于传统绘画的讲座，内容包括：',
    requirements: [
      '说明写信目的与活动背景（学校艺术周）；',
      '告知讲座的时间、地点及希望他展示的内容；',
      '表达期待与感谢，请他尽早回复。',
    ],
    modelEssay: [
      'Inviting an Artist to Our School',
      'Dear Mr Chen,',
      'I am Li Hua, chairman of the school art club. I am writing to invite you to give a talk about traditional Chinese painting at our Art Week.',
      'The talk will be held in the school hall from three to five on Friday afternoon. It would be wonderful if you could bring one of your watercolours and show us how a sketch grows into a finished work.',
      'We would feel honoured if you could accept our invitation. Looking forward to your reply.',
      'Yours sincerely,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的背景 / 时间地点与内容 / 期待回复）？',
      '是否使用了礼貌表达（I am writing to invite you… / It would be wonderful…）？',
      '是否至少用到 2 个 Unit 1 词汇（如 watercolour / sketch / exhibition / painter）？',
      '格式是否完整（称呼、正文、落款），时态是否以一般将来时与一般现在时为主？',
      '词数是否 80 左右，是否保留标题？',
    ],
  },
  {
    id: 'u26-w2',
    title: 'An Unforgettable Visit to the Gallery',
    genre: '记叙文 · 参观见闻',
    wordHint: '词数 100 左右',
    prompt:
      '请以“An Unforgettable Visit to the Gallery”为题，用英语写一篇记叙文，记述你参观一次画展（或美术馆）的经历与感受：',
    requirements: [
      '交代参观的时间、地点与背景；',
      '描写你看到的一至两件作品（雕塑、水彩、壁画等）及讲解；',
      '写出这次参观带给你的感受或启发。',
    ],
    modelEssay: [
      'An Unforgettable Visit to the Gallery',
      'Last Saturday, our class visited the City Gallery, where a new exhibition of modern art had just opened.',
      'At the entrance stood a bronze sculpture of a running horse. Inside, we saw watercolours, portraits, and a huge mural full of vivid colours. Our guide, a young painter, explained how each sketch slowly became a finished masterpiece. Her words were simple, but they opened a new world for me.',
      'Before leaving, I stood in front of an abstract painting for a long time. Although I could not fully understand it, I felt its quiet power. Art, I realised, is not only to be seen but also to be felt with the heart.',
    ],
    checklist: [
      '是否按「背景 — 见闻 — 感受」组织，三个要点齐全？',
      '描写是否具体（提到具体的作品类型与细节），而不是空泛评价？',
      '是否至少用到 3 个 Unit 1 词汇（如 gallery / sculpture / watercolour / mural / vivid / abstract / masterpiece）？',
      '是否使用了完全倒装或部分倒装（如 At the entrance stood… / Not only…）等本单元语法结构？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit26WritingTasks;
