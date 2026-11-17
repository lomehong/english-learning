import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修四 Unit 5（Launching Your Career）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 5 词表），避免任何教材原文版权问题。
 */

export const unit15Passages: ReadingPassage[] = [
  {
    id: 'u15-p1',
    title: 'Find the Work That Fits You',
    genre: '应用文 · 校刊专栏',
    paragraphs: [
      'Choosing a profession is one of the biggest decisions in life, yet many students know little about the world of work. A recent survey of two thousand participants suggests that interest, more than pay, keeps people in a job for long.',
      'Experts advise three steps. First, take an aptitude test to deduce your strengths, such as numbers, language, or hands-on skills. Second, read a biography of someone in the field you like, and note what the daily work truly includes. Third, participate in a short internship, because a week of real practice teaches more than a year of guessing.',
      'Employers add that a good candidate is proficient in at least one skill and honest about what he or she cannot yet do. Motivation grows when the work fits the person; that is the prospect worth seeking.',
    ],
    glossary: [
      { wordId: 'profession', forms: ['profession'] },
      { wordId: 'participant', forms: ['participants'] },
      { wordId: 'aptitude', forms: ['aptitude'] },
      { wordId: 'deduce', forms: ['deduce'] },
      { wordId: 'biography', forms: ['biography'] },
      { wordId: 'participate', forms: ['participate'] },
      { wordId: 'internship', forms: ['internship'] },
      { wordId: 'employer', forms: ['Employers'] },
      { wordId: 'candidate', forms: ['candidate'] },
      { wordId: 'proficient', forms: ['proficient'] },
      { wordId: 'motivation', forms: ['Motivation'] },
      { wordId: 'prospect', forms: ['prospect'] },
    ],
    questions: [
      {
        id: 'u15-r1-1',
        type: 'detail',
        stem: 'According to the survey, what keeps people in a job for long?',
        options: [
          'Interest, more than pay.',
          'A short working day.',
          'The size of the office.',
          'The advice of their parents.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "interest, more than pay, keeps people in a job for long" 可知是兴趣而非报酬让人长期留在岗位上，故选 A。',
      },
      {
        id: 'u15-r1-2',
        type: 'detail',
        stem: 'Which of the following is one of the three steps advised by experts?',
        options: [
          'Reading a biography of someone in the field you like.',
          'Asking parents to choose the job for you.',
          'Refusing every internship that pays little.',
          'Changing your field every half year.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "Second, read a biography of someone in the field you like" 可知读行业人物传记是建议之一，故选 A；其余选项均与建议相悖。',
      },
      {
        id: 'u15-r1-3',
        type: 'inference',
        stem: 'What can we infer from the last paragraph?',
        options: [
          'Honesty about one\u2019s weaknesses is valued by employers.',
          'Employers only care about school marks.',
          'Being proficient in one skill is impossible.',
          'Motivation comes mainly from high pay.',
        ],
        answerIndex: 0,
        explanation:
          '由末段 "a good candidate is proficient in at least one skill and honest about what he or she cannot yet do" 可推知雇主也看重对自己不足的诚实，故选 A。',
      },
    ],
  },
  {
    id: 'u15-p2',
    title: 'The Young Entrepreneur of Elm Street',
    genre: '记叙文',
    paragraphs: [
      'At nineteen, Lin Tao became the youngest entrepreneur in our city. His company helps small shops sell fresh food online, and forty employees now work in its office. Yet his first category of business failed completely: a homework app that nobody wanted to pay for.',
      'After that failure, he did not hide at home. He visited thirty shops with a notebook, asked the owners about their troubles, and his reports read like clear prose rather than numbers. A shop owner was so moved that she offered him a free desk, and his second company grew from that corner.',
      'When asked about qualification, Lin Tao laughs. \u201cA degree qualifies you to start,\u201d he says, \u201cbut only honest work recruits customers.\u201d His story is now taught in the local career class, and every new recruit hears it on the first day.',
    ],
    glossary: [
      { wordId: 'entrepreneur', forms: ['entrepreneur'] },
      { wordId: 'employee', forms: ['employees'] },
      { wordId: 'category', forms: ['category'] },
      { wordId: 'prose', forms: ['prose'] },
      { wordId: 'qualification', forms: ['qualification'] },
      { wordId: 'qualify', forms: ['qualifies'] },
      { wordId: 'recruit', forms: ['recruits', 'recruit'] },
    ],
    questions: [
      {
        id: 'u15-r2-1',
        type: 'detail',
        stem: 'What does Lin Tao\u2019s company do now?',
        options: [
          'It helps small shops sell fresh food online.',
          'It builds homework apps for students.',
          'It repairs desks for shop owners.',
          'It teaches career classes at school.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "His company helps small shops sell fresh food online" 可知公司帮小店在线卖生鲜，故选 A；B 是他第一次失败的尝试，C、D 与原文不符。',
      },
      {
        id: 'u15-r2-2',
        type: 'detail',
        stem: 'Why did a shop owner offer Lin Tao a free desk?',
        options: [
          'She was moved by his careful visits and reports.',
          'She wanted him to repair her shop.',
          'She needed money for the desk.',
          'She was his aunt from another city.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "A shop owner was so moved that she offered him a free desk" 可知店主被他挨家走访与用心报告打动，故选 A；B、C、D 均无依据。',
      },
      {
        id: 'u15-r2-3',
        type: 'main-idea',
        stem: 'What is the best title or main idea for the passage?',
        options: [
          'Honest, patient work turned a failure into success.',
          'Homework apps are bad for students.',
          'Shop owners dislike young businessmen.',
          'A university degree is useless to everyone.',
        ],
        answerIndex: 0,
        explanation:
          '全文讲林涛创业失败后走访调研、赢得信任并东山再起的经历，末段点明“诚实的努力才能赢得顾客”，可概括为“踏实诚实让失败走向成功”，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit15Passages;
