import type { WritingTask } from '../types';

/**
 * 人教2019必修一 Unit 1（Teenage Life）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 1 词表），
 * 体裁与要求对接教材单元写作板块（应用文邀请信 + 栏目投稿记叙文）。
 */

export const unit1WritingTasks: WritingTask[] = [
  {
    id: 'w1',
    title: 'Inviting a Friend to Join a Club',
    genre: '应用文 · 邀请信',
    wordHint: '词数 80 左右',
    prompt:
      '你的英国朋友 Tom 来信说他对中国高中的社团活动很感兴趣。请根据以下要点，用英语给他写一封电子邮件，邀请他加入你所在的一个学校社团：',
    requirements: [
      '说明写信目的：邀请 Tom 加入你所在的社团；',
      '介绍该社团：名称、活动时间、至少两项主要活动；',
      '说明加入该社团的好处，并询问 Tom 的意向。',
    ],
    modelEssay: [
      'Dear Tom,',
      "I'm glad to hear that you are interested in school clubs in China. I'm writing to invite you to join the volunteer club in my school.",
      'Our club meets every Saturday morning. We usually visit the community library and read stories to young children. Sometimes we also clean up the park near our school.',
      'Being a volunteer will make your teenage life colourful. Would you like to join us? I am looking forward to your reply.',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的、社团介绍、好处与询问）？',
      '是否使用一般现在时，且动词形式（第三人称单数等）正确？',
      '是否至少用到 3 个 Unit 1 词汇（如 volunteer / suitable / teenage / prefer）？',
      '邀请语气是否自然礼貌（Would you like to... / I am looking forward to...）？',
      '词数是否 80 左右，书信格式（称呼、正文、落款）是否完整？',
    ],
  },
  {
    id: 'w2',
    title: 'My School Life',
    genre: '记叙文 · 栏目投稿',
    wordHint: '词数 100 左右',
    prompt:
      "你校英文报「Teenage Life」栏目正在征文。请根据以下要点，以「My School Life」为题写一篇短文投稿：",
    requirements: [
      '简要介绍你的学校生活（学习安排与课外活动）；',
      '介绍你最喜欢的一项学校活动及原因；',
      '谈谈你对高中生活的感受。',
    ],
    modelEssay: [
      'My School Life',
      'My name is Li Hua, a freshman at Green Hill Senior High School. My school life is busy but interesting.',
      'Every morning, I get up early and read English for twenty minutes. After class, I prefer to play basketball with my classmates. On Friday afternoons, I go to the debate club, where we discuss hot topics and practise speaking fluent English.',
      'What I like best is the debate club, because it trains me to think fast. Sometimes the questions are challenging, but we never give up.',
      'In a word, my new school life is busy but colourful. I will study hard and enjoy every day of it.',
    ],
    checklist: [
      '是否按「总—分—总」结构组织，三个要点齐全？',
      '是否使用一般现在时，并正确使用第三人称单数？',
      '是否至少用到 3 个 Unit 1 词汇（如 freshman / prefer / debate / challenge）？',
      '是否使用连接词（and / because / in a word 等）使行文连贯？',
      '词数是否 100 左右，标题「My School Life」是否保留？',
    ],
  },
];

const taskById = new Map(unit1WritingTasks.map((t) => [t.id, t]));

export function getWritingTask(id: string): WritingTask | undefined {
  return taskById.get(id);
}
