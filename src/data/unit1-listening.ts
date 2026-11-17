import type { ListeningMaterial, ListeningQuestion } from '../types';

/**
 * 人教2019必修一 Unit 1（Teenage Life）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 1 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

/** 听力题型中文标签 */
export const LISTENING_QUESTION_TYPE_LABEL: Record<ListeningQuestion['type'], string> = {
  detail: '细节理解',
  inference: '推理判断',
};

export const unit1Listenings: ListeningMaterial[] = [
  {
    id: 'l1',
    title: 'A Busy but Interesting School Life',
    genre: '独白',
    script: [
      "Hi, I'm Li Ming, a freshman at Green Hill Senior High School. My new school life is busy but interesting.",
      'Every morning, I get up at six thirty and read English for twenty minutes. After class, I prefer to play basketball with my classmates.',
      'Last month, I joined the debate club because I wanted to think fast and speak fluent English. Every Friday afternoon, we discuss a hot topic together. Sometimes the questions are challenging, but I never give up.',
    ],
    questions: [
      {
        id: 'l1-1',
        type: 'detail',
        stem: 'When does the debate club meet?',
        options: [
          'Every morning before class.',
          'Every Friday afternoon.',
          'After class every day.',
          'On Saturday morning.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Every Friday afternoon, we discuss a hot topic together" 可知，辩论社每周五下午活动，故选 B；A 是他每天早晨读英语的时间，C 与原文不符，D 未提及。',
      },
      {
        id: 'l1-2',
        type: 'detail',
        stem: 'Why did the speaker join the debate club?',
        options: [
          'To play basketball with classmates.',
          'To read English stories in the library.',
          'To think fast and speak fluent English.',
          'To get up earlier in the morning.',
        ],
        answerIndex: 2,
        explanation:
          '由 "I joined the debate club because I wanted to think fast and speak fluent English" 直接可知选 C；A 是他课后的爱好，B、D 与加入辩论社的原因无关。',
      },
      {
        id: 'l1-3',
        type: 'inference',
        stem: 'What does the speaker think of his new school life?',
        options: [
          'Busy but interesting.',
          'Boring and difficult.',
          'Quiet and lonely.',
          'Easy and free.',
        ],
        answerIndex: 0,
        explanation:
          '开头 "My new school life is busy but interesting" 直接点明态度：忙碌但有趣；结合结尾 "challenging, but I never give up" 的积极语气可进一步印证，故选 A；B、C、D 均与原文语气不符。',
      },
    ],
  },
  {
    id: 'l2',
    title: 'Talking about School Clubs',
    genre: '对话',
    script: [
      'Amy: Hi, Jack. Are you in any school club this term?',
      "Jack: Yes, I'm in the volunteer club. Every Saturday morning, we visit the community library and read stories to young children.",
      'Amy: That sounds meaningful. I wanted to join the ballet club, but the Friday training does not suit me, so I chose the guitar club instead.',
      'Jack: Great! Our teacher says a suitable hobby makes teenage life colourful.',
      'Amy: I agree. Maybe I can join you one day.',
    ],
    questions: [
      {
        id: 'l2-1',
        type: 'detail',
        stem: 'Which club is Jack in this term?',
        options: ['The ballet club.', 'The guitar club.', 'The volunteer club.', 'The debate club.'],
        answerIndex: 2,
        explanation:
          'Jack 明确说 "I\u2019m in the volunteer club"，可知他这学期在志愿者社团，故选 C；吉他社是 Amy 的选择，芭蕾舞社是 Amy 想去但放弃的，辩论社未提及。',
      },
      {
        id: 'l2-2',
        type: 'detail',
        stem: 'Why did Amy choose the guitar club instead of the ballet club?',
        options: [
          "She doesn't like dancing at all.",
          "The ballet club's Friday training doesn't suit her.",
          'The guitar club meets on Saturday mornings.',
          'Her teacher asked her to play the guitar.',
        ],
        answerIndex: 1,
        explanation:
          '由 "I wanted to join the ballet club, but the Friday training does not suit me, so I chose the guitar club instead" 可知，芭蕾舞社周五的训练时间不适合她，故选 B；A 属过度推断，C 是志愿者社团的活动时间，D 原文未提及。',
      },
      {
        id: 'l2-3',
        type: 'inference',
        stem: 'What can we learn from the conversation?',
        options: [
          'Amy will have ballet training this Friday.',
          'Jack wants to join the guitar club too.',
          'A suitable hobby makes teenage life colourful.',
          'The volunteer club meets on Sunday mornings.',
        ],
        answerIndex: 2,
        explanation:
          '结尾 Jack 转述老师的话 "a suitable hobby makes teenage life colourful"，Amy 回应 "I agree"，可推知两人都认同合适的爱好让青少年生活更多彩，故选 C；A 与 "does not suit me" 矛盾，B、D 均与对话内容不符。',
      },
    ],
  },
];

const materialById = new Map(unit1Listenings.map((m) => [m.id, m]));

export function getListening(id: string): ListeningMaterial | undefined {
  return materialById.get(id);
}

/** 词数统计：只计含字母的 token（与阅读模块同一口径） */
export function countScriptWords(script: string[]): number {
  return script
    .join(' ')
    .split(/\s+/)
    .filter((token) => /[A-Za-z]/.test(token)).length;
}
