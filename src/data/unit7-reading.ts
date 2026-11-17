import type { ReadingPassage } from '../types';

/**
 * 人教2019必修二 Unit 2（Wildlife Protection）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用本单元词表），避免任何教材原文版权问题。
 */

export const unit7Passages: ReadingPassage[] = [
  {
    id: 'u7-p1',
    title: 'A Crane Returns to the Wild',
    genre: '记叙文',
    paragraphs: [
      'Last spring, rangers found an injured crane by the road near the nature reserve. Its leg was hurt, and it could not fly. The bird was taken to the wildlife hospital, where vets fed it every day and watched its recovery closely.',
      'Two months later, the crane fully recovered. Before flying away, it was set free at the wetland, its natural habitat. Our class was invited to observe the moment. Standing quietly behind the fence, we saw the bird spread its wings and rise into the sky.',
      'The rangers told us that strict measures are now taken to protect wildlife in this area. Hunting is forbidden, and the population of rare species is growing every year. It was a lesson we will never forget.',
    ],
    glossary: [
      { wordId: 'reserve', forms: ['reserve'] },
      { wordId: 'wildlife', forms: ['wildlife'] },
      { wordId: 'recover', forms: ['recovered'] },
      { wordId: 'habitat', forms: ['habitat'] },
      { wordId: 'observe', forms: ['observe'] },
      { wordId: 'measure', forms: ['measures'] },
      { wordId: 'population', forms: ['population'] },
      { wordId: 'species', forms: ['species'] },
    ],
    questions: [
      {
        id: 'u7-r1-1',
        type: 'detail',
        stem: 'Where was the injured crane found?',
        options: [
          'Inside the wildlife hospital.',
          'By the road near the nature reserve.',
          'On the wetland behind the fence.',
          'In a nest high on the mountain.',
        ],
        answerIndex: 1,
        explanation:
          '由第一段 "rangers found an injured crane by the road near the nature reserve" 可知，受伤的鹤是在自然保护区附近的路边被发现的，故选 B；A 是其后被送去治疗的地方，C 是放飞地点，D 原文未提及。',
      },
      {
        id: 'u7-r1-2',
        type: 'detail',
        stem: 'What did the rangers tell the students about the area?',
        options: [
          'Hunting is allowed in winter only.',
          'The number of visitors is growing fast.',
          'Strict measures are taken and rare species are increasing.',
          'More wildlife hospitals will be built soon.',
        ],
        answerIndex: 2,
        explanation:
          '由第三段 "strict measures are now taken to protect wildlife… Hunting is forbidden, and the population of rare species is growing every year" 可知，保护措施严格、珍稀物种数量逐年增长，故选 C；A 与 "Hunting is forbidden" 矛盾，B、D 原文未提及。',
      },
      {
        id: 'u7-r1-3',
        type: 'main-idea',
        stem: 'What is the best title for this passage?',
        options: [
          'How to Feed Injured Birds',
          'A Day in a Wildlife Hospital',
          'Life Behind the Fence',
          'A Crane Returns to the Wild',
        ],
        answerIndex: 3,
        explanation:
          '全文围绕一只受伤的鹤从获救、治愈到重回湿地放飞的经历展开，D 项最能概括全文；A、B 只是第一段的局部内容，C 与文章主线无关。',
      },
    ],
  },
  {
    id: 'u7-p2',
    title: 'Volunteers Wanted for Bird Watching',
    genre: '应用文',
    paragraphs: [
      'Do you care about wildlife? The city nature reserve is looking for student volunteers for its autumn bird-watching programme!',
      'Volunteers will work on Saturday mornings. Trained by rangers, you will learn to observe water birds and record their numbers. The data helps scientists study the habitat of rare species and the effect of weather on them. You will also help visitors learn that feeding wild animals may endanger their health.',
      'No experience is needed. We will teach you everything, and warm coats will be provided. Concern for nature is the only thing we ask for.',
      'If you are interested, please write to nature@school.edu before 20 September. Let\u2019s take action for wildlife protection!',
    ],
    glossary: [
      { wordId: 'wildlife', forms: ['wildlife'] },
      { wordId: 'reserve', forms: ['reserve'] },
      { wordId: 'observe', forms: ['observe'] },
      { wordId: 'habitat', forms: ['habitat'] },
      { wordId: 'species', forms: ['species'] },
      { wordId: 'effect', forms: ['effect'] },
      { wordId: 'wild', forms: ['wild'] },
      { wordId: 'endanger', forms: ['endanger'] },
      { wordId: 'concern', forms: ['Concern'] },
      { wordId: 'protection', forms: ['protection'] },
    ],
    questions: [
      {
        id: 'u7-r2-1',
        type: 'detail',
        stem: 'What will volunteers do on Saturday mornings?',
        options: [
          'Feed the wild animals in the reserve.',
          'Observe water birds and record their numbers.',
          'Build fences around the wetland.',
          'Give lessons to the park rangers.',
        ],
        answerIndex: 1,
        explanation:
          '由第二段 "you will learn to observe water birds and record their numbers" 可知，志愿者将观察水鸟并记录数量，故选 B；A 与 "feeding wild animals may endanger their health" 的劝阻内容相反，C、D 未提及。',
      },
      {
        id: 'u7-r2-2',
        type: 'detail',
        stem: 'What will volunteers help visitors learn?',
        options: [
          'The best time to photo rare birds.',
          'The weather\u2019s effect on water plants.',
          'How to become a park ranger.',
          'Feeding wild animals may endanger their health.',
        ],
        answerIndex: 3,
        explanation:
          '由第二段结尾 "You will also help visitors learn that feeding wild animals may endanger their health" 可知，志愿者要帮助游客认识到投喂野生动物可能危害其健康，故选 D；B 是数据帮助科学家研究的内容，A、C 未提及。',
      },
      {
        id: 'u7-r2-3',
        type: 'purpose',
        stem: 'Why does the writer write this passage?',
        options: [
          'To describe a bird-watching trip.',
          'To invite students to join a volunteer programme.',
          'To explain why species die out.',
          'To compare different nature reserves.',
        ],
        answerIndex: 1,
        explanation:
          '本文是一则招募启事：开头发出疑问吸引读者，正文介绍志愿者工作内容，结尾给出报名邮箱与截止日期，写作目的是邀请学生参加志愿项目，故选 B；A、C 只是片段信息，D 无关。',
      },
    ],
  },
];

const passageById = new Map(unit7Passages.map((p) => [p.id, p]));

export function getPassage(id: string): ReadingPassage | undefined {
  return passageById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit7Passages;
