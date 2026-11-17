import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修四 Unit 2（Iconic Attractions）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 2 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit12Listenings: ListeningMaterial[] = [
  {
    id: 'u12-l1',
    title: 'A Trip Plan to the Harbour City',
    genre: '独白',
    script: [
      'Good afternoon, passengers. Here is the plan for our one-day trip to the harbour city tomorrow.',
      'At nine in the morning, we will visit the white Opera House, the most iconic building of the country.',
      'After lunch, a local guide will lead us across the great bridge on foot, and we will enjoy a barbecue by the sea.',
      'In the late afternoon, we will hire boats to watch the fish over the coral gardens.',
      'Please wear comfortable shoes and bring a hat. The bus leaves at eight sharp. Thank you.',
    ],
    questions: [
      {
        id: 'u12-l1-1',
        type: 'detail',
        stem: 'What will the visitors do first tomorrow morning?',
        options: [
          'Visit the white Opera House.',
          'Walk across the great bridge.',
          'Have a barbecue by the sea.',
          'Watch fish over the coral.',
        ],
        answerIndex: 0,
        explanation:
          '由 "At nine in the morning, we will visit the white Opera House" 可知上午先参观歌剧院，故选 A；B、C、D 均在午后。',
      },
      {
        id: 'u12-l1-2',
        type: 'detail',
        stem: 'What will the visitors do in the late afternoon?',
        options: [
          'They will hire boats to watch the fish.',
          'They will climb a mountain.',
          'They will buy shoes in a shop.',
          'They will visit a music school.',
        ],
        answerIndex: 0,
        explanation:
          '由 "In the late afternoon, we will hire boats to watch the fish over the coral gardens" 可知傍晚将乘船观鱼，故选 A。',
      },
      {
        id: 'u12-l1-3',
        type: 'detail',
        stem: 'What does the speaker ask the visitors to bring?',
        options: ['A hat and comfortable shoes.', 'A raincoat and an umbrella.', 'A camera and a ladder.', 'A ticket and a passport.'],
        answerIndex: 0,
        explanation:
          '由 "Please wear comfortable shoes and bring a hat" 可知需穿舒适的鞋并带帽子，故选 A。',
      },
    ],
  },
  {
    id: 'u12-l2',
    title: 'Choosing a Place to Visit',
    genre: '对话',
    script: [
      'W: Tom, our class wants to visit one iconic attraction next weekend. Any suggestions?',
      'M: How about the national park in the mountains? The weather there is temperate even in summer.',
      'W: Good idea. Is there anything special to see?',
      'M: Yes. A guide will show us rare herbs, and if we are lucky, we may watch young turtles hatch on the beach nearby.',
      'W: Wonderful! I have also heard the park lies close to the equator, so the forest looks quite tropical.',
      'M: That is right. Remember to bring old shoes, because the path near the shore is rough.',
      'W: I will tell our monitor to book the tickets tonight.',
    ],
    questions: [
      {
        id: 'u12-l2-1',
        type: 'detail',
        stem: 'What are the speakers talking about?',
        options: [
          'Which attraction their class should visit.',
          'How to become a park guide.',
          'Where to buy cheap tickets.',
          'When to hold the class meeting.',
        ],
        answerIndex: 0,
        explanation:
          '对话围绕“班级下周末去哪个标志性景点”展开，最终选择了山中的国家公园，故选 A。',
      },
      {
        id: 'u12-l2-2',
        type: 'detail',
        stem: 'What may the students see if they are lucky?',
        options: [
          'Young turtles hatching on the beach.',
          'A famous film star in the park.',
          'Snow on the mountain top.',
          'A new bridge over the sea.',
        ],
        answerIndex: 0,
        explanation:
          '由 "we may watch young turtles hatch on the beach nearby" 可知幸运的话能看到小海龟孵化，故选 A。',
      },
      {
        id: 'u12-l2-3',
        type: 'inference',
        stem: 'What will the woman probably do tonight?',
        options: [
          'Ask the monitor to book the tickets.',
          'Cancel the weekend plan.',
          'Buy a pair of new shoes for Tom.',
          'Write a report about the equator.',
        ],
        answerIndex: 0,
        explanation:
          '女士最后说 "I will tell our monitor to book the tickets tonight"，可推知她今晚会让班长订票，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit12Listenings;
