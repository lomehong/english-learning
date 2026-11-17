import type { ReadingPassage } from '../types';

/**
 * 人教2019必修一 Unit 4（Natural Disasters）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 4 词表），避免任何教材原文版权问题。
 */

export const unit4Passages: ReadingPassage[] = [
  {
    id: 'u4-p1',
    title: 'The Night the Ground Shook',
    genre: '记叙文',
    paragraphs: [
      'At 11:46 p.m., a terrible earthquake struck Green Valley. The ground shook so hard that cups fell off tables, and the electricity went out within seconds. Li Hua, a senior high school student, was still awake, preparing for the next day\u2019s English test.',
      'Remembering the safety lessons at school, she stayed calm. She did not jump out of the window; instead, she hid under her desk and covered her head. When the shaking finally stopped, she put on her shoes and walked down the stairs instead of taking the lift.',
      'The next morning, the whole town lay in ruins. Hundreds of houses were destroyed, and several people were trapped under fallen walls. Rescue teams arrived quickly, and doctors gave first aid to the victims on the spot. Neighbours united to hand out food and water. Although the disaster caused great damage, the courage Li Hua saw that night gave her hope.',
    ],
    glossary: [
      { wordId: 'earthquake', forms: ['earthquake'] },
      { wordId: 'calm', forms: ['calm'] },
      { wordId: 'ruin', forms: ['ruins'] },
      { wordId: 'destroy', forms: ['destroyed'] },
      { wordId: 'trap', forms: ['trapped'] },
      { wordId: 'rescue', forms: ['Rescue', 'rescue'] },
      { wordId: 'aid', forms: ['aid'] },
      { wordId: 'victim', forms: ['victims'] },
      { wordId: 'unite', forms: ['united'] },
      { wordId: 'disaster', forms: ['disaster'] },
      { wordId: 'damage', forms: ['damage'] },
    ],
    questions: [
      {
        id: 'u4-r1-1',
        type: 'detail',
        stem: 'What was Li Hua doing when the earthquake struck?',
        options: [
          'She was sleeping in bed.',
          'She was preparing for an English test.',
          'She was taking the lift downstairs.',
          'She was handing out food and water.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "a senior high school student, was still awake, preparing for the next day\u2019s English test" 可知地震发生时她正 awake 备考，故选 B；A 与 awake 矛盾，C 是地震停止后的错误做法（文中走楼梯），D 是次日邻里互助的情节。',
      },
      {
        id: 'u4-r1-2',
        type: 'detail',
        stem: 'How did Li Hua protect herself during the shaking?',
        options: [
          'She jumped out of the window at once.',
          'She called the rescue team on the phone.',
          'She hid under her desk and covered her head.',
          'She ran to help her trapped neighbours.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "she hid under her desk and covered her head" 可知她躲到桌下并护住头部，故选 C；A 正是文中提醒不要做的（did not jump out of the window），B、D 均未提及。',
      },
      {
        id: 'u4-r1-3',
        type: 'inference',
        stem: 'What can we infer from the last paragraph?',
        options: [
          'The town was rebuilt within one night.',
          'People were too frightened to help each other.',
          'Only strangers from far away came to the rescue.',
          'People worked together and stayed hopeful after the disaster.',
        ],
        answerIndex: 3,
        explanation:
          '末段写到救援队、医生急救、邻里团结分发食物和水，且 "gave her hope"，可推知人们齐心互助并保持希望，故选 D；A 与 "lay in ruins" 不符，B 与 united 相悖，C 忽略了邻居的参与。',
      },
    ],
  },
  {
    id: 'u4-p2',
    title: 'After the Flood',
    genre: '新闻报道',
    paragraphs: [
      'Heavy rain hit Riverside Town last weekend, and the river rose quickly. Floodwater swept through the streets, damaging shops and cars. A bus crashed into a fallen tree on Bridge Road, but luckily no one was seriously hurt.',
      'About two hundred people lost their homes and were brought to a shelter at Sunshine Primary School. Volunteers cooked hot meals, and the government sent aid including tents, clean water and medicine. "The flood came so fast. It was a real shock," said Mr Chen, one of the victims. "But we feel safe here."',
      'Now the water has gone down, and lessons have been learned. The town will build higher walls along the river, and a new warning system will be set up next year. When the next drought or flood strikes, Riverside Town will be better prepared.',
    ],
    glossary: [
      { wordId: 'flood', forms: ['Floodwater', 'flood', 'Flood'] },
      { wordId: 'sweep', forms: ['swept'] },
      { wordId: 'damage', forms: ['damaging'] },
      { wordId: 'crash', forms: ['crashed'] },
      { wordId: 'shelter', forms: ['shelter'] },
      { wordId: 'aid', forms: ['aid'] },
      { wordId: 'shock', forms: ['shock'] },
      { wordId: 'victim', forms: ['victims'] },
      { wordId: 'drought', forms: ['drought'] },
      { wordId: 'strike', forms: ['strikes'] },
    ],
    questions: [
      {
        id: 'u4-r2-1',
        type: 'detail',
        stem: 'What happened to the bus on Bridge Road?',
        options: [
          'It was carried away by the flood.',
          'It crashed into a fallen tree.',
          'It helped take victims to the shelter.',
          'It was trapped in the school playground.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "A bus crashed into a fallen tree on Bridge Road" 可知公交车撞上了倒下的树，故选 B；A、C、D 均与原文不符。',
      },
      {
        id: 'u4-r2-2',
        type: 'detail',
        stem: 'What did the government send to the town?',
        options: [
          'New school buildings.',
          'Buses and cars.',
          'Tents, clean water and medicine.',
          'Higher walls along the river.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "the government sent aid including tents, clean water and medicine" 可知援助物资包括帐篷、净水和药品，故选 C；D 是来年才计划修建的堤墙。',
      },
      {
        id: 'u4-r2-3',
        type: 'purpose',
        stem: 'What is the writer\u2019s main purpose in the last paragraph?',
        options: [
          'To describe how beautiful the town is after the flood.',
          'To show that the town is preparing for future disasters.',
          'To ask readers to donate money to the victims.',
          'To explain why the bus accident happened.',
        ],
        answerIndex: 1,
        explanation:
          '末段写 "lessons have been learned"：加高河堤、来年建预警系统，"will be better prepared" 点明写作意图是说明小镇正为将来的灾害做准备，故选 B；A、C、D 均非末段内容。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit4Passages;
