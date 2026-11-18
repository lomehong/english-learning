import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修三 Unit 2（Healthy Lifestyle）语法点：unless 条件状语从句 / so that 目的与结果状语从句 */

export const unit27GrammarPoints: GrammarPoint[] = [
  {
    id: 'u27-unless-clause',
    title: 'unless 引导的条件状语从句',
    tagline: 'unless = if…not：除非……否则，遵循「主将从现」。',
    forms: [
      { label: '肯定式从句', detail: 'unless + 主语 + 一般现在时：You will feel tired unless you go to bed early.' },
      { label: '等同转换', detail: 'Unless you exercise, you will get weaker. = If you do not exercise, you will get weaker.' },
      { label: '从句前置（加逗号）', detail: 'Unless he changes his habits, his wellbeing will suffer.' },
      { label: '与情态动词连用', detail: 'Unless we act now, we cannot solve the problem of obesity.' },
    ],
    usages: [
      'unless 意为「除非……否则」，引导条件状语从句，相当于 if…not',
      '主句用一般将来时或含情态动词时，unless 从句用一般现在时表将来（主将从现）',
      'unless 从句既可放在主句之前（用逗号与主句隔开），也可放在主句之后',
      'unless 本身已含否定意义，从句谓语用肯定形式；虚拟条件句一般不用 unless 引导',
    ],
    markers: ['unless', 'if…not', '主将从现', 'will/can + 主句', '条件状语从句'],
    examples: [
      { en: 'Unless you cut down on sugary drinks, you will not lose weight.', zh: '除非你少喝含糖饮料，否则你无法减重。' },
      { en: 'Unless she jogs every morning, she feels tired all day.', zh: '除非每天早晨慢跑，否则她整天疲惫。' },
      { en: 'We cannot improve our wellbeing unless we sleep enough.', zh: '除非睡眠充足，否则我们无法改善健康。' },
    ],
    tips: [
      'unless 已含否定意义，从句谓语用肯定形式：说 unless you stop，不说 unless you do not stop',
      '遵循「主将从现」：主句用 will/can，从句用一般现在时',
      'unless 与 if…not 并非处处可互换：虚拟条件句用 if…not，不用 unless',
    ],
  },
  {
    id: 'u27-so-that-clause',
    title: 'so that 引导目的与结果状语从句',
    tagline: 'so that 表目的时从句带 can/could/may/might，表结果时常有逗号且用陈述语气。',
    forms: [
      { label: '目的（现在）', detail: '主句 + so that + 主语 + can/may + 动词原形：He jogs daily so that he can keep fit.' },
      { label: '目的（过去）', detail: '主句 + so that + 主语 + could/might/would + 动词原形：She set two alarms so that she would not oversleep.' },
      { label: '结果', detail: '主句, + so that + 主语 + 一般时态：He ate too much sugar, so that he became overweight.' },
      { label: '否定目的', detail: '主句 + so that + 主语 + can/could + not + 动词原形：Leave early so that you will not be caught in traffic.' },
    ],
    usages: [
      'so that 引导目的状语从句时，从句常含 can/could/may/might/will/would 等情态动词',
      'so that 引导结果状语从句时，主句与从句之间常有逗号，从句用一般时态陈述已发生的结果',
      '目的从句多置于主句之后；结果从句通常置于句末，是对前文结果的补充说明',
      'so that 表目的时可与 in order that 互换；注意与 so…that（如此……以至于）区分',
    ],
    markers: ['so that', 'can/could', 'may/might', 'in order that', '逗号 + 结果'],
    examples: [
      { en: 'She does meditation before class so that she can stay calm.', zh: '她课前冥想，以便保持冷静。' },
      { en: 'He gave up tobacco, so that his health improved quickly.', zh: '他戒了烟，结果健康状况迅速改善。' },
      { en: 'Drink more water so that your body can work well.', zh: '多喝水，好让身体正常运转。' },
    ],
    tips: [
      '表目的时从句必须含 can/could/may/might 等情态动词，不能只接动词原形',
      '表结果时主句与 so that 之间常加逗号，从句用陈述语气叙述已然结果',
      '区分 so that（目的/结果）与 so…that（程度）：so…that 中间必须是形容词或副词原级',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 2 Healthy Lifestyle */
export const unit27Exercises: GrammarExercise[] = [
  {
    id: 'u27-g1',
    type: 'mcq',
    pointId: 'u27-unless-clause',
    stem: '______ you cut down on sugary snacks, you will keep gaining weight.',
    options: ['Unless', 'If', 'Because', 'Until'],
    answerIndex: 0,
    explanation:
      '句意为「除非少吃含糖零食，否则体重会继续增加」，unless 引导条件状语从句相当于 if…not，故选 A；because 表原因、until 表时间，均不合句意，若用 if 则逻辑相反。',
  },
  {
    id: 'u27-g2',
    type: 'mcq',
    pointId: 'u27-so-that-clause',
    stem: 'Leo goes jogging every morning ______ he can burn off extra energy.',
    options: ['so that', 'even though', 'as if', 'now that'],
    answerIndex: 0,
    explanation:
      '从句含情态动词 can，表示每天慢跑的目的，用 so that 引导目的状语从句，故选 A；even though 表让步、as if 表方式、now that 表原因，都与目的无关。',
  },
  {
    id: 'u27-g3',
    type: 'mcq',
    pointId: 'u27-unless-clause',
    stem: 'You will feel stressed unless you ______ some time to relax every day.',
    options: ['will set aside', 'set aside', 'sets aside', 'setting aside'],
    answerIndex: 1,
    explanation:
      'unless 引导的条件从句遵循「主将从现」：主句 will feel 是将来时，从句用一般现在时，且主语是 you，故选 B；A 用将来时违背该规则，C 主谓不一致，D 是非谓语形式。',
  },
  {
    id: 'u27-g4',
    type: 'mcq',
    pointId: 'u27-so-that-clause',
    stem: 'He stayed up playing games till midnight, ______ he felt exhausted in class.',
    options: ['so that', 'unless', 'although', 'in case'],
    answerIndex: 0,
    explanation:
      '从句叙述已发生的结果（上课疲惫），so that 前有逗号引导结果状语从句，故选 A；unless 表条件、although 表让步、in case 表「以防」，均不合逻辑。',
  },
  {
    id: 'u27-g5',
    type: 'mcq',
    pointId: 'u27-unless-clause',
    stem: 'We will miss the morning workout ______ we leave right now.',
    options: ['unless', 'so that', 'though', 'once'],
    answerIndex: 0,
    explanation:
      '句意为「除非现在出发，否则将错过晨练」，unless = if…not 引导条件，故选 A；so that 表目的、though 表让步、once 表「一旦」，都与句意不符。',
  },
  {
    id: 'u27-g6',
    type: 'mcq',
    pointId: 'u27-so-that-clause',
    stem: 'She keeps a bottle of water on her desk ______ she may drink enough during the day.',
    options: ['so that', 'unless', 'even if', 'while'],
    answerIndex: 0,
    explanation:
      '从句含情态动词 may，表示把水杯放在桌上的目的，用 so that 引导目的状语从句，故选 A；unless 表条件、even if 表让步、while 表时间或对比，均不合句意。',
  },
  {
    id: 'u27-f1',
    type: 'fill',
    pointId: 'u27-unless-clause',
    stem: 'You will easily become overweight ______ you reduce the amount of sugary drinks.（填一个从属连词）',
    answer: 'unless',
    explanation:
      '句意为「除非减少含糖饮品的量，否则很容易发胖」，条件关系且含否定含义，填 unless（相当于 if you do not reduce）。',
  },
  {
    id: 'u27-f2',
    type: 'fill',
    pointId: 'u27-so-that-clause',
    stem: 'She drinks less coffee in the evening ______ that she can sleep well.（填一个词）',
    answer: 'so',
    explanation:
      '从句含 can，表目的「为了晚上睡好」，固定结构 so that 引导目的状语从句，填 so。',
  },
  {
    id: 'u27-f3',
    type: 'fill',
    pointId: 'u27-unless-clause',
    stem: '______ you give up tobacco now, your lungs will keep getting worse.（填一个从属连词）',
    answer: 'unless',
    explanation:
      '句意为「除非现在戒烟，否则肺部会持续变差」，unless 引导含否定意义的条件状语从句，置于句首。',
  },
  {
    id: 'u27-f4',
    type: 'fill',
    pointId: 'u27-so-that-clause',
    stem: 'He took up meditation so that he ______ deal with stress better.（用所给词的适当形式填空：can）',
    answer: 'could',
    explanation:
      '主句 took up 是过去时，so that 目的从句中情态动词相应用过去式 could，保持时态呼应。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit27GrammarPoints, exercises: unit27Exercises };
