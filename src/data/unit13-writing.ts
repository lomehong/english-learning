import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修四 Unit 3（Sea Exploration）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 3 词表），
 * 体裁与要求对接教材单元写作板块（倡议短文 + 延续写作）。
 */

export const unit13WritingTasks: WritingTask[] = [
  {
    id: 'u13-w1',
    title: 'Protecting the Ocean Starts with Us',
    genre: '应用文 · 倡议短文',
    wordHint: '词数 100 左右',
    prompt:
      '6 月 8 日是世界海洋日。请你以“Protecting the Ocean Starts with Us”为题，用英语为校刊写一篇短文，内容包括：',
    requirements: [
      '说明海洋的重要性（资源、气候或生计）；',
      '指出海洋面临的一两个问题；',
      '提出至少两条具体可行的保护建议并发出倡议。',
    ],
    modelEssay: [
      'Protecting the Ocean Starts with Us',
      'The sea is the foundation of life on earth. It feeds billions of people, moderates our climate, and still keeps countless secrets for marine scientists to explore.',
      'However, plastic waste kills birds and fish, and some coral gardens are dying in warmer water.',
      'To protect the blue heart of our planet, we should refuse single-use plastics, join beach clean-ups, and spread knowledge about the sea. It is urgent to act, for to protect the ocean is to protect ourselves.',
    ],
    checklist: [
      '是否覆盖三个要点（重要性 / 问题 / 建议与倡议）？',
      '建议是否具体可行，而不是空喊口号？',
      '是否至少用到 3 个 Unit 3 词汇（如 marine / coral / voyage / extend / mixture / possess）？',
      '是否使用不定式作主语或状语（如 It is urgent to act / To protect… is to…）？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
  {
    id: 'u13-w2',
    title: 'A Page from Grandpa\u2019s Log',
    genre: '记叙文 · 故事续写',
    wordHint: '词数 100 左右',
    prompt:
      '故事梗概：爷爷留下的一本旧航海日志记录了 1962 年的一次远航，最后一页画着一座珊瑚岛。请以“那天夜里”为开头，用英语续写水手们抵达珊瑚岛前的经历：',
    requirements: [
      '描写夜航中的环境与船员的状态（可用 with 复合结构）；',
      '记叙一次突发状况及船长的决定；',
      '以抵达珊瑚岛的黎明收尾，呼应“值得整个航程”的感叹。',
    ],
    modelEssay: [
      'A Page from Grandpa\u2019s Log',
      'That night, with the storm drawing near, the little fleet slowed down in the dark. The sailors held their breath, and only the sound of waves knocked the deck.',
      'Suddenly, a cry came from the watch tower: rocks ahead! The merciful captain ordered the ships to withdraw, turn, and wait for the dawn. Nobody argued, for every life on board mattered to him.',
      'When the sun rose, a coral island lay before them like a jewel. It was a sight to behold, the old log says, worth the whole voyage.',
    ],
    checklist: [
      '是否按「环境 — 突发与决定 — 黎明收尾」组织，三个要点齐全？',
      '是否使用 with 复合结构与过去分词作状语（如 with the storm drawing near / Held by fear…）？',
      '是否至少用到 3 个 Unit 3 词汇（如 fleet / withdraw / behold / coral / merciful / log）？',
      '记叙是否使用一般过去时并保持时态一致？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit13WritingTasks;
