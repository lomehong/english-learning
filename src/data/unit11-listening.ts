import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修四 Unit 1（Science Fiction）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 1 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit11Listenings: ListeningMaterial[] = [
  {
    id: 'u11-l1',
    title: 'Science Fiction Week',
    genre: '独白',
    script: [
      'Good morning, everyone. Our school will hold Science Fiction Week from Monday to Friday next month.',
      'During the week, a science teacher will give a talk about robots in famous fiction stories.',
      'Each class will also design a household robot of the future, draw it on a poster, and describe its functions in English.',
      'The best three posters will be shown in the school hall, and every winner will receive a bonus book card.',
      'Please sign up with your monitor before this Friday. Thank you.',
    ],
    questions: [
      {
        id: 'u11-l1-1',
        type: 'detail',
        stem: 'What will the science teacher do during Science Fiction Week?',
        options: [
          'Give a talk about robots in fiction stories.',
          'Show a film about the stars.',
          'Teach students how to draw posters.',
          'Sell science books in the hall.',
        ],
        answerIndex: 0,
        explanation:
          '由 "a science teacher will give a talk about robots in famous fiction stories" 可知老师将做一场关于科幻作品中机器人的讲座，故选 A。',
      },
      {
        id: 'u11-l1-2',
        type: 'detail',
        stem: 'What will each class design for the poster?',
        options: [
          'A household robot of the future.',
          'A map of the school hall.',
          'A picture of their monitor.',
          'A plan for a class trip.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Each class will also design a household robot of the future, draw it on a poster" 可知各班要设计未来的家用机器人，故选 A。',
      },
      {
        id: 'u11-l1-3',
        type: 'detail',
        stem: 'What will the winners receive?',
        options: ['A book card.', 'A robot toy.', 'A cinema ticket.', 'A school medal.'],
        answerIndex: 0,
        explanation:
          '由 "every winner will receive a bonus book card" 可知获胜者将获得书卡，故选 A。',
      },
    ],
  },
  {
    id: 'u11-l2',
    title: 'Talking about a Robot Story',
    genre: '对话',
    script: [
      'M: Lily, I have just finished a science fiction story about a robot called Robin.',
      'W: Really? What can the robot do in the story?',
      'M: It cooks, cleans the carpet, and even brings tea to the tired host without being asked.',
      'W: That sounds fantastic. Does the family like it at first?',
      'M: Not really. The wife suspects that a machine cannot understand feelings.',
      'W: And then?',
      'M: The robot helps her in an elegant way, and slowly the whole family accepts it as a member of their household.',
      'W: What a warm story! I wish I had a Robin at home.',
    ],
    questions: [
      {
        id: 'u11-l2-1',
        type: 'detail',
        stem: 'What are the speakers mainly talking about?',
        options: [
          'A science fiction story about a robot.',
          'A new robot the boy has bought.',
          'A film they watched last night.',
          'A robot show at the museum.',
        ],
        answerIndex: 0,
        explanation:
          '对话围绕男孩刚读完的关于机器人 Robin 的科幻故事展开，故选 A；机器人并非真买回家，B 不合文意，C、D 未提及。',
      },
      {
        id: 'u11-l2-2',
        type: 'detail',
        stem: 'How does the wife feel about the robot at first?',
        options: [
          'She suspects that it cannot understand feelings.',
          'She believes it is the best machine ever.',
          'She is afraid of its metal hands.',
          'She wants to return it at once.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The wife suspects that a machine cannot understand feelings" 可知妻子起初怀疑机器不懂感情，故选 A。',
      },
      {
        id: 'u11-l2-3',
        type: 'inference',
        stem: 'What can we infer about the ending of the story?',
        options: [
          'The family finally accepts the robot.',
          'The robot is sent back to the factory.',
          'The robot breaks down at the end.',
          'The family moves to another city.',
        ],
        answerIndex: 0,
        explanation:
          '由 "slowly the whole family accepts it as a member of their household" 可知结局是一家人接纳了机器人，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit11Listenings;
