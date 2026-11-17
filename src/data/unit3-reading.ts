import type { ReadingPassage } from '../types';

/**
 * 人教2019必修一 Unit 3（Sports and Fitness）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 3 词表），避免任何教材原文版权问题。
 */

export const unit3Passages: ReadingPassage[] = [
  {
    id: 'u3-p1',
    title: 'The Girl Who Never Gave Up',
    genre: '记叙文',
    paragraphs: [
      'Li Hua joined the school track team last September. At first, her coach thought she was too slow to compete in the 800-metre race, but she had great determination. She trained on the track every morning before class.',
      'In March, disaster came. Li Hua injured her left knee during training, and the doctor asked her to rest for six weeks. It was a hard time, but she did not give up. She went to the gym to build strength and watched her teammates train from the seats.',
      'Last Friday, she finally stood at the starting line of the school championship. Thousands of spectators cheered as she ran. In the end, she won the silver medal. "Running teaches me that success comes from determination," she said with a graceful smile.',
    ],
    glossary: [
      { wordId: 'track', forms: ['track'] },
      { wordId: 'coach', forms: ['coach'] },
      { wordId: 'compete', forms: ['compete'] },
      { wordId: 'determination', forms: ['determination'] },
      { wordId: 'injure', forms: ['injured'] },
      { wordId: 'gym', forms: ['gym'] },
      { wordId: 'strength', forms: ['strength'] },
      { wordId: 'championship', forms: ['championship'] },
      { wordId: 'spectator', forms: ['spectators'] },
      { wordId: 'medal', forms: ['medal'] },
      { wordId: 'graceful', forms: ['graceful'] },
    ],
    questions: [
      {
        id: 'u3-r1-1',
        type: 'detail',
        stem: 'Why did the coach think Li Hua could not compete in the 800-metre race at first?',
        options: [
          'Because she was too slow at running.',
          'Because she often injured her knees.',
          'Because she lacked determination.',
          'Because she disliked morning training.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "her coach thought she was too slow to compete in the 800-metre race" 可知，教练起初认为她跑得太慢，故选 A；B、C、D 均与原文不符。',
      },
      {
        id: 'u3-r1-2',
        type: 'detail',
        stem: 'What did Li Hua do during the six-week rest?',
        options: [
          'She gave up running and left the team.',
          'She went to another school to train.',
          'She built strength in the gym and watched her teammates train.',
          'She practised running on the track every morning.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段 "She went to the gym to build strength and watched her teammates train from the seats" 可知，她在健身房练力量并观看队友训练，故选 C；A 与 "she did not give up" 矛盾，B、D 原文未提及。',
      },
      {
        id: 'u3-r1-3',
        type: 'main-idea',
        stem: 'What is the best title for this passage?',
        options: [
          'How to Win a Silver Medal',
          'The Girl Who Never Gave Up',
          'A Dangerous Knee Injury',
          'The History of the Track Team',
        ],
        answerIndex: 1,
        explanation:
          '全文概括了 Li Hua 从被质疑、受伤到坚持恢复并夺得银牌的历程，核心是「永不放弃」，故选 B；A、C、D 都只涉及局部细节，不能概括全文。',
      },
    ],
  },
  {
    id: 'u3-p2',
    title: 'Sunshine Sports Week Is Coming',
    genre: '应用文',
    paragraphs: [
      'Do you want to improve your fitness and have fun at the same time? Our school will hold a Sports Week from 15 to 19 May, and every student is welcome.',
      'There will be plenty of activities. In the morning, you can play badminton or basketball in the new gym. In the afternoon, famous athletes will teach boxing and skating in the stadium. Students who like running may join the mini-marathon on the last day.',
      'To join, please write your name and class on the list outside the school office before 10 May. Come and compete for your class — the top three classes will each win a medal. For more information, you can call the PE office or visit our website.',
    ],
    glossary: [
      { wordId: 'fitness', forms: ['fitness'] },
      { wordId: 'badminton', forms: ['badminton'] },
      { wordId: 'gym', forms: ['gym'] },
      { wordId: 'boxing', forms: ['boxing'] },
      { wordId: 'stadium', forms: ['stadium'] },
      { wordId: 'marathon', forms: ['mini-marathon'] },
      { wordId: 'compete', forms: ['compete'] },
      { wordId: 'medal', forms: ['medal'] },
    ],
    questions: [
      {
        id: 'u3-r2-1',
        type: 'detail',
        stem: 'What can students do in the afternoon during the Sports Week?',
        options: [
          'Play badminton in the new gym.',
          'Learn boxing and skating from famous athletes.',
          'Run a mini-marathon every day.',
          'Watch basketball games in the stadium.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "In the afternoon, famous athletes will teach boxing and skating in the stadium" 可知，下午可以跟著名运动员学拳击和滑冰，故选 B；A 是上午的活动，C 与 "on the last day" 不符，D 未提及。',
      },
      {
        id: 'u3-r2-2',
        type: 'detail',
        stem: 'How can students sign up for the Sports Week?',
        options: [
          'By calling the PE office.',
          'By visiting the school website.',
          'By writing their names on the list outside the school office.',
          'By asking their PE teacher in class.',
        ],
        answerIndex: 2,
        explanation:
          '由第三段 "please write your name and class on the list outside the school office before 10 May" 可知，报名方式是在学校办公室外的名单上签名，故选 C；打电话和网站是用来「咨询更多信息」的，不是报名方式，故 A、B 不对，D 未提及。',
      },
      {
        id: 'u3-r2-3',
        type: 'purpose',
        stem: 'What is the purpose of this passage?',
        options: [
          'To describe an exciting basketball match.',
          'To introduce a famous athlete of the school.',
          'To teach students how to keep safe in sports.',
          'To invite students to take part in the Sports Week.',
        ],
        answerIndex: 3,
        explanation:
          '本文是活动通知：先说明运动周的时间，再介绍活动内容与报名方式，目的是邀请同学们参加，故选 D；A、B、C 均不是本文的写作意图。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit3Passages;