import { defaultStorage, type StorageLike } from '../store/progress';
import {
  THEME_LABELS,
  THEME_SETTINGS,
  loadThemeSetting,
  resolveTheme,
  saveThemeSetting,
  type ResolvedTheme,
  type ThemeSetting,
} from './theme';

/**
 * 主题 DOM 侧：<html data-theme> 应用 + 全局右下角三档切换入口。
 * 切换器挂在 <body> 上（#app 之外），SPA 路由重渲染页面时不丢失；
 * 「跟随系统」档监听系统偏好变化实时重算，固定档位不受影响。
 */

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** matchMedia 接缝（测试可注入假媒体；addEventListener 可选，容忍老环境缺失） */
export interface MediaLike {
  matches: boolean;
  addEventListener?(type: 'change', listener: () => void): void;
  removeEventListener?(type: 'change', listener: () => void): void;
}

/** document 接缝（测试可注入；只声明用到的最小面） */
export interface DocumentLike {
  documentElement: HTMLElement;
  body: HTMLElement;
  createElement(tagName: 'div'): HTMLDivElement;
  createElement(tagName: 'button'): HTMLButtonElement;
}

function defaultMedia(): MediaLike | null {
  try {
    if (typeof matchMedia === 'function') return matchMedia(DARK_QUERY);
  } catch {
    /* jsdom 等环境可能未实现 */
  }
  return null;
}

function systemTheme(media: MediaLike | null): ResolvedTheme {
  return media?.matches ? 'dark' : 'light';
}

/** 应用生效主题到 <html data-theme>（tokens.css 按 [data-theme] 切换语义令牌） */
export function applyTheme(resolved: ResolvedTheme, doc: DocumentLike = document): void {
  doc.documentElement.dataset.theme = resolved;
}

/** 启动时应用持久化主题（index.html 内联脚本已预置首帧，此处为无脚本环境兜底） */
export function initTheme(
  storage: StorageLike = defaultStorage(),
  media: MediaLike | null = defaultMedia(),
): ResolvedTheme {
  const resolved = resolveTheme(loadThemeSetting(storage), systemTheme(media));
  applyTheme(resolved);
  return resolved;
}

export interface ThemeSwitcherHandle {
  el: HTMLElement;
  destroy(): void;
}

/** 挂载全局主题切换入口；返回节点与销毁函数（单测 / 热替换用，应用层常驻不销毁） */
export function mountThemeSwitcher(
  opts: { storage?: StorageLike; media?: MediaLike | null; doc?: DocumentLike } = {},
): ThemeSwitcherHandle {
  const storage = opts.storage ?? defaultStorage();
  const media = opts.media === undefined ? defaultMedia() : opts.media;
  // 全局 document 需显式收窄为 DocumentLike：否则 doc 变量为 DocumentLike | Document 联合，
  // createElement('button') 的返回值会并入 HTMLElement，导致 btn.type 等按钮属性无法访问
  const doc: DocumentLike = opts.doc ?? (document as DocumentLike);

  let setting: ThemeSetting = loadThemeSetting(storage);

  const el = doc.createElement('div');
  el.className = 'theme-switcher';
  el.setAttribute('role', 'group');
  el.setAttribute('aria-label', '主题切换');

  const buttons = new Map<ThemeSetting, HTMLElement>();

  function apply(): void {
    applyTheme(resolveTheme(setting, systemTheme(media)), doc);
  }

  function syncPressed(): void {
    for (const [option, btn] of buttons) {
      btn.setAttribute('aria-pressed', String(option === setting));
    }
  }

  function select(option: ThemeSetting): void {
    setting = option;
    saveThemeSetting(setting, storage);
    apply();
    syncPressed();
  }

  for (const option of THEME_SETTINGS) {
    const btn = doc.createElement('button');
    btn.setAttribute('type', 'button');
    btn.className = 'theme-switcher__btn';
    btn.textContent = THEME_LABELS[option];
    btn.addEventListener('click', () => select(option));
    buttons.set(option, btn);
    el.append(btn);
  }

  function onSystemChange(): void {
    // 仅「跟随系统」档响应系统变化；固定档位保持用户显式选择
    if (setting === 'auto') apply();
  }

  media?.addEventListener?.('change', onSystemChange);
  doc.body.append(el);
  apply();
  syncPressed();

  return {
    el,
    destroy() {
      media?.removeEventListener?.('change', onSystemChange);
      el.remove();
    },
  };
}
