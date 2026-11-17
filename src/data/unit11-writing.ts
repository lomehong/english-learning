import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修二 Unit 1（Science and Scientists）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 1 词表），
 * 体裁与要求对接教材单元写作板块（邀请信 + 科学实验记叙文）。
 */

export const unit11WritingTasks: WritingTask[] = [
  {
    id: 'u11-w1',
    title: 'Inviting a Physician to Science Week',
    genre: '应用文 · 邀请信',
    wordHint: '词数 100 左右',
    prompt:
      '你校下周将举办科技周（Science Week），你是学生会主席李华。请用英语给李医生（Dr. Li）写一封邀请信，邀请她来校做一场关于疫苗与病毒研究的科普讲座：',
    requirements: [
      '说明写信目的与活动背景（时间、地点）；',
      '介绍讲座主题及听众（如高一、高二学生）；',
      '表达期待与感谢，并请对方回复是否接受邀请。',
    ],
    modelEssay: [
      'Dear Dr. Li,',
      'I am Li Hua, chairman of the Student Union. I am writing to invite you to give a lecture during our school\u2019s Science Week, which will be held in the school hall next Friday afternoon.',
      'Given your brilliant research on viruses and vaccines, we would be honoured if you could share how a new vaccine is developed and proved effective. Our audience will be senior students, many of whom dream of becoming physicians or scientists like you.',
      'Inspired by your talks in past years, hundreds of students have developed a solid interest in science. We sincerely hope you can accept our invitation. Looking forward to your early reply.',
      'Yours sincerely,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的背景 / 讲座主题与听众 / 期待回复）？',
      '是否使用过去分词作状语或定语（如 Inspired by… / a lecture given by… / Given your research…）？',
      '是否至少用到 3 个 Unit 1 词汇（如 vaccine / virus / physician / brilliant / solid / prove）？',
      '邀请信格式是否完整（称呼、落款），语气是否礼貌得体？',
      '词数是否 100 左右，时态是否以一般现在时与一般将来时为主？',
    ],
  },
  {
    id: 'u11-w2',
    title: 'The Experiment That Taught Me a Lesson',
    genre: '记叙文 · 写事叙事',
    wordHint: '词数 100 左右',
    prompt:
      '请以“The Experiment That Taught Me a Lesson”为题，用英语写一篇记叙文，讲述一次你亲身经历的科学实验（可以是一次失败后查找原因最终成功的经历）：',
    requirements: [
      '交代实验的背景与目的（在实验室做什么）；',
      '记叙实验过程中出现的问题及你们如何一步步追查原因；',
      '写明实验结果与你的感悟（如证据、耐心与合作的重要性）。',
    ],
    modelEssay: [
      'The Experiment That Taught Me a Lesson',
      'Last term, my partner and I were asked to test a theory about bacteria in the school laboratory.',
      'At first, the initial results did not match our theory at all. Instead of blaming each other, we decided to trace every step and check all the statistics again. Guided by our teacher, we watched the samples under the microscope once more, and finally found that one tube had been polluted by another liquid.',
      'When the repeated experiment proved our theory correct, we felt really proud. This experience taught me a valuable lesson: science is built on solid evidence, sharp eyes and patient teamwork rather than good luck.',
    ],
    checklist: [
      '是否按「背景 — 问题与追查 — 结果与感悟」组织，三个要点齐全？',
      '是否使用过去分词作定语或状语（如 the repeated experiment / Guided by our teacher…）？',
      '是否至少用到 3 个 Unit 1 词汇（如 laboratory / microscope / theory / statistics / trace / prove / solid）？',
      '记叙是否具体（有过程细节），感悟是否自然点题？',
      '词数是否 100 左右，标题是否保留，时态是否以一般过去时为主？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit11WritingTasks;
