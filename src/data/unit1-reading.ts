import type { ReadingPassage } from '../types';

/**
 * 人教2019必修一 Unit 1（Teenage Life）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 1 词表），避免任何教材原文版权问题。
 */

export const unit1Passages: ReadingPassage[] = [
  {
    id: 'p1',
    title: "A Freshman's First Term",
    genre: '记叙文',
    paragraphs: [
      'Chen Yang is a freshman at Sunshine Senior High School. At first, everything seemed confusing to him: new subjects, new teachers and a much heavier schoolbag. The first week was actually a little scary.',
      'Now, three months later, the teenager has found his own way to enjoy school life. He prefers reading English novels and has joined the school debate team. Every Friday afternoon, the team members meet and discuss a new topic, from school uniforms to green travel. At weekends, he works as a volunteer at a community library and reads stories to young children.',
      "'My teacher recommended these activities to me,' Chen Yang says. 'They are suitable for me, and every challenge makes me stronger.' Next term, he hopes to speak fluent English and help more classmates.",
    ],
    glossary: [
      { wordId: 'freshman', forms: ['freshman'] },
      { wordId: 'confusing', forms: ['confusing'] },
      { wordId: 'actually', forms: ['actually'] },
      { wordId: 'teenager', forms: ['teenager'] },
      { wordId: 'prefer', forms: ['prefers'] },
      { wordId: 'debate', forms: ['debate'] },
      { wordId: 'topic', forms: ['topic'] },
      { wordId: 'volunteer', forms: ['volunteer'] },
      { wordId: 'recommend', forms: ['recommended'] },
      { wordId: 'suitable', forms: ['suitable'] },
      { wordId: 'challenge', forms: ['challenge'] },
      { wordId: 'fluent', forms: ['fluent'] },
    ],
    questions: [
      {
        id: 'r1-1',
        type: 'detail',
        stem: 'How did Chen Yang feel during his first week at senior high school?',
        options: [
          'Everything seemed exciting and fresh.',
          'He felt a little confused and nervous.',
          'He was bored with the new subjects.',
          'He was angry with his new teachers.',
        ],
        answerIndex: 1,
        explanation:
          '由第一段 "everything seemed confusing to him" 和 "The first week was actually a little scary" 可知，他起初既困惑又有些紧张害怕，故选 B；A、C、D 均与原文不符。',
      },
      {
        id: 'r1-2',
        type: 'detail',
        stem: 'What does Chen Yang do at weekends?',
        options: [
          'He reads English novels at home.',
          'He discusses hot topics with the debate team.',
          'He works as a volunteer in a community library.',
          'He travels around with his classmates.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "At weekends, he works as a volunteer at a community library and reads stories to young children" 可知，他周末在社区图书馆做志愿者，故选 C；A 是平日爱好，B 是每周五下午的活动，D 原文未提及。',
      },
      {
        id: 'r1-3',
        type: 'main-idea',
        stem: 'What is the best title for this passage?',
        options: [
          'A Difficult First Week at School',
          "A Freshman's Colourful School Life",
          'How to Speak Fluent English',
          'Reading Stories for Young Children',
        ],
        answerIndex: 1,
        explanation:
          '全文讲述新生 Chen Yang 从起初的困惑迷茫，到加入辩论队、做志愿者、迎接挑战并逐渐享受高中生活的过程，最能概括全文的是 B；A 只覆盖第一段，C、D 只是文中细节。',
      },
    ],
  },
  {
    id: 'p2',
    title: 'Clubs Are Waiting for You',
    genre: '应用文',
    paragraphs: [
      'Are you ready for a more colourful teenage life? Welcome to our school clubs!',
      'The Ballet Club meets every Tuesday afternoon in the dance hall. If you love music and movement, it is a good choice. The Greenhouse Club grows vegetables and flowers behind the science building. Members also talk about the green movement every Thursday. Prefer arguing to planting? Join the Debate Club! Here, you can pick a hot topic, share your ideas and learn to think fast.',
      "Our graduates say that clubs taught them more than books. One former member, now a student at Peking University, told us, 'Clubs helped me find what I truly love.'",
      'Sign up before 15 September. No experience is needed - just bring your interest!',
    ],
    glossary: [
      { wordId: 'teenage', forms: ['teenage'] },
      { wordId: 'ballet', forms: ['Ballet'] },
      { wordId: 'movement', forms: ['movement'] },
      { wordId: 'greenhouse', forms: ['Greenhouse'] },
      { wordId: 'prefer', forms: ['Prefer'] },
      { wordId: 'debate', forms: ['Debate'] },
      { wordId: 'topic', forms: ['topic'] },
      { wordId: 'graduate', forms: ['graduates'] },
    ],
    questions: [
      {
        id: 'r2-1',
        type: 'detail',
        stem: 'When does the Ballet Club meet?',
        options: [
          'Every Tuesday afternoon.',
          'Every Thursday morning.',
          'Every Friday afternoon.',
          'Before 15 September.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The Ballet Club meets every Tuesday afternoon in the dance hall" 可直接定位：芭蕾舞俱乐部每周二下午活动，故选 A；周四出现的是 Greenhouse Club 讨论绿色运动的时间，15 September 是报名截止日期而非活动时间。',
      },
      {
        id: 'r2-2',
        type: 'detail',
        stem: 'What do Greenhouse Club members do?',
        options: [
          'They dance in the hall.',
          'They argue about hot topics.',
          'They grow plants and talk about the green movement.',
          'They read stories to young children.',
        ],
        answerIndex: 2,
        explanation:
          '由 "The Greenhouse Club grows vegetables and flowers... Members also talk about the green movement every Thursday" 可知，温室社团种植蔬菜花卉并讨论绿色运动，故选 C；A 是 Ballet Club 的活动，B 是 Debate Club 的活动，D 与本文无关。',
      },
      {
        id: 'r2-3',
        type: 'purpose',
        stem: 'Why does the writer write this passage?',
        options: [
          'To describe life at a famous university.',
          'To invite students to join the school clubs.',
          'To teach students how to grow flowers.',
          'To compare clubs with textbooks.',
        ],
        answerIndex: 1,
        explanation:
          '本文是一则社团招新启事：开头 "Welcome to our school clubs!" 发出邀请，结尾 "Sign up before 15 September" 给出报名方式，可推断写作目的是邀请同学们加入社团，故选 B；A、C 只是顺带提到的细节，D 曲解了第三段的意思。',
      },
    ],
  },
];

const passageById = new Map(unit1Passages.map((p) => [p.id, p]));

export function getPassage(id: string): ReadingPassage | undefined {
  return passageById.get(id);
}
