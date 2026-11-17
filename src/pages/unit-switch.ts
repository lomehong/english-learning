import {
  UNIT_IDS,
  UNIT_META,
  BOOKS,
  BOOK_IDS,
  BOOK_LABELS,
  DEFAULT_BOOK,
  bookOfUnit,
  unitIdsOfBook,
  isUnitId,
  isBookId,
  type UnitId,
  type BookId,
} from '../data/units';

/**
 * 全局「册 + 单元」两级状态（首页两级切换器 + 各模块页共用）：
 * - 状态存 localStorage（册键 english-learning.book.v1 / 单元键 english-learning.unit.v1），
 *   跨页面、跨会话保持；
 * - 与 URL ?book=&unit= 双向同步：
 *   · URL → 状态：任何页面挂载读取 currentUnit()/currentBook() 时，有效的深链参数优先并被回写存储；
 *     - ?unit= 有效 → 单元精确命中，册随单元归属（?book= 冲突时以单元为准）；
 *     - 仅 ?book= 有效 → 册命中，单元取该册内最近选择，不在该册则取该册首个单元；
 *   · 状态 → URL：首页切换器调 setBook()/setUnit() 时 replaceState 更新当前地址（保留其余查询参数；
 *     默认册必修一不写 ?book=、Unit 1 不写 ?unit=，保持干净路径）；
 * - 空册降级：七册中尚未收录单元数据的册，单元列表显示空态提示，模块页沿用最近一个有效单元，不崩溃；
 * - 非法与缺省一律回退：册 → 必修一，单元 → Unit 1。
 */

export const UNIT_STORAGE_KEY = 'english-learning.unit.v1';
export const BOOK_STORAGE_KEY = 'english-learning.book.v1';

/** 默认单元（必修一 Unit 1）：缺省 / 非法值的统一回退目标 */
export const DEFAULT_UNIT: UnitId = 'unit1';

/** 存储句柄（getItem/setItem/removeItem 子集；测试环境与浏览器一致解析） */
type UnitStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/**
 * 解析 localStorage 句柄：
 * Node≥26 的实验性全局 localStorage 会遮蔽 jsdom 注入的实例（jsdom 原件挂在 _localStorage），
 * 与 store/progress.ts 的 defaultStorage 同款兜底思路；不可用时返回 null（仅保留内存态）。
 */
