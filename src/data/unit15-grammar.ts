import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修二 Unit 5（First Aid）语法点：省略（Ellipsis）+「祈使句 + and/or + 陈述句」 */

export const unit15GrammarPoints: GrammarPoint[] = [
  {
    id: 'ellipsis',
    title: '省略（Ellipsis）',
    tagline: '为避免重复、使语言简洁，可省略句中可从上下文推知的成分：主语与 be 动词、不定式 to 后的内容等。',
    forms: [
      { label: '状语从句中的省略', detail: 'When/While/If/Unless + 分词/形容词：While (you are) waiting for help, keep calm.' },
      { label: 'if 省略结构', detail: 'If (it is) necessary, call an ambulance at once. / If (it is) possible, …' },
      { label: '不定式省略 to 后内容', detail: '— Would you like to join the training? — I\'d like to (join…).' },
      { label: '并列句中的省略', detail: 'The nurse told me to breathe slowly and (to) stay calm.' },
    ],
    usages: [
      '状语从句主语与主句主语一致且谓语含有 be 时，可省略“主语 + be”：When asked about the burn, she smiled.（= When she was asked…）',
      'if 引导的省略结构常见搭配：if necessary / if possible / if so / if not / if in doubt',
      '回答或承接前文时不定式只保留 to，省略后面的动词：I\'d be glad to.',
      '并列不定式或并列句中，后一个 to 或重复的谓语部分常可省略',
      '省略必须在语义清楚的前提下进行，否则会造成歧义',
    ],
    markers: ['when/while + doing/done', 'if necessary / if possible', 'I\'d like/love to', 'and (to) do', 'if so / if not'],
    examples: [
      { en: 'While waiting for the ambulance, keep the patient warm.', zh: '等救护车时，要让病人保持温暖。' },
      { en: 'If necessary, press the wound with a clean cloth at once.', zh: '如有必要，立即用干净的布按压伤口。' },
      { en: 'The doctor asked the student to stay calm and (to) breathe slowly.', zh: '医生让学生保持冷静并慢慢呼吸。' },
    ],
    tips: [
      '状语从句省略的前提：从句主语与主句主语一致，且从句谓语含 be 动词',
      '主动关系省略后用 doing，被动关系省略后用 done：When heating… / When heated…',
      '口语中 Be careful! / Careful! / No smoking! 等也是主语或谓语的省略现象',
    ],
  },
  {
    id: 'imperative-and-or',
    title: '“祈使句 + and/or + 陈述句”结构',
    tagline: '祈使句表示条件，and 引出顺承结果（那么），or 引出相反结果（否则），陈述句用一般将来时或情态动词。',
    forms: [
      { label: '祈使句 + and + 结果', detail: 'Cool the burn with running water, and the pain will go down soon.' },
      { label: '祈使句 + or + 后果', detail: 'Act quickly, or the bleeding will get worse.' },
      { label: '名词短语 + and/or…', detail: 'One more minute, and the patient will be in greater danger.' },
      { label: '否定祈使句', detail: 'Don\'t move the patient, or you may hurt his back.' },
    ],
    usages: [
      '祈使句在此相当于条件状语从句：Press here and… = If you press here, …',
      'and 连接顺理成章的积极结果；or（否则）连接不执行命令时的消极后果',
      '祈使句的否定式为 Don\'t / Never + 动词原形',
      '陈述句部分常用 will / may / can 等情态动词或一般将来时',
      '“名词短语 + and + 陈述句”是该结构的变体，名词短语表示一个条件',
    ],
    markers: ['动词原形 + and', '动词原形 + or', 'Don\'t …, or …', 'One more …, and …'],
    examples: [
      { en: 'Follow the doctor\'s advice, and your recovery will be much quicker.', zh: '遵照医嘱，你的康复会快得多。' },
      { en: 'Hurry up with the first aid, or the situation will become dangerous.', zh: '赶快实施急救，否则情况会变得危险。' },
      { en: 'Wrap the bandage too tightly, and the blood cannot flow back easily.', zh: '绷带缠得太紧，血液就不易回流。' },
    ],
    tips: [
      'and 表“那么（顺承）”，or 表“否则（转折）”，选择时看后句结果是期望的还是不希望的',
      '祈使句动词用原形，不随主语变化（省略了主语 you）',
      '区别于并列祈使句：两个祈使句并列用 and 连接时后句仍是命令，不是结果陈述',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 5 First Aid */
export const unit15Exercises: GrammarExercise[] = [
  {
    id: 'u15-g1',
    type: 'mcq',
    pointId: 'ellipsis',
    stem: 'The student was hit by a ball while ______ on the playground.',
    options: ['played', 'playing', 'he playing', 'plays'],
    answerIndex: 1,
    explanation:
      'while 后省略了与主句相同的主语和 be 动词（while he was playing），主动关系省略后用现在分词 playing，故选 B。',
  },
  {
    id: 'u15-g2',
    type: 'mcq',
    pointId: 'ellipsis',
    stem: 'If ______, press the wound with a clean cloth before the ambulance arrives.',
    options: ['necessary', 'it necessary', 'is necessary', 'necessity'],
    answerIndex: 0,
    explanation:
      'If (it is) necessary 为固定省略结构（“如有必要”），省略 it is 后直接用形容词 necessary，故选 A；B、C 结构不完整，D 为名词。',
  },
  {
    id: 'u15-g3',
    type: 'mcq',
    pointId: 'ellipsis',
    stem: 'The nurse told me to breathe slowly and ______ calm while she cleaned the burn.',
    options: ['staying', 'stay', 'stayed', 'to staying'],
    answerIndex: 1,
    explanation:
      '并列不定式中第二个 to 可省略，and 后接动词原形 stay，故选 B；staying / stayed / to staying 均不能与不定式 to breathe 并列。',
  },
  {
    id: 'u15-g4',
    type: 'mcq',
    pointId: 'imperative-and-or',
    stem: '______ the burn with cool running water, and the pain will go down soon.',
    options: ['Cool', 'Cooling', 'To cool', 'Cooled'],
    answerIndex: 0,
    explanation:
      '“祈使句 + and + 陈述句”结构中祈使句用动词原形 Cool（省略主语 you），故选 A；Cooling / To cool / Cooled 均不能构成祈使句。',
  },
  {
    id: 'u15-g5',
    type: 'mcq',
    pointId: 'imperative-and-or',
    stem: '______ quickly, or the bleeding will get worse.',
    options: ['Act', 'Acting', 'To act', 'Acted'],
    answerIndex: 0,
    explanation:
      'or 前的祈使句用动词原形 Act，表示“否则后果”，故选 A；非谓语形式不能充当祈使句。',
  },
  {
    id: 'u15-g6',
    type: 'mcq',
    pointId: 'imperative-and-or',
    stem: "Follow the doctor's advice, ______ your recovery will be much slower.",
    options: ['and', 'or', 'but', 'so'],
    answerIndex: 1,
    explanation:
      '后句“康复会慢得多”是不遵医嘱的消极后果，应用表“否则”的 or 连接，故选 B；and 引出顺承的积极结果，与句意相反；but 表转折、so 表因果，均不合该结构。',
  },
  {
    id: 'u15-f1',
    type: 'fill',
    pointId: 'ellipsis',
    stem: 'If ______, call an ambulance before you move the patient.（填一个词，构成“如果必要的话”的省略结构）',
    answer: 'necessary',
    explanation:
      'If (it is) necessary 是固定省略结构，意为“如果必要的话”，省略 it is 后用形容词 necessary。',
  },
  {
    id: 'u15-f2',
    type: 'fill',
    pointId: 'ellipsis',
    stem: 'While ______ for the ambulance, keep the patient warm and calm.（用 wait 的适当形式填空）',
    answer: 'waiting',
    explanation:
      'while 后省略了 you are，主语与 wait 是主动关系，省略结构用现在分词 waiting。',
  },
  {
    id: 'u15-f3',
    type: 'fill',
    pointId: 'imperative-and-or',
    stem: '______ hard on the wound for ten minutes, and the bleeding will stop.（用 press 的适当形式填空）',
    answer: 'Press',
    explanation:
      '“祈使句 + and + 陈述句”结构中，句首祈使句用动词原形 Press。',
  },
  {
    id: 'u15-f4',
    type: 'fill',
    pointId: 'imperative-and-or',
    stem: 'Hurry up with the first aid, ______ the situation will become dangerous.（填一个连词，表示“否则”）',
    answer: 'or',
    explanation:
      '后句“情况会变得危险”是不采取行动的消极后果，“祈使句 + or + 陈述句”中 or 意为“否则”。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit15GrammarPoints, exercises: unit15Exercises };
