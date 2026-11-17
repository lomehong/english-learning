export function renderHome(root: HTMLElement): void {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <span class="site-header__brand">高一英语学习系统</span>
      <nav class="site-header__nav">
        <a class="btn btn--ghost" href="/vocabulary" data-link>词汇</a>
        <a class="btn btn--ghost" href="/grammar" data-link>语法</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';
  page.innerHTML = `
    <h1 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);margin:var(--space-5) 0 var(--space-2);">
      高一英语学习系统 · 人教2019
    </h1>
    <p style="color:var(--color-text-secondary);margin:0 0 var(--space-4);">
      课本同步词汇（SM-2 间隔复习）与语法专项练习，进度保存在本机浏览器。
    </p>
    <div class="module-grid">
      <a class="module-card" href="/vocabulary" data-link>
        <h2 class="module-card__title">📚 词汇</h2>
        <p class="module-card__desc">必修一 Unit 1 词表学习（翻面卡）与四档间隔复习</p>
      </a>
      <a class="module-card" href="/grammar" data-link>
        <h2 class="module-card__title">📖 语法</h2>
        <p class="module-card__desc">必修一 Unit 1：一般现在时 / 现在进行时讲解与专项练习</p>
      </a>
      <div class="module-card module-card--disabled">
        <h2 class="module-card__title">🎧 听力</h2>
        <p class="module-card__desc">建设中，敬请期待</p>
      </div>
      <div class="module-card module-card--disabled">
        <h2 class="module-card__title">✍️ 写作</h2>
        <p class="module-card__desc">建设中，敬请期待</p>
      </div>
    </div>`;

  // 模块入口统一由 router 的 <a data-link> 拦截跳转
  root.append(header, page);
}
