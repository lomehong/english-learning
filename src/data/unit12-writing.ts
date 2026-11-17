import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修二 Unit 2（Bridging Cultures）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 2 词表），
 * 体裁与要求对接教材单元写作板块（建议信 + 主题演讲稿）。
 */

export const unit12WritingTasks: WritingTask[] = [
  {
    id: 'u12-w1',
    title: 'Advice for a Friend Going Abroad',
    genre: '应用文 · 建议信',
    wordHint: '词数 100 左右',
    prompt:
      '你的英国朋友 Chris 将作为交换生来中国学习一年，他写信向你询问如何尽快适应在中国的学习和生活。请用英语给他写一封回信，提出你的建议：',
    requirements: [
      '表示欢迎并回应对方的担心（如语言、饮食、习俗）；',
      '提出至少两条具体建议（如学中文习语、多参加活动、保持乐观）；',
      '表达你对他在中国生活的美好祝愿。',
    ],
    modelEssay: [
      'Dear Chris,',
      'I am so glad to hear that you will study in China as an exchange student. You worry that language and customs may be hurdles, but I believe you will adapt to the new life soon.',
      'Here is my advice. First, try to learn some common Chinese idioms before you come, because they can help you understand what local people really mean. Second, participate in school activities as often as possible, such as the tea ceremony club, where you can make friends and embrace our traditions. Finally, stay optimistic when you feel homesick, and never hesitate to turn to your tutor for help.',
      'Studying abroad will certainly widen your horizon. I am looking forward to seeing you in China!',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（回应担心 / 具体建议 / 美好祝愿）？',
      '是否使用名词性从句（如 I believe (that) you will adapt… / what local people really mean / Studying abroad will widen your horizon）？',
      '是否至少用到 3 个 Unit 2 词汇（如 adapt / hurdle / idiom / participate / tutor / optimistic / homesick / horizon）？',
      '建议是否具体可行，语气是否友好自然？',
      '词数是否 100 左右，书信格式（称呼、落款）是否完整？',
    ],
  },
  {
    id: 'u12-w2',
    title: 'Bridging Cultures, Building Friendship',
    genre: '应用文 · 主题演讲稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语社团将举办以“Bridging Cultures”为主题的演讲比赛。请用英语写一篇演讲稿，谈谈青年学生应如何成为中外文化沟通的桥梁：',
    requirements: [
      '点明文化交流的意义（开阔眼界、增进理解）；',
      '提出具体做法（如学习外语与习俗、分享中国文化、结交外国朋友）；',
      '发出号召，结束演讲。',
    ],
    modelEssay: [
      'Bridging Cultures, Building Friendship',
      'Good afternoon, everyone. It is a great honour for me to share my ideas on bridging cultures.',
      'As we all know, cultural exchange widens our horizon and strengthens the understanding between people from different countries. That is why we young students should act as bridges.',
      'In my opinion, what we can do is far more than studying a foreign language. We should also learn the traditions and customs behind it, introduce Chinese culture to foreign friends through presentations, and embrace a variety of perspectives with sympathy and respect.',
      'Let us start from small things and strengthen the friendship between cultures. Thank you for listening!',
    ],
    checklist: [
      '是否按「意义 — 做法 — 号召」组织，三个要点齐全？',
      '是否使用名词性从句（如 That is why… / what we can do is… / whether we can…）？',
      '是否至少用到 3 个 Unit 2 词汇（如 horizon / tradition / presentation / embrace / variety / sympathy / strengthen）？',
      '演讲稿格式是否得当（称呼语、结束语），是否有号召力？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit12WritingTasks;
