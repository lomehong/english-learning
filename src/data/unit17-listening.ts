import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修二 Unit 2（Wildlife Protection）主题听力材料 ×2。
 * 文本为自编原创（词汇复用本单元词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit7Listenings: ListeningMaterial[] = [
  {
    id: 'u17-l1',
    title: 'Watching Cranes in Winter',
    genre: '独白',
    script: [
      'Hello, I\u2019m Wang Fang, a member of the wildlife club. Every winter, our club visits the reserve in the mountains to observe black-necked cranes. Early in the morning, we hide near the lake and count the birds with telescopes. The population has grown from two hundred to more than five hundred in ten years. Rangers say strict laws are the most effective measure against hunting. Although it is cold on the mountain, seeing those wild birds fly freely is the best reward for us.',
    ],
    questions: [
      {
        id: 'u17-l1-1',
        type: 'detail',
        stem: 'When does the club visit the reserve?',
        options: [
          'Every spring.',
          'Every winter.',
          'Every Saturday morning.',
          'Every two years.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Every winter, our club visits the reserve in the mountains" 可知，社团每年冬天去保护区，故选 B；其余选项与独白不符。',
      },
      {
        id: 'u17-l1-2',
        type: 'detail',
        stem: 'How has the crane population changed in ten years?',
        options: [
          'It has dropped to two hundred.',
          'It has stayed the same.',
          'It has grown to more than five hundred.',
          'It has doubled to one thousand.',
        ],
        answerIndex: 2,
        explanation:
          '由 "The population has grown from two hundred to more than five hundred in ten years" 可知，十年间种群数量从两百增长到五百多，故选 C；A 数字颠倒，B、D 与原文不符。',
      },
      {
        id: 'u17-l1-3',
        type: 'inference',
        stem: 'How does the speaker feel about the cold mountain work?',
        options: [
          'It is boring and tiring.',
          'It is well paid and easy.',
          'It is not worth the trouble.',
          'It is rewarding and enjoyable.',
        ],
        answerIndex: 3,
        explanation:
          '结尾 "seeing those wild birds fly freely is the best reward for us" 表明尽管山上寒冷，看到野鸟自由飞翔就是最好的回报，可推知说话者觉得这份工作值得且快乐，故选 D。',
      },
    ],
  },
  {
    id: 'u17-l2',
    title: 'Talking about Tigers',
    genre: '对话',
    script: [
      'Tom: Hi, Lin. I read a report about tigers in danger of extinction.',
      'Lin: That\u2019s true. Hunters shot them for fur in the past, and their habitat is getting smaller.',
      'Tom: What is being done now?',
      'Lin: A new reserve is being built, and rangers patrol it every day.',
      'Tom: Great! Are the numbers recovering?',
      'Lin: Yes. Scientists say the population is growing, and the measures seem effective.',
      'Tom: Then our class can do something, like spreading the knowledge online.',
      'Lin: Good idea! Protecting wildlife needs everyone\u2019s effort.',
    ],
    questions: [
      {
        id: 'u17-l2-1',
        type: 'detail',
        stem: 'Why were tigers hunted in the past?',
        options: [
          'For their fur.',
          'For their meat.',
          'For safety reasons.',
          'For medical research.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Hunters shot them for fur in the past" 可知，过去猎人为了毛皮而猎杀老虎，故选 A；B、C、D 对话均未提及。',
      },
      {
        id: 'u17-l2-2',
        type: 'detail',
        stem: 'What is being done to protect tigers now?',
        options: [
          'They are being kept in city zoos.',
          'A new reserve is being built and patrolled.',
          'They are being fed by volunteers.',
          'Old forests are being cut down.',
        ],
        answerIndex: 1,
        explanation:
          '由 "A new reserve is being built in the south, and rangers patrol it every day" 可知，正在南方建新保护区并每日巡护，故选 B；A、C 未提及，D 与保护方向相反。',
      },
      {
        id: 'u17-l2-3',
        type: 'inference',
        stem: 'What will the two speakers probably do next?',
        options: [
          'Visit the new reserve in the south.',
          'Write a report about hunters.',
          'Spread wildlife knowledge online with their class.',
          'Buy winter coats made of fur.',
        ],
        answerIndex: 2,
        explanation:
          'Tom 提议 "our class can do something, like spreading the knowledge online"，Lin 回应 "Good idea!"，可推知他们接下来会在班里开展线上宣传，故选 C；A、B 未提及，D 与保护立场相反。',
      },
    ],
  },
];

const materialById = new Map(unit7Listenings.map((m) => [m.id, m]));

export function getListening(id: string): ListeningMaterial | undefined {
  return materialById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7Listenings;
