import type { WritingTask } from '../types';

/**
 * 人教2019必修二 Unit 1（Cultural Heritage）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用本单元词表），
 * 体裁与要求对接教材单元写作板块（应用文倡议书 + 记叙文栏目投稿）。
 */

export const unit6WritingTasks: WritingTask[] = [
  {
    id: 'u6-w1',
    title: 'A Proposal for Protecting Heritage',
    genre: '应用文 · 倡议书',
    wordHint: '词数 80 左右',
    prompt:
      '你校英文报正开展「保护身边的文化遗产」主题活动。请根据以下要点，以校学生会的名义用英语写一份倡议书，刊登在校英文报上：',
    requirements: [
      '说明写信背景：家乡古老建筑（如古庙、城墙）正面临危险；',
      '提出至少三条具体倡议（宣传其故事 / 防止游客触摸 / 捐款支持修缮等）；',
      '发出号召，希望大家共同保护身边的文化遗产。',
    ],
    modelEssay: [
      'A Proposal for Protecting Heritage',
      'Dear schoolmates,',
      'Our old town is rich in cultural heritage. However, the ancient temple on East Mountain is in danger, and some relics have been broken.',
      'We, the student committee, make this proposal: first, let us learn more about local heritage and share its stories online to promote them; second, please prevent visitors from touching the carvings when you visit; third, you may donate your pocket money to help repair the old walls.',
      'Every small step counts. Let\u2019s work together to preserve the treasure of our town!',
      'The Student Committee',
    ],
    checklist: [
      '是否涵盖全部三个要点（背景、三条倡议、号召）？',
      '是否至少用到 3 个本单元词汇（如 heritage / preserve / promote / donate / committee）？',
      '倡议书格式（标题、称呼、落款）是否完整，语气是否有号召力？',
      '是否使用一般现在时，动词形式（第三人称单数等）正确？',
      '词数是否 80 左右？',
    ],
  },
  {
    id: 'u6-w2',
    title: 'An Unforgettable Day at the Museum',
    genre: '记叙文 · 栏目投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英文报「Culture」栏目正在征文。请根据以下要点，以「An Unforgettable Day at the Museum」为题，用英语写一篇短文投稿，介绍你班参观博物馆的经历：',
    requirements: [
      '交代参观的时间、地点与目的；',
      '描述最令你难忘的一个场景（如文物修复室）及专家的介绍；',
      '谈谈你的感悟（对文化遗产保护的理解）。',
    ],
    modelEssay: [
      'An Unforgettable Day at the Museum',
      'Last Saturday, our class visited the city museum to learn about cultural heritage. A professional guide led us through halls full of relics, from ancient coins to stone carvings.',
      'The most exciting part was the repair room. Through the glass, we watched experts document a newly found painting and preserve it with special tools. They told us that every relic must be treated with care and patience. Later, our team conducted a survey among visitors, and most of them were willing to donate money for heritage protection.',
      'On the bus home, I kept thinking about those quiet experts. Heritage carries the memory of the past, and now I understand why we must establish a balance between modern life and history.',
    ],
    checklist: [
      '是否按「总—分—总」结构组织，三个要点齐全？',
      '记叙是否使用一般过去时，并正确运用被动语态（must be treated 等）？',
      '是否至少用到 3 个本单元词汇（如 relic / professional / document / conduct / preserve）？',
      '是否使用连接词（Later / however / and now 等）使行文连贯？',
      '词数是否 100 左右，标题「An Unforgettable Day at the Museum」是否保留？',
    ],
  },
];

const taskById = new Map(unit6WritingTasks.map((t) => [t.id, t]));

export function getWritingTask(id: string): WritingTask | undefined {
  return taskById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6WritingTasks;
