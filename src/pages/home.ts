export function renderHome(root: HTMLElement): void {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="site-header__inner">
      <span class="site-header__brand">高一英语学习系统</span>
      <nav class="site-header__nav">
        <a class="btn btn--ghost" href="/vocabulary" data-link>词汇</a>
        <a class="btn btn--ghost" href="/grammar" data-link>语法</a>
        <a class="btn btn--ghost" href="/reading" data-link>阅读</a>
        <a class="btn btn--ghost" href="/listening" data-link>听力</a>
        <a class="btn btn--ghost" href="/writing" data-link>写作</a>
        <a class="btn btn--ghost" href="/mistakes" data-link>错题本</a>
        <a class="btn btn--ghost" href="/report" data-link>学习报告</a>
      </nav>
    </div>`;

  const page = document.createElement('main');
  page.className = 'page';
  page.innerHTML = `
    <h1 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);margin:var(--space-5) 0 var(--space-2);">
      高一英语学习系统 · 人教2019
    </h1>
    <p style="color:var(--color-text-secondary);margin:0 0 var(--space-4);">
      词汇 / 语法 / 阅读 / 听力 / 写作五大模块专项练习，错题自动沉淀、报告随时可查，进度保存在本机浏览器。
    </p>
    <div class="module-grid">
      <a class="module-card" href="/vocabulary" data-link>
        <h2 class="module-card__title">📚 词汇</h2>
        <p class="module-card__desc">Unit 1 / Unit 2 词表学习（翻面卡）与四档间隔复习</p>
      </a>
      <a class="module-card" href="/grammar" data-link>
        <h2 class="module-card__title">📖 语法</h2>
        <p class="module-card__desc">两单元四语法点：一般现在时 / 现在进行时 / 现在完成时 / 过去进行时</p>
      </a>
      <a class="module-card" href="/reading" data-link>
        <h2 class="module-card__title">📄 阅读</h2>
        <p class="module-card__desc">Unit 1 / Unit 2 主题短文各 ×2：阅读理解即时判分，生词一点收进词汇本</p>
      </a>
      <a class="module-card" href="/listening" data-link>
        <h2 class="module-card__title">🎧 听力</h2>
        <p class="module-card__desc">Unit 1 / Unit 2 主题材料各 ×2：浏览器本地朗读，语速可调，答题即时判分</p>
      </a>
      <a class="module-card" href="/writing" data-link>
        <h2 class="module-card__title">✍️ 写作</h2>
        <p class="module-card__desc">Unit 1 / Unit 2 主题写作各 ×2：范文对照 + 自评清单，草稿自动保存</p>
      </a>
      <a class="module-card" href="/mistakes" data-link>
        <h2 class="module-card__title">📝 错题本</h2>
        <p class="module-card__desc">四模块错题汇总：按模块过滤、逐条移除、去重练</p>
      </a>
      <a class="module-card" href="/report" data-link>
        <h2 class="module-card__title">📊 学习报告</h2>
        <p class="module-card__desc">模块与按单元统计 / 错题 / 复习到期与学习建议，支持数据导出导入</p>
      </a>
    </div>`;

  // 模块入口统一由 router 的 <a data-link> 拦截跳转
  root.append(header, page);
}
