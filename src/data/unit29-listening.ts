import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修三 Unit 4（Adversity and Courage）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 4 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit29Listenings: ListeningMaterial[] = [
  {
    id: 'u29-l1',
    title: 'A Writer Who Never Gave Up',
    genre: '独白',
    script: [
      'This morning I want to tell you about Helen, a writer who visited our school last week.',
      'At the age of nine, she lost her sight after a serious illness, and her world suddenly went dark.',
      'For years she lived in silence and sadness, until a teacher taught her to read with her fingers.',
      'She then worked twice as hard as others and finally became the first blind student in her university.',
      'Her story tells us that courage can turn the darkest night into morning light.',
    ],
    questions: [
      {
        id: 'u29-l1-q1',
        type: 'detail',
        stem: 'What happened to Helen at the age of nine?',
        options: [
          'She lost her sight.',
          'She moved abroad.',
          'She broke her leg.',
          'She left school.',
        ],
        answerIndex: 0,
        explanation:
          '由 "At the age of nine, she lost her sight after a serious illness" 可知她九岁时因病失明，故选 A；B、C、D 均与原文不符。',
      },
      {
        id: 'u29-l1-q2',
        type: 'detail',
        stem: 'Who taught Helen to read with her fingers?',
        options: [
          'A teacher.',
          'Her mother.',
          'A doctor.',
          'Her classmates.',
        ],
        answerIndex: 0,
        explanation:
          '由 "a teacher taught her to read with her fingers" 可知是一位老师教她用手指阅读，故选 A；B、C、D 均未提及。',
      },
      {
        id: 'u29-l1-q3',
        type: 'inference',
        stem: 'What does the speaker think of Helen\u2019s story?',
        options: [
          'Frightening.',
          'Boring.',
          'Encouraging.',
          'Strange.',
        ],
        answerIndex: 2,
        explanation:
          '讲话者以「勇气能把最黑的夜变成晨光」结尾，可推知他认为这个故事鼓舞人心，故选 C；A、B、D 与讲话的情感色彩不符。',
      },
    ],
  },
  {
    id: 'u29-l2',
    title: 'After Failing the Exam',
    genre: '对话',
    script: [
      'M: You look worried, Mary. What is the matter?',
      'W: I failed the maths exam again. I feel like giving up.',
      'M: Everyone meets setbacks. Remember last year? You could hardly swim, but you kept practising.',
      'W: That is true. I finally won a medal in the school swimming competition.',
      'M: So trust yourself. Failure is only a step on the road to success.',
      'W: Thanks. I will make a study plan and try again from tonight.',
      'M: That is the spirit. Call me if you need help.',
    ],
    questions: [
      {
        id: 'u29-l2-q1',
        type: 'detail',
        stem: 'Why does Mary feel worried?',
        options: [
          'She failed the maths exam again.',
          'She lost her swimming medal.',
          'She argued with her friend.',
          'She missed the bus.',
        ],
        answerIndex: 0,
        explanation:
          '由 "I failed the maths exam again. I feel like giving up" 可知 Mary 因数学考试再次不及格而沮丧，故选 A；B、C、D 均未提及。',
      },
      {
        id: 'u29-l2-q2',
        type: 'detail',
        stem: 'What did Mary finally win last year?',
        options: [
          'The maths prize.',
          'A medal in the swimming competition.',
          'A singing award.',
          'A scholarship.',
        ],
        answerIndex: 1,
        explanation:
          '由 "I finally won a medal in the school swimming competition" 可知她最终在校游泳比赛中获得奖牌，故选 B；A、C、D 与原文不符。',
      },
      {
        id: 'u29-l2-q3',
        type: 'inference',
        stem: 'What will Mary probably do tonight?',
        options: [
          'Make a study plan and start again.',
          'Give up maths completely.',
          'Go swimming alone.',
          'Talk to her teacher about changing classes.',
        ],
        answerIndex: 0,
        explanation:
          'Mary 明确说今晚将制定学习计划重新开始，可推知她会付诸行动，故选 A；B 与她的决定相反，C、D 无依据。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit29Listenings;
