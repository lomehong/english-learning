import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修一 Unit 1（People of Achievement）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 1 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit6Listenings: ListeningMaterial[] = [
  {
    id: 'u6-l1',
    title: 'People of Achievement Week',
    genre: '独白',
    script: [
      'Good morning, everyone. Our school will hold a special event called People of Achievement Week next month.',
      'During the week, we will invite an outstanding scientist to give a talk about her research career.',
      'Each class will also choose one great person, make a wall newspaper about his or her devotion to society, and share it on Friday.',
      'If you want to join the activities, please sign up with your monitor before this Friday. Thank you.',
    ],
    questions: [
      {
        id: 'u6-l1-1',
        type: 'detail',
        stem: 'What will the scientist be invited to do?',
        options: [
          'To give a talk about her research career.',
          'To teach a physics class.',
          'To judge a sports meeting.',
          'To open the new library.',
        ],
        answerIndex: 0,
        explanation:
          '由 "invite an outstanding scientist to give a talk about her research career" 可知科学家将来做一场关于研究生涯的讲座，故选 A。',
      },
      {
        id: 'u6-l1-2',
        type: 'detail',
        stem: 'What will each class make for the wall newspaper?',
        options: [
          'A report on a great person\u2019s devotion to society.',
          'A map of the school.',
          'A plan for a field trip.',
          'A photo of the monitor.',
        ],
        answerIndex: 0,
        explanation:
          '由 "make a wall newspaper about his or her devotion to society" 可知各班将制作关于卓越人物奉献事迹的墙报，故选 A。',
      },
      {
        id: 'u6-l1-3',
        type: 'detail',
        stem: 'When should students sign up for the activities?',
        options: ['Before this Friday.', 'Next Friday.', 'Next month.', 'Right after the speech.'],
        answerIndex: 0,
        explanation:
          '由 "please sign up with your monitor before this Friday" 可知报名截止于本周五之前，故选 A。',
      },
    ],
  },
  {
    id: 'u6-l2',
    title: 'Choosing a Person for the Wall Newspaper',
    genre: '对话',
    script: [
      'M: Lucy, our class needs to choose one person for the wall newspaper. Any ideas?',
      'W: How about Marie Curie? She was the first woman to win two Nobel Prizes.',
      'M: Good choice. But I think we should also consider someone around us, like Doctor Wang from the local hospital.',
      'W: You mean the doctor who insisted on working during the snowstorm?',
      'M: Exactly. He is not famous, but his devotion to patients is just as remarkable.',
      'W: I agree. Let us tell the monitor, and I will write about his story tonight.',
    ],
    questions: [
      {
        id: 'u6-l2-1',
        type: 'detail',
        stem: 'What are the speakers mainly talking about?',
        options: [
          'Who to choose for their class wall newspaper.',
          'How to win a Nobel Prize.',
          'Where to buy a newspaper.',
          'When to visit the local hospital.',
        ],
        answerIndex: 0,
        explanation:
          '对话围绕“班里墙报选哪位人物”展开，先后讨论居里夫人与王医生，故选 A。',
      },
      {
        id: 'u6-l2-2',
        type: 'detail',
        stem: 'What do we know about Doctor Wang?',
        options: [
          'He kept working during the snowstorm.',
          'He won two Nobel Prizes.',
          'He teaches physics at school.',
          'He writes for the school newspaper.',
        ],
        answerIndex: 0,
        explanation:
          '由 "the doctor who insisted on working during the snowstorm" 可知王医生曾在暴风雪期间坚持工作，故选 A。',
      },
      {
        id: 'u6-l2-3',
        type: 'inference',
        stem: 'What is the woman\u2019s attitude towards Doctor Wang?',
        options: ['Supportive.', 'Doubtful.', 'Uninterested.', 'Worried.'],
        answerIndex: 0,
        explanation:
          '女士最后表示同意并愿意当晚写王医生的故事，可推知她持支持态度，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6Listenings;
