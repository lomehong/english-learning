import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修三 Unit 4（Space Exploration）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 9 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit9Listenings: ListeningMaterial[] = [
  {
    id: 'u24-l1',
    title: 'Announcement: A Talk on Space Exploration',
    genre: '独白',
    script: [
      'Attention, please. I have exciting news for you all.',
      'This Thursday afternoon, from four to five thirty, a scientist from the national space agency will give a talk in our school hall. The topic is space exploration and our daily life. He will explain how weather satellites help farmers, and how astronauts are trained before their first flight into orbit.',
      'After the talk, there will be a question time, and three model rockets made by our science club will be shown on the stage. If you want to attend, please sign up with your monitor before Wednesday noon. Remember: the first sixty students will get a free ticket to visit the science museum.',
    ],
    questions: [
      {
        id: 'u24-l1-1',
        type: 'detail',
        stem: 'Who will give the talk at school?',
        options: [
          'A scientist from the national space agency.',
          'An astronaut just back from orbit.',
          'A teacher of the science club.',
          'A guide from the science museum.',
        ],
        answerIndex: 0,
        explanation:
          '由 "a scientist from the national space agency will give a talk" 可知作报告的是航天局的科学家，故选 A。',
      },
      {
        id: 'u24-l1-2',
        type: 'detail',
        stem: 'What will be shown on the stage after the talk?',
        options: [
          'A new weather satellite.',
          'Three model rockets made by the science club.',
          'Photos of the universe taken in orbit.',
          'The astronauts\u2019 training suits.',
        ],
        answerIndex: 1,
        explanation:
          '由 "three model rockets made by our science club will be shown on the stage" 可知报告后将展示科技社制作的三枚火箭模型，故选 B。',
      },
      {
        id: 'u24-l1-3',
        type: 'inference',
        stem: 'What can we infer from the announcement?',
        options: [
          'The talk will be held on Wednesday noon.',
          'Only science club members can attend the talk.',
          'Early sign-up may bring a free museum ticket.',
          'The scientist will launch a rocket at school.',
        ],
        answerIndex: 2,
        explanation:
          '由 "the first sixty students will get a free ticket" 可推知尽早报名有机会获得免费参观票，故选 C。',
      },
    ],
  },
  {
    id: 'u24-l2',
    title: 'An Interview with a Young Rocket Fan',
    genre: '对话',
    script: [
      'M: Good evening, listeners. Today we have Li Nan, a high school student whose model rocket won the first prize in the city science competition. Li Nan, how did you start this hobby?',
      'W: When I was eight, I watched a live broadcast of a spacecraft launch. From that day on, my ambition was to work on real rockets one day.',
      'M: Was it difficult to build the model?',
      'W: Yes. I failed many times, but I told myself to endure the failures and keep going. My teacher also taught me to follow every step of the procedure carefully.',
      'M: What is your plan for the future?',
      'W: I will study hard, especially physics and maths, and keep training my body and mind. I hope to join the space agency after college and dedicate myself to the ongoing programme of exploring the universe.',
    ],
    questions: [
      {
        id: 'u24-l2-1',
        type: 'detail',
        stem: 'What made Li Nan fall in love with rockets?',
        options: [
          'A live broadcast of a spacecraft launch at the age of eight.',
          'A prize she won in a competition.',
          'A book about the universe from her teacher.',
          'A visit to the national space agency.',
        ],
        answerIndex: 0,
        explanation:
          '由 "When I was eight, I watched a live broadcast of a spacecraft launch" 可知八岁观看航天器发射直播让她爱上火箭，故选 A。',
      },
      {
        id: 'u24-l2-2',
        type: 'detail',
        stem: 'What did Li Nan learn from her failures?',
        options: [
          'To give up the hobby and try something new.',
          'To endure failures and follow procedures carefully.',
          'To ask others to build models for her.',
          'To enter an easier competition.',
        ],
        answerIndex: 1,
        explanation:
          '由 "I told myself to endure the failures and keep going. My teacher also taught me to follow every step of the procedure carefully" 可知她学会承受失败并严格按步骤操作，故选 B。',
      },
      {
        id: 'u24-l2-3',
        type: 'inference',
        stem: 'What is Li Nan\u2019s dream for the future?',
        options: [
          'To become a famous TV host.',
          'To teach maths in a primary school.',
          'To work at the space agency and explore the universe.',
          'To sell model rockets to schools.',
        ],
        answerIndex: 2,
        explanation:
          '由结尾 "I hope to join the space agency after college and dedicate myself to the ongoing programme of exploring the universe" 可推知她的理想是进入航天局投身宇宙探索，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9Listenings;
