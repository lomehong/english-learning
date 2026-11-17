import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修三 Unit 5（Poems）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 5 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit30Listenings: ListeningMaterial[] = [
  {
    id: 'u30-l1',
    title: 'Poetry Week Announcement',
    genre: '独白',
    script: [
      'Good morning, book lovers. Our Poetry Week will begin this coming Monday.',
      'During the week, you can borrow any collection of poems from the library for free.',
      'On Wednesday afternoon, a famous poet will recite her own works in the school hall and answer your questions.',
      'Those who wish to read their own poems may sign their names on the list outside the office.',
      'We look forward to hearing your voices.',
    ],
    questions: [
      {
        id: 'u30-l1-q1',
        type: 'detail',
        stem: 'When will the Poetry Week begin?',
        options: [
          'This coming Monday.',
          'Next month.',
          'On Wednesday afternoon.',
          'Tomorrow evening.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Our Poetry Week will begin this coming Monday" 可知诗歌周将于下周一开幕，故选 A；周三是诗人朗诵活动的时间。',
      },
      {
        id: 'u30-l1-q2',
        type: 'detail',
        stem: 'What will the famous poet do in the school hall?',
        options: [
          'Recite her own works and answer questions.',
          'Sell her new book.',
          'Teach a maths class.',
          'Play the piano.',
        ],
        answerIndex: 0,
        explanation:
          '由 "a famous poet will recite her own works in the school hall and answer your questions" 可知诗人将朗诵作品并回答问题，故选 A。',
      },
      {
        id: 'u30-l1-q3',
        type: 'detail',
        stem: 'Where can students sign their names to read their own poems?',
        options: [
          'In the library.',
          'On the list outside the office.',
          'On the school gate.',
          'In the school hall.',
        ],
        answerIndex: 1,
        explanation:
          '由 "sign their names on the list outside the office" 可知有意朗诵自己作品的学生需在办公室外的名单上签名，故选 B。',
      },
    ],
  },
  {
    id: 'u30-l2',
    title: 'A Chat About Poems',
    genre: '对话',
    script: [
      'M: What are you reading, Lucy? You look so quiet.',
      'W: A collection of poems. The lines about the sea are beautiful.',
      'M: I never understand poems. They always seem too short to tell a story.',
      'W: That is the point. A few words can carry strong feelings, like a small light in the dark.',
      'M: Interesting. Could you read one to me tonight?',
      'W: Sure. Meet me in the reading room at six.',
      'M: Great, see you then.',
    ],
    questions: [
      {
        id: 'u30-l2-q1',
        type: 'detail',
        stem: 'What is Lucy reading?',
        options: [
          'A collection of poems.',
          'A travel guide.',
          'A science novel.',
          'A history book.',
        ],
        answerIndex: 0,
        explanation:
          '由 "A collection of poems. The lines about the sea are beautiful" 可知 Lucy 正在读一本诗集，故选 A；B、C、D 均与原文不符。',
      },
      {
        id: 'u30-l2-q2',
        type: 'detail',
        stem: 'What does the man think of poems at first?',
        options: [
          'They seem too short to tell a story.',
          'They are too long to finish.',
          'They are all about the sea.',
          'They are easy to write.',
        ],
        answerIndex: 0,
        explanation:
          '男士先说 "They always seem too short to tell a story"，可知他起初觉得诗太短讲不了故事，故选 A；B、C、D 与原文不符。',
      },
      {
        id: 'u30-l2-q3',
        type: 'inference',
        stem: 'What will the two speakers probably do at six?',
        options: [
          'Borrow books from the library.',
          'Write a poem about the sea.',
          'Read a poem together in the reading room.',
          'Attend a lecture.',
        ],
        answerIndex: 2,
        explanation:
          'Lucy 同意晚上读一首诗给男士听，并约在阅览室见面，可推知他们将一起读诗，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit30Listenings;
