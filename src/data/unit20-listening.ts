import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修二 Unit 5（Music）主题听力材料 ×2。
 * 文本为自编原创（词汇复用本单元词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit10Listenings: ListeningMaterial[] = [
  {
    id: 'u20-l1',
    title: 'Tonight\u2019s Concert Programme',
    genre: '独白',
    script: [
      'Good evening, music lovers. Before the concert begins, let me introduce tonight\u2019s programme. The school orchestra will open with a classical symphony, and then our pianist, who has won a national award, will play a solo. After the break, a folk singer will perform songs from her home town. Their melodies were inspired by the sound of the river and the wind. Finally, the jazz band will close the night with a piece of energy. Please remember to keep quiet during the performance. Now, let\u2019s welcome the conductor!',
    ],
    questions: [
      {
        id: 'u20-l1-1',
        type: 'detail',
        stem: 'How will the concert open tonight?',
        options: [
          'With a jazz piece.',
          'With a classical symphony.',
          'With a folk song.',
          'With a piano solo.',
        ],
        answerIndex: 1,
        explanation:
          '由 "The school orchestra will open with a classical symphony" 可知，开场节目是校管弦乐团演奏的古典交响曲，故选 B；C、A 分别是中场后与压轴节目，D 是其后钢琴家的独奏。',
      },
      {
        id: 'u20-l1-2',
        type: 'detail',
        stem: 'What inspired the melodies of the folk songs?',
        options: [
          'The sound of the river and the wind.',
          'The noise of the big city.',
          'The pianist\u2019s national award.',
          'The conductor\u2019s baton.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Their melodies were inspired by the sound of the river and the wind" 可知，这些民歌曲调的灵感来自河水与风声，故选 A；B、C、D 均与独白不符。',
      },
      {
        id: 'u20-l1-3',
        type: 'inference',
        stem: 'Who is most probably the speaker?',
        options: [
          'A music teacher of the school.',
          'The conductor of the orchestra.',
          'The host of the concert.',
          'A famous folk singer.',
        ],
        answerIndex: 2,
        explanation:
          '说话者开场问候观众、介绍节目单，最后说 "let\u2019s welcome the conductor"（有请指挥），可推知其身份是音乐会主持人而非指挥本人，故选 C。',
      },
    ],
  },
  {
    id: 'u20-l2',
    title: 'Talking about the School Band',
    genre: '对话',
    script: [
      'Ben: Lucy, I heard you joined the band. What instrument do you play?',
      'Lucy: The violin. I practise every day in the studio.',
      'Ben: That\u2019s a lot of work. Why do you love it?',
      'Lucy: Because music inspires me. When I play, I forget my worries. Our teacher says a good melody can warm people\u2019s hearts.',
      'Ben: Will your band give a performance soon?',
      'Lucy: Yes, next Friday in the school hall. We will perform with the choir.',
      'Ben: Wonderful! I can\u2019t wait to enjoy the rhythm!',
    ],
    questions: [
      {
        id: 'u20-l2-1',
        type: 'detail',
        stem: 'What instrument does Lucy play in the band?',
        options: [
          'The piano.',
          'The violin.',
          'The drum.',
          'The guitar.',
        ],
        answerIndex: 1,
        explanation:
          '由 Lucy 的回答 "The violin" 可知，她在乐队拉小提琴，故选 B；A、C、D 均未提及。',
      },
      {
        id: 'u20-l2-2',
        type: 'detail',
        stem: 'When and where will the band\u2019s performance take place?',
        options: [
          'Next Friday, in the school hall.',
          'This Friday, near the playground.',
          'Next Monday, in the music studio.',
          'On Saturday evening, at the concert.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Yes, next Friday in the school hall" 可知，演出是下周五在学校礼堂举行，故选 A；B 的地点是练习的琴房所在，C、D 与对话不符。',
      },
      {
        id: 'u20-l2-3',
        type: 'inference',
        stem: 'Why does Lucy love playing music?',
        options: [
          'She wants to become famous.',
          'Her parents force her to practise.',
          'It inspires her and helps her relax.',
          'She can get more pocket money.',
        ],
        answerIndex: 2,
        explanation:
          '由 "Because music inspires me. When I play, I forget my worries" 可推知，音乐能激励她并让她忘却烦恼、得到放松，故选 C；A、B、D 均与对话内容不符。',
      },
    ],
  },
];

const materialById = new Map(unit10Listenings.map((m) => [m.id, m]));

export function getListening(id: string): ListeningMaterial | undefined {
  return materialById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10Listenings;
