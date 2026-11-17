import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修二 Unit 2（Bridging Cultures）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 2 词表），避免任何教材原文版权问题。
 */

export const unit12Passages: ReadingPassage[] = [
  {
    id: 'u12-p1',
    title: 'A Term Abroad',
    genre: '记叙文',
    paragraphs: [
      'When Chen Yang first arrived in London as an exchange student, everything seemed new and strange. The food, the accent and the classroom manners were different from home. For the first few weeks, he felt homesick and afraid of making mistakes in English.',
      'His tutor, Mrs Smith, noticed his silence and encouraged him to participate in class discussions. Gradually he adapted to the new environment. He gave a presentation about Chinese festivals, and his classmates listened with interest. Their questions helped him see his own culture from a new perspective.',
      'By the end of the term, his English had improved a lot, and his ambition had grown as well. He had learnt that living abroad is not about leaving home behind, but about building a bridge between two cultures. The experience widened his horizon more than any textbook could.',
    ],
    glossary: [
      { wordId: 'homesick', forms: ['homesick'] },
      { wordId: 'tutor', forms: ['tutor'] },
      { wordId: 'participate', forms: ['participate'] },
      { wordId: 'presentation', forms: ['presentation'] },
      { wordId: 'perspective', forms: ['perspective'] },
      { wordId: 'abroad', forms: ['abroad'] },
      { wordId: 'horizon', forms: ['horizon'] },
    ],
    questions: [
      {
        id: 'u12-r1-1',
        type: 'detail',
        stem: 'How did Chen Yang feel during his first few weeks in London?',
        options: [
          'Homesick and afraid of making mistakes.',
          'Bored with his lessons.',
          'Proud of his English.',
          'Angry with his classmates.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "he felt homesick and afraid of making mistakes in English" 可知他最初想家又怕出错，故选 A；其余选项与文中描述相反或无依据。',
      },
      {
        id: 'u12-r1-2',
        type: 'detail',
        stem: 'What did Chen Yang give a presentation about?',
        options: [
          'Chinese festivals.',
          'British history.',
          'His host family.',
          'The English accent.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "He gave a presentation about Chinese festivals" 可知他展示的主题是中国节日，故选 A。',
      },
      {
        id: 'u12-r1-3',
        type: 'inference',
        stem: 'What can we infer about the classmates\u2019 questions in Paragraph 2?',
        options: [
          'They helped him understand his own culture better.',
          'They made him feel more homesick.',
          'They showed little interest in his talk.',
          'They were mostly about grammar rules.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "Their questions helped him see his own culture from a new perspective" 可推知同学的提问帮助他从新视角审视本国文化，故选 A。',
      },
    ],
  },
  {
    id: 'u12-p2',
    title: 'Volunteers Wanted for the Culture Festival',
    genre: '应用文 · 招募启事',
    paragraphs: [
      'An International Culture Festival will be held at our school next month, and the student union is now looking for volunteers. The event aims to strengthen understanding between overseas and local students from different backgrounds and to celebrate the variety of world cultures.',
      'Volunteers will help foreign guests settle in, translate menus and signs, and introduce traditional rituals such as the tea ceremony. Students who can speak a second language and explain idioms clearly are welcome. Training will be given before the festival, so do not worry if you lack experience.',
      'This is a wonderful chance to embrace differences and make friends from all over the world. Interested students should sign up at the office of the student union before 5 p.m. next Friday. For more information, please email union@school.edu.cn or call 8899.',
    ],
    glossary: [
      { wordId: 'strengthen', forms: ['strengthen'] },
      { wordId: 'overseas', forms: ['overseas'] },
      { wordId: 'variety', forms: ['variety'] },
      { wordId: 'ritual', forms: ['rituals'] },
      { wordId: 'idiom', forms: ['idioms'] },
      { wordId: 'embrace', forms: ['embrace'] },
    ],
    questions: [
      {
        id: 'u12-r2-1',
        type: 'detail',
        stem: 'What will volunteers do during the festival?',
        options: [
          'Help foreign guests and introduce traditional ceremonies.',
          'Cook food for all the students.',
          'Judge the singing competition.',
          'Design the school website.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "Volunteers will help foreign guests settle in, translate menus and signs, and introduce traditional ceremonies" 可知志愿者的工作包括接待外宾与介绍传统仪式，故选 A。',
      },
      {
        id: 'u12-r2-2',
        type: 'detail',
        stem: 'When and where should interested students sign up?',
        options: [
          'At the student union office before 5 p.m. next Friday.',
          'At the school gate next Monday morning.',
          'By email any time before the festival.',
          'In the meeting hall after the opening ceremony.',
        ],
        answerIndex: 0,
        explanation:
          '由第三段 "sign up at the office of the student union before 5 p.m. next Friday" 可知报名地点是学生会办公室、截止时间为下周五下午五点前，故选 A。',
      },
      {
        id: 'u12-r2-3',
        type: 'purpose',
        stem: 'What is the purpose of this notice?',
        options: [
          'To invite student volunteers to join the International Culture Festival.',
          'To describe the history of the tea ceremony.',
          'To report the results of last year\u2019s festival.',
          'To teach students how to speak a second language.',
        ],
        answerIndex: 0,
        explanation:
          '全文围绕招募文化节志愿者展开（招募对象、工作内容、报名方式），可概括其写作意图为邀请学生报名参加，故选 A；B、C、D 均非本文主旨。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit12Passages;
