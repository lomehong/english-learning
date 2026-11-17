import type { ListeningMaterial } from '../types';

/**
 * 人教2019必修二 Unit 3（The Internet）主题听力材料 ×2。
 * 文本为自编原创（词汇复用本单元词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit8Listenings: ListeningMaterial[] = [
  {
    id: 'u18-l1',
    title: 'Tech News from the School Radio',
    genre: '独白',
    script: [
      'Good afternoon, boys and girls. Here is today\u2019s tech news from our school radio. Our library has updated its database, and now students can search for every book from home. Last week, three thousand books were downloaded from the online reading room. The school has also bought new software to protect our privacy when we surf the Internet. Remember to change your password every term. If you have any questions about the new system, please click the help button on the school website. Enjoy your reading!',
    ],
    questions: [
      {
        id: 'u18-l1-1',
        type: 'detail',
        stem: 'What can students do with the updated database?',
        options: [
          'Borrow three thousand books each week.',
          'Search for every book from home.',
          'Buy new software at a lower price.',
          'Write book reviews for the library.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Our library has updated its database, and now students can search for every book from home" 可知，更新后学生在家即可检索所有藏书，故选 B；A 是上周电子阅览室的下载量，C、D 未提及。',
      },
      {
        id: 'u18-l1-2',
        type: 'detail',
        stem: 'What has the school bought to protect students\u2019 privacy?',
        options: [
          'A new database.',
          'A help button.',
          'New software.',
          'A reading room.',
        ],
        answerIndex: 2,
        explanation:
          '由 "The school has also bought new software to protect our privacy" 可知，学校购买了新软件保护隐私，故选 C；A、B、D 均与原文不符。',
      },
      {
        id: 'u18-l1-3',
        type: 'inference',
        stem: 'Who is most probably the speaker?',
        options: [
          'A librarian of the city library.',
          'A host of the school radio.',
          'A software engineer.',
          'A teacher of computer science.',
        ],
        answerIndex: 1,
        explanation:
          '开头 "Here is today\u2019s tech news from our school radio" 表明说话者在播报校园广播的科技新闻，可推知其身份是校园广播主持人，故选 B。',
      },
    ],
  },
  {
    id: 'u18-l2',
    title: 'Using a Learning App at Home',
    genre: '对话',
    script: [
      'Emma: Dad, my teacher asked us to use the learning app, but I don\u2019t know how to start.',
      'Dad: It\u2019s simple. First, download the app and then create your username and password.',
      'Emma: OK. Should I upload a photo of myself?',
      'Dad: Better not. Protecting your privacy online is important, and the photo is not necessary.',
      'Emma: I see. The app will update new lessons every Friday, right?',
      'Dad: Yes. You can chat with your teacher if you have questions.',
      'Emma: Great! I\u2019ll stream the listening materials.',
    ],
    questions: [
      {
        id: 'u18-l2-1',
        type: 'detail',
        stem: 'What does Emma need to do first with the learning app?',
        options: [
          'Upload a photo of herself.',
          'Download the app and create a username and password.',
          'Chat with her teacher online.',
          'Stream the listening materials.',
        ],
        answerIndex: 1,
        explanation:
          '由 Dad 所说 "First, download the app and then create your username and password" 可知，第一步是下载应用并创建用户名和密码，故选 B；A 是被爸爸否定的做法，C、D 是后续步骤。',
      },
      {
        id: 'u18-l2-2',
        type: 'detail',
        stem: 'Why does Dad tell Emma not to upload a photo?',
        options: [
          'The photo is too large to upload.',
          'He thinks the photo is not beautiful.',
          'Protecting privacy online is important.',
          'The app does not allow photos.',
        ],
        answerIndex: 2,
        explanation:
          '由 "Protecting your privacy online is important, and the photo is not necessary" 可知，爸爸不建议上传照片是为了保护网络隐私，故选 C；A、B、D 均与对话不符。',
      },
      {
        id: 'u18-l2-3',
        type: 'inference',
        stem: 'What will Emma probably do next?',
        options: [
          'Stream the listening materials on the app.',
          'Return the app and buy a new one.',
          'Call her teacher on the phone.',
          'Ask her dad to study for her.',
        ],
        answerIndex: 0,
        explanation:
          '结尾 Emma 说 "Great! I\u2019ll stream the listening materials"，可推知她接下来会在应用上在线收听听力材料，故选 A；B、C、D 均与对话不符。',
      },
    ],
  },
];

const materialById = new Map(unit8Listenings.map((m) => [m.id, m]));

export function getListening(id: string): ListeningMaterial | undefined {
  return materialById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8Listenings;
