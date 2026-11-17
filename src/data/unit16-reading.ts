import type { ReadingPassage } from '../types';

/**
 * 人教2019必修二 Unit 1（Cultural Heritage）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 1 必修二词表），避免任何教材原文版权问题。
 */

export const unit6Passages: ReadingPassage[] = [
  {
    id: 'u16-p1',
    title: 'Guardians of the Old Temple',
    genre: '记叙文',
    paragraphs: [
      'High on Mount Tai stands a former temple built more than a thousand years ago. Last summer, our school heritage club was invited to help the local committee document the temple\u2019s stone carvings before winter arrives.',
      'Every morning, professional restorers showed us how to investigate the walls and preserve each relic with special paper. We also conducted a survey of visitors, because the committee wanted to limit the number of tourists and prevent the carvings from being touched.',
      'Some shop owners made a protest against the new rules at first. Later, however, they understood the balance between business and protection, and even decided to donate money. The committee\u2019s proposal to establish a small museum was finally accepted, and our report now helps promote the value of this great heritage.',
    ],
    glossary: [
      { wordId: 'mount', forms: ['Mount'] },
      { wordId: 'former', forms: ['former'] },
      { wordId: 'temple', forms: ['temple'] },
      { wordId: 'heritage', forms: ['heritage'] },
      { wordId: 'committee', forms: ['committee'] },
      { wordId: 'document', forms: ['document'] },
      { wordId: 'professional', forms: ['professional'] },
      { wordId: 'investigate', forms: ['investigate'] },
      { wordId: 'preserve', forms: ['preserve'] },
      { wordId: 'relic', forms: ['relic'] },
      { wordId: 'conduct', forms: ['conducted'] },
      { wordId: 'limit', forms: ['limit'] },
      { wordId: 'prevent', forms: ['prevent'] },
      { wordId: 'protest', forms: ['protest'] },
      { wordId: 'balance', forms: ['balance'] },
      { wordId: 'donate', forms: ['donate'] },
      { wordId: 'proposal', forms: ['proposal'] },
      { wordId: 'establish', forms: ['establish'] },
      { wordId: 'promote', forms: ['promote'] },
    ],
    questions: [
      {
        id: 'u16-r1-1',
        type: 'detail',
        stem: 'What were the students invited to do last summer?',
        options: [
          'To sell tickets to the tourists.',
          'To help document the temple\u2019s stone carvings.',
          'To rebuild the whole old temple.',
          'To teach restorers how to use special paper.',
        ],
        answerIndex: 1,
        explanation:
          '由第一段 "our school heritage club was invited to help the local committee document the temple\u2019s stone carvings" 可知，学生们受邀帮助记录古庙石刻，故选 B；A、C 原文未提及，D 与原文（专业人员指导学生）相反。',
      },
      {
        id: 'u16-r1-2',
        type: 'detail',
        stem: 'Why did the committee want to limit the number of tourists?',
        options: [
          'To make the shop owners angry.',
          'To close the temple in winter.',
          'To prevent the carvings from being touched.',
          'To ask visitors to donate more money.',
        ],
        answerIndex: 2,
        explanation:
          '由第二段结尾 "the committee wanted to limit the number of tourists and prevent the carvings from being touched" 可知，限流是为了防止石刻被触摸，故选 C；A 与第三段（店主后来理解了）不符，B、D 属无中生有。',
      },
      {
        id: 'u16-r1-3',
        type: 'main-idea',
        stem: 'What is the best title for this passage?',
        options: [
          'A Trip to Mount Tai',
          'Business Interests of Shop Owners',
          'How to Repair Stone Carvings',
          'Young Guardians of an Old Temple',
        ],
        answerIndex: 3,
        explanation:
          '全文记叙学生遗产社团协助委员会记录、保护古庙石刻，并推动建馆与宣传的经历，D 项最能概括全文主旨；A 只覆盖背景，B 只是第三段的插曲，C 仅是第二段的细节。',
      },
    ],
  },
  {
    id: 'u16-p2',
    title: 'A Museum Under the Lake',
    genre: '应用文',
    paragraphs: [
      'Welcome to the online exhibition "Saved from the Flood". Here you can see relics from an ancient town that was moved to higher ground before the river dam was built.',
      'Twenty years ago, the whole town made a protest, hoping to keep its temples. Experts then came to investigate the old buildings stone by stone. With help from the government, a committee was established, and every building was numbered, taken down, and rebuilt on the new site.',
      'Today the former town lives again beside a lake. Visitors walk along the old streets, and a small museum displays photos of the rescue. The project shows how people can preserve both development and memory.',
      'If you want to contribute your old photos of the town, click the button below and tell us your story.',
    ],
    glossary: [
      { wordId: 'relic', forms: ['relics'] },
      { wordId: 'protest', forms: ['protest'] },
      { wordId: 'temple', forms: ['temples'] },
      { wordId: 'investigate', forms: ['investigate'] },
      { wordId: 'establish', forms: ['established'] },
      { wordId: 'committee', forms: ['committee'] },
      { wordId: 'former', forms: ['former'] },
      { wordId: 'preserve', forms: ['preserve'] },
      { wordId: 'contribute', forms: ['contribute'] },
    ],
    questions: [
      {
        id: 'u16-r2-1',
        type: 'detail',
        stem: 'Why was the ancient town moved to higher ground?',
        options: [
          'Because a river dam was going to be built.',
          'Because the townspeople disliked the old streets.',
          'Because the government wanted a new lake park.',
          'Because the temples were too old to live in.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "an ancient town that was moved to higher ground before the river dam was built" 可知，小镇因修建大河坝而被整体搬迁，故选 A；B、C、D 均与原文不符。',
      },
      {
        id: 'u16-r2-2',
        type: 'detail',
        stem: 'What can visitors see in the small museum today?',
        options: [
          'The stones of the broken dam.',
          'Photos of the rescue of the town.',
          'The old protest letters of the townspeople.',
          'Models of the new buildings on the site.',
        ],
        answerIndex: 1,
        explanation:
          '由第三段 "a small museum displays photos of the rescue" 可知，小博物馆展出抢救小镇的照片，故选 B；A、C、D 原文均未提及。',
      },
      {
        id: 'u16-r2-3',
        type: 'purpose',
        stem: 'Why does the writer write this passage?',
        options: [
          'To describe the beauty of the river dam.',
          'To tell the history of an old kingdom.',
          'To introduce an online exhibition and invite photos.',
          'To explain how to number old buildings.',
        ],
        answerIndex: 2,
        explanation:
          '本文是一则线上展览介绍：开头 "Welcome to the online exhibition" 发出参观邀请，结尾 "click the button below and tell us your story" 号召读者贡献老照片，可知写作目的是介绍线上展览并征集照片，故选 C；A、D 只是文中细节，B 原文未涉及。',
      },
    ],
  },
];

const passageById = new Map(unit6Passages.map((p) => [p.id, p]));

export function getPassage(id: string): ReadingPassage | undefined {
  return passageById.get(id);
}

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit6Passages;
