import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修三 Unit 1（Art）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 1 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit26Listenings: ListeningMaterial[] = [
  {
    id: 'u26-l1',
    title: 'A Visit to the City Gallery',
    genre: '独白',
    script: [
      'Good morning, art lovers. The school art club will visit the City Gallery this Saturday morning.',
      'We will meet at the school gate at eight and take the bus together.',
      'In the gallery, a local painter will show us how to paint with watercolours, and each member will get a free sketchbook.',
      'Members can also try drawing a simple portrait in the garden nearby.',
      'Please bring a pencil and wear comfortable shoes. Sign up with me before Thursday noon. Thank you very much.',
    ],
    questions: [
      {
        id: 'u26-l1-q1',
        type: 'detail',
        stem: 'Where will the club members meet?',
        options: [
          'At the school gate.',
          'At the City Gallery.',
          'At the painter\u2019s home.',
          'In the school garden.',
        ],
        answerIndex: 0,
        explanation:
          '由 "We will meet at the school gate at eight" 可知成员们将在校门口集合，故选 A；B、C、D 均与集合地点不符。',
      },
      {
        id: 'u26-l1-q2',
        type: 'detail',
        stem: 'What will each member get?',
        options: [
          'A box of watercolours.',
          'A free sketchbook.',
          'A new pencil.',
          'A bus ticket.',
        ],
        answerIndex: 1,
        explanation:
          '由 "each member will get a free sketchbook" 可知每位成员将获得一本免费素描本，故选 B；铅笔需自带，其余选项与原文不符。',
      },
      {
        id: 'u26-l1-q3',
        type: 'detail',
        stem: 'When is the latest time to sign up?',
        options: [
          'Before Thursday noon.',
          'On Saturday morning.',
          'Before Friday evening.',
          'After the visit.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Sign up with me before Thursday noon" 可知报名截止时间为周四中午之前，故选 A。',
      },
    ],
  },
  {
    id: 'u26-l2',
    title: 'Talking About the Art Report',
    genre: '对话',
    script: [
      'M: Hi, Emma. Have you finished the art report on abstract paintings?',
      'W: Not yet. I find them hard to understand. Maybe we can go to the exhibition together this weekend.',
      'M: Good idea. The poster says there will be some realistic works too.',
      'W: Great. I prefer clear shapes, but I will try the abstract ones first.',
      'M: That is the spirit. Shall we meet at the gate at nine on Sunday?',
      'W: OK, see you then.',
    ],
    questions: [
      {
        id: 'u26-l2-q1',
        type: 'detail',
        stem: 'What are the speakers mainly talking about?',
        options: [
          'Their plan to visit an exhibition.',
          'Their homework for maths.',
          'A painting they have sold.',
          'A poster they designed.',
        ],
        answerIndex: 0,
        explanation:
          '对话围绕周末一起去参观画展以完成艺术报告展开，故选 A；B、C、D 均不是对话主题。',
      },
      {
        id: 'u26-l2-q2',
        type: 'detail',
        stem: 'What does the poster say about the exhibition?',
        options: [
          'The exhibition will only be about modern music.',
          'It will include some realistic works.',
          'It has been cancelled.',
          'It will be held on Friday evening.',
        ],
        answerIndex: 1,
        explanation:
          '由 "The poster says there will be some realistic works too" 可知画展也将展出写实作品，故选 B；A、C、D 与原文不符。',
      },
      {
        id: 'u26-l2-q3',
        type: 'inference',
        stem: 'What can we learn about Emma?',
        options: [
          'She is willing to try abstract art.',
          'She dislikes going out on weekends.',
          'She has finished her report.',
          'She prefers abstract paintings to realistic ones.',
        ],
        answerIndex: 0,
        explanation:
          'Emma 说虽然偏爱清晰造型，但会先尝试抽象作品，可推知她愿意尝试抽象艺术，故选 A；她说报告未完成，也不是更爱抽象画，C、D 与原文相悖。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit26Listenings;
