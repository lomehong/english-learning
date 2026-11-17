import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修一 Unit 5（Languages Around the World）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 5 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit5Listenings: ListeningMaterial[] = [
  {
    id: 'u5-l1',
    title: 'Why Learn a Second Language?',
    genre: '独白',
    script: [
      'Good morning, everyone. Today I want to talk about the reasons for learning a second language.',
      'First, a new language connects you with millions of people. For example, Spanish is spoken by people in more than twenty countries.',
      'Second, learning a language trains your brain. Students who study a foreign language often do better in other subjects, too.',
      'Finally, it is fun. You can watch films, sing songs, and make friends from other cultures. So why not start today?',
    ],
    questions: [
      {
        id: 'u5-l1-1',
        type: 'detail',
        stem: 'How many reasons does the speaker give for learning a second language?',
        options: ['One.', 'Two.', 'Three.', 'Four.'],
        answerIndex: 2,
        explanation:
          '演讲者用 First / Second / Finally 列出连接他人、锻炼大脑、带来乐趣三条理由，故选 C。',
      },
      {
        id: 'u5-l1-2',
        type: 'detail',
        stem: 'According to the speaker, in how many countries is Spanish spoken?',
        options: [
          'More than twenty.',
          'More than two hundred.',
          'Exactly five.',
          'About twelve.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Spanish is spoken by people in more than twenty countries" 可知西班牙语在二十多个国家使用，故选 A。',
      },
      {
        id: 'u5-l1-3',
        type: 'inference',
        stem: 'What is the speaker\u2019s attitude towards learning a second language?',
        options: ['Worried.', 'Bored.', 'Supportive.', 'Uncertain.'],
        answerIndex: 2,
        explanation:
          '演讲者列举学习外语的多项好处，并以 "it is fun" 和 "why not start today?" 结尾，可推知其态度是支持的，故选 C。',
      },
    ],
  },
  {
    id: 'u5-l2',
    title: 'Choosing an Elective Language',
    genre: '对话',
    script: [
      'M: Hi, Lucy. Have you decided which language to choose this term, French or Spanish?',
      'W: Not yet. My cousin says Spanish grammar is easier, but I love French films.',
      'M: Well, what does Mr Wang say?',
      'W: He suggests we follow our own interests. A positive attitude matters more than anything else.',
      'M: That sounds reasonable. I will pick Japanese, because I want to understand cartoon songs without reading the translation.',
      'W: Nice choice! Let us hand in our forms together.',
    ],
    questions: [
      {
        id: 'u5-l2-1',
        type: 'detail',
        stem: 'Which two languages is Lucy choosing between?',
        options: [
          'French and Japanese.',
          'French and Spanish.',
          'Spanish and Japanese.',
          'English and French.',
        ],
        answerIndex: 1,
        explanation:
          '对话开头男生问 "French or Spanish"，可知 Lucy 正在法语与西班牙语之间选择，故选 B。',
      },
      {
        id: 'u5-l2-2',
        type: 'detail',
        stem: 'What does Mr Wang suggest the students do?',
        options: [
          'Choose the easier language.',
          'Follow their own interests.',
          'Watch more foreign films.',
          'Learn two languages at once.',
        ],
        answerIndex: 1,
        explanation:
          '由 "He suggests we follow our own interests" 可知王老师建议学生按自己的兴趣来选，故选 B。',
      },
      {
        id: 'u5-l2-3',
        type: 'inference',
        stem: 'Why does the boy want to learn Japanese?',
        options: [
          'To find a job in Japan.',
          'To understand cartoon songs without translation.',
          'To make his cousin happy.',
          'To travel abroad with Lucy.',
        ],
        answerIndex: 1,
        explanation:
          '男生说想不看翻译就听懂卡通歌曲（"without reading the translation"），可知他学日语是出于兴趣，故选 B。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit5Listenings;
