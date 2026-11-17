import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修一 Unit 2（Looking into the Future）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 2 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit7Listenings: ListeningMaterial[] = [
  {
    id: 'u7-l1',
    title: 'Jobs of Tomorrow',
    genre: '独白',
    script: [
      'Hello, everyone. Today I would like to talk about the jobs of tomorrow.',
      'Experts predict that about half of today\u2019s occupations will change greatly within twenty years, because artificial intelligence will take over repeated work.',
      'However, new careers will appear, such as robot trainers, virtual tour guides and data safety officers.',
      'So my advice is simple: keep learning, stay curious, and get ready to welcome the changes instead of fearing them.',
    ],
    questions: [
      {
        id: 'u7-l1-1',
        type: 'detail',
        stem: 'What do experts predict about today\u2019s occupations?',
        options: [
          'About half of them will change greatly within twenty years.',
          'All of them will disappear in ten years.',
          'None of them will be affected by technology.',
          'Only farming jobs will change.',
        ],
        answerIndex: 0,
        explanation:
          '由 "About half of today\u2019s occupations will change greatly within twenty years" 可知约一半职业将在二十年内发生巨变，故选 A。',
      },
      {
        id: 'u7-l1-2',
        type: 'detail',
        stem: 'Which of the following is mentioned as a new career?',
        options: ['Robot trainers.', 'Bus drivers.', 'Farm workers.', 'Shop owners.'],
        answerIndex: 0,
        explanation:
          '演讲者提到 robot trainers、virtual tour guides 与 data safety officers 等新职业，故选 A；其余选项未提及。',
      },
      {
        id: 'u7-l1-3',
        type: 'inference',
        stem: 'What is the speaker\u2019s attitude towards future changes?',
        options: ['Positive and hopeful.', 'Angry and disappointed.', 'Frightened and helpless.', 'Indifferent.'],
        answerIndex: 0,
        explanation:
          '演讲者建议 keep learning、stay curious 并 welcome the changes，可推知其态度积极乐观，故选 A。',
      },
    ],
  },
  {
    id: 'u7-l2',
    title: 'A Virtual Field Trip',
    genre: '对话',
    script: [
      'M: Mary, our geography class will try something new next week. We are going on a virtual field trip to a volcano.',
      'W: A virtual trip? Do you mean those glasses that make everything look real?',
      'M: Exactly. The teacher says the technology is quite safe, and we can watch the boiling lava from every direction.',
      'W: That sounds amazing. But will the signal inside the classroom be strong enough?',
      'M: No problem. The school has just installed new sensors and network devices to support it.',
      'W: Great! Then I will sign up right away. It must be the most interesting geography class ever.',
    ],
    questions: [
      {
        id: 'u7-l2-1',
        type: 'detail',
        stem: 'What will the speakers\u2019 class do next week?',
        options: [
          'Take a virtual field trip to a volcano.',
          'Visit a science museum by bus.',
          'Watch a film about the ocean.',
          'Climb a real mountain together.',
        ],
        answerIndex: 0,
        explanation:
          '由 "We are going on a virtual field trip to a volcano" 可知下周班级将进行一次虚拟火山考察，故选 A。',
      },
      {
        id: 'u7-l2-2',
        type: 'detail',
        stem: 'What has the school just installed to support the trip?',
        options: [
          'New sensors and network devices.',
          'More desks and chairs.',
          'A larger blackboard.',
          'New air conditioners.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The school has just installed new sensors and network devices to support it" 可知学校新装了传感器与网络设备，故选 A。',
      },
      {
        id: 'u7-l2-3',
        type: 'inference',
        stem: 'How does the woman feel about the class in the end?',
        options: ['Excited.', 'Nervous.', 'Bored.', 'Unwilling.'],
        answerIndex: 0,
        explanation:
          '女士最后说 "I will sign up right away. It must be the most interesting geography class ever"，可推知她非常兴奋期待，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7Listenings;
