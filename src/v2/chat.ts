/**
 * /v2 对话式学习入口（第一票骨架）：左侧消息流（用户 / 助手气泡）+
 * 底部输入框与发送；右侧动态组件渲染区（内置占位卡）；右上设置弹窗
 * （提供商 / baseURL / API Key / 模型名，持久化 localStorage）。
 *
 * 安全红线：API Key 只经 settings 模块进 localStorage，本文件不打印
 * 日志、不将其写入任何仓库文件；回复文本只回显提供商与模型名。
 */

import {
  MODEL_PROVIDERS,
  clearV2Settings,
  defaultV2Settings,
  defaultV2Storage,
  hasApiKey,
  loadV2Settings,
  providerMeta,
  saveV2Settings,
  settingsStatusLabel,
  type V2Settings,
  type V2StorageLike,
} from './settings';
import { renderPanelComponent } from './panel';

/** 页面依赖接缝（默认走真实 localStorage；测试注入假实现） */
export interface ChatDeps {
  storage?: V2StorageLike;
}

/** 首屏欢迎消息（助手气泡） */
const WELCOME_TEXT =
  '你好！欢迎来到 v2 对话式学习入口（骨架版）。在下方输入你的问题，右侧组件区会随对话渲染学习内容。模型接入前，发送消息将收到本地占位回复。';

/** 未配置 API Key 时的本地占位回复 */
const PLACEHOLDER_REPLY =
  '这是本地占位回复：尚未配置模型 API Key，暂时无法请求真实模型。';

/** 占位回复附带的「去设置」提示 */
const PLACEHOLDER_HINT =
  '先到右上角「设置」（或点击下方按钮）配置 GLM / DeepSeek / OpenAI 兼容模型，保存后即可在重开页面时保留。';

