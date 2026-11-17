import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修一 Unit 2（Travelling Around）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 2 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 * id 约定：u2- 前缀标识 Unit 2（错题本/学习报告按前缀归入单元维度）。
 */

export const unit2Listenings: ListeningMaterial[] = [
  {
    id: 'u2-l1',
    title: 'Getting Ready for London',
    genre: '独白',
    script: [
      "Hi, I'm Wang Fang. My family and I are getting ready for a trip to London.",
      'We have already applied for our visas and booked the flights online. Dad has rented a small flat near the city centre, because hotels there are too expensive.',
      "Last night at eight, Mum and I were packing our suitcases while Dad was checking the weather in London. I can't wait to see the amazing view from the London Eye!",
    ],
    questions: [
      {
        id: 'u2-l1-1',
        type: 'detail',
        stem: 'What has Dad already done for the trip?',
        options: [
          'He has applied for the visas.',
          'He has rented a flat near the city centre.',
          'He has booked an English-speaking guide.',
          'He has packed the suitcases.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Dad has rented a small flat near the city centre" 可知，爸爸租好了市中心附近的公寓，故选 B；签证是全家一起申请的，打包是妈妈和说话人昨晚在做的事，导游原文未提及。',
      },
      {
        id: 'u2-l1-2',
        type: 'detail',
        stem: 'What were Mum and the speaker doing at eight last night?',
        options: ['Checking the weather.', 'Booking the flights.', 'Packing the suitcases.', 'Looking for a hotel.'],
        answerIndex: 2,
        explanation:
          '由 "Last night at eight, Mum and I were packing our suitcases while Dad was checking the weather" 可知，昨晚八点妈妈和说话人正在收拾行李箱，查天气的是爸爸，故选 C。',
      },
      {
        id: 'u2-l1-3',
        type: 'inference',
        stem: 'How does the speaker feel about the trip?',
        options: ['Worried about the weather.', 'Bored with the preparations.', 'Excited about the visit.', 'Sorry that the hotels are full.'],
        answerIndex: 2,
        explanation:
          '结尾 "I can\u2019t wait to see the amazing view from the London Eye!"（我等不及想看伦敦眼的美景了）表现出期待兴奋的心情，故选 C；A、B、D 均与独白语气不符。',
      },
    ],
  },
  {
    id: 'u2-l2',
    title: 'Talking about a Trip to Xi\u2019an',
    genre: '对话',
    script: [
      'Mike: Hi, Laura. Any good news?',
      "Laura: Yes! We are going to Xi'an next Friday to see the Terracotta Warriors.",
      'Mike: Great! Have you booked the train tickets yet?',
      'Laura: Not yet. Mum was booking online last night, but the website was slow, so she will try again tonight.',
      'Mike: What about a guide? The museum is a historical site.',
      'Laura: Dad has already sent the museum a request for an English-speaking guide.',
      'Mike: Perfect. And take some cash — small shops there don\u2019t take credit cards.',
      'Laura: Thanks! I will.',
    ],
    questions: [
      {
        id: 'u2-l2-1',
        type: 'detail',
        stem: 'When is Laura going to Xi\u2019an?',
        options: ['Next Friday.', 'Tomorrow morning.', 'Tonight.', 'Next month.'],
        answerIndex: 0,
        explanation:
          'Laura 说 "We are going to Xi\u2019an next Friday"，可知他们下周五出发去西安，故选 A；tonight 是妈妈今晚再试订票的时间，其余选项与对话不符。',
      },
      {
        id: 'u2-l2-2',
        type: 'detail',
        stem: 'Why didn\u2019t Mum finish booking the tickets last night?',
        options: [
          'The tickets were sold out.',
          'The website was too slow.',
          'Laura asked her to stop.',
          'Dad wanted to fly there instead.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Mum was booking them online last night, but the website was slow, so she will try again tonight" 可知，昨晚网站太慢没订完，今晚再试，故选 B；A、C、D 均未提及。',
      },
      {
        id: 'u2-l2-3',
        type: 'inference',
        stem: 'What can we learn from the conversation?',
        options: [
          'Dad has asked the museum for an English-speaking guide.',
          'Laura will pay by credit card in small shops.',
          'Mike has visited the Terracotta Warriors twice.',
          'The family will fly to Xi\u2019an next week.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Dad has already sent the museum a request for an English-speaking guide" 可知，爸爸已向博物馆提出需要英文讲解员，故选 A；B 与 "small shops there don\u2019t take credit cards" 矛盾，C、D 对话中均无依据。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit2Listenings;