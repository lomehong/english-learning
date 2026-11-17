import type { ReadingPassage } from '../types';

/**
 * 人教2019必修三 Unit 3（Diverse Cultures）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 8 词表），避免任何教材原文版权问题。
 */

export const unit8Passages: ReadingPassage[] = [
  {
    id: 'u23-p1',
    title: 'A Food Adventure Downtown',
    genre: '游记',
    paragraphs: [
      'Last Saturday, my cousin and I went downtown to explore the famous food district of our city. It was like a small world in a few streets: Chinese noodle shops stood next to Italian bakeries, and the air smelled of spicy hotpot and fresh bread at the same time.',
      'Our first stop was a small cafe run by a family from Mexico. We tried nachos with cheese, which tasted rich and a little spicy. Then we shared a plate of fish and chips at an English window, and finished the adventure with mild green tea ice cream at a Japanese stall. Every bite told us where the owners\u2019 families had come from.',
      'In the evening, a jazz band began to play in the square, and people of different ages danced together. I wrote in my travel journal that night: the diversity of food is really the diversity of people. When cultures live on the same street, the city becomes warmer and more interesting.',
    ],
    glossary: [
      { wordId: 'downtown', forms: ['downtown'] },
      { wordId: 'district', forms: ['district'] },
      { wordId: 'spicy', forms: ['spicy'] },
      { wordId: 'cheese', forms: ['cheese'] },
      { wordId: 'chip', forms: ['chips'] },
      { wordId: 'mild', forms: ['mild'] },
      { wordId: 'adventure', forms: ['Adventure', 'adventure'] },
      { wordId: 'journal', forms: ['journal'] },
      { wordId: 'diversity', forms: ['diversity'] },
    ],
    questions: [
      {
        id: 'u23-r1-1',
        type: 'detail',
        stem: 'What did the writer eat at the Mexican family\u2019s cafe?',
        options: [
          'Fish and chips.',
          'Nachos with cheese.',
          'Green tea ice cream.',
          'Italian bread.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "Our first stop was a small cafe run by a family from Mexico. We tried nachos with cheese" 可知在墨西哥家庭开的咖啡馆吃了芝士玉米片，故选 B。',
      },
      {
        id: 'u23-r1-2',
        type: 'detail',
        stem: 'How did the writer feel about the food trip?',
        options: [
          'Bored and tired.',
          'Disappointed with the service.',
          'Interested and warmed by the diversity.',
          'Worried about the spicy food.',
        ],
        answerIndex: 2,
        explanation:
          '由末段日记 "the diversity of food is really the diversity of people… the city becomes warmer and more interesting" 可知作者觉得有趣并感受到多元文化的温暖，故选 C。',
      },
      {
        id: 'u23-r1-3',
        type: 'inference',
        stem: 'What can we infer about the food district?',
        options: [
          'All the shops there are run by one company.',
          'Only foreign foods are sold in the district.',
          'The foods reflect the backgrounds of the owners\u2019 families.',
          'The streets are quiet and empty in the evening.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "Every bite told us where the owners\u2019 families had come from" 可推知街区美食反映了店主家庭的来历，故选 C；A、B、D 与原文不符。',
      },
    ],
  },
  {
    id: 'u23-p2',
    title: 'Chinatown: A Bridge Between Cultures',
    genre: '说明文',
    paragraphs: [
      'Walk through the stone gate of Chinatown, and you will hear two or three languages within five minutes. Chinatown was built by early immigrants who crossed the ocean more than a hundred years ago. After hard years of immigration and settlement, they constructed schools, temples and shops, and turned the area into a home away from home.',
      'Today Chinatown is a bridge between cultures. Elderly people in traditional clothing buy herbs in Chinese medicine stores, while young visitors of other ethnic groups line up for mooncakes and dumplings. Every Chinese New Year, a lion dance marches along the main street, and people of all backgrounds cheer together.',
      'The historical buildings in the district now appear in city guides, and the stories of the minority communities are told in a small museum. A fortune cookie once said: "Different rivers reach the same sea." That is exactly what Chinatown shows us — diverse cultures can live, work and celebrate side by side.',
    ],
    glossary: [
      { wordId: 'immigrant', forms: ['immigrants'] },
      { wordId: 'immigration', forms: ['immigration'] },
      { wordId: 'settle', forms: ['settlement'] },
      { wordId: 'construct', forms: ['constructed'] },
      { wordId: 'clothing', forms: ['clothing'] },
      { wordId: 'ethnic', forms: ['ethnic'] },
      { wordId: 'historical', forms: ['historical'] },
      { wordId: 'minority', forms: ['minority'] },
      { wordId: 'fortune', forms: ['fortune'] },
    ],
    questions: [
      {
        id: 'u23-r2-1',
        type: 'detail',
        stem: 'Who built the early Chinatown according to the passage?',
        options: [
          'The city government.',
          'Early immigrants from across the ocean.',
          'Rich businessmen from Europe.',
          'Young visitors of other ethnic groups.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "Chinatown was built by early immigrants who crossed the ocean more than a hundred years ago" 可知唐人街由早期移民建立，故选 B。',
      },
      {
        id: 'u23-r2-2',
        type: 'detail',
        stem: 'What can visitors see in Chinatown during the Chinese New Year?',
        options: [
          'A lion dance along the main street.',
          'A jazz concert in the square.',
          'A movie about immigration history.',
          'A cooking class for mooncakes.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "Every Chinese New Year, a lion dance marches along the main street" 可知春节时有舞狮沿主街行进，故选 A。',
      },
      {
        id: 'u23-r2-3',
        type: 'purpose',
        stem: 'Why does the writer mention the words in the fortune cookie?',
        options: [
          'To show that fortune cookies are popular in Chinatown.',
          'To prove that the museum tells old stories.',
          'To express the idea that diverse cultures can live side by side.',
          'To explain how rivers reach the sea.',
        ],
        answerIndex: 2,
        explanation:
          '末段引用幸运饼干里的话 "Different rivers reach the same sea"，随后点明 "diverse cultures can live, work and celebrate side by side"，写作意图是表达多元文化可以和谐共存，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8Passages;
