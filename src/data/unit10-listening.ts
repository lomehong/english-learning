import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修一 Unit 5（Working the Land）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 5 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit10Listenings: ListeningMaterial[] = [
  {
    id: 'u10-l1',
    title: 'A Radio Programme on Farming',
    genre: '独白',
    script: [
      'Good evening, and welcome to our weekly programme on farming.',
      'Today we visited Mr Zhao, a farmer who has worked on the land for forty years. He told us that healthy soil is essential to every good harvest.',
      'Instead of chemical fertiliser, Mr Zhao feeds his fields with natural fertiliser, and the yield of his wheat has risen year by year.',
      'His story reminds us that working the land needs both patience and knowledge. Thanks for listening, and see you next week.',
    ],
    questions: [
      {
        id: 'u10-l1-1',
        type: 'detail',
        stem: 'What does Mr Zhao think is essential to a good harvest?',
        options: [
          'Healthy soil.',
          'Expensive machines.',
          'Long working hours.',
          'Cold weather.',
        ],
        answerIndex: 0,
        explanation:
          '由 "healthy soil is essential to every good harvest" 可知赵先生认为健康的土壤对丰收至关重要，故选 A。',
      },
      {
        id: 'u10-l1-2',
        type: 'detail',
        stem: 'What has happened to the yield of Mr Zhao\u2019s wheat?',
        options: [
          'It has risen year by year.',
          'It has dropped sharply.',
          'It has stayed the same for years.',
          'It has been given up completely.',
        ],
        answerIndex: 0,
        explanation:
          '由 "the yield of his wheat has risen year by year" 可知小麦产量逐年上升，故选 A。',
      },
      {
        id: 'u10-l1-3',
        type: 'inference',
        stem: 'What does the speaker think about farming?',
        options: [
          'It needs patience and knowledge.',
          'It is the easiest job in the world.',
          'It no longer matters to young people.',
          'It can be done without any experience.',
        ],
        answerIndex: 0,
        explanation:
          '由结尾 "working the land needs both patience and knowledge" 可推知主持人认为种地需要耐心与知识，故选 A。',
      },
    ],
  },
  {
    id: 'u10-l2',
    title: 'A Day on the School Farm',
    genre: '对话',
    script: [
      'W: Dad, our class will work on the school farm this Friday. What should I prepare?',
      'M: Take a hat and a bottle of water. Farm work under the sun is harder than it looks.',
      'W: Got it. What will we do exactly?',
      'M: Your teacher told me you will harvest the wheat and learn how to turn it into grain.',
      'W: That sounds fun! Will we use the big machines like yours?',
      'M: Only the small ones. Remember, every grain comes from hard work, so never waste your food.',
    ],
    questions: [
      {
        id: 'u10-l2-1',
        type: 'detail',
        stem: 'What does the father advise the girl to take to the farm?',
        options: [
          'A hat and a bottle of water.',
          'A camera and a notebook.',
          'A computer and a dictionary.',
          'An umbrella and a coat.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Take a hat and a bottle of water" 可知父亲建议带帽子和一瓶水，故选 A。',
      },
      {
        id: 'u10-l2-2',
        type: 'detail',
        stem: 'What will the students do on the school farm?',
        options: [
          'Harvest the wheat and turn it into grain.',
          'Feed the chickens and ducks.',
          'Build a new greenhouse.',
          'Sell vegetables in the city.',
        ],
        answerIndex: 0,
        explanation:
          '由 "you will harvest the wheat and learn how to turn it into grain" 可知学生们将收割小麦并学习脱粒，故选 A。',
      },
      {
        id: 'u10-l2-3',
        type: 'inference',
        stem: 'What does the father try to teach the girl at the end of the conversation?',
        options: [
          'The value of hard-earned food.',
          'The price of farm machines.',
          'The history of their village.',
          'The way to cook wheat dishes.',
        ],
        answerIndex: 0,
        explanation:
          '结尾父亲说 "every grain comes from hard work, so never waste your food"，可推知他想教女儿珍惜来之不易的粮食，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10Listenings;
