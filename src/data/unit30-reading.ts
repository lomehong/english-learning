import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修三 Unit 5（Poems）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 5 词表），避免任何教材原文版权问题。
 */

export const unit30Passages: ReadingPassage[] = [
  {
    id: 'u30-p1',
    title: 'Why We Still Read Poems',
    genre: '说明文',
    paragraphs: [
      'A poem is usually short, but it can hold a whole world. With only a few syllables in each line, poets convey deep emotion and paint pictures with words.',
      'Good poems often use metaphor and rich imagery. A moon may stand for loneliness; the dawn may carry hope. Rhyme and metre give lines music, so that a stanza sounds sweet when read aloud. Even a simple nursery rhyme can stay in our memory for a lifetime.',
      'Reading poetry, therefore, is a way of listening to other hearts. When we recite a heartfelt verse about love or sorrow, we meet the poet across time. That is why, after thousands of years, poetry is still a living part of literature.',
    ],
    glossary: [
      { wordId: 'poem', forms: ['poem'] },
      { wordId: 'syllable', forms: ['syllables'] },
      { wordId: 'convey', forms: ['convey'] },
      { wordId: 'emotion', forms: ['emotion'] },
      { wordId: 'metaphor', forms: ['metaphor'] },
      { wordId: 'imagery', forms: ['imagery'] },
      { wordId: 'rhyme', forms: ['rhyme'] },
      { wordId: 'metre', forms: ['metre'] },
      { wordId: 'stanza', forms: ['stanza'] },
      { wordId: 'nursery', forms: ['nursery'] },
      { wordId: 'poetry', forms: ['poetry'] },
      { wordId: 'recite', forms: ['recite'] },
      { wordId: 'heartfelt', forms: ['heartfelt'] },
      { wordId: 'verse', forms: ['verse'] },
      { wordId: 'sorrow', forms: ['sorrow'] },
      { wordId: 'literature', forms: ['literature'] },
    ],
    questions: [
      {
        id: 'u30-p1-q1',
        type: 'detail',
        stem: 'According to Paragraph 2, what may the dawn carry in poems?',
        options: [
          'Hope.',
          'Fear.',
          'Anger.',
          'Money.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "the dawn may carry hope" 可知在诗中黎明可以承载希望，故选 A；B、C、D 文中均未提及。',
      },
      {
        id: 'u30-p1-q2',
        type: 'detail',
        stem: 'What give poems their music?',
        options: [
          'Long paragraphs.',
          'Rhyme and metre.',
          'Colour photos.',
          'Loud drums.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "Rhyme and metre give lines music" 可知韵与格律赋予诗歌音乐性，故选 B；A、C、D 与原文不符。',
      },
      {
        id: 'u30-p1-q3',
        type: 'purpose',
        stem: 'Why does the writer write this passage?',
        options: [
          'To explain why poetry is still worth reading.',
          'To sell a collection of poems.',
          'To teach people how to write novels.',
          'To describe the history of printing.',
        ],
        answerIndex: 0,
        explanation:
          '作者先说明诗歌如何以精炼的语言表达情感，末段点明读诗是倾听他人心灵的方式、诗歌至今仍有生命力，目的是说明诗歌值得一读，故选 A。',
      },
    ],
  },
  {
    id: 'u30-p2',
    title: 'My Grandfather\u2019s Favourite Poem',
    genre: '记叙文',
    paragraphs: [
      'My grandfather worked on a farm all his life and never went to college, yet he loved literature more than anyone I know. Every summer evening, he sat under the old tree and read poems to me by heart.',
      'His favourite poem described the moonlight on a quiet river. Its figurative language turned water into silver, and its symbolism of home touched everyone who heard it. Grandfather could not explain the theory, but when he recited the last stanza, his voice always trembled with feeling.',
      'He passed away two years ago. Now, whenever I see the moon over the fields, I recall his voice and the old lines. A good poem, I believe, is like a seed: it waits in your heart and blooms when you need it most.',
    ],
    glossary: [
      { wordId: 'literature', forms: ['literature'] },
      { wordId: 'moonlight', forms: ['moonlight'] },
      { wordId: 'figurative', forms: ['figurative'] },
      { wordId: 'symbolism', forms: ['symbolism'] },
      { wordId: 'recite', forms: ['recited'] },
      { wordId: 'stanza', forms: ['stanza'] },
      { wordId: 'poem', forms: ['poem'] },
    ],
    questions: [
      {
        id: 'u30-p2-q1',
        type: 'detail',
        stem: 'What did grandfather do every summer evening?',
        options: [
          'He read poems to the writer by heart.',
          'He watered the old tree.',
          'He worked in the fields.',
          'He listened to the radio.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "he sat under the old tree and read poems to me by heart" 可知他每个夏晚都会给作者背诵诗歌，故选 A；B、C、D 文中均未提及。',
      },
      {
        id: 'u30-p2-q2',
        type: 'detail',
        stem: 'What did the figurative language turn water into?',
        options: [
          'Gold.',
          'Glass.',
          'Silver.',
          'Smoke.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "Its figurative language turned water into silver" 可知比喻性的语言把水写成了银子，故选 C；A、B、D 与原文不符。',
      },
      {
        id: 'u30-p2-q3',
        type: 'inference',
        stem: 'What does the writer mean by \u201ca good poem is like a seed\u201d?',
        options: [
          'A poem stays in the heart and gives strength when needed.',
          'Poems can only be read on farms.',
          'Old poems are difficult to understand.',
          'Seeds grow faster than poems.',
        ],
        answerIndex: 0,
        explanation:
          '作者说好诗像种子一样沉睡心中、在人最需要时开放，可推知诗歌会在心中长存并在需要时给人力量，故选 A；B、C、D 理解有误。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit30Passages;
