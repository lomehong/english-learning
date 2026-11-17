/**
 * 单元注册表（自动发现 · 彻底数据驱动 · 册别维度分组）：
 * 单元清单由 src/data 下的数据文件按命名约定自动聚合，本文件只做聚合逻辑，不手工列单元：
 * - unitN-meta.json                     → 单元元信息（book / no / title / theme），单元清单的唯一驱动源；
 * - unitN-words.json                    → 词表（JSON 数组）；
 * - unitN-grammar.ts                    → default 导出 { points, exercises }；
 * - unitN-reading.ts                    → default 导出短文数组；
 * - unitN-listening.ts                  → default 导出听力材料数组；
 * - unitN-writing.ts                    → default 导出写作任务数组。
 * 新增单元 = 纯新增以上数据文件（meta 必需，五模块可缺），零代码改动；
 * 新增册别内容同样纯数据：把 unitN-meta.json 的 book 写成目标册（如「必修二」），注册表自动按册分组；
 * 缺某模块数据时该模块对该单元优雅降级为空数组（页面显示「暂无内容」），不会崩溃；
 * meta 缺 book 字段或取值非法时该单元降级归入必修一（缺册降级），同样不崩溃。
 */

import type {
  Word,
  GrammarPoint,
  GrammarExercise,
  ReadingPassage,
  ListeningMaterial,
  WritingTask,
} from '../types';

/* -------------------- 册别（book）维度 -------------------- */

/** 册别 id：URL ?book= 与 localStorage 的取值（ASCII slug，稳定不受编码影响） */
export type BookId =
  | 'required-1'
  | 'required-2'
  | 'required-3'
  | 'elective-1'
  | 'elective-2'
  | 'elective-3'
  | 'elective-4';

/** 册别定义：id（深链/存储取值）+ label（展示名，亦即 meta.json book 字段的取值） */
export interface BookDef {
  id: BookId;
  label: string;
}

/**
 * 人教2019高中英语全阶段七册（必修×3 + 选择性必修×4）。
 * 册别是固定架构维度，与单元数据文件无关：尚未收录单元数据的册在注册表中是空分组（缺册降级为空），
 * 后续把新单元 meta 的 book 写成对应册名即自动归入该册，无需改任何代码。
 */
export const BOOKS: readonly BookDef[] = [
  { id: 'required-1', label: '必修一' },
  { id: 'required-2', label: '必修二' },
  { id: 'required-3', label: '必修三' },
  { id: 'elective-1', label: '选择性必修一' },
  { id: 'elective-2', label: '选择性必修二' },
  { id: 'elective-3', label: '选择性必修三' },
  { id: 'elective-4', label: '选择性必修四' },
];

/** 全部册别 id（固定顺序：必修一 → 选择性必修四） */
export const BOOK_IDS: readonly BookId[] = BOOKS.map((b) => b.id);

/** 默认册：必修一（现有内容所在册；缺省 / 非法值 / 缺册降级的统一回退目标） */
export const DEFAULT_BOOK: BookId = 'required-1';

/** 册别展示名查询表 */
export const BOOK_LABELS: Record<BookId, string> = Object.fromEntries(
  BOOKS.map((b) => [b.id, b.label]),
) as Record<BookId, string>;

/** 册别顺序索引（册内排序 / 展示顺序用） */
const BOOK_INDEX = {} as Record<BookId, number>;
BOOKS.forEach((b, i) => {
  BOOK_INDEX[b.id] = i;
});

/** 是否合法册别 id */
export function isBookId(value: unknown): value is BookId {
  return typeof value === 'string' && (BOOK_IDS as readonly string[]).includes(value);
}

/**
 * meta 的 book 字段取值 → 册别 id（缺册降级的入口）：
 * 接受册名（必修一…，meta 数据文件的约定取值）或 slug（required-1…），
 * 缺失 / 类型不对 / 取值不在七册之列 → 一律降级归入必修一，不抛异常。
 */
export function normalizeBookValue(value: unknown): BookId {
  if (typeof value !== 'string') return DEFAULT_BOOK;
  for (const b of BOOKS) {
    if (b.label === value || b.id === value) return b.id;
  }
  return DEFAULT_BOOK;
}

/* -------------------- 单元 manifest -------------------- */

