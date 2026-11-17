import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修二 Unit 3（Food and Culture）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 3 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit13Listenings: ListeningMaterial[] = [
  {
    id: 'u13-l1',
    title: 'A Talk on Healthy Eating',
    genre: '独白',
    script: [
      'Good afternoon, boys and girls. As we all know, food is a fundamental part of our culture, but today I want to talk about how to eat in a healthy way.',
      'First, it is ideal to keep the quantity of each meal moderate. If you eat too much fried food, you may lose your appetite for vegetables and fruit, which provide the vitamins that our bodies need.',
      'Second, doctors suggest that we chew slowly and carefully. Eating in a hurry is bad for the stomach, while slow chewing helps you enjoy the true flavour of the dishes.',
      'Finally, remember the old principle: breakfast like a king, lunch like a prince, and dinner like a poor man. A balanced diet consists of grain, vegetables, protein and fruit, and dessert should only be a small part of it.',
      'Follow these suggestions, and you will stay energetic in class every day. Thank you for listening.',
    ],
    questions: [
      {
        id: 'u13-l1-1',
        type: 'detail',
        stem: 'What does the speaker think is ideal for each meal?',
        options: [
          'Eating as much as possible.',
          'Keeping the quantity moderate.',
          'Having dessert at every meal.',
          'Skipping breakfast on busy days.',
        ],
        answerIndex: 1,
        explanation:
          '由 "it is ideal to keep the quantity of each meal moderate" 可知说话人认为每餐食量适中才理想，故选 B。',
      },
      {
        id: 'u13-l1-2',
        type: 'detail',
        stem: 'Why does the speaker suggest chewing slowly?',
        options: [
          'To finish the meal more quickly.',
          'To save money on food.',
          'To protect the stomach and enjoy the flavour.',
          'To leave room for more dessert.',
        ],
        answerIndex: 2,
        explanation:
          '由 "eating in a hurry is bad for the stomach, while slow chewing helps you enjoy the true flavour" 可知细嚼慢咽既保护肠胃又能品味菜肴风味，故选 C。',
      },
      {
        id: 'u13-l1-3',
        type: 'inference',
        stem: 'Who is the most likely speaker?',
        options: [
          'A tour guide at a museum.',
          'A school doctor giving a health talk.',
          'A chef advertising a restaurant.',
          'A farmer selling fresh fruit.',
        ],
        answerIndex: 1,
        explanation:
          '说话人面向学生（boys and girls）讲解健康饮食原则并祝愿大家课堂精力充沛，可推知最可能是校医在做健康讲座，故选 B。',
      },
    ],
  },
  {
    id: 'u13-l2',
    title: 'Cooking Dinner for Grandma',
    genre: '对话',
    script: [
      'W: Dad, Grandma is coming for dinner tonight. Shall we cook something special for her?',
      'M: Good idea. She loves Chinese cuisine, especially steamed fish. Let me check the recipe first.',
      'W: Here it is. We need fresh fish, ginger, and a little oil. Do we have all the ingredients in the fridge?',
      'M: Almost. We still need to buy some pepper. Remember, Grandma cannot eat anything spicy, so no chilli this time.',
      'W: OK. I will slice the ginger while you steam the fish. What about dessert?',
      'M: Let us make a fruit salad. Prior to dinner, we can also prepare a mild soup so the whole meal tastes balanced.',
      'W: Perfect. Cooking for family must be the sweetest part of our food culture.',
    ],
    questions: [
      {
        id: 'u13-l2-1',
        type: 'detail',
        stem: 'What do the speakers decide to cook for Grandma?',
        options: [
          'Fried chicken with chilli.',
          'Steamed fish and a fruit salad.',
          'Italian noodles and ice cream.',
          'Spicy hot pot with beef.',
        ],
        answerIndex: 1,
        explanation:
          '由 "She loves Chinese cuisine, especially steamed fish" 与后面 "Let us make a fruit salad" 可知两人决定清蒸鱼配水果沙拉，故选 B。',
      },
      {
        id: 'u13-l2-2',
        type: 'detail',
        stem: 'Why will the speakers not use any chilli?',
        options: [
          'Grandma cannot eat spicy food.',
          'The shop has sold out of chilli.',
          'Dad dislikes hot flavours.',
          'The recipe forbids chilli.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Grandma cannot eat anything spicy, so no chilli this time" 可知因为奶奶不能吃辣所以不放辣椒，故选 A。',
      },
      {
        id: 'u13-l2-3',
        type: 'inference',
        stem: 'What will the girl probably do next?',
        options: [
          'Watch a cooking show on TV.',
          'Set the table for the meal.',
          'Slice the ginger for the fish.',
          'Call Grandma to change the plan.',
        ],
        answerIndex: 2,
        explanation:
          '由 "I will slice the ginger while you steam the fish" 可推知女孩接下来会负责切姜，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit13Listenings;
