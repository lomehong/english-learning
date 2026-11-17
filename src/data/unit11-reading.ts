import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修二 Unit 1（Science and Scientists）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 1 词表），避免任何教材原文版权问题。
 */

export const unit11Passages: ReadingPassage[] = [
  {
    id: 'u11-p1',
    title: 'The Doctor Who Traced a Killer Disease',
    genre: '记叙文',
    paragraphs: [
      'In 1854, a severe disease broke out in a poor district of London. Hundreds of people died within days, and fear spread even faster. Most physicians believed bad air was to blame, but a young doctor named John Snow doubted this theory.',
      'Snow decided to prove the theory wrong with solid facts. He marked every death on a map and began to trace the source of the disease. He noticed that the victims all drank water from the same pump. With an assistant, he collected statistics and linked the deaths to the polluted water.',
      'The handle of the pump was removed, and new cases decreased sharply. His brilliant method is now considered the beginning of modern epidemiology. It reminds every scientist that a curious mind and solid evidence can defend the public against disease.',
    ],
    glossary: [
      { wordId: 'severe', forms: ['severe'] },
      { wordId: 'blame', forms: ['blame'] },
      { wordId: 'theory', forms: ['theory'] },
      { wordId: 'prove', forms: ['prove'] },
      { wordId: 'solid', forms: ['solid'] },
      { wordId: 'trace', forms: ['trace'] },
      { wordId: 'assistant', forms: ['assistant'] },
      { wordId: 'statistics', forms: ['statistics'] },
      { wordId: 'brilliant', forms: ['brilliant'] },
      { wordId: 'handle', forms: ['handle'] },
      { wordId: 'decrease', forms: ['decreased'] },
    ],
    questions: [
      {
        id: 'u11-r1-1',
        type: 'detail',
        stem: 'What did most physicians believe was to blame for the disease?',
        options: [
          'Bad air.',
          'Polluted food.',
          'A dangerous animal.',
          'Cold winter weather.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "Most physicians believed bad air was to blame" 可知多数医生认为坏空气是罪魁祸首，故选 A；其余选项文中均未提及。',
      },
      {
        id: 'u11-r1-2',
        type: 'detail',
        stem: 'How did John Snow find the source of the disease?',
        options: [
          'By marking deaths on a map and tracing the victims\u2019 drinking water.',
          'By reading old medical texts in the library.',
          'By testing a new vaccine on patients.',
          'By asking the government for help.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段他在地图上标注死亡病例、追踪受害者共用的水井，并把死亡与受污染的水联系起来可知 A 正确；B、C、D 均与文中做法不符。',
      },
      {
        id: 'u11-r1-3',
        type: 'main-idea',
        stem: 'What is the passage mainly about?',
        options: [
          'How John Snow used facts and evidence to defeat a deadly disease.',
          'Why London was a dangerous city in the nineteenth century.',
          'The history of the water supply in poor districts.',
          'How maps were drawn in old times.',
        ],
        answerIndex: 0,
        explanation:
          '全文概括了约翰·斯诺凭借事实与证据追查疾病源头、关闭水泵从而遏制疫情的故事，可概括为“用事实战胜致命疾病”，故选 A；B、C、D 均偏离主题。',
      },
    ],
  },
  {
    id: 'u11-p2',
    title: 'A Young Scientist in the Laboratory',
    genre: '记叙文',
    paragraphs: [
      'Li Hua, a senior high school student, has been interested in science since childhood. Last term she joined the science club and spent every Friday afternoon in the school laboratory, where an old microscope opened a new world for her.',
      'Her project studied how the flu virus spreads through a class. Every week she recorded the numbers, and her initial results were far from perfect. Instead of giving up, she repeated each experiment and checked every detail again. Slowly the data became solid enough to support a small theory about classroom air.',
      'At the city science fair, her careful work won first prize. A university professor encouraged her to keep going, and she now dreams of developing a vaccine one day. \u201cScience is not about luck,\u201d she says. \u201cIt is about proving every idea with facts.\u201d',
    ],
    glossary: [
      { wordId: 'laboratory', forms: ['laboratory'] },
      { wordId: 'microscope', forms: ['microscope'] },
      { wordId: 'virus', forms: ['virus'] },
      { wordId: 'initial', forms: ['initial'] },
      { wordId: 'solid', forms: ['solid'] },
      { wordId: 'theory', forms: ['theory'] },
      { wordId: 'vaccine', forms: ['vaccine'] },
      { wordId: 'prove', forms: ['proving'] },
    ],
    questions: [
      {
        id: 'u11-r2-1',
        type: 'detail',
        stem: 'Where did Li Hua spend every Friday afternoon last term?',
        options: [
          'In the school laboratory.',
          'In the city library.',
          'At a university fair.',
          'In a local hospital.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "spent every Friday afternoon in the school laboratory" 可知她每周五下午都在学校实验室度过，故选 A。',
      },
      {
        id: 'u11-r2-2',
        type: 'inference',
        stem: 'What can we infer about Li Hua from Paragraph 2?',
        options: [
          'She keeps working even when early results are imperfect.',
          'She changes her project topic very often.',
          'She refuses to accept any help from others.',
          'She only cares about winning prizes.',
        ],
        answerIndex: 0,
        explanation:
          '第二段写她初始结果并不理想，但她没有放弃而是反复实验、核对细节，可推知她面对不完美的结果仍坚持不懈，故选 A；B、C、D 与文中内容相反或无依据。',
      },
      {
        id: 'u11-r2-3',
        type: 'purpose',
        stem: 'Why does the author quote Li Hua\u2019s words in the last paragraph?',
        options: [
          'To show her belief that science depends on facts rather than luck.',
          'To prove that high school students need more prizes.',
          'To explain why the science fair was held in the city.',
          'To advise readers to buy a good microscope.',
        ],
        answerIndex: 0,
        explanation:
          '末段引用她“科学不是运气，而是用事实证明每个想法”的话语，目的是呈现她对科学的认识与信念，故选 A；B、C、D 均非引语的目的。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit11Passages;
