import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修二 Unit 4（History and Traditions）语法点：过去分词作定语 / 过去分词作宾语补足语 */

export const unit9GrammarPoints: GrammarPoint[] = [
  {
    id: 'past-participle-attributive',
    title: '过去分词（短语）作定语',
    tagline: '过去分词作定语表被动或完成：单个分词前置，分词短语后置，相当于定语从句。',
    forms: [
      { label: '前置定语', detail: '过去分词 + 名词（a painted bridge 一座被彩绘的桥）' },
      { label: '后置定语', detail: '名词 + 过去分词短语（a novel written in the Tang Dynasty）' },
      { label: '从句改写', detail: 'which / that is / was + 过去分词 → 过去分词短语' },
    ],
    usages: [
      '及物动词的过去分词作定语，表示被动含义（the books borrowed from the library）',
      '不及物动词的过去分词作定语，表示完成（the fallen leaves 落叶）',
      '过去分词短语作定语须后置，相当于缩略的定语从句',
    ],
    markers: ['written', 'built', 'painted', 'named', 'given', 'lost', 'fallen', 'broken'],
    examples: [
      { en: 'The castle built nine hundred years ago still stands on the hill.', zh: '九百年前建的那座城堡仍矗立在山上。' },
      { en: 'Things lost never return, so value what you have.', zh: '失去的东西不会回来，所以要珍惜你拥有的。' },
      { en: 'This is a book written by a famous traveller in the Ming Dynasty.', zh: '这是一本由明代著名旅行家写的书。' },
    ],
    tips: [
      '表被动或完成用过去分词，表主动或正在进行用现在分词（boiling water 开着的水 / boiled water 煮开过的水）',
      '过去分词短语作定语后置，不要误加 which / that',
    ],
  },
  {
    id: 'past-participle-complement',
    title: '过去分词作宾语补足语',
    tagline: '用于“动词 + 宾语 + 过去分词”结构，表示宾语被动的状态或已完成的结果。',
    forms: [
      { label: '感观类', detail: 'see / hear / watch / feel + 宾语 + 过去分词（强调被动的状态）' },
      { label: '使役类', detail: 'have / make / get + 宾语 + 过去分词（表“使被做”）' },
      { label: '意愿类', detail: 'want / find / keep / leave + 宾语 + 过去分词' },
    ],
    usages: [
      'see sb\u2019s name written on the wall 之类结构中，宾语与分词是被动关系',
      'have / get sth done 常表示“请别人做某事”或“遭遇某事”',
      'keep / leave + 宾语 + 过去分词，表示使某物保持某种状态',
    ],
    markers: ['have … done', 'get … done', 'make … done', 'find … done', 'keep … done', 'hear … done'],
    examples: [
      { en: 'We had the old photos copied before the museum closed.', zh: '我们在博物馆闭馆前（请人）把老照片复制了一份。' },
      { en: 'When he woke up, he found the town decorated with lanterns.', zh: '他醒来时发现小镇挂满了灯笼。' },
      { en: 'She heard her name called at the gate of the village.', zh: '她听到有人在村口喊她的名字。' },
    ],
    tips: [
      '宾语与补足语是主动关系时用现在分词：heard her calling（她正在喊）',
      'have sb do sth（让某人做）与 have sth done（让某事被做）含义不同',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），语境取自 Unit 4 History and Traditions 主题 */
export const unit9Exercises: GrammarExercise[] = [
  {
    id: 'u19-g1',
    type: 'mcq',
    pointId: 'past-participle-attributive',
    stem: 'The bridge ______ in the Ming Dynasty is the oldest one in this town.',
    options: ['building', 'built', 'to build', 'build'],
    answerIndex: 1,
    explanation:
      'bridge 与 build 是被动关系且动作已完成，用过去分词 built 作后置定语，相当于 which was built。',
  },
  {
    id: 'u19-g2',
    type: 'mcq',
    pointId: 'past-participle-attributive',
    stem: 'On the ground lay the ______ leaves, telling us that autumn had come.',
    options: ['falling', 'fallen', 'fell', 'to fall'],
    answerIndex: 1,
    explanation:
      'fall 是不及物动词，fallen 表示“已经落下的”，与 leaves 构成完成含义；falling leaves 表示“正在飘落的叶子”，与句意不符。',
  },
  {
    id: 'u19-g3',
    type: 'mcq',
    pointId: 'past-participle-complement',
    stem: 'Before the festival, the family had the courtyard ______ with red lanterns.',
    options: ['decorate', 'decorating', 'decorated', 'to decorate'],
    answerIndex: 2,
    explanation:
      'have sth done 表示“请人做某事”，courtyard 与 decorate 是被动关系，故用过去分词 decorated。',
  },
  {
    id: 'u19-g4',
    type: 'mcq',
    pointId: 'past-participle-complement',
    stem: 'Walking through the old town, I found the walls ______ with colourful paintings.',
    options: ['cover', 'covered', 'covering', 'to cover'],
    answerIndex: 1,
    explanation:
      'find + 宾语 + 过去分词表示宾语所处的被动状态，walls 与 cover 是被动关系，故选 covered。',
  },
  {
    id: 'u19-g5',
    type: 'mcq',
    pointId: 'past-participle-attributive',
    stem: 'The story ______ by my grandpa is about a battle fought on this river.',
    options: ['told', 'telling', 'to tell', 'tell'],
    answerIndex: 0,
    explanation:
      'story 与 tell 是被动关系（故事被讲），用过去分词 told 作后置定语。',
  },
  {
    id: 'u19-g6',
    type: 'mcq',
    pointId: 'past-participle-complement',
    stem: 'At the feast I heard the guests ______ an old song about the harvest.',
    options: ['sing', 'sung', 'sang', 'to sing'],
    answerIndex: 0,
    explanation:
      'hear + 宾语 + 补足语：guests 与 sing 是主动关系（客人们唱），用省略 to 的不定式 sing；若表被动才用 sung。',
  },
  {
    id: 'u19-f1',
    type: 'fill',
    pointId: 'past-participle-attributive',
    stem: 'The custom ______ (pass) down for six generations is still alive in the village.',
    answer: 'passed',
    explanation:
      'custom 与 pass down 是被动关系，用过去分词 passed 作后置定语，相当于 which has been passed down。',
  },
  {
    id: 'u19-f2',
    type: 'fill',
    pointId: 'past-participle-attributive',
    stem: 'The poem ______ (write) by a poet in the Song Dynasty is popular even today.',
    answer: 'written',
    explanation:
      'poem 与 write 是被动关系，用过去分词 written 作后置定语，相当于 that was written。',
  },
  {
    id: 'u19-f3',
    type: 'fill',
    pointId: 'past-participle-complement',
    stem: 'Last week our class got the old photos in the school museum ______ (repair).',
    answer: 'repaired',
    explanation:
      'get sth done 表示“使某事被做”，photos 与 repair 是被动关系，填过去分词 repaired。',
  },
  {
    id: 'u19-f4',
    type: 'fill',
    pointId: 'past-participle-complement',
    stem: 'Keep the windows ______ (close) at night to keep the old paper-cuttings dry.',
    answer: 'closed',
    explanation:
      'keep + 宾语 + 过去分词表示“使保持某状态”，windows 与 close 是被动关系，填 closed。',
  },
];

const pointById = new Map(unit9GrammarPoints.map((p) => [p.id, p]));

export function getGrammarPoint(id: string): GrammarPoint | undefined {
  return pointById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit9GrammarPoints, exercises: unit9Exercises };
