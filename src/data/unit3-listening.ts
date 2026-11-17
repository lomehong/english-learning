import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修一 Unit 3（Sports and Fitness）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 3 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit3Listenings: ListeningMaterial[] = [
  {
    id: 'u3-l1',
    title: 'Preparing for the Mini-Marathon',
    genre: '独白',
    script: [
      "Hi, I'm Wang Fang. Next month, our city will hold a big marathon, and I'm going to run the five-kilometre race for beginners.",
      'Last year I was weak and often got sick, so my father took me to the gym. Since then, I have trained three times a week to build up my strength.',
      'My coach says the race will be hard, but I will never give up. I hope to win a medal one day.',
    ],
    questions: [
      {
        id: 'u3-l1-1',
        type: 'detail',
        stem: 'What is Wang Fang going to do next month?',
        options: [
          'To teach beginners at the gym.',
          'To run a five-kilometre race.',
          'To watch a big marathon on TV.',
          'To work as a volunteer in the city.',
        ],
        answerIndex: 1,
        explanation:
          '由开头 "Next month, our city will hold a big marathon, and I\u2019m going to run the five-kilometre race for beginners" 可知，她下个月要参加五公里 beginner 组比赛，故选 B；A、C、D 均与原文不符。',
      },
      {
        id: 'u3-l1-2',
        type: 'detail',
        stem: 'Why did Wang Fang\u2019s father take her to the gym last year?',
        options: [
          'Because she wanted to be a coach.',
          'Because she was weak and often got sick.',
          'Because she had already won a medal.',
          'Because the marathon was starting.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Last year I was weak and often got sick, so my father took me to the gym" 直接可知，她身体弱、常生病，爸爸才带她去健身房，故选 B。',
      },
      {
        id: 'u3-l1-3',
        type: 'inference',
        stem: 'What can we learn about Wang Fang?',
        options: [
          'She has given up training several times.',
          'She trains regularly to get ready for the race.',
          'She won a medal in last year\u2019s marathon.',
          'Her coach will run the race with her.',
        ],
        answerIndex: 1,
        explanation:
          '由 "I have trained three times a week to build up my strength" 与 "I will never give up" 可推断，她一直在有规律地训练备战，故选 B；A 与 never give up 矛盾，C、D 原文均未提及。',
      },
    ],
  },
  {
    id: 'u3-l2',
    title: 'Joining the Badminton Club',
    genre: '对话',
    script: [
      'Mike: Hi, Lucy. You look happy today.',
      'Lucy: Yes! I have just joined the school badminton club.',
      'Mike: Great! When do you practise?',
      'Lucy: Every Tuesday and Friday afternoon, in the gym behind the stadium.',
      'Mike: Is the coach strict?',
      'Lucy: A little, but he is kind. He says I move fast and my style is graceful.',
      'Mike: Will you compete in the city championship?',
      'Lucy: Yes, in August. Our team is strong, and we are going to train hard for it.',
    ],
    questions: [
      {
        id: 'u3-l2-1',
        type: 'detail',
        stem: 'When does Lucy practise badminton?',
        options: [
          'Every Tuesday and Friday afternoon.',
          'Every morning before class.',
          'Every Saturday and Sunday.',
          'Every afternoon after class.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Every Tuesday and Friday afternoon, in the gym behind the stadium" 可知，她每周二和周五下午训练，故选 A；B、C、D 与对话不符。',
      },
      {
        id: 'u3-l2-2',
        type: 'detail',
        stem: 'What does the coach say about Lucy?',
        options: [
          'She needs to train much longer.',
          'She moves fast and her style is graceful.',
          'She is the best player in the club.',
          'She should join another club.',
        ],
        answerIndex: 1,
        explanation:
          '由 "He says I move fast and my style is graceful" 可知，教练夸她动作快、打法优美，故选 B；A、C、D 对话中均未提及。',
      },
      {
        id: 'u3-l2-3',
        type: 'inference',
        stem: 'What will Lucy\u2019s team do for the city championship?',
        options: [
          'Ask a famous athlete to join them.',
          'Practise every day from now on.',
          'Train hard to prepare for it.',
          'Give up because the team is weak.',
        ],
        answerIndex: 2,
        explanation:
          '由结尾 "Our team is strong, and we are going to train hard for it" 可推断，队伍将刻苦训练备战八月的市锦标赛，故选 C；A、B、D 均无依据。',
      },
    ],
  },
];
