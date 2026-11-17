import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修四 Unit 5（Launching Your Career）语法点：主语表语从句与虚拟语气 */

export const unit15GrammarPoints: GrammarPoint[] = [
  {
    id: 'noun-clause-subject-predicative',
    title: '主语从句与表语从句',
    tagline: '从句作主语或表语：what 在从句中充当成分，that 只起连接作用；It is… that… 与 That is why… 是高频句式。',
    forms: [
      { label: 'that 引导主语从句', detail: 'That she never gave up surprised every employer.（that 无成分，不省略）' },
      { label: 'what 引导主语从句', detail: 'What matters most is your attitude.（what 作从句主语，意为“……的东西”）' },
      { label: 'it 形式主语句式', detail: 'It is clear that the intern is proficient in three languages.' },
      { label: '表语从句', detail: 'The problem is whether we can qualify this year. / That is why she chose nursing.' },
    ],
    usages: [
      '主语从句可直接放句首，也常后移而用 it 作形式主语；that 引导时在句首不可省略',
      'what 在从句中充当主语、宾语或表语；that 只起连接作用不在从句中充当成分，两者不可混用',
      '表语从句位于系动词（be / seem / remain）之后，说明主语“是什么/为什么”；whether 可引导表语从句，if 不能',
      '“That is why …”表结果（“那就是……的原因”），“The reason is that …”中 that 不可换成 because',
    ],
    markers: ['What matters is …', 'It is clear that …', 'That is why …', 'The reason is that …', 'whether … or not'],
    examples: [
      { en: 'What the interviewers value most is honesty.', zh: '面试官最看重的是诚实。' },
      { en: 'It is possible that the company will recruit more interns.', zh: '公司有可能招募更多实习生。' },
      { en: 'That is why she made teaching her profession.', zh: '那就是她选择教书为业的原因。' },
    ],
    tips: [
      '主语从句放句首时 that 不能省：That he failed the test is not surprising.（it 句式中 that 也一般不省）。',
      'whether 可与 or not 直接连用并可放句首，if 不能放句首引导主语从句。',
      '判断用 what 还是 that：从句缺主语 / 宾语 / 表语用 what；成分完整用 that。',
    ],
  },
  {
    id: 'subjunctive-conditionals',
    title: '虚拟语气（if 条件句与 wish / as if）',
    tagline: '与现在/过去/将来事实相反的 if 条件句动词“退一步”；wish 与 as if 后的从句同样用虚拟形式。',
    forms: [
      { label: '与现在相反', detail: 'If I were a doctor, I would work in a mountain clinic.（从句过去式，主句 would + 原形）' },
      { label: '与过去相反', detail: 'If she had taken the aptitude test, she might have chosen engineering.（had done / would have done）' },
      { label: '与将来相反（可能性小）', detail: 'If the boss were to offer the post, I would accept it.（were to / should + 原形）' },
      { label: 'wish / as if 虚拟', detail: 'I wish I were proficient in French. / He talks as if he had met the entrepreneur.' },
    ],
    usages: [
      '与现在事实相反：if 从句用过去式（be 用 were），主句用 would / could / might + 动词原形',
      '与过去事实相反：if 从句用 had + 过去分词，主句用 would / could / might + have + 过去分词',
      '与将来事实相反或可能性很小：if 从句用 should / were to + 动词原形，主句用 would + 动词原形',
      'wish 后的从句：与现在相反用过去式，与过去相反用 had done，与将来愿望用 would + 原形；as if 后从句规则相同',
    ],
    markers: ['If I were …', 'would do', 'If … had done', 'would have done', 'I wish … were', 'as if … had done'],
    examples: [
      { en: 'If I had another chance, I would apply for that internship.', zh: '如果再有一次机会，我就申请那个实习岗位。' },
      { en: 'If he had read her biography, he would have understood her choice.', zh: '如果他读过她的传记，就会理解她的选择。' },
      { en: 'I wish I were as brave as that young entrepreneur.', zh: '我真希望自己像那位年轻企业家一样勇敢。' },
    ],
    tips: [
      '虚拟“退一步”：现在的事实 → 过去式；过去的事实 → had done；虚拟不与“事实发生的可能性大”的陈述句混用。',
      'if 省略时 had / were / should 提到主语前：Had she taken the test, … / Were I you, …。',
      'as if 后接真实情况时用陈述语气；只有与事实相反才用虚拟：He looks as if he is tired（可能真累）／as if he were tired（虚拟）。',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 5 Launching Your Career */
export const unit15Exercises: GrammarExercise[] = [
  {
    id: 'u35-g1',
    type: 'mcq',
    pointId: 'noun-clause-subject-predicative',
    stem: '______ matters most in a job interview is not your degree but your attitude.',
    options: ['What', 'That', 'Which', 'Whether'],
    answerIndex: 0,
    explanation:
      '从句中缺少主语（“最重要的东西”），应用 what 引导主语从句，故选 A；that 不在从句中充当成分，B 不合语法，C 哪一个 / D 是否，均不合语义。',
  },
  {
    id: 'u35-g2',
    type: 'mcq',
    pointId: 'noun-clause-subject-predicative',
    stem: 'It is reported ______ the company will recruit fifty new employees this year.',
    options: ['what', 'that', 'which', 'when'],
    answerIndex: 1,
    explanation:
      '从句成分完整，it 作形式主语后接 that 引导真正的主语从句，故选 B；what 需在从句中充当成分，C、D 与语义不符。',
  },
  {
    id: 'u35-g3',
    type: 'mcq',
    pointId: 'noun-clause-subject-predicative',
    stem: 'She passed the written test but failed the interview. That is ______ she knows few people in the field.',
    options: ['because', 'why', 'what', 'how'],
    answerIndex: 1,
    explanation:
      '前句陈述结果（落榜），后句说明原因，用 That is why…（“那就是……的原因”），故选 B；A 应倒装为 The reason is that…，C、D 不合语义。',
  },
  {
    id: 'u35-g4',
    type: 'mcq',
    pointId: 'subjunctive-conditionals',
    stem: 'If I ______ you, I would take the teaching qualification first.',
    options: ['am', 'was', 'were', 'be'],
    answerIndex: 2,
    explanation:
      '与现在事实相反的虚拟条件句中 be 动词一律用 were，故选 C；A、B 用于陈述语气，D 不是虚拟形式。',
  },
  {
    id: 'u35-g5',
    type: 'mcq',
    pointId: 'subjunctive-conditionals',
    stem: 'If she had taken the career aptitude test, she ______ a different profession.',
    options: ['would choose', 'would have chosen', 'chose', 'had chosen'],
    answerIndex: 1,
    explanation:
      '从句 had taken 表与过去相反，主句须用 would have done，故选 B；A 用于与现在相反，C、D 不是虚拟主句形式。',
  },
  {
    id: 'u35-g6',
    type: 'mcq',
    pointId: 'subjunctive-conditionals',
    stem: 'I wish I ______ proficient in French, so I could work for the international programme.',
    options: ['am', 'was', 'were', 'will be'],
    answerIndex: 2,
    explanation:
      'wish 后与现在事实相反的虚拟用过去式，be 用 were，故选 C；A、D 为陈述语气，B 中 was 不用于规范虚拟语气。',
  },
  {
    id: 'u35-f1',
    type: 'fill',
    pointId: 'noun-clause-subject-predicative',
    stem: '______ she chose nursing as her profession is known to us all.（填一个恰当的连接词：that / what）',
    answer: 'that',
    explanation:
      '从句“她选择护理为业”成分完整，不缺主干成分，句首主语从句用 that 引导。',
  },
  {
    id: 'u35-f2',
    type: 'fill',
    pointId: 'noun-clause-subject-predicative',
    stem: 'The question is ______ the young candidate can qualify for the final interview.（填一个恰当的连接词：whether / that）',
    answer: 'whether',
    explanation:
      '表语从句表“是否能”，且此处表疑问，用 whether；if 不能引导表语从句。',
  },
  {
    id: 'u35-f3',
    type: 'fill',
    pointId: 'subjunctive-conditionals',
    stem: 'If I ______ (have) a chance to start again, I would study biographies of great engineers.（填所给词的正确形式，表与现在相反）',
    answer: 'had',
    explanation:
      '与现在事实相反的虚拟条件句用过去式，填 had。',
  },
  {
    id: 'u35-f4',
    type: 'fill',
    pointId: 'subjunctive-conditionals',
    stem: 'He talks about the job as if he ______ (be) the manager himself.（填所给词的正确形式，表与现在相反的虚拟）',
    answer: 'were',
    explanation:
      'as if 后与现在事实相反的虚拟中 be 动词用 were，填 were。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit15GrammarPoints, exercises: unit15Exercises };
