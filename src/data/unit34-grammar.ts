import type { GrammarExercise, GrammarPoint } from '../types';

/** 人教2019选择性必修四 Unit 4（Sharing）语法点：过去分词作表语宾补与 with 复合结构 */

export const unit14GrammarPoints: GrammarPoint[] = [
  {
    id: 'past-participle-predicative',
    title: '过去分词作表语与宾语补足语',
    tagline: '过去分词作表语描述状态与感受，作宾补说明宾语“被……”的状态：be married / have sth done / see sb seated。',
    forms: [
      { label: '作表语（状态）', detail: 'The road is muddy. / She is married to a doctor. / The door remained locked.' },
      { label: '作表语（感受）', detail: 'We were interested in the project. / He looked tired after the trip.' },
      { label: 'have / get + 宾语 + done', detail: 'The village had a new well dug. / She got her hair cut in town.' },
      { label: '感观 / 使役动词 + 宾语 + done', detail: 'We saw the donations given out. / They left the tools unlocked.' },
    ],
    usages: [
      '过去分词作表语表示主语所处的状态或感受，多来自及物动词：be interested / moved / tired / broken / married',
      '“have / get + 宾语 + 过去分词”表示请人做某事或某物遭到某种处理，宾语与动作是被动关系',
      'see、watch、hear、find、leave 等词后可接过去分词作宾语补足语，强调宾语被动的状态而非动作过程',
      'remain、become、grow 等系动词后同样可接过去分词作表语：The need remained unmet.',
    ],
    markers: ['be interested in', 'be moved by', 'remain locked', 'have sth done', 'get sth done', 'see sth done'],
    examples: [
      { en: 'The volunteers were exhausted but satisfied.', zh: '志愿者们筋疲力尽却心满意足。' },
      { en: 'The school had the broken roof repaired before the rainy season.', zh: '学校在雨季前请人修好了破损的屋顶。' },
      { en: 'We found the classroom cleaned and the books neatly piled.', zh: '我们发现教室被打扫过，书也码放整齐。' },
    ],
    tips: [
      '区分被动语态与表语结构：The house was painted last week（被动，动作）／The house was painted pink（表状态时可兼作表语）；关键看强调动作还是状态。',
      '“have sth done”也可表示“遭遇某种不幸”：He had his bike stolen. 他的自行车被偷了。',
      '宾补用过去分词还是现在分词看宾语关系：宾语被动用 done，宾语主动进行用 doing：We heard her singing / We heard the song sung.',
    ],
  },
  {
    id: 'with-composite',
    title: 'with 复合结构（with + 宾语 + 补足语）',
    tagline: 'with 后接宾语再加 done / doing / to do / 形容词 / 介词短语作补足语，在句中作状语或定语，描写背景与伴随。',
    forms: [
      { label: 'with + n. + 过去分词', detail: 'With the work finished, they shared a toast.（被动 / 已完成）' },
      { label: 'with + n. + 现在分词', detail: 'With the rain falling, the road soon became muddy.（主动 / 进行）' },
      { label: 'with + n. + 不定式', detail: 'With so much paperwork to do, she stayed up late.（将来 / 待做）' },
      { label: 'with + n. + adj. / 介词短语', detail: 'He slept with the window open. / She stood there with a comb in her hand.' },
    ],
    usages: [
      'with 复合结构常作原因、时间、条件或伴随状语，使句子紧凑，多用于书面描写',
      '补足语用过去分词、现在分词还是不定式取决于宾语与动作的关系：被动完成用 done，主动进行用 doing，待发生用 to do',
      '宾语补足语也可以是形容词、副词或介词短语，说明宾语的状态：with his hands full / with the light on',
      '“with + n. + to do”常带将来意味，且不定式可带自己的逻辑主语：With the doctor to operate tomorrow, the family felt hopeful.',
    ],
    markers: ['with the work finished', 'with the rain falling', 'with much to do', 'with the door open', 'with a comb in hand'],
    examples: [
      { en: 'With the donations distributed, the families could spend a warm winter.', zh: '捐款分发到位后，这些家庭可以过一个温暖的冬天了。' },
      { en: 'With the sun rising, the volunteers set off along the muddy path.', zh: '太阳升起时，志愿者们沿着泥泞的小路出发了。' },
      { en: 'She stood by the trunk with her notebook in her hand.', zh: '她站在树干旁，手里拿着笔记本。' },
    ],
    tips: [
      'with 复合结构不是完整句子，动词必须用非谓语形式：不能说 with the work was finished。',
      '宾语与补足语的主动被动关系是选 doing / done 的依据：with the boy leading the way（男孩带路）／with the way led by the boy 不自然，直接说 led by the boy。',
      '独立主格可省去 with：The work finished, they shared a toast.（更书面化）。',
    ],
  },
];

