import { defaultStorage, type StorageLike } from '../store/progress';

/**
 * 三档主题（浅色 / 深色 / 跟随系统）：纯函数与持久化接缝。
 * DOM 应用（<html data-theme>）与全局切换入口在 ./switcher.ts，
 * 本文件不触碰 DOM / matchMedia，保证可独立单测。
 */

export type ThemeSetting = 'light' | 'dark' | 'auto';
/** 实际生效主题：auto 解析后只剩 light / dark，作为 <html data-theme> 的取值 */
export type ResolvedTheme = 'light' | 'dark';

/** localStorage 键（沿用 english-learning.*.v1 命名约定） */
export const THEME_KEY = 'english-learning.theme.v1';
/** 默认跟随系统：首次访问不强改用户习惯 */
export const DEFAULT_THEME: ThemeSetting = 'auto';

/** 切换器选项顺序：浅色 → 深色 → 跟随系统（循环） */
export const THEME_SETTINGS: readonly ThemeSetting[] = ['light', 'dark', 'auto'];

export const THEME_LABELS: Record<ThemeSetting, string> = {
  light: '浅色',
  dark: '深色',
  auto: '跟随系统',
};

export function isThemeSetting(value: unknown): value is ThemeSetting {
  return typeof value === 'string' && (THEME_SETTINGS as readonly string[]).includes(value);
}

/**
 * 解析生效主题：auto 跟随系统偏好，light / dark 固定。
 * system 只应有 'light' | 'dark'（matchMedia 结果），未知值按 light 保守降级。
 */
export function resolveTheme(setting: ThemeSetting, system: ResolvedTheme): ResolvedTheme {
  if (setting === 'auto') return system === 'dark' ? 'dark' : 'light';
  return setting;
}

/** 循环切换：浅色 → 深色 → 跟随系统 → 浅色（未知值从浅色起） */
export function nextThemeSetting(current: ThemeSetting): ThemeSetting {
  const index = THEME_SETTINGS.indexOf(current);
  const next = THEME_SETTINGS[(index + 1) % THEME_SETTINGS.length];
  return next ?? THEME_SETTINGS[0]!;
}

/** 解析持久化值：空 / 损坏 JSON / 非法取值回退默认；兼容历史裸字符串写法 */
function parseThemeSetting(raw: string | null): ThemeSetting {
  if (raw == null) return DEFAULT_THEME;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = raw;
  }
  return isThemeSetting(value) ? value : DEFAULT_THEME;
}

/** 读取持久化主题（storage 可注入；读取异常回退默认，不抛出） */
export function loadThemeSetting(storage: StorageLike = defaultStorage()): ThemeSetting {
  try {
    return parseThemeSetting(storage.getItem(THEME_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

/** 持久化主题（JSON 字符串，与 index.html 预置脚本格式一致；写入失败静默不阻断） */
export function saveThemeSetting(
  setting: ThemeSetting,
  storage: StorageLike = defaultStorage(),
): void {
  try {
    storage.setItem(THEME_KEY, JSON.stringify(setting));
  } catch {
    /* 隐私模式等写入失败：主题仅本次会话生效 */
  }
}
