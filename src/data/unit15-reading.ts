import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修二 Unit 5（First Aid）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 5 词表），避免任何教材原文版权问题。
 */

export const unit15Passages: ReadingPassage[] = [
  {
    id: 'u15-p1',
    title: 'What to Do When Someone Is Choking',
    genre: '说明文',
    paragraphs: [
      'Choking is a common accident at dinner tables. It happens when food blocks the airway, and the victim may turn blue within minutes. Knowing what to do in the first moments is vital, because an ambulance usually needs longer to arrive.',
      'The standard technique is easy to learn. Stand behind the person, wrap your arms around the waist, and squeeze the stomach inward and upward quickly. Each push sends air out of the lungs and can drive the food out. If the person cannot speak or cough, act immediately rather than waiting to see what happens next.',
      'Schools now teach these skills in class, and the results are encouraging. Last year, a student in Hangzhou saved his classmate with this very method. Everyone should learn basic first aid: the life you protect may someday be your own.',
    ],
    glossary: [
      { wordId: 'choke', forms: ['Choking'] },
      { wordId: 'vital', forms: ['vital'] },
      { wordId: 'ambulance', forms: ['ambulance'] },
      { wordId: 'technique', forms: ['technique'] },
      { wordId: 'wrap', forms: ['wrap'] },
      { wordId: 'squeeze', forms: ['squeeze'] },
    ],
    questions: [
      {
        id: 'u15-r1-1',
        type: 'detail',
        stem: 'Why is it vital to act quickly when someone is choking?',
        options: [
          'Because an ambulance usually needs longer to arrive.',
          'Because the victim will feel hungry soon.',
          'Because the food will get cold.',
          'Because doctors are always too busy.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "Knowing what to do in the first moments is vital, because an ambulance usually needs longer to arrive" 可知救护车赶到需要更长时间，所以最初几分钟的行动至关重要，故选 A。',
      },
      {
        id: 'u15-r1-2',
        type: 'detail',
        stem: 'According to Paragraph 2, how should you press when someone is choking?',
        options: [
          'Inward and upward quickly.',
          'Downward and slowly.',
          'On the back gently.',
          'On the legs repeatedly.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "squeeze the stomach inward and upward quickly" 可知应快速向内向上挤压腹部，故选 A。',
      },
      {
        id: 'u15-r1-3',
        type: 'main-idea',
        stem: 'What is the passage mainly about?',
        options: [
          'Why everyone should learn the basic skills for helping a choking person.',
          'Why dinner tables are dangerous places for children.',
          'How schools organize cooking classes safely.',
          'How to call an ambulance in Hangzhou.',
        ],
        answerIndex: 0,
        explanation:
          '文章先说明气道阻塞的危险与急救方法，再以学生救人的例子号召人人学急救，可概括为主旨“人人应学会帮助噎食者的基本技能”，故选 A。',
      },
    ],
  },
  {
    id: 'u15-p2',
    title: 'A Lesson Learned on the Playground',
    genre: '记叙文',
    paragraphs: [
      'During a basketball match last autumn, one of my teammates suddenly fell to the ground. His face turned pale, his pulse was weak, and an old knee injury began to bleed again. For a moment, everyone on the court stood still in panic.',
      'Our PE teacher, Mr Wang, ran over within seconds. He pressed the wound with a clean cloth, raised the leg gently, and told the boy to breathe slowly. He never touched the injury with his bare hands; instead, he wore gloves from the first aid box as a precaution against infection.',
      'The doctor in the hospital ward praised Mr Wang: every step had followed the basic guidelines. That day I realised first aid is not only a school lesson but a life skill. Since then, I have kept a small first aid kit in my school bag.',
    ],
    glossary: [
      { wordId: 'pulse', forms: ['pulse'] },
      { wordId: 'bleed', forms: ['bleed'] },
      { wordId: 'panic', forms: ['panic'] },
      { wordId: 'ward', forms: ['ward'] },
      { wordId: 'precaution', forms: ['precaution'] },
      { wordId: 'guideline', forms: ['guidelines'] },
    ],
    questions: [
      {
        id: 'u15-r2-1',
        type: 'detail',
        stem: 'What did Mr Wang do right after he ran over?',
        options: [
          'He pressed the wound with a clean cloth.',
          'He moved the boy to the hospital at once.',
          'He gave the boy some water to drink.',
          'He asked the students to leave the school.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "He pressed the wound with a clean cloth, raised the leg gently" 可知王老师先用干净布按压伤口，故选 A。',
      },
      {
        id: 'u15-r2-2',
        type: 'inference',
        stem: 'Why did Mr Wang wear gloves from the first aid box?',
        options: [
          'To avoid infection while touching the injury.',
          'Because his hands were cold that day.',
          'To keep the wound from bleeding more.',
          'Because the gloves were part of his sportswear.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "he wore gloves from the first aid box to avoid infection" 可知戴手套是为了避免接触伤口时造成感染，故选 A。',
      },
      {
        id: 'u15-r2-3',
        type: 'purpose',
        stem: 'Why does the author tell this story?',
        options: [
          'To show that first aid is a life skill worth learning for everyone.',
          'To prove that basketball is a dangerous sport.',
          'To praise hospitals for their quick service.',
          'To explain why knee injuries never fully heal.',
        ],
        answerIndex: 0,
        explanation:
          '作者通过叙述王老师规范施救的经历，并在末段点明“急救不仅是学校课程更是生存技能，我从此随身携带急救包”，写作目的是说明人人都值得学会急救，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit15Passages;
