import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修三 Unit 1（Art）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 1 词表），避免任何教材原文版权问题。
 */

export const unit26Passages: ReadingPassage[] = [
  {
    id: 'u26-p1',
    title: 'A Morning at the City Gallery',
    genre: '说明文',
    paragraphs: [
      'The City Gallery opened its doors again last Saturday with a new exhibition of modern Chinese art. A tall bronze sculpture of a horse stood at the entrance, welcoming every visitor with quiet dignity.',
      'Inside, more than sixty works were on show, including watercolours, portraits, and one huge mural painted directly on the wall. A guide explained that each sketch had taken the artist several weeks, and every colour had been chosen with great care.',
      'What impressed me most was a small abstract painting in the corner. Its lines were simple, yet the feeling was strong. I stood there for a long time, beginning to understand that art does not always need to look real to touch the heart.',
    ],
    glossary: [
      { wordId: 'gallery', forms: ['Gallery'] },
      { wordId: 'exhibition', forms: ['exhibition'] },
      { wordId: 'bronze', forms: ['bronze'] },
      { wordId: 'sculpture', forms: ['sculpture'] },
      { wordId: 'watercolour', forms: ['watercolours'] },
      { wordId: 'portrait', forms: ['portraits'] },
      { wordId: 'mural', forms: ['mural'] },
      { wordId: 'sketch', forms: ['sketch'] },
      { wordId: 'abstract', forms: ['abstract'] },
    ],
    questions: [
      {
        id: 'u26-p1-q1',
        type: 'detail',
        stem: 'What stood at the entrance of the gallery?',
        options: [
          'A bronze sculpture of a horse.',
          'A huge watercolour painting.',
          'A portrait of an old artist.',
          'A wall of photos.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "A tall bronze sculpture of a horse stood at the entrance" 可知入口处立着一尊青铜马雕塑，故选 A；B、C、D 文中均未提及。',
      },
      {
        id: 'u26-p1-q2',
        type: 'detail',
        stem: 'According to the guide, how long had each sketch taken the artist?',
        options: [
          'A few hours.',
          'Several weeks.',
          'Two days.',
          'One whole month.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "each sketch had taken the artist several weeks" 可知每幅素描都耗时数周，故选 B；A、C、D 与原文时间不符。',
      },
      {
        id: 'u26-p1-q3',
        type: 'inference',
        stem: 'What can we infer about the writer from the last paragraph?',
        options: [
          'He began to appreciate abstract art.',
          'He thought the painting was too simple to be art.',
          'He only liked realistic works.',
          'He hurried home without a second look.',
        ],
        answerIndex: 0,
        explanation:
          '末段作者写道他在这幅抽象画前站了很久，并开始明白艺术不必逼真也能打动人心，可推知他开始欣赏抽象艺术，故选 A；B、C、D 与文中描述相反或无依据。',
      },
    ],
  },
  {
    id: 'u26-p2',
    title: 'The Old Man Who Carves',
    genre: '记叙文',
    paragraphs: [
      'Mr Chen is a quiet old painter who lives next to our school. Every morning, he sits by the window and carves small figures out of wood while the light is still soft.',
      'In his youth, Mr Chen studied calligraphy and traditional painting, so his works carry a strong aesthetic sense. His favourite piece is a delicate ceramic bowl carved with lotus flowers; he calls it his small masterpiece. Friends say his artistic level is high, but he just smiles and keeps working.',
      'Last week, our art teacher invited him to talk to our class. He told us that a realistic eye for detail matters more than expensive tools. Seeing is a visual art, he said, but feeling is the deeper one. When he left, the whole class applauded warmly.',
    ],
    glossary: [
      { wordId: 'painter', forms: ['painter'] },
      { wordId: 'carve', forms: ['carves', 'carved'] },
      { wordId: 'calligraphy', forms: ['calligraphy'] },
      { wordId: 'aesthetic', forms: ['aesthetic'] },
      { wordId: 'delicate', forms: ['delicate'] },
      { wordId: 'ceramic', forms: ['ceramic'] },
      { wordId: 'masterpiece', forms: ['masterpiece'] },
      { wordId: 'artistic', forms: ['artistic'] },
      { wordId: 'realistic', forms: ['realistic'] },
      { wordId: 'visual', forms: ['visual'] },
    ],
    questions: [
      {
        id: 'u26-p2-q1',
        type: 'detail',
        stem: 'What is Mr Chen\u2019s favourite piece?',
        options: [
          'A ceramic bowl carved with lotus flowers.',
          'A painting of his old school.',
          'A wooden window frame.',
          'A set of expensive tools.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "His favourite piece is a delicate ceramic bowl carved with lotus flowers" 可知他最爱的作品是刻有莲花的陶瓷碗，故选 A；B、C、D 均与原文不符。',
      },
      {
        id: 'u26-p2-q2',
        type: 'detail',
        stem: 'What did Mr Chen tell the class about detail and tools?',
        options: [
          'Only expensive tools can make great art.',
          'Students should stop carving wood.',
          'A careful eye for detail matters more than costly tools.',
          'Seeing is less important than hearing.',
        ],
        answerIndex: 2,
        explanation:
          '由末段 "a realistic eye for detail matters more than expensive tools" 可知他说注重细节的眼光比昂贵工具更重要，故选 C；A 与原意相反，B、D 文中未提及。',
      },
      {
        id: 'u26-p2-q3',
        type: 'main-idea',
        stem: 'What is the best title for the passage?',
        options: [
          'A Quiet Carver Living an Artistic Life',
          'The History of Chinese Ceramics',
          'How to Buy Expensive Tools',
          'Art Classes in Our School',
        ],
        answerIndex: 0,
        explanation:
          '全文概括了老陈这位木雕画家学习书画、专注创作并走进课堂的日常，A 项最能概括其艺术人生，故选 A；B、C、D 均偏离文章中心。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit26Passages;
