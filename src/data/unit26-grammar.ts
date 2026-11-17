import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修三 Unit 1（Art）语法点：完全倒装 / 部分倒装（only + 状语） */

export const unit26GrammarPoints: GrammarPoint[] = [
  {
    id: 'u26-full-inversion',
    title: '完全倒装（here / there / away 等方位副词开头）',
    tagline: '方位副词放句首、主语是名词：整个谓语提到主语之前，用完全倒装。',
    forms: [
      { label: 'here / there 开头', detail: 'Here/There + 不及物动词 + 名词主语：Here comes the bus. / There goes the bell.' },
      { label: '方位副词开头', detail: 'Away/Out/In/Up/Down/Off + 不及物动词 + 名词主语：Away flew the birds.' },
      { label: 'there be 类存在句', detail: 'There + be/stand/lie/live + 主语：There stands a bronze sculpture at the gate.' },
      { label: '主语为代词（不倒装）', detail: '副词 + 代词 + 动词：Here it comes. / Away they flew.（代词主语不倒装）' },
    ],
    usages: [
      'here、there、now、then 等地点/时间副词位于句首，主语是名词且谓语是不及物动词（be/come/go/stand/lie/fly 等）时，用完全倒装',
      'away、out、in、up、down、off 等方位副词开头、谓语为运动类不及物动词时也用完全倒装，以生动描写动作',
      '完全倒装句中谓语动词与后面的主语保持数的一致：Here comes the bus / Here come the students',
      '主语是代词（he/she/it/they 等）时保持正常语序，不倒装：Here it is（不说 Here is it）',
    ],
    markers: ['here', 'there', 'away', 'out', 'down', 'up', 'now', 'then', 'off'],
    examples: [
      { en: 'Here comes the curator of the gallery.', zh: '画廊的馆长来了。' },
      { en: 'There stands a bronze sculpture at the gate.', zh: '门口立着一尊青铜雕塑。' },
      { en: 'Away flew the birds when the painter approached.', zh: '画家走近时鸟儿飞走了。' },
    ],
    tips: [
      '完全倒装只用于不及物动词（be/come/go/stand/sit/lie/fly 等），及物动词不能这样倒装',
      '主语是代词时不倒装：说 Here it is，不说 Here is it',
      'there be 存在句本身即完全倒装，be 动词与其后真正的主语保持数的一致',
    ],
  },
  {
    id: 'u26-partial-inversion-only',
    title: '部分倒装（only + 状语位于句首）',
    tagline: 'only + 状语放句首：只把助动词/情态动词/be 提到主语之前，实义动词留在原处。',
    forms: [
      { label: 'only + 介词短语', detail: 'Only in this way + can/will + 主语 + 动词原形：Only in this way can we protect the mural.' },
      { label: 'only + 时间状语从句', detail: 'Only when/after + 从句 + did/does/will + 主语 + 动词原形：Only when the lights dimmed did the painting glow.' },
      { label: 'only + 副词', detail: 'Only then/recently + did/has + 主语 + ……：Only then did she notice the signature.' },
      { label: '从句不倒装、主句倒装', detail: 'Only when he arrived did we begin.（从句 he arrived 保持正常语序）' },
    ],
    usages: [
      'only + 状语（介词短语/副词/状语从句）位于句首时，主句用部分倒装：把助动词、情态动词或 be 动词提到主语之前',
      'only + 状语从句位于句首时，倒装只发生在主句，从句本身保持正常语序',
      '助动词的选择与一般疑问句相同：依据时态与主语选用 do/does/did、will/can/should 等，实义动词用原形',
      '若 only 修饰的是主语而非状语，则不倒装：Only Tom knows the answer',
    ],
    markers: ['only in this way', 'only then', 'only when', 'only after', 'only by', 'only in recent years'],
    examples: [
      { en: 'Only in this gallery can you see so many watercolours.', zh: '只有在这家画廊你才能看到这么多水彩画。' },
      { en: 'Only then did the visitors notice the delicate details.', zh: '直到那时参观者才注意到那些精致的细节。' },
      { en: 'Only after the restoration did the mural show its original colours.', zh: '修复之后壁画才显出原本的色彩。' },
    ],
    tips: [
      'only 修饰主语时不倒装：说 Only she understands the sketch，不说 Only does she understand',
      'only + 状语从句位于句首时，倒装发生在主句，从句用正常语序，不要把从句也倒装',
      '部分倒装只提前助动词/情态动词/be，实义动词仍留在原形位置，不能再变位',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 1 Art */
export const unit26Exercises: GrammarExercise[] = [
  {
    id: 'u26-g1',
    type: 'mcq',
    pointId: 'u26-full-inversion',
    stem: 'Here ______ the curator who takes care of the watercolour collection.',
    options: ['comes', 'come', 'coming', 'does come'],
    answerIndex: 0,
    explanation:
      'here 位于句首且主语 the curator 是名词，谓语是不及物动词 come，用完全倒装，主语为第三人称单数，故选 A。C 不是谓语形式，D 借助 does 后应用动词原形 come。',
  },
  {
    id: 'u26-g2',
    type: 'mcq',
    pointId: 'u26-partial-inversion-only',
    stem: 'Only after the restoration ______ the true colours of the mural.',
    options: ['visitors noticed', 'did visitors notice', 'visitors did notice', 'noticed visitors'],
    answerIndex: 1,
    explanation:
      'only after 引导的状语位于句首，主句需部分倒装：把助动词 did 提到主语 visitors 之前，其后动词用原形 notice，故选 B；A、C 未倒装，D 是完全倒装且缺助动词。',
  },
  {
    id: 'u26-g3',
    type: 'mcq',
    pointId: 'u26-full-inversion',
    stem: '— Where is my sketchbook? — ______.',
    options: ['Here is it', 'Here it is', 'It here is', 'Is here it'],
    answerIndex: 1,
    explanation:
      'here 位于句首时若主语是代词 it，则不倒装，用正常语序 Here it is，故选 B；A 误将代词主语倒装，C、D 语序混乱。',
  },
  {
    id: 'u26-g4',
    type: 'mcq',
    pointId: 'u26-partial-inversion-only',
    stem: 'Only when the lights went out ______ how bright the abstract painting was.',
    options: ['we realised', 'did we realise', 'we did realise', 'realised we'],
    answerIndex: 1,
    explanation:
      'only when 引导的从句位于句首，主句用部分倒装：did 提到主语 we 之前，后接动词原形 realise，故选 B；A、C 未倒装，D 缺助动词且语序不对。',
  },
  {
    id: 'u26-g5',
    type: 'mcq',
    pointId: 'u26-full-inversion',
    stem: 'Out ______ after finishing the last brushstroke, tired but satisfied.',
    options: ['walked he', 'did the painter walk', 'the painter walked out', 'walked the painter'],
    answerIndex: 3,
    explanation:
      '方位副词 out 位于句首、主语 the painter 是名词、谓语为不及物动词 walk，用完全倒装：Out walked the painter，故选 D；A 代词式倒装错位，B 部分倒装不用于此结构，C 语义重复 out。',
  },
  {
    id: 'u26-g6',
    type: 'mcq',
    pointId: 'u26-partial-inversion-only',
    stem: 'Only in this gallery ______ so many delicate ceramics in one hall.',
    options: ['you can see', 'can you see', 'you see', 'see you'],
    answerIndex: 1,
    explanation:
      'only + 介词短语 in this gallery 位于句首，句子需部分倒装：情态动词 can 提到主语 you 之前，故选 B；A、C 保持正常语序未倒装，D 语序错误。',
  },
  {
    id: 'u26-f1',
    type: 'fill',
    pointId: 'u26-full-inversion',
    stem: 'There ______ a bronze lion at the entrance of the museum.（用所给词的适当形式填空：stand）',
    answer: 'stands',
    explanation:
      'there be 类完全倒装句中，谓语动词与后面真正的主语 a bronze lion 保持一致，用第三人称单数 stands。',
  },
  {
    id: 'u26-f2',
    type: 'fill',
    pointId: 'u26-full-inversion',
    stem: 'Down ______ the heavy rain, and the outdoor sketch class had to stop.（用所给词的适当形式填空：come）',
    answer: 'came',
    explanation:
      '方位副词 down 位于句首，主语 the heavy rain 是名词，谓语 come 用完全倒装；叙述过去的事，填过去式 came。',
  },
  {
    id: 'u26-f3',
    type: 'fill',
    pointId: 'u26-partial-inversion-only',
    stem: 'Only when the painter stepped back ______ the whole picture come into view.（填适当的助动词）',
    answer: 'did',
    explanation:
      'only when 从句位于句首，主句用部分倒装；叙述过去动作，助动词 did 提到主语 the whole picture 之前，其后动词用原形 come。',
  },
  {
    id: 'u26-f4',
    type: 'fill',
    pointId: 'u26-partial-inversion-only',
    stem: 'Only in recent years ______ abstract art become popular among young people.（填适当的助动词）',
    answer: 'has',
    explanation:
      'only + 时间状语 in recent years 位于句首，句子需部分倒装；recent years 常与现在完成时连用，助动词 has 提到主语 abstract art 之前。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit26GrammarPoints, exercises: unit26Exercises };
