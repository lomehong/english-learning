import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修二 Unit 1（Cultural Heritage）主题听力材料 ×2。
 * 文本为自编原创（词汇复用本单元词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit6Listenings: ListeningMaterial[] = [
  {
    id: 'u16-l1',
    title: 'A Visit to the History Museum',
    genre: '独白',
    script: [
      'Good morning, everyone. I\u2019m Lin Tao from the school heritage club. Last weekend, we visited the history museum. A professional guide showed us around and taught us how experts document newly found relics. We learned that every piece must be photographed and numbered before it is moved. In the afternoon, our team conducted a survey among visitors about protecting local heritage. Most people said they were glad to donate money for the repair of the old city gate. It was a truly meaningful day.',
    ],
    questions: [
      {
        id: 'u16-l1-1',
        type: 'detail',
        stem: 'What did the professional guide teach the students?',
        options: [
          'How to take photos of visitors.',
          'How experts document newly found relics.',
          'How to repair the old city gate.',
          'How to number the museum rooms.',
        ],
        answerIndex: 1,
        explanation:
          '由 "A professional guide showed us around and taught us how experts document newly found relics" 可知，讲解员教大家专家如何记录新发现的文物，故选 B；A、C、D 均与原文不符。',
      },
      {
        id: 'u16-l1-2',
        type: 'detail',
        stem: 'What did the team do in the afternoon?',
        options: [
          'They repaired the city gate.',
          'They cleaned the museum halls.',
          'They conducted a survey among visitors.',
          'They photographed every old coin.',
        ],
        answerIndex: 2,
        explanation:
          '由 "In the afternoon, our team conducted a survey among visitors" 可知，下午团队在参观者中做了调查，故选 C；A 是大家愿意捐款支持的对象而非当天所为，B、D 未提及。',
      },
      {
        id: 'u16-l1-3',
        type: 'inference',
        stem: 'What can we learn about most visitors from the monologue?',
        options: [
          'They refused to answer the survey.',
          'They were willing to donate money for repairs.',
          'They thought the museum was boring.',
          'They wanted to move the city gate away.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Most people said they were glad to donate money for the repair of the old city gate" 可推知，大多数参观者愿意为修缮捐款，故选 B；A、C、D 均与独白内容不符。',
      },
    ],
  },
  {
    id: 'u16-l2',
    title: 'Talking about an Old Temple',
    genre: '对话',
    script: [
      'Li Hua: Hi, Amy. Have you heard about the old temple on East Mountain?',
      'Amy: Yes. Its walls are in danger.',
      'Li Hua: A committee has made a proposal to repair it, but the work costs a lot.',
      'Amy: That\u2019s why our school is asking students to contribute. I\u2019ll donate my pocket money.',
      'Li Hua: Great idea! The plan keeps the temple where it is.',
      'Amy: Good. We should preserve it and promote its story online.',
      'Li Hua: I agree. Protecting heritage starts with small steps.',
    ],
    questions: [
      {
        id: 'u16-l2-1',
        type: 'detail',
        stem: 'What problem does the old temple have?',
        options: [
          'Its walls are in danger.',
          'It was moved down the mountain.',
          'It is closed to all visitors.',
          'It has too many tourists.',
        ],
        answerIndex: 0,
        explanation:
          '由 Amy 所说 "It was built eight hundred years ago, and its walls are in danger" 可知，古庙的墙体告急，故选 A；B 与 "The plan keeps the temple where it is" 矛盾，C、D 对话未提及。',
      },
      {
        id: 'u16-l2-2',
        type: 'detail',
        stem: 'How will Amy help with the repair work?',
        options: [
          'By giving her pocket money.',
          'By writing news reports online.',
          'By working on the walls herself.',
          'By selling old books at school.',
        ],
        answerIndex: 0,
        explanation:
          '由 "I\u2019ll donate my pocket money" 可知，Amy 打算捐出自己的零花钱，故选 A；B 是两人提及的"宣传古庙故事"的普遍号召而非 Amy 的具体做法，C、D 未提及。',
      },
      {
        id: 'u16-l2-3',
        type: 'inference',
        stem: 'What do the two speakers agree on at the end of the conversation?',
        options: [
          'The temple should be rebuilt downtown.',
          'Students should not spend money on repairs.',
          'Protecting heritage starts with small steps.',
          'The committee should give up the proposal.',
        ],
        answerIndex: 2,
        explanation:
          '结尾 Li Hua 说 "Protecting heritage starts with small steps"，Amy 此前表示 "We should preserve it and promote its story online"，两人均认同从小事做起保护遗产，故选 C；A、B、D 均与对话内容不符。',
      },
    ],
  },
];

const materialById = new Map(unit6Listenings.map((m) => [m.id, m]));

export function getListening(id: string): ListeningMaterial | undefined {
  return materialById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6Listenings;
