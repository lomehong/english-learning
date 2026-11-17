import type { WritingTask } from '../types';

/**
 * 人教2019必修二 Unit 4（History and Traditions）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用本单元词表），
 * 体裁与要求对接教材单元写作板块（应用文邀请信 + 记叙文栏目投稿）。
 */

export const unit9WritingTasks: WritingTask[] = [
  {
    id: 'u19-w1',
    title: 'Spending a Traditional Festival with My Family',
    genre: '应用文 · 邀请信（电子邮件）',
    wordHint: '词数 80 左右',
    prompt:
      '你的英国朋友 Alice 对中国传统节日很感兴趣。请根据以下要点，用英语给她写一封电子邮件，邀请她中秋节到你家做客：',
    requirements: [
      '说明写信目的：邀请 Alice 中秋节到你家过节；',
      '介绍当天的安排（拜访长辈、家宴、赏月吃月饼等传统习俗）；',
      '表达期待，询问对方是否愿意前来。',
    ],
    modelEssay: [
      'Dear Alice,',
      'I\u2019m writing to invite you to spend the Mid-Autumn Festival with my family next week.',
      'In the morning, we will follow an old custom and visit my grandpa, who will tell us stories about our ancestors. In the evening, a family feast will be prepared, and my mother will cook traditional dishes. After dinner, we will enjoy the full moon in the yard and share mooncakes, just as generations of my family have done.',
      'I believe you will feel the warmth of our traditions. Looking forward to your reply.',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的、当天安排、期待与询问）？',
      '是否至少用到 3 个本单元词汇（如 custom / ancestor / feast / tradition / generation）？',
      '是否正确使用一般将来时与被动语态（will be prepared）？',
      '邀请语气是否自然礼貌（I\u2019m writing to invite you… / Looking forward to…）？',
      '词数是否 80 左右，书信格式（称呼、正文、落款）是否完整？',
    ],
  },
  {
    id: 'u19-w2',
    title: 'A Walk into History',
    genre: '记叙文 · 栏目投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英文报「History」栏目正在征文。请根据以下要点，以「A Walk into History」为题，用英语写一篇短文投稿，记述你班参观市历史博物馆的经历：',
    requirements: [
      '交代参观地点及建筑本身的来历；',
      '描述参观所见（兵器、诗歌、地图、哲学家展厅等）；',
      '记录老师的话及你的感悟。',
    ],
    modelEssay: [
      'A Walk into History',
      'Last month, our class visited the history museum of our city. The building itself was a former royal palace, which made the visit exciting.',
      'A guide greeted us and led us from hall to hall. We saw the arms used in an ancient battle, the poems written by famous poets, and the maps of the kingdom drawn hundreds of years ago. What interested me most was a hall about a great philosopher. His words about kindness and study are still printed in our textbooks today.',
      'On the way home, our teacher said that history is not a faraway story but the root of our life. I could not agree more. When we understand where we came from, we walk more steadily towards the future.',
    ],
    checklist: [
      '是否按「总—分—总」结构组织，三个要点齐全？',
      '是否使用一般过去时叙述，过去分词作定语（arms used / poems written / maps drawn）运用正确？',
      '是否至少用到 3 个本单元词汇（如 royal / battle / poet / kingdom / philosopher）？',
      '是否使用连接词（What interested me most / On the way home 等）使行文连贯？',
      '词数是否 100 左右，标题「A Walk into History」是否保留？',
    ],
  },
];

const taskById = new Map(unit9WritingTasks.map((t) => [t.id, t]));

export function getWritingTask(id: string): WritingTask | undefined {
  return taskById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9WritingTasks;
