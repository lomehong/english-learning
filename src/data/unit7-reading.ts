import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修一 Unit 2（Looking into the Future）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 2 词表），避免任何教材原文版权问题。
 */

export const unit7Passages: ReadingPassage[] = [
  {
    id: 'u7-p1',
    title: 'A Glimpse of the Smart City',
    genre: '说明文',
    paragraphs: [
      'What will our city look like in twenty years? Nobody can predict the future with certainty, but experts believe that innovation will completely transform the way we live, work and travel.',
      'By then, most homes will depend on solar energy, which is clean and sustainable. Artificial intelligence will manage daily routines, while thousands of small sensors will detect problems in the streets and report them before they become serious.',
      'Some people worry that such a smart city may threaten personal privacy, so designers promise to protect every family\u2019s data. If these challenges are solved, city life in the future will be safer and more efficient than ever.',
    ],
    glossary: [
      { wordId: 'predict', forms: ['predict'] },
      { wordId: 'innovation', forms: ['innovation'] },
      { wordId: 'transform', forms: ['transform'] },
      { wordId: 'solar', forms: ['solar'] },
      { wordId: 'sustainable', forms: ['sustainable'] },
      { wordId: 'routine', forms: ['routines'] },
      { wordId: 'sensor', forms: ['sensors'] },
      { wordId: 'detect', forms: ['detect'] },
      { wordId: 'efficient', forms: ['efficient'] },
      { wordId: 'privacy', forms: ['privacy'] },
    ],
    questions: [
      {
        id: 'u7-r1-1',
        type: 'detail',
        stem: 'According to Paragraph 2, what will the small sensors in the streets do?',
        options: [
          'Report problems before they become serious.',
          'Clean the streets every night.',
          'Teach children at home.',
          'Sell solar energy to families.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "small sensors will detect problems in the streets and report them before they become serious" 可知传感器会提前发现并上报问题，故选 A。',
      },
      {
        id: 'u7-r1-2',
        type: 'detail',
        stem: 'What promise do the designers make in Paragraph 3?',
        options: [
          'To protect every family\u2019s data.',
          'To remove all the street sensors.',
          'To build more gas stations.',
          'To stop using artificial intelligence.',
        ],
        answerIndex: 0,
        explanation:
          '由第三段 "designers promise to protect every family\u2019s data" 可知设计者承诺保护每个家庭的数据，故选 A。',
      },
      {
        id: 'u7-r1-3',
        type: 'main-idea',
        stem: 'What is the passage mainly about?',
        options: [
          'Possible changes and challenges of a future smart city.',
          'The history of city building.',
          'How to repair street lights.',
          'The best way to travel abroad.',
        ],
        answerIndex: 0,
        explanation:
          '全文概括了未来智能城市在能源、管理与安全方面的变化，以及隐私方面的担忧，可概括为“未来智能城市的可能变化与挑战”，故选 A。',
      },
    ],
  },
  {
    id: 'u7-p2',
    title: 'Welcome to HomeMate 3.0',
    genre: '应用文',
    paragraphs: [
      'HomeMate 3.0 is a smart home system designed for busy families. It learns your daily routine and prepares everything before you ask.',
      'Every morning, the system studies the weather forecast and adjusts the temperature of each room. When it receives a signal from your phone, it will turn on the lights, boil water and even check the fridge. Its safety mode can detect smoke or gas within seconds and call for help at once.',
      'HomeMate 3.0 also cares about your privacy: all data stays in your own house. Visit our website this weekend and start your new life with a five-year guarantee. If you have any questions about its potential, our online engineers will be happy to help.',
    ],
    glossary: [
      { wordId: 'routine', forms: ['routine'] },
      { wordId: 'forecast', forms: ['forecast'] },
      { wordId: 'signal', forms: ['signal'] },
      { wordId: 'detect', forms: ['detect'] },
      { wordId: 'privacy', forms: ['privacy'] },
      { wordId: 'potential', forms: ['potential'] },
    ],
    questions: [
      {
        id: 'u7-r2-1',
        type: 'detail',
        stem: 'What does HomeMate 3.0 do after studying the weather forecast?',
        options: [
          'It adjusts the temperature of each room.',
          'It sends a signal to the fridge.',
          'It calls your family for help.',
          'It buys food from the supermarket.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "the system studies the weather forecast and adjusts the temperature of each room" 可知系统会调节每个房间的温度，故选 A。',
      },
      {
        id: 'u7-r2-2',
        type: 'purpose',
        stem: 'What is the main purpose of the last paragraph?',
        options: [
          'To encourage readers to try the product.',
          'To describe how smoke is detected.',
          'To complain about privacy problems.',
          'To compare different kinds of phones.',
        ],
        answerIndex: 0,
        explanation:
          '末段邀请读者周末访问网站开启新生活，并说明有五年质保与在线工程师答疑，写作意图是吸引读者购买使用该产品，故选 A。',
      },
      {
        id: 'u7-r2-3',
        type: 'inference',
        stem: 'What can we infer about HomeMate 3.0 from the passage?',
        options: [
          'It is designed with safety and privacy in mind.',
          'It needs repairing every single year.',
          'It only works well on rainy days.',
          'It sends family data to a public website.',
        ],
        answerIndex: 0,
        explanation:
          '由 "safety mode can detect smoke or gas" 与 "all data stays in your own house" 可推知该产品兼顾安全与隐私，故选 A；其余选项与原文相悖。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7Passages;
