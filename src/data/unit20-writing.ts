import type { WritingTask } from '../types';

/**
 * 人教2019必修二 Unit 5（Music）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用本单元词表），
 * 体裁与要求对接教材单元写作板块（应用文通知 + 记叙文栏目投稿）。
 */

export const unit10WritingTasks: WritingTask[] = [
  {
    id: 'u20-w1',
    title: 'A Notice on the School Music Festival',
    genre: '应用文 · 通知',
    wordHint: '词数 80 左右',
    prompt:
      '你校将举办一年一度的校园音乐节，学生会委托你用英语写一则通知，张贴在校园公告栏。请根据以下要点完成通知：',
    requirements: [
      '说明活动的时间与地点；',
      '介绍节目安排（管弦乐团、民歌、爵士、合唱等，至少三项）；',
      '说明门票免费及领取方式，欢迎大家前来欣赏。',
    ],
    modelEssay: [
      'A Notice on the School Music Festival',
      'The annual school music festival will be held in the school hall next Friday evening.',
      'The programme includes a classical symphony played by the school orchestra, folk songs from the mountains, and a jazz piece by the Grade 11 band. Our choir will also perform a song composed by a student of our class, and the audience will be invited to sing along at the end.',
      'Tickets are free and can be collected from the music office. Come and enjoy an evening of melody and rhythm!',
      'The Student Union',
    ],
    checklist: [
      '是否涵盖全部三个要点（时间地点、节目、门票与号召）？',
      '是否至少用到 3 个本单元词汇（如 orchestra / choir / perform / compose / audience / melody / rhythm）？',
      '是否正确使用被动语态（will be held / be collected）？',
      '通知格式（标题、正文、落款）是否完整，信息是否清楚？',
      '词数是否 80 左右？',
    ],
  },
  {
    id: 'u20-w2',
    title: 'The Melody of My Hometown',
    genre: '记叙文 · 栏目投稿',
    wordHint: '词数 100 左右',
    prompt:
      '你校英文报「Music」栏目正在征文。请根据以下要点，以「The Melody of My Hometown」为题，用英语写一篇短文投稿：',
    requirements: [
      '回忆小时候在家乡接触音乐的情景（跟民间音乐人学乐器等）；',
      '描写丰收时节乡村乐队演出、观众应和的热闹场面；',
      '讲述多年后在城市再次听到这首曲子的感受与感悟。',
    ],
    modelEssay: [
      'The Melody of My Hometown',
      'My home town lies beside a quiet river, and its sound is music to me.',
      'When I was little, Grandpa took me to the village studio, where an old musician taught children to play folk instruments. The melody of his flute flowed like the river itself. Every autumn, a band of farmers would perform on the wooden stage during the harvest feast, and the whole audience would clap to the strong rhythm.',
      'Years later, I heard the same tune played by a famous orchestra in a big city. The audience gave it warm applause, but I still prefer the version from my memory. That melody inspires me wherever I go, because it carries the sound of home.',
    ],
    checklist: [
      '是否按「总—分—总」结构组织，三个要点齐全？',
      '是否使用一般过去时回忆，would + 动词原形描写过去的习惯？',
      '是否至少用到 3 个本单元词汇（如 studio / folk / band / perform / stage / audience / rhythm / orchestra / inspire）？',
      '是否使用比喻等修辞（flowed like the river）增强感染力？',
      '词数是否 100 左右，标题「The Melody of My Hometown」是否保留？',
    ],
  },
];

const taskById = new Map(unit10WritingTasks.map((t) => [t.id, t]));

export function getWritingTask(id: string): WritingTask | undefined {
  return taskById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit10WritingTasks;
