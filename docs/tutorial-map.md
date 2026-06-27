# 教程地图

本教程前期以 `typed-toolbox-lab` 为练习项目。它不是一开始就构建 MCP Server，而是先用通用案例训练 TypeScript 语言能力；中期沉淀 typed core；后期再把核心逻辑包装成 CLI 和 MCP 工具。

## 章节总览

| 章节 | 主题 | 新特性 | 项目增量 | 验收方式 |
|---|---|---|---|---|
| 00 | 环境与第一次运行 | Node、pnpm、tsx、tsc、package.json、tsconfig.json | 创建项目并运行 `src/index.ts` | `pnpm dev` 成功输出 |
| 01 | 基础类型、推断与函数 | `string`、`number`、`boolean`、数组、参数类型、返回值类型 | 学习者资料与简单格式化函数 | 输出正确，能解释推断与注解 |
| 02 | 对象类型 | `type`、`interface`、嵌套对象、可选字段 | 用户资料、任务、订单等对象模型 | 能生成对象摘要 |
| 03 | 联合类型与字面量类型 | 字符串字面量、联合类型、状态建模 | 任务状态、表单结果、API 响应类型 | 不同状态分支输出正确 |
| 04 | 类型收窄 | `typeof`、`in`、判别联合、`never` 穷尽检查 | 处理多种输入和结果状态 | 所有分支类型安全 |
| 05 | 模块系统 | `import`、`export`、目录分层 | `src/domain/`、`src/app/` 模块拆分 | 项目仍可运行 |
| 06 | 数组与索引 | `map`、`filter`、`find`、`reduce`、`Record` | 任务查询、分组、统计 | 查询和汇总结果正确 |
| 07 | 泛型入门 | 泛型函数、泛型类型别名、约束 | `Result<T, E>`、分页结果、列表工具函数 | 可复用函数保留准确类型 |
| 08 | Node 与 JSON | `fs/promises`、`path`、`JSON.parse`、运行时边界 | 从 JSON 文件加载配置和数据 | 数据文件可读取，边界清晰 |
| 09 | Zod 校验 | `unknown`、schema、`z.infer`、`safeParse` | 校验配置、任务、API 响应数据 | 错误数据能被拒绝 |
| 10 | 异步与错误 | `async`、`await`、`Promise.all`、`try/catch` | 异步加载与错误返回 | 失败路径清晰 |
| 11 | 测试 | Vitest、`describe`、`it`、`expect` | 核心逻辑测试 | `pnpm test` 通过 |
| 12 | CLI 设计 | 命令参数、标准输入输出、退出码 | 暴露 2-3 个 typed core 命令 | CLI 可执行且输出稳定 |
| 13 | MCP Server | MCP SDK、tool、stdio transport | 把稳定函数暴露为 MCP tools | Inspector 可调用 |
| 14 | 最终项目 | README、脚本、整理、复盘 | 完整可运行项目 | build/test/start 全通过 |

## 阶段节奏

### 阶段 1：通用 TypeScript 基础（00-04）

参考 Everyday Types 和 TypeScript for JavaScript Programmers 的节奏，先建立“TypeScript 是 JavaScript 加静态类型检查”的心智模型。章节案例只使用通用数据：学习者资料、任务、用户、订单、配置、API 响应、表单结果。

### 阶段 2：类型化数据处理（05-11）

参考 Total TypeScript、Execute Program 和 Codecademy 的练习方式，让学习者通过短任务反复处理类型错误、重构模块、设计可复用函数、读取 JSON、校验外部输入和编写测试。

### 阶段 3：CLI / MCP 工具化（12-14）

等 typed core 稳定后，再进入工程化。CLI 和 MCP 是后期应用层，不抢占前期 TypeScript 基础训练。

## 每章固定结构

每章文档必须包含：

```text
1. 本章目标
2. 本章会学到什么
3. 概念解释
4. 最小示例
5. 项目实践
6. 练习题
7. 常见错误
8. 自检清单
9. 提交给 AI Agent 的要求
```

## 练习分级

每章练习分为三类：

- 必做：用于证明本章核心概念已经掌握
- 加分：稍微扩展当前能力，但不引入下一章重概念
- 思考：让学习者用自己的已有编程经验类比 TS 概念，不绑定 UE 或任何特定领域

## Agent 打分维度

每章满分 100 分：

- 正确性：40 分
- 类型使用：20 分
- 项目结构：15 分
- 可运行性：15 分
- 代码清晰度：10 分

从第 9 章开始增加运行时校验权重。从第 11 章开始增加测试权重。从第 12 章开始增加 CLI 使用体验权重。从第 13 章开始增加 MCP 集成权重。
