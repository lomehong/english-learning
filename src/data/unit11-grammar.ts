import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修四 Unit 1（Science Fiction）语法点：被动语态的拓展形式 */

export const unit11GrammarPoints: GrammarPoint[] = [
  {
    id: 'passive-progressive-perfect',
    title: '进行时与完成时的被动语态',
    tagline: '被动语态不止一般时态：进行时用 be being done，完成时用 have been done，讲述“正在被/已经被”。',
    forms: [
      { label: '现在进行时的被动', detail: 'am / is / are + being + 过去分词：A new robot is being tested at the lab.' },
      { label: '过去进行时的被动', detail: 'was / were + being + 过去分词：The house was being cleaned by Robin then.' },
      { label: '现在完成时的被动', detail: 'has / have + been + 过去分词：All the dishes have been washed already.' },
      { label: '过去完成时的被动', detail: 'had + been + 过去分词：The carpet had been repaired before the host came home.' },
    ],
    usages: [
      '进行时的被动表示“此刻或当时正在进行”的动作，结构中两个 be 缺一不可：is being done，不能说 is been done',
      '完成时的被动强调动作“已完成”及其对现在的影响，常与 already、by now、so far 等时间标志连用',
      '被动语态由“be + 过去分词”构成，be 承担时态变化：was being done（过去进行）、has been done（现在完成）',
      '不知道或不必说出动作执行者时常省略 by 短语；需要时 by 后接动作执行者',
    ],
    markers: ['is/are being done', 'was/were being done', 'has/have been done', 'had been done', 'by now', 'already'],
    examples: [
      { en: 'A household robot is being tested in fifty families this month.', zh: '本月一款家用机器人正在五十个家庭中试用。' },
      { en: 'When I called, the carpet was being cleaned by the robot.', zh: '我打电话时，机器人正在清洁地毯。' },
      { en: 'All the tickets for the robot show have been sold out by now.', zh: '机器人展的门票现在已经全部售完。' },
    ],
    tips: [
      '进行时被动的 being 不能丢：The bridge is being built. 不能写成 The bridge is build / is built。',
      '完成时被动用 been 不用 being：The work has been finished. 不能写成 has being finished。',
      '被动句谓语动词与主语保持单复数一致：The shirts have been ironed. / The shirt has been ironed.',
    ],
  },
  {
    id: 'passive-modal-infinitive',
    title: '情态动词与不定式的被动语态',
    tagline: '情态动词后接 be done，不定式后接 to be done；短语动词的被动不可拆开介词或副词。',
    forms: [
      { label: '情态动词的被动', detail: 'can / could / must / should / may + be + 过去分词：The machine should be checked first.' },
      { label: '一般不定式的被动', detail: 'to be + 过去分词：The robot needs to be repaired at once.' },
      { label: '完成不定式的被动', detail: 'to have been + 过去分词：The story is said to have been written in 1920.' },
      { label: '短语动词的被动', detail: '动词 + 介词/副词作为整体变被动：The new device will be tested out next week.' },
    ],
    usages: [
      '含情态动词的被动结构为“情态动词 + be + 过去分词”，表能力、可能、必须或建议等语气',
      '不定式的被动常出现在 need / want / deserve 等词之后，或作后置定语、目的状语：a chance to be tried',
      '“be said / believed / reported + to have been done”表示“据说/据报道已经被……”，强调动作先于谓语发生',
      '短语动词（test out、look after、turn down 等）变被动时介词或副词必须保留：She was well looked after.',
    ],
    markers: ['should be done', 'must be done', 'can be done', 'to be done', 'to have been done', 'be tested out'],
    examples: [
      { en: 'Every new robot must be checked before it is sold.', zh: '每台新机器人在出售前都必须经过检查。' },
      { en: 'The old computer needs to be repaired before the show.', zh: '这台旧电脑需要在展览前修理。' },
      { en: 'The novel is believed to have been translated into ten languages.', zh: '这部小说据信已被译成十种语言。' },
    ],
    tips: [
      '情态动词后用动词原形 be：The room should be cleaned. 不能写成 should is / should been cleaned。',
      'need / want 表“需要被做”时可接 -ing 形式表被动含义（needs repairing = needs to be repaired）。',
      '短语动词被动式中介词不可省略：The idea was laughed at. 保留 at。',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 1 Science Fiction */
export const unit11Exercises: GrammarExercise[] = [
  {
    id: 'u11-g1',
    type: 'mcq',
    pointId: 'passive-progressive-perfect',
    stem: 'Don\u2019t enter the lab now. A new household robot ______ there.',
    options: ['is being tested', 'is been tested', 'has tested', 'is testing'],
    answerIndex: 0,
    explanation:
      '由“此刻不要进实验室”可知测试正在进行，现在进行时的被动用 is being done，故选 A；B 结构错误，C、D 为主动形式。',
  },
  {
    id: 'u11-g2',
    type: 'mcq',
    pointId: 'passive-progressive-perfect',
    stem: 'When the family came home, the carpet ______ by the robot.',
    options: ['was being cleaned', 'was been cleaned', 'cleaned', 'was cleaning'],
    answerIndex: 0,
    explanation:
      '“回家那一刻”清洁正在进行，过去进行时的被动用 was being done，故选 A；been 不能直接跟在 was 后作进行被动，C、D 缺被动。',
  },
  {
    id: 'u11-g3',
    type: 'mcq',
    pointId: 'passive-progressive-perfect',
    stem: 'All the tickets for the robot show ______ by now.',
    options: ['have been sold out', 'have sold out', 'had been sold out', 'are being sold out'],
    answerIndex: 0,
    explanation:
      'by now 与现在完成时连用，票“被售完”用被动 have been done，故选 A；B 为主动，C 时态与 by now 不符，D 表“正在售”不合语境。',
  },
  {
    id: 'u11-g4',
    type: 'mcq',
    pointId: 'passive-modal-infinitive',
    stem: 'The machine looks strange. It ______ before it is used.',
    options: ['must be checked', 'must checked', 'must be check', 'must have checked'],
    answerIndex: 0,
    explanation:
      '情态动词的被动结构为“must + be + 过去分词”，故选 A；B 缺 be，C 过去分词拼写错误，D 为主动完成式不合语境。',
  },
  {
    id: 'u11-g5',
    type: 'mcq',
    pointId: 'passive-modal-infinitive',
    stem: 'The old computer doesn\u2019t work. It needs ______ at once.',
    options: ['to be repaired', 'to repair', 'repairing itself', 'repaired'],
    answerIndex: 0,
    explanation:
      '电脑“需要被修理”，不定式的被动用 to be done，故选 A；B 为主动式，D 缺 to be，C 结构不合语义。',
  },
  {
    id: 'u11-g6',
    type: 'mcq',
    pointId: 'passive-modal-infinitive',
    stem: 'The story of the robot ______ into ten languages so far.',
    options: [
      'is said to have been translated',
      'is said to translate',
      'says to be translated',
      'is said to being translated',
    ],
    answerIndex: 0,
    explanation:
      '“据说已被翻译”且先于谓语发生，用 to have been done，故选 A；B 缺被动完成式，C 主被动颠倒，D being 不能用于此处不定式被动。',
  },
  {
    id: 'u11-f1',
    type: 'fill',
    pointId: 'passive-progressive-perfect',
    stem: 'Look! The new robot ______ ______ ______ (test) in the garden right now.（填所给动词的适当时态语态）',
    answer: 'is being tested',
    explanation:
      'right now 表明动作正在进行，robot 与 test 是被动关系，现在进行时的被动填 is being tested。',
  },
  {
    id: 'u11-f2',
    type: 'fill',
    pointId: 'passive-progressive-perfect',
    stem: 'By the time the host woke up, all the rooms ______ ______ ______ (clean) already.（填所给动词的适当时态语态）',
    answer: 'had been cleaned',
    explanation:
      '“by the time + 过去时”表“过去的过去”，rooms 与 clean 是被动关系，过去完成时的被动填 had been cleaned。',
  },
  {
    id: 'u11-f3',
    type: 'fill',
    pointId: 'passive-modal-infinitive',
    stem: 'The instructions say the battery ______ ______ ______ (should / replace) every two years.（填所给词的正确形式）',
    answer: 'should be replaced',
    explanation:
      '情态动词的被动结构为“should + be + 过去分词”，battery 与 replace 是被动关系，填 should be replaced。',
  },
  {
    id: 'u11-f4',
    type: 'fill',
    pointId: 'passive-modal-infinitive',
    stem: 'The new device will ______ ______ ______ (test out) in fifty families next month.（填所给短语的正确形式）',
    answer: 'be tested out',
    explanation:
      'will 后接动词原形 be，短语动词 test out 作被动时副词 out 不可丢，填 be tested out。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit11GrammarPoints, exercises: unit11Exercises };
