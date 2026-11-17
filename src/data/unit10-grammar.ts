import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修一 Unit 5（Working the Land）语法点：动词-ing形式作状语 */

export const unit10GrammarPoints: GrammarPoint[] = [
  {
    id: 'ing-adverbial-time-reason',
    title: '动词-ing形式作时间与原因状语',
    tagline: '-ing短语说明谓语动作发生的时间或原因，其逻辑主语须与句子主语一致。',
    forms: [
      { label: '时间状语（同时）', detail: 'Walking in the fields, the farmer thought about the new seeds.（一边走一边想）' },
      { label: '时间状语（先后）', detail: 'Having finished the planting, they went home for lunch.（完成之后）' },
      { label: '原因状语', detail: 'Being a farmer\u2019s son, he knew the soil well.（因为是……）' },
      { label: '否定形式', detail: 'Not knowing the weather report, they kept working in the rain.' },
    ],
    usages: [
      '-ing作状语时，其逻辑主语必须与句子的主语一致，否则句子在语法上不成立',
      '表示与谓语同时进行的动作，用一般式 doing；表示先于谓语完成的动作，用 having done',
      '-ing短语作原因状语，相当于 as / because 引导的原因状语从句',
      'be 动词的-ing形式 Being… 常放句首表原因或身份：Being busy, he still helped his neighbours.',
    ],
    markers: ['…ing, 主语 + 谓语', 'Having done …, …', 'Being …, …', 'Not knowing …, …'],
    examples: [
      { en: 'Hearing the good harvest news, the whole village cheered.', zh: '听到丰收的好消息，全村人都欢呼起来。' },
      { en: 'Having worked in the fields all morning, the students felt hungry.', zh: '在田里干了一上午活后，学生们感到饿了。' },
      { en: 'Being a scientist, he still calls himself a farmer.', zh: '虽然是科学家，他仍称自己为农民。' },
    ],
    tips: [
      '判断标准：句子主语必须能发出-ing的动作，否则需改写从句或换主语',
      '先后发生的动作用 having done；同时发生的动作用 doing',
      '否定not要放在-ing形式之前：Not having slept well, he felt tired.',
    ],
  },
  {
    id: 'ing-adverbial-result-manner',
    title: '动词-ing形式作结果、方式与伴随状语',
    tagline: '-ing短语表示自然的结果、行为方式或伴随主语同时进行的动作，常用逗号与主句隔开。',
    forms: [
      { label: '结果状语', detail: 'The hybrid rice spread quickly, feeding millions of people.' },
      { label: '伴随状语', detail: 'The old farmer sat under the tree, smoking his pipe.（一边坐一边抽）' },
      { label: '方式状语', detail: 'He made a living by teaching farming skills.（by + doing 表方式）' },
      { label: '评注性状语', detail: 'Generally speaking, organic food costs more.（说话人评注）' },
    ],
    usages: [
      '-ing作结果状语，表示前一分句自然引起的结果，相当于 which 引导的非限制性定语从句',
      '伴随状语表示与谓语动作同时进行的另一个动作：They worked in the sun, singing happily.',
      'by + doing 表示通过某种方式达到结果：The village escaped poverty by growing vegetables.',
      'generally speaking、judging from 等评注性状语已固定成习语，不要求与主语一致',
    ],
    markers: [', …ing …', 'by doing', 'singing / laughing …', 'generally speaking'],
    examples: [
      { en: 'The new seeds work well, saving both water and labour.', zh: '新种子效果很好，既省水又省工。' },
      { en: 'The children ran out of the classroom, talking and laughing.', zh: '孩子们说着笑着跑出教室。' },
      { en: 'The family doubled its income by selling organic vegetables.', zh: '这家人靠卖有机蔬菜使收入翻了一番。' },
    ],
    tips: [
      '结果状语与伴随状语都放在主句之后，用逗号隔开，不与主句用 and 连接',
      '“so that + 从句”表目的，-ing结果状语表自然结果，二者不能混用',
      '评注性状语（如 strictly speaking）是固定表达，不受逻辑主语一致的限制',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 5 Working the Land */
export const unit10Exercises: GrammarExercise[] = [
  {
    id: 'u10-g1',
    type: 'mcq',
    pointId: 'ing-adverbial-time-reason',
    stem: '______ that a storm was coming, the farmers hurried to cover the wheat.',
    options: ['Knowing', 'Known', 'To know', 'Knew'],
    answerIndex: 0,
    explanation:
      '句子的主语 the farmers 是 know 这一动作的发出者，-ing短语作原因状语用 Knowing，故选 A；Known 表被动，To know 表目的，Knew 是谓语形式。',
  },
  {
    id: 'u10-g2',
    type: 'mcq',
    pointId: 'ing-adverbial-time-reason',
    stem: '______ a farmer\u2019s son, the scientist understood the pain of hunger in the countryside.',
    options: ['Being', 'Be', 'Been', 'To being'],
    answerIndex: 0,
    explanation:
      'be 动词的-ing形式 Being 放句首作原因状语，说明主语的身份，故选 A；其余形式都不能引导该状语。',
  },
  {
    id: 'u10-g3',
    type: 'mcq',
    pointId: 'ing-adverbial-result-manner',
    stem: 'The hybrid rice spread across the country quickly, ______ millions of people.',
    options: ['feeding', 'fed', 'to feed', 'feeds'],
    answerIndex: 0,
    explanation:
      '-ing短语作结果状语，表示杂交水稻推广后自然带来的结果，故选 A；fed 表被动，to feed 多表目的。',
  },
  {
    id: 'u10-g4',
    type: 'mcq',
    pointId: 'ing-adverbial-result-manner',
    stem: 'The old farmer sat under the big tree after supper, ______ his favourite tea.',
    options: ['drinking', 'drank', 'to drink', 'drink'],
    answerIndex: 0,
    explanation:
      '-ing短语作伴随状语，表示与 sat 同时进行的动作，故选 A；主句已有谓语 sat，再用谓语形式会造出双谓语错误。',
  },
  {
    id: 'u10-g5',
    type: 'mcq',
    pointId: 'ing-adverbial-result-manner',
    stem: 'The village escaped poverty ______ organic vegetables to the city.',
    options: ['by selling', 'by sell', 'to sell', 'sold'],
    answerIndex: 0,
    explanation:
      'by + doing 表示“通过某种方式”，介词 by 后接动名词 selling，故选 A。',
  },
  {
    id: 'u10-g6',
    type: 'mcq',
    pointId: 'ing-adverbial-time-reason',
    stem: '______ the whole field, the students went back to school for lunch.',
    options: ['Having harvested', 'Harvesting', 'Harvest', 'Having harvest'],
    answerIndex: 0,
    explanation:
      '收割这一动作先于“回校吃午饭”完成，应用完成式-ing Having harvested 表时间先后，故选 A；Harvesting 不体现先后，Harvest 是谓语或名词形式。',
  },
  {
    id: 'u10-f1',
    type: 'fill',
    pointId: 'ing-adverbial-time-reason',
    stem: '______ (hear) the good news about the harvest, the whole family cheered.（用所给词的适当形式填空）',
    answer: 'Hearing',
    explanation:
      '“听到消息”与“欢呼”几乎同时发生，主语 the whole family 是 hear 的执行者，句首-ing作时间状语，填 Hearing。',
  },
  {
    id: 'u10-f2',
    type: 'fill',
    pointId: 'ing-adverbial-result-manner',
    stem: 'The new seeds worked very well, ______ (save) both water and labour.（用所给词的适当形式填空）',
    answer: 'saving',
    explanation:
      '主句之后用逗号加-ing短语作结果状语，表示新种子带来的自然结果，填 saving。',
  },
  {
    id: 'u10-f3',
    type: 'fill',
    pointId: 'ing-adverbial-time-reason',
    stem: '______ (be) a world-famous scientist, Yuan Longping still called himself a farmer.（用所给词的适当形式填空）',
    answer: 'Being',
    explanation:
      'Being 放句首作原因状语，说明主语的身份（虽然是……），填 Being。',
  },
  {
    id: 'u10-f4',
    type: 'fill',
    pointId: 'ing-adverbial-result-manner',
    stem: 'The children ran out of the classroom at noon, ______ (talk) and laughing.（用所给词的适当形式填空）',
    answer: 'talking',
    explanation:
      '与 laughing 并列的-ing短语作伴随状语，表示跑出教室时同时进行的动作，填 talking。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit10GrammarPoints, exercises: unit10Exercises };
