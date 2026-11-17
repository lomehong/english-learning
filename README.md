# english-learning

高一英语学习系统（人教2019）· 由 supper-agent 开发维护

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
