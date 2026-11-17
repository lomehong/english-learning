import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修四 Unit 3（Sea Exploration）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 3 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit13Listenings: ListeningMaterial[] = [
  {
    id: 'u13-l1',
    title: 'A Talk about a Sea Expedition',
    genre: '独白',
    script: [
      'Good morning, boys and girls. Today I will introduce a marine expedition that starts next month.',
      'A team of twenty scientists will sail across the Indian Ocean to study coral reefs and sea animals.',
      'During the voyage, the team will keep a log every day and send photos back to our school website.',
      'They will also measure the depth of the water and record the fish they meet.',
      'If you want to ask the scientists questions, please write to them before this Friday. Thank you.',
    ],
    questions: [
      {
        id: 'u13-l1-1',
        type: 'detail',
        stem: 'What will the team study during the expedition?',
        options: [
          'Coral reefs and sea animals.',
          'Rivers and lakes in the mountains.',
          'Birds in the rainforest.',
          'Old ships in the museum.',
        ],
        answerIndex: 0,
        explanation:
          '由 "study coral reefs and sea animals" 可知科考队将研究珊瑚礁与海洋动物，故选 A。',
      },
      {
        id: 'u13-l1-2',
        type: 'detail',
        stem: 'What will the team do every day during the voyage?',
        options: [
          'Keep a log and send photos back.',
          'Give lessons to the students.',
          'Repair the school website.',
          'Cook food for the sailors.',
        ],
        answerIndex: 0,
        explanation:
          '由 "the team will keep a log every day and send photos back to our school website" 可知团队每天记航海日志并传回照片，故选 A。',
      },
      {
        id: 'u13-l1-3',
        type: 'detail',
        stem: 'What should students do if they have questions?',
        options: [
          'Write to the scientists before Friday.',
          'Call the captain on the phone.',
          'Go to the harbour this weekend.',
          'Ask the teacher after the trip.',
        ],
        answerIndex: 0,
        explanation:
          '由 "please write to them before this Friday" 可知学生应在周五前致信科学家，故选 A。',
      },
    ],
  },
  {
    id: 'u13-l2',
    title: 'After the Ocean Museum',
    genre: '对话',
    script: [
      'M: Kate, I have just come back from the ocean museum. The old ship logs there are amazing.',
      'W: What did you like best, Jack?',
      'M: A log written by a merchant sailor four hundred years ago. It describes a voyage across the sea and a storm they met.',
      'W: That must be exciting. Were all the sailors safe?',
      'M: Yes. The captain decided to withdraw from the storm, and the whole fleet returned home.',
      'W: How wise he was! By the way, the museum will hold a speech contest about sea exploration next month. Shall we take part in it together?',
      'M: Why not? I will prepare a story about that merciful captain.',
    ],
    questions: [
      {
        id: 'u13-l2-1',
        type: 'detail',
        stem: 'What did Jack like best in the museum?',
        options: [
          'A log written by a merchant sailor.',
          'A model of a modern ship.',
          'A film about sea animals.',
          'A map drawn by a painter.',
        ],
        answerIndex: 0,
        explanation:
          '由 "A log written by a merchant sailor four hundred years ago" 及其前句可知他最喜欢那本商人水手的航海日志，故选 A。',
      },
      {
        id: 'u13-l2-2',
        type: 'detail',
        stem: 'How did the sailors survive the storm?',
        options: [
          'The captain withdrew the fleet from the storm.',
          'They repaired the broken ship at sea.',
          'Another ship carried them home.',
          'They waited on a small island.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The captain decided to withdraw from the storm, and the whole fleet returned home" 可知船长决定驶离风暴使船队安全返航，故选 A。',
      },
      {
        id: 'u13-l2-3',
        type: 'inference',
        stem: 'What will Jack and Kate probably do next month?',
        options: [
          'Take part in a speech contest about sea exploration.',
          'Sail across the Indian Ocean.',
          'Work as guides in the museum.',
          'Write a new log for the captain.',
        ],
        answerIndex: 0,
        explanation:
          '对话结尾二人商量一起参加下月博物馆举办的“海洋探索”演讲比赛，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit13Listenings;
