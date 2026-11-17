import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修四 Unit 4（Sharing）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 4 词表），避免任何教材原文版权问题。
 */

export const unit14Passages: ReadingPassage[] = [
  {
    id: 'u14-p1',
    title: 'A Letter from the Mountain School',
    genre: '应用文 · 书信',
    paragraphs: [
      'Dear Mr Chen, I am writing from the village where your group built the clinic last year. This morning the doctor operated on a boy\u2019s arm, and his mother watched through the window with tears of joy. Such things never happened here before.',
      'Life is still not easy. The road becomes muddy after each rain, and the weekly market is far away. But the tailor you sent has taught six women to sew school uniforms, and the vegetables the students weeded and watered are now ripe. Your donation of books arrived last month, and we distributed them to every child in the school.',
      'The new housing gave twelve families warm rooms before winter, and their health and stability have improved beyond words. Last night the teachers drank a toast to your health, and we meant every word of it.',
    ],
    glossary: [
      { wordId: 'clinic', forms: ['clinic'] },
      { wordId: 'operate', forms: ['operated'] },
      { wordId: 'muddy', forms: ['muddy'] },
      { wordId: 'weekly', forms: ['weekly'] },
      { wordId: 'tailor', forms: ['tailor'] },
      { wordId: 'weed', forms: ['weeded'] },
      { wordId: 'ripe', forms: ['ripe'] },
      { wordId: 'donation', forms: ['donation'] },
      { wordId: 'distribute', forms: ['distributed'] },
      { wordId: 'housing', forms: ['housing'] },
      { wordId: 'stability', forms: ['stability'] },
      { wordId: 'toast', forms: ['toast'] },
    ],
    questions: [
      {
        id: 'u14-r1-1',
        type: 'detail',
        stem: 'What happened at the clinic this morning?',
        options: [
          'The doctor operated on a boy\u2019s broken arm.',
          'The doctor gave the writer some books.',
          'The tailor made a new school uniform.',
          'The students planted vegetables.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "the doctor operated on a boy\u2019s broken arm" 可知今早医生为男孩的断臂做了手术，故选 A；B、C、D 与该段内容不符。',
      },
      {
        id: 'u14-r1-2',
        type: 'detail',
        stem: 'What did the students do with the vegetables according to Paragraph 2?',
        options: [
          'They weeded and watered them, and they are ripe now.',
          'They sold them at the weekly market.',
          'They gave them away to the tailor.',
          'They cooked them for the doctor.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "the vegetables the students weeded and watered are now ripe" 可知学生们除草浇水，蔬菜现已成熟，故选 A。',
      },
      {
        id: 'u14-r1-3',
        type: 'inference',
        stem: 'What can we infer about the villagers\u2019 feelings towards the volunteers?',
        options: [
          'They are grateful for the changes brought by the volunteers.',
          'They are sorry that the volunteers took their land.',
          'They are angry about the muddy road.',
          'They are doubtful about the new houses.',
        ],
        answerIndex: 0,
        explanation:
          '信中写到含泪的喜悦、“改善得难以言表”、举杯祝福健康等细节，可推知村民对志愿者充满感激，故选 A；B、C、D 与信的基调不符。',
      },
    ],
  },
  {
    id: 'u14-p2',
    title: 'The Sharing Shelf',
    genre: '记叙文',
    paragraphs: [
      'At the corner of our community stands a wooden shelf that Grandpa Zhang built from an old trunk. Anyone may leave something on it, a comb, a warm hat, or a bag of rice, and anyone may take what they truly need. There is no shopkeeper and no paperwork.',
      'Last winter, a young nurse from the remote clinic found a stethoscope on the shelf. She had no money for a new one, and she cried when she saw it. The next month she returned with a box of picture books for the children of the street.',
      'Grandpa Zhang says the shelf runs on a simple bond of trust. The finance for repairs comes from small gifts, and neighbours discuss the plan at a weekly meeting. What began as a few boards is now the warmest corner of the whole block.',
    ],
    glossary: [
      { wordId: 'trunk', forms: ['trunk'] },
      { wordId: 'comb', forms: ['comb'] },
      { wordId: 'paperwork', forms: ['paperwork'] },
      { wordId: 'remote', forms: ['remote'] },
      { wordId: 'finance', forms: ['finance'] },
      { wordId: 'weekly', forms: ['weekly'] },
    ],
    questions: [
      {
        id: 'u14-r2-1',
        type: 'detail',
        stem: 'How does the Sharing Shelf work?',
        options: [
          'People leave things on it and take what they need.',
          'A shopkeeper sells everything at a low price.',
          'The community rents it to street sellers.',
          'Only old people may use it on Sundays.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "Anyone may leave something on it…and anyone may take what they truly need" 可知货架自由存取、各取所需，故选 A。',
      },
      {
        id: 'u14-r2-2',
        type: 'detail',
        stem: 'What did the young nurse bring back to the shelf?',
        options: [
          'A box of picture books for children.',
          'A new stethoscope for the clinic.',
          'A bag of rice and a warm hat.',
          'Some boards for the repairs.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "she returned with a box of picture books for the children of the street" 可知护士回赠了一箱图画书，故选 A。',
      },
      {
        id: 'u14-r2-3',
        type: 'main-idea',
        stem: 'What does the story mainly tell us?',
        options: [
          'A small act of sharing can build trust and warmth in a community.',
          'Shops with shopkeepers always earn more money.',
          'Old furniture should be thrown away quickly.',
          'Nurses need stethoscopes more than books.',
        ],
        answerIndex: 0,
        explanation:
          '全文围绕“共享货架”展开：以信任为纽带、以小善传递温暖，末段点明主旨，故选 A；B、C、D 均偏离主题。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit14Passages;
