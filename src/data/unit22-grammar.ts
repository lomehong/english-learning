import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019必修三 Unit 2（Morals and Virtues）语法点：动词-ing形式作主语 / 动词-ing形式作宾语 */

export const unit7GrammarPoints: GrammarPoint[] = [
  {
    id: 'gerund-subject',
    title: '动词-ing形式作主语',
    tagline: '把一个动作作为句子谈论的对象，位于句首作主语。',
    forms: [
      { label: '基本结构', detail: 'Doing sth. + 谓语（谓语用第三人称单数）' },
      { label: '形式主语', detail: 'It is no use / no good / a waste of time doing sth.' },
      { label: '否定形式', detail: 'Not doing sth. + 谓语（not 位于 -ing 之前）' },
    ],
    usages: [
      '表示经常性、泛指的动作，说明该动作的价值、难易或影响',
      '-ing 短语作主语时谓语动词用单数形式',
      'It 作形式主语的常用句型：It is no use / no good / fun / a waste of time doing sth.',
      'It is worth doing sth. 值得做某事（worth 后也接 -ing）',
    ],
    markers: ['-ing 位于句首', 'It is no use', 'It is no good', 'It is a waste of time', 'It is worth'],
    examples: [
      { en: 'Helping others brings us true happiness.', zh: '帮助别人给我们带来真正的快乐。' },
      { en: 'Telling the truth is not always easy, but it is always right.', zh: '说真话并不总是容易的，但永远是正确的。' },
      { en: 'It is no use arguing about such a small thing.', zh: '为这么小的事争吵没有用。' },
    ],
    tips: [
      '-ing 作主语时谓语动词用单数：Helping others brings…（不是 bring）',
      'not 要放在 -ing 前面：Not knowing the answer made him nervous.',
      '泛指的习惯性动作多用 -ing 作主语，具体的某次行为更常用不定式',
    ],
  },
  {
    id: 'gerund-object',
    title: '动词-ing形式作宾语',
    tagline: '作动词或介词的宾语：一类动词后只接 -ing，介词后一律用 -ing。',
    forms: [
      { label: '动词 + -ing', detail: 'enjoy / finish / mind / practise / suggest / avoid + doing' },
      { label: '介词 + -ing', detail: 'be good at / look forward to / be devoted to + doing' },
      { label: '动词 + 宾语 + -ing', detail: 'sb. spend … (in) doing / stop sb. (from) doing' },
    ],
    usages: [
      '只接 -ing 作宾语的常见动词：enjoy, finish, mind, practise, suggest, avoid, consider, miss, keep',
      '介词后面接 -ing 形式：Thank you for helping me. / She is good at caring for patients.',
      '短语中的 to 是介词，后接 -ing：look forward to, be devoted to, get used to, pay attention to',
      '接 to do 与接 doing 意义不同：stop to do 停下来去做另一件事；stop doing 停止正在做的事',
    ],
    markers: ['enjoy', 'finish', 'mind', 'practise', 'suggest', 'look forward to', 'be worth'],
    examples: [
      { en: 'The old physician enjoys taking morning walks along the river.', zh: '这位老医生喜欢沿着河边晨走。' },
      { en: 'Would you mind opening the window for the patient?', zh: '你介意为病人打开窗户吗？' },
      { en: 'We are looking forward to hearing from our hero soon.', zh: '我们盼望着早日收到我们英雄的消息。' },
    ],
    tips: [
      'look forward to 中的 to 是介词，后接 -ing：looking forward to hearing（不是 to hear）',
      'stop doing 与 stop to do 意思不同，切勿混淆',
      'suggest doing sth. 表示建议做某事；suggest 后不接不定式',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自必修三 Unit 2 Morals and Virtues */
export const unit7Exercises: GrammarExercise[] = [
  {
    id: 'u22-g1',
    type: 'mcq',
    pointId: 'gerund-subject',
    stem: '______ others when they are in trouble is a traditional virtue.',
    options: ['Help', 'Helps', 'Helping', 'To helping'],
    answerIndex: 2,
    explanation:
      '句子的主语是“帮助别人”这一泛指动作，应用动词-ing 形式 Helping 位于句首，故选 C。',
  },
  {
    id: 'u22-g2',
    type: 'mcq',
    pointId: 'gerund-subject',
    stem: 'It is no use ______ about the failure. Let us cheer up and try again.',
    options: ['to complain', 'complaining', 'complain', 'complained'],
    answerIndex: 1,
    explanation:
      '句型 It is no use doing sth. 中，真正的主语用动词-ing 形式，故选 B。',
  },
  {
    id: 'u22-g3',
    type: 'mcq',
    pointId: 'gerund-object',
    stem: 'The kind physician enjoys ______ morning walks with her patients in the garden.',
    options: ['to take', 'taking', 'take', 'taken'],
    answerIndex: 1,
    explanation:
      'enjoy 后只接动词-ing 形式作宾语，故选 B。',
  },
  {
    id: 'u22-g4',
    type: 'mcq',
    pointId: 'gerund-object',
    stem: 'We are all looking forward to ______ from the brave girl again.',
    options: ['hear', 'hearing', 'heard', 'be heard'],
    answerIndex: 1,
    explanation:
      'look forward to 中的 to 是介词，后面接动词-ing 形式 hearing，故选 B。',
  },
  {
    id: 'u22-g5',
    type: 'mcq',
    pointId: 'gerund-object',
    stem: 'The students stopped ______ when the head teacher walked into the classroom.',
    options: ['to talk', 'talk', 'talking', 'talked'],
    answerIndex: 2,
    explanation:
      '班主任进来时学生们“停止讲话”，停止正在做的事用 stop doing，故选 C；stop to talk 表示“停下来开始讲话”，不合语境。',
  },
  {
    id: 'u22-g6',
    type: 'mcq',
    pointId: 'gerund-subject',
    stem: 'Reading stories about heroes ______ us a lot about virtue.',
    options: ['teach', 'teaches', 'have taught', 'are teaching'],
    answerIndex: 1,
    explanation:
      '动词-ing 短语 Reading stories… 作主语，谓语动词用第三人称单数形式 teaches，故选 B。',
  },
  {
    id: 'u22-f1',
    type: 'fill',
    pointId: 'gerund-subject',
    stem: '______ (help) others makes our life more meaningful.',
    answer: 'Helping',
    explanation:
      '动词-ing 短语作主语，位于句首，填 Helping（句首字母大写）。',
  },
  {
    id: 'u22-f2',
    type: 'fill',
    pointId: 'gerund-object',
    stem: 'Would you mind ______ (open) the window? It is a little hot here.',
    answer: 'opening',
    explanation:
      'mind 后接动词-ing 形式作宾语，填 opening。',
  },
  {
    id: 'u22-f3',
    type: 'fill',
    pointId: 'gerund-object',
    stem: 'She spends an hour every evening ______ (practise) speaking English with her friends.',
    answer: 'practising',
    explanation:
      'spend … (in) doing sth. 结构中，介词 in 后接动词-ing 形式；practise 本身也只接 doing，填 practising。',
  },
  {
    id: 'u22-f4',
    type: 'fill',
    pointId: 'gerund-subject',
    stem: 'It is a waste of time ______ (argue) about such a small thing.',
    answer: 'arguing',
    explanation:
      '句型 It is a waste of time doing sth. 中，真正的主语用动词-ing 形式，填 arguing。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit7GrammarPoints, exercises: unit7Exercises };
