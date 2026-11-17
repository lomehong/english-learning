import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修三 Unit 1（Festivals and Celebrations）语法点：情态动词表推测 / 情态动词表许可与请求 */

export const unit6GrammarPoints: GrammarPoint[] = [
  {
    id: 'modal-speculation',
    title: '情态动词表推测（must / might / could / can\'t）',
    tagline: '依据所见线索对现在的情况作出肯定、可能或否定的推断。',
    forms: [
      { label: '肯定推测', detail: '主语 + must be / must be doing …（一定是……）' },
      { label: '可能推测', detail: '主语 + might（may）/ could be …（可能是……）' },
      { label: '否定推测', detail: '主语 + can\'t be …（不可能是……）' },
    ],
    usages: [
      'must 表示有把握的肯定推测，意为“一定、准是”，只用于肯定句',
      'might / could 表示把握不大的推测，语气比 may 更委婉、更不确定',
      'can\'t 表示有把握的否定推测；疑问句中的推测用 can 提问（Can it be true?）',
      '对已发生的情况推测用 must / might / can\'t + have + 过去分词',
    ],
    markers: ['must be', 'might be', 'could be', 'can\'t be', 'Look at …', 'obviously'],
    examples: [
      { en: 'Look at the lanterns everywhere! The festival must be very important here.', zh: '到处都是灯笼！这个节日在这里一定非常重要。' },
      { en: 'She might be watching the ceremony now, but I am not sure.', zh: '她现在可能正在看典礼，但我不确定。' },
      { en: 'That can\'t be the origin of the festival — the book says otherwise.', zh: '那不可能是这个节日的起源——书上说的不一样。' },
    ],
    tips: [
      '推测意义上的 must 否定式不是 mustn\'t（mustn\'t 表“禁止”），而是 can\'t',
      '表推测时 might 并不一定是 may 的过去式，只是语气更委婉',
      '对状态推测接动词原形（must be），对正在进行的事推测接 be doing',
    ],
  },
  {
    id: 'modal-permission',
    title: '情态动词表许可与请求（may / can / could / would）',
    tagline: '用于征得许可、礼貌提出请求或发出邀请。',
    forms: [
      { label: '请求许可', detail: 'May / Can / Could I …?（我可以……吗？）' },
      { label: '礼貌请求', detail: 'Could / Would you (please) …?（请您……好吗？）' },
      { label: '发出邀请', detail: 'Would you like to …?（你愿意……吗？）' },
    ],
    usages: [
      'may 征求许可最正式客气，常用于对长辈或正式场合；can 较口语化',
      'could / would 在请求中不指过去，而是比 can / will 更客气委婉',
      '常用应答：Certainly. / Of course. / Sure. / I am afraid not.',
      '邀请对方做某事用 Would you like to …?，问对方是否喜欢用 Do you like …?',
    ],
    markers: ['May I …', 'Could you …', 'Would you like …', 'please', 'Of course'],
    examples: [
      { en: 'May I take photos during the ceremony?', zh: '典礼期间我可以拍照吗？' },
      { en: 'Could you tell me the origin of this festival?', zh: '您能告诉我这个节日的由来吗？' },
      { en: 'Would you like to join us for the New Year dinner?', zh: '你愿意和我们一起吃年夜饭吗？' },
    ],
    tips: [
      'May I …? 的否定回答常用 No, you may not. / I am afraid not.，语气委婉',
      'could 表客气请求时，肯定回答用 can：— Could you help me? — Of course I can.',
      'Would you like…? 后接名词或 to do，不接 doing',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自必修三 Unit 1 Festivals and Celebrations */
export const unit6Exercises: GrammarExercise[] = [
  {
    id: 'u21-g1',
    type: 'mcq',
    pointId: 'modal-speculation',
    stem: 'Look at the crowds and the colourful lanterns! Today ______ the Lantern Festival.',
    options: ['must be', 'can\'t be', 'mustn\'t be', 'need be'],
    answerIndex: 0,
    explanation:
      '街头的人群与彩灯是可靠线索，有把握的肯定推测用 must be；can\'t be 表否定推测，mustn\'t 表“禁止”，均不合语境，故选 A。',
  },
  {
    id: 'u21-g2',
    type: 'mcq',
    pointId: 'modal-speculation',
    stem: 'The shop is dark and the door is locked. It ______ open now.',
    options: ['must be', 'can be', 'can\'t be', 'might not be'],
    answerIndex: 2,
    explanation:
      '店堂漆黑、大门上锁，可断定“不可能”在营业，有把握的否定推测用 can\'t be，故选 C。',
  },
  {
    id: 'u21-g3',
    type: 'mcq',
    pointId: 'modal-permission',
    stem: '______ I use your phone to call my parents? Mine is out of power.',
    options: ['Must', 'May', 'Would', 'Might'],
    answerIndex: 1,
    explanation:
      '向对方征得许可用 May I …?，正式客气；Would 不能用于请求许可，Must 表必须，Might I 虽可表许可但此处语义不当，故选 B。',
  },
  {
    id: 'u21-g4',
    type: 'mcq',
    pointId: 'modal-permission',
    stem: '______ you please pass me the riddle card on the table?',
    options: ['Must', 'Might', 'Could', 'Shall'],
    answerIndex: 2,
    explanation:
      '请对方做某事用 Could you (please) …? 委婉提出请求；Shall 用于提建议（Shall we…?），不用于请你做事，故选 C。',
  },
  {
    id: 'u21-g5',
    type: 'mcq',
    pointId: 'modal-speculation',
    stem: 'Lily is not in the classroom. She ______ in the library, but I am not sure.',
    options: ['must be', 'can\'t be', 'might be', 'mustn\'t be'],
    answerIndex: 2,
    explanation:
      '由 but I am not sure 可知把握不大，表可能的推测用 might be；must be 太绝对，can\'t be 表否定推测，故选 C。',
  },
  {
    id: 'u21-g6',
    type: 'mcq',
    pointId: 'modal-permission',
    stem: '______ you like to watch the fireworks with us tonight?',
    options: ['Would', 'May', 'Must', 'Could'],
    answerIndex: 0,
    explanation:
      '发出邀请的固定句型是 Would you like to do …?；May 用于请求许可，Could 用于请求做事，均不与 like 搭配，故选 A。',
  },
  {
    id: 'u21-f1',
    type: 'fill',
    pointId: 'modal-speculation',
    stem: 'The lights are on and music is playing. Someone ______ ______ (be) at home right now.',
    answer: 'must be',
    explanation:
      '灯亮着、音乐响着，线索充分，有把握的肯定推测用 must be，意为“一定在家”。',
  },
  {
    id: 'u21-f2',
    type: 'fill',
    pointId: 'modal-speculation',
    stem: 'That ______ (can) be Tom\'s coat — he is much taller than that.',
    answer: 'can\'t',
    acceptable: ['cannot', 'can not'],
    explanation:
      '由 he is much taller 可知是否定推测：“不可能是他的外套”，can 表推测时否定形式为 can\'t。',
  },
  {
    id: 'u21-f3',
    type: 'fill',
    pointId: 'modal-permission',
    stem: '______ I bring my little sister to the celebration? (may)',
    answer: 'May',
    explanation:
      '征得对方许可用 May I …?，句首字母大写，意为“我可以带妹妹来参加庆祝活动吗”。',
  },
  {
    id: 'u21-f4',
    type: 'fill',
    pointId: 'modal-speculation',
    stem: 'It is cloudy this evening. It ______ (might) rain during the parade.',
    answer: 'might',
    explanation:
      '乌云密布只是不确定的线索，把握不大的推测用 might，意为“游行时可能会下雨”。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit6GrammarPoints, exercises: unit6Exercises };
