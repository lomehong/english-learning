# english-learning

高一英语学习系统（人教2019）· 由 supper-agent 开发维护

<<<<<<< HEAD
## 目标

面向 **高一英语（人教版 2019 教材）** 的学习系统：围绕词汇、语法、阅读、听力与错题复盘，沉淀可追踪的学习报告。当前仓库为前端路由壳（七个空页面），不含业务逻辑，功能按票逐张迭代。

## 技术栈

- Vite + React + TypeScript（strict 模式）
- react-router-dom 路由壳：首页 / 词汇 / 语法 / 阅读 / 听力 / 错题本 / 学习报告
- 统一设计令牌见 `src/styles.css`：深色玻璃拟态 · 主色 `#4f8cff` · 暖色 `#ff9f1c`

## 启动命令

```bash
npm install          # 安装依赖（npm 缓存已由 .npmrc 固定到工作区 .npm-cache/）
npm run dev          # 本地开发服务器
npm run build        # 类型检查 + 生产构建（产物在 dist/）
npm run preview      # 预览生产构建
```

## License

本项目基于 [MIT License](./LICENSE) 开源，版权所有 Copyright (c) 2026 lomehong。
=======
## 功能

- **词汇模块**（`/vocabulary`）
  - 内置人教2019必修一 Unit 1（Teenage Life）词表：20 词，含音标 / 词性 / 中文释义 / 例句（`src/data/unit1-words.json`）
  - 学习页：翻面卡片浏览词表，一键「标记已学」加入复习计划
  - 复习页：到期队列 + 简化 SM-2 四档评分（重来 / 困难 / 良好 / 简单，更新 ease / interval / due）
  - 进度持久化在浏览器 localStorage（键 `english-learning.progress.v1`）
- **统一设计令牌**：`src/styles/tokens.css` 为唯一样式变量来源，组件样式只引用 `var(--*)`

## 开发

```bash
npm install
npm run dev      # 本地开发服务器
npm test         # 单元测试（vitest，31 例）
npm run build    # 生产构建（tsc 类型检查 + vite build）
npm run preview  # 预览构建产物
```
>>>>>>> c2ccdf5 (sa(ticket-6-1794887919813735): 实现词汇模块（词表/SRS/学习与复习页）)
