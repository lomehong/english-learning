import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修三 Unit 1（Festivals and Celebrations）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 6 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit6Listenings: ListeningMaterial[] = [
  {
    id: 'u6-l1',
    title: 'A Plan for the Culture Festival',
    genre: '独白',
    script: [
      'Attention, please. I am the monitor of Class Three. I have some good news to share with you.',
      'Our school will hold a culture festival next Friday afternoon. There will be a costume show, and students are welcome to wear traditional clothes from different cultures. In the library, you can guess riddles and win small prizes. If you like handwork, you can also learn to make paper lanterns with the art teacher.',
      'Anyone who wants to take part in the costume show, please sign up with me before Wednesday. Let me say again: sign up before Wednesday. I hope everyone will enjoy the festival.',
    ],
    questions: [
      {
        id: 'u6-l1-1',
        type: 'detail',
        stem: 'When will the school hold the culture festival?',
        options: [
          'Next Friday morning.',
          'Next Friday afternoon.',
          'This Wednesday afternoon.',
          'Next Wednesday morning.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Our school will hold a culture festival next Friday afternoon" 可知文化节在下周五下午举行，故选 B；周三只是报名截止时间。',
      },
      {
        id: 'u6-l1-2',
        type: 'detail',
        stem: 'What can students do in the library during the festival?',
        options: [
          'Watch a costume show.',
          'Make paper lanterns.',
          'Guess riddles and win prizes.',
          'Sign up for the art class.',
        ],
        answerIndex: 2,
        explanation:
          '由 "In the library, you can guess riddles and win small prizes" 可知在图书馆可以猜谜赢奖，故选 C；做灯笼是与美术老师一起的活动，地点未说明在图书馆。',
      },
      {
        id: 'u6-l1-3',
        type: 'inference',
        stem: 'Why does the speaker repeat the sign-up time?',
        options: [
          'To show that the festival has been cancelled.',
          'To remind students not to miss the deadline.',
          'To ask students to clean the library.',
          'To explain the origin of the festival.',
        ],
        answerIndex: 1,
        explanation:
          '说话人重复 "sign up before Wednesday"，是提醒同学不要错过报名截止时间，可推知选 B。',
      },
    ],
  },
  {
    id: 'u6-l2',
    title: 'Talking about the Mid-Autumn Festival',
    genre: '对话',
    script: [
      'M: Hi, Wang Hui. The Mid-Autumn Festival is coming. What are you going to do?',
      'W: My family will gather at my grandparents\u2019 home, as usual. We will make mooncakes together and enjoy them in the yard under the full moon.',
      'M: That sounds warm. Do you know why people eat mooncakes on that day?',
      'W: Sure. The round mooncake and the full moon both stand for family reunion. My grandpa says the festival began as a harvest celebration in autumn.',
      'M: Interesting! May I join you this year? I would like to try making mooncakes.',
      'W: Of course you can. My grandma will be happy to meet your family as well. Remember to bring your camera \u2014 the moon that night is always beautiful.',
    ],
    questions: [
      {
        id: 'u6-l2-1',
        type: 'detail',
        stem: 'What will Wang Hui\u2019s family do on the festival?',
        options: [
          'Travel to another city.',
          'Gather at her grandparents\u2019 home.',
          'Watch fireworks by the river.',
          'Hold a costume show at school.',
        ],
        answerIndex: 1,
        explanation:
          '由 "My family will gather at my grandparents\u2019 home, as usual" 可知全家将聚到祖父母家，故选 B。',
      },
      {
        id: 'u6-l2-2',
        type: 'detail',
        stem: 'What do the round mooncake and the full moon stand for?',
        options: [
          'Good luck for the new year.',
          'A rich harvest of crops.',
          'Family reunion.',
          'The origin of agriculture.',
        ],
        answerIndex: 2,
        explanation:
          '由 "The round mooncake and the full moon both stand for family reunion" 可知圆月饼与满月都象征团圆，故选 C。',
      },
      {
        id: 'u6-l2-3',
        type: 'inference',
        stem: 'What will the boy probably do during the festival?',
        options: [
          'Make mooncakes with Wang Hui\u2019s family.',
          'Take photos of the family reunion.',
          'Both A and B.',
          'Stay at home and study for a test.',
        ],
        answerIndex: 2,
        explanation:
          '男孩请求加入并被允许，还说想试着做月饼；王慧又提醒他带上相机拍月亮，可推知他既会做月饼也会拍照，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6Listenings;