function unitStorage(): UnitStorage | null {
  try {
    const g = globalThis as unknown as { _localStorage?: UnitStorage; localStorage?: UnitStorage };
    return g._localStorage ?? g.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * ?unit= 深链写法 → 规范单元 id：
 * - 全拼写法（unit1 / unit2 …）对所有注册单元有效；
 * - 数字写法（1 / 2 …）是单册时代的遗留兼容，跨册存在同号单元后有歧义，
 *   固定解析为默认册（必修一）的对应单元，语义不随册别扩充而漂移。
 */
const UNIT_PARAM_SPELLINGS = new Map<string, UnitId>(
  UNIT_IDS.flatMap((id) => {
    const spellings: Array<readonly [string, UnitId]> = [[id, id]];
    if (bookOfUnit(id) === DEFAULT_BOOK) spellings.push([String(UNIT_META[id].no), id]);
    return spellings;
  }),
);

/** ?book= 深链写法 → 册别 id（slug 写法 required-1 与中文册名写法 必修一 均为合法写法） */
const BOOK_PARAM_SPELLINGS = new Map<string, BookId>(
  BOOKS.flatMap((b) => [
    [b.id, b.id] as const,
    [b.label, b.id] as const,
  ]),
);

/** 解析 ?unit= 参数：合法返回单元 id；缺省（null）与非法值返回 null（由存储/默认值兜底） */
export function unitFromParam(value: string | null): UnitId | null {
  if (value === null) return null;
  return UNIT_PARAM_SPELLINGS.get(value) ?? null;
}

/** 解析 ?book= 参数：合法返回册别 id；缺省（null）与非法值返回 null（由存储/默认值兜底） */
export function bookFromParam(value: string | null): BookId | null {
  if (value === null) return null;
  return BOOK_PARAM_SPELLINGS.get(value) ?? null;
}

/** 读取 localStorage 中的单元选择；未存或非法返回 null */
export function storedUnit(): UnitId | null {
  const storage = unitStorage();
  if (!storage) return null; // 隐私模式 / 存储被禁用时回退默认
  try {
    const raw = storage.getItem(UNIT_STORAGE_KEY);
    return raw !== null && isUnitId(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** 读取 localStorage 中的册别选择；未存或非法返回 null */
export function storedBook(): BookId | null {
  const storage = unitStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(BOOK_STORAGE_KEY);
    return raw !== null && isBookId(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** 全局选择：册 + 单元（一个单元唯一归属一册；空册时单元为「沿用」的最近有效单元） */
export interface BookUnitSelection {
  book: BookId;
  unit: UnitId;
}

let memo: BookUnitSelection | null = null;

function persistSelection(sel: BookUnitSelection): void {
  const storage = unitStorage();
  if (!storage) return; // 存储不可用时仅保留内存态
  try {
    storage.setItem(BOOK_STORAGE_KEY, sel.book);
    storage.setItem(UNIT_STORAGE_KEY, sel.unit);
  } catch {
    /* 写入失败时静默降级 */
  }
}

/**
 * 册内选单元（空册降级的核心）：
 * 该册尚未收录单元 → 沿用回退单元（最近一次具体选择，模块页照常取数不崩溃）；
 * 回退单元不在该册 → 取该册首个单元（册切换的默认落点）。
 */
function pickUnitForBook(book: BookId, fallback: UnitId): UnitId {
  const ids = unitIdsOfBook(book);
  if (ids.length === 0) return fallback;
  return (ids as readonly string[]).includes(fallback) ? fallback : ids[0];
}

/**
 * 解析当前全局选择（各模块页挂载 / 首页切换器初始化共用）：
 * 有效深链（?unit= 或 ?book=）优先并回写存储；否则读存储；仍无 → 回退必修一 Unit 1。
 */
function resolveSelection(): BookUnitSelection {
  const params = new URLSearchParams(location.search);
  const urlUnit = unitFromParam(params.get('unit'));
  const urlBook = bookFromParam(params.get('book'));
  if (urlUnit !== null || urlBook !== null) {
    const sel: BookUnitSelection =
      urlUnit !== null
        ? { unit: urlUnit, book: bookOfUnit(urlUnit) } // 单元深链优先：册随单元归属
        : { book: urlBook!, unit: pickUnitForBook(urlBook!, storedUnit() ?? DEFAULT_UNIT) };
    persistSelection(sel); // URL → localStorage 同步
    memo = sel;
    return sel;
  }
  memo ??= (() => {
    const unit = storedUnit() ?? DEFAULT_UNIT;
    const storedB = storedBook();
    // 存储册有效：单元尽量落在该册（不在该册 → 该册首个单元；空册 → 沿用单元）
    return storedB !== null
      ? { book: storedB, unit: pickUnitForBook(storedB, unit) }
      : { book: bookOfUnit(unit), unit };
  })();
  return memo;
}

/** 当前全局单元（各模块页挂载时调用；册 + 单元联动的单元侧） */
export function currentUnit(): UnitId {
  return resolveSelection().unit;
}

/** 当前全局册别（首页两级切换器 / 学习报告按册统计用；册 + 单元联动的册侧） */
export function currentBook(): BookId {
  return resolveSelection().book;
}

/** 地址栏同步（状态 → URL）：默认册不写 ?book=、Unit 1 不写 ?unit=；空册只保留册参数 */
function syncUrl(sel: BookUnitSelection): void {
  const params = new URLSearchParams(location.search);
  if (sel.book === DEFAULT_BOOK) params.delete('book');
  else params.set('book', sel.book);
  const unitInBook = bookOfUnit(sel.unit) === sel.book;
  if (unitInBook && sel.unit !== DEFAULT_UNIT) params.set('unit', sel.unit);
  else params.delete('unit');
  const qs = params.toString();
  try {
    history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname);
  } catch {
    /* file:// 等环境忽略 */
  }
}

/** 切换全局单元：册随单元归属，内存 + localStorage + 当前 URL 三处同步 */
export function setUnit(unit: UnitId): void {
  const sel: BookUnitSelection = { unit, book: bookOfUnit(unit) };
  memo = sel;
  persistSelection(sel);
  syncUrl(sel);
}

/**
 * 切换全局册别（两级切换器第一级）：
 * 该册有单元 → 单元自动落到册内最近选择（不在该册则取该册首个单元）；
 * 空册 → 沿用最近一个有效单元（模块页降级不崩溃）。
 */
export function setBook(book: BookId): void {
  const fallback = memo?.unit ?? storedUnit() ?? DEFAULT_UNIT;
  const sel: BookUnitSelection = { book, unit: pickUnitForBook(book, fallback) };
  memo = sel;
  persistSelection(sel);
  syncUrl(sel);
}

/** 测试专用：重置内存态并清除册别 / 单元两个存储键，保证用例独立 */
export function resetUnitState(): void {
  memo = null;
  const storage = unitStorage();
  if (!storage) return;
  try {
    storage.removeItem(UNIT_STORAGE_KEY);
    storage.removeItem(BOOK_STORAGE_KEY);
  } catch {
    /* 忽略 */
  }
}

/** 模块页头部单元徽标：展示当前册 + 单元，点击回首页切换（两级切换器只在首页） */
export function buildUnitBadge(unit: UnitId): HTMLAnchorElement {
  const meta = UNIT_META[unit];
  const badge = document.createElement('a');
  badge.className = 'stat-chip unit-badge';
  badge.href = '/';
  badge.setAttribute('data-link', '');
  badge.setAttribute('data-testid', 'current-unit');
  badge.dataset.unit = unit;
  badge.dataset.book = meta.book;
  badge.title = '回首页切换当前册与单元';
  badge.textContent = `当前 ${BOOK_LABELS[meta.book]} Unit ${meta.no} · ${meta.title} · 回首页切换`;
  return badge;
}

export interface BookSwitcher {
  el: HTMLElement;
  /** 当前册（点击按钮后更新） */
  get: () => BookId;
}

/** 首页第一级：册别切换器（七册固定维度，role=tablist，data-testid="book-switcher"） */
export function buildBookSwitcher(onChange?: (book: BookId) => void): BookSwitcher {
  let book = currentBook();

  const el = document.createElement('div');
  el.className = 'tabs book-switch';
  el.setAttribute('role', 'tablist');
  el.setAttribute('aria-label', '册别切换');
  el.setAttribute('data-testid', 'book-switcher');

  const buttons = new Map<BookId, HTMLButtonElement>();
  for (const def of BOOKS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tab';
    button.dataset.book = def.id;
    button.setAttribute('role', 'tab');
    button.textContent = def.label;
    button.addEventListener('click', () => {
      if (book === def.id) return;
      book = def.id;
      setBook(def.id); // 状态 + localStorage + URL 三处同步
      sync();
      onChange?.(book);
    });
    buttons.set(def.id, button);
    el.append(button);
  }

  function sync(): void {
    for (const id of BOOK_IDS) {
      const button = buttons.get(id)!;
      button.classList.toggle('tab--active', book === id);
      button.setAttribute('aria-selected', String(book === id));
    }
  }

  sync();
  return { el, get: () => book };
}

export interface UnitSwitcher {
  el: HTMLElement;
  /** 当前单元（点击按钮后更新；空册无按钮时保持构造时的当前单元） */
  get: () => UnitId;
}

/**
 * 首页第二级：当前册的单元切换器（role=tablist，data-testid="unit-switcher"）。
 * 只渲染该册的注册单元（两级联动的单元侧）；空册降级为空态提示（data-testid="unit-empty"）。
 */
export function buildUnitSwitcher(book: BookId, onChange?: (unit: UnitId) => void): UnitSwitcher {
  let unit = currentUnit();

  const el = document.createElement('div');
  el.className = 'tabs unit-switch';
  el.setAttribute('role', 'tablist');
  el.setAttribute('aria-label', '当前册单元切换');
  el.setAttribute('data-testid', 'unit-switcher');
  el.dataset.book = book;

  const ids = unitIdsOfBook(book);
  if (ids.length === 0) {
    // 缺册降级：该册暂无单元数据；新增 unitN-meta.json（book 写该册）后自动出现
    const empty = document.createElement('span');
    empty.className = 'unit-switch__empty';
    empty.setAttribute('data-testid', 'unit-empty');
    empty.textContent = `${BOOK_LABELS[book]} 暂未收录单元数据，新增单元数据文件后自动出现`;
    el.removeAttribute('role');
    el.removeAttribute('aria-label');
    el.append(empty);
    return { el, get: () => unit };
  }

  const buttons = new Map<UnitId, HTMLButtonElement>();
  for (const id of ids) {
    const meta = UNIT_META[id];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tab';
    button.dataset.unit = id;
    button.setAttribute('role', 'tab');
    button.textContent = `Unit ${meta.no} · ${meta.title}`;
    button.addEventListener('click', () => {
      if (unit === id) return;
      unit = id;
      setUnit(id); // 状态 + localStorage + URL 三处同步（册随单元）
      sync();
      onChange?.(unit);
    });
    buttons.set(id, button);
    el.append(button);
  }

  function sync(): void {
    for (const id of ids) {
      const button = buttons.get(id)!;
      const active = unit === id && bookOfUnit(unit) === book;
      button.classList.toggle('tab--active', active);
      button.setAttribute('aria-selected', String(active));
    }
  }

  sync();
  return { el, get: () => unit };
}
