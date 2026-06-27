# 项目章程：通用 TypeScript 到 CLI / MCP 教程

## 项目目标

设计一套从零开始的 TypeScript 自学教程。教程前期聚焦通用 TypeScript 本身：类型系统、函数、对象建模、联合类型、类型收窄、模块、数组处理、异步代码和测试。后期再把这些能力放进 Node.js、CLI 和 MCP 工具设计中。

本教程不把 Unreal Engine、GAS 或任何特定业务领域作为前期主线。课程案例应使用通用、可迁移的场景，让学习者先建立 TypeScript 语言直觉，再进入工程化和工具开发。

## 目标读者

读者画像：

- 会基本编程，可能有 JavaScript、C++、Python、C# 或其他语言背景
- 完全不会或几乎不会 TypeScript
- 希望先学清楚 TypeScript 本身，而不是直接绑定某个框架或业务领域
- 后期目标可能包括 Node.js 脚本、CLI 工具、MCP 工具、类型安全的数据处理程序
- 需要通过实践和反馈建立语言直觉

## 参考资料与节奏依据

课程节奏参考这些公开教程和文档的优点：

- TypeScript 官方 Handbook：作为术语、概念边界和高级主题的准确性来源
- TypeScript for JavaScript Programmers：用于开篇心智模型，说明 TypeScript 是 JavaScript 的类型化超集
- Everyday Types：作为前期章节顺序的主要参考，先覆盖日常高频类型
- Total TypeScript：借鉴错误驱动、练习驱动的训练方式
- Execute Program：借鉴短练习、高频反馈和阶段复习节奏
- Codecademy Learn TypeScript：借鉴新手友好的任务粒度
- MDN Web / Node 生态资料：作为后期项目化、运行环境和工具链上下文参考

## 教学原则

1. 前期不引入 UE、GAS、MCP、React、Next.js、装饰器或类型体操。
2. 每章只引入少量新概念，并用可运行代码验证。
3. 每个概念都要有最小示例、通用实践案例和练习题。
4. 案例优先选择任务列表、用户资料、订单、配置、表单结果、API 响应、数据转换等通用场景。
5. 先让学习者理解类型推断、显式注解、对象建模、联合类型和类型收窄，再进入泛型、工具类型和工程配置。
6. 核心逻辑优先写成纯 TypeScript 函数，再在后期包装成 CLI 或 MCP Tool。
7. 从早期就建立阅读 TypeScript 报错的习惯，但不在第 0 章强行引入测试框架。
8. AI Agent 打分以真实文件、真实命令输出和练习完成度为依据。

## 主线项目策略

项目名：`typed-toolbox-lab`

前期项目不是最终 MCP Server，而是一组逐步扩展的通用 TypeScript 练习：

- 学习者资料与学习目标输出
- 任务列表、用户资料、订单和配置对象建模
- API 响应、表单结果、状态机等联合类型案例
- 数据筛选、分组、汇总和转换函数
- JSON 配置读取与运行时校验
- Vitest 测试核心逻辑

后期项目在同一个 typed core 基础上扩展：

- CLI 命令：读取输入、选择操作、输出结果
- Zod 校验：处理外部 JSON 和命令参数
- MCP Server：把少量稳定函数暴露成工具

## 推进方式

教程项目本身维护在：

```text
/home/lazarus/Dev/learn-typescript-mcp-tutorial
```

Discord 项目频道：

```text
#learn-typescript
```

每次迭代至少交付以下一种结果：

- 新章节草稿
- 已修订章节
- 评分 Rubric
- Agent 打分模板
- 参考实现或练习代码模板
- 教程质量检查结果

## 近期里程碑

### M1：通用课程骨架可用

交付：

- README
- 项目章程
- 教程地图
- Agent 打分流程
- 第 0 章
- 第 0 章评分 Rubric

### M2：TypeScript 日常基础章节

交付：

- 第 1 章：基础类型、类型推断与函数
- 第 2 章：对象类型、类型别名与接口
- 第 3 章：联合类型、字面量类型与状态建模
- 第 4 章：类型收窄与常见错误阅读

### M3：通用数据建模与项目化章节

交付：

- 第 5 章：模块系统与项目拆分
- 第 6 章：数组、Record 与数据查询
- 第 7 章：泛型入门与可复用函数
- 第 8 章：Node.js、JSON 与运行时边界

### M4：可靠性章节

交付：

- 第 9 章：Zod 校验与 `unknown`
- 第 10 章：async/await 与错误处理
- 第 11 章：Vitest 测试

### M5：CLI / MCP 扩展章节

交付：

- 第 12 章：CLI 设计与命令参数
- 第 13 章：MCP Server 入门
- 第 14 章：最终整理与复盘
- 完整参考实现
- 总评分 Rubric
