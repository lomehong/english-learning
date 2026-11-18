import { describe, it, expect } from 'vitest';
import {
  DEFAULT_THEME,
  THEME_KEY,
  THEME_LABELS,
  THEME_SETTINGS,
  isThemeSetting,
  loadThemeSetting,
  nextThemeSetting,
  resolveTheme,
  saveThemeSetting,
} from './theme';

/** 三档主题纯函数单测：注入内存 Storage，不依赖真实 localStorage / DOM */

function memoryStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  };
}

describe('isThemeSetting：三档取值校验', () => {
  it('接受 light / dark / auto', () => {
    expect(isThemeSetting('light')).toBe(true);
    expect(isThemeSetting('dark')).toBe(true);
    expect(isThemeSetting('auto')).toBe(true);
  });

  it('拒绝非法字符串与非字符串', () => {
    expect(isThemeSetting('blue')).toBe(false);
    expect(isThemeSetting('')).toBe(false);
    expect(isThemeSetting('LIGHT')).toBe(false); // 大小写敏感
    expect(isThemeSetting(42)).toBe(false);
    expect(isThemeSetting(null)).toBe(false);
    expect(isThemeSetting(undefined)).toBe(false);
    expect(isThemeSetting({ theme: 'dark' })).toBe(false);
  });
});

describe('主题选项常量', () => {
  it('THEME_SETTINGS 恰好三档且不重复', () => {
    expect(THEME_SETTINGS).toHaveLength(3);
    expect(new Set(THEME_SETTINGS).size).toBe(3);
  });

  it('每档都有非空中文标签', () => {
    for (const setting of THEME_SETTINGS) {
      expect(THEME_LABELS[setting].length).toBeGreaterThan(0);
    }
  });
});

describe('resolveTheme：auto 跟随系统，固定档不受系统影响', () => {
  it('auto 按系统偏好解析', () => {
    expect(resolveTheme('auto', 'dark')).toBe('dark');
    expect(resolveTheme('auto', 'light')).toBe('light');
  });

  it('light / dark 固定不变', () => {
    expect(resolveTheme('light', 'dark')).toBe('light');
    expect(resolveTheme('light', 'light')).toBe('light');
    expect(resolveTheme('dark', 'light')).toBe('dark');
    expect(resolveTheme('dark', 'dark')).toBe('dark');
  });
});

describe('nextThemeSetting：循环切换', () => {
  it('浅色 → 深色 → 跟随系统 → 浅色', () => {
    expect(nextThemeSetting('light')).toBe('dark');
    expect(nextThemeSetting('dark')).toBe('auto');
    expect(nextThemeSetting('auto')).toBe('light');
  });
});

describe('loadThemeSetting：持久化读取', () => {
  it('无记录 / 空存储回退默认 auto', () => {
    expect(loadThemeSetting(memoryStorage())).toBe(DEFAULT_THEME);
    expect(DEFAULT_THEME).toBe('auto');
  });

  it('saveThemeSetting → loadThemeSetting 读写往返一致', () => {
    const storage = memoryStorage();
    for (const setting of THEME_SETTINGS) {
      saveThemeSetting(setting, storage);
      expect(loadThemeSetting(storage)).toBe(setting);
    }
  });

  it('saveThemeSetting 写入 JSON 字符串（与 index.html 预置脚本格式一致）', () => {
    const storage = memoryStorage();
    saveThemeSetting('dark', storage);
    expect(storage.getItem(THEME_KEY)).toBe('"dark"');
  });

  it('损坏 JSON 回退默认（不抛异常）', () => {
    expect(loadThemeSetting(memoryStorage({ [THEME_KEY]: '{oops' }))).toBe('auto');
  });

  it('非法持久化值回退默认', () => {
    expect(loadThemeSetting(memoryStorage({ [THEME_KEY]: '"blue"' }))).toBe('auto');
    expect(loadThemeSetting(memoryStorage({ [THEME_KEY]: 'null' }))).toBe('auto');
    expect(loadThemeSetting(memoryStorage({ [THEME_KEY]: '3' }))).toBe('auto');
  });

  it('兼容历史裸字符串写法', () => {
    expect(loadThemeSetting(memoryStorage({ [THEME_KEY]: 'dark' }))).toBe('dark');
    expect(loadThemeSetting(memoryStorage({ [THEME_KEY]: 'blue' }))).toBe('auto');
  });
});

describe('saveThemeSetting：写入失败静默降级', () => {
  it('setItem 抛异常时不向外传播（主题仅本次会话生效）', () => {
    const throwing = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota exceeded');
      },
    };
    expect(() => saveThemeSetting('dark', throwing)).not.toThrow();
  });
});
