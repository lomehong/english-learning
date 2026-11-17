import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修四 Unit 1（Science Fiction）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 1 词表），避免任何教材原文版权问题。
 */

export const unit11Passages: ReadingPassage[] = [
  {
    id: 'u31-p1',
    title: 'A Robot Called Robin',
    genre: '记叙文',
    paragraphs: [
      'When the Lin family bought their first household robot, they named it Robin. The machine had a soft voice, gentle metal hands, and a pace that never hurried. On its first morning, Robin cooked breakfast, watered the herbs on the balcony, and ironed every shirt in the house.',
      'At first, Mrs Lin suspected that a machine could not understand people. But one evening, when she felt tired and sad about her heavy workload, Robin brought her a cup of hot tea without being asked. \u201cMy programme says a tired host needs comfort,\u201d it explained in an elegant voice.',
      'Months later, the Lins no longer dismissed Robin as a pile of cold steel. The robot had become a family member, and its quiet dignity taught them that care does not always need a human heart.',
    ],
    glossary: [
      { wordId: 'household', forms: ['household'] },
      { wordId: 'pace', forms: ['pace'] },
      { wordId: 'elegant', forms: ['elegant'] },
      { wordId: 'dismiss', forms: ['dismissed'] },
      { wordId: 'pile', forms: ['pile'] },
      { wordId: 'dignity', forms: ['dignity'] },
    ],
    questions: [
      {
        id: 'u31-r1-1',
        type: 'detail',
        stem: 'What did Robin do on its first morning?',
        options: [
          'It cooked breakfast and ironed the shirts.',
          'It repaired the family car.',
          'It taught the children English.',
          'It went shopping in the town.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "Robin cooked breakfast, watered the herbs…and ironed every shirt" 可知它做早餐并熨衬衫，故选 A；其余选项文中均未提及。',
      },
      {
        id: 'u31-r1-2',
        type: 'detail',
        stem: 'Why did Robin bring Mrs Lin a cup of hot tea?',
        options: [
          'Because Mrs Lin ordered it to do so.',
          'Because its programme suggested comforting a tired host.',
          'Because it wanted a bigger salary.',
          'Because the family had guests that day.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段机器人所说 "My programme says a tired host needs comfort" 可知它主动安慰疲惫的主人，故选 B；A 与 without being asked 矛盾，C、D 无依据。',
      },
      {
        id: 'u31-r1-3',
        type: 'inference',
        stem: 'What can we infer about the Lins\u2019 attitude towards Robin in the end?',
        options: [
          'They regarded the robot as a member of the family.',
          'They planned to return the robot to the factory.',
          'They were afraid of its metal hands.',
          'They found it too slow to be useful.',
        ],
        answerIndex: 0,
        explanation:
          '由末段 "The robot had become a family member" 及全家人不再把它当作冰冷钢铁可知他们已把机器人视为家人，故选 A；B、C、D 均与文意相反或无据。',
      },
    ],
  },
  {
    id: 'u31-p2',
    title: 'Science Fiction or Science Fact?',
    genre: '应用文 · 科幻专栏',
    paragraphs: [
      'What do a flying car, a talking house and a doctor robot have in common? Fifty years ago they were pure fiction, found only in fantastic stories. Today, engineers are turning these wild dreams into grand products that we can already test.',
      'A famous company has just appointed a new team to design a household robot. The machine will be able to nail a loose board, repair a cushion and clean the carpet. The manager declares that the first model will be sold next year, though the price sounds absurd: almost a whole year\u2019s salary for most families.',
      'Still, history tells us not to laugh at fiction. Writers who imagined submarines, moon rockets and pocket computers were not mad; they simply arrived at the future earlier than the rest of us. Perhaps today\u2019s strangest story is tomorrow\u2019s timetable.',
    ],
    glossary: [
      { wordId: 'fiction', forms: ['fiction'] },
      { wordId: 'fantastic', forms: ['fantastic'] },
      { wordId: 'grand', forms: ['grand'] },
      { wordId: 'appoint', forms: ['appointed'] },
      { wordId: 'nail', forms: ['nail'] },
      { wordId: 'cushion', forms: ['cushion'] },
      { wordId: 'carpet', forms: ['carpet'] },
      { wordId: 'declare', forms: ['declares'] },
      { wordId: 'absurd', forms: ['absurd'] },
      { wordId: 'salary', forms: ['salary'] },
    ],
    questions: [
      {
        id: 'u31-r2-1',
        type: 'detail',
        stem: 'According to Paragraph 2, what will the new household robot be able to do?',
        options: [
          'Repair a cushion and clean the carpet.',
          'Cook dinner for a whole school.',
          'Drive a flying car to work.',
          'Teach doctors in a hospital.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "nail a loose board, repair a cushion and clean the carpet" 可知它能修理垫子、清洁地毯，故选 A；B、C、D 均未提及。',
      },
      {
        id: 'u31-r2-2',
        type: 'detail',
        stem: 'What does the manager declare about the first model?',
        options: [
          'It will never be sold to families.',
          'It will replace all doctors soon.',
          'It will be sold next year at a very high price.',
          'It will be given away for free.',
        ],
        answerIndex: 2,
        explanation:
          '由 "the first model will be sold next year, though the price sounds absurd" 可知新款明年上市且价格高得离谱，故选 C；A、D 与文意相反，B 无依据。',
      },
      {
        id: 'u31-r2-3',
        type: 'purpose',
        stem: 'Why does the author mention submarines and moon rockets in the last paragraph?',
        options: [
          'To prove that engineers earn high salaries.',
          'To show that ideas from fiction often become reality.',
          'To explain why rockets are difficult to build.',
          'To advise readers to write science fiction.',
        ],
        answerIndex: 1,
        explanation:
          '末段以潜艇、登月火箭和袖珍计算机为例，说明“昨日的科幻常成为今日的现实”，从而提醒读者不要嘲笑科幻，故选 B。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit11Passages;
