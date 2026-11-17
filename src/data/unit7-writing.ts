import type { WritingTask } from '../types';

/**
 * 人教2019必修三 Unit 2（Morals and Virtues）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 7 词表），
 * 体裁与要求对接教材单元写作板块（应用文感谢信 + 记叙文栏目投稿）。
 */

export const unit7WritingTasks: WritingTask[] = [
  {
    id: 'u7-w1',
    title: 'A Thank-You Letter to a Kind Neighbour',
    genre: '应用文 · 感谢信',
    wordHint: '词数 80 左右',
    prompt:
      '上周你的奶奶在小区里突然晕倒，邻居李医生及时施救并陪她去医院。请用英语给李医生写一封感谢信：',
    requirements: [
      '说明写信目的：感谢他对奶奶的及时救助；',
      '简述事情经过（如：突然晕倒、及时赶到、送往医院、脱离危险）；',
      '再次表达感激之情，并送上美好祝福。',
    ],
    modelEssay: [
      'Dear Dr Li,',
      'I am writing to express my sincere thanks for your kindness to my grandmother last week.',
      'When she suddenly fainted in our neighbourhood, you rushed to her within minutes. You assisted her calmly and went with her to the hospital. Thanks to your timely help, she is now out of danger and recovering well.',
      'Your generosity and sense of duty moved our whole family deeply. We are so lucky to have a neighbour like you. Please accept our heartfelt gratitude, and we wish you good health and happiness.',
      'Yours sincerely,',
      'Wang Fang',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的、经过、感激与祝福）？',
      '事情经过是否交代清楚（晕倒—施救—送医—脱险）？',
      '是否至少用到 3 个 Unit 7 词汇（如 faint / assist / kindness / generous / respond）？',
      '感谢信格式是否完整（称呼、落款），语气是否真诚？',
      '词数是否 80 左右，是否避免逐句翻译中文提示？',
    ],
  },
  {
    id: 'u7-w2',
    title: 'Kindness Around Us',
    genre: '记叙文 · 栏目投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语报“Kindness Around Us”栏目正在征稿。请根据以下要点，用英语写一篇短文投稿，讲述你亲身经历或目睹的一件善事：',
    requirements: [
      '交代事件背景：时间、地点、人物；',
      '描述善事的经过（如：帮助迷路老人、为生病同学补课、公交车上让座施救等）；',
      '谈谈你的感受或这件事给你的启示（如：善良是美德、帮助他人快乐自己）。',
    ],
    modelEssay: [
      'Kindness Around Us',
      'Last Sunday afternoon, on my way home from the library, I saw an old lady standing at a busy crossing, looking worried and confused.',
      'A young student walked up to her and asked what was wrong. It turned out that the lady had lost her way and could not remember the name of her street. The student patiently checked the address in her bag, assisted her onto the right bus, and even told the driver to remind her where to get off. Before leaving, the old lady held his hand and thanked him with tears in her eyes.',
      'Kindness does not have to be a big deed. As this story illustrates, a small act of warmth can light up someone\u2019s day. Helping others is a virtue, and it brings happiness to both others and ourselves.',
    ],
    checklist: [
      '是否按「背景 — 经过 — 感受」组织，三个要点齐全？',
      '经过描述是否具体（人物、动作、结果），内容是否真实可信？',
      '是否至少用到 3 个 Unit 7 词汇（如 kindness / assist / virtue / precious / illustrate）？',
      '叙述过去的经历是否使用一般过去时，时态是否一致？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7WritingTasks;
