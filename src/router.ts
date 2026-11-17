/**
 * 极简 History 路由：路径精确匹配 + <a data-link> 拦截免刷新跳转。
 * pushState 不可用（如 file:// 直开）时降级为整页跳转。
 */

export interface Route {
  path: string;
  /** 渲染页面；可返回清理函数，路由离开 / 重复渲染前由 router 调用（如停止朗读） */
  render: (root: HTMLElement) => void | (() => void);
}

function normalizePath(pathname: string): string {
  if (pathname !== '/' && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export function navigate(path: string): void {
  if (normalizePath(location.pathname) === path) return;
  try {
    history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  } catch {
    // file:// 等环境 pushState 抛异常 → 整页跳转兜底
    location.href = path;
  }
}

export function createRouter(root: HTMLElement, routes: Route[]): { destroy: () => void } {
  let currentCleanup: (() => void) | null = null;

  function render(): void {
    const path = normalizePath(location.pathname);
    const route = routes.find((r) => r.path === path);
    currentCleanup?.();
    currentCleanup = null;
    root.innerHTML = '';
    if (route) {
      currentCleanup = route.render(root) ?? null;
    } else {
      root.innerHTML = `
        <main class="page">
          <div class="empty-state">
            <h1 class="empty-state__title">页面不存在</h1>
            <p class="empty-state__desc">路径 ${path} 没有对应的内容。</p>
            <a class="btn btn--primary" href="/" data-link>返回首页</a>
          </div>
        </main>`;
    }
  }

  function onPopState(): void {
    render();
  }

  // 拦截带 data-link 的 <a>，做 SPA 内部跳转
  function onClick(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    const target = (event.target as HTMLElement | null)?.closest?.('a[data-link]');
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href) return;
    event.preventDefault();
    navigate(href);
  }

  window.addEventListener('popstate', onPopState);
  root.addEventListener('click', onClick);
  render();

  return {
    destroy: () => {
      window.removeEventListener('popstate', onPopState);
      root.removeEventListener('click', onClick);
      currentCleanup?.();
    },
  };
}
