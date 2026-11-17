import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修二 Unit 2（Bridging Cultures）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 2 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit12Listenings: ListeningMaterial[] = [
  {
    id: 'u12-l1',
    title: 'Welcome Meeting for Exchange Students',
    genre: '独白',
    script: [
      'Welcome to our school, exchange students from London. My name is Ms Chen, and I am the manager of this programme.',
      'Each of you will have a tutor who meets you every week, so please tell him or her about any difficulty in your studies.',
      'Do not worry if you feel homesick at the beginning; almost every student abroad feels the same, and it usually passes in a few weeks.',
      'Finally, I hope you will participate in our culture festival and share your own traditions with Chinese students.',
    ],
    questions: [
      {
        id: 'u12-l1-1',
        type: 'detail',
        stem: 'What will each exchange student have?',
        options: [
          'A tutor who meets them every week.',
          'A private room in a hotel.',
          'A ticket to London.',
          'A new laptop from the school.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Each of you will have a tutor who meets you every week" 可知每位交换生都有一名每周见面的导师，故选 A。',
      },
      {
        id: 'u12-l1-2',
        type: 'detail',
        stem: 'What does Ms Chen say about feeling homesick?',
        options: [
          'It is common at the beginning and usually passes in a few weeks.',
          'It is a serious illness that needs a doctor.',
          'It only happens to students from London.',
          'It means the student should go home at once.',
        ],
        answerIndex: 0,
        explanation:
          '由 "almost every student abroad feels the same, and it usually passes in a few weeks" 可知想家很常见、几周后通常就会过去，故选 A。',
      },
      {
        id: 'u12-l1-3',
        type: 'detail',
        stem: 'What does Ms Chen hope the students will do at the culture festival?',
        options: [
          'Share their own traditions with Chinese students.',
          'Sell food from their countries.',
          'Perform a play in Chinese only.',
          'Organize a football match.',
        ],
        answerIndex: 0,
        explanation:
          '由结尾 "I hope you will participate in our culture festival and share your own traditions" 可知她希望交换生分享本国传统，故选 A。',
      },
    ],
  },
  {
    id: 'u12-l2',
    title: 'Talking About the Exchange Year',
    genre: '对话',
    script: [
      'W: David, I heard that you will study abroad in Australia next year. Is that true?',
      'M: Yes. To qualify for the programme, I have been learning English idioms every day.',
      'W: That is wonderful. Are you worried about anything?',
      'M: A little. Language is the biggest hurdle for me, but I will try to adapt quickly and stay optimistic.',
      'W: I believe living abroad will widen your horizon. Do give a presentation about Chinese tea when you are there!',
      'M: I will. Embracing a new culture and sharing mine — that is what bridging cultures means to me.',
    ],
    questions: [
      {
        id: 'u12-l2-1',
        type: 'detail',
        stem: 'What has David been doing every day to qualify for the programme?',
        options: [
          'Learning English idioms.',
          'Practising basketball.',
          'Writing application letters.',
          'Studying Australian history.',
        ],
        answerIndex: 0,
        explanation:
          '由 "To qualify for the programme, I have been learning English idioms every day" 可知他每天学习英语习语以取得项目资格，故选 A。',
      },
      {
        id: 'u12-l2-2',
        type: 'detail',
        stem: 'What is David worried about most?',
        options: [
          'Language.',
          'The weather.',
          'The food there.',
          'The flight ticket.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Language is the biggest hurdle for me" 可知他最担心的是语言这道难关，故选 A。',
      },
      {
        id: 'u12-l2-3',
        type: 'inference',
        stem: 'What is David\u2019s attitude towards the coming exchange year?',
        options: [
          'Optimistic.',
          'Frightened.',
          'Uninterested.',
          'Doubtful.',
        ],
        answerIndex: 0,
        explanation:
          '大卫说自己会“努力尽快适应并保持乐观”，结尾还谈到乐于拥抱并分享文化，可推知他持乐观态度，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit12Listenings;
