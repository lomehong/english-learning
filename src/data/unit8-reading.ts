import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修一 Unit 3（Fascinating Parks）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 3 词表），避免任何教材原文版权问题。
 */

export const unit8Passages: ReadingPassage[] = [
  {
    id: 'u8-p1',
    title: 'A Morning in Sarek',
    genre: '记叙文',
    paragraphs: [
      'Last summer, my family and I visited Sarek National Park in the far north of Europe. We spent the first night in a small cottage at the edge of the wilderness.',
      'In the morning, we hiked up a stone trail and suddenly saw a vast valley below us. Rivers of ice from the ancient glacier still shine between the mountains, and groups of reindeer walk freely across the territory, hunting for food.',
      'To protect this peaceful world, the park has banned all hunting, and visitors may not cross the boundary without a guide. Standing there in the wind, I understood why people call this place one of Europe\u2019s last treasures.',
    ],
    glossary: [
      { wordId: 'cottage', forms: ['cottage'] },
      { wordId: 'wilderness', forms: ['wilderness'] },
      { wordId: 'hike', forms: ['hiked'] },
      { wordId: 'trail', forms: ['trail'] },
      { wordId: 'vast', forms: ['vast'] },
      { wordId: 'valley', forms: ['valley'] },
      { wordId: 'glacier', forms: ['glacier'] },
      { wordId: 'reindeer', forms: ['reindeer'] },
      { wordId: 'territory', forms: ['territory'] },
      { wordId: 'ban', forms: ['banned'] },
      { wordId: 'boundary', forms: ['boundary'] },
    ],
    questions: [
      {
        id: 'u8-r1-1',
        type: 'detail',
        stem: 'What did the writer see from the stone trail?',
        options: [
          'A vast valley with rivers of ice.',
          'A crowded theme park.',
          'A group of photographers.',
          'A tall stone wall.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "we hiked up a stone trail and suddenly saw a vast valley below us. Rivers of ice from the ancient glacier…" 可知作者看到的是冰河纵横的辽阔山谷，故选 A。',
      },
      {
        id: 'u8-r1-2',
        type: 'detail',
        stem: 'What does the park do to protect the area?',
        options: [
          'It has banned all hunting.',
          'It sells tickets only in winter.',
          'It allows visitors to feed the reindeer.',
          'It moves the reindeer to city zoos.',
        ],
        answerIndex: 0,
        explanation:
          '由第三段 "the park has banned all hunting" 可知公园禁止一切狩猎以保护该地区，故选 A。',
      },
      {
        id: 'u8-r1-3',
        type: 'main-idea',
        stem: 'What is the best title for the passage?',
        options: [
          'A Morning in a National Park',
          'The History of European Roads',
          'How to Build a Wooden Cottage',
          'Winter Sports in the North',
        ],
        answerIndex: 0,
        explanation:
          '全文记叙了作者一家在萨勒克国家公园一个清晨的见闻与感受，可概括为“国家公园的清晨”，故选 A；B、C、D 均偏离文意。',
      },
    ],
  },
  {
    id: 'u8-p2',
    title: 'Welcome to Green Lake Wetland Park',
    genre: '应用文',
    paragraphs: [
      'Green Lake Wetland Park lies in the south of the city and covers an area of ninety square kilometres. Its theme is the harmony between people and nature.',
      'Visitors can hike along the wooden trails, watch diverse waterbirds, or take a boat to the waterfall at sunset, which many people describe as a rare spectacle. The park is also home to fish, frogs and other wild inhabitants, so fishing and swimming are strictly banned.',
      'Opening hours: 7 a.m. to 6 p.m. from Tuesday to Sunday. Guides are free for groups of ten or more. Remember to book your tickets online before you set off. Come and enjoy the splendid scenery of all four seasons!',
    ],
    glossary: [
      { wordId: 'theme', forms: ['theme'] },
      { wordId: 'hike', forms: ['hike'] },
      { wordId: 'diverse', forms: ['diverse'] },
      { wordId: 'waterfall', forms: ['waterfall'] },
      { wordId: 'spectacle', forms: ['spectacle'] },
      { wordId: 'inhabitant', forms: ['inhabitants'] },
      { wordId: 'ban', forms: ['banned'] },
      { wordId: 'splendid', forms: ['splendid'] },
      { wordId: 'scenery', forms: ['scenery'] },
    ],
    questions: [
      {
        id: 'u8-r2-1',
        type: 'detail',
        stem: 'What can visitors do at sunset in the park?',
        options: [
          'Take a boat to the waterfall.',
          'Go fishing in the wetland.',
          'Swim near the wooden trails.',
          'Hunt waterbirds with a camera trap.',
        ],
        answerIndex: 0,
        explanation:
          '由 "take a boat to the waterfall at sunset" 可知游客可在日落时乘船去瀑布，故选 A；钓鱼、游泳已被严格禁止，B、C 不符。',
      },
      {
        id: 'u8-r2-2',
        type: 'detail',
        stem: 'Who can get free guides in the park?',
        options: [
          'Groups of ten or more.',
          'Children under six.',
          'Students with library cards.',
          'Visitors over seventy.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Guides are free for groups of ten or more" 可知十人及以上的团队可免费获得讲解服务，故选 A。',
      },
      {
        id: 'u8-r2-3',
        type: 'inference',
        stem: 'What can we infer about Green Lake Wetland Park?',
        options: [
          'It values the protection of its wildlife.',
          'It is only open on weekdays in winter.',
          'It charges guides a high fee.',
          'It was built mainly for fishing lovers.',
        ],
        answerIndex: 0,
        explanation:
          '由公园严禁钓鱼游泳、以人与自然和谐为主题等信息可推知它重视野生动物保护，故选 A；其余选项与原文不符。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit8Passages;
