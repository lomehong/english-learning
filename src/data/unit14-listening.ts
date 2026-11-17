import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修四 Unit 4（Sharing）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 4 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit14Listenings: ListeningMaterial[] = [
  {
    id: 'u14-l1',
    title: 'A Volunteer Programme on the Radio',
    genre: '独白',
    script: [
      'Hello, everyone. Here is the campus radio with our weekly volunteer programme.',
      'This Saturday, twenty volunteers will visit the mountain school again to donate books and distribute food to the families there.',
      'A doctor from the city hospital will join us and operate a small clinic for the old people in the village.',
      'We still need three students who can sew, because the tailor club wants to make winter hats for the children.',
      'If you would like to share your time, please call eight eight five three two one before Friday noon. Thank you.',
    ],
    questions: [
      {
        id: 'u14-l1-1',
        type: 'detail',
        stem: 'What will the volunteers do this Saturday?',
        options: [
          'Donate books and distribute food.',
          'Build a new school library.',
          'Clean the city hospital.',
          'Plant trees by the river.',
        ],
        answerIndex: 0,
        explanation:
          '由 "donate books and distribute food to the families there" 可知志愿者将捐书并分发食品，故选 A。',
      },
      {
        id: 'u14-l1-2',
        type: 'detail',
        stem: 'Why does the programme need students who can sew?',
        options: [
          'To make winter hats for the children.',
          'To repair the old radio station.',
          'To design clothes for a show.',
          'To teach sewing to the doctor.',
        ],
        answerIndex: 0,
        explanation:
          '由 "the tailor club wants to make winter hats for the children" 可知需要会缝纫的同学为孩子们做冬帽，故选 A。',
      },
      {
        id: 'u14-l1-3',
        type: 'detail',
        stem: 'When is the deadline for signing up?',
        options: ['Before Friday noon.', 'On Saturday morning.', 'Next Wednesday.', 'After the trip.'],
        answerIndex: 0,
        explanation:
          '由 "please call…before Friday noon" 可知报名截止于周五中午之前，故选 A。',
      },
    ],
  },
  {
    id: 'u14-l2',
    title: 'Joining the Sharing Club',
    genre: '对话',
    script: [
      'M: Emma, I hear you have joined the Sharing Club. What do members do there?',
      'W: We collect old books and clothes, and then distribute them to people in remote villages.',
      'M: That sounds meaningful. Do you need any money to run the club?',
      'W: A little. The finance comes from small donations, and we discuss how to use it at a weekly meeting.',
      'M: I see. I have some picture books at home. Can I donate them?',
      'W: Of course. Bring them to our classroom this Thursday, and the members will do the paperwork for you.',
      'M: Great, I will. Thank you, Emma.',
    ],
    questions: [
      {
        id: 'u14-l2-1',
        type: 'detail',
        stem: 'What do the members of the Sharing Club do?',
        options: [
          'They collect old books and clothes for people in remote villages.',
          'They sell school books at low prices.',
          'They clean the classroom every week.',
          'They write reports for the newspaper.',
        ],
        answerIndex: 0,
        explanation:
          '由 "We collect old books and clothes, and then distribute them to people in remote villages" 可知俱乐部收集旧书旧衣分发给偏远乡村的人，故选 A。',
      },
      {
        id: 'u14-l2-2',
        type: 'detail',
        stem: 'Where does the money of the club come from?',
        options: [
          'Small donations.',
          'The school library.',
          'The village school.',
          'A rich businessman abroad.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The finance comes from small donations" 可知经费来自小额捐款，故选 A。',
      },
      {
        id: 'u14-l2-3',
        type: 'inference',
        stem: 'What is the man\u2019s attitude towards the club?',
        options: ['Supportive.', 'Doubtful.', 'Uninterested.', 'Worried.'],
        answerIndex: 0,
        explanation:
          '男生表示“That sounds meaningful”并主动提出捐出自己的图画书，可推知他持支持态度，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit14Listenings;
