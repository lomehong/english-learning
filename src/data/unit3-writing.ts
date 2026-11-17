import type { WritingTask } from '../types';

/**
 * 人教2019必修一 Unit 3（Sports and Fitness）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 3 词表），
 * 体裁与要求对接教材单元写作板块（演讲稿 + 校刊记叙文投稿）。
 */

export const unit3WritingTasks: WritingTask[] = [
  {
    id: 'u3-w1',
    title: 'A Speech on Doing Sports',
    genre: '应用文 · 演讲稿',
    wordHint: '词数 80 左右',
    prompt:
      '学校「Sports and Fitness」主题班会即将举行。请根据以下要点，以李华的身份用英语写一篇简短演讲稿，号召同学们积极锻炼：',
    requirements: [
      '说明演讲目的：号召大家积极参加体育运动；',
      '结合自身经历：介绍一项你参加过的运动及带来的变化；',
      '发出倡议：提出一至两条切实可行的锻炼建议，并表达祝愿。',
    ],
    modelEssay: [
      'Dear classmates,',
      'Do you want to improve your fitness and enjoy a colourful life? Today I would like to share my sports story with you.',
      'Last term, I joined the school badminton club and trained in the gym twice a week. Soon I became stronger and seldom got sick. Now I am going to run the mini-marathon with my friends, and we will compete for our class.',
      'Sports bring us strength, health and friendship. Let us take exercise every day! Thank you.',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的、自身经历、倡议与祝愿）？',
      '一般过去时（joined / trained）与一般将来时（will / be going to）是否使用正确？',
      '是否至少用到 3 个 Unit 3 词汇（如 fitness / gym / compete / strength）？',
      '演讲语气是否有感染力（Let us... / Do you want to...）？',
      '词数是否 80 左右，演讲稿格式（称呼、正文、结束语）是否完整？',
    ],
  },
  {
    id: 'u3-w2',
    title: 'An Unforgettable Match',
    genre: '记叙文 · 校刊投稿',
    wordHint: '词数 100 左右',
    prompt: '你校英文报「Sports and Fitness」栏目正在征文。请根据以下要点，以「An Unforgettable Match」为题写一篇短文投稿：',
    requirements: [
      '交代比赛的时间、地点与对手；',
      '描述比赛过程（遇到的困难与你的坚持）；',
      '写出比赛结果与你的感悟，并可谈谈今后的打算。',
    ],
    modelEssay: [
      'An Unforgettable Match',
      'Last Friday afternoon, our class had a basketball match with Class 3 in the school stadium.',
      'In the first half, I missed several shots and felt nervous, but my coach and classmates cheered for me. I told myself to fight on with determination. In the last minute, I caught the ball, jumped and shot — two points!',
      'We won the match at last. All the spectators clapped happily. From this match, I learned that success comes from hard training and a strong heart. Next term, we will train harder and compete for the school championship.',
    ],
    checklist: [
      '是否按「赛前 — 过程 — 结果与感悟」结构组织，三个要点齐全？',
      '叙述比赛过程是否使用一般过去时（missed / caught / won），今后打算是否使用一般将来时（will train）？',
      '是否至少用到 3 个 Unit 3 词汇（如 stadium / coach / determination / spectators）？',
      '细节描写是否具体（动作、心理、现场气氛）？',
      '词数是否 100 左右，标题与段落是否完整？',
    ],
  },
];
