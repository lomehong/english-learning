import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修二 Unit 1（Science and Scientists）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 1 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit11Listenings: ListeningMaterial[] = [
  {
    id: 'u11-l1',
    title: 'Science Week Is Coming',
    genre: '独白',
    script: [
      'Good morning, everyone. I am glad to tell you that our school will hold Science Week next month.',
      'On Monday, a well-known physician will give a talk about how she and her team developed a new vaccine last year.',
      'On Wednesday afternoon, the school laboratory will be open to all students, and you can watch tiny cells through a microscope there.',
      'If you want to join the activities, please sign up with your monitor before this Friday.',
    ],
    questions: [
      {
        id: 'u11-l1-1',
        type: 'detail',
        stem: 'What will the physician talk about on Monday?',
        options: [
          'How her team developed a new vaccine.',
          'How to become a school monitor.',
          'The history of our school.',
          'Her travels around the world.',
        ],
        answerIndex: 0,
        explanation:
          '由 "a well-known physician will give a talk about how she and her team developed a new vaccine" 可知周一医生将讲团队研发新疫苗的经历，故选 A。',
      },
      {
        id: 'u11-l1-2',
        type: 'detail',
        stem: 'What can students do in the laboratory on Wednesday afternoon?',
        options: [
          'Watch tiny cells through a microscope.',
          'Make medicine for patients.',
          'Play science games with teachers.',
          'Repair old computers.',
        ],
        answerIndex: 0,
        explanation:
          '由 "the school laboratory will be open… you can watch tiny cells through a microscope" 可知周三下午可在实验室用显微镜观察细胞，故选 A。',
      },
      {
        id: 'u11-l1-3',
        type: 'detail',
        stem: 'When should students sign up for the activities?',
        options: [
          'Before this Friday.',
          'Next Monday.',
          'On Wednesday afternoon.',
          'At the end of next month.',
        ],
        answerIndex: 0,
        explanation:
          '由 "please sign up with your monitor before this Friday" 可知报名截止于本周五前，故选 A。',
      },
    ],
  },
  {
    id: 'u11-l2',
    title: 'Fixing the Experiment',
    genre: '对话',
    script: [
      'M: Lily, you look worried. What is wrong with our science project?',
      'W: The initial results are wrong again. The virus data simply does not match the theory.',
      'M: Do not blame yourself. Maybe we should trace every step and check the statistics again.',
      'W: Good idea. If we prove each step is right, the final report will be solid.',
      'M: Exactly. Let us meet in the laboratory after class and ask the professor to check our method.',
    ],
    questions: [
      {
        id: 'u11-l2-1',
        type: 'detail',
        stem: 'Why does Lily look worried?',
        options: [
          'The initial results of their project are wrong.',
          'She has lost her science report.',
          'The professor is angry with them.',
          'She cannot find the laboratory.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The initial results are wrong again" 可知莉莉担心的是项目初始结果又出错了，故选 A。',
      },
      {
        id: 'u11-l2-2',
        type: 'detail',
        stem: 'What does the man suggest doing?',
        options: [
          'Tracing every step and checking the statistics again.',
          'Giving up the whole project.',
          'Changing the topic of the report.',
          'Asking another team to help them.',
        ],
        answerIndex: 0,
        explanation:
          '由男士的话 "Maybe we should trace every step and check the statistics again" 可知他建议逐步排查并核对统计数据，故选 A。',
      },
      {
        id: 'u11-l2-3',
        type: 'inference',
        stem: 'What will the two speakers probably do after class?',
        options: [
          'Meet in the laboratory and ask the professor for help.',
          'Go home and rest for a whole day.',
          'Write the final report at once.',
          'Tell the monitor to sign up for Science Week.',
        ],
        answerIndex: 0,
        explanation:
          '由结尾 "Let us meet in the laboratory after class and ask the professor to check our method" 可推知两人课后将去实验室并请教授检查方法，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit11Listenings;
