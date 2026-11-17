import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修四 Unit 3（Sea Exploration）语法点：动词不定式（作主语宾语 / 作定语状语） */

export const unit13GrammarPoints: GrammarPoint[] = [
  {
    id: 'infinitive-subject-object',
    title: '不定式作主语与宾语（it 形式主语 / 形式宾语）',
    tagline: '不定式短语作主语常后移，句首用 it 占位；作宾语时紧跟及物动词，疑问词 + 不定式可作宾语。',
    forms: [
      { label: '不定式作主语', detail: 'To explore the sea needs courage. = It needs courage to explore the sea.' },
      { label: 'it 形式主语', detail: 'It is urgent to study the Arctic.（真正主语 to study 后移）' },
      { label: '不定式作宾语', detail: 'The team decided to extend the voyage. / They hope to reach the reef.' },
      { label: '疑问词 + 不定式', detail: 'The captain told us how to read the log. / They discussed where to anchor.' },
    ],
    usages: [
      '不定式作主语表示具体的、一次性的动作，谓语动词用单数；句式较长时常用 it 作形式主语而把不定式后移',
      '常接不定式作宾语的动词有 want、hope、decide、agree、refuse、plan、fail 等；help 后可接 to do 或 do',
      '“疑问词 what / how / where / when + 不定式”相当于名词短语，可作宾语，不能作谓语',
      'think / find / believe 等复合宾语结构中，常用 it 作形式宾语代替后移的不定式：We found it hard to sail at night.',
    ],
    markers: ['It is … to do', 'It takes … to do', 'decide / hope / plan to do', 'how / where / when to do', 'find it … to do'],
    examples: [
      { en: 'It is important to protect the marine park.', zh: '保护这座海洋公园很重要。' },
      { en: 'The divers found it difficult to see in the deep water.', zh: '潜水员发现在深水中很难看清东西。' },
      { en: 'The young sailor asked how to tie the knots.', zh: '年轻水手询问如何打绳结。' },
    ],
    tips: [
      '不定式作主语时谓语用单数：To sail at night takes courage. 不能说 take。',
      '形式宾语 it 不能省略：We found it hard to… 不能写成 We found hard to…。',
      '介词后一般不直接接不定式，但疑问词 + 不定式可作介词宾语：They talked about how to cross the strait.',
    ],
  },
  {
    id: 'infinitive-attr-adverbial',
    title: '不定式作定语与状语（only to do 表意外结果）',
    tagline: '不定式常放在抽象名词后作定语说明内容；作状语表目的或结果，only to do 多表出乎意料的结果。',
    forms: [
      { label: '不定式作定语', detail: 'the need to study the sea / a chance to sail / the right to fish here' },
      { label: '目的状语', detail: 'They set out early to catch the tide.（= in order to catch the tide）' },
      { label: '结果状语', detail: 'He hurried to the beach, only to find the turtles had gone.' },
      { label: '情绪形容词后', detail: 'We were glad to see the coral. / She was sorry to withdraw the fleet.' },
    ],
    usages: [
      '不定式作定语放在被修饰名词之后，常与 need、chance、ability、decision、way 等抽象名词连用',
      '不定式作目的状语可放在句首或句中，否定式用 in order not to / so as not to',
      '“only + 不定式”作结果状语，表示令人失望或意外的结果，暗含“结果却……”',
      '修饰表情绪的形容词（glad、sorry、surprised、free 等）时，不定式说明产生情绪的原因',
    ],
    markers: ['the need to …', 'a chance to …', 'set out to …', 'only to find', 'only to be told', 'be glad / sorry to …'],
    examples: [
      { en: 'There is an urgent need to study climate change.', zh: '研究气候变化刻不容缓。' },
      { en: 'They rowed all night, only to find the bay empty.', zh: '他们划了一整夜船，结果却发现海湾空无一物。' },
      { en: 'The students were excited to touch a real ship log.', zh: '学生们触摸真正的航海日志时兴奋不已。' },
    ],
    tips: [
      '作定语的不定式与所修饰名词之间常有逻辑上的动宾或主谓关系：a book to read（读的书）／a man to trust（可信赖的人）。',
      'only to do 表意外结果时前面常用逗号隔开，不能改写成 so as to。',
      '目的状语否定不用 not to 单独置于句首，须用 in order not to：In order not to miss the tide, we left at dawn.',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 3 Sea Exploration */
export const unit13Exercises: GrammarExercise[] = [
  {
    id: 'u33-g1',
    type: 'mcq',
    pointId: 'infinitive-subject-object',
    stem: '______ is the duty of the marine station to watch the health of the reef.',
    options: ['It', 'This', 'That', 'There'],
    answerIndex: 0,
    explanation:
      '真正主语是后面的 to watch…，句首应用形式主语 It，构成 It is … to do 结构，故选 A；B、C 不能作形式主语，D 无此用法。',
  },
  {
    id: 'u33-g2',
    type: 'mcq',
    pointId: 'infinitive-subject-object',
    stem: 'The captain told the young sailors ______ the ship\u2019s log every day.',
    options: ['how to keep', 'how keep', 'to how keep', 'how kept'],
    answerIndex: 0,
    explanation:
      '“疑问词 + 不定式”作 told 的宾语，语序为 how to keep，故选 A；B 缺 to，C 语序颠倒，D 用了过去式。',
  },
  {
    id: 'u33-g3',
    type: 'mcq',
    pointId: 'infinitive-subject-object',
    stem: 'The divers found ______ hard to breathe under such depth.',
    options: ['that', 'this', 'it', 'one'],
    answerIndex: 2,
    explanation:
      '不定式 to breathe 是真正的宾语，空处应用形式宾语 it，构成 find it + adj. + to do，故选 C；that 引导从句后不能再接 to do，this、one 不能作形式宾语。',
  },
  {
    id: 'u33-g4',
    type: 'mcq',
    pointId: 'infinitive-attr-adverbial',
    stem: 'There is an urgent need ______ the Arctic in order to understand climate change.',
    options: ['studying', 'to study', 'studied', 'to studying'],
    answerIndex: 1,
    explanation:
      'need 后接不定式作定语，表示“研究北极的这一需要”，用 to study，故选 B；A、C 不能作 need 的定语，D 结构错误。',
  },
  {
    id: 'u33-g5',
    type: 'mcq',
    pointId: 'infinitive-attr-adverbial',
    stem: 'The team rowed through the storm all night, ______ that the harbour had been closed.',
    options: ['only to find', 'only finding', 'so as to find', 'in order to find'],
    answerIndex: 0,
    explanation:
      '逗号后表“出乎意料的结果”，用 only + 不定式，故选 A；B 不能表达意外结果，C、D 表目的与语境不符。',
  },
  {
    id: 'u33-g6',
    type: 'mcq',
    pointId: 'infinitive-attr-adverbial',
    stem: 'The old fisherman went to the pier early every morning ______ the first tide.',
    options: ['to catch', 'catching', 'only to catch', 'so as to not catch'],
    answerIndex: 0,
    explanation:
      '表目的的不定式用 to do，故选 A；B 现在分词不能作目的状语，C 表意外结果与语境不符，D 否定形式错误且语义不通。',
  },
  {
    id: 'u33-f1',
    type: 'fill',
    pointId: 'infinitive-subject-object',
    stem: 'It takes months of training ______ ______ (sail) a ship across the ocean.（填所给动词的正确形式）',
    answer: 'to sail',
    explanation:
      'It takes … to do 结构中真正主语是不定式，填 to sail。',
  },
  {
    id: 'u33-f2',
    type: 'fill',
    pointId: 'infinitive-subject-object',
    stem: 'The two ports discussed where ______ ______ (build) the new lighthouse.（填所给动词的正确形式）',
    answer: 'to build',
    explanation:
      '“疑问词 where + 不定式”作 discussed 的宾语，填 to build。',
  },
  {
    id: 'u33-f3',
    type: 'fill',
    pointId: 'infinitive-attr-adverbial',
    stem: 'We were glad ______ ______ (hear) that the trapped dolphin had been set free.（填所给动词的正确形式）',
    answer: 'to hear',
    explanation:
      '表情绪的形容词 glad 后接不定式说明原因，填 to hear。',
  },
  {
    id: 'u33-f4',
    type: 'fill',
    pointId: 'infinitive-attr-adverbial',
    stem: 'They set out before dawn ______ ______ ______ (not / miss) the morning tide.（填所给词的正确形式，表目的）',
    answer: 'in order not to miss',
    acceptable: ['so as not to miss'],
    explanation:
      '表目的的否定须用 in order not to（句中也可用 so as not to），填 in order not to miss。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit13GrammarPoints, exercises: unit13Exercises };
