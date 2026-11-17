import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修一 Unit 4（Body Language）语法点：动词-ing形式作定语、表语与宾语补足语 */

export const unit9GrammarPoints: GrammarPoint[] = [
  {
    id: 'ing-as-attributive',
    title: '动词-ing形式作定语',
    tagline: '单个-ing形式放在名词前，-ing短语放在名词后，表示名词的性质或正在进行的动作。',
    forms: [
      { label: '前置定语', detail: '-ing + 名词：a welcoming smile / the sleeping baby（说明性质或状态）' },
      { label: '后置定语', detail: '名词 + -ing短语：the man standing at the door（= who is standing…）' },
      { label: '进行含义', detail: 'The students discussing the poster are from Class 3.（正在讨论的学生）' },
      { label: '用途含义', detail: 'a walking stick（用来走路的拐杖）/ sleeping pills（安眠药）' },
    ],
    usages: [
      '-ing形式作定语表示被修饰名词主动发出的或正在进行的动作：the rising sun',
      '表示用途或功能时用-ing：drinking water（饮用水）、a training centre',
      '-ing短语作后置定语相当于一个进行时态的定语从句：the girl wearing a red hat = the girl who is wearing a red hat',
      '及物动词的-ing形式表示主动，-ed形式表示被动与完成：an exciting story / an excited audience',
    ],
    markers: ['the …ing + 名词', '名词 + …ing短语', 'a waiting room', 'the people standing …'],
    examples: [
      { en: 'Do you know the young man standing at the school gate?', zh: '你认识站在校门口的那个年轻人吗？' },
      { en: 'She welcomed us with a warm and inviting smile.', zh: '她带着热情而动人的微笑欢迎我们。' },
      { en: 'The children watching the gesture game could not stop laughing.', zh: '看着手势游戏的孩子们笑个不停。' },
    ],
    tips: [
      '-ing作定语表示主动或进行，-ed作定语表示被动或完成，注意区分',
      '单个-ing一般前置，-ing短语必须后置，不能说 the standing at the door man',
      '表示用途的-ing定语重音落在名词上：a \u2019sleeping car（卧铺车厢）',
    ],
  },
  {
    id: 'ing-as-predicative-complement',
    title: '动词-ing形式作表语和宾语补足语',
    tagline: '-ing作表语说明主语“令人……”；see / watch / hear 等后接-ing作宾补表示动作正在进行。',
    forms: [
      { label: '作表语（令人……）', detail: '主语 + be + -ing：The gesture game was amusing. / The news is exciting.' },
      { label: '宾补（正在进行）', detail: 'see / watch / hear / notice + sb. + doing：I saw him folding his arms.' },
      { label: '对比宾补（全过程）', detail: 'see / hear + sb. + do 表示看到/听到动作的全过程' },
      { label: 'keep / leave + 宾语 + -ing', detail: 'The joke kept everyone laughing for minutes.' },
    ],
    usages: [
      '-ing作表语多表示“令人……的”，常修饰事物的性质：The speech was inspiring.',
      '表示“某人感到……”用-ed形式：The audience was amazed（不用 amazing 描述人的感受）',
      '感官动词后接-ing宾补强调动作正在进行，接动词原形强调经历了动作的全过程',
      'keep、have、leave 等使役动词后接-ing作宾补，表示使某动作持续发生',
    ],
    markers: ['be + amusing / exciting / inspiring', 'see sb. doing', 'keep sb. doing', 'hear sb. doing'],
    examples: [
      { en: 'The lecture on gestures was really inspiring.', zh: '关于手势的讲座真令人深受启发。' },
      { en: 'When I passed the office, I heard the manager arguing on the phone.', zh: '经过办公室时，我听见经理在电话里争论。' },
      { en: 'His humorous words kept all the students laughing.', zh: '他幽默的话语让所有学生笑个不停。' },
    ],
    tips: [
      '描述事物性质用-ing（surprising news），描述人的感受用-ed（surprised look）',
      'hear sb. doing 强调“正在做”，hear sb. do 强调“听到整个过程”，注意语境',
      '宾补的-ing形式与宾语之间是主动关系；被动关系要用-ed：I heard my name called.',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 4 Body Language */
export const unit9Exercises: GrammarExercise[] = [
  {
    id: 'u9-g1',
    type: 'mcq',
    pointId: 'ing-as-attributive',
    stem: 'Do you know the girl ______ at the school gate with a warm smile?',
    options: ['standing', 'stands', 'stood', 'to stand'],
    answerIndex: 0,
    explanation:
      '-ing短语作后置定语，表示正在站着的女孩，相当于 who is standing，故选 A；谓语形式不能作定语。',
  },
  {
    id: 'u9-g2',
    type: 'mcq',
    pointId: 'ing-as-attributive',
    stem: 'The speaker gave a ______ smile and began his talk on body language.',
    options: ['welcoming', 'welcomed', 'welcomes', 'to welcome'],
    answerIndex: 0,
    explanation:
      '单个-ing形式作前置定语说明 smile 的性质（令人感到亲切的），故选 A；welcomed 表被动或完成，不符合语境。',
  },
  {
    id: 'u9-g3',
    type: 'mcq',
    pointId: 'ing-as-predicative-complement',
    stem: 'The gesture game at the party was so ______ that nobody wanted to stop.',
    options: ['amusing', 'amused', 'amuse', 'to amuse'],
    answerIndex: 0,
    explanation:
      '-ing 作表语表示事物“令人发笑的”性质，主语 the gesture game 是事物，故选 A；amused 表示“人感到好笑的”。',
  },
  {
    id: 'u9-g4',
    type: 'mcq',
    pointId: 'ing-as-predicative-complement',
    stem: 'When the teacher came in, she noticed several students ______ their arms, looking bored.',
    options: ['folding', 'folded', 'to fold', 'fold'],
    answerIndex: 0,
    explanation:
      'notice 后接-ing作宾补，强调“正在抱着双臂”这一进行中的动作，故选 A；folded 表被动，to fold 与 fold 不强调进行。',
  },
  {
    id: 'u9-g5',
    type: 'mcq',
    pointId: 'ing-as-attributive',
    stem: 'The people ______ in the corner of the hall are interpreters from different countries.',
    options: ['sitting', 'sat', 'sit', 'to sit'],
    answerIndex: 0,
    explanation:
      '-ing短语作后置定语修饰 the people，表示“正坐在角落里的人”，故选 A；其余形式不能充当后置定语。',
  },
  {
    id: 'u9-g6',
    type: 'mcq',
    pointId: 'ing-as-predicative-complement',
    stem: 'Listen! Can you hear the children ______ in the classroom next door?',
    options: ['singing', 'sang', 'to sing', 'sung'],
    answerIndex: 0,
    explanation:
      'Listen! 提示动作正在进行，hear 后接-ing作宾补表示“正在唱歌”，故选 A；不定式与过去分词都不能表示进行。',
  },
  {
    id: 'u9-f1',
    type: 'fill',
    pointId: 'ing-as-attributive',
    stem: 'The woman ______ (wave) her hand in the crowd is my English teacher.（用所给词的适当形式填空）',
    answer: 'waving',
    explanation:
      '-ing短语作后置定语，表示正在挥手的女士，相当于 who is waving，填 waving。',
  },
  {
    id: 'u9-f2',
    type: 'fill',
    pointId: 'ing-as-attributive',
    stem: 'The manager gave an ______ (encourage) nod when I finished my report.（用所给词的适当形式填空）',
    answer: 'encouraging',
    explanation:
      '-ing 形式作定语说明 nod“令人鼓舞的”性质，事物性质用-ing，填 encouraging。',
  },
  {
    id: 'u9-f3',
    type: 'fill',
    pointId: 'ing-as-predicative-complement',
    stem: 'The guide\u2019s funny stories kept all the visitors ______ (laugh) during the trip.（用所给词的适当形式填空）',
    answer: 'laughing',
    explanation:
      'keep 后接-ing作宾语补足语，表示让笑声持续不断，填 laughing。',
  },
  {
    id: 'u9-f4',
    type: 'fill',
    pointId: 'ing-as-predicative-complement',
    stem: 'When I walked past the meeting room, I heard two managers ______ (discuss) the new plan loudly.（用所给词的适当形式填空）',
    answer: 'discussing',
    explanation:
      'hear 后接-ing作宾语补足语，强调“正在讨论”这一进行的动作，填 discussing。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit9GrammarPoints, exercises: unit9Exercises };
