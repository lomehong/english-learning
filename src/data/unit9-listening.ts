import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修二 Unit 4（History and Traditions）主题听力材料 ×2。
 * 文本为自编原创（词汇复用本单元词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit9Listenings: ListeningMaterial[] = [
  {
    id: 'u9-l1',
    title: 'A Student Guide in the Town Museum',
    genre: '独白',
    script: [
      'Hello, everyone. I\u2019m Li Ming, a student guide of the town museum. Our town was built beside the castle eight hundred years ago. In the museum, you can see arms used in a great battle and poems written by local poets. The most interesting hall is about the philosopher who taught in our town. His ideas about family and study still influence every generation. After the visit, don\u2019t forget the food street. Warm pancakes are served there, and visitors are greeted with tea. Enjoy your stay!',
    ],
    questions: [
      {
        id: 'u9-l1-1',
        type: 'detail',
        stem: 'What is the most interesting hall in the museum about?',
        options: [
          'A great battle long ago.',
          'Local poets and their poems.',
          'The philosopher who taught in the town.',
          'The food street and its pancakes.',
        ],
        answerIndex: 2,
        explanation:
          '由 "The most interesting hall is about the philosopher who taught in our town" 可知，最有趣的展厅介绍的是曾在镇上讲学的那位哲学家，故选 C；A、B 是其他展品，D 与展厅无关。',
      },
      {
        id: 'u9-l1-2',
        type: 'detail',
        stem: 'How are visitors treated on the food street?',
        options: [
          'They are greeted with tea.',
          'They are given free pancakes.',
          'They are invited to cook meals.',
          'They are shown old poems.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Warm pancakes are served there, and visitors are greeted with tea" 可知，美食街上游客会受到敬茶礼遇，故选 A；B 是"有热煎饼供应"而非免费赠送，C、D 未提及。',
      },
      {
        id: 'u9-l1-3',
        type: 'inference',
        stem: 'What can we learn about the philosopher\u2019s ideas?',
        options: [
          'They are out of date today.',
          'They still influence people today.',
          'They were refused by local people.',
          'They were only about cooking food.',
        ],
        answerIndex: 1,
        explanation:
          '由 "His ideas about family and study still influence every generation" 可推知，这位思想家的观念至今仍影响着每一代人，故选 B；A、C、D 均与独白不符。',
      },
    ],
  },
  {
    id: 'u9-l2',
    title: 'A Visit to Grandpa\u2019s Village',
    genre: '对话',
    script: [
      'Kate: Where did you go during the holiday, Chen Jie?',
      'Chen Jie: I visited my grandpa\u2019s village in the mountains.',
      'Kate: That sounds great! What impressed you most?',
      'Chen Jie: The welcoming custom. Every family greets guests with tea, and at the harvest feast, the whole village eats together.',
      'Kate: Wonderful! Did you learn about the village\u2019s past?',
      'Chen Jie: Yes. A poet lived there, and the old theatre stages his plays. Grandpa said six generations of our family have watched them.',
      'Kate: How I wish to join you!',
    ],
    questions: [
      {
        id: 'u9-l2-1',
        type: 'detail',
        stem: 'What impressed Chen Jie most in the village?',
        options: [
          'The welcoming custom.',
          'The old stone houses.',
          'The food street pancakes.',
          'The museum of the kingdom.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The welcoming custom. Every family greets guests with tea…" 可知，给陈杰留下最深印象的是村子的迎客习俗，故选 A；B、C、D 均未在对话中提及。',
      },
      {
        id: 'u9-l2-2',
        type: 'detail',
        stem: 'What did Grandpa say about the poet\u2019s plays?',
        options: [
          'They were written last year.',
          'They are staged in a new theatre.',
          'Six generations of the family have watched them.',
          'They tell stories about Kate\u2019s family.',
        ],
        answerIndex: 2,
        explanation:
          '由 "Grandpa said six generations of our family have watched them" 可知，爷爷说家族六代人都看过这些戏，故选 C；A 与诗人的年代不符，B 与 "the old theatre" 矛盾，D 无关。',
      },
      {
        id: 'u9-l2-3',
        type: 'inference',
        stem: 'What can we learn about the village from the conversation?',
        options: [
          'It is famous for modern buildings.',
          'People there still keep many old traditions.',
          'Visitors are not welcome in the village.',
          'The village has a very short history.',
        ],
        answerIndex: 1,
        explanation:
          '对话提到村子有千年历史、敬茶迎客、全村共享丰收宴、老戏台代代演戏，可推知村里仍保留着许多古老传统，故选 B；A、C、D 均与对话内容不符。',
      },
    ],
  },
];

const materialById = new Map(unit9Listenings.map((m) => [m.id, m]));

export function getListening(id: string): ListeningMaterial | undefined {
  return materialById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9Listenings;