/** 10 道专项练习（6 单选 + 4 填空），词汇与情境取自 Unit 4 Sharing */
export const unit14Exercises: GrammarExercise[] = [
  {
    id: 'u34-g1',
    type: 'mcq',
    pointId: 'past-participle-predicative',
    stem: 'After walking on the muddy path for hours, the volunteers looked ______.',
    options: ['tiring', 'tired', 'tire', 'to tire'],
    answerIndex: 1,
    explanation:
      'look 后接表语描述“人感到疲惫”，用过去分词 tired，故选 B；tiring 意为“令人疲惫的”，多修饰事物，C、D 不能作表语。',
  },
  {
    id: 'u34-g2',
    type: 'mcq',
    pointId: 'past-participle-predicative',
    stem: 'The mountain school had two new classrooms ______ before the term began.',
    options: ['build', 'built', 'building', 'to build'],
    answerIndex: 1,
    explanation:
      '“have + 宾语 + 过去分词”表示“请人建造”，教室与 build 是被动关系，故选 B；A 不构成宾补，C 表主动进行，D 表将来的动作。',
  },
  {
    id: 'u34-g3',
    type: 'mcq',
    pointId: 'past-participle-predicative',
    stem: 'When we arrived, we found the food already ______ to the families in need.',
    options: ['distributing', 'distribute', 'distributed', 'distributes'],
    answerIndex: 2,
    explanation:
      'find + 宾语 + 过去分词作宾补，food 与 distribute 是被动关系，故选 C；A 现在分词表主动，B、D 形式不能作宾补。',
  },
  {
    id: 'u34-g4',
    type: 'mcq',
    pointId: 'with-composite',
    stem: '______ the donations given out, the team finally sat down to a shared meal.',
    options: ['With', 'Because', 'While', 'As'],
    answerIndex: 0,
    explanation:
      '“名词 + 过去分词”的复合结构须由 with 引导作状语，故选 A；B、C、D 都是连词，须引导完整句子而非 “名词 + done” 结构。',
  },
  {
    id: 'u34-g5',
    type: 'mcq',
    pointId: 'with-composite',
    stem: 'With the rain ______, the small clinic became hard to reach.',
    options: ['fell', 'falling', 'fallen', 'to fall'],
    answerIndex: 1,
    explanation:
      'rain 与 fall 是主动关系且表进行，with 复合结构用现在分词 falling，故选 B；A 是谓语形式，C 表被动完成不合逻辑，D 表将来。',
  },
  {
    id: 'u34-g6',
    type: 'mcq',
    pointId: 'with-composite',
    stem: 'With so much paperwork ______, the nurse worked late into the night.',
    options: ['doing', 'done', 'to do', 'did'],
    answerIndex: 2,
    explanation:
      '“有待完成的文书”表将来，with 复合结构用不定式 to do 作补足语，故选 C；A 表进行，B 表已完成（完成后就不必熬夜），D 是谓语形式。',
  },
  {
    id: 'u34-f1',
    type: 'fill',
    pointId: 'past-participle-predicative',
    stem: 'We were deeply ______ (move) by the story of the village teacher.（填所给词的正确形式）',
    answer: 'moved',
    explanation:
      'be 动词后接过去分词作表语，描述“被感动”的状态，填 moved。',
  },
  {
    id: 'u34-f2',
    type: 'fill',
    pointId: 'past-participle-predicative',
    stem: 'The tailor got the uniform ______ (repair) before the school day.（填所给词的正确形式）',
    answer: 'repaired',
    explanation:
      '“get + 宾语 + 过去分词”表示“请人修补”，uniform 与 repair 是被动关系，填 repaired。',
  },
  {
    id: 'u34-f3',
    type: 'fill',
    pointId: 'with-composite',
    stem: 'With the window ______ (open), the children could hear the sea clearly.（填所给词的正确形式）',
    answer: 'open',
    explanation:
      'window 后接形容词 open 说明状态，with 复合结构补足语不一定是分词，此处填形容词 open。',
  },
  {
    id: 'u34-f4',
    type: 'fill',
    pointId: 'with-composite',
    stem: 'With the ripe tomatoes ______ (pick), the students carried baskets of vegetables home.（填所给词的正确形式，表“已被摘下”）',
    answer: 'picked',
    explanation:
      'tomatoes 与 pick 是被动关系且动作已完成，with 复合结构用过去分词，填 picked。',
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default { points: unit14GrammarPoints, exercises: unit14Exercises };
