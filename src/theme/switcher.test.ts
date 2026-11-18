import { describe, it, expect, beforeEach } from 'vitest';
import { initTheme, mountThemeSwitcher, type MediaLike } from './switcher';
import { THEME_KEY } from './theme';

/** 主题切换入口 DOM 单测（jsdom）：注入内存 Storage 与假媒体查询，不依赖真实 matchMedia */

function memoryStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
  };
}

/** 可变 matches + 可触发的假 matchMedia */
function fakeMedia(initial: boolean) {
  const listeners = new Set<() => void>();
  const media: MediaLike = {
    matches: initial,
    addEventListener: (_type, listener) => void listeners.add(listener),
    removeEventListener: (_type, listener) => void listeners.delete(listener),
  };
  return {
    media,
    setMatches(matches: boolean) {
      (media as { matches: boolean }).matches = matches;
      for (const listener of listeners) listener();
    },
  };
}

function clickButton(switcher: HTMLElement, label: string): void {
  const btn = [...switcher.querySelectorAll('button')].find((b) => b.textContent === label);
  (btn as HTMLButtonElement).click();
}

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.innerHTML = '';
});

describe('initTheme：启动应用持久化主题', () => {
  it('持久化 dark → <html data-theme="dark">', () => {
    expect(initTheme(memoryStorage({ [THEME_KEY]: '"dark"' }))).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('auto + 系统深色 → dark；auto + 系统浅色 → light', () => {
    expect(initTheme(memoryStorage(), fakeMedia(true).media)).toBe('dark');
    expect(initTheme(memoryStorage(), fakeMedia(false).media)).toBe('light');
  });

  it('无媒体环境（matchMedia 缺失）按浅色处理', () => {
    expect(initTheme(memoryStorage(), null)).toBe('light');
  });
});

describe('mountThemeSwitcher：全局切换入口', () => {
  it('挂载到 body，含三档按钮且默认档 pressed', () => {
    const storage = memoryStorage({ [THEME_KEY]: '"light"' });
    const switcher = mountThemeSwitcher({ storage, media: fakeMedia(false).media });

    expect(document.body.contains(switcher.el)).toBe(true);
    expect(switcher.el.getAttribute('role')).toBe('group');
    expect(switcher.el.getAttribute('aria-label')).toBe('主题切换');
    const buttons = [...switcher.el.querySelectorAll('button')];
    expect(buttons.map((b) => b.textContent)).toEqual(['浅色', '深色', '跟随系统']);
    expect(buttons[0]!.getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1]!.getAttribute('aria-pressed')).toBe('false');
  });

  it('点击「深色」：切换 data-theme、持久化并移动 pressed 状态', () => {
    const storage = memoryStorage();
    const switcher = mountThemeSwitcher({ storage, media: fakeMedia(false).media });

    clickButton(switcher.el, '深色');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(storage.getItem(THEME_KEY)).toBe('"dark"');

    const pressed = [...switcher.el.querySelectorAll('button')].filter(
      (b) => b.getAttribute('aria-pressed') === 'true',
    );
    expect(pressed.map((b) => b.textContent)).toEqual(['深色']);
  });

  it('「跟随系统」档响应系统偏好变化，固定档位不响应', () => {
    const sys = fakeMedia(false);
    const storage = memoryStorage();
    const switcher = mountThemeSwitcher({ storage, media: sys.media });

    clickButton(switcher.el, '跟随系统');
    expect(document.documentElement.dataset.theme).toBe('light');
    sys.setMatches(true); // 系统切到深色 → auto 跟随
    expect(document.documentElement.dataset.theme).toBe('dark');

    clickButton(switcher.el, '浅色'); // 固定浅色
    sys.setMatches(false);
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('destroy：移除节点并解绑系统监听', () => {
    const sys = fakeMedia(false);
    const switcher = mountThemeSwitcher({ storage: memoryStorage(), media: sys.media });
    switcher.destroy();
    expect(document.body.contains(switcher.el)).toBe(false);

    document.documentElement.removeAttribute('data-theme');
    sys.setMatches(true); // 监听已解绑，不应再改动主题
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
