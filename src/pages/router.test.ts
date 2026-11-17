import { describe, it, expect, afterEach } from 'vitest';
import { createRouter, navigate, type Route } from '../router';
import { renderHome } from './home';
import { renderVocabulary } from './vocabulary';
import { renderGrammar } from './grammar';
import { renderReading } from './reading';
import { renderListening } from './listening';
import { renderWriting } from './writing';
import { renderMistakes } from './mistakes';
import { renderReport } from './report';
import { resetUnitState } from './unit-switch';
import { unitIdsOfBook } from '../data/units';

const routes: Route[] = [
  { path: '/', render: renderHome },
  { path: '/vocabulary', render: renderVocabulary },
  { path: '/grammar', render: renderGrammar },
  { path: '/reading', render: renderReading },
  { path: '/listening', render: renderListening },
  { path: '/writing', render: renderWriting },
  { path: '/mistakes', render: renderMistakes },
  { path: '/report', render: renderReport },
];

describe('路由接线', () => {
  let root: HTMLElement | null = null;
  let cleanup: (() => void) | null = null;

  afterEach(() => {
    cleanup?.();
    root?.remove();
    resetUnitState(); // 各用例独立：清掉全局单元的内存态与存储
    history.pushState(null, '', '/');
  });

  it('/ 渲染首页（七大模块入口与导航全部接线，无「建设中」占位；含全局单元切换器）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;
    expect(root.querySelector('.module-grid')).toBeTruthy();
    expect(root.querySelector('[data-testid="unit-switcher"]')).toBeTruthy();
    expect(root.querySelectorAll('[data-testid="unit-switcher"] button')).toHaveLength(
      unitIdsOfBook('required-1').length,
    );
    const hrefs = ['/vocabulary', '/grammar', '/reading', '/listening', '/writing', '/mistakes', '/report'];
    for (const href of hrefs) {
      const card = root.querySelector(`a.module-card[href="${href}"]`);
      expect(card, `首页卡片 ${href}`).toBeTruthy();
      expect(card!.classList.contains('module-card--disabled')).toBe(false);
      expect(root.querySelector(`nav a[href="${href}"]`), `顶部导航 ${href}`).toBeTruthy();
    }
    expect(root.textContent).not.toContain('建设中');
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

  it('/listening 渲染听力页（2 段材料 + 播放器 + 6 题 + 原文折叠）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;

    navigate('/listening');
    expect(root.textContent).toContain('听力 · 必修一 Unit 1');
    expect(root.querySelectorAll('.listening-material')).toHaveLength(2);
    expect(root.querySelectorAll('.exercise--listening')).toHaveLength(6);
    expect(root.querySelector('[data-testid="play-l1"]')).toBeTruthy();
    expect(root.querySelector<HTMLElement>('[data-testid="script-l1"]')!.hidden).toBe(true);
  });

  it('/writing 渲染写作页（2 个任务 + 编辑器 + 自评清单 + 范文）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;

    navigate('/writing');
    expect(root.textContent).toContain('写作 · 必修一 Unit 1');
    expect(root.querySelectorAll('.writing-task')).toHaveLength(2);
    expect(root.querySelector('[data-testid="draft-editor-w1"]')).toBeTruthy();
    expect(root.querySelectorAll('.writing-checklist__item')).toHaveLength(10);
    expect(root.querySelector('details.writing-model')).toBeTruthy();
  });

  it('路由离开时调用页面返回的清理函数（如停止听力朗读）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    const cleanups: string[] = [];
    cleanup = createRouter(root, [
      ...routes,
      {
        path: '/with-cleanup',
        render: (mount) => {
          mount.textContent = 'with-cleanup';
          return () => {
            cleanups.push('destroyed');
          };
        },
      },
    ]).destroy;

    navigate('/with-cleanup');
    expect(root.textContent).toContain('with-cleanup');
    navigate('/');
    expect(cleanups).toEqual(['destroyed']);
    expect(root.textContent).not.toContain('with-cleanup');
  });

  it('未知路径渲染 404 兜底', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;
    navigate('/nope');
    expect(root.textContent).toContain('页面不存在');
  });

  it('/mistakes 渲染错题本页（模块过滤 Tab + 空状态）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;

    navigate('/mistakes');
    expect(root.textContent).toContain('错题本');
    const filter = root.querySelector('[data-testid="mistake-filter"]')!;
    expect(filter.querySelectorAll('button[data-module]')).toHaveLength(5);
    expect(root.querySelector('[data-testid="mistake-empty"]')!.textContent).toContain('暂无错题');
  });

  it('/report 渲染学习报告页（总览卡 + 模块概览 + 学习建议）', () => {
    history.pushState(null, '', '/');
    root = document.createElement('div');
    document.body.append(root);
    cleanup = createRouter(root, routes).destroy;

    navigate('/report');
    expect(root.textContent).toContain('学习报告');
    expect(root.querySelector('[data-testid="stat-answered"]')).toBeTruthy();
    expect(root.querySelectorAll('[data-testid="module-row"]')).toHaveLength(4);
    expect(root.querySelector('[data-testid="report-advice"]')!.querySelectorAll('li').length).toBeGreaterThanOrEqual(1);
  });
});
