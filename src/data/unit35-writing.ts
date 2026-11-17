import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修四 Unit 5（Launching Your Career）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 5 词表），
 * 体裁与要求对接教材单元写作板块（求职申请 + 人物访谈短文）。
 */

export const unit15WritingTasks: WritingTask[] = [
  {
    id: 'u35-w1',
    title: 'Applying for a Summer Internship',
    genre: '应用文 · 求职申请信',
    wordHint: '词数 100 左右',
    prompt:
      '你校电台将在暑假招募两名实习记者（intern）。假设你是李华，请用英语写一封申请信，内容包括：',
    requirements: [
      '说明写信目的与申请的岗位；',
      '介绍自己的两项优势（如能力、经历或性格）；',
      '表达获得机会的愿望并致谢。',
    ],
    modelEssay: [
      'Dear Sir or Madam,',
      'I am Li Hua, a senior student, and I am writing to apply for the internship at the school radio station.',
      'I believe I am a suitable candidate for two reasons. First, an aptitude test showed my strength in language, and my class reports often read like clear prose. Second, I once participated in the school newspaper, where I learnt to interview people patiently.',
      'What attracts me most is that the station values honest work. I would be grateful for the chance, and I am ready for an interview at any time.',
      'Yours sincerely, Li Hua',
    ],
    checklist: [
      '是否覆盖三个要点（目的岗位 / 两项优势 / 愿望致谢）？',
      '优势是否有具体事例支撑，而非空泛形容词？',
      '是否至少用到 3 个 Unit 5 词汇（如 internship / candidate / aptitude / prose / participate / proficient）？',
      '是否使用主语从句或表语从句（如 What attracts me most is that…）？',
      '书信格式是否完整，词数是否 100 左右？',
    ],
  },
  {
    id: 'u35-w2',
    title: 'A Person with a Job I Admire',
    genre: '记叙文 · 人物短文',
    wordHint: '词数 100 左右',
    prompt:
      '请以“A Person with a Job I Admire”为题，用英语写一篇短文，介绍一位你敬佩的职业人物（可为身边人或公众人物）：',
    requirements: [
      '交代人物的身份与职业；',
      '用一两件具体事例说明其敬业或成长经历；',
      '说明这份职业或这个人对你未来规划的影响。',
    ],
    modelEssay: [
      'A Person with a Job I Admire',
      'The person I admire most is my aunt, a nurse who has worked in a small clinic for twenty years.',
      'When a storm cut off the village road, she walked through the muddy night to help a baby. Later, she used her savings and donations to set up a weekly health class for old people. Her employer once offered her a well-paid city job, but she chose to stay.',
      'Reading her story is like reading a quiet biography. It was she who planted in me the wish to study medicine and to serve people in need.',
    ],
    checklist: [
      '是否按「身份 — 事例 — 影响」组织，三个要点齐全？',
      '事例是否有细节（时间、场景、动作），避免空洞赞美？',
      '是否至少用到 3 个 Unit 5 词汇（如 profession / employer / biography / motivation / qualification / prospect）？',
      '是否使用虚拟语气或强调句（如 If I were given a chance… / It was she who…）？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit15WritingTasks;
