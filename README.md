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
  - 内置 2 段「Teenage Life」主题自编听力材料（独白 + 对话，`src/data/unit1-listening.ts`），由浏览器 speechSynthesis 本地朗读，不依赖外部音频/TTS 服务
  - 播放器支持播放 / 暂停 / 继续 / 停止与三档语速（0.8 慢速 / 1.0 常速 / 1.2 快速）；听力原文默认折叠，听后可展开对照；路由离开自动停止朗读
  - 每段 3 道听力理解单选题（细节理解 / 推理判断），逐题中文解析；答题即时判分，错题自动入本、作答计入统计
- **写作模块**（`/writing`）
  - 内置 2 个「Teenage Life」主题写作任务（邀请信 + 栏目投稿，`src/data/unit1-writing.ts`），各配中文情境、内容要点、参考范文与 5 条自评清单
  - 编辑器边写边存：草稿自动保存到 localStorage（键 `english-learning.writing.v1`），实时词数对照要求；参考范文折叠，先独立完成再对照修改
- **错题本**（`/mistakes`）
  - 汇总词汇（复习评「重来」）/ 语法 / 阅读 / 听力四模块写入 localStorage 的错题（键 `english-learning.wrongbook.v1`，按题目 id 去重，重复答错累加次数）
  - 按模块过滤（全部 / 词汇 / 语法 / 阅读 / 听力，`?module=` 可深链）、逐条移除、一键清空
  - 每条错题可「去重练」跳回对应模块（词汇跳转到期复习队列）；词汇重练后评非「重来」即自动出本
- **学习报告**（`/report`）
  - 各模块练习次数 / 正确率 / 错题数 + 词汇 SM-2 到期数（练习统计键 `english-learning.stats.v1`，随语法 / 阅读 / 词汇复习每次作答自动累积）
  - 图表全部为纯 CSS（模块正确率条）+ 内联 SVG（总体正确率环），零第三方图表库
  - 依据数据生成学习建议：到期提醒、短板模块、错题消化、模块均衡与正向反馈
- **统一设计令牌**：`src/styles/tokens.css` 为唯一样式变量来源（含四模块色与图表色），组件样式只引用 `var(--*)`

## 开发

```bash
npm install
npm run dev      # 本地开发服务器
npm test         # 单元测试（vitest）
npm run build    # 生产构建（tsc 类型检查 + vite build）
npm run preview  # 预览构建产物
```

路由为 SPA：`/vocabulary` `/grammar` `/reading` `/listening` `/writing` `/mistakes` `/report` 均可深链直达（dev / preview 服务器带 SPA fallback 回退 index.html）。

## License

本项目基于 [MIT License](./LICENSE) 开源，版权所有 Copyright (c) 2026 lomehong。
