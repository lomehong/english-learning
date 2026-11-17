import type { WritingTask } from '../types';

/**
 * 人教2019选择性必修三 Unit 5（Poems）主题写作任务 ×2。
 * 题目与范文均为自编原创（词汇复用 Unit 5 词表），
 * 体裁与要求对接教材单元写作板块（邀请信 + 读书感悟）。
 */

export const unit30WritingTasks: WritingTask[] = [
  {
    id: 'u30-w1',
    title: 'Inviting a Poet to Poetry Week',
    genre: '应用文 · 邀请信',
    wordHint: '词数 80 左右',
    prompt:
      '你校文学社将举办“诗歌周”。请用英语给诗人方女士写一封邀请信，邀请她来校朗诵作品并指导社员写诗：',
    requirements: [
      '介绍自己与活动背景（诗歌周）；',
      '说明邀请的具体内容（朗诵、分享创作心得、指导写诗）；',
      '表达期待，请她尽早回复。',
    ],
    modelEssay: [
      'Inviting a Poet to Poetry Week',
      'Dear Ms Fang,',
      'I am Li Hua from the school literary society. I am writing to invite you to our Poetry Week next month.',
      'It would be our honour if you could give a reading on Friday afternoon and share how you find inspiration in daily life. Our members also hope to learn how to choose a rhyme or a metaphor for their first poems.',
      'We would be glad to cover your travel costs. Looking forward to your early reply.',
      'Yours sincerely,',
      'Li Hua',
    ],
    checklist: [
      '是否涵盖全部三个要点（背景 / 具体内容 / 期待回复）？',
      '是否使用虚拟语气表达委婉请求（It would be our honour if you could…）？',
      '是否至少用到 2 个 Unit 5 词汇（如 poetry / rhyme / metaphor / recite / imagery）？',
      '格式是否完整（称呼、正文、落款），语气是否礼貌得体？',
      '词数是否 80 左右，是否保留标题？',
    ],
  },
  {
    id: 'u30-w2',
    title: 'The Poem That Warms Me',
    genre: '夹叙夹议 · 读书感悟',
    wordHint: '词数 100 左右',
    prompt:
      '请以“The Poem That Warms Me”为题，用英语写一篇短文，介绍一首你喜爱的诗及它对你的影响：',
    requirements: [
      '点明这首诗的题材与作者信息（可虚构背景）；',
      '赏析诗歌的内容与写作手法（意象、韵律、情感等）；',
      '结合自身经历，说明这首诗对你的影响或启发。',
    ],
    modelEssay: [
      'The Poem That Warms Me',
      'Among all the poems I have read, a short verse about winter warms me most.',
      'It was written by an unknown poet during a hard year. The poem says that even when snow covers the fields, a seed still dreams under the ground. The imagery is simple: white snow, dark earth, and one green dream. Yet the emotion is strong, and every line is full of hope.',
      'When I failed an important exam last winter, I recited the poem again and again. Its words were like moonlight in my room, quiet but bright. Poetry, I finally understood, does not drive the cold away; it teaches us to keep a warm heart inside it.',
      'Now a copy lies on my desk.',
    ],
    checklist: [
      '是否按「引入 — 赏析 — 影响」组织，三个要点齐全？',
      '赏析是否提到具体的写作手法（imagery / rhyme / metaphor / emotion）？',
      '是否至少用到 3 个 Unit 5 词汇（如 verse / imagery / recite / moonlight / poetry）？',
      '是否使用虚拟语气（If I had not read it, … 类结构）或其它本单元语法点？',
      '词数是否 100 左右，标题是否保留？',
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit30WritingTasks;
