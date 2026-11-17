import type { ReadingPassage } from '../types';

/**
 * 人教2019必修一 Unit 5（Languages Around the World）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 5 词表），避免任何教材原文版权问题。
 */

export const unit5Passages: ReadingPassage[] = [
  {
    id: 'u5-p1',
    title: 'English: A Language of Many Faces',
    genre: '说明文',
    paragraphs: [
      'Today, English is a global language that connects people across the world. Millions of travellers and business people use it to communicate every day. However, English does not sound the same everywhere. A native speaker from London and a student from Singapore may use different words for the same thing.',
      'Accents and dialects make English colourful. In Australia, "G\u2019day" is a friendly way to say hello. In America, a soft drink is called "soda", while British people may ask for a "fizzy drink". Even grammar can change: an expression that is standard in one country may sound strange in another.',
      'So what should a learner do? Experts suggest a relaxed attitude. Listen widely, refer to a good dictionary, and remember that every accent has its own beauty. After all, language is a bridge, not a wall.',
    ],
    glossary: [
      { wordId: 'global', forms: ['global'] },
      { wordId: 'million', forms: ['Millions'] },
      { wordId: 'communicate', forms: ['communicate'] },
      { wordId: 'native', forms: ['native'] },
      { wordId: 'accent', forms: ['Accents', 'accent'] },
      { wordId: 'dialect', forms: ['dialects'] },
      { wordId: 'grammar', forms: ['grammar'] },
      { wordId: 'expression', forms: ['expression'] },
      { wordId: 'standard', forms: ['standard'] },
      { wordId: 'attitude', forms: ['attitude'] },
      { wordId: 'refer', forms: ['refer'] },
    ],
    questions: [
      {
        id: 'u5-r1-1',
        type: 'detail',
        stem: 'According to Paragraph 1, how may a native speaker from London and a student from Singapore differ?',
        options: [
          'They use different words for the same thing.',
          'They study different foreign languages at school.',
          'They come from the same country.',
          'They play different sports after class.',
        ],
        answerIndex: 0,
        explanation:
          '由首段 "may use different words for the same thing" 可知二者可能对同一事物使用不同的词语，故选 A；B、C、D 均与原文不符。',
      },
      {
        id: 'u5-r1-2',
        type: 'detail',
        stem: 'Which example in Paragraph 2 shows that grammar can also be different?',
        options: [
          'Australians say "G\u2019day" to greet people.',
          'Americans call a soft drink "soda".',
          'An expression standard in one country may sound strange in another.',
          'British people ask for a "fizzy drink".',
        ],
        answerIndex: 2,
        explanation:
          '第二段 "Even grammar can change: an expression that is standard in one country may sound strange in another" 直接说明语法层面也存在差异，故选 C；A、B、D 都是词汇差异的例子。',
      },
      {
        id: 'u5-r1-3',
        type: 'main-idea',
        stem: 'What is the main idea of the passage?',
        options: [
          'English is too difficult for most learners.',
          'English varies around the world, and learners should accept its diversity.',
          'Australian English is the best form of English.',
          'Dictionaries are useless for language learners.',
        ],
        answerIndex: 1,
        explanation:
          '全文先说明英语在世界各地的口音、方言与语法各有不同，末段又建议学习者放松心态、欣赏每一种口音，可概括主旨为“英语形式多样，学习者应接纳其多样性”，故选 B。',
      },
    ],
  },
  {
    id: 'u5-p2',
    title: "Grandpa's Dialect, My Mandarin",
    genre: '记叙文',
    paragraphs: [
      'Last summer, I visited my grandpa in a small mountain village. Like most people there, he speaks the local dialect and understands little Mandarin. At first, I struggled to communicate with him, because my village words were long gone.',
      'Grandpa is a native speaker of the dialect, and I am a native speaker of Mandarin. Every evening, we sat under a big tree and taught each other. He repeated a word patiently, and I wrote down its meaning in standard Mandarin. Slowly, the strange sounds became familiar songs.',
      'On my last evening, Grandpa said something that I understood without translating: "Language is the key to a person\u2019s heart." Those words changed my attitude towards study. Now I work harder at English, because a language can open a door that nothing else can.',
    ],
    glossary: [
      { wordId: 'dialect', forms: ['dialect'] },
      { wordId: 'struggle', forms: ['struggled'] },
      { wordId: 'communicate', forms: ['communicate'] },
      { wordId: 'native', forms: ['native'] },
      { wordId: 'meaning', forms: ['meaning'] },
      { wordId: 'standard', forms: ['standard'] },
      { wordId: 'translate', forms: ['translating'] },
      { wordId: 'attitude', forms: ['attitude'] },
    ],
    questions: [
      {
        id: 'u5-r2-1',
        type: 'detail',
        stem: 'Why did the writer struggle to communicate with Grandpa at first?',
        options: [
          'Grandpa could not hear clearly.',
          'The writer no longer knew the village dialect.',
          'Grandpa refused to speak to the writer.',
          'The writer had never visited the village before.',
        ],
        answerIndex: 1,
        explanation:
          '由首段 "he speaks the local dialect and understands little Mandarin" 与 "my village words were long gone" 可知，作者吃力的原因是自己已经不会当地方言，故选 B。',
      },
      {
        id: 'u5-r2-2',
        type: 'detail',
        stem: 'What did the writer do while Grandpa repeated a dialect word?',
        options: [
          'Wrote down its meaning in standard Mandarin.',
          'Translated it into English on paper.',
          'Asked Grandpa to speak more politely.',
          'Sang a familiar song under the tree.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "I wrote down its meaning in standard Mandarin" 可知作者用标准普通话记下方言词的含义，故选 A。',
      },
      {
        id: 'u5-r2-3',
        type: 'inference',
        stem: 'What can we infer from Grandpa\u2019s words in the last paragraph?',
        options: [
          'The writer will stop learning English.',
          'Dialects are more useful than Mandarin.',
          'Understanding a language helps us understand people.',
          'Grandpa dislikes city life very much.',
        ],
        answerIndex: 2,
        explanation:
          '"Language is the key to a person\u2019s heart" 加上作者此后学习态度的转变，可推知作者体会到语言是理解他人内心的钥匙，故选 C；A 与 "work harder at English" 矛盾，B、D 原文未提及。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit5Passages;
