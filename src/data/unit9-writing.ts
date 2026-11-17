import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修一 Unit 4（Body Language）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 4 词表），
 * 体裁与要求对接教材单元写作板块（演讲稿 + 叙事短文）。
 */

export const unit9WritingTasks: WritingTask[] = [
  {
    id: 'u9-w1',
    title: 'The Power of Body Language',
    genre: '应用文 · 演讲稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语俱乐部将举行以“The Power of Body Language”为主题的英文演讲比赛。请你用英语写一篇演讲稿，谈谈身势语在交流中的作用：',
    requirements: [
      '说明身势语在日常交流中的重要性；',
      '举出至少两个身势语使用的例子或注意事项（可结合跨文化差异）；',
      '号召大家恰当使用身势语，改善沟通。',
    ],
    modelEssay: [
      'Good afternoon, everyone. I am glad to share my ideas about the power of body language.',
      'As we all know, words are not the only way to communicate. In fact, our gestures, eye contact and facial expressions often speak louder than our voices. A warm smile can break down barriers between strangers, while folded arms may make others feel unwelcome.',
      'However, body language varies from culture to culture. The thumbs-up sign means approval in many countries, but it is impolite somewhere else. Therefore, we should learn to interpret gestures properly and adjust our own manners when talking with foreign friends.',
      'Let us use appropriate body language, so that every conversation becomes warmer and clearer. Thank you!',
    ],
    checklist: [
      '是否涵盖全部三个要点（重要性 / 例子与注意事项 / 号召）？',
      '演讲稿格式是否完整（称呼、开头、结尾致谢）？',
      '是否至少用到 3 个 Unit 4 词汇（如 gesture / barrier / interpret / appropriate / manner）？',
      '是否使用动词-ing形式（如 folded arms / talking with foreign friends 等结构）？',
      '词数是否 100 左右，语气是否有感染力？',
    ],
  },
  {
    id: 'u9-w2',
    title: 'A Misunderstanding Caused by a Gesture',
    genre: '记叙文 · 叙事短文',
    wordHint: '词数 100 左右',
    prompt:
      '请以“A Misunderstanding Caused by a Gesture”为题，用英语写一篇记叙文，讲述一次由手势或身势语引起的（真实或想象的）小误会：',
    requirements: [
      '交代事情发生的时间、地点与人物；',
      '记叙误会发生的经过（这个身势语表达了什么、对方如何理解）；',
      '写明误会如何解开及你的感悟。',
    ],
    modelEssay: [
      'A Misunderstanding Caused by a Gesture',
      'Last term, a group of exchange students visited our school, and I was chosen to welcome a boy named Tom from Australia.',
      'At lunch, I saw him resting his chin on his hand, looking a little uneasy. Wanting to show friendliness, I gave him the thumbs-up when he tried our school noodles. To my surprise, he slightly bent his head and said nothing. Later, our teacher told me that in his hometown, that gesture sometimes sounds like a joke about people, so he felt uncomfortable.',
      'I apologised and explained my true meaning, and soon we were laughing together. This small misunderstanding taught me that body language varies across cultures, and a ready smile is always the safest greeting.',
    ],
    checklist: [
      '是否按「起因 — 经过 — 解开与感悟」组织，三个要点齐全？',
      '误会经过是否具体（身势语、双方的理解都写清楚）？',
      '是否至少用到 3 个 Unit 4 词汇（如 chin / uneasy / slightly / gesture / manner）？',
      '叙事时态是否以一般过去时为主，感悟是否自然点题？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9WritingTasks;
