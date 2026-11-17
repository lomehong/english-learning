import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修二 Unit 4（Journey Across a Vast Land）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 4 词表），
 * 体裁与要求对接教材单元写作板块（旅行分享邮件 + 观光建议邮件）。
 */

export const unit14WritingTasks: WritingTask[] = [
  {
    id: 'u14-w1',
    title: 'Sharing My Train Journey Across Canada',
    genre: '应用文 · 旅行分享邮件',
    wordHint: '词数 100 左右',
    prompt:
      '你刚结束一次加拿大的火车旅行，请用英语给你的英国朋友 Peter 写一封邮件，分享这段跨越广袤大地的旅程见闻：',
    requirements: [
      '概述旅行路线与方式（如从温哥华乘火车到多伦多）；',
      '描述旅途中最难忘的风景与经历（如野生动物、枫叶、黄昏）；',
      '邀请对方有机会同行，并询问其近况。',
    ],
    modelEssay: [
      'Dear Peter,',
      'How is everything going? I have just returned from a rail journey across Canada, and I cannot wait to share it with you.',
      'We went aboard the train in Vancouver, a beautiful city by the bay, and crossed the vast land all the way to Toronto. For nine days, we had been travelling through breathtaking scenery: snow-capped mountains, golden maple trees, and rare wildlife such as bears and eagles. The highlight came at dusk in a provincial park, when the whole sky turned orange behind the quiet hills.',
      'Photos can hardly show how spectacular the view was. If you have a chance, let us wander along those old streets together next autumn. Looking forward to your reply.',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（路线方式 / 难忘见闻 / 邀请同行并问候）？',
      '是否使用现在完成进行时（如 We had been travelling… 亦可用 we have been travelling）或含情态动词的被动语态（如 Tickets should be booked early）？',
      '是否至少用到 3 个 Unit 4 词汇（如 aboard / rail / bay / maple / wildlife / dusk / spectacular / breathtaking / highlight / provincial / wander）？',
      '风景描写是否具体生动（色彩、时间、感受），而不是罗列名词？',
      '词数是否 100 左右，邮件格式（称呼、落款）是否完整？',
    ],
  },
  {
    id: 'u14-w2',
    title: 'Suggestions for a Friend\u2019s Trip to Canada',
    genre: '应用文 · 观光建议邮件',
    wordHint: '词数 100 左右',
    prompt:
      '你的加拿大网友 Mike 计划暑假乘火车横穿加拿大旅行，写信请你提建议。请用英语给他回一封邮件，就行程安排与注意事项提出建议：',
    requirements: [
      '建议最佳出行时间与理由（如秋季枫叶、天气）；',
      '推荐沿途必看景点或活动（如省立公园观野生动物、逛古董店）；',
      '提醒注意事项（如提前订票、准备相机等）。',
    ],
    modelEssay: [
      'Dear Mike,',
      'I am very happy to hear about your plan to travel across Canada by rail this summer. Here is my advice.',
      'In my opinion, October is the best time to set off, because the maple trees along the border of the mountains turn golden then. On the way, you should not miss the provincial parks, where wildlife such as bears and eagles can often be seen at dusk. It is also fun to wander around the antique shops in the old urban streets near the station.',
      'Besides, seats in July and August sell out quickly, so tickets should be booked early, and a good camera must be packed, for the scenery is literally breathtaking. Have a nice journey!',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（最佳时间与理由 / 必看景点活动 / 注意事项）？',
      '是否使用含情态动词的被动语态（如 tickets should be booked early / a good camera must be packed）？',
      '是否至少用到 3 个 Unit 4 词汇（如 rail / border / maple / provincial / wildlife / dusk / antique / urban / literally / breathtaking）？',
      '建议是否有针对性（贴合火车旅行场景），条理是否清晰（first / besides…）？',
      '词数是否 100 左右，邮件格式是否完整，语气是否友好？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit14WritingTasks;
