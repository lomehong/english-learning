import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修一 Unit 3（Fascinating Parks）语法点：动词-ing形式作主语与宾语 */

export const unit8GrammarPoints: GrammarPoint[] = [
  {
    id: 'ing-as-subject',
    title: '动词-ing形式作主语',
    tagline: '动名词短语作主语常表示一般性、习惯性的行为，谓语动词用单数。',
    forms: [
      { label: '肯定', detail: 'Doing sth. + 单数谓语：Hiking in the valley brings us great joy.' },
      { label: '否定', detail: 'Not doing sth. + 谓语：Not booking early means waiting in long queues.' },
      { label: 'It 形式主语', detail: 'It is no use / no good / a waste of time doing sth.' },
      { label: 'there be 句型', detail: 'There is no sense in doing sth.（做某事没有道理）' },
    ],
    usages: [
      '动名词作主语表示抽象或习惯性的行为，谓语动词用第三人称单数：Seeing is believing.',
      'It 作形式主语的常见搭配：It is no use doing… / It is worth doing… / It is a waste of time doing…',
      '否定形式是在动名词前加 not：Not following the trail carefully may get hikers lost.',
      '动名词主语与不定式主语的区别：动名词多指一般行为，不定式多指具体某次动作',
    ],
    markers: ['Doing sth. is …', 'It is no use / good doing', 'It is worth doing', 'It is a waste of time doing'],
    examples: [
      { en: 'Camping beside the waterfall is an unforgettable experience.', zh: '在瀑布边露营是一次难忘的经历。' },
      { en: 'It is no use complaining about the weather in the mountains.', zh: '抱怨山里的天气没有用。' },
      { en: 'Visiting the park in autumn offers a splendid view of the glacier.', zh: '秋天游览公园能欣赏到冰川的壮丽景色。' },
    ],
    tips: [
      '动名词作主语时谓语动词用单数，不要误用复数',
      '习惯搭配 It is no use doing 中用动名词，不用不定式',
      '主语与宾语保持形式一致：Seeing is believing（不说 To see is believing）',
    ],
  },
  {
    id: 'ing-as-object',
    title: '动词-ing形式作宾语',
    tagline: '部分动词与介词后只能接动名词作宾语；注意区别后接不定式的动词。',
    forms: [
      { label: '只接 doing 的动词', detail: 'enjoy / avoid / finish / practise / mind / suggest / keep + doing' },
      { label: '介词 + doing', detail: 'be good at / look forward to / be devoted to + doing' },
      { label: '短语动词 + doing', detail: 'give up / insist on / think about + doing' },
      { label: '对比：接 to do', detail: 'want / decide / hope / refuse / agree + to do（to 为不定式）',
      },
    ],
    usages: [
      'enjoy、avoid、finish、practise、mind、suggest、keep 等动词后只能接动名词作宾语',
      '介词后接动名词：The visitors are interested in exploring the wilderness.',
      'look forward to、be used to、stick to、devote … to 中的 to 是介词，后接 doing',
      'want、decide、hope、plan 等后接不定式 to do；个别动词两者皆可但含义不同（如 stop to do / stop doing）',
    ],
    markers: ['enjoy / avoid / finish doing', 'look forward to doing', 'insist on doing', 'how about doing', 'stop doing vs stop to do'],
    examples: [
      { en: 'Most visitors enjoy taking photos of the reindeer.', zh: '大多数游客喜欢给驯鹿拍照。' },
      { en: 'We are looking forward to hiking along the new trail.', zh: '我们盼着沿新步道徒步。' },
      { en: 'You should avoid feeding the animals in the park.', zh: '你应该避免在公园里投喂动物。' },
    ],
    tips: [
      'look forward to 中的 to 是介词，后接动名词，不接动词原形',
      'stop doing 表示“停止做某事”，stop to do 表示“停下来去做另一件事”',
      'suggest doing 表示“建议做某事”；suggest 不接不定式作宾语',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 3 Fascinating Parks */
export const unit8Exercises: GrammarExercise[] = [
  {
    id: 'u8-g1',
    type: 'mcq',
    pointId: 'ing-as-subject',
    stem: '______ the northern lights is a once-in-a-lifetime experience for most travellers.',
    options: ['Seeing', 'See', 'Saw', 'Seen'],
    answerIndex: 0,
    explanation:
      '动名词短语作主语表示一般性行为，谓语 is 用单数，句首应填 Seeing，故选 A；See 是动词原形不能作主语，Saw 与 Seen 也不能充当主语。',
  },
  {
    id: 'u8-g2',
    type: 'mcq',
    pointId: 'ing-as-subject',
    stem: 'It is no use ______ tickets now; the light show has been sold out for weeks.',
    options: ['booking', 'to book', 'book', 'booked'],
    answerIndex: 0,
    explanation:
      'It is no use 后接动名词作真正主语，用 booking，故选 A；该固定搭配不接不定式或动词原形。',
  },
  {
    id: 'u8-g3',
    type: 'mcq',
    pointId: 'ing-as-object',
    stem: 'The young guide enjoys ______ photos of the glacier in different seasons.',
    options: ['taking', 'to take', 'take', 'took'],
    answerIndex: 0,
    explanation:
      'enjoy 后只能接动名词作宾语，用 taking，故选 A；enjoy 不接不定式或动词原形。',
  },
  {
    id: 'u8-g4',
    type: 'mcq',
    pointId: 'ing-as-object',
    stem: 'In the nature park, visitors should avoid ______ the wild reindeer.',
    options: ['feeding', 'to feed', 'feed', 'fed'],
    answerIndex: 0,
    explanation:
      'avoid 后只能接动名词作宾语，用 feeding，故选 A；其余形式均不能作 avoid 的宾语。',
  },
  {
    id: 'u8-g5',
    type: 'mcq',
    pointId: 'ing-as-object',
    stem: 'We are all looking forward to ______ along the valley trail next weekend.',
    options: ['hiking', 'hike', 'hiked', 'be hiked'],
    answerIndex: 0,
    explanation:
      'look forward to 中的 to 是介词，后面接动名词 hiking，故选 A；不能接动词原形或过去式。',
  },
  {
    id: 'u8-g6',
    type: 'mcq',
    pointId: 'ing-as-object',
    stem: 'The keeper has finished ______ the enclosure, so the animals can come back now.',
    options: ['cleaning', 'to clean', 'clean', 'cleans'],
    answerIndex: 0,
    explanation:
      'finish 后只能接动名词作宾语，用 cleaning，故选 A；finish 不接不定式作宾语。',
  },
  {
    id: 'u8-f1',
    type: 'fill',
    pointId: 'ing-as-subject',
    stem: '______ (walk) along the quiet trail is the best way to enjoy the scenery.（用所给词的适当形式填空）',
    answer: 'Walking',
    explanation:
      '动名词短语作主语，表示一般性行为，谓语 is 用单数，填 Walking。',
  },
  {
    id: 'u8-f2',
    type: 'fill',
    pointId: 'ing-as-object',
    stem: 'Thank you for ______ (show) us around the boundary of the park.（用所给词的适当形式填空）',
    answer: 'showing',
    explanation:
      '介词 for 后接动名词作宾语，填 showing。',
  },
  {
    id: 'u8-f3',
    type: 'fill',
    pointId: 'ing-as-subject',
    stem: 'It is worth ______ (visit) the national park in early autumn.（用所给词的适当形式填空）',
    answer: 'visiting',
    explanation:
      'It is worth doing 为固定搭配，worth 后接动名词，填 visiting。',
  },
  {
    id: 'u8-f4',
    type: 'fill',
    pointId: 'ing-as-object',
    stem: 'The villagers kept ______ (sell) handmade souvenirs to the hikers every summer.（用所给词的适当形式填空）',
    answer: 'selling',
    explanation:
      'keep doing 表示“持续做某事”，keep 后接动名词作宾语，填 selling。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit8GrammarPoints, exercises: unit8Exercises };
