import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修四 Unit 1（Science Fiction）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 1 词表），
 * 体裁与要求对接教材单元写作板块（科幻故事续写 + 专栏投稿）。
 */

export const unit11WritingTasks: WritingTask[] = [
  {
    id: 'u11-w1',
    title: 'A Day with a Household Robot',
    genre: '记叙文 · 科幻想象故事',
    wordHint: '词数 100 左右',
    prompt:
      '请以“A Day with a Household Robot”为题，用英语写一篇想象作文，讲述你与一台家用机器人共度的一天：',
    requirements: [
      '交代机器人的外形与基本功能；',
      '记叙一天中发生的一件具体事情（可含小误会或小惊喜）；',
      '结尾表达你对人机关系的看法或感受。',
    ],
    modelEssay: [
      'A Day with a Household Robot',
      'Last month, a household robot named Robin moved into our home. It has gentle metal hands and moves at a steady pace.',
      'One evening, I felt sad about a lost match. Without being asked, Robin brought me hot tea and said in its elegant voice, "A sad host needs comfort." I could not help laughing, and my bad mood disappeared like mist.',
      'Now I no longer dismiss Robin as a pile of cold steel. That day taught me that care, even from a machine, can warm a human heart.',
    ],
    checklist: [
      '是否涵盖全部三个要点（外形功能 / 具体事件 / 看法感受）？',
      '事件是否有细节（时间、对话、动作），而不是空泛叙述？',
      '是否至少用到 3 个 Unit 1 词汇（如 household / elegant / dismiss / pile / pace / dignity）？',
      '是否使用被动语态拓展形式（如 without being asked / be dismissed as）？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
  {
    id: 'u11-w2',
    title: 'Will Robots Change Our Life?',
    genre: '应用文 · 专栏投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语报“Science Fiction World”专栏正在征稿。请用英语写一篇短文投稿，谈谈机器人将如何改变我们的日常生活：',
    requirements: [
      '列举机器人可能在家庭中承担的两三项工作；',
      '谈谈人们对此的担忧（如价格、情感陪伴）并给出你的看法；',
      '结尾展望人机共处的未来。',
    ],
    modelEssay: [
      'Will Robots Change Our Life?',
      'In many fantastic stories, robots cook, clean and even comfort their hosts. Today these scenes are quietly entering our real life.',
      'A household robot may soon wash the dishes, clean the carpet and look after old people. Some people suspect that a machine cannot understand feelings; others worry that the price sounds absurd for ordinary families.',
      'In my opinion, a robot is a helper, not a family member, and its quiet dignity lies in honest service. If we use it wisely, the future described by fiction will become a warm reality.',
    ],
    checklist: [
      '是否覆盖三个要点（家庭工作举例 / 担忧与看法 / 展望）？',
      '观点是否明确，是否有支持句而非口号？',
      '是否至少用到 3 个 Unit 1 词汇（如 fantastic / household / suspect / absurd / declare）？',
      '是否使用被动语态（如 be described by / be tested out）与倒装或强调等提升句式？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit11WritingTasks;
