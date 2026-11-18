# gaokao-english

高中英语学习系统（人教2019）· 由 supper-agent 开发维护

覆盖**整个高中阶段**（高一 ~ 高三）：**人教2019 必修一 ~ 必修三 + 选择性必修一 ~ 四共 7 册 35 单元**（每册 5 单元，全部收录词表 / 语法 / 阅读 / 听力 / 写作五模块数据）。单元维度由**数据驱动注册表**（`src/data/units.ts` 的 `UNIT_MANIFESTS`）统一管理，并按**册别维度**（`book` 字段：必修一 / 必修二 / 必修三 / 选择性必修一 ~ 四，共 7 册）分组聚合（`UNITS_BY_BOOK`）；词汇 / 语法 / 阅读 / 听力 / 写作各模块按「当前册 + 当前全局单元」取数。首页提供**两级切换器**：第一级选册（7 册），第二级选该册单元（选择存 localStorage 键 `english-learning.book.v1` / `english-learning.unit.v1`，并与 URL `?book=&unit=` 双向同步，非法与缺省回退必修一 Unit 1；尚未收录单元的册显示空态、模块沿用最近单元）。**新增单元 = 新建一套 `unit{n}-*` 数据文件（meta 的 `book` 写目标册名即可归册，缺省归必修一）**，无需改动任何页面代码；单元文件名编号 `unit{n}` 为**全局唯一 id**（新增册请顺延编号，如 `unit36+`），内部条目 id 统一带 `u{n}-` 前缀避免跨册冲突。

## 功能

- **词汇模块**（`/vocabulary`）
  - 内置人教2019全七册词表（每单元 20 词，含音标 / 词性 / 中文释义 / 例句，`src/data/unit{n}-words.json`）
  - 跟随全局单元（首页切换或 `?unit=unit2&tab=review` 深链），与学习 / 复习双 Tab 共存
  - 学习页：翻面卡片浏览词表，一键「标记已学」加入复习计划
  - 学习页单元内搜索：按**英文拼写或中文释义**实时过滤当前单元词表并显示匹配数，点击结果或按回车跳到该词卡片，支持一键清空与 `?q=` 深链（如 `/vocabulary?unit=unit2&q=apply`）；过滤逻辑为纯函数（`src/pages/vocab-search.ts`）
  - 复习页：到期队列 + 简化 SM-2 四档评分（重来 / 困难 / 良好 / 简单，更新 ease / interval / due）
  - 单词卡朗读：学习页与复习页的卡片正面「🔊 朗读单词」、背面「🔊 朗读例句」，复用浏览器 speechSynthesis 本地朗读（与听力模块同一引擎 `src/speech/tts.ts`），朗读中再次点击停止、切换词 / 翻页 / 评分自动停止上一段；浏览器不支持 Web Speech API 时自动隐藏按钮、不报错
  - 进度持久化在浏览器 localStorage（键 `english-learning.progress.v1`，全部单元共享一份词汇本）
- **语法模块**（`/grammar`）
  - 每单元 2 个语法点（各单元按教材语法板块编排，如必修二被动语态系列、选必三虚拟语气等；构成 / 用法要点 / 时间标志词 / 例句 / 易错点，`src/data/unit{n}-grammar.ts`）
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
  - 每单元内置 2 个主题写作任务（邀请信 / 投稿 / 演讲稿 / 建议信等体裁随单元主题编排，`src/data/unit{n}-writing.ts`），各配中文情境、内容要点、参考范文与 5 条自评清单
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
- **三档主题**（全站右下角切换入口）
  - 浅色 / 深色 / 跟随系统三档，选择持久化在 localStorage（键 `english-learning.theme.v1`），默认跟随系统
  - 主题域逻辑为纯函数（`src/theme/theme.ts`，含持久化接缝与单测），DOM 应用与切换入口在 `src/theme/switcher.ts`（挂 body 级，路由重渲染不丢失）；`index.html` 内联脚本在首帧前应用持久化主题，深色用户直链打开不闪白
  - 深色主题经 `[data-theme='dark']` 覆盖语义令牌实现（`tokens.css`），正文 / 前景对比度按 WCAG AA 校准；`color-scheme` 同步声明，原生控件与滚动条跟随
- **统一设计令牌**：`src/styles/tokens.css` 为唯一样式变量来源（含四模块色与图表色），组件样式只引用 `var(--*)`

## 开发

包名 `gaokao-english`（见 `package.json`）。启动步骤：

```bash
npm install
npm run dev      # 本地开发服务器
npm test         # 单元测试（vitest）
npm run build    # 生产构建（tsc 类型检查 + vite build）
npm run preview  # 预览构建产物
```

路由为 SPA：`/vocabulary` `/grammar` `/reading` `/listening` `/writing` `/mistakes` `/report` 均可深链直达（dev / preview 服务器带 SPA fallback 回退 index.html）。**站点按域名根路径部署**：构建 `base` 固定为 `/`（产物引用 `/assets/*` 根绝对路径），因此 `/vocabulary/?unit=unit1`、`/grammar/` 等深链直接打开也能正确加载脚本与样式；若改回相对 `base: './'`，深链会去请求 `/vocabulary/assets/*` 而 404 白屏（`npm run build` 收尾的 `scripts/check-dist.mjs` 与 `src/deploy-base.test.ts` 会拦住该回归）。册 + 单元维度为**全局状态**：首页两级切换器写入 localStorage 并同步 `?book=&unit=`（如 `/grammar?unit=unit3`、`/?book=必修二`，册参数亦可用 slug 写法 `required-1` ~ `elective-4`，单元参数支持 `unit3` 全拼或数字写法 `3`——数字写法为单册时代遗留兼容，跨册同号时**固定解析为默认册（必修一）的对应单元**）；带参深链优先并被记住（`?unit=` 与 `?book=` 冲突时以单元为准、册随单元归属），之后无参地址沿用最近选择，非法值回退必修一 Unit 1，空册沿用最近有效单元不崩溃。

**并行开发测试约定**：共享的 `src/data/units.test.ts` 只保留数据无关的注册表不变式（合成数据 + 全量循环断言），不随册别 / 单元数量变化；**各册 / 单元的专属测试写独立文件 `units-bookN.test.ts`**（必修一 ~ 选必四 = book1 ~ book7，另有 `coverage.test.ts` 固化 7 册 35 单元最终态），新增册别不再修改共享测试文件，避免各册 PR 并行开发时冲突。

## License

本项目基于 [MIT License](./LICENSE) 开源，版权所有 Copyright (c) 2026 lomehong。
