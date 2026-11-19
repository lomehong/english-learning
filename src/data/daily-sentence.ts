/** 每日一句：高考英语写作佳句（真实名言，中英对照 + 作者） */
export interface DailySentence {
  /** 英文原句 */
  en: string;
  /** 中文译文 */
  zh: string;
  /** 作者 */
  author: string;
}

export const dailySentences: DailySentence[] = [
  {
    en: 'Genius is one percent inspiration and ninety-nine percent perspiration.',
    zh: '天才是百分之一的灵感加上百分之九十九的汗水。',
    author: 'Thomas Edison（托马斯·爱迪生）',
  },
  {
    en: 'Knowledge is power.',
    zh: '知识就是力量。',
    author: 'Francis Bacon（弗朗西斯·培根）',
  },
  {
    en: 'The only way to do great work is to love what you do.',
    zh: '成就伟大事业的唯一途径，就是热爱你自己所做的事。',
    author: 'Steve Jobs（史蒂夫·乔布斯）',
  },
  {
    en: "That's one small step for man, one giant leap for mankind.",
    zh: '这是个人的一小步，却是人类的一大步。',
    author: 'Neil Armstrong（尼尔·阿姆斯特朗）',
  },
  {
    en: 'A journey of a thousand miles begins with a single step.',
    zh: '千里之行，始于足下。',
    author: 'Lao Tzu（老子）',
  },
];
