import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修二 Unit 5（First Aid）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 5 词表），
 * 体裁与要求对接教材单元写作板块（安全宣传稿 + 施救经历记叙文）。
 */

export const unit15WritingTasks: WritingTask[] = [
  {
    id: 'u15-w1',
    title: 'First Aid Tips for the School Wall Newspaper',
    genre: '应用文 · 安全宣传稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语墙报将开设“Safety Corner”栏目，请你用英语写一篇短文投稿，向同学们介绍两项常见意外（如烧伤、出血）的急救处理方法：',
    requirements: [
      '点明掌握急救技能的重要性；',
      '分项介绍两项意外的处理步骤（如烧伤冲水降温、出血按压包扎）；',
      '提醒紧急情况下的正确做法（如保持冷静、呼叫救护车）。',
    ],
    modelEssay: [
      'First Aid Tips for Everyone',
      'Accidents may happen at any time, so it is vital for us students to master some basic first aid techniques.',
      'If someone gets a minor burn in the laboratory or the kitchen, cool the wound under running water for at least ten minutes if possible, and then wrap it with a clean bandage. Never spread alcohol or toothpaste on the skin. When a person starts to bleed, squeeze the wound gently with a clean cloth and keep it above the heart.',
      'Whatever happens, do not panic. Check the person\u2019s symptoms and pulse carefully, and call the ambulance in time if the situation is severe.',
      'Stay calm, act quickly, and you may save a life one day.',
    ],
    checklist: [
      '是否涵盖全部三个要点（重要性 / 两项处理步骤 / 紧急提醒）？',
      '是否使用省略与「祈使句 + and/or + 陈述句」结构（如 If possible, … / Stay calm, act quickly, and you may save a life）？',
      '是否至少用到 3 个 Unit 5 词汇（如 bandage / bleed / burn / wrap / squeeze / symptom / pulse / panic / ambulance / vital）？',
      '步骤描述是否清楚有序（可使用 if / when / then 等连接），信息是否准确安全？',
      '词数是否 100 左右，是否保留标题？',
    ],
  },
  {
    id: 'u15-w2',
    title: 'The Day I Helped an Injured Classmate',
    genre: '记叙文 · 写事叙事',
    wordHint: '词数 100 左右',
    prompt:
      '请以“The Day I Helped an Injured Classmate”为题，用英语写一篇记叙文，讲述一次你运用所学急救知识帮助受伤同学的经历（如流鼻血、擦伤、扭伤等）：',
    requirements: [
      '交代事情发生的时间、地点与意外经过；',
      '记叙你的处理过程（运用急救知识的具体做法）；',
      '写明结果（如同学康复、得到表扬）与你的感悟。',
    ],
    modelEssay: [
      'The Day I Helped an Injured Classmate',
      'During a basketball match last month, my classmate Jack fell down suddenly and began to bleed from the knee.',
      'While others stood there in panic, I remembered the first aid course we had taken at school. I asked Jack to sit down and squeezed the wound gently with a clean towel. Then I wrapped his knee with a bandage and checked whether he felt any other symptoms, such as dizziness. Finding his pulse steady, I called our PE teacher, who sent him to the school clinic at once.',
      'A week later, Jack made a full recovery and thanked me at the class meeting. That day taught me that first aid knowledge, though simple, is truly a vital skill worth learning by everyone.',
    ],
    checklist: [
      '是否按「意外经过 — 处理过程 — 结果与感悟」组织，三个要点齐全？',
      '是否使用省略结构（如 While others stood there in panic, … / Finding his pulse steady, … 状语中的省略与分词表达）？',
      '是否至少用到 3 个 Unit 5 词汇（如 bleed / squeeze / wrap / bandage / symptom / pulse / panic / recovery / vital）？',
      '急救做法是否符合常识（不夸大、不冒险），细节是否具体？',
      '词数是否 100 左右，标题是否保留，时态是否以一般过去时为主？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit15WritingTasks;
