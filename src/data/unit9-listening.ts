import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修一 Unit 4（Body Language）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 4 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit9Listenings: ListeningMaterial[] = [
  {
    id: 'u9-l1',
    title: 'Tips for Your First Speech',
    genre: '独白',
    script: [
      'Good afternoon, everyone. Since many of you will give your first English speech next week, here are three tips on body language.',
      'First, keep your back straight and do not fold your arms, because crossed arms make you look nervous and unfriendly.',
      'Second, look at your audience with a slight smile. Appropriate eye contact shows that you are honest and confident.',
      'Finally, use open hand gestures to support your words. Practise in front of a mirror, and your body will speak as well as your voice.',
    ],
    questions: [
      {
        id: 'u9-l1-1',
        type: 'detail',
        stem: 'Why should speakers avoid folding their arms?',
        options: [
          'Because crossed arms make them look nervous and unfriendly.',
          'Because folded arms cause pain during long speeches.',
          'Because the teacher will punish them for that.',
          'Because crossed arms are only used by actors.',
        ],
        answerIndex: 0,
        explanation:
          '由 "crossed arms make you look nervous and unfriendly" 可知抱臂会显得紧张而不友好，故选 A。',
      },
      {
        id: 'u9-l1-2',
        type: 'detail',
        stem: 'What does appropriate eye contact show, according to the speaker?',
        options: [
          'Honesty and confidence.',
          'Tiredness and illness.',
          'Anger and disagreement.',
          'Boredom with the topic.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Appropriate eye contact shows that you are honest and confident" 可知恰当的眼神交流体现真诚与自信，故选 A。',
      },
      {
        id: 'u9-l1-3',
        type: 'detail',
        stem: 'What does the speaker suggest doing in front of a mirror?',
        options: ['Practising hand gestures.', 'Checking the hair.', 'Reading the notes aloud.', 'Taking photos.'],
        answerIndex: 0,
        explanation:
          '由 "Practise in front of a mirror, and your body will speak as well as your voice" 可知建议对着镜子练习手势等身势语，故选 A。',
      },
    ],
  },
  {
    id: 'u9-l2',
    title: 'A Confusing Gesture',
    genre: '对话',
    script: [
      'W: Jack, look at this photo from our exchange visit. Why is that student making a circle with her thumb and fingers?',
      'M: Oh, that is very common here. It is a friendly sign of approval.',
      'W: Really? In my hometown, the same gesture means money, and my grandfather uses it to talk about prices.',
      'M: Interesting! Body language really varies from place to place. Once my cousin used another sign abroad, and people there thought he was asking for food.',
      'W: Then we should be careful with our hands when travelling.',
      'M: Exactly. When in doubt, a simple smile is understood almost everywhere.',
    ],
    questions: [
      {
        id: 'u9-l2-1',
        type: 'detail',
        stem: 'What does the circle gesture mean in the man\u2019s area?',
        options: [
          'A friendly sign of approval.',
          'A request for money.',
          'A warning of danger.',
          'A call for a teacher.',
        ],
        answerIndex: 0,
        explanation:
          '由 "It is a friendly sign of approval" 可知在男士所在地区这个手势表示赞许，故选 A。',
      },
      {
        id: 'u9-l2-2',
        type: 'detail',
        stem: 'What does the same gesture mean in the woman\u2019s hometown?',
        options: ['Money.', 'Food.', 'Danger.', 'Goodbye.'],
        answerIndex: 0,
        explanation:
          '由 "the same gesture means money, and my grandfather uses it to talk about prices" 可知在女士家乡这一手势指钱，故选 A。',
      },
      {
        id: 'u9-l2-3',
        type: 'inference',
        stem: 'What do the speakers finally agree on?',
        options: [
          'A smile is understood in most cultures.',
          'Hand gestures should never be used.',
          'Photos often cause misunderstandings.',
          'Travelling abroad is too difficult.',
        ],
        answerIndex: 0,
        explanation:
          '对话结尾男士说 "a simple smile is understood almost everywhere"，女士表示认同，可推知他们都认可微笑的通用性，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9Listenings;
