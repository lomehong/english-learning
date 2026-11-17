import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修一 Unit 3（Fascinating Parks）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 3 词表），
 * 体裁与要求对接教材单元写作板块（游记投稿 + 景点推荐帖）。
 */

export const unit8WritingTasks: WritingTask[] = [
  {
    id: 'u8-w1',
    title: 'A Day in a National Park',
    genre: '应用文 · 旅游专栏游记',
    wordHint: '词数 100 左右',
    prompt:
      '你校英语报“Travel”专栏正在征稿。请根据你（真实或想象）的一次公园游览经历，用英语写一篇短文投稿，题目为“A Day in a National Park”：',
    requirements: [
      '交代游览的时间、地点与同行的人；',
      '按时间顺序记叙当天的所见所闻（至少两个场景，如山谷、瀑布等）；',
      '谈谈你的感受或推荐理由。',
    ],
    modelEssay: [
      'A Day in a National Park',
      'Last October, my parents and I spent an unforgettable day in Green Valley National Park.',
      'Early in the morning, we hiked along a quiet trail through the vast wilderness. When we reached the top, a splendid valley appeared below us, and an ancient glacier shone like silver between the mountains. Later, we took a boat to the waterfall, which many travellers call a true spectacle.',
      'Standing by the water, I finally understood why people describe the park as a gift of nature. If you enjoy fresh air and wild beauty, this park is certainly worth visiting.',
    ],
    checklist: [
      '是否涵盖全部三个要点（时间地点人物 / 至少两个场景 / 感受或推荐）？',
      '游记是否按时间顺序展开，场景描写是否具体？',
      '是否至少用到 3 个 Unit 3 词汇（如 valley / glacier / waterfall / vast / spectacle / splendid）？',
      '是否使用动词-ing形式作主语或宾语（如 Hiking along… / enjoy fresh air）？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
  {
    id: 'u8-w2',
    title: 'Recommending a Fascinating Park',
    genre: '应用文 · 景点推荐帖',
    wordHint: '词数 80 左右',
    prompt:
      '某英文旅游网站正在征集“我最想推荐的公园”帖子。请用英语写一篇推荐帖，向外国网友推荐一个你熟悉的公园（城市公园、湿地公园或国家公园均可）：',
    requirements: [
      '点明公园名称与它最吸引人之处；',
      '介绍园内可做的活动及注意事项（如禁止事项）；',
      '发出邀请并说明最佳游览时间。',
    ],
    modelEssay: [
      'If you are looking for a fascinating park, I strongly recommend Green Lake Wetland Park in my city.',
      'The park is famous for its diverse waterbirds and its wonderful sunset scenery. Visitors can hike along the wooden trails or take a boat to the waterfall, which is a rare spectacle in autumn. Please remember that fishing and open fires are banned, so the animals can live in peace.',
      'The best time to visit is October, when the leaves turn golden. Come with your friends, and I am sure you will enjoy every minute there!',
    ],
    checklist: [
      '是否涵盖全部三个要点（吸引人之处 / 活动与注意事项 / 邀请与最佳时间）？',
      '推荐理由是否具体（有场景、有细节），而不是只说“很美”？',
      '是否至少用到 3 个 Unit 3 词汇（如 diverse / scenery / hike / spectacle / banned）？',
      '语气是否热情友好，符合网络推荐帖的文体？',
      '词数是否 80 左右？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8WritingTasks;
