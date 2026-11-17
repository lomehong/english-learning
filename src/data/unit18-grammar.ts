import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修二 Unit 3（The Internet）语法点：现在完成时的被动语态 / 一般将来时的被动语态 */

export const unit8GrammarPoints: GrammarPoint[] = [
  {
    id: 'present-perfect-passive',
    title: '现在完成时的被动语态',
    tagline: '表示已经完成的动作对现在的影响或结果：has / have been + 过去分词。',
    forms: [
      { label: '肯定', detail: '主语 + has / have been + 过去分词（+ by …）' },
      { label: '否定', detail: '主语 + has / have not been + 过去分词' },
      { label: '疑问', detail: 'Has / Have + 主语 + been + 过去分词…?' },
    ],
    usages: [
      '表示动作已完成且对现在造成影响（The app has been updated.）',
      '与 already / yet / just / recently / since / for 连用，强调到现在为止的结果',
      '主语是动作的承受者，施动者不重要时常省略 by 短语',
    ],
    markers: ['already', 'yet', 'just', 'recently', 'so far', 'since then', 'for two years'],
    examples: [
      { en: 'The school website has already been updated with the new timetable.', zh: '校园网已经更新了新课程表。' },
      { en: 'Over one million apps have been downloaded from this store.', zh: '已有超过一百万个应用从这个商店被下载。' },
      { en: 'Has the problem been solved yet?', zh: '问题已经解决了吗？' },
    ],
    tips: [
      'been 不能遗漏：have been done 才是完成被动，have done 是主动完成',
      'since / for 引导的时间与现在完成时连用，不能改用一般过去时被动',
    ],
  },
  {
    id: 'simple-future-passive',
    title: '一般将来时的被动语态',
    tagline: '表示将要发生的被动动作：will / shall be + 过去分词。',
    forms: [
      { label: '肯定', detail: '主语 + will be + 过去分词（+ by …）' },
      { label: '否定', detail: '主语 + will not be + 过去分词' },
      { label: '疑问', detail: 'Will + 主语 + be + 过去分词…?' },
    ],
    usages: [
      '表示按计划或预料将要被进行的动作（A new function will be added.）',
      '表示对将来的预测或安排，主语是动作的承受者',
      'be going to be done 也可表将来被动，多用于计划好的事',
    ],
    markers: ['tomorrow', 'next week', 'soon', 'in the future', 'by 2030'],
    examples: [
      { en: 'A safer system will be built to protect users\u2019 privacy.', zh: '将建立更安全的系统来保护用户隐私。' },
      { en: 'The results will be posted on the school website next Friday.', zh: '结果将于下周五公布在学校网站上。' },
      { en: 'Will the old reading room be turned into a digital library?', zh: '旧阅览室将被改造成数字图书馆吗？' },
    ],
    tips: [
      'will 后接 be + 过去分词，不能漏掉 be（will built ✗）',
      'not 放在 will 之后：will not be done',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），语境取自 Unit 3 The Internet 主题 */
export const unit8Exercises: GrammarExercise[] = [
  {
    id: 'u18-g1',
    type: 'mcq',
    pointId: 'present-perfect-passive',
    stem: 'The new learning app ______ by more than five million students since last year.',
    options: ['has downloaded', 'has been downloaded', 'downloaded', 'is downloaded'],
    answerIndex: 1,
    explanation:
      '“since last year” 与现在完成时连用，app 与 download 是被动关系，用 has been downloaded。',
  },
  {
    id: 'u18-g2',
    type: 'mcq',
    pointId: 'present-perfect-passive',
    stem: '— Can I use the online library now? — Sorry, it ______ yet. Please wait a moment.',
    options: ['hasn\u2019t repaired', 'hasn\u2019t been repaired', 'isn\u2019t repaired', 'wasn\u2019t repaired'],
    answerIndex: 1,
    explanation:
      '“yet” 提示到现在为止的结果，it（library 系统）与 repair 是被动关系，用现在完成时被动的否定 hasn\u2019t been repaired。',
  },
  {
    id: 'u18-g3',
    type: 'mcq',
    pointId: 'simple-future-passive',
    stem: 'Don\u2019t worry about the exam results. They ______ on the school website tomorrow.',
    options: ['will post', 'are posted', 'will be posted', 'have been posted'],
    answerIndex: 2,
    explanation:
      '“tomorrow” 表将来，they（results）与 post 是被动关系，用一般将来时的被动 will be posted。',
  },
  {
    id: 'u18-g4',
    type: 'mcq',
    pointId: 'simple-future-passive',
    stem: 'A talk on Internet safety ______ in our school hall next Friday afternoon.',
    options: ['will be given', 'will give', 'has been given', 'is being given'],
    answerIndex: 0,
    explanation:
      '“next Friday afternoon” 表将来，talk 与 give 是被动关系（give a talk），用 will be given。',
  },
  {
    id: 'u18-g5',
    type: 'mcq',
    pointId: 'present-perfect-passive',
    stem: 'So far, thousands of old photos ______ and shared in the online museum.',
    options: ['scan', 'scanned', 'have been scanned', 'are scanned'],
    answerIndex: 2,
    explanation:
      '“So far” 是现在完成时的标志，photos 与 scan 是被动关系，主语复数，用 have been scanned。',
  },
  {
    id: 'u18-g6',
    type: 'mcq',
    pointId: 'simple-future-passive',
    stem: 'I hear the free Wi-Fi ______ to every village in the area by the end of next year.',
    options: ['will bring', 'will be brought', 'has been brought', 'is brought'],
    answerIndex: 1,
    explanation:
      '“by the end of next year” 表将来，Wi-Fi 与 bring 是被动关系，用 will be brought。',
  },
  {
    id: 'u18-f1',
    type: 'fill',
    pointId: 'present-perfect-passive',
    stem: 'Great changes ______ (take place) in my home town since the new network was built.',
    answer: 'have taken place',
    explanation:
      '“since + 过去时间” 与现在完成时连用；take place 是不及物动词短语，无被动形式，主动填 have taken place。',
  },
  {
    id: 'u18-f2',
    type: 'fill',
    pointId: 'present-perfect-passive',
    stem: 'The video about online safety already ______ (upload) to the class website.',
    answer: 'has been uploaded',
    explanation:
      'already 与现在完成时连用，video 与 upload 是被动关系，主语单数，填 has been uploaded（already 也可置于 has 与 been 之间）。',
  },
  {
    id: 'u18-f3',
    type: 'fill',
    pointId: 'simple-future-passive',
    stem: 'A new computer room ______ (build) in our school this summer.',
    answer: 'will be built',
    explanation:
      '“this summer” 表将来计划，room 与 build 是被动关系，用 will be built。',
  },
  {
    id: 'u18-f4',
    type: 'fill',
    pointId: 'simple-future-passive',
    stem: 'The passwords of all users ______ (change) next week for safety.',
    answer: 'will be changed',
    explanation:
      '“next week” 表将来，passwords 与 change 是被动关系，主语复数，但 will 不随主语变化，填 will be changed。',
  },
];

const pointById = new Map(unit8GrammarPoints.map((p) => [p.id, p]));

export function getGrammarPoint(id: string): GrammarPoint | undefined {
  return pointById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit8GrammarPoints, exercises: unit8Exercises };
