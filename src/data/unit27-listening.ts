import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修三 Unit 2（Healthy Lifestyle）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 2 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit27Listenings: ListeningMaterial[] = [
  {
    id: 'u27-l1',
    title: 'Three Small Habits for Health',
    genre: '独白',
    script: [
      'Good afternoon, everyone. Today I will share three small habits that protect your health.',
      'First, drink water instead of sugary drinks, and add more fruit and vegetables to every meal.',
      'Second, go to bed before ten, because good sleep keeps your mind clear and your body strong.',
      'Third, take a short walk after dinner, and do not sit for hours playing with your phone.',
      'If you follow these steps, you will feel more energetic within weeks. Thank you for listening.',
    ],
    questions: [
      {
        id: 'u27-l1-q1',
        type: 'detail',
        stem: 'What is the first habit mentioned?',
        options: [
          'Drinking water instead of sugary drinks.',
          'Going to bed before ten.',
          'Taking a walk after dinner.',
          'Doing morning exercise.',
        ],
        answerIndex: 0,
        explanation:
          '讲话者第一条建议是用水代替含糖饮料并多吃水果蔬菜，故选 A；B 是第二条，C 是第三条，D 未提及。',
      },
      {
        id: 'u27-l1-q2',
        type: 'detail',
        stem: 'Why should we go to bed before ten?',
        options: [
          'Because good sleep keeps the mind clear and body strong.',
          'Because the library closes at ten.',
          'Because night classes start early.',
          'Because doctors say phones are free at night.',
        ],
        answerIndex: 0,
        explanation:
          '由 "good sleep keeps your mind clear and your body strong" 可知早睡能让头脑清醒、身体强健，故选 A；B、C、D 均无依据。',
      },
      {
        id: 'u27-l1-q3',
        type: 'inference',
        stem: 'Who is most probably the speaker?',
        options: [
          'A waiter in a restaurant.',
          'A teacher giving a health talk.',
          'A bus driver.',
          'A shop owner.',
        ],
        answerIndex: 1,
        explanation:
          '讲话者面向大家分享健康习惯并以 Thank you for listening 结尾，可推知是一位作健康讲座的老师，故选 B；其余身份与场景不符。',
      },
    ],
  },
  {
    id: 'u27-l2',
    title: 'A Talk About Change',
    genre: '对话',
    script: [
      'M: You look tired these days, Kate. What is wrong?',
      'W: I stay up late to study, and I drink three cups of coffee every evening.',
      'M: That sounds unhealthy. Too much coffee may hurt your sleep.',
      'W: You are right. I want to change, but I do not know how to start.',
      'M: Why not join me? I jog in the park every morning at seven.',
      'W: Sounds great. I will cut down on coffee and go to bed earlier.',
      'M: Great. Small steps lead to big changes.',
    ],
    questions: [
      {
        id: 'u27-l2-q1',
        type: 'detail',
        stem: 'What does Kate do every evening?',
        options: [
          'She jogs in the park.',
          'She watches films.',
          'She drinks three cups of coffee.',
          'She cooks big dinners.',
        ],
        answerIndex: 2,
        explanation:
          '由 "I drink three cups of coffee every evening" 可知 Kate 每晚要喝三杯咖啡，故选 C；晨跑是男士的建议，不是她现在的习惯。',
      },
      {
        id: 'u27-l2-q2',
        type: 'detail',
        stem: 'What does the man invite Kate to do?',
        options: [
          'To join his morning jogging.',
          'To take piano lessons.',
          'To work in a park.',
          'To buy new shoes.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Why not join me? I jog in the park every morning at seven" 可知男士邀请 Kate 一起晨跑，故选 A；B、C、D 均未提及。',
      },
      {
        id: 'u27-l2-q3',
        type: 'inference',
        stem: 'What will Kate probably do next?',
        options: [
          'Change her habits step by step.',
          'Drink more coffee than before.',
          'Give up her studies.',
          'Stay up later than usual.',
        ],
        answerIndex: 0,
        explanation:
          'Kate 表示将少喝咖啡、早点睡觉并接受晨跑邀请，可推知她会逐步改变生活习惯，故选 A；B、C、D 与她的决定相反。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit27Listenings;
