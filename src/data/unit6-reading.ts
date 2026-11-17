import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修一 Unit 1（People of Achievement）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 1 词表），避免任何教材原文版权问题。
 */

export const unit6Passages: ReadingPassage[] = [
  {
    id: 'u6-p1',
    title: 'A Gift from a Chinese Scientist',
    genre: '说明文',
    paragraphs: [
      'Tu Youyou is one of the most respected scientists in China. After graduating from college, she joined a famous institute of medicine in Beijing and committed herself to finding a cure for malaria.',
      'At first, her team had to analyse thousands of old medical texts and test hundreds of herbs. In 1971, they finally extracted a special substance from sweet wormwood. To test its safety, Tu insisted on trying the medicine herself before giving it to any patient.',
      'Her devotion gradually changed the world: the new treatment spread across Africa and Asia and has saved millions of lives ever since. In 2015, Tu shared the Nobel Prize — an extraordinary honour for a modest researcher who always says the success belongs to her team.',
    ],
    glossary: [
      { wordId: 'institute', forms: ['institute'] },
      { wordId: 'commit', forms: ['committed'] },
      { wordId: 'analyse', forms: ['analyse'] },
      { wordId: 'substance', forms: ['substance'] },
      { wordId: 'insist', forms: ['insisted'] },
      { wordId: 'devotion', forms: ['devotion'] },
      { wordId: 'gradually', forms: ['gradually'] },
      { wordId: 'extraordinary', forms: ['extraordinary'] },
    ],
    questions: [
      {
        id: 'u6-r1-1',
        type: 'detail',
        stem: 'According to Paragraph 2, what did Tu Youyou\u2019s team extract from sweet wormwood?',
        options: [
          'A special substance.',
          'A new device.',
          'A kind of herb tea.',
          'An old patent.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "they finally extracted a special substance from sweet wormwood" 可知团队提取出一种特殊物质，故选 A；其余选项文中均未提及。',
      },
      {
        id: 'u6-r1-2',
        type: 'detail',
        stem: 'Why did Tu Youyou insist on trying the medicine herself?',
        options: [
          'To test its safety before giving it to patients.',
          'Because the patients refused to take it.',
          'To win the Nobel Prize more quickly.',
          'Because her team was too busy to help.',
        ],
        answerIndex: 0,
        explanation:
          '由 "To test its safety, Tu insisted on trying the medicine herself before giving it to any patient" 可知她为验证安全性而以身试药，故选 A。',
      },
      {
        id: 'u6-r1-3',
        type: 'main-idea',
        stem: 'What is the passage mainly about?',
        options: [
          'How Tu Youyou and her team devoted themselves to fighting malaria.',
          'Why old medical texts are difficult to read.',
          'The history of the Nobel Prize.',
          'Travelling across Africa and Asia.',
        ],
        answerIndex: 0,
        explanation:
          '全文概括了屠呦呦团队寻找疟疾疗法、以身试药并最终获奖的历程，可概括为“屠呦呦及其团队投身抗疟事业”，故选 A；B、C、D 均偏离主题。',
      },
    ],
  },
  {
    id: 'u6-p2',
    title: 'The Professor of the Stars',
    genre: '记叙文',
    paragraphs: [
      'Mr Lin was a professor of physics who taught in a small college for thirty years. After retirement, his passion for the night sky grew even stronger. On every clear evening, he carried a homemade telescope to the playground and waited patiently for the stars.',
      'Over time, this remarkable old man invented a simple device that made the telescope easier for children to use. A company bought his patent and paid him well, but Mr Lin gave most of the money to the school library.',
      'Students love to call him \u201ca genius of the playground\u201d. Yet Mr Lin always acknowledges that he is simply curious. He hopes his story will lead more young people to look up and dream — that, he says, is the best consequence of a life spent with the stars.',
    ],
    glossary: [
      { wordId: 'professor', forms: ['professor'] },
      { wordId: 'passion', forms: ['passion'] },
      { wordId: 'device', forms: ['device'] },
      { wordId: 'patent', forms: ['patent'] },
      { wordId: 'remarkable', forms: ['remarkable'] },
      { wordId: 'genius', forms: ['genius'] },
      { wordId: 'acknowledge', forms: ['acknowledges'] },
      { wordId: 'consequence', forms: ['consequence'] },
    ],
    questions: [
      {
        id: 'u6-r2-1',
        type: 'detail',
        stem: 'What did Mr Lin do with most of the money from his patent?',
        options: [
          'He gave it to the school library.',
          'He bought himself a new telescope.',
          'He travelled around the world.',
          'He saved it for his family.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "Mr Lin gave most of the money to the school library" 可知他把大部分钱捐给了学校图书馆，故选 A。',
      },
      {
        id: 'u6-r2-2',
        type: 'inference',
        stem: 'What can we infer about Mr Lin from the passage?',
        options: [
          'He stays modest although he is talented.',
          'He dislikes playing with children.',
          'He stopped watching stars after retirement.',
          'He prefers money to fame.',
        ],
        answerIndex: 0,
        explanation:
          '由末段他总承认自己“只是好奇”，以及捐出专利收入可知他虽才华出众却十分谦逊，可推知 A 正确；B、C、D 与文中事实相反或无依据。',
      },
      {
        id: 'u6-r2-3',
        type: 'purpose',
        stem: 'Why does the author quote Mr Lin\u2019s words in the last paragraph?',
        options: [
          'To show how his passion may inspire young people.',
          'To prove that telescopes are expensive.',
          'To explain why libraries need donations.',
          'To advise readers to buy patents.',
        ],
        answerIndex: 0,
        explanation:
          '末段引用他“希望自己的故事能让更多年轻人仰望星空、心怀梦想”的话语，目的是说明他的热爱对青少年的激励作用，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6Passages;
