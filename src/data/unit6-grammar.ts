import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修一 Unit 1（People of Achievement）语法点：非限制性定语从句 */

export const unit6GrammarPoints: GrammarPoint[] = [
  {
    id: 'non-restrictive-relative',
    title: '非限制性定语从句（关系代词 who / whom / which / whose）',
    tagline: '补充说明而非限定：从句用逗号与主句隔开，关系代词不可用 that、通常不可省略。',
    forms: [
      { label: '修饰人（作主语）', detail: '先行词（人）, + who + 从句：Tu Youyou, who saved millions of lives, …' },
      { label: '修饰人（作宾语）', detail: '先行词（人）, + whom / who + 从句：the scientist, whom we respect deeply, …' },
      { label: '修饰物', detail: '先行词（物）, + which + 从句：the medicine, which was extracted from wormwood, …' },
      { label: '表所属', detail: '先行词, + whose + 名词 + 从句：the professor, whose device won a patent, …' },
    ],
    usages: [
      '非限制性定语从句对先行词作附加说明，去掉后主句意思仍完整；从句前后用逗号与主句分开',
      '先行词是人时用 who / whom / whose，是事物时用 which；that 不能引导非限制性定语从句',
      '关系代词在非限制性定语从句中即使作宾语也不可省略（限制性定语从句中作宾语可省）',
      '先行词是专有名词（如 Tu Youyou、Beijing）时，其后只用非限制性定语从句作补充描述',
    ],
    markers: [', who', ', whom', ', whose', ', which', 'two commas', '专有名词后'],
    examples: [
      { en: 'Tu Youyou, who devoted herself to medicine, won the Nobel Prize in 2015.', zh: '致力于医学的屠呦呦于 2015 年获得诺贝尔奖。' },
      { en: 'The medicine, which came from a common herb, saved millions of lives.', zh: '这种来自普通草药的药物挽救了数百万人的生命。' },
      { en: 'Mr Lin, whose telescope was homemade, knows every star in the sky.', zh: '自制望远镜的林先生认识天上的每一颗星。' },
    ],
    tips: [
      'that 不能用于非限制性定语从句：说 the herb, which… 不说 the herb, that…',
      '非限制性定语从句的关系代词任何时候都不能省略，也不能用 what 代替',
      '从句谓语动词仍与先行词保持数的一致：The students, who were tired, …',
    ],
  },
  {
    id: 'prep-which-whom',
    title: '“介词 + which / whom”与 which 指代整个主句',
    tagline: '介词后指物用 which、指人用 whom；which 还可指代前面整个主句的内容。',
    forms: [
      { label: '介词 + which（指物）', detail: 'the lab in which the discovery was made（= the lab where…）' },
      { label: '介词 + whom（指人）', detail: 'two sons, both of whom are doctors / the scientist, from whom we learnt a lot' },
      { label: 'which 指代整句', detail: '主句, + which + 谓语…：He passed the exam, which surprised us all.' },
      { label: '固定介词搭配', detail: 'during which / for which / at which：a week, during which she stayed in Stockholm' },
    ],
    usages: [
      '先行词是事物时“介词 + which”，是人时“介词 + whom”；介词的选择取决于从句中的搭配或要表达的关系',
      '“数词 / 代词 + of + which / whom”表示整体中的一部分：many of whom / most of which',
      'which 指代整个主句时，从句谓语用第三人称单数：…, which has changed our life',
      '“介词 + which”结构可与关系副词互换：the house in which he was born = the house where he was born',
    ],
    markers: ['in which', 'of which', 'of whom', 'for which', 'during which', ', which + 动词单数'],
    examples: [
      { en: 'The institute in which she works was founded in 1958.', zh: '她工作的那家研究所创建于 1958 年。' },
      { en: 'The professor has two assistants, both of whom are studying malaria.', zh: '这位教授有两名助手，他们都在研究疟疾。' },
      { en: 'He gave the prize money to the school, which moved us deeply.', zh: '他把奖金捐给了学校，这让我们深受感动。' },
    ],
    tips: [
      '介词提前时关系代词只能用 which / whom，不能用 that 或 who',
      'which 指代整个主句时，其前逗号必不可少，且从句动词用单数形式',
      '判断介词先看从句固定搭配（work in the institute → in which），再看整体与部分关系（both of whom）',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 1 People of Achievement */
export const unit6Exercises: GrammarExercise[] = [
  {
    id: 'u6-g1',
    type: 'mcq',
    pointId: 'non-restrictive-relative',
    stem: 'Tu Youyou, ______ saved millions of lives, accepted the prize quietly.',
    options: ['who', 'which', 'that', 'whom'],
    answerIndex: 0,
    explanation:
      '非限制性定语从句修饰人且关系代词作主语，用 who，故选 A；which 只指物，that 不能引导非限制性定语从句，whom 只能作宾语。',
  },
  {
    id: 'u6-g2',
    type: 'mcq',
    pointId: 'non-restrictive-relative',
    stem: 'The medicine, ______ was extracted from a common herb, became famous all over the world.',
    options: ['who', 'which', 'that', 'whose'],
    answerIndex: 1,
    explanation:
      '先行词 the medicine 指物，非限制性定语从句用 which，故选 B；who 只指人，that 不能用于非限制性定语从句，whose 表所属。',
  },
  {
    id: 'u6-g3',
    type: 'mcq',
    pointId: 'prep-which-whom',
    stem: 'Mr Lin gave most of his money to the school library, ______ surprised everyone.',
    options: ['which', 'what', 'it', 'this'],
    answerIndex: 0,
    explanation:
      'which 在此指代前面整个主句的内容（他把大部分钱捐给了图书馆这件事），故选 A；what 不能引导定语从句，it 和 this 不是关系代词。',
  },
  {
    id: 'u6-g4',
    type: 'mcq',
    pointId: 'prep-which-whom',
    stem: 'The professor has two sons, both of ______ are doctors in the same hospital.',
    options: ['who', 'whom', 'which', 'them'],
    answerIndex: 1,
    explanation:
      '“both of + 关系代词”修饰人，介词 of 后只能用 whom，故选 B；介词后不能用 who 或 that，them 不是关系代词。',
  },
  {
    id: 'u6-g5',
    type: 'mcq',
    pointId: 'non-restrictive-relative',
    stem: 'The young researcher, ______ laptop was full of data tables, stayed in the lab until midnight.',
    options: ['whose', 'which', 'who', 'its'],
    answerIndex: 0,
    explanation:
      '关系代词后紧跟名词 laptop，表所属关系用 whose，故选 A；whose 既可指人也可指物，its 不是关系代词。',
  },
  {
    id: 'u6-g6',
    type: 'mcq',
    pointId: 'prep-which-whom',
    stem: 'She stayed in Stockholm for a week, during ______ she visited several museums.',
    options: ['which', 'that', 'when', 'what'],
    answerIndex: 0,
    explanation:
      '“during + which”是固定搭配，修饰先行词 a week，故选 A；介词后不能用 that，when 不能作介词宾语，what 不能引导定语从句。',
  },
  {
    id: 'u6-f1',
    type: 'fill',
    pointId: 'non-restrictive-relative',
    stem: 'Albert Einstein, ______ was born in Germany, later moved to the United States.（填适当的关系代词）',
    answer: 'who',
    explanation:
      '先行词 Albert Einstein 指人，非限制性定语从句中关系代词作主语，填 who。',
  },
  {
    id: 'u6-f2',
    type: 'fill',
    pointId: 'prep-which-whom',
    stem: 'The team tried more than two hundred herbs, most of ______ failed to cure the disease.（填适当的关系代词）',
    answer: 'which',
    explanation:
      '“most of + 关系代词”修饰指物的先行词 herbs，介词 of 后指物用 which。',
  },
  {
    id: 'u6-f3',
    type: 'fill',
    pointId: 'non-restrictive-relative',
    stem: 'The prize was given to Tu and her team, ______ work has saved millions of lives.（填适当的关系代词）',
    answer: 'whose',
    explanation:
      '关系代词后接名词 work，表示“他们的（研究）工作”，表所属填 whose。',
  },
  {
    id: 'u6-f4',
    type: 'fill',
    pointId: 'prep-which-whom',
    stem: 'The award ceremony, ______ Tu Youyou could not attend in person, was held in December.（填适当的关系代词）',
    answer: 'which',
    explanation:
      '先行词 the award ceremony 指物，关系代词作 attend 的宾语且位于非限制性定语从句中，填 which。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit6GrammarPoints, exercises: unit6Exercises };
