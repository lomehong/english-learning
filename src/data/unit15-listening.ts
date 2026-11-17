import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修四 Unit 5（Launching Your Career）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 5 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit15Listenings: ListeningMaterial[] = [
  {
    id: 'u15-l1',
    title: 'Career Day Notice',
    genre: '独白',
    script: [
      'Attention, please. Next Friday afternoon, our school will hold its annual Career Day in the gym.',
      'Twelve participants from different professions have been invited, including a nurse, an engineer, and a young entrepreneur.',
      'Each of them will give a twenty-minute talk about their daily work and the qualifications their jobs need.',
      'After the talks, students may ask questions or sign up for a one-day internship during the holiday.',
      'Everyone is welcome. Please prepare at least one question before you come. Thank you.',
    ],
    questions: [
      {
        id: 'u15-l1-1',
        type: 'detail',
        stem: 'Where will Career Day be held?',
        options: ['In the school gym.', 'In the city library.', 'On the playground.', 'In the science lab.'],
        answerIndex: 0,
        explanation:
          '由 "hold its annual Career Day in the gym" 可知职业日在学校体育馆举行，故选 A。',
      },
      {
        id: 'u15-l1-2',
        type: 'detail',
        stem: 'What will each participant do at the event?',
        options: [
          'Give a twenty-minute talk about their work.',
          'Interview the students one by one.',
          'Show a film about their company.',
          'Hand out gifts to the visitors.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Each of them will give a twenty-minute talk about their daily work" 可知每位参与者将做二十分钟演讲，故选 A。',
      },
      {
        id: 'u15-l1-3',
        type: 'detail',
        stem: 'What can students do after the talks?',
        options: [
          'Ask questions or sign up for an internship.',
          'Leave school early for the holiday.',
          'Borrow books from the guests.',
          'Watch a play with the speakers.',
        ],
        answerIndex: 0,
        explanation:
          '由 "students may ask questions or sign up for a one-day internship" 可知演讲后学生可提问或报名参加一日实习，故选 A。',
      },
    ],
  },
  {
    id: 'u15-l2',
    title: 'Talking about Dream Jobs',
    genre: '对话',
    script: [
      'W: Peter, have you thought about your future profession?',
      'M: Yes, Lucy. I want to be a doctor, and I plan to take a career aptitude test first.',
      'W: Good idea. The test may help you deduce whether medicine truly fits you.',
      'M: Exactly. What about you?',
      'W: I hope to become a journalist. My aunt works for a magazine, and reading her biography of famous reporters inspired me.',
      'M: Then why not participate in the school radio station? It offers an internship every summer.',
      'W: Sounds great. I will apply for it this term.',
    ],
    questions: [
      {
        id: 'u15-l2-1',
        type: 'detail',
        stem: 'What does Peter want to be in the future?',
        options: ['A doctor.', 'A journalist.', 'A teacher.', 'A driver.'],
        answerIndex: 0,
        explanation:
          '由 "I want to be a doctor" 可知 Peter 想当医生，故选 A；记者是 Lucy 的理想。',
      },
      {
        id: 'u15-l2-2',
        type: 'detail',
        stem: 'What inspired Lucy\u2019s career dream?',
        options: [
          'Reading a biography of famous reporters.',
          'Watching the news with her parents.',
          'A talk at the Career Day.',
          'A report in the school magazine.',
        ],
        answerIndex: 0,
        explanation:
          '由 "reading her biography of famous reporters inspired me" 可知阅读著名记者的传记启发了她，故选 A。',
      },
      {
        id: 'u15-l2-3',
        type: 'inference',
        stem: 'What will Lucy probably do this term?',
        options: [
          'Apply for the radio station internship.',
          'Take the aptitude test with Peter.',
          'Write a biography of her aunt.',
          'Study medicine at university.',
        ],
        answerIndex: 0,
        explanation:
          '对话结尾 Lucy 说 "I will apply for it this term"，指的是申请电台的暑期实习，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit15Listenings;
