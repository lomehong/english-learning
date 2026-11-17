import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修一 Unit 3（Fascinating Parks）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 3 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit8Listenings: ListeningMaterial[] = [
  {
    id: 'u8-l1',
    title: 'A Guided Tour in the Nature Park',
    genre: '独白',
    script: [
      'Welcome to Sunny Valley Nature Park. I am your guide, and here are a few tips before we start.',
      'First, please keep to the marked trail at all times, because walking off the trail may disturb the wild animals that live in this territory.',
      'Second, camping is only allowed beside the lake, and open fires are banned everywhere in the park.',
      'Finally, if you are lucky, you will see the reindeer near the glacier at noon. Enjoy your hike, and feel free to ask me any questions.',
    ],
    questions: [
      {
        id: 'u8-l1-1',
        type: 'detail',
        stem: 'Why should visitors keep to the marked trail?',
        options: [
          'Because walking off it may disturb the wild animals.',
          'Because the other paths are being repaired.',
          'Because the trail is the only way to the exit.',
          'Because tickets are checked along the trail.',
        ],
        answerIndex: 0,
        explanation:
          '由 "walking off the trail may disturb the wild animals that live in this territory" 可知偏离步道会惊扰野生动物，故选 A。',
      },
      {
        id: 'u8-l1-2',
        type: 'detail',
        stem: 'Where is camping allowed in the park?',
        options: ['Beside the lake.', 'On the glacier.', 'In the valley centre.', 'Near the park gate.'],
        answerIndex: 0,
        explanation:
          '由 "camping is only allowed beside the lake" 可知只有湖边允许露营，故选 A。',
      },
      {
        id: 'u8-l1-3',
        type: 'detail',
        stem: 'What might visitors see at noon?',
        options: ['The reindeer near the glacier.', 'A boat race on the lake.', 'A firework show.', 'A music festival.'],
        answerIndex: 0,
        explanation:
          '由 "you will see the reindeer near the glacier at noon" 可知中午可能看到冰川附近的驯鹿，故选 A。',
      },
    ],
  },
  {
    id: 'u8-l2',
    title: 'Planning a Weekend Hike',
    genre: '对话',
    script: [
      'W: Ben, would you like to go hiking in Green Lake Park this Saturday?',
      'M: I would love to! Is the waterfall trail still open? I heard it was closed last month.',
      'W: It was, but it reopened last week. The park has also added a new rest area halfway up the mountain.',
      'M: Great. What about lunch? Are we allowed to cook there?',
      'W: No, open fires are banned, so we should bring sandwiches and fruit instead.',
      'M: No problem. Then let us meet at the school gate at eight on Saturday morning.',
    ],
    questions: [
      {
        id: 'u8-l2-1',
        type: 'detail',
        stem: 'What do we know about the waterfall trail?',
        options: [
          'It reopened last week.',
          'It was closed forever.',
          'It was built last month.',
          'It leads to the school gate.',
        ],
        answerIndex: 0,
        explanation:
          '由 "It was, but it reopened last week" 可知瀑布步道上周末重新开放，故选 A。',
      },
      {
        id: 'u8-l2-2',
        type: 'detail',
        stem: 'Why will the speakers bring sandwiches and fruit?',
        options: [
          'Because open fires are banned in the park.',
          'Because there is no shop on the way.',
          'Because they want to save money.',
          'Because sandwiches are healthier than fires.',
        ],
        answerIndex: 0,
        explanation:
          '由 "open fires are banned, so we should bring sandwiches and fruit instead" 可知公园禁止明火，只能自带食物，故选 A。',
      },
      {
        id: 'u8-l2-3',
        type: 'inference',
        stem: 'What are the speakers mainly doing?',
        options: [
          'Making a plan for a weekend hike.',
          'Complaining about the closed trail.',
          'Learning how to cook outdoors.',
          'Discussing their homework.',
        ],
        answerIndex: 0,
        explanation:
          '两人商量周六去绿湖公园徒步的路线、午餐与集合时间，可推知他们在制定周末徒步计划，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8Listenings;
