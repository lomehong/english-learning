import type { WritingTask } from '../types';

/**
 * 人教2019必修一 Unit 2（Travelling Around）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 2 词表），
 * 体裁对接教材单元写作板块（应用文旅行计划邮件 + 记叙文游记投稿）。
 * id 约定：u2- 前缀标识 Unit 2。
 */

export const unit2WritingTasks: WritingTask[] = [
  {
    id: 'u2-w1',
    title: 'Emailing a Travel Plan to a Friend',
    genre: '应用文 · 电子邮件',
    wordHint: '词数 80 左右',
    prompt:
      '你的英国朋友 Tom 得知你下个月要和家人去西安旅行，来信询问你的旅行安排。请根据以下要点，用英语给他写一封回信介绍你的旅行计划：',
    requirements: [
      '说明旅行的时间与目的地；',
      '介绍交通与住宿安排（如乘火车前往、已租好住处等）；',
      '介绍至少两项你们计划参观或体验的内容，并表达期待。',
    ],
    modelEssay: [
      'Dear Tom,',
      "Thanks for your email. I'm glad to tell you about my family's travel plan.",
      "Next month we are going to Xi'an by train. Dad has already rented a flat near the city centre, so we can walk to most of the sights. We have also booked tickets on the museum's official website.",
      'During the trip, we are going to see the Terracotta Warriors and ride bicycles along the old city wall. I hear the view from the wall is amazing, and I can\u2019t wait to admire it.',
      "I'll take some photos and share them with you after the trip.",
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（时间目的地、交通住宿、活动与期待）？',
      '是否正确使用一般将来时与现在完成时（are going to / have already …）？',
      '是否至少用到 3 个 Unit 2 词汇（如 rent / destination / sight / view / amazing / official）？',
      '语气是否自然友好，结尾是否表达分享或再联系的意愿？',
      '词数是否 80 左右，电子邮件格式（称呼、正文、落款）是否完整？',
    ],
  },
  {
    id: 'u2-w2',
    title: 'A Trip to Remember',
    genre: '记叙文 · 游记投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英文报「Travelling Around」栏目正在征文。请根据以下要点，以「A Trip to Remember」为题写一篇短文投稿，记叙你的一次旅行经历：',
    requirements: [
      '交代旅行的时间、目的地与同行的人；',
      '按时间顺序记叙旅途中的见闻与活动（至少两件具体的事）；',
      '写一段旅途中给你印象最深的画面（可用过去进行时描写背景），并谈谈感受。',
    ],
    modelEssay: [
      'A Trip to Remember',
      'Last National Day holiday, my parents and I took a train to Pingyao, an ancient town with a long history.',
      'On the first morning, we rented bicycles and rode along the narrow streets between grey stone houses. While we were riding, an old man was telling travellers stories about the town. We stopped and listened.',
      'The next day, we climbed the old city wall. I will never forget the view from the top: birds were flying over the grey roofs, and the whole town lay quietly in the sun. I have visited many places, but this is the most amazing sight I have ever seen.',
      'The trip taught me that travelling is not only about beautiful views, but also about people and their stories.',
    ],
    checklist: [
      '是否按时间顺序组织，三个要点齐全（时间地点人物、见闻活动、印象与感受）？',
      '是否正确使用过去进行时描写旅途场景（were riding / was telling / were flying）？',
      '是否至少用到 3 个 Unit 2 词汇（如 rent / narrow / view / sight / amazing / admire）？',
      '是否使用连接词（first / next / while / but 等）使叙事连贯？',
      '词数是否 100 左右，标题「A Trip to Remember」是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit2WritingTasks;