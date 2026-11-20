/**
 * /v2 右侧动态组件渲染区：组件注册表 + 内置占位卡。
 * 后续票在 renderPanelComponent 注册新组件（词汇卡 / 语法卡 / 阅读卡…），
 * 对话流即可按 id 挂载到面板；本票只内置 placeholder-card 占位卡。
 */

/** 面板组件上下文：组件内动作回报到左侧对话流 */
export interface PanelContext {
  onCardAction(text: string): void;
}

/** 当前已注册的动态组件 id */
export type PanelComponentId = 'placeholder-card';

/** 占位卡动作回报文案（点击卡片按钮时追加到消息流） */
const CARD_ACTION_TEXT = '占位卡「开始学习」按钮已触发：按对话动态渲染的真实学习组件将在后续版本接入。';

/** 占位卡：标题 + 正文 + 按钮（本票内置的唯一动态组件） */
export function createPlaceholderCard(ctx: PanelContext): HTMLElement {
  const el = document.createElement('article');
  el.className = 'v2-card';
  el.setAttribute('data-testid', 'v2-card');
  el.innerHTML = `
    <h3 class="v2-card__title" data-testid="v2-card-title">示例学习卡</h3>
    <p class="v2-card__body" data-testid="v2-card-body">
      这里是右侧动态组件渲染区：随对话内容渲染词汇卡、语法卡等学习组件。当前展示的是占位卡，用于验证布局与联动。
    </p>
    <button type="button" class="btn btn--primary btn--sm v2-card__action" data-testid="v2-card-action">
      开始学习
    </button>`;

  el.querySelector('[data-testid="v2-card-action"]')!.addEventListener('click', () => {
    ctx.onCardAction(CARD_ACTION_TEXT);
  });
  return el;
}

/** 按 id 渲染动态组件到面板容器（未知 id 静默不渲染，不抛出） */
export function renderPanelComponent(
  container: HTMLElement,
  id: PanelComponentId,
  ctx: PanelContext,
): void {
  switch (id) {
    case 'placeholder-card':
      container.append(createPlaceholderCard(ctx));
      break;
  }
}
