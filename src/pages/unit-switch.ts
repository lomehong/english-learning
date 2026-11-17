import { UNIT_IDS, UNIT_META, isUnitId, type UnitId } from '../data/units';

/**
 * 单元切换器（词汇/语法/阅读/听力/写作各页共用）：
 * - 从 ?unit= 读取当前单元（缺省 Unit 1，非法值回退 Unit 1）；
 * - URL 约定保留其余参数（如 /vocabulary?tab=review 的 tab）。
 */

/** 从当前地址读取单元参数 */
export function currentUnit(): UnitId {
  const value = new URLSearchParams(location.search).get('unit');
  return isUnitId(value) ? value : 'unit1';
}

/** 构造保留既有查询参数的单元 URL（unit1 且无其他参数时返回干净路径） */
export function unitUrl(path: string, unit: UnitId): string {
  const params = new URLSearchParams(location.search);
  if (unit === 'unit2') params.set('unit', 'unit2');
  else params.delete('unit');
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export interface UnitSwitcher {
  el: HTMLElement;
  /** 当前单元（点击按钮后更新，供页面重新渲染内容） */
  get: () => UnitId;
}

/** 渲染两枚单元切换按钮（role=tablist，data-testid="unit-switcher"） */
export function buildUnitSwitcher(path: string, onChange: (unit: UnitId) => void): UnitSwitcher {
  let unit = currentUnit();

  const el = document.createElement('div');
  el.className = 'tabs unit-switch';
  el.setAttribute('role', 'tablist');
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
      try {
        history.replaceState(null, '', unitUrl(path, unit));
      } catch {
        /* file:// 等环境忽略 */
      }
      sync();
      onChange(unit);
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
