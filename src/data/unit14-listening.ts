import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修二 Unit 4（Journey Across a Vast Land）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 4 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit14Listenings: ListeningMaterial[] = [
  {
    id: 'u14-l1',
    title: 'Welcome Aboard the Rocky Express',
    genre: '独白',
    script: [
      'Good morning, ladies and gentlemen. Welcome aboard the Rocky Express, and thank you for choosing rail travel across this vast land.',
      'Our train left the station by the bay on time, and we are now moving towards the continental border at a steady speed. The whole journey in our carriage takes about nine hours.',
      'On the way, you will see some of the most spectacular scenery in the country: mountains covered with snow, golden maple trees, and rare wildlife such as bears and eagles. If you are lucky at dusk, you may watch the sun going down behind the hills — it is truly breathtaking.',
      'Our photographer will be happy to help you find the best views from the observation car, and there is also an antique shop in the urban district near our final stop.',
      'We will proceed to the dining car at noon. Please enjoy your trip and have a wonderful day.',
    ],
    questions: [
      {
        id: 'u14-l1-1',
        type: 'detail',
        stem: 'Where did the train start its journey?',
        options: [
          'From a station by the bay.',
          'From an ancient mountain village.',
          'From a museum in the city centre.',
          'From a small town near the border.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Our train left the station by the bay on time" 可知列车从海湾边的车站出发，故选 A。',
      },
      {
        id: 'u14-l1-2',
        type: 'detail',
        stem: 'What can passengers possibly see at dusk according to the speaker?',
        options: [
          'A street market in an urban district.',
          'The sun going down behind the hills.',
          'A display of antiques in the shop.',
          'Fireworks over the bay.',
        ],
        answerIndex: 1,
        explanation:
          '由 "If you are lucky at dusk, you may watch the sun going down behind the hills" 可知黄昏时可能看到落日沉入群山之后，故选 B。',
      },
      {
        id: 'u14-l1-3',
        type: 'inference',
        stem: 'What do we know about the trip from the announcement?',
        options: [
          'It lasts about nine hours in total.',
          'It will arrive before noon.',
          'It has been delayed by heavy snow.',
          'It only passes through urban areas.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The whole journey in our carriage takes about nine hours" 可知全程约九小时，故选 A。',
      },
    ],
  },
  {
    id: 'u14-l2',
    title: 'Planning the Summer Trip',
    genre: '对话',
    script: [
      'M: Lucy, have you decided where to go for the summer holiday? My family has been planning a trip across Canada.',
      'W: Really? That sounds exciting! How will you travel such a long distance?',
      'M: Mostly by rail. We will take the train from Vancouver to Toronto, so we can enjoy the breathtaking views along the way.',
      'W: Great idea. My cousin went there last autumn. She said the highlight of her journey was watching wildlife in the provincial park at dusk.',
      'M: Then I will bring my camera. My uncle is a photographer, and he has taught me how to take pictures of maple trees.',
      'W: Remember to book the tickets early. The departure time in July is very popular, and the seats sell out quickly.',
      'M: Thanks for reminding me. I can hardly wait to wander around the old streets of Montreal.',
    ],
    questions: [
      {
        id: 'u14-l2-1',
        type: 'detail',
        stem: 'How will the boy\u2019s family mainly travel across Canada?',
        options: [
          'By plane.',
          'By rail.',
          'By car.',
          'By ship.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Mostly by rail. We will take the train from Vancouver to Toronto" 可知一家人主要乘火车横穿加拿大，故选 B。',
      },
      {
        id: 'u14-l2-2',
        type: 'detail',
        stem: 'What was the highlight of Lucy\u2019s cousin\u2019s journey?',
        options: [
          'Watching wildlife in the provincial park at dusk.',
          'Buying antiques in a small town.',
          'Swimming in the bay at sunrise.',
          'Climbing the highest mountain there.',
        ],
        answerIndex: 0,
        explanation:
          '由 "the highlight of her journey was watching wildlife in the provincial park at dusk" 可知她表姐旅途最精彩的部分是黄昏时在省立公园观野生动物，故选 A。',
      },
      {
        id: 'u14-l2-3',
        type: 'inference',
        stem: 'Why does Lucy advise booking tickets early?',
        options: [
          'The price will rise in August.',
          'Her cousin works at the station.',
          'July departures are popular and sell out fast.',
          'The train only runs once a week.',
        ],
        answerIndex: 2,
        explanation:
          '由 "The departure time in July is very popular, and the seats sell out quickly" 可推知七月出发的班次热门、座位很快售罄，应尽早订票，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit14Listenings;
