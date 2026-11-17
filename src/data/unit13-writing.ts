import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修二 Unit 3（Food and Culture）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 3 词表），
 * 体裁与要求对接教材单元写作板块（推荐信 + 学做菜记叙文）。
 */

export const unit13WritingTasks: WritingTask[] = [
  {
    id: 'u13-w1',
    title: 'Recommending Chinese Food to Foreign Guests',
    genre: '应用文 · 推荐信',
    wordHint: '词数 100 左右',
    prompt:
      '一批外国交换生将到你校交流一周，请你以学生会名义用英语写一封邮件，向他们推荐中国美食并介绍饮食文化中的健康原则：',
    requirements: [
      '推荐两三样有代表性的中国菜肴及其风味（如蒸鱼、炒青菜等）；',
      '介绍中国饮食的健康原则（如食量适中、荤素搭配）；',
      '邀请对方到校后一同品尝，表达欢迎。',
    ],
    modelEssay: [
      'Dear friends,',
      'Welcome to our school! It is a great pleasure to recommend some Chinese food to you before you arrive.',
      'Steamed fish is a classic dish in Chinese cuisine. Cooked with ginger and a little oil, it keeps the fresh flavour of the sea. Another must-try is fried rice with vegetables, which consists of rice, eggs and seasonal ingredients. If you like something sweet, fruit salad can be served as dessert after the meal.',
      'It is also worth knowing that Chinese people hold a healthy principle: the quantity of each dish should be moderate, and vitamins from vegetables are regarded as fundamental to a balanced diet.',
      'We are looking forward to tasting these dishes with you soon!',
      'Yours,',
      'The Student Union',
    ],
    checklist: [
      '是否涵盖全部三个要点（推荐菜肴与风味 / 健康原则 / 邀请品尝）？',
      '是否使用 it 作形式主语或形式宾语（如 It is a great pleasure to… / It is worth knowing that… / …are regarded as…）？',
      '是否至少用到 3 个 Unit 3 词汇（如 cuisine / steam / fry / flavour / dessert / quantity / moderate / vitamin / fundamental / ingredient）？',
      '菜肴介绍是否具体（食材、做法、风味），语气是否热情得体？',
      '词数是否 100 左右，邮件格式是否完整？',
    ],
  },
  {
    id: 'u13-w2',
    title: 'Learning to Cook My First Dish',
    genre: '记叙文 · 写事叙事',
    wordHint: '词数 100 左右',
    prompt:
      '请以“Learning to Cook My First Dish”为题，用英语写一篇记叙文，讲述你第一次为家人做菜的经历（可以是一道简单的菜，如西红柿炒蛋或蒸蛋羹）：',
    requirements: [
      '交代做菜的起因（如节日、感恩父母）与准备过程（食材、菜谱）；',
      '记叙做菜过程中遇到的困难及解决办法（如火候、调味）；',
      '写明结果（家人评价）与你的感受。',
    ],
    modelEssay: [
      'Learning to Cook My First Dish',
      'Last Sunday was my mother\u2019s birthday, so I decided to cook tomato and egg for the whole family.',
      'Prior to cooking, I found a simple recipe online and prepared all the ingredients: three tomatoes, two eggs and a little sugar. I first sliced the tomatoes, then fried the eggs until they turned golden. It seemed easy in the video, but I found it hard to control the fire, and the first piece of egg almost got burnt. Following my grandmother\u2019s advice on the phone, I stayed calm and seasoned the dish carefully.',
      'When my parents tasted it, they gave me a big thumbs-up and said the flavour was exceptional. I finally understand that it takes patience and love to turn simple ingredients into a delicious meal.',
    ],
    checklist: [
      '是否按「起因与准备 — 困难与解决 — 结果与感受」组织，三个要点齐全？',
      '是否使用 it 作形式主语或形式宾语（如 I found it hard to control the fire / It takes patience and love to…）？',
      '是否至少用到 3 个 Unit 3 词汇（如 recipe / ingredient / slice / fry / flavour / exceptional / steam）？',
      '记叙是否有具体细节（动作、对话、心理），而不是流水账？',
      '词数是否 100 左右，标题是否保留，时态是否以一般过去时为主？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit13WritingTasks;
