import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修一 Unit 2（Looking into the Future）语法点：将来进行时 */

export const unit7GrammarPoints: GrammarPoint[] = [
  {
    id: 'future-continuous',
    title: '将来进行时（will be doing）',
    tagline: '表示将来某一时刻或某段时间正在进行的动作，也常用于谈论已经安排好的事情。',
    forms: [
      { label: '肯定', detail: '主语 + will be + doing：This time tomorrow, I will be lying on the beach.' },
      { label: '否定', detail: '主语 + will not (won\u2019t) be + doing：I won\u2019t be using the printer then.' },
      { label: '疑问', detail: 'Will + 主语 + be + doing?：Will you be attending the online class at eight?' },
      { label: '时间标志', detail: 'this time tomorrow / at nine tonight / during…then 等将来时刻 + 进行体' },
    ],
    usages: [
      '表示将来某一时刻正在进行的动作：This time next week, we will be taking our exams.',
      '表示按计划、安排将要发生的动作，比一般将来时更委婉、更强调“已经在安排之中”：We will be holding the meeting on Friday.',
      '委婉地询问对方的计划，不催促对方当场决定：Will you be using the car tonight?',
      '陈述原因或结果时表示“这将会是正在发生的情况”：Don\u2019t call at eight; we will be having dinner then.',
    ],
    markers: ['this time tomorrow', 'at … tomorrow / tonight', 'then', 'during', 'won\u2019t be …ing', 'Will you be …ing?'],
    examples: [
      { en: 'This time tomorrow, the scientists will be testing the new robot.', zh: '明天这个时候，科学家们将在测试新机器人。' },
      { en: 'Don\u2019t phone me between nine and ten; I will be reviewing my lessons.', zh: '九点到十点之间别给我打电话，我将在复习功课。' },
      { en: 'Will you be using the shared bike this afternoon?', zh: '今天下午你会用那辆共享单车吗？' },
    ],
    tips: [
      '将来进行时不能与表示“当场决定”的语境混用：临时的决定用 will do，不用 will be doing',
      '被动形式很少用；进行体强调“正在进行”，完成体强调“已完成”，注意区分',
      '问对方计划时 Will you be doing…? 比 Will you do…? 更礼貌，因为不逼迫对方立即表态',
    ],
  },
  {
    id: 'future-continuous-vs-will',
    title: '将来进行时与一般将来时的辨析',
    tagline: 'will be doing 谈安排好的、将要持续的动作；will do 表示意图、临时决定或意愿。',
    forms: [
      { label: '计划之中的动作', detail: 'We will be holding the ceremony on Friday.（已列入日程）' },
      { label: '临时决定', detail: '— The phone is ringing. — I\u2019ll answer it.（当场决定，不用进行体）' },
      { label: '意愿 / 答应', detail: 'I will help you with your project.（意愿）' },
      { label: '委婉询问计划', detail: 'Will you be joining us for lunch?（询问安排，不催促）' },
    ],
    usages: [
      '谈论日程表上已经确定的活动时，将来进行时语气更自然：The team will be presenting its results on Friday.',
      '说话时临时做出的决定、提出的意愿或承诺，用一般将来时：I will visit her this evening.',
      '想知道对方“是否已有安排”用将来进行时；请求对方“现在决定”用一般将来时',
      '两者都指向将来，但将来进行时不带感情色彩，语气客观；一般将来时常带意图色彩',
    ],
    markers: ['already arranged', 'on the schedule', 'instant decision', 'willingness', 'I\u2019ll …', 'Will you be …ing?'],
    examples: [
      { en: 'I will be attending a course on AI next term, so Tuesdays are busy.', zh: '下学期我将参加一门人工智能课程，所以周二会很忙。' },
      { en: '— Ann is in hospital. — Really? I will visit her this evening.', zh: '——安住院了。——真的吗？今晚我去看她。' },
      { en: '— Shall I clean the windows? — No, thanks. The robot will be doing that at noon.', zh: '——要我擦窗户吗？——不用了，机器人中午会做这件事。' },
    ],
    tips: [
      '看到“即时反应”（如听到消息后马上表态）首选 will do，而不是 will be doing',
      '描述“到将来某时为止自然会发生、无需主观意愿的动作”时，用 will be doing 更贴切',
      '中文常都译作“将要……”，需借助语境判断是“计划中”还是“临时决定/意愿”',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 2 Looking into the Future */
export const unit7Exercises: GrammarExercise[] = [
  {
    id: 'u7-g1',
    type: 'mcq',
    pointId: 'future-continuous',
    stem: 'This time tomorrow, I ______ on the grass and reading a science fiction book.',
    options: ['will be lying', 'lay', 'lie', 'have lain'],
    answerIndex: 0,
    explanation:
      'this time tomorrow 表示将来某一时刻，句中动作正在进行，用将来进行时 will be lying，故选 A；lay（过去式）、lie（现在时）、have lain（现在完成时）均与语境不符。',
  },
  {
    id: 'u7-g2',
    type: 'mcq',
    pointId: 'future-continuous',
    stem: 'Don\u2019t call me at eight tonight; we ______ the results of the experiment then.',
    options: ['will be discussing', 'discuss', 'discussed', 'would discuss'],
    answerIndex: 0,
    explanation:
      'then 指今晚八点那一刻，动作正在进行，用将来进行时 will be discussing，故选 A；一般现在时、过去时与 would discuss（过去将来）都不合语境。',
  },
  {
    id: 'u7-g3',
    type: 'mcq',
    pointId: 'future-continuous',
    stem: '— What will you be doing this time on Friday?\n— We ______ our final design to the whole class.',
    options: ['will be presenting', 'presented', 'have presented', 'present'],
    answerIndex: 0,
    explanation:
      '问句已用将来进行时询问安排，答语表示周五那时正在进行的动作，用 will be presenting，故选 A。',
  },
  {
    id: 'u7-g4',
    type: 'mcq',
    pointId: 'future-continuous-vs-will',
    stem: '— I hear our library is closed for repair.\n— Really? Then I ______ my books back tomorrow instead.',
    options: ['will return', 'will be returning', 'return', 'returned'],
    answerIndex: 0,
    explanation:
      '听到消息后当场做出的临时决定，用一般将来时 will return，故选 A；will be returning 用于早已安排好的动作，此处不合逻辑。',
  },
  {
    id: 'u7-g5',
    type: 'mcq',
    pointId: 'future-continuous',
    stem: 'You can borrow my laptop tomorrow morning; I ______ it the whole afternoon.',
    options: ["won't be using", "don't use", "didn't use", "haven't used"],
    answerIndex: 0,
    explanation:
      '明天下午电脑处于“不会正在被使用”的状态，用将来进行时的否定 won\u2019t be using，故选 A；其余选项时态均不指向明天下午。',
  },
  {
    id: 'u7-g6',
    type: 'mcq',
    pointId: 'future-continuous-vs-will',
    stem: '— Could I use your dictionary this evening?\n— Of course. I ______ it until ten, so take your time.',
    options: ["won't be needing", "don't need", "didn't need", "haven't needed"],
    answerIndex: 0,
    explanation:
      '表示今晚字典不会“正处于被需要”的状态，用将来进行时的否定 won\u2019t be needing，语气客观礼貌，故选 A。',
  },
  {
    id: 'u7-f1',
    type: 'fill',
    pointId: 'future-continuous',
    stem: 'This time next month, the students ______ (harvest) wheat on the school farm.（用所给词的适当形式填空）',
    answer: 'will be harvesting',
    explanation:
      'this time next month 是将来时刻，收割动作正在进行，用将来进行时 will be harvesting。',
  },
  {
    id: 'u7-f2',
    type: 'fill',
    pointId: 'future-continuous',
    stem: 'Don\u2019t phone me between nine and ten tomorrow; the engineers ______ (test) the new robot then.（用所给词的适当形式填空）',
    answer: 'will be testing',
    explanation:
      'then 指 tomorrow 的九点到十点之间，测试正在进行，用将来进行时 will be testing。',
  },
  {
    id: 'u7-f3',
    type: 'fill',
    pointId: 'future-continuous',
    stem: 'I ______ (wait) for you at the school gate at six tomorrow evening.（用所给词的适当形式填空）',
    answer: 'will be waiting',
    explanation:
      'at six tomorrow evening 表示将来时刻，等待的动作将持续进行，用将来进行时 will be waiting。',
  },
  {
    id: 'u7-f4',
    type: 'fill',
    pointId: 'future-continuous-vs-will',
    stem: 'According to the schedule, the team ______ (present) its innovation results this time on Friday.（用所给词的适当形式填空）',
    answer: 'will be presenting',
    explanation:
      'according to the schedule 表明活动已安排好，且 this time on Friday 指将来时刻，用将来进行时 will be presenting。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit7GrammarPoints, exercises: unit7Exercises };
