import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修一 Unit 4（Body Language）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 4 词表），避免任何教材原文版权问题。
 */

export const unit9Passages: ReadingPassage[] = [
  {
    id: 'u9-p1',
    title: 'The Silent Language',
    genre: '说明文',
    paragraphs: [
      'Words carry meaning, but our bodies speak too. Experts say that more than half of a message can be delivered without any sound at all.',
      'However, the same gesture does not mean the same thing everywhere. Body language varies from culture to culture, so people may interpret one movement differently. In some countries, making a circle with your thumb and fingers is a warm sign of approval; in others, it is rude. Even the manners of standing and talking differ: a distance that feels friendly in one place may seem too far or too close somewhere else.',
      'Therefore, before travelling abroad, it is worth learning a little about local body language. An appropriate gesture can break down barriers, while a careless one may create misunderstanding.',
    ],
    glossary: [
      { wordId: 'gesture', forms: ['gesture'] },
      { wordId: 'vary', forms: ['varies'] },
      { wordId: 'interpret', forms: ['interpret'] },
      { wordId: 'thumb', forms: ['thumb'] },
      { wordId: 'approve', forms: ['approval'] },
      { wordId: 'manner', forms: ['manners'] },
      { wordId: 'appropriate', forms: ['appropriate'] },
      { wordId: 'barrier', forms: ['barriers'] },
    ],
    questions: [
      {
        id: 'u9-r1-1',
        type: 'detail',
        stem: 'According to Paragraph 2, what can a circle made with the thumb and fingers mean in some countries?',
        options: [
          'A warm sign of approval.',
          'A serious warning.',
          'A request for help.',
          'An invitation to dinner.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "making a circle with your thumb and fingers is a warm sign of approval" 可知在某些国家这一手势表示赞许，故选 A。',
      },
      {
        id: 'u9-r1-2',
        type: 'detail',
        stem: 'What does the writer suggest doing before travelling abroad?',
        options: [
          'Learning a little about local body language.',
          'Buying a thick local dictionary.',
          'Practising speaking more loudly.',
          'Avoiding all hand gestures forever.',
        ],
        answerIndex: 0,
        explanation:
          '由第三段 "before travelling abroad, it is worth learning a little about local body language" 可知作者建议提前了解当地身势语，故选 A。',
      },
      {
        id: 'u9-r1-3',
        type: 'main-idea',
        stem: 'What is the main idea of the passage?',
        options: [
          'Body language varies across cultures and deserves our attention.',
          'Spoken language is becoming less important than before.',
          'How to give a perfect public speech.',
          'The long history of the thumb gesture.',
        ],
        answerIndex: 0,
        explanation:
          '全文说明身势语因文化而异、易被误解，并建议出行前了解当地身势语，可概括为“身势语跨文化差异值得关注”，故选 A。',
      },
    ],
  },
  {
    id: 'u9-p2',
    title: 'The Interview',
    genre: '记叙文',
    paragraphs: [
      'Li Hua had never felt so tense before. Waiting outside the interview room, he rested his chin on his hand and kept folding his arms, then unfolding them again.',
      'Miss Chen, his teacher, passed by and noticed his uneasy look. She gently adjusted his sitting position and told him to stop crossing his arms. \u201cIt makes you look defensive,\u201d she said with a slight smile. \u201cLean forward slightly and keep your hands open — that shows you are listening.\u201d',
      'When his name was called, Li Hua took a deep breath and walked in with a warm smile. The internal fear was still there, but his open manner made the interviewers nod with satisfaction. Sometimes, changing your body first changes your mind.',
    ],
    glossary: [
      { wordId: 'tense', forms: ['tense'] },
      { wordId: 'chin', forms: ['chin'] },
      { wordId: 'fold', forms: ['folding'] },
      { wordId: 'uneasy', forms: ['uneasy'] },
      { wordId: 'adjust', forms: ['adjusted'] },
      { wordId: 'slightly', forms: ['slightly'] },
      { wordId: 'internal', forms: ['internal'] },
      { wordId: 'manner', forms: ['manner'] },
    ],
    questions: [
      {
        id: 'u9-r2-1',
        type: 'detail',
        stem: 'Why did Li Hua keep folding and unfolding his arms while waiting?',
        options: [
          'Because he felt nervous about the interview.',
          'Because the waiting room was too cold.',
          'Because he was doing morning exercise.',
          'Because Miss Chen asked him to do so.',
        ],
        answerIndex: 0,
        explanation:
          '由首段 "Li Hua had never felt so tense before" 及其反复抱臂又放开的动作可知他非常紧张，故选 A。',
      },
      {
        id: 'u9-r2-2',
        type: 'detail',
        stem: 'What did Miss Chen advise Li Hua to do?',
        options: [
          'Lean forward slightly and keep his hands open.',
          'Cross his arms to look more confident.',
          'Rest his chin on his hand during the talk.',
          'Avoid eye contact with the interviewers.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "Lean forward slightly and keep your hands open" 可知陈老师建议他微微前倾、双手摊开，故选 A。',
      },
      {
        id: 'u9-r2-3',
        type: 'inference',
        stem: 'What can we infer from the last paragraph?',
        options: [
          'Li Hua\u2019s open manner left a good impression.',
          'Li Hua failed the interview in the end.',
          'The interviewers disliked his warm smile.',
          'Changing the body can never change the mind.',
        ],
        answerIndex: 0,
        explanation:
          '由末段 "his open manner made the interviewers nod with satisfaction" 可推知他大方的举止给面试官留下了好印象，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit9Passages;
