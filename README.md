# english-learning

高一英语学习系统（人教2019）· 由 supper-agent 开发维护

## 功能

- **词汇模块**（`/vocabulary`）
  - 内置人教2019必修一 Unit 1（Teenage Life）词表：20 词，含音标 / 词性 / 中文释义 / 例句（`src/data/unit1-words.json`）
  - 学习页：翻面卡片浏览词表，一键「标记已学」加入复习计划
  - 复习页：到期队列 + 简化 SM-2 四档评分（重来 / 困难 / 良好 / 简单，更新 ease / interval / due）
  - 进度持久化在浏览器 localStorage（键 `english-learning.progress.v1`）
- **语法模块**（`/grammar`）
  - 内置人教2019必修一 Unit 1 语法点讲解卡：一般现在时 / 现在进行时（构成 / 用法要点 / 时间标志词 / 例句 / 易错点，`src/data/unit1-grammar.ts`）
  - 专项练习 10 题（6 单选 + 4 填空），逐题中文解析；答题即时判分并展示解析
  - 错题自动进入错题本，持久化在浏览器 localStorage（键 `english-learning.wrongbook.v1`），支持查看与清空
- **统一设计令牌**：`src/styles/tokens.css` 为唯一样式变量来源，组件样式只引用 `var(--*)`

## 开发

```bash
npm install
npm run dev      # 本地开发服务器
npm test         # 单元测试（vitest，63 例）
npm run build    # 生产构建（tsc 类型检查 + vite build）
npm run preview  # 预览构建产物
```

## License

本项目基于 [MIT License](./LICENSE) 开源，版权所有 Copyright (c) 2026 lomehong。
