import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修一 Unit 5（Working the Land）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 5 词表），避免任何教材原文版权问题。
 */

export const unit10Passages: ReadingPassage[] = [
  {
    id: 'u10-p1',
    title: 'The Farmer Who Fed Millions',
    genre: '说明文',
    paragraphs: [
      'When Yuan Longping graduated from college in the 1950s, he saw hunger in the countryside with his own eyes. From then on, he devoted himself to one dream: making rice grow stronger.',
      'At that time, conventional rice had a low yield, and many experts believed hybrid rice was impossible. Yuan did not agree. He searched the fields under the hot sun for years, examined thousands of rice plants, and finally found the wild rice he needed.',
      'His hybrid rice greatly raised the output of grain, and the technology later reached many countries. Whole villages escaped poverty, and new generations of farmers see him as a hero. Yuan often said his vision was simple: let every bowl be filled with rice.',
    ],
    glossary: [
      { wordId: 'conventional', forms: ['conventional'] },
      { wordId: 'yield', forms: ['yield'] },
      { wordId: 'hybrid', forms: ['hybrid'] },
      { wordId: 'output', forms: ['output'] },
      { wordId: 'grain', forms: ['grain'] },
      { wordId: 'poverty', forms: ['poverty'] },
      { wordId: 'generation', forms: ['generations'] },
      { wordId: 'vision', forms: ['vision'] },
    ],
    questions: [
      {
        id: 'u10-r1-1',
        type: 'detail',
        stem: 'What did many experts believe about hybrid rice at first?',
        options: [
          'It was impossible.',
          'It was already popular everywhere.',
          'It needed no further research.',
          'It could only grow in foreign countries.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "many experts believed hybrid rice was impossible" 可知起初许多专家认为杂交水稻不可能实现，故选 A。',
      },
      {
        id: 'u10-r1-2',
        type: 'detail',
        stem: 'How did Yuan Longping find the wild rice he needed?',
        options: [
          'By searching fields and examining thousands of plants.',
          'By buying it from a foreign laboratory.',
          'By reading ancient farming books.',
          'By asking students to plant it at school.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "He searched the fields under the hot sun for years, examined thousands of rice plants, and finally found the wild rice" 可知他靠多年下田寻找、逐株检查才找到所需野生稻，故选 A。',
      },
      {
        id: 'u10-r1-3',
        type: 'main-idea',
        stem: 'What is the passage mainly about?',
        options: [
          'How Yuan Longping developed hybrid rice and changed farming.',
          'Why conventional rice tastes better than hybrid rice.',
          'The best way to cook rice dishes.',
          'Daily life in a foreign farming village.',
        ],
        answerIndex: 0,
        explanation:
          '全文概括了袁隆平从立志、寻找野生稻到杂交水稻推广并帮助村民脱贫的历程，可概括为“袁隆平如何培育杂交水稻并改变农业”，故选 A。',
      },
    ],
  },
  {
    id: 'u10-p2',
    title: 'Welcome to Sunshine Organic Farm',
    genre: '应用文',
    paragraphs: [
      'Sunshine Organic Farm lies thirty kilometres east of the city. For twenty years, no chemical pesticide has been used on our land.',
      'Instead, we feed the soil with natural fertiliser made from plants and animals. Our wheat and vegetables grow slowly, but they are rich in nutrition and minerals. Visitors can pick vegetables, collect eggs, and learn how a seed becomes food. Our farmers will also show you how earthworms digest the soil and keep it healthy.',
      'Farm lunch is provided at noon, with dishes made from the day\u2019s harvest. Essential tips: wear old shoes and bring a hat. Come and enjoy a day of real work and real food!',
    ],
    glossary: [
      { wordId: 'organic', forms: ['Organic'] },
      { wordId: 'pesticide', forms: ['pesticide'] },
      { wordId: 'soil', forms: ['soil'] },
      { wordId: 'fertiliser', forms: ['fertiliser'] },
      { wordId: 'wheat', forms: ['wheat'] },
      { wordId: 'nutrition', forms: ['nutrition'] },
      { wordId: 'mineral', forms: ['minerals'] },
      { wordId: 'digest', forms: ['digest'] },
      { wordId: 'essential', forms: ['Essential'] },
    ],
    questions: [
      {
        id: 'u10-r2-1',
        type: 'detail',
        stem: 'What is used to feed the soil on the farm?',
        options: [
          'Natural fertiliser made from plants and animals.',
          'Chemical pesticide from the city.',
          'Imported minerals only.',
          'Nothing at all.',
        ],
        answerIndex: 0,
        explanation:
          '由 "we feed the soil with natural fertiliser made from plants and animals" 可知农场用天然肥料滋养土壤，故选 A。',
      },
      {
        id: 'u10-r2-2',
        type: 'purpose',
        stem: 'What is the purpose of the \u201cEssential tips\u201d at the end of the passage?',
        options: [
          'To help visitors prepare for farm activities.',
          'To sell old shoes and hats to visitors.',
          'To warn people away from the farm.',
          'To explain the lunch menu in detail.',
        ],
        answerIndex: 0,
        explanation:
          '结尾提示穿旧鞋、戴帽子，显然是帮助访客为农活做好准备，故选 A；B、C、D 均与文意不符。',
      },
      {
        id: 'u10-r2-3',
        type: 'inference',
        stem: 'What can we infer about the vegetables on the farm?',
        options: [
          'They grow more slowly but are healthier.',
          'They are picked by machines only.',
          'They are bought from the city market.',
          'They never need water or sunshine.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Our wheat and vegetables grow slowly, but they are rich in nutrition and minerals" 可推知农场蔬菜长得慢但更健康，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10Passages;
