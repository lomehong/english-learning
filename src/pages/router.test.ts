import { describe, it, expect, afterEach } from 'vitest';
import { createRouter, navigate, type Route } from '../router';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';

const routes: Route[] = [
  { path: '/', render: renderHome },
  { path: '/vocabulary', render: renderVocabulary },
  { path: '/grammar', render: renderGrammar },
  { path: '/reading', render: renderReading },
  { path: '/listening', render: renderListening },
];

describe('路由接线', () => {
  let root: HTMLElement | null = null;
  let cleanup: (() => void) | null = null;

  afterEach(() => {
    cleanup?.();
    root?.remove();
    history.pushState(null, '', '/');
  });

  it('/ 渲染首页（模块入口含词汇 / 语法 / 阅读）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;
    expect(root.querySelector('.module-grid')).toBeTruthy();
    expect(root.querySelector('a.module-card[href="/vocabulary"]')).toBeTruthy();
    const grammarCard = root.querySelector('a.module-card[href="/grammar"]');
    expect(grammarCard).toBeTruthy();
    expect(grammarCard!.classList.contains('module-card--disabled')).toBe(false);
    const readingCard = root.querySelector('a.module-card[href="/reading"]');
    expect(readingCard).toBeTruthy();
    expect(readingCard!.classList.contains('module-card--disabled')).toBe(false);
    const listeningCard = root.querySelector('a.module-card[href="/listening"]');
    expect(listeningCard).toBeTruthy();
    expect(listeningCard!.classList.contains('module-card--disabled')).toBe(false);
  });

  it('/reading 渲染阅读页（2 篇短文 + 6 题 + 可点击生词）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;

    navigate('/reading');
    expect(root.textContent).toContain('阅读 · 必修一 Unit 1');
    expect(root.querySelectorAll('.reading-passage')).toHaveLength(2);
    expect(root.querySelectorAll('.exercise--reading')).toHaveLength(6);
    expect(root.querySelector('.reading-word')).toBeTruthy();
  });

  it('/grammar 渲染语法页（讲解卡 + 10 题练习 + 错题本）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;

    navigate('/grammar');
    expect(root.textContent).toContain('语法 · 必修一 Unit 1');
    expect(root.querySelectorAll('.grammar-card')).toHaveLength(2);
    expect(root.querySelectorAll('.exercise')).toHaveLength(10);
    expect(root.querySelector('[data-testid="wrongbook"]')).toBeTruthy();
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

  it('/listening 渲染听力页（2 段材料 + 播放器 + 6 题），离开时清理', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;

    navigate('/listening');
    expect(root.textContent).toContain('听力 · 必修一 Unit 1');
    expect(root.querySelectorAll('.listening-passage')).toHaveLength(2);
    expect(root.querySelectorAll('.exercise--listening')).toHaveLength(6);
    expect(root.querySelector('[data-testid="listen-play-l1"]')).toBeTruthy();

    navigate('/'); // 离开听力页 → 触发路由清理（销毁朗读引擎）
    expect(root.textContent).toContain('高一英语学习系统');
    expect(root.querySelector('[data-testid="listen-play-l1"]')).toBeNull();
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
