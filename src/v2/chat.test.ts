import { describe, it, expect, afterEach } from 'vitest';
import { createRouter, navigate } from '../router';
import { renderHome } from '../pages/home';
import { renderChat } from './chat';
import {
  V2_SETTINGS_KEY,
  defaultV2Settings,
  loadV2Settings,
  type V2StorageLike,
} from './settings';

/** /v2 对话壳验收：骨架结构 / 无 Key 占位回复 / 设置弹窗持久化 / 路由共存。
 *  测试中的 API Key 一律为显式假值（test-key-*），与真实凭证无关。 */

function makeStorage(initial: Record<string, string> = {}): V2StorageLike {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function submit(form: HTMLFormElement): void {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

function mount(storage: V2StorageLike): { root: HTMLElement; cleanup: () => void } {
  const root = document.createElement('div');
  document.body.append(root);
  const cleanup = renderChat(root, { storage }) ?? (() => {});
  return { root, cleanup: () => { cleanup(); root.remove(); } };
}

function input(root: HTMLElement): HTMLInputElement {
  return root.querySelector<HTMLInputElement>('[data-testid="v2-input"]')!;
}

function send(root: HTMLElement): HTMLButtonElement {
  return root.querySelector<HTMLButtonElement>('[data-testid="v2-send"]')!;
}

function assistantBubbles(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.v2-msg--assistant .v2-msg__bubble')];
}

describe('/v2 对话式学习壳', () => {
  let cleanup: (() => void) | null = null;

  afterEach(() => {
    cleanup?.();
    cleanup = null;
    history.pushState(null, '', '/');
  });

  it('首屏骨架：欢迎消息流 + 底部输入框/发送 + 右侧占位卡（标题/正文/按钮）+ 设置入口与未配置状态', () => {
    const storage = makeStorage();
    const page = mount(storage);
    cleanup = page.cleanup;

    expect(page.root.querySelector('[data-testid="v2-messages"]')).toBeTruthy();
    expect(page.root.textContent).toContain('v2 对话式学习');
    expect(assistantBubbles(page.root).length).toBeGreaterThanOrEqual(1); // 欢迎消息

    expect(input(page.root)).toBeTruthy();
    expect(send(page.root).textContent).toContain('发送');

    const panel = page.root.querySelector('[data-testid="v2-panel-body"]')!;
    expect(panel.querySelector('[data-testid="v2-card-title"]')!.textContent).toContain('示例学习卡');
    expect(panel.querySelector('[data-testid="v2-card-body"]')!.textContent!.length).toBeGreaterThan(0);
    expect(panel.querySelector('[data-testid="v2-card-action"]')).toBeTruthy();

    expect(page.root.querySelector('[data-testid="v2-settings-open"]')).toBeTruthy();
    expect(page.root.querySelector('[data-testid="v2-status"]')!.textContent).toContain('未配置');
  });

  it('未配置 Key 发送消息：出现用户气泡与本地占位回复，含「去设置」提示与跳转按钮，输入框清空', () => {
    const page = mount(makeStorage());
    cleanup = page.cleanup;

    input(page.root).value = 'What is the past tense of go?';
    submit(page.root.querySelector('[data-testid="v2-composer"]') as HTMLFormElement);

    const userBubble = page.root.querySelector<HTMLElement>('.v2-msg--user .v2-msg__bubble')!;
    expect(userBubble.textContent).toContain('What is the past tense of go?');

    const last = assistantBubbles(page.root).at(-1)!;
    expect(last.textContent).toContain('占位');
    expect(last.querySelector('[data-testid="v2-hint-settings"]')).toBeTruthy();

    expect(input(page.root).value).toBe('');
  });

  it('空输入不发送消息', () => {
    const page = mount(makeStorage());
    cleanup = page.cleanup;

    const before = page.root.querySelectorAll('.v2-msg').length;
    input(page.root).value = '   ';
    submit(page.root.querySelector('[data-testid="v2-composer"]') as HTMLFormElement);
    expect(page.root.querySelectorAll('.v2-msg').length).toBe(before);
  });

  it('已配置 Key：回复展示提供商与模型名，且任何 DOM 文本不泄露 API Key', () => {
    const storage = makeStorage();
    const seeded = { ...defaultV2Settings(), apiKey: 'test-key-secret' };
    storage.setItem(V2_SETTINGS_KEY, JSON.stringify(seeded));
    const page = mount(storage);
    cleanup = page.cleanup;

    input(page.root).value = 'hello';
    submit(page.root.querySelector('[data-testid="v2-composer"]') as HTMLFormElement);

    const last = assistantBubbles(page.root).at(-1)!;
    expect(last.textContent).toContain('GLM');
    expect(last.textContent).toContain('glm-4-flash');
    expect(page.root.textContent).not.toContain('test-key-secret');
  });

  it('设置弹窗：保存后持久化、重开回填；清空回默认且可重新保存', () => {
    const storage = makeStorage();
    const page = mount(storage);
    cleanup = page.cleanup;

    click(page.root.querySelector('[data-testid="v2-settings-open"]')!);
    const modal = page.root.querySelector<HTMLElement>('[data-testid="v2-settings-modal"]')!;
    expect(modal.hidden).toBe(false);

    const provider = modal.querySelector<HTMLSelectElement>('[data-testid="v2-provider"]')!;
    provider.value = 'deepseek';
    provider.dispatchEvent(new Event('change', { bubbles: true }));
    const apiKeyInput = modal.querySelector<HTMLInputElement>('[data-testid="v2-apikey"]')!;
    apiKeyInput.value = 'test-key-9';
    click(modal.querySelector('[data-testid="v2-settings-save"]')!);

    expect(modal.hidden).toBe(true);
    expect(loadV2Settings(storage)).toEqual({
      ...defaultV2Settings(),
      provider: 'deepseek',
      baseURL: 'https://api.deepseek.com',
      model: 'deepseek-chat',
      apiKey: 'test-key-9',
    });
    expect(page.root.querySelector('[data-testid="v2-status"]')!.textContent).toContain('DeepSeek');

    // 重开：字段从 localStorage 回填（保存后重开仍在）
    click(page.root.querySelector('[data-testid="v2-settings-open"]')!);
    expect(modal.querySelector<HTMLSelectElement>('[data-testid="v2-provider"]')!.value).toBe('deepseek');
    expect(modal.querySelector<HTMLInputElement>('[data-testid="v2-apikey"]')!.value).toBe('test-key-9');

    // 清空：回默认，可重设
    click(modal.querySelector('[data-testid="v2-settings-clear"]')!);
    expect(storage.getItem(V2_SETTINGS_KEY)).toBeNull();
    expect(modal.querySelector<HTMLSelectElement>('[data-testid="v2-provider"]')!.value).toBe('glm');
    const apiKeyAgain = modal.querySelector<HTMLInputElement>('[data-testid="v2-apikey"]')!;
    expect(apiKeyAgain.value).toBe('');

    apiKeyAgain.value = 'test-key-10';
    click(modal.querySelector('[data-testid="v2-settings-save"]')!);
    expect(loadV2Settings(storage).apiKey).toBe('test-key-10');
  });

  it('占位卡按钮点击：向消息流追加一条助手消息（右侧组件与左侧对话联动）', () => {
    const page = mount(makeStorage());
    cleanup = page.cleanup;

    const before = assistantBubbles(page.root).length;
    click(page.root.querySelector('[data-testid="v2-card-action"]')!);
    expect(assistantBubbles(page.root).length).toBe(before + 1);
    expect(assistantBubbles(page.root).at(-1)!.textContent).toContain('占位卡');
  });

  it('路由共存：/v2 渲染对话壳，/ 仍渲染 v1 首页', () => {
    const storage = makeStorage();
    const root = document.createElement('div');
    document.body.append(root);
    const destroy = createRouter(root, [
      { path: '/', render: renderHome },
      { path: '/v2', render: (el) => renderChat(el, { storage }) },
    ]).destroy;
    cleanup = () => { destroy(); root.remove(); };

    navigate('/v2');
    expect(root.querySelector('[data-testid="v2-messages"]')).toBeTruthy();

    navigate('/');
    expect(root.querySelector('.module-grid')).toBeTruthy();
    expect(root.querySelector('[data-testid="v2-messages"]')).toBeFalsy();
  });
});