/** 单元 manifest：一个单元的全部元信息与五模块数据引用 */
export interface UnitManifest {
  /** 稳定单元 id（即 ?unit= 深链与 localStorage 的取值，来自文件名 unitN） */
  id: string;
  /** 所属册别（来自 unitN-meta.json 的 book，缺省归必修一） */
  book: BookId;
  /** 教材单元号（册内单元号，来自 unitN-meta.json 的 no） */
  no: number;
  /** 单元标题（教材原文英文主题，来自 unitN-meta.json 的 title） */
  title: string;
  /** 中文主题译名（来自 unitN-meta.json 的 theme） */
  theme: string;
  /** 词汇：词表 */
  words: Word[];
  /** 语法：讲解卡 + 专项练习 */
  grammarPoints: GrammarPoint[];
  grammarExercises: GrammarExercise[];
  /** 阅读：主题短文 */
  passages: ReadingPassage[];
  /** 听力：主题材料 */
  listenings: ListeningMaterial[];
  /** 写作：主题任务（含范文） */
  writingTasks: WritingTask[];
}

/** 单元元信息（兼容既有页面用语，titleZh 即 meta.theme） */
export interface UnitMeta {
  /** 所属册别 */
  book: BookId;
  /** 册内单元号 */
  no: number;
  /** 英文主题 */
  title: string;
  /** 中文主题译名 */
  titleZh: string;
}

/** unitN-meta.json 数据文件的形状（book 缺省时降级归入必修一） */
export interface UnitMetaFile {
  book?: string;
  no: number;
  title: string;
  theme: string;
}

/** unitN-grammar.ts default 导出的形状 */
export interface UnitGrammarModule {
  points: GrammarPoint[];
  exercises: GrammarExercise[];
}

/**
 * 自动发现的输入：各类数据文件的「相对路径 → default 导出内容」映射
 * （即 import.meta.glob('./unitN-*.…', { eager: true, import: 'default' }) 的返回值形状；
 * 值设为 unknown 以强制聚合层做防御性形状检查，测试可注入合成映射）。
 */
export interface UnitModuleFiles {
  /** unitN-meta.json → { book?, no, title, theme }；单元清单的唯一驱动源 */
  meta: Record<string, unknown>;
  /** unitN-words.json → Word[] */
  words?: Record<string, unknown>;
  /** unitN-grammar.ts → { points, exercises } */
  grammar?: Record<string, unknown>;
  /** unitN-reading.ts → ReadingPassage[] */
  reading?: Record<string, unknown>;
  /** unitN-listening.ts → ListeningMaterial[] */
  listening?: Record<string, unknown>;
  /** unitN-writing.ts → WritingTask[] */
  writing?: Record<string, unknown>;
}

