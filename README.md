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
- **阅读模块**（`/reading`）
  - 内置 2 篇「Teenage Life」主题自编短文（约 120 词/篇，避免版权，`src/data/unit1-reading.ts`）
  - 每篇 3 道阅读理解单选题（细节理解 / 主旨大意 / 写作意图），逐题中文解析；答题即时判分并展示解析
  - 短文生词虚线标注，点击即加入词汇本（与词汇模块共享 localStorage 键 `english-learning.progress.v1`，进入 SM-2 复习队列），再次点击取消
- **听力模块**（`/listening`）
  - 内置 2 段「Teenage Life」主题自编听力材料（独白 + 对话，约 80 词/段，`src/data/unit1-listening.ts`），由浏览器本地 speechSynthesis 朗读，不依赖外部 TTS 服务
  - 播放器支持播放 / 暂停 / 继续 / 重听，语速 0.6–1.4 档可调（朗读中调整会从本段开头以新语速重读）；浏览器不支持语音合成时给出提示，题目仍可作答
  - 每段 3 道听力理解单选题（细节理解 / 推理判断），逐题中文解析；答完该段全部题目后可查看 / 收起听力原文
- **统一设计令牌**：`src/styles/tokens.css` 为唯一样式变量来源，组件样式只引用 `var(--*)`

## 开发

```bash
npm install
npm run dev      # 本地开发服务器
npm test         # 单元测试（vitest，104 例）
npm run build    # 生产构建（tsc 类型检查 + vite build）
npm run preview  # 预览构建产物
```

## License

本项目基于 [MIT License](./LICENSE) 开源，版权所有 Copyright (c) 2026 lomehong。
