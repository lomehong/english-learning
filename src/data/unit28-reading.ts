import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修三 Unit 3（Environmental Protection）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 3 词表），避免任何教材原文版权问题。
 */

export const unit28Passages: ReadingPassage[] = [
  {
    id: 'u28-p1',
    title: 'A Town That Changed',
    genre: '记叙文',
    paragraphs: [
      'Five years ago, Greenfield was a noisy town with a serious pollution problem. Factories sent dark smoke into the sky, people discarded plastic bags everywhere, and the river turned grey.',
      'Things began to change when the town started a recycling programme. Every family learned to sort their waste, and the amount sent to the landfill dropped by half. The factories were asked to cut carbon emissions, and two of them switched to renewable energy.',
      'Today the river runs clear again, birds have returned to the wetland, and the ecosystem is slowly recovering. The town also bans disposable cups at public events. Greenfield\u2019s story shows that local action can restore what carelessness once destroyed.',
    ],
    glossary: [
      { wordId: 'pollution', forms: ['pollution'] },
      { wordId: 'discard', forms: ['discarded'] },
      { wordId: 'recycle', forms: ['recycling'] },
      { wordId: 'landfill', forms: ['landfill'] },
      { wordId: 'carbon', forms: ['carbon'] },
      { wordId: 'emission', forms: ['emissions'] },
      { wordId: 'renewable', forms: ['renewable'] },
      { wordId: 'ecosystem', forms: ['ecosystem'] },
      { wordId: 'disposable', forms: ['disposable'] },
      { wordId: 'restore', forms: ['restore'] },
    ],
    questions: [
      {
        id: 'u28-p1-q1',
        type: 'detail',
        stem: 'What was Greenfield like five years ago?',
        options: [
          'The river turned grey because of pollution.',
          'The town banned all factories.',
          'Birds filled the wetland.',
          'Every family recycled waste.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "a serious pollution problem… and the river turned grey" 可知五年前小镇污染严重、河流变灰，故选 A；B、C、D 都是后来的变化，与五年前的情形相反。',
      },
      {
        id: 'u28-p1-q2',
        type: 'detail',
        stem: 'How much did the waste sent to the landfill drop?',
        options: [
          'By ten percent.',
          'By half.',
          'Not at all.',
          'To zero.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "the amount sent to the landfill dropped by half" 可知送往填埋场的垃圾减少了一半，故选 B；A、C、D 与原文数字不符。',
      },
      {
        id: 'u28-p1-q3',
        type: 'inference',
        stem: 'What can we infer about the town\u2019s future?',
        options: [
          'It will keep moving towards a greener life.',
          'It will soon give up the recycling programme.',
          'Factories will burn more coal.',
          'The river will turn grey again.',
        ],
        answerIndex: 0,
        explanation:
          '末段描述河流变清、鸟类回归、生态系统恢复并禁止一次性杯子，可推知小镇将继续走向绿色生活，故选 A；B、C、D 与文意相反或无依据。',
      },
    ],
  },
  {
    id: 'u28-p2',
    title: 'Saving the Forests',
    genre: '说明文',
    paragraphs: [
      'Forests are the lungs of our planet, but deforestation is making them smaller every year. When trees are cut down, wildlife loses its home, and the local climate grows hotter and drier.',
      'The situation continues to deteriorate because of wasteful land use. To slow it down, many countries have set up conservation areas where mining is forbidden and native vegetation is replanted. Scientists also watch rivers for chemical contamination that may harm both soil and animals.',
      'Everyone can help. Using rechargeable batteries lowers your footprint on the earth, and sharing the story of forests raises public awareness. Remember: every small green choice today protects a leaf, a tree, and finally the whole sky.',
    ],
    glossary: [
      { wordId: 'deforestation', forms: ['deforestation'] },
      { wordId: 'climate', forms: ['climate'] },
      { wordId: 'deteriorate', forms: ['deteriorate'] },
      { wordId: 'wasteful', forms: ['wasteful'] },
      { wordId: 'conservation', forms: ['conservation'] },
      { wordId: 'vegetation', forms: ['vegetation'] },
      { wordId: 'contamination', forms: ['contamination'] },
      { wordId: 'rechargeable', forms: ['rechargeable'] },
      { wordId: 'footprint', forms: ['footprint'] },
      { wordId: 'awareness', forms: ['awareness'] },
    ],
    questions: [
      {
        id: 'u28-p2-q1',
        type: 'detail',
        stem: 'According to Paragraph 1, what happens when trees are cut down?',
        options: [
          'Farms get more rain.',
          'Rivers run faster.',
          'The air becomes cleaner.',
          'Wildlife loses its home.',
        ],
        answerIndex: 3,
        explanation:
          '由第一段 "When trees are cut down, wildlife loses its home" 可知砍伐森林会使野生动物失去家园，故选 D；A、B、C 文中均未提及。',
      },
      {
        id: 'u28-p2-q2',
        type: 'detail',
        stem: 'What is forbidden in conservation areas?',
        options: [
          'Mining.',
          'Replanting trees.',
          'Watching rivers.',
          'Taking photos.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "conservation areas where mining is forbidden" 可知保护区内禁止采矿，故选 A；B 是保护区内鼓励的行为，C、D 与原文不符。',
      },
      {
        id: 'u28-p2-q3',
        type: 'purpose',
        stem: 'Why does the writer write the last paragraph?',
        options: [
          'To encourage readers to make green choices.',
          'To sell rechargeable batteries.',
          'To describe the history of mining.',
          'To warn people against visiting forests.',
        ],
        answerIndex: 0,
        explanation:
          '末段先列举使用充电电池、分享森林故事等做法，再以「每个绿色选择都在保护森林」收尾，目的是鼓励读者做出环保选择，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit28Passages;