/** 文件名 → 单元 id：./unit12-words.json 这类路径解析出 unit12（不匹配命名约定返回 null） */
function unitIdOfPath(path: string, suffix: string): string | null {
  const re = new RegExp(`^\\./(unit\\d+)-${suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
  const m = path.match(re);
  return m ? m[1] : null;
}

/** 防御性取数组：值不是数组时按空数组降级（缺文件 / 导出形状不对都不崩溃） */
function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/** meta 形状校验：no 为正整数、title / theme 非空字符串 */
function isValidMeta(value: unknown): value is UnitMetaFile {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Partial<UnitMetaFile>;
  return (
    typeof m.no === 'number' &&
    Number.isInteger(m.no) &&
    m.no > 0 &&
    typeof m.title === 'string' &&
    m.title.trim() !== '' &&
    typeof m.theme === 'string' &&
    m.theme.trim() !== ''
  );
}

/**
 * 聚合纯函数（自动发现的核心逻辑，可脱离真实文件测试）：
 * 1. 单元清单 = meta 文件清单（缺 meta 的孤儿模块文件被忽略）；
 * 2. meta 的 book 缺失 / 非法 → 该单元降级归入必修一（缺册降级，不崩溃）；
 * 3. 缺某模块数据文件（或导出形状不对）→ 该模块降级为空数组；
 * 4. 按册别顺序 → 册内 no 升序排序（no 相同时按 id 字典序，保证稳定）。
 */
export function buildUnitManifests(files: UnitModuleFiles): UnitManifest[] {
  const pick = (map: Record<string, unknown> | undefined, id: string, suffix: string): unknown => {
    if (!map) return undefined;
    for (const [path, value] of Object.entries(map)) {
      if (unitIdOfPath(path, suffix) === id) return value;
    }
    return undefined;
  };

  const units: UnitManifest[] = [];
  for (const [path, meta] of Object.entries(files.meta)) {
    const id = unitIdOfPath(path, 'meta.json');
    if (id === null || !isValidMeta(meta)) continue; // 非法 meta：跳过该单元，不崩溃
    const grammar = pick(files.grammar, id, 'grammar.ts');
    const grammarModule =
      typeof grammar === 'object' && grammar !== null ? (grammar as Partial<UnitGrammarModule>) : {};
    units.push({
      id,
      book: normalizeBookValue(meta.book),
      no: meta.no,
      title: meta.title,
      theme: meta.theme,
      words: asArray<Word>(pick(files.words, id, 'words.json')),
      grammarPoints: asArray<GrammarPoint>(grammarModule.points),
      grammarExercises: asArray<GrammarExercise>(grammarModule.exercises),
      passages: asArray<ReadingPassage>(pick(files.reading, id, 'reading.ts')),
      listenings: asArray<ListeningMaterial>(pick(files.listening, id, 'listening.ts')),
      writingTasks: asArray<WritingTask>(pick(files.writing, id, 'writing.ts')),
    });
  }

  units.sort(
    (a, b) =>
      BOOK_INDEX[a.book] - BOOK_INDEX[b.book] || a.no - b.no || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
  return units;
}

/** 命名约定自动发现（构建期由 Vite/Vitest 静态展开，无运行时 IO） */
export const UNIT_MANIFESTS: readonly UnitManifest[] = buildUnitManifests({
  meta: import.meta.glob('./unit*-meta.json', { eager: true, import: 'default' }),
  words: import.meta.glob('./unit*-words.json', { eager: true, import: 'default' }),
  grammar: import.meta.glob('./unit*-grammar.ts', { eager: true, import: 'default' }),
  reading: import.meta.glob('./unit*-reading.ts', { eager: true, import: 'default' }),
  listening: import.meta.glob('./unit*-listening.ts', { eager: true, import: 'default' }),
  writing: import.meta.glob('./unit*-writing.ts', { eager: true, import: 'default' }),
});

/**
 * 单元 id 类型：单元改为数据文件自动发现后，id 集合随数据增减而变，
 * 不再是编译期字面量联合；合法性由 isUnitId() 在运行时校验（深链 / 存储读取等入口）。
 */
export type UnitId = string;

/** 全部单元 id（注册表顺序：按册别顺序 → 册内 no 升序） */
export const UNIT_IDS: readonly UnitId[] = UNIT_MANIFESTS.map((m) => m.id);

const registry = {} as Record<UnitId, UnitManifest>;
const metaRecord = {} as Record<UnitId, UnitMeta>;
/** 按册分组的聚合视图：册别 → 该册单元清单（七册固定键，空册为空数组） */
const byBook = {} as Record<BookId, UnitManifest[]>;
for (const b of BOOKS) byBook[b.id] = [];
for (const m of UNIT_MANIFESTS) {
  registry[m.id] = m;
  metaRecord[m.id] = { book: m.book, no: m.no, title: m.title, titleZh: m.theme };
  byBook[m.book].push(m);
}

/** 单元注册表：id → manifest（各模块按当前单元取数的唯一入口） */
export const UNIT_REGISTRY: Record<UnitId, UnitManifest> = registry;

export const UNIT_META: Record<UnitId, UnitMeta> = metaRecord;

/** 按册分组的单元清单（注册表聚合视图；未收录数据的册为空数组，即缺册降级） */
export const UNITS_BY_BOOK: Record<BookId, readonly UnitManifest[]> = byBook;

/** 某册的单元清单（按册内 no 升序；空册返回空数组） */
export function unitsByBook(book: BookId): readonly UnitManifest[] {
  return UNITS_BY_BOOK[book] ?? [];
}

/** 某册的单元 id 清单（两级切换器第二级的数据源） */
export function unitIdsOfBook(book: BookId): readonly UnitId[] {
  return unitsByBook(book).map((m) => m.id);
}

/** 单元所属册别（单元唯一归属一册；未注册单元回退必修一） */
export function bookOfUnit(unit: UnitId): BookId {
  return UNIT_REGISTRY[unit]?.book ?? DEFAULT_BOOK;
}

/** 某册的第一个单元 id（册内 no 最小者）；空册返回 null（调用方降级处理） */
export function firstUnitOfBook(book: BookId): UnitId | null {
  return unitsByBook(book)[0]?.id ?? null;
}

/** 页面标题用：Unit 1 · Teenage Life */
export function unitTitle(unit: UnitId): string {
  const meta = UNIT_META[unit];
  return `Unit ${meta.no} ${meta.title}`;
}

/** 册 + 单元完整标题用：必修一 · Unit 1 · Teenage Life */
export function bookUnitTitle(unit: UnitId): string {
  const meta = UNIT_META[unit];
  return `${BOOK_LABELS[meta.book]} · Unit ${meta.no} ${meta.title}`;
}

export function isUnitId(value: unknown): value is UnitId {
  return typeof value === 'string' && (UNIT_IDS as readonly string[]).includes(value);
}
