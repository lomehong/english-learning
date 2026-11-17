import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修二 Unit 1（Science and Scientists）语法点：过去分词（-ed 形式）作定语与状语 */

export const unit11GrammarPoints: GrammarPoint[] = [
  {
    id: 'past-participle-attributive',
    title: '过去分词（-ed 形式）作定语',
    tagline: '被动与完成：过去分词表示“被……的”，可前置修饰名词，也可用短语后置修饰名词。',
    forms: [
      { label: '前置定语（单个分词）', detail: 'a broken cup / the polluted water / a trained physician' },
      { label: '后置定语（分词短语）', detail: '名词 + done…：a map marked with all the deaths / a theory proved by facts' },
      { label: '复合形容词', detail: 'a well-known scientist / a hand-made device / a highly-respected professor' },
      { label: '修饰人的神态', detail: 'the excited students / a disappointed look（修饰“人感到……”的神情用 -ed）' },
    ],
    usages: [
      '过去分词作定语表示被动或完成的含义：the water polluted by the factory（被工厂污染的水）',
      '单个过去分词一般放在名词前，分词短语放在名词后，相当于一个缩略的定语从句：a map (which was) marked with deaths',
      '及物动词的过去分词表被动，不及物动词的过去分词表完成：the fallen leaves（已落下的叶子）',
      '修饰“人对外界事物的感受”用 -ed（interested / excited / disappointed），修饰“事物本身的性质”用 -ing（interesting / exciting）',
    ],
    markers: ['the …ed + 名词', '名词 + …ed 短语', 'polluted / marked / proved + 名词', 'be 动词省略后的定语从句'],
    examples: [
      { en: 'The water polluted by the factory was linked to the disease.', zh: '被工厂污染的水被认为与这种疾病有关。' },
      { en: 'John Snow drew a map marked with all the deaths in the district.', zh: '约翰·斯诺绘制了一张标出该区全部死亡病例的地图。' },
      { en: 'The surprised physicians gathered in the laboratory to discuss the initial report.', zh: '感到惊讶的医生们聚在实验室里讨论初步报告。' },
    ],
    tips: [
      '分词作定语时，逻辑主语就是它修饰的名词：名词与分词是被动关系用 -ed，主动关系用 -ing',
      '过去分词短语作后置定语可改写为定语从句检验：a vaccine tested many times = a vaccine (that was) tested many times',
      '表“人感到……”的 -ed 形容词（excited / bored / surprised）与表“事物令人……”的 -ing 形容词不要混用',
    ],
  },
  {
    id: 'past-participle-adverbial',
    title: '过去分词（-ed 形式）作状语',
    tagline: '分词短语前置或后置，说明时间、原因、条件、伴随等，其逻辑主语与主句主语一致且为被动关系。',
    forms: [
      { label: '原因状语', detail: 'Done…, 主句：Inspired by the discovery, she decided to continue the research.' },
      { label: '时间状语', detail: 'When/While done…, 主句：When asked about the theory, the physician smiled.' },
      { label: '条件状语', detail: 'Given more time, the team could have proved the theory.' },
      { label: '伴随状语', detail: '主句, followed by two assistants / accompanied by her students' },
    ],
    usages: [
      '过去分词作状语时，其逻辑主语必须是主句的主语，且与分词是被动关系：Given more time, we…（我们“被给予”时间）',
      '可在分词前加 when / while / if / once / unless 等连词，构成“连词 + 过去分词”的省略结构',
      '分词状语的时态意义：完成式 having done 强调动作先于主句发生：Having finished the experiment, he left the laboratory',
      '独立成分例外：分词的逻辑主语与主句不一致时需用独立主格或从句，否则造成“悬垂分词”错误',
    ],
    markers: ['句首 Done…,', 'When / While + done', 'Given / Inspired / Encouraged', '主句, followed by …'],
    examples: [
      { en: 'Inspired by the strange pattern, Snow decided to investigate further.', zh: '受到这个奇怪分布的启发，斯诺决定深入调查。' },
      { en: 'Given more fund, the laboratory could trace the virus more quickly.', zh: '如果能得到更多经费，实验室本可以更快查出这种病毒。' },
      { en: 'The professor walked into the ward, followed by two assistants.', zh: '教授走进病房，后面跟着两名助手。' },
    ],
    tips: [
      '判断用 -ed 还是 -ing：看主句主语与动词的关系，被动用 -ed，主动用 -ing',
      '“连词 + 过去分词”相当于省略了主语和 be 动词的状语从句：When (it is) heated, water turns into steam',
      '分词状语位置较灵活，但伴随状语通常放在句末并用逗号与主句隔开',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 1 Science and Scientists */
export const unit11Exercises: GrammarExercise[] = [
  {
    id: 'u11-g1',
    type: 'mcq',
    pointId: 'past-participle-attributive',
    stem: 'In the sentence "John Snow drew a map marked with all the deaths", the phrase "marked with all the deaths" is used to ______.',
    options: [
      'modify the noun "map"',
      'show the time of the action',
      'explain the result of the action',
      'give the reason for drawing',
    ],
    answerIndex: 0,
    explanation:
      '过去分词短语 marked with all the deaths 位于名词 map 之后作后置定语，修饰 map（= a map which was marked with…），故选 A；其余选项均为状语功能，与句子结构不符。',
  },
  {
    id: 'u11-g2',
    type: 'mcq',
    pointId: 'past-participle-attributive',
    stem: 'The ______ water was soon linked to the outbreak of the disease.',
    options: ['polluting', 'polluted', 'pollutes', 'to pollute'],
    answerIndex: 1,
    explanation:
      'water 与 pollute 之间是被动关系（水“被污染”），作前置定语应用过去分词 polluted，故选 B；polluting 表主动进行，pollutes 与 to pollute 不能作前置定语。',
  },
  {
    id: 'u11-g3',
    type: 'mcq',
    pointId: 'past-participle-adverbial',
    stem: '______ by the unexpected results, the young scientist repeated the whole experiment.',
    options: ['Inspiring', 'Inspired', 'To inspire', 'Inspire'],
    answerIndex: 1,
    explanation:
      '主句主语 the young scientist 与 inspire 是被动关系（“受到启发”），句首作原因状语用过去分词 Inspired，故选 B；Inspiring 表主动，To inspire 是目的状语，Inspire 不能单独作状语。',
  },
  {
    id: 'u11-g4',
    type: 'mcq',
    pointId: 'past-participle-adverbial',
    stem: '______ more time, the research team could have proved their theory about the virus.',
    options: ['Giving', 'Given', 'To give', 'Gives'],
    answerIndex: 1,
    explanation:
      '主句主语 the research team 与 give 是被动关系（团队“被给予”更多时间），作条件状语用过去分词 Given，故选 B；Giving 表主动，To give 表目的，均与被动语义不符。',
  },
  {
    id: 'u11-g5',
    type: 'mcq',
    pointId: 'past-participle-adverbial',
    stem: 'The physician walked into the laboratory, ______ by two assistants.',
    options: ['following', 'followed', 'to follow', 'follow'],
    answerIndex: 1,
    explanation:
      '主句主语 the physician 与 follow 是被动关系（“被跟随”），句末作伴随状语用过去分词 followed，故选 B；following 表主动（医师主动跟随），语义正好相反。',
  },
  {
    id: 'u11-g6',
    type: 'mcq',
    pointId: 'past-participle-attributive',
    stem: 'From the ______ look on her face, we knew the initial statistics were disappointing.',
    options: ['disappointing', 'disappointed', 'disappoint', 'disappointment'],
    answerIndex: 1,
    explanation:
      'look 指人的神情，“感到失望的神情”含被动意味，用过去分词 disappointed 作定语，故选 B；disappointing 意为“令人失望的”，用来修饰事物本身。',
  },
  {
    id: 'u11-f1',
    type: 'fill',
    pointId: 'past-participle-adverbial',
    stem: '______ in 1854, the cholera map helped doctors trace the source of the disease.（用 draw 的适当形式填空）',
    answer: 'Drawn',
    explanation:
      '分词逻辑主语 the cholera map 与 draw 是被动关系（地图“被绘制”），句首作状语应用过去分词 Drawn。',
  },
  {
    id: 'u11-f2',
    type: 'fill',
    pointId: 'past-participle-attributive',
    stem: 'The virus ______ in the school laboratory last week belongs to a rare type.（用 isolate 的适当形式填空）',
    answer: 'isolated',
    explanation:
      'virus 与 isolate 是被动关系（病毒“被分离”），此处作后置定语修饰 virus，应用过去分词 isolated。',
  },
  {
    id: 'u11-f3',
    type: 'fill',
    pointId: 'past-participle-adverbial',
    stem: '______ as the father of modern epidemiology, John Snow is remembered by later scientists.（用 know 的适当形式填空）',
    answer: 'Known',
    explanation:
      'be known as（被称为）为固定搭配，主语 John Snow 与 know 是被动关系，句首作状语用过去分词 Known。',
  },
  {
    id: 'u11-f4',
    type: 'fill',
    pointId: 'past-participle-attributive',
    stem: 'The statistics ______ by his assistant strongly supported the new theory.（用 collect 的适当形式填空）',
    answer: 'collected',
    explanation:
      'statistics 与 collect 是被动关系（数据“被收集”），作后置定语修饰 statistics，应用过去分词 collected。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit11GrammarPoints, exercises: unit11Exercises };
