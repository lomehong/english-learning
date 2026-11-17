import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修四 Unit 4（Sharing）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 4 词表），
 * 体裁与要求对接教材单元写作板块（志愿经历报道 + 感谢信）。
 */

export const unit14WritingTasks: WritingTask[] = [
  {
    id: 'u14-w1',
    title: 'Volunteers in the Mountain School',
    genre: '应用文 · 校园报道',
    wordHint: '词数 100 左右',
    prompt:
      '你校志愿者小组上周去一所山村小学开展了帮扶活动。请用英语为校报写一篇报道，介绍这次活动：',
    requirements: [
      '交代活动的时间、地点与参加人员；',
      '具体描述两三项活动内容（如捐赠、义诊、缝纫教学等）；',
      '引用一位同学或村民的感受，并总结活动意义。',
    ],
    modelEssay: [
      'Volunteers in the Mountain School',
      'Last Friday, fifteen student volunteers visited a primary school in a remote mountain village.',
      'During the day, they donated picture books, distributed food to poor families, and helped a city doctor operate a small clinic. Girls from the tailor club also taught the children to sew warm hats for winter.',
      'The road was muddy after the rain, but no one complained. "It is we who received the greater gift," said Li Mei, our team leader. Sharing, indeed, lights both the giver and the receiver.',
    ],
    checklist: [
      '是否覆盖三个要点（时间地点人员 / 活动内容 / 感受与意义）？',
      '活动描述是否具体（动词、对象、结果），避免流水账？',
      '是否至少用到 3 个 Unit 4 词汇（如 donate / distribute / clinic / tailor / muddy / remote）？',
      '是否使用过去分词作定语或状语（如 the food distributed / Tired but happy, …）？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
  {
    id: 'u14-w2',
    title: 'A Thank-you Letter to the Volunteers',
    genre: '应用文 · 感谢信',
    wordHint: '词数 100 左右',
    prompt:
      '假设你是受助山村学校的学生代表李华。志愿者小组刚结束在你校的帮扶活动返回城市。请用英语给带队的陈老师写一封感谢信，内容包括：',
    requirements: [
      '说明写信目的并回顾志愿者带来的帮助（图书、义诊、住房或缝纫教学）；',
      '描述学校或村庄因此发生的变化；',
      '表达感谢并邀请对方再次来访。',
    ],
    modelEssay: [
      'Dear Mr Chen,',
      'I am writing on behalf of our whole school to thank you and your volunteers for the week you spent with us.',
      'The books you donated have filled our empty shelf, and the doctor who operated in the small clinic saved my brother\u2019s arm. Thanks to the sewing lessons, six mothers can now make school uniforms, and their work brings both warmth and stability to the village.',
      'We drank a toast to your health on the last evening, and we meant every word. Please come and see us again next spring.',
      'Yours sincerely, Li Hua',
    ],
    checklist: [
      '是否覆盖三个要点（感谢与回顾 / 变化 / 邀请）？',
      '书信格式是否完整（称呼、落款）？',
      '是否至少用到 3 个 Unit 4 词汇（如 donate / operate / stability / weekly / toast / housing）？',
      '是否使用过去分词作定语（如 the books donated / a boy saved by the doctor）？',
      '词数是否 100 左右？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit14WritingTasks;
