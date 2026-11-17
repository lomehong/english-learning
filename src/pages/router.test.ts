import { describe, it, expect, afterEach } from 'vitest';
import { createRouter, navigate, type Route } from '../router';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';

const routes: Route[] = [
  { path: '/', render: renderHome },
  { path: '/vocabulary', render: renderVocabulary },
];

describe('路由接线', () => {
  let root: HTMLElement | null = null;
  let cleanup: (() => void) | null = null;

  afterEach(() => {
    cleanup?.();
    root?.remove();
    history.pushState(null, '', '/');
  });

  it('/ 渲染首页（模块入口含词汇）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;
    expect(root.querySelector('.module-grid')).toBeTruthy();
    expect(root.querySelector('a.module-card[href="/vocabulary"]')).toBeTruthy();
  });

  it('/vocabulary 渲染词汇页，默认学习 Tab，可切复习 Tab', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;

    navigate('/vocabulary');
    expect(root.textContent).toContain('词汇 · 必修一 Unit 1');
    expect(root.textContent).toContain('标记已学');

    const reviewTab = [...root.querySelectorAll('button.tab')].find((b) =>
      b.textContent!.includes('复习'),
    ) as HTMLButtonElement | undefined;
    reviewTab!.click();
    expect(root.textContent).toContain('暂无到期单词');
    expect(new URLSearchParams(location.search).get('tab')).toBe('review');
  });

  it('未知路径渲染 404 兜底', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;
    navigate('/nope');
    expect(root.textContent).toContain('页面不存在');
  });
});
