import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修三 Unit 3（Diverse Cultures）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 8 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit8Listenings: ListeningMaterial[] = [
  {
    id: 'u23-l1',
    title: 'Announcement: The International Culture Festival',
    genre: '独白',
    script: [
      'Good afternoon, everyone. Here is an announcement about our school International Culture Festival.',
      'The festival will take place on the playground from two to five next Thursday afternoon. There will be an ethnic costume show, and students from different backgrounds will introduce their traditional clothing. In the east corner, you can taste foods from many countries, such as mild curry, spicy noodles and cheese pies.',
      'A jazz band and a folk dance group will give performances on the main stage. There will also be a short film about the history of immigration in our city. Tickets are free, but please sign up on the school website before Tuesday. We hope to see you all there.',
    ],
    questions: [
      {
        id: 'u23-l1-1',
        type: 'detail',
        stem: 'When will the culture festival take place?',
        options: [
          'From two to five next Tuesday afternoon.',
          'From two to five next Thursday afternoon.',
          'From three to five this Thursday afternoon.',
          'From two to five next Thursday morning.',
        ],
        answerIndex: 1,
        explanation:
          '由 "The festival will take place on the playground from two to five next Thursday afternoon" 可知活动在下周四下午两点到五点，故选 B；周二只是报名截止时间。',
      },
      {
        id: 'u23-l1-2',
        type: 'detail',
        stem: 'What will students introduce in the ethnic costume show?',
        options: [
          'Their favourite foods.',
          'Their traditional clothing.',
          'A short film about jazz.',
          'The history of immigration.',
        ],
        answerIndex: 1,
        explanation:
          '由 "students from different backgrounds will introduce their traditional clothing" 可知学生将介绍他们的传统服饰，故选 B。',
      },
      {
        id: 'u23-l1-3',
        type: 'inference',
        stem: 'What can we learn about the festival from the announcement?',
        options: [
          'Students must buy tickets on the playground.',
          'Only food performances will be given.',
          'It welcomes students to experience diverse cultures for free.',
          'It will be held in the school library.',
        ],
        answerIndex: 2,
        explanation:
          '由 "Tickets are free" 及服装秀、各国美食、爵士乐与移民史影片等内容可推知活动免费且让大家体验多元文化，故选 C。',
      },
    ],
  },
  {
    id: 'u23-l2',
    title: 'A Visit to the Folk Museum',
    genre: '对话',
    script: [
      'M: Hi, Linda. I heard you visited the folk museum downtown last weekend. How was it?',
      'W: It was wonderful. The museum is in a historical building constructed by the first settlers of the city more than a century ago.',
      'M: That sounds interesting. What is on show there?',
      'W: There are old journals and letters written by early immigrants, and traditional clothing of several ethnic minority groups. A guide told us how these families settled down and built their new life here.',
      'M: I would like to see those journals myself. Is the museum open on Sundays?',
      'W: Yes, from nine in the morning to four in the afternoon. You can book a free ticket online. I am sure the diversity of the exhibits will surprise you.',
    ],
    questions: [
      {
        id: 'u23-l2-1',
        type: 'detail',
        stem: 'What do we know about the museum building?',
        options: [
          'It was constructed by the first settlers over a century ago.',
          'It was built as a school fifty years ago.',
          'It was moved from another country.',
          'It was designed by Linda\u2019s grandfather.',
        ],
        answerIndex: 0,
        explanation:
          '由 "The museum is in a historical building constructed by the first settlers of the city more than a century ago" 可知博物馆建筑由早期定居者在一百多年前建造，故选 A。',
      },
      {
        id: 'u23-l2-2',
        type: 'detail',
        stem: 'What is on show in the museum?',
        options: [
          'Only paintings by famous artists.',
          'Journals, letters and traditional clothing.',
          'Modern clothes and jazz records.',
          'Films about the city government.',
        ],
        answerIndex: 1,
        explanation:
          '由 "There are old journals and letters written by early immigrants, and traditional clothing of several ethnic minority groups" 可知展出有日记、信件和传统服饰，故选 B。',
      },
      {
        id: 'u23-l2-3',
        type: 'inference',
        stem: 'What will the man probably do next?',
        options: [
          'Book a free ticket and visit the museum on Sunday.',
          'Borrow the journals from Linda.',
          'Buy a ticket at a high price.',
          'Visit the museum on Monday morning.',
        ],
        answerIndex: 0,
        explanation:
          '男士说 "I would like to see those journals myself" 并询问开放时间，女士告知周日开放且可网上订免费票，可推知他会订票周日参观，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8Listenings;
