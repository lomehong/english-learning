import type { ReadingPassage } from '../types';

/**
 * 人教2019选择性必修二 Unit 3（Food and Culture）主题阅读短文 ×2。
 * 短文为自编原创（词汇复用 Unit 3 词表），避免任何教材原文版权问题。
 */

export const unit13Passages: ReadingPassage[] = [
  {
    id: 'u13-p1',
    title: 'Grandmother\u2019s Recipe',
    genre: '记叙文',
    paragraphs: [
      'Every family has a dish that tastes like memory. In my family, it is my grandmother\u2019s chicken soup, a recipe passed down for three generations. The ingredients are simple: a whole chicken, two slices of ginger, and some dried mushroom.',
      'As a child, I watched her slice the ginger slowly and steam the chicken for exactly one hour. She never measured the quantity of salt; her hands simply knew. The kitchen would fill with a warm flavour that made everyone hungry.',
      'Years later, I asked her to teach me, and she agreed with joy. Cooking that dish taught me something fundamental: food is not only about eating, but also about love and culture. When I feel far from home, I cook the soup, and the taste brings my family back around me.',
    ],
    glossary: [
      { wordId: 'recipe', forms: ['recipe'] },
      { wordId: 'ingredient', forms: ['ingredients'] },
      { wordId: 'slice', forms: ['slices', 'slice'] },
      { wordId: 'steam', forms: ['steam'] },
      { wordId: 'quantity', forms: ['quantity'] },
      { wordId: 'flavour', forms: ['flavour'] },
      { wordId: 'fundamental', forms: ['fundamental'] },
    ],
    questions: [
      {
        id: 'u13-r1-1',
        type: 'detail',
        stem: 'What are the ingredients of the grandmother\u2019s chicken soup?',
        options: [
          'Chicken, ginger and dried mushroom.',
          'Chicken, tomato and potato.',
          'Beef, onion and carrot.',
          'Fish, pepper and cabbage.',
        ],
        answerIndex: 0,
        explanation:
          '由第一段 "a whole chicken, two slices of ginger, and some dried mushroom" 可知汤的原料是鸡、姜和干蘑菇，故选 A；其余选项文中均未提及。',
      },
      {
        id: 'u13-r1-2',
        type: 'detail',
        stem: 'Why did the grandmother never measure the salt?',
        options: [
          'Because her hands simply knew the right amount.',
          'Because the family did not like salt.',
          'Because she had lost her measuring tools.',
          'Because the doctor told her to stop using salt.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "She never measured the quantity of salt; her hands simply knew" 可知她凭经验掌握盐量，故选 A。',
      },
      {
        id: 'u13-r1-3',
        type: 'main-idea',
        stem: 'What is the best title or main idea of the passage?',
        options: [
          'A family dish carries love, memory and culture.',
          'Chicken soup is the healthiest food in the world.',
          'Learning to cook is difficult for young people.',
          'Grandmothers are better cooks than parents.',
        ],
        answerIndex: 0,
        explanation:
          '全文通过一道家传鸡汤说明食物承载着爱与记忆、连接着家庭文化，第三段点明主旨，故选 A；B、C、D 均偏离文意。',
      },
    ],
  },
  {
    id: 'u13-p2',
    title: 'Different Tables, Different Cultures',
    genre: '说明文',
    paragraphs: [
      'Food culture differs from country to country. In Sichuan, many dishes are spicy, and the strong taste is believed to open the appetite. In France, people usually chew slowly and talk between courses, treating dinner as a social event rather than a race.',
      'Scientists say an ideal meal should consist of grains, vegetables, protein and fruit, in moderate quantities. Every vitamin matters, and eating too much of one thing seldom helps. Before making judgements about a foreign cuisine, it is wise to learn about its history and its association with local life.',
      'Travellers often find that trying local food is the quickest way to understand a culture. A bowl of noodles eaten at a night market can teach you more about a city than a guidebook. So next time you go abroad, be brave: taste first, and judge later.',
    ],
    glossary: [
      { wordId: 'appetite', forms: ['appetite'] },
      { wordId: 'chew', forms: ['chew'] },
      { wordId: 'ideal', forms: ['ideal'] },
      { wordId: 'consist', forms: ['consist'] },
      { wordId: 'moderate', forms: ['moderate'] },
      { wordId: 'vitamin', forms: ['vitamin'] },
      { wordId: 'cuisine', forms: ['cuisine'] },
      { wordId: 'association', forms: ['association'] },
    ],
    questions: [
      {
        id: 'u13-r2-1',
        type: 'detail',
        stem: 'According to Paragraph 2, what should an ideal meal consist of?',
        options: [
          'Grains, vegetables, protein and fruit.',
          'Only meat and milk.',
          'Fast food and sweet drinks.',
          'Nothing but vitamins.',
        ],
        answerIndex: 0,
        explanation:
          '由第二段 "an ideal meal should consist of grains, vegetables, protein and fruit" 可知理想的一餐应由谷物、蔬菜、蛋白质和水果组成，故选 A。',
      },
      {
        id: 'u13-r2-2',
        type: 'inference',
        stem: 'What can we infer from the last paragraph?',
        options: [
          'Local food can help travellers understand a culture quickly.',
          'Guidebooks are useless when travelling abroad.',
          'Night markets are the only place to taste noodles.',
          'People should never judge foreign food.',
        ],
        answerIndex: 0,
        explanation:
          '末段指出“品尝当地食物是了解一种文化最快的途径”，夜市一碗面胜过旅行指南，可推知当地食能帮助旅行者快速了解一种文化，故选 A；B、C、D 都是对文意的过度推断或曲解。',
      },
      {
        id: 'u13-r2-3',
        type: 'purpose',
        stem: 'Why does the author mention Sichuan and France in Paragraph 1?',
        options: [
          'To show that food cultures differ from place to place.',
          'To prove which country cooks the best food.',
          'To advise readers to move to France.',
          'To explain why spicy food is unhealthy.',
        ],
        answerIndex: 0,
        explanation:
          '第一段以四川人喜辣、法国人慢食为例，是为了说明首句“饮食文化因国而异”的观点，故选 A。',
      },
    ],
  },
];

/** 自动发现约定：units.ts 经 import.meta.glob('./unit*-…') 读取本 default 导出（新增单元照此约定） */
export default unit13Passages;
