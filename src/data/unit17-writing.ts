import type { WritingTask } from '../types';

/**
 * 人教2019必修二 Unit 2（Wildlife Protection）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用本单元词表），
 * 体裁与要求对接教材单元写作板块（应用文演讲稿 + 记叙文校刊投稿）。
 */

export const unit7WritingTasks: WritingTask[] = [
  {
    id: 'u17-w1',
    title: 'Protecting Wildlife Starts with Us',
    genre: '应用文 · 演讲稿',
    wordHint: '词数 80 左右',
    prompt:
      '你校英语俱乐部将举办以「保护野生动物」为主题的班会演讲。请根据以下要点，用英语写一篇演讲稿，在班会上演讲：',
    requirements: [
      '指出问题：许多物种濒临灭绝，栖息地遭到破坏；',
      '介绍已采取的措施（自然保护区、法律等）及其效果；',
      '呼吁同学们行动起来（拒绝毛皮制品、宣传保护知识等）。',
    ],
    modelEssay: [
      'Dear teachers and classmates,',
      'Today I want to talk about wildlife protection. As we all know, many species are in danger of extinction. Hunters once killed rare animals for fur, and their habitats are being destroyed.',
      'However, hope remains. Reserves have been set up, and strict laws are now in effect. As students, we can also take effective measures: refuse to buy products made of fur, and tell more people about the value of wildlife.',
      'Let\u2019s work together so that wild animals can live safely on this planet. Thank you!',
    ],
    checklist: [
      '是否涵盖全部三个要点（问题、措施、呼吁）？',
      '是否至少用到 3 个本单元词汇（如 wildlife / species / habitat / reserve / measure）？',
      '是否正确使用被动语态（are being destroyed / have been set up 等）？',
      '演讲语气是否有感染力，开头称呼与结尾致谢是否完整？',
      '词数是否 80 左右？',
    ],
  },
  {
    id: 'u17-w2',
    title: 'The Return of the Deer',
    genre: '记叙文 · 校刊投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英文报「Nature」栏目正在征文。请根据以下要点，以「The Return of the Deer」为题，用英语写一篇短文投稿，记述你班参观自然保护区的见闻：',
    requirements: [
      '简述该保护区麋鹿曾经的处境（被猎杀、濒临灭绝）与现状；',
      '介绍护林员的工作（观察、研究、救治）；',
      '描写你看到鹿群自由奔跑时的感悟。',
    ],
    modelEssay: [
      'The Return of the Deer',
      'Last month, our class visited a nature reserve in the west of our province. Twenty years ago, the deer there nearly became extinct because hunters shot them for fur. Thanks to years of protection, the population has now grown to over one thousand.',
      'Rangers told us how they observe the deer with cameras and study how the animals adapt to the changing habitat. Every sick animal is taken to the station and carefully treated until it recovers.',
      'Standing on the watchtower, I watched a group of deer running freely across the grassland. At that moment, I understood the true meaning of protection: when humans change their ways, nature will give us the most beautiful reply.',
    ],
    checklist: [
      '是否按「总—分—总」结构组织，三个要点齐全？',
      '是否使用一般过去时叙述经历，被动语态（is taken / treated）运用正确？',
      '是否至少用到 3 个本单元词汇（如 extinct / population / observe / adapt / habitat）？',
      '是否使用连接词（Thanks to / Until / At that moment 等）使行文连贯？',
      '词数是否 100 左右，标题「The Return of the Deer」是否保留？',
    ],
  },
];

const taskById = new Map(unit7WritingTasks.map((t) => [t.id, t]));

export function getWritingTask(id: string): WritingTask | undefined {
  return taskById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7WritingTasks;
