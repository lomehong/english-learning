import type { ListeningMaterial } from '../types';

/**
 * 人教2019选择性必修二 Unit 5（First Aid）主题听力材料 ×2。
 * 文本为自编原创（词汇复用 Unit 5 词表），由浏览器 speechSynthesis 朗读，
 * 不依赖任何外部 TTS 服务，避免教材音频版权问题。
 */

export const unit15Listenings: ListeningMaterial[] = [
  {
    id: 'u15-l1',
    title: 'A First Aid Course for Students',
    genre: '独白',
    script: [
      'Good afternoon, everyone. Today our school has invited Doctor Lee from the city hospital to teach us some basic first aid techniques, because knowing what to do in an emergency is a vital skill for everyone.',
      'First, when someone gets a minor burn in the kitchen, do not spread toothpaste or alcohol on the skin. The correct procedure is to cool the burn under running water for at least ten minutes, and then wrap it with a clean bandage.',
      'Second, if a person starts to bleed heavily, you should squeeze the wound gently with a clean cloth and keep the injured part above the heart. This simple principle can greatly reduce the loss of blood before the ambulance arrives.',
      'Third, never panic. Whatever happens, check whether the person can speak normally and whether the pulse is steady, because these symptoms show how serious the situation is.',
      'If the condition is severe, call for professional help at once. Quick and calm action often makes a full recovery possible.',
    ],
    questions: [
      {
        id: 'u15-l1-1',
        type: 'detail',
        stem: 'What is the correct procedure for a minor burn according to Doctor Lee?',
        options: [
          'Spreading toothpaste on the skin at once.',
          'Cooling it under running water and then wrapping it.',
          'Pouring alcohol over the wound.',
          'Squeezing the burn with a hot cloth.',
        ],
        answerIndex: 1,
        explanation:
          '由 "cool the burn under running water for at least ten minutes, and then wrap it with a clean bandage" 可知正确做法是流动水降温后再用干净绷带包扎，故选 B。',
      },
      {
        id: 'u15-l1-2',
        type: 'detail',
        stem: 'Why should the injured part be kept above the heart when someone bleeds heavily?',
        options: [
          'To check the pulse more easily.',
          'To make the person feel warmer.',
          'To reduce the loss of blood.',
          'To help the person walk faster.',
        ],
        answerIndex: 2,
        explanation:
          '由 "keep the injured part above the heart. This simple principle can greatly reduce the loss of blood" 可知抬高伤处是为了减少失血，故选 C。',
      },
      {
        id: 'u15-l1-3',
        type: 'inference',
        stem: 'What does the speaker think of first aid skills?',
        options: [
          'They are only useful for doctors and nurses.',
          'They are too difficult for students to learn.',
          'They are vital for everyone in an emergency.',
          'They can fully replace hospital treatment.',
        ],
        answerIndex: 2,
        explanation:
          '由开场 "knowing what to do in an emergency is a vital skill for everyone" 可推知说话人认为急救技能对每个人都很重要，故选 C。',
      },
    ],
  },
  {
    id: 'u15-l2',
    title: 'An Accident in the PE Class',
    genre: '对话',
    script: [
      'W: Mr Wang, come quickly! Tom has fallen down and his knee is bleeding!',
      'M: Stay calm, Lily. Do not panic, and please do not move his leg. Tom, can you hear me? Does the pain feel severe?',
      'W: He says the pain is not too bad, but the cut looks deep.',
      'M: All right. I will squeeze the wound gently with this clean towel and wrap it with a bandage. Lily, please call the school doctor and describe his symptoms.',
      'W: OK. Should we take him to the hospital by ourselves?',
      'M: No. If necessary, the school doctor will call an ambulance, and the doctor in the ward will decide on further treatment. His pulse is steady now, so I believe he will have a quick recovery.',
    ],
    questions: [
      {
        id: 'u15-l2-1',
        type: 'detail',
        stem: 'What happened to Tom in the PE class?',
        options: [
          'He fell down and his knee was bleeding.',
          'He choked on some food at lunch.',
          'He touched a broken electric wire.',
          'He was hit by a basketball on the head.',
        ],
        answerIndex: 0,
        explanation:
          '由 "Tom has fallen down and his knee is bleeding" 可知汤姆摔倒后膝盖流血了，故选 A。',
      },
      {
        id: 'u15-l2-2',
        type: 'detail',
        stem: 'What does Mr Wang ask Lily to do?',
        options: [
          'Carry Tom to the hospital at once.',
          'Call the school doctor and describe the symptoms.',
          'Buy some medicine from the shop nearby.',
          'Take Tom back to the classroom.',
        ],
        answerIndex: 1,
        explanation:
          '由 "Lily, please call the school doctor and describe his symptoms" 可知王老师让莉莉去请校医并描述症状，故选 B。',
      },
      {
        id: 'u15-l2-3',
        type: 'inference',
        stem: 'How does Mr Wang most probably feel about the situation?',
        options: [
          'Panicked and hopeless.',
          'Angry with the students.',
          'Calm and in control.',
          'Uninterested in the accident.',
        ],
        answerIndex: 2,
        explanation:
          '王老师先让众人别慌（Stay calm… do not panic），再有条不紊地按压包扎并安排就医，且脉搏平稳判断恢复会很快，可推知他冷静且有把握，故选 C。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit15Listenings;
