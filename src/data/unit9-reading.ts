import type { ReadingPassage } from '../types';

/**
 * 人教2019必修二 Unit 4（History and Traditions）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用本单元词表），避免任何教材原文版权问题。
 */

export const unit9Passages: ReadingPassage[] = [
  {
    id: 'u9-p1',
    title: 'Following the Old Road',
    genre: '记叙文',
    paragraphs: [
      'Our village lies at the foot of the mountains, on an old trade road that once connected two ancient kingdoms. Last Qingming, my father took me to sweep the tombs of our ancestors on the hill.',
      'After the ceremony, we walked along the stone road. Father told me that our family had lived here for nine generations. Every generation kept the same tradition: greeting the passers-by with tea, and sharing a feast with the whole village at harvest time.',
      '\u201cA custom is not an old box,\u201d he said. \u201cIt is the footstep of the people before us. When you follow it, you are walking with them.\u201d I looked at the landscape around me and felt the history in my heart.',
    ],
    glossary: [
      { wordId: 'kingdom', forms: ['kingdoms'] },
      { wordId: 'ancestor', forms: ['ancestors'] },
      { wordId: 'generation', forms: ['generations'] },
      { wordId: 'tradition', forms: ['tradition'] },
      { wordId: 'greet', forms: ['greeting'] },
      { wordId: 'feast', forms: ['feast'] },
      { wordId: 'custom', forms: ['custom'] },
      { wordId: 'footstep', forms: ['footstep'] },
      { wordId: 'landscape', forms: ['landscape'] },
    ],
    questions: [
      {
        id: 'u9-r1-1',
        type: 'detail',
        stem: 'Why did the writer and his father go to the hill at Qingming?',
        options: [
          'To enjoy the landscape of the mountains.',
          'To sweep the tombs of their ancestors.',
          'To look for the old trade road.',
          'To attend a feast in the village.',
        ],
        answerIndex: 1,
        explanation:
          '由第一段 "my father took me to sweep the tombs of our ancestors on the hill" 可知，父子俩清明上山是为了祭扫祖坟，故选 B；A、C 只是顺带的场景，D 是丰收时的传统活动。',
      },
      {
        id: 'u9-r1-2',
        type: 'detail',
        stem: 'What tradition does every generation of the family keep?',
        options: [
          'Travelling along the old trade road every year.',
          'Building new stone roads for the village.',
          'Greeting passers-by with tea and sharing a harvest feast.',
          'Writing poems about the mountains.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "Every generation kept the same tradition: greeting the passers-by with tea, and sharing a feast with the whole village at harvest time" 可知，家族的传统是敬茶迎客、共享丰收宴，故选 C；A、B、D 均与原文不符。',
      },
      {
        id: 'u9-r1-3',
        type: 'inference',
        stem: 'What did the father mean by \u201cIt is the footstep of the people before us\u201d?',
        options: [
          'Customs are heavy boxes that are hard to carry.',
          'Old roads are too dangerous for young people.',
          'Traditions should be locked in museums forever.',
          'Following traditions connects us with the people of the past.',
        ],
        answerIndex: 3,
        explanation:
          '父亲把习俗比作前人的"足迹"，并说 "When you follow it, you are walking with them"（遵循传统就是与前人同行），可推知其含义是传统让我们与先人相连，故选 D；A 曲解喻体，B、C 与父亲的观点相反。',
      },
    ],
  },
  {
    id: 'u9-p2',
    title: 'Welcome to Riverside Old Town',
    genre: '应用文',
    paragraphs: [
      'Riverside Old Town welcomes you! Built in the position where two rivers meet, the town looks like a painting of the old kingdom it once served.',
      'Start your visit at the stone castle on the north hill. It was once a military base, and a famous battle was fought on the plain below six hundred years ago. In the town museum, you can read poems written by a poet who was born here, and learn about the philosopher whose ideas shaped local life for centuries.',
      'Do not miss the evening feast in the market square. Curious visitors are always greeted with warm tea, and generous local families will invite you to taste their dishes. Each individual dish tells a story of the town.',
      'Opening hours: 9:00-18:00, Tuesday to Sunday.',
    ],
    glossary: [
      { wordId: 'position', forms: ['position'] },
      { wordId: 'kingdom', forms: ['kingdom'] },
      { wordId: 'castle', forms: ['castle'] },
      { wordId: 'military', forms: ['military'] },
      { wordId: 'battle', forms: ['battle'] },
      { wordId: 'poet', forms: ['poet'] },
      { wordId: 'philosopher', forms: ['philosopher'] },
      { wordId: 'feast', forms: ['feast'] },
      { wordId: 'curious', forms: ['Curious'] },
      { wordId: 'greet', forms: ['greeted'] },
      { wordId: 'generous', forms: ['generous'] },
      { wordId: 'individual', forms: ['individual'] },
    ],
    questions: [
      {
        id: 'u9-r2-1',
        type: 'detail',
        stem: 'What was the stone castle on the north hill once used as?',
        options: [
          'A home for the royal family.',
          'A museum of old poems.',
          'A military base.',
          'A school for philosophers.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "It was once a military base" 可知，北山石堡曾是一处军事基地，故选 C；A、B、D 均与原文不符。',
      },
      {
        id: 'u9-r2-2',
        type: 'detail',
        stem: 'What can visitors enjoy in the market square in the evening?',
        options: [
          'A battle performance on the plain.',
          'A feast with warm tea and local dishes.',
          'A poetry reading by a famous poet.',
          'A boat trip along the two rivers.',
        ],
        answerIndex: 1,
        explanation:
          '由第三段 "Do not miss the evening feast in the market square. Curious visitors are always greeted with warm tea, and generous local families will invite you to taste their dishes" 可知，晚间可在集市广场享用盛宴、品茶尝菜，故选 B；A、C、D 原文未提及。',
      },
      {
        id: 'u9-r2-3',
        type: 'purpose',
        stem: 'Why is this passage written?',
        options: [
          'To introduce Riverside Old Town and attract visitors.',
          'To describe a famous battle in history.',
          'To sell old houses in the town.',
          'To compare rivers in different towns.',
        ],
        answerIndex: 0,
        explanation:
          '本文是旅游推介：开头 "Riverside Old Town welcomes you!" 发出欢迎，正文依次介绍城堡、博物馆与晚间集市，并附开放时间，写作目的是介绍古镇、吸引游客，故选 A；B 只是其中一个细节，C、D 无关。',
      },
    ],
  },
];

const passageById = new Map(unit9Passages.map((p) => [p.id, p]));

export function getPassage(id: string): ReadingPassage | undefined {
  return passageById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9Passages;
