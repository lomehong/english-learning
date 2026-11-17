import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修一 Unit 5（Languages Around the World）语法点：who/that 与 which/that 引导的限制性定语从句 */

export const unit5GrammarPoints: GrammarPoint[] = [
  {
    id: 'relative-who-that',
    title: 'who / that 引导的限制性定语从句',
    tagline: '修饰人：先行词是人时用 who 或 that 引导定语从句，关系代词在从句中作主语或宾语。',
    forms: [
      { label: '肯定', detail: '先行词（人） + who / that + 从句（…who speaks three languages）' },
      { label: '宾语省略', detail: '关系代词作从句宾语时可省略：the teacher (who) I like best' },
      { label: '主语不可省', detail: '关系代词作从句主语时不可省略：the girl who is singing' },
    ],
    usages: [
      '先行词是人（person / student / those…）时，关系代词用 who 或 that，在从句中作主语或宾语',
      '关系代词作从句主语时，从句谓语动词的数与先行词保持一致：The students who are learning Chinese…',
      'those who… 表示“……的人”：Those who struggle with grammar should do more exercises',
    ],
    markers: ['who', 'that', 'the person', 'people', 'those who', 'anyone who'],
    examples: [
      { en: 'The girl who speaks three languages is my deskmate.', zh: '会说三种语言的那个女孩是我的同桌。' },
      { en: 'A native speaker that I met online helps me with pronunciation.', zh: '我在网上认识的一位母语者帮我练习发音。' },
      { en: 'Those who struggle with grammar should do more exercises.', zh: '在语法上吃力的同学应该多做练习。' },
    ],
    tips: [
      'who 只指人；that 既可指人也可指物，指人时常与 who 通用',
      '关系代词作从句主语时不能省略，作宾语时才可以省略',
      '从句谓语动词的单复数跟先行词走，而不是跟关系代词走',
    ],
  },
  {
    id: 'relative-which-that',
    title: 'which / that 引导的限制性定语从句',
    tagline: '修饰物：先行词是事物时用 which 或 that 引导定语从句，关系代词在从句中作主语或宾语。',
    forms: [
      { label: '肯定', detail: '先行词（物） + which / that + 从句（…which was written in 1898）' },
      { label: '宾语省略', detail: '关系代词作从句宾语时可省略：the dictionary (that) I bought yesterday' },
      { label: '介词 + which', detail: '先行词 + 介词 + which：the way in which people communicate' },
    ],
    usages: [
      '先行词是事物或动物时，关系代词用 which 或 that，在从句中作主语或宾语',
      '关系代词作从句主语时，从句谓语动词的数与先行词保持一致：The app that offers daily lessons…',
      '先行词被序数词、形容词最高级或 all / the only 等修饰时，习惯用 that：the best film that I have ever seen',
    ],
    markers: ['which', 'that', 'the book / the word / the app', 'in which', 'all that', 'the only … that'],
    examples: [
      { en: 'The app which teaches Spanish has millions of users.', zh: '那款教西班牙语的应用有数百万用户。' },
      { en: 'The dictionary that my teacher recommended is very useful.', zh: '老师推荐的那本词典非常有用。' },
      { en: 'This is the best film that I have ever seen in English.', zh: '这是我看过的最好的英文电影。' },
    ],
    tips: [
      'which 只指物；that 指物时常与 which 通用，但介词后只能用 which（说 in which 不说 in that）',
      '先行词为 all / everything / nothing 或被最高级修饰时，习惯用 that 而不用 which',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 5 Languages Around the World */
export const unit5Exercises: GrammarExercise[] = [
  {
    id: 'u5-g1',
    type: 'mcq',
    pointId: 'relative-who-that',
    stem: 'The teacher ______ taught us Spanish last year has moved to Shanghai.',
    options: ['who', 'which', 'whose', 'what'],
    answerIndex: 0,
    explanation:
      '先行词 the teacher 指人，关系代词在从句中作主语，用 who（也可用 that），故选 A；which 只指物，whose 表所属，what 不能引导定语从句。',
  },
  {
    id: 'u5-g2',
    type: 'mcq',
    pointId: 'relative-which-that',
    stem: 'Language Corner is an app ______ helps beginners practise pronunciation.',
    options: ['who', 'which', 'whose', 'where'],
    answerIndex: 1,
    explanation:
      '先行词 an app 指物，关系代词在从句中作主语，用 which（也可用 that），故选 B；who 只指人，whose 表所属，where 是关系副词。',
  },
  {
    id: 'u5-g3',
    type: 'mcq',
    pointId: 'relative-who-that',
    stem: 'People ______ speak more than one language often find it easier to make friends.',
    options: ['which', 'who', 'whose', 'whom'],
    answerIndex: 1,
    explanation:
      '先行词 people 指人，关系代词在从句中作主语用 who，故选 B；which 不指人，whose 表所属，whom 只能作宾语不能作主语。',
  },
  {
    id: 'u5-g4',
    type: 'mcq',
    pointId: 'relative-which-that',
    stem: 'The expression ______ you learned just now comes from an old story.',
    options: ['who', 'which', 'where', 'what'],
    answerIndex: 1,
    explanation:
      '先行词 the expression 指物，关系代词在从句中作 learned 的宾语，用 which 或 that（此处也可省略），故选 B；who 只指人，where 是关系副词，what 不能引导定语从句。',
  },
  {
    id: 'u5-g5',
    type: 'mcq',
    pointId: 'relative-who-that',
    stem: 'Look at the exchange students ______ are singing over there!',
    options: ['which', 'who', 'whose', 'whom'],
    answerIndex: 1,
    explanation:
      '先行词 the exchange students 指人，关系代词在从句中作主语用 who，故选 B；which 不指人，whose 表所属，whom 不能作主语。',
  },
  {
    id: 'u5-g6',
    type: 'mcq',
    pointId: 'relative-which-that',
    stem: 'This is the most interesting grammar book ______ I have ever read.',
    options: ['which', 'who', 'that', 'whose'],
    answerIndex: 2,
    explanation:
      '先行词被形容词最高级 the most interesting 修饰时，关系代词习惯用 that，故选 C；which 用于此语境不合习惯，who 只指人，whose 表所属。',
  },
  {
    id: 'u5-f1',
    type: 'fill',
    pointId: 'relative-which-that',
    stem: 'A dictionary is a useful tool ______ can help you understand new words.（填适当的关系代词）',
    answer: 'which',
    acceptable: ['that'],
    explanation:
      '先行词 a useful tool 指物，关系代词在从句中作主语，填 which 或 that。',
  },
  {
    id: 'u5-f2',
    type: 'fill',
    pointId: 'relative-who-that',
    stem: 'The woman ______ is talking with our English teacher is a native speaker.（填适当的关系代词）',
    answer: 'who',
    acceptable: ['that'],
    explanation:
      '先行词 the woman 指人，关系代词在从句中作主语，填 who 或 that。',
  },
  {
    id: 'u5-f3',
    type: 'fill',
    pointId: 'relative-who-that',
    stem: 'We thanked the volunteers ______ organised the language festival last week.（填适当的关系代词）',
    answer: 'who',
    acceptable: ['that'],
    explanation:
      '先行词 the volunteers 指人，关系代词在从句中作主语，填 who 或 that。',
  },
  {
    id: 'u5-f4',
    type: 'fill',
    pointId: 'relative-which-that',
    stem: 'The French song ______ she sang yesterday sounds beautiful.（填适当的关系代词）',
    answer: 'which',
    acceptable: ['that'],
    explanation:
      '先行词 the French song 指物，关系代词在从句中作 sang 的宾语，填 which 或 that（此处也可省略）。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit5GrammarPoints, exercises: unit5Exercises };
