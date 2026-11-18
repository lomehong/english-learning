import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修三 Unit 2（Healthy Lifestyle）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 2 词表），避免任何教材原文版权问题。
 */

export const unit27Passages: ReadingPassage[] = [
  {
    id: 'u27-p1',
    title: 'A Student\u2019s Plan for a Healthier Life',
    genre: '记叙文',
    paragraphs: [
      'Li Hua used to stay up late, order sugary drinks with every meal, and spend his free time playing games. Soon his weight rose, and the doctor warned him about the risks of obesity.',
      'To change his lifestyle, he made a simple plan. Every morning he goes jogging in the park for half an hour, and three times a week he does a thirty-minute workout at home to build muscle. For breakfast, he now chooses food rich in protein and fibre instead of snacks.',
      'After two months, the results are clear. He feels refreshed in class, his anxiety before exams is much lower, and his immune system seems stronger. A balanced diet and regular exercise, he says, have brought him true wellness and a more energetic life.',
    ],
    glossary: [
      { wordId: 'sugary', forms: ['sugary'] },
      { wordId: 'obesity', forms: ['obesity'] },
      { wordId: 'lifestyle', forms: ['lifestyle'] },
      { wordId: 'jog', forms: ['jogging'] },
      { wordId: 'workout', forms: ['workout'] },
      { wordId: 'muscle', forms: ['muscle'] },
      { wordId: 'protein', forms: ['protein'] },
      { wordId: 'fibre', forms: ['fibre'] },
      { wordId: 'refreshed', forms: ['refreshed'] },
      { wordId: 'anxiety', forms: ['anxiety'] },
      { wordId: 'immune', forms: ['immune'] },
      { wordId: 'balanced', forms: ['balanced'] },
      { wordId: 'wellness', forms: ['wellness'] },
      { wordId: 'energetic', forms: ['energetic'] },
    ],
    questions: [
      {
        id: 'u27-p1-q1',
        type: 'detail',
        stem: 'Why did the doctor warn Li Hua?',
        options: [
          'Because of the risks of his rising weight.',
          'Because he exercised too much.',
          'Because he ate too much protein.',
          'Because he slept too early.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "his weight rose, and the doctor warned him about the risks of obesity" 可知医生因体重上升带来的肥胖风险而警告他，故选 A；B、C、D 与原文不符。',
      },
      {
        id: 'u27-p1-q2',
        type: 'detail',
        stem: 'How often does Li Hua do a workout at home?',
        options: [
          'Every morning.',
          'Once a week.',
          'Three times a week.',
          'Twice a month.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "three times a week he does a thirty-minute workout at home" 可知他每周在家锻炼三次，故选 C；每天早晨的是慢跑，A 与原文不符。',
      },
      {
        id: 'u27-p1-q3',
        type: 'inference',
        stem: 'What can we infer from the last paragraph?',
        options: [
          'His new habits have improved both body and mind.',
          'He still feels anxious before exams.',
          'He finds regular exercise useless.',
          'He has given up his plan.',
        ],
        answerIndex: 0,
        explanation:
          '末段提到他上课精神、考前焦虑减轻、免疫力增强，可推知新习惯让他身心都更健康，故选 A；B、C、D 与原文描述相反。',
      },
    ],
  },
  {
    id: 'u27-p2',
    title: 'Sleep, Screens and Growing Teens',
    genre: '说明文',
    paragraphs: [
      'Many teenagers today spend excessive time on their phones, especially at night. Scientists say that poor sleep is one of the biggest enemies of teenage wellbeing.',
      'When we do not sleep enough, we feel stressed, eat more junk food, and find it hard to focus. Some students even turn to tobacco or coffee to stay awake, which harms health further. Doctors suggest a fixed bedtime, good sleep hygiene, and no screens one hour before bed.',
      'Schools are also taking action. In some cities, students learn meditation to calm their minds before lessons, and teachers remind them that a healthy lifestyle is built night by night. Sleep well, and both body and mind will thank you.',
    ],
    glossary: [
      { wordId: 'excessive', forms: ['excessive'] },
      { wordId: 'wellbeing', forms: ['wellbeing'] },
      { wordId: 'tobacco', forms: ['tobacco'] },
      { wordId: 'hygiene', forms: ['hygiene'] },
      { wordId: 'meditation', forms: ['meditation'] },
      { wordId: 'lifestyle', forms: ['lifestyle'] },
    ],
    questions: [
      {
        id: 'u27-p2-q1',
        type: 'detail',
        stem: 'According to Paragraph 2, what may students do to stay awake?',
        options: [
          'Turn to tobacco or coffee.',
          'Do more outdoor sports.',
          'Go to bed earlier.',
          'Drink warm milk.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "Some students even turn to tobacco or coffee to stay awake" 可知一些学生靠烟草或咖啡提神，故选 A；B、C、D 文中均未提及。',
      },
      {
        id: 'u27-p2-q2',
        type: 'detail',
        stem: 'What do doctors suggest for better sleep?',
        options: [
          'A fixed bedtime and no screens before bed.',
          'Taking more exams.',
          'Eating more junk food at night.',
          'Sleeping with the light on.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Doctors suggest a fixed bedtime, good sleep hygiene, and no screens one hour before bed" 可知医生建议固定就寝时间并睡前一小时不看屏幕，故选 A。',
      },
      {
        id: 'u27-p2-q3',
        type: 'main-idea',
        stem: 'What is the passage mainly about?',
        options: [
          'The history of mobile phones.',
          'How to choose good coffee.',
          'The harm of poor sleep and ways to improve it.',
          'The subjects teenagers like best.',
        ],
        answerIndex: 2,
        explanation:
          '全文先说明睡眠不足与过度使用手机对青少年健康的危害，再给出医生与学校的改进建议，可概括为「睡眠不足的危害与改善办法」，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit27Passages;
