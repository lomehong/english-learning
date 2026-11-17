import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修四 Unit 2（Iconic Attractions）语法点：倒装句（完全倒装与部分倒装） */

export const unit12GrammarPoints: GrammarPoint[] = [
  {
    id: 'full-inversion',
    title: '完全倒装（地点状语提前 + 位移动词）',
    tagline: '表地点的介词短语或 here / there 等提前，谓语动词（stand / lie / stand 类）整个放到主语前，主谓不再倒装助动词。',
    forms: [
      { label: '地点状语 + 动词 + 主语', detail: 'South of the city lies a famous bay. / On the hill stands an old lighthouse.' },
      { label: 'here / there + 动词 + 主语', detail: 'Here comes the tour guide! / There goes the last ferry.' },
      { label: '分词短语提前', detail: 'Standing on the rocks is a row of fishing boats.（现在分词提前表存在）' },
      { label: '主语为代词时不倒装', detail: 'Here it comes. / There she goes.（代词主语仍位于动词前）' },
    ],
    usages: [
      '完全倒装把“地点 / 存在”信息放到句首突出场景，常见于景物描写，谓语动词与后面的主语保持单复数一致',
      '常与 stand、lie、sit、hang、live、come、go 等不及物动词连用：In the valley lies a quiet village.',
      'here / there 开头的句子里，主语是名词时倒装，是代词时用正常语序',
      '分词短语（being / standing / seated 等）提前构成存在句式时同样属于完全倒装：Seated on the grass are hundreds of visitors.',
    ],
    markers: ['South/North of … lies', 'On the hill stands', 'Here comes', 'There goes', 'In the valley lies'],
    examples: [
      { en: 'South of the equator lies a line of tropical islands.', zh: '赤道以南分布着一串热带岛屿。' },
      { en: 'On top of the white dome sits a golden sail.', zh: '白色穹顶上立着一片金色的船帆。' },
      { en: 'There goes the early boat to the reef.', zh: '开往礁石的早班船出发了。' },
    ],
    tips: [
      '完全倒装只把整个谓语放到主语前，不再加助动词：On the rock stands a tower. 不说 On the rock does stand a tower.',
      '谓语动词的数与倒装后的主语（动词之后的名词）一致：On the hill stand two towers.',
      '主语是代词时禁止倒装：Here you are. 不能说 Here are you（表示“给你”时）。',
    ],
  },
  {
    id: 'partial-inversion',
    title: '部分倒装（否定副词提前 / only 状语提前）',
    tagline: 'Never、Nor、Not only、Only + 状语等放到句首时，只把助动词（或 be / 情态动词）提到主语前。',
    forms: [
      { label: '否定副词句首', detail: 'Never / Seldom / Little + 助动词 + 主语 + 动词：Never will you see such colour.' },
      { label: 'not only … but also 句首', detail: 'Not only is the bay beautiful, but it is also rich in fish.' },
      { label: 'only + 状语句首', detail: 'Only in this park can you see wild kangaroos.（only 后须是状语才倒装）' },
      { label: 'so / neither 表同类', detail: 'The guide liked the reef. So did the visitors. / Neither have I seen it.' },
    ],
    usages: [
      '句首为否定或半否定词（never、seldom、hardly、little、not until 等）时，句子须部分倒装',
      '“only + 状语（介词短语 / 从句 / 副词）”位于句首时倒装；only 修饰主语时不倒装：Only she knows the way.',
      'not only … but also 连接两个分句时，第一个分句倒装，第二个分句用正常语序',
      'so / neither / nor 表示“前面所说也适用于另一主体”时，用“so / neither + 助动词 + 主语”结构',
    ],
    markers: ['Never will …', 'Seldom does …', 'Not only is …', 'Only in this way can …', 'So did …', 'Neither have …'],
    examples: [
      { en: 'Never before have I seen such an iconic bridge.', zh: '我从未见过如此标志性的大桥。' },
      { en: 'Only in the temperate zone can these herbs be found.', zh: '只有在温带才能找到这些药草。' },
      { en: 'Not only is the harbour busy, but it is also full of history.', zh: '这座海港不仅繁忙，而且充满历史感。' },
    ],
    tips: [
      '部分倒装只提前助动词 / be / 情态动词，行为动词仍留在原位：Never shall I forget it. 不能说 Never I shall forget it 也不说 Never will I forgetting it。',
      'not until 的倒装在主句发生：Not until dark did they leave the beach.',
      'so 表“的确如此”（同一主体）不倒装：— It is grand. — So it is.；表“也”（另一主体）才倒装：So is mine.',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 2 Iconic Attractions */
export const unit12Exercises: GrammarExercise[] = [
  {
    id: 'u32-g1',
    type: 'mcq',
    pointId: 'full-inversion',
    stem: 'South of the city ______, a quiet bay where fishing boats rest.',
    options: ['lies a national park', 'a national park lies', 'does a national park lie', 'a national park does lie'],
    answerIndex: 0,
    explanation:
      '地点状语 South of the city 提前引出完全倒装，谓语动词 lies 整体置于主语之前，故选 A；B 为正常语序，C 加了助动词属部分倒装误用，D 结构错误。',
  },
  {
    id: 'u32-g2',
    type: 'mcq',
    pointId: 'full-inversion',
    stem: 'On the white dome of the concert hall ______ that shines in the sun.',
    options: ['a golden sail sits', 'sits a golden sail', 'a golden sail does sit', 'does a golden sail sit'],
    answerIndex: 1,
    explanation:
      '介词短语 On the white dome 提前，用完全倒装“动词 + 主语”，故选 B；A 为正常语序不合倒装要求，C、D 混入助动词错误。',
  },
  {
    id: 'u32-g3',
    type: 'mcq',
    pointId: 'full-inversion',
    stem: 'Look! Here ______, the guide who will take us to the reef.',
    options: ['comes the bus', 'the bus comes', 'does the bus come', 'comes it'],
    answerIndex: 0,
    explanation:
      'here 位于句首且主语 the bus 是名词，用完全倒装 Here comes the bus，故选 A；B 未倒装，C 多余助动词，D 代词主语须用 Here it comes。',
  },
  {
    id: 'u32-g4',
    type: 'mcq',
    pointId: 'partial-inversion',
    stem: 'Never before ______ such a fantastic view of the tropical coast.',
    options: ['I have seen', 'have I seen', 'I had seen', 'did I saw'],
    answerIndex: 1,
    explanation:
      'Never before 位于句首引起部分倒装，助动词提到主语前，由 before 知用完成时，故选 B；A 未倒装，C 时态不当且未倒装，D 情态下动词应用原形 see。',
  },
  {
    id: 'u32-g5',
    type: 'mcq',
    pointId: 'partial-inversion',
    stem: 'Only in this temperate park ______ those rare herbs.',
    options: ['we can find', 'can we find', 'we could find', 'find we can'],
    answerIndex: 1,
    explanation:
      '“Only + 地点状语”位于句首，句子须部分倒装，情态动词 can 提到主语前，故选 B；A 未倒装，C 时态与语序均误，D 语序混乱。',
  },
  {
    id: 'u32-g6',
    type: 'mcq',
    pointId: 'partial-inversion',
    stem: 'Not only ______ its famous reef, but it also has a lively fish market.',
    options: ['the town has', 'has the town', 'the town had', 'does the town has'],
    answerIndex: 1,
    explanation:
      'Not only 位于句首引导第一个分句时须部分倒装，has 提到主语 the town 之前，故选 B；A 未倒装，C 时态不符，D does 后应用原形 have。',
  },
  {
    id: 'u32-f1',
    type: 'fill',
    pointId: 'full-inversion',
    stem: 'In the north of the country ______ a famous waterfall.（把括号中的词排成正确语序：lies / waterfall / a / famous）（提示：完全倒装）',
    answer: 'lies a famous waterfall',
    explanation:
      '介词短语 In the north of the country 提前，用完全倒装：动词 lies + 主语 a famous waterfall。',
  },
  {
    id: 'u32-f2',
    type: 'fill',
    pointId: 'partial-inversion',
    stem: 'Seldom ______ ______ (do / tourists) see turtles hatching at noon.（填入正确语序）（提示：部分倒装）',
    answer: 'do tourists',
    explanation:
      '否定副词 Seldom 位于句首，句子部分倒装：助动词 do 提到主语 tourists 之前，填 do tourists。',
  },
  {
    id: 'u32-f3',
    type: 'fill',
    pointId: 'partial-inversion',
    stem: 'Only after the rainy season ______ the road ______ (be / passable) again.（填入正确形式）（提示：部分倒装）',
    answer: 'is passable',
    explanation:
      'Only + 时间状语位于句首引起部分倒装，be 动词 is 提到主语 the road 前，填 is passable。',
  },
  {
    id: 'u32-f4',
    type: 'fill',
    pointId: 'partial-inversion',
    stem: '— I have never kayaked across a strait. — Neither ______ ______ (have / I).（填入正确语序）（提示：部分倒装）',
    answer: 'have i',
    acceptable: ['have I'],
    explanation:
      'Neither 表示“另一主体也不”时用部分倒装，填 have I（输入时不分大小写均可判对）。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit12GrammarPoints, exercises: unit12Exercises };
