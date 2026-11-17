import { UNIT_IDS, UNIT_META, isUnitId, type UnitId } from '../data/units';

/**
 * 全局单元状态（首页切换器 + 各模块页共用）：
 * - 状态存 localStorage（键 english-learning.unit.v1），跨页面、跨会话保持；
 * - 与 URL ?unit= 双向同步：
 *   · URL → 状态：任何页面挂载读取 currentUnit() 时，有效的 ?unit= 深链优先并被回写存储；
 *   · 状态 → URL：首页切换器调 setUnit() 时 replaceState 更新当前地址（保留其余查询参数，
 *     Unit 1 走干净路径）；
 * - 非法与缺省一律回退 Unit 1。
 */

export const UNIT_STORAGE_KEY = 'english-learning.unit.v1';

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

/** ?unit= 深链写法 → 规范单元 id（unit1/unit2… 与单元号 1/2… 均为合法写法） */
const UNIT_PARAM_SPELLINGS = new Map<string, UnitId>(
  UNIT_IDS.flatMap((id) => [
    [id, id] as const,
    [String(UNIT_META[id].no), id] as const,
  ]),
);

/** 解析 ?unit= 参数：合法返回单元 id；缺省（null）与非法值返回 null（由存储/默认值兜底） */
export function unitFromParam(value: string | null): UnitId | null {
  if (value === null) return null;
  return UNIT_PARAM_SPELLINGS.get(value) ?? null;
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

let memo: UnitId | null = null;

function persist(unit: UnitId): void {
  const storage = unitStorage();
  if (!storage) return; // 存储不可用时仅保留内存态
  try {
    storage.setItem(UNIT_STORAGE_KEY, unit);
  } catch {
    /* 写入失败时静默降级 */
  }
}

/**
 * 当前全局单元（各模块页挂载时调用）：
 * URL ?unit= 有效 → 采纳并回写存储（深链优先）；否则读存储；仍无 → 回退 Unit 1。
 */
export function currentUnit(): UnitId {
  const fromUrl = unitFromParam(new URLSearchParams(location.search).get('unit'));
  if (fromUrl) {
    persist(fromUrl); // URL → localStorage 同步
    memo = fromUrl;
    return fromUrl;
  }
  memo ??= storedUnit() ?? 'unit1';
  return memo;
}

/** 切换全局单元：更新内存 + localStorage + 当前 URL（状态 → URL 同步） */
export function setUnit(unit: UnitId): void {
  memo = unit;
  persist(unit);
  const params = new URLSearchParams(location.search);
  if (unit === 'unit1') params.delete('unit');
  else params.set('unit', unit);
  const qs = params.toString();
  try {
    history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname);
  } catch {
    /* file:// 等环境忽略 */
  }
}

/** 测试专用：重置内存态并清除单元存储键，保证用例独立 */
export function resetUnitState(): void {
  memo = null;
  const storage = unitStorage();
  if (!storage) return;
  try {
    storage.removeItem(UNIT_STORAGE_KEY);
  } catch {
    /* 忽略 */
  }
}

/** 模块页头部单元徽标：展示当前单元，点击回首页切换（切换器只在首页） */
export function buildUnitBadge(unit: UnitId): HTMLAnchorElement {
  const meta = UNIT_META[unit];
  const badge = document.createElement('a');
  badge.className = 'stat-chip unit-badge';
  badge.href = '/';
  badge.setAttribute('data-link', '');
  badge.setAttribute('data-testid', 'current-unit');
  badge.dataset.unit = unit;
  badge.title = '回首页切换当前单元';
  badge.textContent = `当前单元 Unit ${meta.no} · ${meta.title} · 回首页切换`;
  return badge;
}

export interface UnitSwitcher {
  el: HTMLElement;
  /** 当前单元（点击按钮后更新） */
  get: () => UnitId;
}

/** 首页全局单元切换器（role=tablist，data-testid="unit-switcher"，覆盖全部注册单元） */
export function buildUnitSwitcher(onChange?: (unit: UnitId) => void): UnitSwitcher {
  let unit = currentUnit();

  const el = document.createElement('div');
  el.className = 'tabs unit-switch';
  el.setAttribute('role', 'tablist');
  el.setAttribute('aria-label', '全局单元切换');
  el.setAttribute('data-testid', 'unit-switcher');

  const buttons = new Map<UnitId, HTMLButtonElement>();
  for (const id of UNIT_IDS) {
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
      setUnit(id); // 状态 + localStorage + URL 三处同步
      sync();
      onChange?.(unit);
    });
    buttons.set(id, button);
    el.append(button);
  }

  function sync(): void {
    for (const id of UNIT_IDS) {
      const button = buttons.get(id)!;
      button.classList.toggle('tab--active', unit === id);
      button.setAttribute('aria-selected', String(unit === id));
    }
  }

  sync();
  return { el, get: () => unit };
}
