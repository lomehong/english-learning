import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修三 Unit 5（Poems）语法点：虚拟语气（与现在/过去事实相反的 if 从句） */

export const unit30GrammarPoints: GrammarPoint[] = [
  {
    id: 'u30-subjunctive-present',
    title: '虚拟语气（if 从句与现在事实相反）',
    tagline: '与现在相反：if + 过去式（be 用 were），主句 would/could/might + 动词原形。',
    forms: [
      { label: '基本式', detail: 'If + 主语 + 动词过去式, + 主语 + would/could/might + 动词原形：If I were a poet, I would write about the moonlight.' },
      { label: 'be 动词用 were', detail: 'If he were here, he would recite the poem.（任何人称一律用 were）' },
      { label: '情态选择', detail: '主句用 could/might 表能力或可能：If she had more time, she might read more poetry.' },
      { label: '省略 if 的倒装式', detail: 'Were I a bird, I would sing in the moonlight.（were 提前，去掉 if）' },
    ],
    usages: [
      '表示与现在事实相反的假设：if 从句用一般过去式（be 一律用 were），主句用 would/could/might + 动词原形',
      '从句与主句的时间都指向现在，而非过去；所说内容与当前事实相反',
      'were 可用于任何人称，正式语体中不用 was；倒装时可省略 if 将 were 提前',
      '主句不可用 should + 动词原形表现在虚拟（should 用于将来虚拟）',
    ],
    markers: ['if…did/were', 'would/could/might + 动词原形', 'Were I…', '与现在事实相反'],
    examples: [
      { en: 'If I were a poet, I would write a verse for the spring.', zh: '如果我是诗人，我会为春天写一首诗。' },
      { en: 'If he had more time, he might study Japanese haiku.', zh: '如果他有更多时间，他可能会研究日本俳句。' },
      { en: 'Were I a bird, I would sing in the moonlight.', zh: '假如我是鸟，我会在月光下歌唱。' },
    ],
    tips: [
      'be 动词在从句中一律用 were，正式语体不用 was（If I were you…）',
      '从句不可用 would：说 If I knew…，不说 If I would know…',
      '主句用 would/could/might + 原形；should + 原形属将来虚拟，不用于现在虚拟',
    ],
  },
  {
    id: 'u30-subjunctive-past',
    title: '虚拟语气（if 从句与过去事实相反）',
    tagline: '与过去相反：if + had done，主句 would/could/might have done。',
    forms: [
      { label: '基本式', detail: 'If + 主语 + had + 过去分词, + 主语 + would/could/might + have + 过去分词：If he had read the poem, he would have understood its emotion.' },
      { label: '省略 if 的倒装式', detail: 'Had she known the rhyme, she would have recited it.（had 提前，去掉 if）' },
      { label: '否定式', detail: 'If you had not told me, I would have missed the beauty.' },
      { label: '情态选择', detail: '主句用 could/might have done 表能力或可能：If I had heard the lecture, I could have answered the question.' },
    ],
    usages: [
      '表示与过去事实相反的假设：从句用过去完成时 had done，主句用 would/could/might have done',
      '主从句时间均指向过去，常带有 last year、yesterday 等明确过去时间信息',
      '从句可倒装省略 if：Had he known…, he would have…（否定词 not 仍留在 had 之后）',
      '从句 had done 与主句 would have done 必须呼应，不可与现在虚拟交叉搭配',
    ],
    markers: ['if…had done', 'would have done', 'could have done', 'Had…done', '与过去事实相反'],
    examples: [
      { en: 'If Du Fu had lived in a peaceful age, he might have written happier poems.', zh: '假如杜甫活在太平年代，他或许会写出更欢快的诗。' },
      { en: 'Had I attended the poetry class, I would have learnt how to recite it.', zh: '要是我上了那堂诗歌课，我就会学会怎么朗诵它了。' },
      { en: 'If you had told me earlier, I could have borrowed the book.', zh: '你要是早点告诉我，我就能借到那本书了。' },
    ],
    tips: [
      '从句 had done 与主句 would have done 必须成对出现，不可交叉搭配',
      '倒装时去掉 if 后 had 提前，否定式写作 Had he not come（not 不随 had 提前）',
      '隐含虚拟可由上下文判断：I would have called you 承接 (if I had known) 之意',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 5 Poems */
export const unit30Exercises: GrammarExercise[] = [
  {
    id: 'u30-g1',
    type: 'mcq',
    pointId: 'u30-subjunctive-present',
    stem: 'If I ______ a poet, I would write a poem for the spring rain.',
    options: ['were', 'am', 'had been', 'would be'],
    answerIndex: 0,
    explanation:
      '与现在事实相反的虚拟语气：if 从句 be 动词用 were，主句用 would + 动词原形，故选 A；B 是现在时，C 是过去虚拟形式，D 不能用于从句。',
  },
  {
    id: 'u30-g2',
    type: 'mcq',
    pointId: 'u30-subjunctive-past',
    stem: 'If he ______ the lecture on Tang poetry, he would have understood the metaphor.',
    options: ['had attended', 'attended', 'attends', 'would attend'],
    answerIndex: 0,
    explanation:
      '主句 would have understood 表与过去事实相反，从句须用过去完成时 had attended 呼应，故选 A；B、C 时态不符，D 不能用于 if 从句。',
  },
  {
    id: 'u30-g3',
    type: 'mcq',
    pointId: 'u30-subjunctive-present',
    stem: 'If she had more free time, she ______ every poem in the collection.',
    options: ['might read', 'will read', 'has read', 'reads'],
    answerIndex: 0,
    explanation:
      '从句用过去式 had 表与现在相反的假设，主句用 might + 动词原形，故选 A；B、D 是真实语气的时态，C 与虚拟结构不符。',
  },
  {
    id: 'u30-g4',
    type: 'mcq',
    pointId: 'u30-subjunctive-past',
    stem: '______ you known the rhyme scheme, you would have finished the translation.',
    options: ['Had', 'Have', 'Did', 'Would'],
    answerIndex: 0,
    explanation:
      '与过去事实相反且省略 if：had 提前构成倒装 Had you known，主句用 would have done，故选 A；B、C 不能这样倒装，D 用于倒装会造成语义混乱。',
  },
  {
    id: 'u30-g5',
    type: 'mcq',
    pointId: 'u30-subjunctive-present',
    stem: 'Were I a bird, I ______ in the deep blue sky.',
    options: ['would fly', 'will fly', 'flew', 'had flown'],
    answerIndex: 0,
    explanation:
      'Were I… 是 If I were… 的倒装式，与现在事实相反，主句用 would + 动词原形，故选 A；B 是真实将来时，C 是过去式，D 是完成式，均不匹配。',
  },
  {
    id: 'u30-g6',
    type: 'mcq',
    pointId: 'u30-subjunctive-past',
    stem: 'If the young poet ______ the competition, her first collection would have come out earlier.',
    options: ['had won', 'won', 'wins', 'would win'],
    answerIndex: 0,
    explanation:
      '主句 would have come out 表与过去相反，从句用过去完成时 had won 与之呼应，故选 A；B、C 时态不匹配，D 不能用于 if 从句。',
  },
  {
    id: 'u30-f1',
    type: 'fill',
    pointId: 'u30-subjunctive-present',
    stem: 'If I ______ a painter, I would draw the moonlight on the lake.（用所给词的适当形式填空：be）',
    answer: 'were',
    explanation:
      '与现在事实相反的虚拟语气中，if 从句 be 动词任何人称一律用 were，故填 were。',
  },
  {
    id: 'u30-f2',
    type: 'fill',
    pointId: 'u30-subjunctive-past',
    stem: 'If she ______ the recitation last night, she would have cried.（用所给词的适当形式填空：hear）',
    answer: 'had heard',
    explanation:
      '主句 would have cried 表与过去相反，且 last night 指明过去时间，从句用过去完成时 had heard。',
  },
  {
    id: 'u30-f3',
    type: 'fill',
    pointId: 'u30-subjunctive-present',
    stem: 'If we ______ more lessons on poetry, we might understand the imagery better.（用所给词的适当形式填空：have）',
    answer: 'had',
    explanation:
      '与现在事实相反：主句 might + 动词原形，从句用一般过去式，have 的过去式为 had。',
  },
  {
    id: 'u30-f4',
    type: 'fill',
    pointId: 'u30-subjunctive-past',
    stem: 'Had I kept a diary that year, I ______ down the sorrow of parting.（用所给词的适当形式填空：write）',
    answer: 'would have written',
    explanation:
      'Had I kept 是与过去相反的倒装式 if 从句，主句用 would have + 过去分词，write 的过去分词为 written。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit30GrammarPoints, exercises: unit30Exercises };
