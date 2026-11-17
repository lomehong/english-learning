import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修三 Unit 4（Adversity and Courage）语法点：让步状语从句 / no sooner…than 与 hardly…when */

export const unit29GrammarPoints: GrammarPoint[] = [
  {
    id: 'u29-concessive-clause',
    title: '让步状语从句（although / even though）',
    tagline: '「虽然……但是」只让不让：although/even though 引导从句，主句不可再用 but。',
    forms: [
      { label: 'although + 从句（前置）', detail: 'Although + 主语 + 谓语, + 主句：Although the team was tired, they kept walking.' },
      { label: 'even though（语气更强）', detail: 'Even though + 从句, + 主句：Even though he failed twice, he never lost courage.' },
      { label: '从句后置', detail: '主句 + though/although + 从句：He kept smiling, though he was in pain.' },
      { label: '主句用 still/yet 加强', detail: 'Although…, he still went on.（用 still/yet，不能用 but）' },
    ],
    usages: [
      'although / even though 引导让步状语从句，表示「虽然、尽管」，主句之前不可再与 but 连用',
      'even though 语气比 although 更强，接近「即使、纵然」，常带假设意味',
      '让步从句可位于主句之前（用逗号隔开）或之后；置于句首更能突出对比',
      '主句中可用 yet/still 加强让步意味：Although…, he still kept his resolve',
    ],
    markers: ['although', 'even though', 'though', 'still', 'yet'],
    examples: [
      { en: 'Although the storm was terrible, the crew never gave up hope.', zh: '尽管风暴可怕，船员们从未放弃希望。' },
      { en: 'Even though he was injured, he climbed out of the ice alone.', zh: '即使受了伤，他也独自爬出了冰面。' },
      { en: 'They kept smiling, though they had not eaten for days.', zh: '尽管多日未食，他们仍保持微笑。' },
    ],
    tips: [
      'although 不能与 but 同时使用：说 Although…, yet/still…，不说 Although…, but…',
      'although 与 despite 不同：despite 是介词，只能接名词或动名词，不能接从句',
      'even though 表「即使（事实）」，even if 表「即使（假设）」，侧重点不同，不可混淆',
    ],
  },
  {
    id: 'u29-no-sooner-than',
    title: 'no sooner ... than / hardly ... when',
    tagline: '「一……就……」：no sooner 配 than，hardly/scarcely 配 when，句首则部分倒装。',
    forms: [
      { label: '句首倒装式', detail: 'No sooner had + 主语 + 过去分词 + than + 过去时：No sooner had he stood up than the bell rang.' },
      { label: 'hardly…when（句首倒装）', detail: 'Hardly had + 主语 + 过去分词 + when + 过去时：Hardly had we started when the ship hit ice.' },
      { label: 'scarcely…when', detail: 'Scarcely had they sat down when the alarm rang.' },
      { label: '陈述语序', detail: '主语 + had no sooner/hardly + 过去分词 + than/when…：We had no sooner set out than the sky turned dark.' },
    ],
    usages: [
      'no sooner…than 与 hardly…when 都表示「一……就……」，描述两个紧接着发生的过去动作',
      'no sooner 后接 than，hardly/scarcely 后接 when，搭配固定不可混淆',
      'no sooner / hardly / scarcely 位于句首时，其所在分句用部分倒装：助动词 had 提到主语之前',
      '先发生的动作用过去完成时（had done），后发生的动作用一般过去时，形成时态呼应',
    ],
    markers: ['no sooner…than', 'hardly…when', 'scarcely…when', 'had + 过去分词', '句首倒装'],
    examples: [
      { en: 'No sooner had they left the camp than the ice began to break.', zh: '他们刚离开营地冰面就开始破裂。' },
      { en: 'Hardly had the explorers sat down when the storm arrived.', zh: '探险者们刚坐下风暴就来了。' },
      { en: 'We had no sooner fixed the boat than another wave hit us.', zh: '我们刚修好船又一个浪打来。' },
    ],
    tips: [
      'no sooner 配 than，hardly/scarcely 配 when，混搭是最常见错误',
      '位于句首时分句需部分倒装，且该分句用过去完成时 had done',
      '不位于句首时保持正常语序：He had hardly begun when…，无需倒装',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 4 Adversity and Courage */
export const unit29Exercises: GrammarExercise[] = [
  {
    id: 'u29-g1',
    type: 'mcq',
    pointId: 'u29-concessive-clause',
    stem: '______ his leg was still painful, he carried the injured teammate on his back.',
    options: ['Although', 'Because', 'Unless', 'So that'],
    answerIndex: 0,
    explanation:
      '句意为「尽管腿还在疼，他仍背起受伤的队友」，前后是让步关系，用 although 引导，故选 A；because 表原因、unless 表条件、so that 表目的或结果，均不合句意。',
  },
  {
    id: 'u29-g2',
    type: 'mcq',
    pointId: 'u29-no-sooner-than',
    stem: 'No sooner ______ the shelter than the temperature dropped sharply.',
    options: ['they had reached', 'had they reached', 'did they reach', 'they reached'],
    answerIndex: 1,
    explanation:
      'no sooner 位于句首，其所在分句用过去完成时的部分倒装 had they reached，再接 than 描述后一动作，故选 B；A 语序未倒装，C、D 时态不对。',
  },
  {
    id: 'u29-g3',
    type: 'mcq',
    pointId: 'u29-concessive-clause',
    stem: 'Even though the team had lost everything, ______.',
    options: ['but they kept their courage', 'they still kept their courage', 'so they gave up', 'they lost courage too'],
    answerIndex: 1,
    explanation:
      'even though 引导让步从句时，主句不能再用 but 或 so，用正常语序并以 still 加强「依然保持勇气」，故选 B；A 多了 but，C 逻辑与让步相悖，D 与文意相反。',
  },
  {
    id: 'u29-g4',
    type: 'mcq',
    pointId: 'u29-no-sooner-than',
    stem: 'Hardly had the ship started ______ it hit a huge piece of ice.',
    options: ['when', 'than', 'that', 'then'],
    answerIndex: 0,
    explanation:
      'hardly…when 为固定搭配，表示「一……就……」，故选 A；no sooner 才与 than 搭配，that 与 then 均不能用于该结构。',
  },
  {
    id: 'u29-g5',
    type: 'mcq',
    pointId: 'u29-concessive-clause',
    stem: '______ he had walked all night through the snow, he still kept the map dry.',
    options: ['Although', 'Unless', 'So that', 'Because'],
    answerIndex: 0,
    explanation:
      '「整夜冒雪行走」与「仍让地图保持干燥」构成让步关系，用 although 引导，主句用 still 加强语气，故选 A；unless 表条件、so that 表目的、because 表原因，均不合逻辑。',
  },
  {
    id: 'u29-g6',
    type: 'mcq',
    pointId: 'u29-no-sooner-than',
    stem: 'We ______ no sooner set out than the sky turned dark.',
    options: ['had', 'have', 'has', 'would have'],
    answerIndex: 0,
    explanation:
      'no sooner 所在分句用过去完成时 had done，与 than 后的一般过去时 turned 呼应，故选 A；B、C 时态错误，D 与句意不符。',
  },
  {
    id: 'u29-f1',
    type: 'fill',
    pointId: 'u29-concessive-clause',
    stem: '______ the food ran out, the explorers never lost hope.（填一个从属连词）',
    answer: 'Although',
    explanation:
      '「食物耗尽」与「从不失去希望」是让步关系，句首填 Although（尽管），引导让步状语从句。',
  },
  {
    id: 'u29-f2',
    type: 'fill',
    pointId: 'u29-no-sooner-than',
    stem: 'No sooner had the storm stopped ______ the crew rushed to repair the boat.（填一个连词）',
    answer: 'than',
    explanation:
      'no sooner 与 than 固定搭配表「一……就……」，句首 no sooner had done 已倒装，后接 than + 一般过去时。',
  },
  {
    id: 'u29-f3',
    type: 'fill',
    pointId: 'u29-concessive-clause',
    stem: 'He kept walking ______ though his shoes were wet through.（填一个词，使句意为「尽管」）',
    answer: 'even',
    explanation:
      'even though 为固定让步连词搭配，语气强于 although，表示「尽管鞋子湿透他仍继续前行」，填 even。',
  },
  {
    id: 'u29-f4',
    type: 'fill',
    pointId: 'u29-no-sooner-than',
    stem: 'Hardly had they reached the camp ______ the rescue team arrived.（填一个连词）',
    answer: 'when',
    explanation:
      'hardly 与 when 固定搭配表「一……就……」，句首 hardly had done 已倒装，后接 when + 一般过去时。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit29GrammarPoints, exercises: unit29Exercises };
