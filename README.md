# english-learning

高一英语学习系统（人教2019）· 由 supper-agent 开发维护

## 功能

覆盖 **必修一 Unit 1（Teenage Life）/ Unit 2（Travelling Around）/ Unit 3（Sports and Fitness）/ Unit 4（Natural Disasters）/ Unit 5（Languages Around the World）** 五个单元，单元维度由**数据驱动注册表**（`src/data/units.ts` 的 `UNIT_MANIFESTS`）统一管理，并按**册别维度**（`book` 字段：必修一 / 必修二 / 必修三 / 选择性必修一 ~ 四，共 7 册）分组聚合（`UNITS_BY_BOOK`）；词汇 / 语法 / 阅读 / 听力 / 写作各模块按「当前册 + 当前全局单元」取数。首页提供**两级切换器**：第一级选册（7 册），第二级选该册单元（选择存 localStorage 键 `english-learning.book.v1` / `english-learning.unit.v1`，并与 URL `?book=&unit=` 双向同步，非法与缺省回退必修一 Unit 1；尚未收录单元的册显示空态、模块沿用最近单元）。**新增单元 = 新建一套 `unit{n}-*` 数据文件（meta 的 `book` 写目标册名即可归册，缺省归必修一）**，无需改动任何页面代码。

- **词汇模块**（`/vocabulary`）
  - 内置人教2019必修一词表：Unit 1 / Unit 2 / Unit 3 各 20 词，含音标 / 词性 / 中文释义 / 例句（`src/data/unit{n}-words.json`）
  - 跟随全局单元（首页切换或 `?unit=unit2&tab=review` 深链），与学习 / 复习双 Tab 共存
  - 学习页：翻面卡片浏览词表，一键「标记已学」加入复习计划
  - 复习页：到期队列 + 简化 SM-2 四档评分（重来 / 困难 / 良好 / 简单，更新 ease / interval / due）
  - 进度持久化在浏览器 localStorage（键 `english-learning.progress.v1`，全部单元共享一份词汇本）
- **语法模块**（`/grammar`）
  - Unit 1：一般现在时 / 现在进行时；Unit 2：现在完成时 / 过去进行时；Unit 3：一般过去时 / 一般将来时（构成 / 用法要点 / 时间标志词 / 例句 / 易错点，`src/data/unit{n}-grammar.ts`）
  - 每单元专项练习 10 题（6 单选 + 4 填空），逐题中文解析；答题即时判分并展示解析
  - 错题自动进入错题本，持久化在浏览器 localStorage（键 `english-learning.wrongbook.v1`），支持查看与清空
- **阅读模块**（`/reading`）
  - 每单元内置 2 篇主题自编短文（约 120 词/篇，避免版权，`src/data/unit{n}-reading.ts`）
  - 每篇 3 道阅读理解单选题（细节理解 / 主旨大意 / 推理判断 / 写作意图），逐题中文解析；答题即时判分并展示解析
  - 短文生词虚线标注，点击即加入词汇本（与词汇模块共享 localStorage 键 `english-learning.progress.v1`，进入 SM-2 复习队列），再次点击取消
- **听力模块**（`/listening`）
  - 每单元内置 2 段主题自编听力材料（独白 + 对话，`src/data/unit{n}-listening.ts`），由浏览器 speechSynthesis 本地朗读，不依赖外部音频/TTS 服务
  - 播放器支持播放 / 暂停 / 继续 / 停止与三档语速（0.8 慢速 / 1.0 常速 / 1.2 快速）；听力原文默认折叠，听后可展开对照；路由离开自动停止朗读
  - 每段 3 道听力理解单选题（细节理解 / 推理判断），逐题中文解析；答题即时判分，错题自动入本、作答计入统计
- **写作模块**（`/writing`）
  - 每单元内置 2 个主题写作任务（Unit 1：邀请信 + 栏目投稿；Unit 2：旅行计划邮件 + 游记投稿；Unit 3：演讲稿 + 校刊投稿，`src/data/unit{n}-writing.ts`），各配中文情境、内容要点、参考范文与 5 条自评清单
  - 编辑器边写边存：草稿自动保存到 localStorage（键 `english-learning.writing.v1`），实时词数对照要求；参考范文折叠，先独立完成再对照修改
- **错题本**（`/mistakes`）
  - 汇总词汇（复习评「重来」）/ 语法 / 阅读 / 听力四模块写入 localStorage 的错题（键 `english-learning.wrongbook.v1`，按题目 id 去重，重复答错累加次数）
  - 按模块过滤（全部 / 词汇 / 语法 / 阅读 / 听力，`?module=` 可深链）、逐条移除、一键清空
  - 每条错题可「去重练」跳回对应模块（词汇跳转到期复习队列）；词汇重练后评非「重来」即自动出本
- **学习报告**（`/report`）
  - 各模块练习次数 / 正确率 / 错题数 + 词汇 SM-2 到期数（练习统计键 `english-learning.stats.v1`，随语法 / 阅读 / 词汇复习每次作答自动累积）
  - **按册 + 单元统计维度**：七册固定分组（含暂未收录单元的册的降级占位），每册汇总该册单元的练习次数 / 正确率 / 错题数与词表复习进度（作答按单元计入 `stats.units`；错题按 `u2-` / `u3-` 题号前缀与词汇归属单元归档）
  - **数据导出 / 导入**：一键导出 JSON 备份（词汇进度 / 错题本 / 写作草稿 / 练习统计四份数据）；导入时与本地数据**合并去重**（词汇卡取复习次数更多者、错题取次数最大且时间最近、草稿取更新时间较新者、统计取更完整一方，不覆盖不双算）
  - 图表全部为纯 CSS（模块/单元正确率条）+ 内联 SVG（总体正确率环），零第三方图表库
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

路由为 SPA：`/vocabulary` `/grammar` `/reading` `/listening` `/writing` `/mistakes` `/report` 均可深链直达（dev / preview 服务器带 SPA fallback 回退 index.html）。册 + 单元维度为**全局状态**：首页两级切换器写入 localStorage 并同步 `?book=&unit=`（如 `/grammar?unit=unit3`、`/?book=必修二`，册参数亦可用 slug 写法 `required-1` ~ `elective-4`，单元参数支持 `unit3` 或数字写法 `3`）；带参深链优先并被记住（`?unit=` 与 `?book=` 冲突时以单元为准、册随单元归属），之后无参地址沿用最近选择，非法值回退必修一 Unit 1，空册沿用最近有效单元不崩溃。

## License

本项目基于 [MIT License](./LICENSE) 开源，版权所有 Copyright (c) 2026 lomehong。
