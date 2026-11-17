import type { WritingTask } from '../types';

/**
 * 人教2019必修二 Unit 3（The Internet）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用本单元词表），
 * 体裁与要求对接教材单元写作板块（应用文建议信 + 栏目投稿调查记）。
 */

export const unit8WritingTasks: WritingTask[] = [
  {
    id: 'u8-w1',
    title: 'Using the Internet to Learn English',
    genre: '应用文 · 建议信（电子邮件）',
    wordHint: '词数 80 左右',
    prompt:
      '你的英国朋友 Jim 来信说他想利用互联网提高英语水平，请你提些建议。请根据以下要点，用英语给他写一封回信：',
    requirements: [
      '推荐至少三种利用网络学英语的方式（词典应用 / 英语博客 / 在线影片等）；',
      '提醒他注意网络安全（保护隐私、不轻信陌生链接等）；',
      '表达祝愿，希望这些建议对他有帮助。',
    ],
    modelEssay: [
      'Dear Jim,',
      'I\u2019m glad to hear that you want to use the Internet to improve your English. Here are my suggestions.',
      'First, download a good dictionary app, so you can look up new words quickly. Second, update your study plan every week and follow some famous English blogs, which are an efficient way to learn fresh expressions. Third, stream English films with subtitles; it is convenient and fun.',
      'However, remember to protect your privacy. Never tell strangers your password, and don\u2019t surf the Internet too late at night.',
      'I hope these ideas will be helpful. Good luck!',
      'Yours,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（三种方式、安全提醒、祝愿）？',
      '是否至少用到 3 个本单元词汇（如 download / stream / blog / password / surf / update）？',
      '电子邮件格式（称呼、正文、落款）是否完整，语气是否礼貌自然？',
      '是否使用一般现在时与祈使句给出建议？',
      '词数是否 80 左右？',
    ],
  },
  {
    id: 'u8-w2',
    title: 'The Internet Changes Our Life',
    genre: '记叙文 · 栏目投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英文报「Life」栏目正在征文。请根据以下要点，以「The Internet Changes Our Life」为题，用英语写一篇短文投稿，记录你的一次观察：',
    requirements: [
      '交代观察任务的由来（老师布置观察生活中的互联网）；',
      '描述家人的网络使用场景（至少两至三个例子）；',
      '总结互联网带来的变化并给出理性提醒。',
    ],
    modelEssay: [
      'The Internet Changes Our Life',
      'Last week, our English teacher asked us to observe how the Internet appears in daily life, and my findings surprised me.',
      'In the morning, Mum buys vegetables with her phone, and the payment takes only a second. At noon, Dad streams a cooking video in the kitchen. After dinner, Grandpa chats with his old friends online, and Grandma has learned to download classic songs. Even our village doctor now checks patients\u2019 information in a big database through the network.',
      'The Internet has crossed the distance between people. It makes life convenient and learning efficient. However, we should also guard our privacy and use it wisely. Technology is a bridge, and how far it carries us depends on ourselves.',
    ],
    checklist: [
      '是否按「总—分—总」结构组织，三个要点齐全？',
      '是否使用一般现在时与现在完成时（has crossed / has learned）描述变化？',
      '是否至少用到 3 个本单元词汇（如 stream / chat / download / database / network / privacy）？',
      '是否使用连接词（At noon / After dinner / However 等）使行文连贯？',
      '词数是否 100 左右，标题「The Internet Changes Our Life」是否保留？',
    ],
  },
];

const taskById = new Map(unit8WritingTasks.map((t) => [t.id, t]));

export function getWritingTask(id: string): WritingTask | undefined {
  return taskById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8WritingTasks;
