import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修二 Unit 3（Food and Culture）语法点：it 作形式主语与形式宾语 */

export const unit13GrammarPoints: GrammarPoint[] = [
  {
    id: 'it-formal-subject',
    title: 'it 作形式主语',
    tagline: 'it 占据主语位置，把真正的主语（不定式、动名词或从句）后移，使句子平衡自然。',
    forms: [
      { label: 'it + adj. + to do', detail: 'It is important to chew slowly and eat in moderation.' },
      { label: 'it + n. + to do', detail: 'It is a tradition for the family to make dumplings together.' },
      { label: 'it + adj./n. + that 从句', detail: 'It is believed that spicy food can open the appetite.' },
      { label: '固定句型', detail: 'It is no use arguing about which cuisine is the best. / It takes an hour to steam the fish.' },
    ],
    usages: [
      '不定式短语、动名词短语或 that 从句作主语太长时，用 it 作形式主语后移真正主语',
      '“It + be + 形容词 + for/of sb + to do”：修饰事物性质用 for，描写人的品质用 of（kind / brave / wise…）',
      '常用句型：It takes sb time to do / It is no use doing / It is said (believed / reported) that…',
      'it 作形式主语时谓语动词用单数；真正主语是不定式或从句时谓语也用单数',
    ],
    markers: ['It is + adj. + to do', 'It takes … to do', 'It is said/believed that', 'It is no use doing'],
    examples: [
      { en: 'It is important to keep a balance between quantity and nutrition.', zh: '在数量与营养之间保持平衡很重要。' },
      { en: 'It is a tradition for the whole family to share a big meal at the festival.', zh: '节日里全家共享一顿大餐是一个传统。' },
      { en: 'It is said that the chef learned his exceptional skills in Sichuan.', zh: '据说这位厨师的绝活在四川学的。' },
    ],
    tips: [
      '形式主语 it 不能换成 this 或 that：说 It is important to… 不说 This is important to…（指代不明）',
      'It is no use / no good 后接动名词（doing），不接不定式',
      'for 与 of 的选择：形容词说明“事”用 for，说明“人”的品质用 of',
    ],
  },
  {
    id: 'it-formal-object',
    title: 'it 作形式宾语',
    tagline: '复合宾语中不定式或从句作真正的宾语后移时，用 it 占据宾语位置：主语 + 谓语 + it + 宾补 + to do / that…。',
    forms: [
      { label: 'find / think + it + adj. + to do', detail: 'Most children find it hard to refuse a sweet dessert.' },
      { label: 'consider / make + it + n. + to do', detail: 'The cook thinks it his duty to keep the kitchen clean.' },
      { label: 'feel / find + it + adj. + that 从句', detail: 'We all feel it a pity that you can\'t taste my hometown cuisine.' },
      { label: '固定搭配', detail: 'owe it to sb to do / see to it that…（务必做到）' },
    ],
    usages: [
      '当宾语后面还有宾语补足语（形容词或名词）时，真正的宾语（不定式/从句）须后移，用 it 作形式宾语',
      '常用于该结构的动词：find / think / consider / make / feel / believe 等',
      '形式宾语 it 后的补足语说明宾语的性质或身份：find it difficult / make it a rule',
      'it 作形式宾语时不能省略，也不能用 this / that 代替',
    ],
    markers: ['find it + adj. + to', 'think it + n. + to', 'make it a rule to', 'feel it a pity that'],
    examples: [
      { en: 'Many people find it hard to resist the flavour of fried food.', zh: '很多人觉得油炸食品的香味难以抗拒。' },
      { en: 'The chef considers it fundamental to select fresh ingredients.', zh: '这位厨师认为挑选新鲜原料是根本。' },
      { en: 'We all think it a wonderful chance to learn about foreign cuisine.', zh: '我们都认为这是了解外国菜肴的好机会。' },
    ],
    tips: [
      '先看宾补结构：凡“谓语 + 宾补 + 长宾语”的句子，宾语位置一律先用 it 顶住',
      '形式宾语 it 与代替前文事物的代词 it 不同：后者有明确指代，前者只占位',
      '宾补若是名词，常表示身份或类属：think it one\'s duty / make it a habit',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 3 Food and Culture */
export const unit13Exercises: GrammarExercise[] = [
  {
    id: 'u13-g1',
    type: 'mcq',
    pointId: 'it-formal-subject',
    stem: '______ is important to chew slowly and eat in moderate quantities.',
    options: ['It', 'This', 'That', 'As'],
    answerIndex: 0,
    explanation:
      '不定式 to chew slowly… 是真正的主语，句首应用形式主语 It 占位，故选 A；This / That 无形式主语功能，As 不能引导该结构。',
  },
  {
    id: 'u13-g2',
    type: 'mcq',
    pointId: 'it-formal-subject',
    stem: '______ is believed that spicy food can open the appetite in hot weather.',
    options: ['It', 'That', 'What', 'There'],
    answerIndex: 0,
    explanation:
      'It is believed that… 为固定句型，it 作形式主语，that 从句后移，故选 A；That 不能作形式主语，There 与 What 均不用于该结构。',
  },
  {
    id: 'u13-g3',
    type: 'mcq',
    pointId: 'it-formal-object',
    stem: 'Most children find ______ hard to refuse a sweet dessert after dinner.',
    options: ['it', 'this', 'that', 'one'],
    answerIndex: 0,
    explanation:
      'find 后接宾补 hard，真正的宾语是不定式 to refuse…，宾语位置应用形式宾语 it，故选 A；this / that 不作形式宾语，one 指代同名异物也不合结构。',
  },
  {
    id: 'u13-g4',
    type: 'mcq',
    pointId: 'it-formal-object',
    stem: 'The new cook thinks ______ his duty to keep every ingredient fresh.',
    options: ['that', 'it', 'this', 'what'],
    answerIndex: 1,
    explanation:
      'thinks 后有宾补 his duty，真正宾语是不定式 to keep…，应用 it 作形式宾语，故选 B；that 引导从句时后面不能再接宾补，this 无此功能。',
  },
  {
    id: 'u13-g5',
    type: 'mcq',
    pointId: 'it-formal-subject',
    stem: '______ is no use arguing about which cuisine is the best in the world.',
    options: ['It', 'There', 'That', 'This'],
    answerIndex: 0,
    explanation:
      'It is no use doing… 为固定句型，it 作形式主语，真正主语是动名词短语 arguing about…，故选 A；There is no use 不成立。',
  },
  {
    id: 'u13-g6',
    type: 'mcq',
    pointId: 'it-formal-subject',
    stem: '______ takes about an hour to steam the fish with ginger and mushroom.',
    options: ['It', 'That', 'This', 'One'],
    answerIndex: 0,
    explanation:
      'It takes (sb) time to do sth 为固定句型，it 作形式主语，真正主语是不定式 to steam the fish，故选 A；其余选项均不能用于该句型。',
  },
  {
    id: 'u13-f1',
    type: 'fill',
    pointId: 'it-formal-subject',
    stem: "______ is a family tradition for us to make dumplings together on New Year's Eve.（填一个恰当的词）",
    answer: 'It',
    explanation:
      '不定式短语 for us to make dumplings… 是真正的主语，句首应用 it 作形式主语，构成 It is a tradition for sb to do sth。',
  },
  {
    id: 'u13-f2',
    type: 'fill',
    pointId: 'it-formal-object',
    stem: 'We all consider ______ an honour to taste your home-made dessert.（填一个恰当的词）',
    answer: 'it',
    explanation:
      'consider 后接宾补 an honour，真正的宾语是不定式 to taste…，宾语位置应用形式宾语 it。',
  },
  {
    id: 'u13-f3',
    type: 'fill',
    pointId: 'it-formal-subject',
    stem: "______ is said that the restaurant's chef once studied Sichuan cuisine abroad.（填一个恰当的词）",
    answer: 'It',
    explanation:
      'It is said that… 为固定句型，it 作形式主语，that 从句是真正的主语。',
  },
  {
    id: 'u13-f4',
    type: 'fill',
    pointId: 'it-formal-object',
    stem: "Don't you think ______ necessary to learn some basic cooking skills before living alone?（填一个恰当的词）",
    answer: 'it',
    explanation:
      'think 后接宾补 necessary，真正的宾语是不定式 to learn…，应用 it 作形式宾语占据宾语位置。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit13GrammarPoints, exercises: unit13Exercises };
