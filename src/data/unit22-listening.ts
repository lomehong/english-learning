import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修三 Unit 2（Morals and Virtues）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 7 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit7Listenings: ListeningMaterial[] = [
  {
    id: 'u22-l1',
    title: 'A Story Shared in Class',
    genre: '独白',
    script: [
      'Good morning, everyone. Before our lesson starts, I would like to share a short story with you.',
      'Last week, a student of our school found five hundred yuan on the playground on his way to the library. At first he did not know what to do. It was a real dilemma for him, because he was saving money for a new dictionary.',
      'After thinking for a while, he took the money to the teachers\u2019 office. The owner, a junior student, got it back the same day and thanked him again and again. The student said honesty was more precious than anything he could buy. I hope his story will remind all of us to do the right thing.',
    ],
    questions: [
      {
        id: 'u22-l1-1',
        type: 'detail',
        stem: 'Where did the student find the money?',
        options: [
          'In the library.',
          'On the playground.',
          'In the teachers\u2019 office.',
          'On the school bus.',
        ],
        answerIndex: 1,
        explanation:
          '由 "found five hundred yuan on the playground on his way to the library" 可知钱是在操场上捡到的，故选 B。',
      },
      {
        id: 'u22-l1-2',
        type: 'detail',
        stem: 'Why was it a dilemma for him?',
        options: [
          'He was saving money for a new dictionary.',
          'He did not know the way to the library.',
          'The money belonged to his best friend.',
          'He was afraid of the teachers.',
        ],
        answerIndex: 0,
        explanation:
          '由 "It was a real dilemma for him, because he was saving money for a new dictionary" 可知他正攒钱买词典，构成两难，故选 A。',
      },
      {
        id: 'u22-l1-3',
        type: 'inference',
        stem: 'What does the speaker want the students to learn from the story?',
        options: [
          'To save money for dictionaries.',
          'To return found money to its owner.',
          'To go to the library more often.',
          'To thank the teachers every day.',
        ],
        answerIndex: 1,
        explanation:
          '结尾 "I hope his story will remind all of us to do the right thing" 结合故事内容（捡钱上交、物归原主）可推知说话人希望大家像他一样拾金不昧，故选 B。',
      },
    ],
  },
  {
    id: 'u22-l2',
    title: 'Volunteering at the Nursing Home',
    genre: '对话',
    script: [
      'M: Hi, Zhang Lan. Our class is going to volunteer at the nursing home this Saturday morning. Would you like to join us?',
      'W: I would love to. What will we do there?',
      'M: We will read newspapers to the elderly and teach them how to use their smartphones. Some of them feel lonely, so chatting with them means a lot.',
      'W: That sounds meaningful. I am good at drawing, so I can also teach them simple painting.',
      'M: Great idea! They will love it. The bus leaves at eight thirty in front of the school gate. Do not be late.',
      'W: No problem. Assisting the elderly is a virtue we should all practise. See you on Saturday!',
    ],
    questions: [
      {
        id: 'u22-l2-1',
        type: 'detail',
        stem: 'When will the class go to the nursing home?',
        options: [
          'This Saturday morning.',
          'This Sunday morning.',
          'Next Monday afternoon.',
          'This Saturday evening.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Our class is going to volunteer at the nursing home this Saturday morning" 可知活动在本周六上午，故选 A。',
      },
      {
        id: 'u22-l2-2',
        type: 'detail',
        stem: 'What will Zhang Lan teach the elderly?',
        options: [
          'How to use smartphones.',
          'How to read newspapers.',
          'Simple painting.',
          'How to take the bus.',
        ],
        answerIndex: 2,
        explanation:
          '由 "I am good at drawing, so I can also teach them simple painting" 可知张兰将教老人们简单的绘画，故选 C；教用智能手机是班级整体活动之一。',
      },
      {
        id: 'u22-l2-3',
        type: 'inference',
        stem: 'What does Zhang Lan think of the volunteer work?',
        options: [
          'It is a waste of her weekend.',
          'It is too difficult for students.',
          'It is meaningful and worth doing.',
          'It is only for students who can draw.',
        ],
        answerIndex: 2,
        explanation:
          '由 "That sounds meaningful" 以及结尾 "Assisting the elderly is a virtue we should all practise" 可推知她认为志愿服务有意义、值得做，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7Listenings;