export function renderChat(root: HTMLElement, deps: ChatDeps = {}): () => void {
  const storage = deps.storage ?? defaultV2Storage();

  root.innerHTML = `
    <div class="v2-page" data-testid="v2-root">
      <header class="v2-header">
        <div class="v2-header__inner">
          <a class="v2-header__back" href="/" data-link>返回首页</a>
          <div class="v2-header__brand">
            <span class="v2-header__name">对话式学习</span>
            <span class="v2-header__ver">v2</span>
          </div>
          <span class="v2-status" data-testid="v2-status"></span>
          <button type="button" class="btn btn--ghost btn--sm" data-testid="v2-settings-open">
            ⚙ 设置
          </button>
        </div>
      </header>
      <div class="v2-main">
        <section class="v2-chat" aria-label="对话消息流">
          <div class="v2-msgs" data-testid="v2-messages" aria-live="polite"></div>
          <form class="v2-composer" data-testid="v2-composer">
            <input
              class="v2-composer__input"
              data-testid="v2-input"
              type="text"
              autocomplete="off"
              placeholder="输入你的问题，回车或点击发送…"
              aria-label="消息输入框"
            />
            <button class="btn btn--primary v2-composer__send" data-testid="v2-send" type="submit">
              发送
            </button>
          </form>
        </section>
        <aside class="v2-panel" data-testid="v2-panel" aria-label="动态组件渲染区">
          <div class="v2-panel__head">
            <h2 class="v2-panel__title">组件渲染区</h2>
            <p class="v2-panel__desc">随对话动态渲染学习组件，当前为占位卡。</p>
          </div>
          <div class="v2-panel__body" data-testid="v2-panel-body"></div>
        </aside>
      </div>
      <div class="v2-modal" data-testid="v2-settings-modal" hidden>
        <div class="v2-modal__scrim" data-testid="v2-settings-scrim"></div>
        <div class="v2-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="v2-settings-title">
          <h2 class="v2-modal__title" id="v2-settings-title">模型设置</h2>
          <form class="v2-form" data-testid="v2-settings-form">
            <label class="v2-field">
              <span class="v2-field__label">模型提供商</span>
              <select class="v2-field__control" data-testid="v2-provider">
                ${MODEL_PROVIDERS.map(
                  (p) => `<option value="${p.id}">${p.label}</option>`,
                ).join('')}
              </select>
            </label>
            <label class="v2-field">
              <span class="v2-field__label">Base URL</span>
              <input class="v2-field__control" data-testid="v2-baseurl" type="text" autocomplete="off" />
            </label>
            <label class="v2-field">
              <span class="v2-field__label">API Key</span>
              <input
                class="v2-field__control"
                data-testid="v2-apikey"
                type="password"
                autocomplete="new-password"
                placeholder="仅保存在本机浏览器"
              />
            </label>
            <label class="v2-field">
              <span class="v2-field__label">模型名</span>
              <input class="v2-field__control" data-testid="v2-model" type="text" autocomplete="off" />
            </label>
            <p class="v2-form__note" data-testid="v2-settings-note">
              API Key 仅写入本机浏览器 localStorage，不会进入代码仓库或日志。
            </p>
            <p class="v2-form__cleared" data-testid="v2-settings-cleared" hidden>
              已清空并回到默认，可重新设置后保存。
            </p>
            <div class="v2-form__actions">
              <button type="button" class="btn btn--ghost btn--sm" data-testid="v2-settings-clear">
                清空
              </button>
              <span class="v2-form__spacer"></span>
              <button type="button" class="btn btn--ghost" data-testid="v2-settings-cancel">
                取消
              </button>
              <button type="submit" class="btn btn--primary" data-testid="v2-settings-save">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>`;

  const msgs = root.querySelector<HTMLElement>('[data-testid="v2-messages"]')!;
  const input = root.querySelector<HTMLInputElement>('[data-testid="v2-input"]')!;
  const composer = root.querySelector<HTMLFormElement>('[data-testid="v2-composer"]')!;
  const statusEl = root.querySelector<HTMLElement>('[data-testid="v2-status"]')!;
  const modal = root.querySelector<HTMLElement>('[data-testid="v2-settings-modal"]')!;
  const providerSelect = modal.querySelector<HTMLSelectElement>('[data-testid="v2-provider"]')!;
  const baseURLInput = modal.querySelector<HTMLInputElement>('[data-testid="v2-baseurl"]')!;
  const apiKeyInput = modal.querySelector<HTMLInputElement>('[data-testid="v2-apikey"]')!;
  const modelInput = modal.querySelector<HTMLInputElement>('[data-testid="v2-model"]')!;
  const clearedNote = modal.querySelector<HTMLElement>('[data-testid="v2-settings-cleared"]')!;
  const panelBody = root.querySelector<HTMLElement>('[data-testid="v2-panel-body"]')!;

  /** 追加一条消息气泡（role: user | assistant）；文本一律 textContent，不拼 HTML */
  function appendMessage(role: 'user' | 'assistant', text: string, hint = false): void {
    const msg = document.createElement('div');
    msg.className = `v2-msg v2-msg--${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'v2-msg__bubble';
    const body = document.createElement('p');
    body.className = 'v2-msg__text';
    body.textContent = text;
    bubble.append(body);

    if (hint) {
      const hintText = document.createElement('p');
      hintText.className = 'v2-msg__hint';
      hintText.textContent = PLACEHOLDER_HINT;
      const openBtn = document.createElement('button');
      openBtn.type = 'button';
      openBtn.className = 'btn btn--ghost btn--sm v2-msg__action';
      openBtn.setAttribute('data-testid', 'v2-hint-settings');
      openBtn.textContent = '打开设置';
      openBtn.addEventListener('click', () => openSettings());
      bubble.append(hintText, openBtn);
    }

    msg.append(bubble);
    msgs.append(msg);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function updateStatus(): void {
    statusEl.textContent = settingsStatusLabel(loadV2Settings(storage));
  }

  /** 表单回填：来源设置（打开弹窗 / 清空后重置共用） */
  function fillForm(settings: V2Settings): void {
    providerSelect.value = settings.provider;
    baseURLInput.value = settings.baseURL;
    apiKeyInput.value = settings.apiKey;
    modelInput.value = settings.model;
  }

  function openSettings(): void {
    fillForm(loadV2Settings(storage));
    clearedNote.hidden = true;
    modal.hidden = false;
    providerSelect.focus();
  }

  function closeSettings(): void {
    modal.hidden = true;
  }

  function onProviderChange(): void {
    // 切换提供商：baseURL / 模型名自动带到该提供商默认值（可继续手改）
    const meta = providerMeta(providerSelect.value as (typeof MODEL_PROVIDERS)[number]['id']);
    baseURLInput.value = meta.defaultBaseURL;
    modelInput.value = meta.defaultModel;
  }

  function onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendMessage('user', text);
    input.value = '';

    const settings = loadV2Settings(storage);
    if (hasApiKey(settings)) {
      appendMessage(
        'assistant',
        `已读取你的 ${providerMeta(settings.provider).label}（模型 ${settings.model}）配置。真实模型调用将在后续版本接入，本条为 v2 骨架的本地回复。`,
      );
    } else {
      appendMessage('assistant', PLACEHOLDER_REPLY, true);
    }
  }

  function onSettingsSave(event: SubmitEvent): void {
    event.preventDefault();
    saveV2Settings(
      {
        version: 1,
        provider: providerSelect.value as (typeof MODEL_PROVIDERS)[number]['id'],
        baseURL: baseURLInput.value,
        apiKey: apiKeyInput.value,
        model: modelInput.value,
      },
      storage,
    );
    updateStatus();
    closeSettings();
  }

  function onSettingsClear(): void {
    clearV2Settings(storage);
    fillForm(defaultV2Settings());
    clearedNote.hidden = false;
    updateStatus();
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !modal.hidden) closeSettings();
  }

  // ---- 接线 ----
  root.querySelector('[data-testid="v2-settings-open"]')!.addEventListener('click', openSettings);
  root.querySelector('[data-testid="v2-settings-cancel"]')!.addEventListener('click', closeSettings);
  root.querySelector('[data-testid="v2-settings-clear"]')!.addEventListener('click', onSettingsClear);
  modal
    .querySelector<HTMLFormElement>('[data-testid="v2-settings-form"]')!
    .addEventListener('submit', onSettingsSave);
  modal
    .querySelector('[data-testid="v2-settings-scrim"]')!
    .addEventListener('click', closeSettings);
  providerSelect.addEventListener('change', onProviderChange);
  composer.addEventListener('submit', onSubmit);
  window.addEventListener('keydown', onKeydown);

  // 右侧动态组件：先挂内置占位卡；按钮动作回报到左侧消息流
  renderPanelComponent(panelBody, 'placeholder-card', {
    onCardAction: (text) => appendMessage('assistant', text),
  });

  // 首屏：欢迎消息 + 状态徽标（读取已保存设置）
  appendMessage('assistant', WELCOME_TEXT);
  updateStatus();

  return () => {
    window.removeEventListener('keydown', onKeydown);
  };
}
