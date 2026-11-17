import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修一 Unit 1（People of Achievement）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 1 词表），
 * 体裁与要求对接教材单元写作板块（人物专栏投稿 + 写人记叙文）。
 */

export const unit6WritingTasks: WritingTask[] = [
  {
    id: 'u6-w1',
    title: 'Introducing a Person of Achievement',
    genre: '应用文 · 人物专栏投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语报“People of Achievement”专栏正在征稿。请用英语写一篇短文投稿，介绍一位你敬佩的卓越人物（如科学家、医生、教师等）：',
    requirements: [
      '点明人物身份及其主要成就；',
      '用事例说明其优秀品质（如奉献、坚持、谦逊等）；',
      '说明该人物对你的影响或启发。',
    ],
    modelEssay: [
      'A Person I Truly Admire',
      'The person I admire most is Doctor Wang, who works at the local hospital near my school.',
      'During last winter\u2019s heavy snowstorm, he insisted on staying at the hospital for a whole week, saving more than thirty patients. Although he has won several honours, he always acknowledges that he is just doing his duty. His devotion to patients never changes, whether it is a sunny morning or a snowy night.',
      'His story has taught me that achievement is not about fame but about commitment. From now on, I will devote myself to my studies with the same passion, and I hope to become a person who brings light to others.',
    ],
    checklist: [
      '是否涵盖全部三个要点（身份成就 / 优秀品质事例 / 对你的影响）？',
      '是否使用非限制性定语从句（如 who works at… / he always acknowledges that…）？',
      '是否至少用到 3 个 Unit 1 词汇（如 devote / insist / acknowledge / commitment / passion）？',
      '结构是否清晰（总起 — 事例 — 影响），时态是否以一般过去时与一般现在时为主？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
  {
    id: 'u6-w2',
    title: 'The Person Who Influenced Me Most',
    genre: '记叙文 · 写人叙事',
    wordHint: '词数 100 左右',
    prompt:
      '请以“The Person Who Influenced Me Most”为题，用英语写一篇记叙文，讲述一位深刻影响过你的人（可以是老师、家人或同学）的一段经历：',
    requirements: [
      '交代人物及其与你的关系；',
      '记叙一件具体事情，说明其如何影响了你；',
      '表达你对该人物的感激或评价。',
    ],
    modelEssay: [
      'The Person Who Influenced Me Most',
      'The person who has influenced me most is my grandfather, a retired professor of physics.',
      'Every clear evening, he would carry his old telescope to the yard and show me the stars. He once told me that a person should stay curious for a whole lifetime. Although his telescope was simple, his passion for the sky was extraordinary. Gradually, I began to love science too, and I learnt that great achievements often start from small hobbies.',
      'Now, whenever I meet difficulties in my studies, I think of my grandfather and his shining eyes under the stars. I am truly grateful to him, for he planted the seed of curiosity in my heart.',
    ],
    checklist: [
      '是否按「人物 — 事例 — 影响」组织，三个要点齐全？',
      '记叙的事例是否具体（有时间、场景与细节），而不是空泛评价？',
      '是否至少用到 3 个 Unit 1 词汇（如 professor / passion / gradually / extraordinary / commitment）？',
      '是否使用定语从句（如 The person who… / a person should…）？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6WritingTasks;
