import type { ReadingPassage } from '../types';

/**
 * 人教2019必修二 Unit 5（Music）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用本单元词表），避免任何教材原文版权问题。
 */

export const unit10Passages: ReadingPassage[] = [
  {
    id: 'u20-p1',
    title: 'The School Music Festival',
    genre: '记叙文',
    paragraphs: [
      'Our school music festival ended with a big surprise: the best performance was given not by a professional band, but by our class choir.',
      'For two months, we practised in the music room after class. Our monitor composed a new melody for the school song, and a folk musician from the village taught us an old tune with a strong rhythm. At first, our voices sounded messy, and some members wanted to give up. Miss Wang, our music teacher, kept encouraging us: \u201cMusic is not about being perfect; it is about singing together.\u201d',
      'On the evening of the festival, we walked onto the stage in the school hall. The audience clapped warmly at the end, and our choir won a special award. Standing under the lights, I finally understood what Miss Wang meant.',
    ],
    glossary: [
      { wordId: 'performance', forms: ['performance'] },
      { wordId: 'band', forms: ['band'] },
      { wordId: 'choir', forms: ['choir'] },
      { wordId: 'compose', forms: ['composed'] },
      { wordId: 'melody', forms: ['melody'] },
      { wordId: 'folk', forms: ['folk'] },
      { wordId: 'rhythm', forms: ['rhythm'] },
      { wordId: 'stage', forms: ['stage'] },
      { wordId: 'audience', forms: ['audience'] },
      { wordId: 'award', forms: ['award'] },
    ],
    questions: [
      {
        id: 'u20-r1-1',
        type: 'detail',
        stem: 'Who taught the class an old tune with a strong rhythm?',
        options: [
          'Miss Wang, the music teacher.',
          'The monitor of the class.',
          'A folk musician from the village.',
          'A singer from a professional band.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "a folk musician from the village taught us an old tune with a strong rhythm" 可知，教大家唱老歌的是村里的一位民间音乐人，故选 C；A 是鼓励大家的音乐老师，B 是为校歌谱曲的班长，D 与原文不符。',
      },
      {
        id: 'u20-r1-2',
        type: 'detail',
        stem: 'What did Miss Wang think music was about?',
        options: [
          'Winning a special award.',
          'Being perfect on the stage.',
          'Singing loudly with the band.',
          'Singing together with others.',
        ],
        answerIndex: 3,
        explanation:
          '由第二段 Miss Wang 的话 "Music is not about being perfect; it is about singing together" 可知，她认为音乐重在合唱与团结而非完美，故选 D；A 与她的观点无关，B 正是她否定的说法，C 未提及。',
      },
      {
        id: 'u20-r1-3',
        type: 'main-idea',
        stem: 'What is the best title for this passage?',
        options: [
          'How to Compose a School Song',
          'The Power of Singing Together',
          'A Strict Teacher of Music',
          'An Old Tune from the Village',
        ],
        answerIndex: 1,
        explanation:
          '全文讲述班级合唱队从声音杂乱、想要放弃，到在老师"音乐重在同行合唱"的鼓励下最终获奖的故事，B 项最能概括主旨；A、C、D 均只是文中细节。',
      },
    ],
  },
  {
    id: 'u20-p2',
    title: 'An Evening of Music',
    genre: '应用文',
    paragraphs: [
      'Come to the school hall at seven on Saturday evening! The music club will present \u201cAn Evening of Music\u201d, a concert that travels from classical pieces to modern jazz.',
      'The programme is rich. First, the school orchestra will perform two famous works, and our young conductor will make his first appearance. Then, a folk band from the mountains will bring songs about harvest and home. After that, the jazz group of Grade 11 will play a piece from their new album, which was recorded in a small studio last summer.',
      'Tickets are free for students and teachers. Music inspires us all \u2014 bring your friends and enjoy the night!',
    ],
    glossary: [
      { wordId: 'classical', forms: ['classical'] },
      { wordId: 'jazz', forms: ['jazz'] },
      { wordId: 'orchestra', forms: ['orchestra'] },
      { wordId: 'perform', forms: ['perform'] },
      { wordId: 'conductor', forms: ['conductor'] },
      { wordId: 'folk', forms: ['folk'] },
      { wordId: 'band', forms: ['band'] },
      { wordId: 'album', forms: ['album'] },
      { wordId: 'studio', forms: ['studio'] },
      { wordId: 'inspire', forms: ['inspires'] },
    ],
    questions: [
      {
        id: 'u20-r2-1',
        type: 'detail',
        stem: 'When and where will the concert take place?',
        options: [
          'At seven on Saturday evening, in the school hall.',
          'At seven on Sunday morning, on the playground.',
          'At nine on Saturday evening, in the music club.',
          'On Saturday afternoon, in a small studio.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "Come to the school hall at seven on Saturday evening" 可知，音乐会是周六晚七点在学校礼堂举行，故选 A；B、C 的时间地点均错误，D 的小录音室是专辑录制地。',
      },
      {
        id: 'u20-r2-2',
        type: 'detail',
        stem: 'What will the jazz group of Grade 11 play at the concert?',
        options: [
          'Two famous classical works.',
          'A piece from their new album.',
          'Songs about harvest and home.',
          'A song composed by the conductor.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "the jazz group of Grade 11 will play a piece from their new album" 可知，爵士乐队将演奏新专辑中的一首曲子，故选 B；A 是管弦乐团的曲目，C 是民间乐队的曲目，D 未提及。',
      },
      {
        id: 'u20-r2-3',
        type: 'purpose',
        stem: 'Why does the writer write this passage?',
        options: [
          'To sell tickets for the concert.',
          'To teach readers how to play jazz.',
          'To invite people to the school concert.',
          'To introduce a new music studio.',
        ],
        answerIndex: 2,
        explanation:
          '本文是一则音乐会预告：开头 "Come to the school hall" 发出邀请，介绍节目单与免费票信息，结尾 "bring your friends and enjoy the night" 号召大家前来，写作目的是邀请师生参加音乐会，故选 C；A 与 "Tickets are free" 矛盾，B、D 无关。',
      },
    ],
  },
];

const passageById = new Map(unit10Passages.map((p) => [p.id, p]));

export function getPassage(id: string): ReadingPassage | undefined {
  return passageById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10Passages;
