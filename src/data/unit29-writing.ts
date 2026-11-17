import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修三 Unit 4（Adversity and Courage）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 4 词表），
 * 体裁与要求对接教材单元写作板块（演讲稿 + 战胜自我记叙文）。
 */

export const unit29WritingTasks: WritingTask[] = [
  {
    id: 'u29-w1',
    title: 'Never Give Up',
    genre: '应用文 · 演讲稿',
    wordHint: '词数 80 左右',
    prompt:
      '学校将举办以“Courage”为主题的英语演讲比赛。请用英语写一篇演讲稿，结合自身或他人的经历，谈谈如何面对逆境：',
    requirements: [
      '以问题或问候开场，点明演讲主题；',
      '用一段亲身经历或他人事例说明道理；',
      '以号召性语句结尾，鼓舞听众。',
    ],
    modelEssay: [
      'Never Give Up',
      'Dear teachers and schoolmates,',
      'Have you ever felt like giving up when facing difficulties? Today I want to share one belief: every hardship carries a gift.',
      'Last term, I failed two exams and almost lost heart. Then I read about a runner who trained on a prosthetic leg and returned to the track. Her courage lit a lamp in my heart.',
      'Dear friends, a setback is not the end of the story; it is the turn of a page. Stand up one more time than you fall down!',
      'Thank you.',
    ],
    checklist: [
      '是否涵盖全部三个要点（开场点题 / 事例说理 / 号召结尾）？',
      '事例是否具体，是否用到让步状语从句（although / even though）？',
      '是否至少用到 3 个 Unit 4 词汇（如 hardship / setback / courage / overcome / adversity）？',
      '演讲语气是否真挚有力，有无与听众的互动（Have you ever…）？',
      '词数是否 80 左右，是否保留标题？',
    ],
  },
  {
    id: 'u29-w2',
    title: 'The Day I Overcame My Fear',
    genre: '记叙文 · 战胜自我',
    wordHint: '词数 100 左右',
    prompt:
      '请以“The Day I Overcame My Fear”为题，用英语写一篇记叙文，讲述你战胜某种恐惧或困难的经历：',
    requirements: [
      '描述你曾经的恐惧及具体表现；',
      '记叙改变发生的经过（谁的鼓励、如何练习、关键一刻）；',
      '写出事后的收获与感悟。',
    ],
    modelEssay: [
      'The Day I Overcame My Fear',
      'I used to fear speaking in public. Whenever the teacher asked me to answer questions, my voice trembled and my mind went blank.',
      'Last autumn, our English teacher encouraged me to enter the school speech contest. I wanted to run away, but she said every obstacle is a door to growth. So I practised day after day, first before the mirror, then before my family.',
      'On the day of the contest, my legs shook, but I walked onto the stage. Halfway through my speech, I found my voice clear and strong. I did not win first prize, yet I won something larger: the courage to face my fear.',
      'Since that day, when difficulty knocks, I step forward.',
    ],
    checklist: [
      '是否按「恐惧表现 — 克服经过 — 收获感悟」组织，三个要点齐全？',
      '关键一刻是否有细节描写（腿在抖、声音变清晰），而不是只说结果？',
      '是否至少用到 3 个 Unit 4 词汇（如 fear / obstacle / courage / overcome / tremble）？',
      '是否使用让步状语从句（although / even though）或 no sooner…than 类结构？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit29WritingTasks;
