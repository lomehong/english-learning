import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修三 Unit 4（Adversity and Courage）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 4 词表），避免任何教材原文版权问题。
 */

export const unit29Passages: ReadingPassage[] = [
  {
    id: 'u29-p1',
    title: 'Courage on the Ice',
    genre: '记叙文',
    paragraphs: [
      'In 1914, a ship carrying twenty-eight men set sail for Antarctica. Before they arrived, the ice trapped the ship, and the men had to face a terrible ordeal on the frozen sea.',
      'Their leader refused to abandon hope. When the ship began to collapse under the ice, he ordered his men to save three small boats and supplies for survival. For months, they lived on the ice, enduring hardship that would break most people. Some fell into despair, but the leader\u2019s calm resolve held the team together.',
      'At last, they reached a lonely island. Then the leader and five fearless men crossed eight hundred miles of stormy ocean to find help. Not a single man was lost. Their story, born in adversity, still teaches us what true courage means.',
    ],
    glossary: [
      { wordId: 'ordeal', forms: ['ordeal'] },
      { wordId: 'abandon', forms: ['abandon'] },
      { wordId: 'collapse', forms: ['collapse'] },
      { wordId: 'survival', forms: ['survival'] },
      { wordId: 'hardship', forms: ['hardship'] },
      { wordId: 'despair', forms: ['despair'] },
      { wordId: 'resolve', forms: ['resolve'] },
      { wordId: 'fearless', forms: ['fearless'] },
      { wordId: 'adversity', forms: ['adversity'] },
      { wordId: 'courage', forms: ['courage'] },
    ],
    questions: [
      {
        id: 'u29-p1-q1',
        type: 'detail',
        stem: 'What did the leader order his men to save?',
        options: [
          'Three small boats and supplies.',
          'The ship\u2019s gold.',
          'Their letters.',
          'Fishing nets.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "he ordered his men to save three small boats and supplies for survival" 可知他命令救下三条小船与补给，故选 A；B、C、D 文中均未提及。',
      },
      {
        id: 'u29-p1-q2',
        type: 'detail',
        stem: 'How did the leader and five men find help?',
        options: [
          'By walking across the ice.',
          'By crossing eight hundred miles of stormy ocean.',
          'By flying a plane.',
          'By waiting on the ship.',
        ],
        answerIndex: 1,
        explanation:
          '由末段 "crossed eight hundred miles of stormy ocean to find help" 可知他们横渡八百英里风暴海域求援，故选 B；A、C、D 与原文不符。',
      },
      {
        id: 'u29-p1-q3',
        type: 'inference',
        stem: 'What can we infer about the leader from the passage?',
        options: [
          'He gave up before the ice broke.',
          'His calm and resolve kept the team alive.',
          'He cared only about himself.',
          'He knew nothing about the sea.',
        ],
        answerIndex: 1,
        explanation:
          '文中写他拒绝放弃希望、以沉着决心凝聚队伍，最终全员生还，可推知他的冷静与决心是团队幸存的关键，故选 B；A、C、D 与原文描述相反。',
      },
    ],
  },
  {
    id: 'u29-p2',
    title: 'The Girl Who Would Not Quit',
    genre: '记叙文',
    paragraphs: [
      'When a car accident took her left leg, the young runner Lin Qing met the greatest misfortune of her life. For weeks, she trembled whenever she tried to stand on the new prosthetic leg, and frustration filled her days.',
      'Yet Qing refused to stay down. Every setback became a step forward: she trained in the pool first, then on the track. The biggest obstacle was not the track but the fear inside her. Through daily practice and the persistence of her coach, she slowly overcame it and built surprising endurance.',
      'A year later, Qing ran her first race again and finished third. Reporters called her resilient, but she simply smiled and said she was hopeful about tomorrow. Adversity bends us, she added, yet it cannot break a willing heart.',
    ],
    glossary: [
      { wordId: 'misfortune', forms: ['misfortune'] },
      { wordId: 'tremble', forms: ['trembled'] },
      { wordId: 'frustration', forms: ['frustration'] },
      { wordId: 'setback', forms: ['setback'] },
      { wordId: 'obstacle', forms: ['obstacle'] },
      { wordId: 'persistence', forms: ['persistence'] },
      { wordId: 'overcome', forms: ['overcame'] },
      { wordId: 'endurance', forms: ['endurance'] },
      { wordId: 'resilient', forms: ['resilient'] },
      { wordId: 'hopeful', forms: ['hopeful'] },
      { wordId: 'adversity', forms: ['Adversity'] },
    ],
    questions: [
      {
        id: 'u29-p2-q1',
        type: 'detail',
        stem: 'What was the biggest obstacle for Qing?',
        options: [
          'The lack of a coach.',
          'The busy training pool.',
          'The fear inside her.',
          'Her school lessons.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "The biggest obstacle was not the track but the fear inside her" 可知最大的障碍是她内心的恐惧，故选 C；A、B、D 均与原文不符。',
      },
      {
        id: 'u29-p2-q2',
        type: 'detail',
        stem: 'What place did Qing get in her first race after recovery?',
        options: [
          'First.',
          'Third.',
          'Second.',
          'Last.',
        ],
        answerIndex: 1,
        explanation:
          '由末段 "ran her first race again and finished third" 可知她重返赛场的首场比赛获得第三名，故选 B；A、C、D 与原文不符。',
      },
      {
        id: 'u29-p2-q3',
        type: 'main-idea',
        stem: 'Which of the following best describes Lin Qing?',
        options: [
          'Strong-willed in the face of hardship.',
          'Talented but lazy.',
          'Afraid of competition.',
          'Luckier than others.',
        ],
        answerIndex: 0,
        explanation:
          '全文概括了她截肢后直面挫折、坚持训练并重返赛场的过程，可概括为「面对苦难意志坚强」，故选 A；B、C、D 与文章内容相悖。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit29Passages;
