import type { WritingTask } from '../types';

/**
 * 人教2019必修一 Unit 4（Natural Disasters）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 4 词表），
 * 体裁与要求对接教材单元写作板块（应用文倡议书 + 新闻报道投稿）。
 */

export const unit4WritingTasks: WritingTask[] = [
  {
    id: 'u4-w1',
    title: 'Calling on Students to Help the Flood Victims',
    genre: '应用文 · 倡议书',
    wordHint: '词数 80 左右',
    prompt:
      '你所在的城市上周遭受洪水袭击，部分同学的家庭受灾。请以校学生会的名义，用英语给全校同学写一封倡议书，号召大家向受灾同学和家庭伸出援手：',
    requirements: [
      '说明写信目的：号召大家帮助受灾的同学与家庭；',
      '提出至少两种具体的帮助方式（如捐款、捐学习用品、做志愿者等）；',
      '说明伸出援手的意义，并表示感谢与期待。',
    ],
    modelEssay: [
      'Dear fellow students,',
      'As you know, a serious flood struck our city last week, and some of our schoolmates\u2019 families lost their homes and belongings. Now they badly need our help.',
      'First, you can donate pocket money or school things at the school gate this Friday. Second, volunteers are welcome to help pack the aid and hand it out at the shelter this weekend. Every little bit counts.',
      'When disaster strikes, we should unite and support each other. Your kindness will give the victims hope and strength. Thank you for your help!',
      'The Students\u2019 Union',
    ],
    checklist: [
      '是否涵盖全部三个要点（目的、帮助方式、意义与致谢）？',
      '帮助方式是否具体（捐款 / 捐物 / 志愿服务至少写出两种）？',
      '是否至少用到 3 个 Unit 4 词汇（如 flood / victim / shelter / aid / unite / donate）？',
      '倡议语气是否真诚有感染力，称呼与落款格式是否完整？',
      '词数是否 80 左右，是否避免逐句翻译中文提示？',
    ],
  },
  {
    id: 'u4-w2',
    title: 'A Brave Girl in the Earthquake',
    genre: '记叙文 · 校刊报道',
    wordHint: '词数 100 左右',
    prompt:
      '上周你校英语校刊以“A Brave Girl in the Earthquake”为题征稿。请根据以下要点，用英语写一篇记叙报道，介绍你班同学李华在地震中冷静自救并帮助他人的事迹：',
    requirements: [
      '交代事件背景：地震发生的时间与李华当时正在做什么；',
      '描述她的冷静做法（如躲在桌下护住头、走楼梯不乘电梯、帮助同学撤离等）；',
      '结尾谈谈这次事件带给你的感悟（如学习安全知识、灾难面前保持镇定与团结）。',
    ],
    modelEssay: [
      'A Brave Girl in the Earthquake',
      'At a quarter to twelve last Friday night, a terrible earthquake struck our town. Li Hua, my classmate, was still awake, reviewing for an English test, when the ground suddenly began to shake.',
      'Instead of screaming, Li Hua stayed calm. She quickly hid under her desk and covered her head. After the shaking stopped, she walked down the stairs instead of taking the lift. On her way out, she helped a younger student who was trapped by a fallen door and took him to a safe place.',
      'When the rescue team arrived, Li Hua also handed out water and food to the victims at the shelter. Her courage and calmness moved all of us. Disasters are frightening, but as Li Hua shows, safety knowledge and a calm heart can save lives. When danger comes, staying calm and uniting together is the best way to survive.',
    ],
    checklist: [
      '是否按「背景 — 冷静做法 — 感悟」组织，三个要点齐全？',
      '叙述地震中做法时是否使用一般过去时与被动语态（was trapped / were destroyed 等）？',
      '是否至少用到 3 个 Unit 4 词汇（如 earthquake / calm / trap / rescue / victim / shelter / survive / unite）？',
      '细节是否具体（时间、动作、帮助对象），内容是否真实可信？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit4WritingTasks;
