import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修二 Unit 2（Bridging Cultures）语法点：名词性从句（宾语/表语从句 + 主语/同位语从句） */

export const unit12GrammarPoints: GrammarPoint[] = [
  {
    id: 'object-predicative-clause',
    title: '宾语从句与表语从句',
    tagline: '一个句子分别作宾语或表语：宾语从句跟在及物动词后，表语从句跟在系动词后，连接词用 that / whether / what 等。',
    forms: [
      { label: '宾语从句（陈述句）', detail: 'I believe (that) every exchange student should keep an open mind.' },
      { label: '宾语从句（一般疑问）', detail: 'Nobody knows whether he can adapt to the new school.（用 whether/if）' },
      { label: '宾语从句（特殊疑问）', detail: 'Could you tell me what made you so optimistic?' },
      { label: '表语从句', detail: 'The question is whether the programme will qualify him for a better university.' },
    ],
    usages: [
      'that 引导宾语从句时无词义、不作成分，口语中常省略；引导表语从句时一般不省略',
      '宾语从句表“是否”用 whether 或 if；表语从句中介词后、or not 前只能用 whether',
      'what / who / which / when / where / why / how 等连接代词和连接副词在从句中担任成分，不可省略',
      '宾语从句用陈述语序：I don\'t know where he comes from（不说 where does he come from）',
      '主句过去时态时从句用相应的过去时态；客观真理仍用一般现在时',
    ],
    markers: ['动词 + that…', 'tell / wonder / ask + whether(/if)…', 'The question / problem is whether…', 'that is why / because…'],
    examples: [
      { en: 'I believe that living abroad can widen one\'s horizon.', zh: '我相信海外生活能开阔人的眼界。' },
      { en: 'She asked her tutor whether she should participate in the speech contest.', zh: '她问导师自己是否该参加演讲比赛。' },
      { en: 'The good news is that the culture festival needs student volunteers.', zh: '好消息是文化节需要学生志愿者。' },
    ],
    tips: [
      '宾语从句必须用陈述语序，连接词后紧跟“主语 + 谓语”',
      '表语从句表“是否”用 whether，不用 if：The question is whether…',
      'doubt 的否定句用 that 引导（I don\'t doubt that…），肯定句用 whether/if',
    ],
  },
  {
    id: 'subject-appositive-clause',
    title: '主语从句与同位语从句',
    tagline: '主语从句作主语（常借 it 前置）；同位语从句解释抽象名词的内容，常用 that 引导。',
    forms: [
      { label: '主语从句（句首）', detail: 'That he adapted to the new school so quickly surprised his tutor.' },
      { label: '主语从句（it 形式主语）', detail: 'It surprised his tutor that he adapted to the new school so quickly.' },
      { label: '主语从句表“是否”', detail: 'Whether she will participate in the contest depends on her health.' },
      { label: '同位语从句', detail: 'The news that our team won the first prize made us excited.' },
    ],
    usages: [
      'that 引导主语从句放句首时不可省略；为平衡句子常用 it 作形式主语：It is a pity that…',
      '主语从句表“是否”只能用 whether，不能用 if',
      '同位语从句常解释 news / fact / idea / hope / belief / warning 等抽象名词，说明其具体内容',
      '同位语从句中的 that 无词义、不作成分但不能省略；定语从句中的 that 作成分且常可省略',
      '主语从句作主语时，谓语动词一般用单数',
    ],
    markers: ['句首 That…', 'It + be + n./adj. + that…', 'Whether… depends on…', 'the news/fact/idea that…'],
    examples: [
      { en: 'That the exchange programme involves host families attracts many students.', zh: '这个交换项目包括寄宿家庭这一点吸引了很多学生。' },
      { en: 'Whether the ceremony will be held abroad has not been decided yet.', zh: '典礼是否在国外举行尚未决定。' },
      { en: 'The teacher gave us a warning that idioms are hard to translate word by word.', zh: '老师提醒我们习语很难逐字翻译。' },
    ],
    tips: [
      '区分同位语从句与定语从句：that 在从句中不作任何成分（同位语）还是担任主语或宾语（定语）',
      'It 作形式主语时，真正的主语从句后置，避免头重脚轻',
      '主语从句的谓语用第三人称单数：What he needs is time.',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 2 Bridging Cultures */
export const unit12Exercises: GrammarExercise[] = [
  {
    id: 'u12-g1',
    type: 'mcq',
    pointId: 'object-predicative-clause',
    stem: 'I believe ______ every exchange student should keep an open mind while living abroad.',
    options: ['that', 'what', 'which', 'if'],
    answerIndex: 0,
    explanation:
      '宾语从句成分完整（every exchange student should keep an open mind），连接词无词义也不作成分，用 that，故选 A；what 与 which 须在从句中作成分，if 表“是否”与句意不符。',
  },
  {
    id: 'u12-g2',
    type: 'mcq',
    pointId: 'object-predicative-clause',
    stem: 'No one knows ______ made the young man so optimistic about the programme.',
    options: ['that', 'what', 'whether', 'which'],
    answerIndex: 1,
    explanation:
      '宾语从句中缺少主语（“是什么使他如此乐观”），须用连接代词 what 引导，故选 B；that 不作成分，whether 表“是否”，which 意为“哪一个”均不合句意。',
  },
  {
    id: 'u12-g3',
    type: 'mcq',
    pointId: 'subject-appositive-clause',
    stem: '______ he adapted to the new school so quickly surprised his tutor.',
    options: ['That', 'Whether', 'What', 'Which'],
    answerIndex: 0,
    explanation:
      '主语从句 he adapted to the new school so quickly 成分完整，应用无实义的 that 引导且不可省略，故选 A；What 须作成分，Whether 表“是否”与 surprised 的语气不符。',
  },
  {
    id: 'u12-g4',
    type: 'mcq',
    pointId: 'object-predicative-clause',
    stem: 'The question is ______ the exchange year can qualify her for a better university.',
    options: ['that', 'whether', 'because', 'when'],
    answerIndex: 1,
    explanation:
      '表语从句表达“是否”的含义（交换一年能否让她获得更好的大学资格），应用 whether 引导，故选 B；表语从句表“是否”不用 if，that 无“是否”之意。',
  },
  {
    id: 'u12-g5',
    type: 'mcq',
    pointId: 'subject-appositive-clause',
    stem: 'The news ______ our class won the first prize at the culture festival made us excited.',
    options: ['that', 'which', 'what', 'when'],
    answerIndex: 0,
    explanation:
      '同位语从句 our class won the first prize… 成分完整，解释 news 的具体内容，用 that 引导且不可省略，故选 A；which/what 须作成分，when 表时间与句意不符。',
  },
  {
    id: 'u12-g6',
    type: 'mcq',
    pointId: 'subject-appositive-clause',
    stem: '______ she will participate in the international speech contest depends on her health.',
    options: ['Whether', 'If', 'That', 'What'],
    answerIndex: 0,
    explanation:
      '主语从句位于句首且表“是否”时只能用 Whether，不能用 If，故选 A；That 不表“是否”，What 须在从句中作成分。',
  },
  {
    id: 'u12-f1',
    type: 'fill',
    pointId: 'object-predicative-clause',
    stem: 'His ambition is ______ he can become a bridge between the two cultures.（填一个恰当的连接词）',
    answer: 'that',
    explanation:
      '表语从句 he can become a bridge… 成分完整、句意明确，用 that 引导（表“就是”这一事实），不作成分也不可省略。',
  },
  {
    id: 'u12-f2',
    type: 'fill',
    pointId: 'object-predicative-clause',
    stem: "I'm really glad to hear ______ you have got over your homesickness.（填一个恰当的连接词）",
    answer: 'that',
    explanation:
      '宾语从句 you have got over your homesickness 成分完整，hear 后接 that 引导的宾语从句，that 无词义、不作成分。',
  },
  {
    id: 'u12-f3',
    type: 'fill',
    pointId: 'subject-appositive-clause',
    stem: '______ the opening ceremony will be held abroad has not been decided yet.（填一个恰当的连接词）',
    answer: 'Whether',
    explanation:
      '主语从句位于句首并表达“是否”含义，只能用 Whether 引导（句首不用 If）。',
  },
  {
    id: 'u12-f4',
    type: 'fill',
    pointId: 'subject-appositive-clause',
    stem: 'The tutor gave us a piece of advice ______ we should learn some local idioms first.（填一个恰当的连接词）',
    answer: 'that',
    explanation:
      '同位语从句 we should learn some local idioms first 成分完整，解释 advice 的内容，用 that 引导且不可省略。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit12GrammarPoints, exercises: unit12Exercises };
