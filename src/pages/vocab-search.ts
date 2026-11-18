import type { Word } from '../types';

/**
 * 词汇页「单元内搜索」的纯过滤逻辑（无 DOM / 无存储依赖，便于单测）：
 * - 关键词先归一化：去首尾空白 + 转小写（英文大小写不敏感，中文不受影响）；
 * - 空关键词（含仅空白）→ 返回词表副本，等价于「不过滤」；
 * - 英文关键词 → 命中 word 的大小写不敏感子串（如 app → apply / amazing）；
 * - 中文关键词 → 命中中文释义 meaning 的子串（如 志愿者 → volunteer）；
 * - 任一字段命中即保留，结果始终保持词表原顺序，不修改入参。
 */

/** 归一化搜索关键词：去首尾空白 + 小写（空串/纯空白 → 空串） */
export function normalizeVocabQuery(raw: string): string {
  return raw.trim().toLowerCase();
}

/** 关键词是否有效（非空/非纯空白）：决定结果列表与一键清空按钮是否显示 */
export function hasVocabQuery(raw: string): boolean {
  return normalizeVocabQuery(raw) !== '';
}

/** 按关键词过滤当前单元词表（纯函数）：英文匹配拼写，中文匹配释义 */
export function filterVocabWords(words: readonly Word[], rawQuery: string): Word[] {
  const query = normalizeVocabQuery(rawQuery);
  if (query === '') return [...words];
  return words.filter(
    (word) =>
      word.word.toLowerCase().includes(query) || word.meaning.toLowerCase().includes(query),
  );
}

/**
 * 首个匹配词在词表中的下标（深链 ?q= 初始定位 / 回车跳转共用）；
 * 关键词为空（含纯空白）或无匹配时返回 -1，由调用方回退到默认卡片位置。
 */
export function firstMatchIndex(words: readonly Word[], rawQuery: string): number {
  if (!hasVocabQuery(rawQuery)) return -1;
  const [first] = filterVocabWords(words, rawQuery);
  return first ? words.findIndex((w) => w.id === first.id) : -1;
}
