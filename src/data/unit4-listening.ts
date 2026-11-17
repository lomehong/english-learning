import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修一 Unit 4（Natural Disasters）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 4 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit4Listenings: ListeningMaterial[] = [
  {
    id: 'u4-l1',
    title: 'A School Emergency Drill',
    genre: '独白',
    script: [
      'Good morning, everyone. This is your headmaster speaking. As you know, our school will hold an emergency drill this Friday morning.',
      'When the alarm sounds, please stop what you are doing at once. Stay calm and do not shout or run. Leave your books behind and follow your teacher to the playground. Take the stairs, never the lift.',
      'If you are trapped in a classroom during a real earthquake, hide under your desk and cover your head. Wait for the rescue team instead of jumping out of the window. Remember: staying calm is the first step of surviving a disaster.',
    ],
    questions: [
      {
        id: 'u4-l1-1',
        type: 'detail',
        stem: 'When will the school hold the emergency drill?',
        options: [
          'This Friday morning.',
          'This Friday afternoon.',
          'Next Monday morning.',
          'As soon as the alarm sounds today.',
        ],
        answerIndex: 0,
        explanation:
          '由 "our school will hold an emergency drill this Friday morning" 可知演习在本周五上午，故选 A。',
      },
      {
        id: 'u4-l1-2',
        type: 'detail',
        stem: 'What should students do when the alarm sounds?',
        options: [
          'Take the lift to get downstairs quickly.',
          'Go back for their books first.',
          'Follow the teacher to the playground.',
          'Jump out of the window at once.',
        ],
        answerIndex: 2,
        explanation:
          '校长要求 "follow your teacher to the playground. Take the stairs, never the lift"，故选 C；A 与 never the lift 矛盾，B 与 Leave your books behind 矛盾，D 是真实地震中都不允许的危险做法。',
      },
      {
        id: 'u4-l1-3',
        type: 'inference',
        stem: 'What does the speaker think is the most important thing in a disaster?',
        options: [
          'Running faster than others.',
          'Keeping calm.',
          'Calling parents immediately.',
          'Hiding all the valuable things.',
        ],
        answerIndex: 1,
        explanation:
          '结尾总结 "staying calm is the first step of surviving a disaster"，可推知校长认为保持镇静最重要，故选 B。',
      },
    ],
  },
  {
    id: 'u4-l2',
    title: 'Volunteering After the Typhoon',
    genre: '对话',
    script: [
      'M: Hi, Amy. I hear your family went through the typhoon last week. Are you all right?',
      'W: Yes, we are safe now, thank you. The typhoon struck our town at midnight, and the wind destroyed the roof of our house. It was a terrible shock.',
      'M: I am so sorry. Where did you stay that night?',
      'W: We found shelter in a local school. Volunteers gave us hot meals and clean water, and doctors gave first aid to the injured people.',
      'M: That is good news. Our class is going to volunteer there this weekend. Would you like to join us?',
      'W: Of course! The victims still need aid, and I want to help my neighbours rebuild our hometown, too.',
    ],
    questions: [
      {
        id: 'u4-l2-1',
        type: 'detail',
        stem: 'When did the typhoon strike Amy\u2019s town?',
        options: [
          'Early in the morning.',
          'At midnight.',
          'Last weekend, in the daytime.',
          'On Friday afternoon.',
        ],
        answerIndex: 1,
        explanation:
          '由 "The typhoon struck our town at midnight" 可知台风在午夜袭来，故选 B。',
      },
      {
        id: 'u4-l2-2',
        type: 'detail',
        stem: 'Where did Amy\u2019s family find shelter that night?',
        options: [
          'In a hospital.',
          'In a volunteer\u2019s home.',
          'In a local school.',
          'In a supermarket nearby.',
        ],
        answerIndex: 2,
        explanation:
          '由 "We found shelter in a local school" 可知一家人在当地一所学校避难，故选 C。',
      },
      {
        id: 'u4-l2-3',
        type: 'inference',
        stem: 'What will Amy probably do this weekend?',
        options: [
          'Stay at home and rest.',
          'Volunteer to help the victims with her classmates.',
          'Travel to another town.',
          'Repair the roof of her school.',
        ],
        answerIndex: 1,
        explanation:
          '结尾 Amy 答应加入班级志愿活动并说 "I want to help my neighbours rebuild our hometown"，可推知她周末将和同学一起做志愿者帮助受灾群众，故选 B。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit4Listenings;
