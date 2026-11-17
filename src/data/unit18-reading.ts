import type { ReadingPassage } from '../types';

/**
 * 人教2019必修二 Unit 3（The Internet）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用本单元词表），避免任何教材原文版权问题。
 */

export const unit8Passages: ReadingPassage[] = [
  {
    id: 'u18-p1',
    title: 'Grandpa Goes Online',
    genre: '记叙文',
    paragraphs: [
      'My grandpa used to say that the Internet was only for young people. Everything changed last winter, when his favourite opera troupe stopped touring because of the snow.',
      'I showed him how to click the mouse and stream operas on the website. At first, he was nervous and forgot his username and password almost every day. Now he has learned to update his own blog, where he writes about the performances he watches. He even taught his old friends to download the app and chat in an online group.',
      'The Internet has brought the stage to his room across the distance. \u201cIt is the most convenient thing in my life,\u201d he says with a big smile.',
    ],
    glossary: [
      { wordId: 'stream', forms: ['stream'] },
      { wordId: 'click', forms: ['click'] },
      { wordId: 'username', forms: ['username'] },
      { wordId: 'password', forms: ['password'] },
      { wordId: 'update', forms: ['update'] },
      { wordId: 'blog', forms: ['blog'] },
      { wordId: 'download', forms: ['download'] },
      { wordId: 'chat', forms: ['chat'] },
      { wordId: 'distance', forms: ['distance'] },
      { wordId: 'convenient', forms: ['convenient'] },
    ],
    questions: [
      {
        id: 'u18-r1-1',
        type: 'detail',
        stem: 'What made Grandpa change his attitude towards the Internet?',
        options: [
          'His grandchildren bought him a new computer.',
          'His favourite opera troupe stopped touring.',
          'His doctor asked him to learn new things.',
          'His friends laughed at his old ideas.',
        ],
        answerIndex: 1,
        explanation:
          '由第一段 "Everything changed last winter, when his favourite opera troupe stopped touring because of the snow" 可知，剧团因大雪停止巡演是他态度转变的契机，故选 B；A、C、D 原文均未提及。',
      },
      {
        id: 'u18-r1-2',
        type: 'detail',
        stem: 'What does Grandpa do on his blog now?',
        options: [
          'He sells tickets for the opera troupe.',
          'He chats with strangers every night.',
          'He writes about the performances he watches.',
          'He downloads apps for his old friends.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "he has learned to update his own blog, where he writes about the performances he watches" 可知，爷爷在博客上写观演感想，故选 C；A 未提及，B 是他在网络群里与老友聊天，D 是他教朋友下载应用而非写博客。',
      },
      {
        id: 'u18-r1-3',
        type: 'main-idea',
        stem: 'What is the best title for this passage?',
        options: [
          'A Snowy Winter Night',
          'How to Write a Blog',
          'An Old Opera Troupe',
          'Grandpa Goes Online',
        ],
        answerIndex: 3,
        explanation:
          '全文讲述爷爷从抗拒网络到学会在线看戏、写博客并带动老朋友上网的转变，D 项最能概括全文；A 只是故事背景，B、C 都是文中细节。',
      },
    ],
  },
  {
    id: 'u18-p2',
    title: 'A Guide to Safe Surfing',
    genre: '应用文',
    paragraphs: [
      'The school network centre offers a short guide to help students surf the Internet safely. Read it before you go online!',
      'First, protect your identity. Never tell strangers your real name, address or password, and use different passwords for important accounts. Second, think before you click. Strange links are often designed by cheaters, and young students are a common target. Third, check the source. The information in our database has been checked by teachers, so it is safe for your homework.',
      'If you find anything uncomfortable online, talk to your parents or teachers at once. Privacy is a serious matter, and asking for help is not a shame.',
      'Wish you a safe and efficient journey on the Internet!',
    ],
    glossary: [
      { wordId: 'network', forms: ['network'] },
      { wordId: 'guide', forms: ['guide'] },
      { wordId: 'surf', forms: ['surf'] },
      { wordId: 'identity', forms: ['identity'] },
      { wordId: 'password', forms: ['password'] },
      { wordId: 'click', forms: ['click'] },
      { wordId: 'target', forms: ['target'] },
      { wordId: 'database', forms: ['database'] },
    ],
    questions: [
      {
        id: 'u18-r2-1',
        type: 'detail',
        stem: 'According to the guide, what should you do to protect your identity?',
        options: [
          'Use one password for all accounts.',
          'Tell only close friends your address.',
          'Never tell strangers your real name or password.',
          'Upload your photo on every website.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "protect your identity. Never tell strangers your real name, address or password" 可知，保护身份的做法是不向陌生人透露真实姓名或密码，故选 C；A 与 "use different passwords" 相反，B、D 均违背指南精神。',
      },
      {
        id: 'u18-r2-2',
        type: 'detail',
        stem: 'Who are a common target of strange links according to the passage?',
        options: [
          'Young students.',
          'School teachers.',
          'Network engineers.',
          'Parents of learners.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "Strange links are often designed by cheaters, and young students are a common target" 可知，陌生链接常以年轻学生为目标，故选 A；B、C、D 均与原文不符。',
      },
      {
        id: 'u18-r2-3',
        type: 'purpose',
        stem: 'Why does the school network centre write this guide?',
        options: [
          'To sell a new kind of software.',
          'To help students surf the Internet safely.',
          'To stop students from going online.',
          'To introduce an online homework system.',
        ],
        answerIndex: 1,
        explanation:
          '由第一段 "offers a short guide to help students surf the Internet safely" 可知，指南的目的是帮助学生安全上网，故选 B；A、C、D 均与原文不符。',
      },
    ],
  },
];

const passageById = new Map(unit8Passages.map((p) => [p.id, p]));

export function getPassage(id: string): ReadingPassage | undefined {
  return passageById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8Passages;
