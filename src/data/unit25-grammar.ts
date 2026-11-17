import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修三 Unit 5（The Value of Money）语法点：宾语从句 / 表语从句 */

export const unit10GrammarPoints: GrammarPoint[] = [
  {
    id: 'object-clause',
    title: '宾语从句（that / whether / if 及连接代词与副词）',
    tagline: '作动词或介词宾语的从句：注意引导词的选择与陈述语序。',
    forms: [
      { label: 'that 引导', detail: '主句 + that + 陈述句（that 无词义，可省略）' },
      { label: 'whether / if 引导', detail: '主句 + whether / if + 陈述句（表“是否”）' },
      { label: '连接代词/副词引导', detail: '主句 + what / who / when / where / why / how + 陈述句' },
    ],
    usages: [
      'that 引导陈述内容的宾语从句，本身无意义，口语中常省略',
      'whether / if 表“是否”；介词后、不定式前（whether to do）以及与 or not 直接连用时只用 whether',
      '特殊疑问词引导宾语从句时保留疑问含义，但语序要用陈述语序',
      '主句是过去时态时，从句须用相应的过去时态（客观真理除外）',
    ],
    markers: ['that', 'whether / if', 'what', 'who', 'when', 'where', 'why', 'how', 'I wonder', 'Do you know'],
    examples: [
      { en: 'I think (that) money is only a tool, not the goal of life.', zh: '我认为金钱只是工具，不是人生的目标。' },
      { en: 'She asked whether the banknote was genuine.', zh: '她问那张钞票是不是真的。' },
      { en: 'Do you know how the strange story ends?', zh: '你知道这个奇怪的故事是怎样结尾的吗？' },
    ],
    tips: [
      '宾语从句用陈述语序：where he is（不是 where is he）',
      '介词后只用 whether 不用 if：It depends on whether he will come.',
      'think / believe 的否定通常转移到主句：I don\u2019t think it is right.',
    ],
  },
  {
    id: 'predicative-clause',
    title: '表语从句',
    tagline: '位于系动词后说明主语的内容或原因的从句。',
    forms: [
      { label: 'that 引导', detail: '主语 + be + that 从句（说明内容）' },
      { label: 'whether 引导', detail: 'The question is whether + 陈述句（表“是否”）' },
      { label: 'why / because 引导', detail: 'That is why …（结果）/ That is because …（原因）' },
    ],
    usages: [
      '说明主语（fact, problem, truth, question 等）的具体内容：The fact is that …',
      '表语从句一般不用 if 引导，“是否”用 whether',
      'That is why… 强调结果；That is because… 强调原因，两者不可混用',
      'what 引导表语从句并在从句中充当成分：That is what he wants.',
    ],
    markers: ['The fact is that …', 'The question is whether …', 'That is why …', 'That is because …', 'The problem is how …'],
    examples: [
      { en: 'The fact is that money cannot buy happiness.', zh: '事实是金钱买不到幸福。' },
      { en: 'That is why the two brothers stared at the poor man\u2019s banknote in surprise.', zh: '这就是兄弟俩惊讶地盯着那个穷人钞票的原因。' },
      { en: 'The question is whether we should lend him the money.', zh: '问题是我们是否应该把钱借给他。' },
    ],
    tips: [
      '表语从句要用陈述语序，系动词后不再用连接副词的疑问语序',
      'whether 可引导表语从句，if 一般不可以',
      'That is because… 解释原因，That is why… 交代结果，注意区分',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自必修三 Unit 5 The Value of Money */
export const unit10Exercises: GrammarExercise[] = [
  {
    id: 'u25-g1',
    type: 'mcq',
    pointId: 'object-clause',
    stem: 'I really wonder ______ the young man will spend the million-pound banknote within a month.',
    options: ['that', 'whether', 'what', 'which'],
    answerIndex: 1,
    explanation:
      'wonder 后的宾语从句表“是否”，应用 whether 引导；that 在 wonder 后不表疑问，故选 B。',
  },
  {
    id: 'u25-g2',
    type: 'mcq',
    pointId: 'object-clause',
    stem: 'Can you tell me ______?',
    options: [
      'where is the nearest bank',
      'where the nearest bank is',
      'the nearest bank is where',
      'is where the nearest bank',
    ],
    answerIndex: 1,
    explanation:
      '宾语从句必须用陈述语序“连接词 + 主语 + 谓语”，即 where the nearest bank is，故选 B。',
  },
  {
    id: 'u25-g3',
    type: 'mcq',
    pointId: 'predicative-clause',
    stem: 'The fact is ______ money itself is neither good nor bad.',
    options: ['that', 'what', 'which', 'whether'],
    answerIndex: 0,
    explanation:
      '表语从句内容完整（不缺成分），用 that 引导说明 The fact 的内容，故选 A。',
  },
  {
    id: 'u25-g4',
    type: 'mcq',
    pointId: 'predicative-clause',
    stem: 'The two rich brothers made a strange bet. That is ______ the poor young man got the banknote.',
    options: ['what', 'why', 'because', 'which'],
    answerIndex: 1,
    explanation:
      '此处交代前面事件的结果（所以他才得到那张钞票），用 That is why…；That is because 表原因，与语境相反，故选 B。',
  },
  {
    id: 'u25-g5',
    type: 'mcq',
    pointId: 'object-clause',
    stem: 'The manager asked the waiter ______ the gentleman in rags had paid the bill.',
    options: ['that', 'if', 'what', 'whom'],
    answerIndex: 1,
    explanation:
      'ask 后的宾语从句表“是否”，可用 if 引导，从句成分完整；that 不表疑问，故选 B。',
  },
  {
    id: 'u25-g6',
    type: 'mcq',
    pointId: 'predicative-clause',
    stem: 'The question is ______ we should spend the money on ourselves or on people in need.',
    options: ['that', 'what', 'whether', 'which'],
    answerIndex: 2,
    explanation:
      '表语从句与 or 连用表“是否”，只能用 whether 引导（if 不能引导表语从句），故选 C。',
  },
  {
    id: 'u25-f1',
    type: 'fill',
    pointId: 'object-clause',
    stem: 'We all believe ______ a person\u2019s value does not depend on his wealth. (that)',
    answer: 'that',
    explanation:
      '宾语从句内容完整、由陈述句充当，用 that 引导（口语中可省略），填 that。',
  },
  {
    id: 'u25-f2',
    type: 'fill',
    pointId: 'object-clause',
    stem: 'I don\u2019t know ______ the pineapple dessert is made in this shop or imported. (whether)',
    answer: 'whether',
    explanation:
      '宾语从句与 or 直接连用表“是否”，只能用 whether（不用 if），填 whether。',
  },
  {
    id: 'u25-f3',
    type: 'fill',
    pointId: 'predicative-clause',
    stem: 'Every month I save part of my pocket money for books. That is ______ I spend so little on snacks. (why)',
    answer: 'why',
    explanation:
      '前句交代原因、本句点明结果，用 That is why… 结构，填 why。',
  },
  {
    id: 'u25-f4',
    type: 'fill',
    pointId: 'object-clause',
    stem: 'The waiter stared in surprise because he couldn\u2019t understand ______ the man in rags could pay the huge bill. (how)',
    answer: 'how',
    explanation:
      '宾语从句缺少“如何”这一方式状语，用 how 引导（陈述语序 could pay），填 how。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit10GrammarPoints, exercises: unit10Exercises };
