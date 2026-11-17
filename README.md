# english-learning

高一英语学习系统（人教2019）· 由 supper-agent 开发维护

## 目标

面向高一学生的英语学习系统，内容对齐**人教版 2019 高中英语教材**，规划以下模块：

- **首页**：学习中心总览
- **词汇**：教材单元词汇学习与复习
- **语法**：语法专题讲解与练习
- **阅读**：阅读理解训练
- **听力**：听力训练
- **错题本**：错题收录与回顾
- **学习报告**：学习进度与数据报告

## 技术栈

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [React Router](https://reactrouter.com/) 路由壳（七个空页面骨架，业务逻辑后续迭代）
- 统一设计令牌：`src/styles.css` —— 深色玻璃拟态（主色 `#4f8cff`，暖色 `#ff9f1c`）

## 启动命令

```bash
# 安装依赖（npm 缓存指向工作区内 .npm-cache）
npm install --cache .npm-cache

# 本地开发（默认 http://localhost:5173）
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览生产构建产物
npm run preview
```
