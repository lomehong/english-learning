import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修三 Unit 3（Environmental Protection）语法点：不定式的被动语态 / 倍数比较表达 */

export const unit28GrammarPoints: GrammarPoint[] = [
  {
    id: 'u28-infinitive-passive',
    title: '不定式的被动语态（to be done / to be given）',
    tagline: '不定式的逻辑主语是动作的承受者时，用 to be done；先于谓语发生用 to have been done。',
    forms: [
      { label: '一般式被动', detail: 'to be + 过去分词：The waste needs to be recycled. / The plan is to be carried out soon.' },
      { label: '完成式被动', detail: 'to have been + 过去分词：The lake is said to have been polluted by the factory.' },
      { label: '作后置定语', detail: '名词 + to be done：There are many problems to be solved. / work to be done' },
      { label: '情态结构后被动', detail: 'must/has to + be + 过去分词：The batteries must be sent to the recycling centre.' },
    ],
    usages: [
      '当不定式的逻辑主语（常是句子主语或所修饰名词）是动作的承受者时，不定式用被动形式 to be done',
      '不定式作定语且与所修饰名词构成动宾关系时用被动式：problems to be solved / the task to be finished',
      'need/want/require 后可接 to be done 表示「需要被做」，与接动名词主动形式（need cleaning）同义',
      '完成被动式 to have been done 表示被动动作发生在谓语动作之前，常与 is said to / seems to 连用',
    ],
    markers: ['to be done', 'to have been done', 'need/want + to be done', 'is/are to be done'],
    examples: [
      { en: 'The plastic waste is to be collected and sorted tomorrow.', zh: '塑料垃圾将在明天收集并分类。' },
      { en: 'These old batteries need to be recycled at special stations.', zh: '这些旧电池需要在专门站点回收。' },
      { en: 'The valley is said to have been polluted by the factory.', zh: '据说这座山谷已被那家工厂污染。' },
    ],
    tips: [
      '判断用被动先看逻辑关系：主语若是不定式动作的承受者，就用 to be done',
      'to be done 表「需要被做」时可与动名词主动互换：need to be cleaned = need cleaning',
      '完成被动式 to have been done 强调动作先于谓语发生，不能与一般被动式混用',
    ],
  },
  {
    id: 'u28-multiple-comparison',
    title: '倍数比较表达（times as ... as ...）',
    tagline: '倍数词放在最前面：twice/three times + as…as / 比较级 + than / the size of。',
    forms: [
      { label: '倍数 + as … as', detail: 'A is twice/three times as + 形容词/副词原级 + as + B：The plant uses three times as much water as that one.' },
      { label: '倍数 + 比较级 + than', detail: 'A is three times larger than B（是 B 的三倍大 / 比 B 大两倍）' },
      { label: '倍数 + the size/length of', detail: 'The landfill is three times the size of our school.' },
      { label: '倍数 + what 从句', detail: 'The emission is twice what it was in 2010.' },
    ],
    usages: [
      '「倍数 + as + 原级 + as」表示 A 是 B 的几倍，两个 as 之间必须用形容词或副词原级',
      '倍数词也可置于比较级之前：three times larger than，中文注意「是……的几倍」与「多几倍」的差别',
      '「倍数 + the size/height/weight of + 名词」用名词表达倍数，倍数词同样前置',
      '倍数词包括 twice（两倍）、three times、four times 等，times 前要用具体数词；表一半用 half',
    ],
    markers: ['twice', 'three times', 'four times', 'half as … as', 'as much … as', 'the size of'],
    examples: [
      { en: 'The new plant recycles twice as much water as the old one.', zh: '新工厂回收的水是旧工厂的两倍。' },
      { en: 'This landfill is three times the size of our school.', zh: '这个填埋场是我们学校的三倍大。' },
      { en: 'Carbon emissions are now twice what they were twenty years ago.', zh: '如今的碳排放是二十年前的两倍。' },
    ],
    tips: [
      'as…as 之间必须用原级，不能写成 as more…as 或 as much…than',
      '倍数词要放在 the size of / 比较级 / as…as 结构之前，不能放在其后',
      '注意中英转换：three times as long as = 长度是……的三倍；three times longer than = 比……长两倍（即三倍）',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 3 Environmental Protection */
export const unit28Exercises: GrammarExercise[] = [
  {
    id: 'u28-g1',
    type: 'mcq',
    pointId: 'u28-infinitive-passive',
    stem: 'The polluted river needs ______ before fish can live in it again.',
    options: ['to be cleaned', 'to clean', 'to have clean', 'cleaned'],
    answerIndex: 0,
    explanation:
      '主语 the polluted river 是 clean 动作的承受者，need 后接不定式被动式 to be cleaned 表示「需要被清理」，故选 A；B 主动式逻辑颠倒，C 结构错误，D 缺 to。',
  },
  {
    id: 'u28-g2',
    type: 'mcq',
    pointId: 'u28-multiple-comparison',
    stem: 'The new solar farm produces ______ energy as the old coal station.',
    options: ['twice as much', 'as twice much', 'much as twice', 'as much twice'],
    answerIndex: 0,
    explanation:
      '倍数词 twice 必须放在 as…as 结构之前，即 twice as much…as（能量是旧电站的两倍），故选 A；B、C、D 均把倍数词或 much 放错位置。',
  },
  {
    id: 'u28-g3',
    type: 'mcq',
    pointId: 'u28-infinitive-passive',
    stem: 'There are still many environmental problems ______ in this area.',
    options: ['to be solved', 'to solve them', 'solved', 'being solve'],
    answerIndex: 0,
    explanation:
      '不定式作 problems 的后置定语，且 problems 是 solve 的承受者，用被动形式 to be solved，故选 A；B 多了宾语 them，C 是过去分词表已完成，D 形式错误。',
  },
  {
    id: 'u28-g4',
    type: 'mcq',
    pointId: 'u28-multiple-comparison',
    stem: 'This nature reserve is ______ the one we visited last year.',
    options: ['three times size of', 'three times the size of', 'the size three times of', 'size of three times the'],
    answerIndex: 1,
    explanation:
      '「倍数 + the size of + 比较对象」表倍数，three times 须置于 the size of 之前，故选 B；A 缺定冠词 the，C、D 语序错误。',
  },
  {
    id: 'u28-g5',
    type: 'mcq',
    pointId: 'u28-infinitive-passive',
    stem: 'The report is said ______ last month, but few people have read it.',
    options: ['to have been published', 'to publish', 'to be publishing', 'published'],
    answerIndex: 0,
    explanation:
      'publish 动作先于 is said 发生，且 report 是承受者，用完成被动式 to have been published，故选 A；B 是主动式，C 进行式不合逻辑，D 缺 to。',
  },
  {
    id: 'u28-g6',
    type: 'mcq',
    pointId: 'u28-multiple-comparison',
    stem: 'People in this city now use ______ plastic bags as they did five years ago.',
    options: ['as half many', 'half many as', 'half as many', 'many as half'],
    answerIndex: 2,
    explanation:
      '表「一半」的 half 与倍数词一样须放在 as…as 之前，即 half as many…as（用量是五年前的一半），故选 C；A、B、D 均为错误语序。',
  },
  {
    id: 'u28-f1',
    type: 'fill',
    pointId: 'u28-infinitive-passive',
    stem: 'The used batteries must ______ to the recycling centre.（用所给词的适当形式填空：send）',
    answer: 'be sent',
    explanation:
      '主语 the used batteries 是 send 的承受者，情态动词 must 后接被动结构 be sent，构成 must be sent（必须被送到回收站）。',
  },
  {
    id: 'u28-f2',
    type: 'fill',
    pointId: 'u28-multiple-comparison',
    stem: 'This factory uses three times ______ much energy as that one.（填一个词）',
    answer: 'as',
    explanation:
      '「倍数 + as + 原级 + as」表倍数：three times as much energy as（耗能是那家的三倍），第一个 as 与第二个 as 配对，填 as。',
  },
  {
    id: 'u28-f3',
    type: 'fill',
    pointId: 'u28-infinitive-passive',
    stem: 'A lot of work remains ______ before the reserve can reopen.（用所给词的适当形式填空：do）',
    answer: 'to be done',
    explanation:
      'work 是 do 的承受者，remain 后接不定式被动式 to be done，表示「大量工作仍需完成」。',
  },
  {
    id: 'u28-f4',
    type: 'fill',
    pointId: 'u28-multiple-comparison',
    stem: 'The lake is now twice ______ size of what it was ten years ago.（填一个词）',
    answer: 'the',
    explanation:
      '「倍数 + the size of」用名词表倍数：twice the size of（是十年前的两倍大），缺定冠词 the。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit28GrammarPoints, exercises: unit28Exercises };
