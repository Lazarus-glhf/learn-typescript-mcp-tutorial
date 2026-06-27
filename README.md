# TypeScript 通用学习教程

这是一个中文 TypeScript 自学教程项目，目标是从通用 TypeScript 基础开始，逐步过渡到 Node.js、CLI 和 MCP 工具开发。

教程前期刻意不绑定 Unreal Engine、GAS、MCP、CLI、React 或任何特定框架。前几章优先训练 TypeScript 本身：基础类型、类型推断、函数、对象建模、联合类型、类型收窄、模块、数组处理、异步代码和测试。等语言基础稳定后，再进入 CLI 和 MCP。

## 学习成果

完成教程后，学习者会得到一个逐步演进的 TypeScript 项目：`typed-toolbox-lab`。

项目会按阶段增长：

- 阶段 1：通用 TypeScript 小练习，覆盖日常类型、函数、对象、联合类型和类型收窄
- 阶段 2：通用 typed data toolkit，覆盖模块、数组、`Record`、泛型、JSON、Zod、异步代码和测试
- 阶段 3：把稳定的 typed core 包装成一个小型 CLI
- 阶段 4：可选地把部分稳定能力暴露为 MCP tools

## 教程设计原则

本教程参考了多个现有 TypeScript 教程的节奏，但不直接照搬：

- TypeScript Handbook / Everyday Types：用于校准概念边界和前期章节顺序
- TypeScript for JavaScript Programmers：用于建立“TypeScript 是 JavaScript 的类型化超集”的心智模型
- Codecademy Learn TypeScript：借鉴小步练习和新手友好的任务粒度
- Total TypeScript：借鉴错误驱动练习，让学习者主动阅读和修复类型错误
- Execute Program：借鉴短练习、高频反馈和阶段复习
- MDN / W3Schools 入门资料：借鉴直接可运行的小例子，但避免类型清单化

前期主线案例采用“任务清单 / 学习计划 / 通用数据工具箱”，而不是游戏、UE、MCP 或前端页面。这样后续可以自然扩展到对象、联合类型、数组、测试、CLI 和 MCP，同时不影响早期 TypeScript 基础学习。

## 快速开始前的依赖检查

在进入第 0 章并运行 `pnpm init` 之前，先确认本机已经安装 Node.js 和 pnpm。

PowerShell / Windows Terminal 中运行：

```powershell
node --version
npm --version
pnpm --version
```

如果 `pnpm` 提示不是可识别命令，优先运行：

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

如果你在 Linux / WSL 上执行 `corepack enable` 时遇到 `/usr/bin/pnpm` 权限错误，可以先不创建全局 `pnpm` 命令，改用：

```bash
corepack prepare pnpm@latest --activate
corepack pnpm --version
```

后续命令中的 `pnpm` 可以临时写成 `corepack pnpm`。

如果 `node` 也不可用，先安装 Node.js LTS：

```powershell
winget install OpenJS.NodeJS.LTS
```

安装后重新打开 PowerShell，再重新检查版本。

详细说明见：

```text
docs/chapters/00-setup.md
```

## 章节路线

| 章节 | 主题 | 状态 |
|---|---|---|
| 00 | 环境与第一次运行 TypeScript | 已有草稿 |
| 01 | 基础类型、类型推断与函数 | 已有草稿 |
| 02 | 对象类型、类型别名与接口 | 已有草稿 |
| 03 | 联合类型、字面量类型与状态建模 | 已有草稿 |
| 04 | 类型收窄与常见错误阅读 | 已有草稿 |
| 05 | 模块系统与项目拆分 | 已有草稿 |
| 06 | 数组、`Record` 与数据查询 | 已有草稿 |
| 07 | 泛型入门与可复用函数 | 已有草稿 |
| 08 | Node.js、JSON 与运行时边界 | 已有草稿 |
| 09 | Zod 校验与 `unknown` | 已有草稿 |
| 10 | `async` / `await` 与错误处理 | 已有草稿 |
| 11 | Vitest 测试 | 待编写 |
| 12 | CLI 设计与命令参数 | 待编写 |
| 13 | MCP Server 入门 | 待编写 |
| 14 | 最终整理与复盘 | 待编写 |

## 学习与提交方式

学习者每完成一章后，在包含练习项目的工作区里直接让 AI Agent 检查并打分，例如“考核第 1 章作业”。Agent 应自行读取项目目录、运行本章要求的命令，并根据章节 rubric 判断是否完成。

可选考核请求模板：

```text
templates/agent-submission.md
```

Agent 打分流程见：

```text
docs/agent-grading-workflow.md
```

## 文档索引

- `docs/project-charter.md`：项目范围、教学原则、里程碑
- `docs/tutorial-map.md`：章节地图和整体学习路线
- `docs/tutorial-case-comparison.md`：与现有 TypeScript 教程的对比、案例取舍依据
- `docs/agent-grading-workflow.md`：学习者如何提交练习，Agent 如何评分
- `docs/chapters/00-setup.md`：第 0 章，准备环境与第一次运行 TypeScript
- `docs/chapters/01-basic-types-functions.md`：第 1 章，基础类型、类型推断与函数
- `docs/chapters/02-object-types.md`：第 2 章，对象类型、类型别名与接口
- `docs/chapters/03-union-literal-types.md`：第 3 章，联合类型、字面量类型与状态建模
- `docs/chapters/04-type-narrowing.md`：第 4 章，类型收窄与常见错误阅读
- `docs/chapters/05-modules-project-structure.md`：第 5 章，模块系统与项目拆分
- `docs/chapters/06-arrays-record-data-query.md`：第 6 章，数组、Record 与数据查询
- `docs/chapters/07-generics-reusable-functions.md`：第 7 章，泛型入门与可复用函数
- `docs/chapters/08-node-json-runtime-boundary.md`：第 8 章，Node.js、JSON 与运行时边界
- `docs/chapters/09-zod-validation-unknown.md`：第 9 章，Zod 校验与 unknown
- `docs/chapters/10-async-await-error-handling.md`：第 10 章，async / await 与错误处理
- `docs/rubrics/chapter-00-rubric.md`：第 0 章评分标准
- `docs/rubrics/chapter-01-rubric.md`：第 1 章评分标准
- `docs/rubrics/chapter-02-rubric.md`：第 2 章评分标准
- `docs/rubrics/chapter-03-rubric.md`：第 3 章评分标准
- `docs/rubrics/chapter-04-rubric.md`：第 4 章评分标准
- `docs/rubrics/chapter-05-rubric.md`：第 5 章评分标准
- `docs/rubrics/chapter-06-rubric.md`：第 6 章评分标准
- `docs/rubrics/chapter-07-rubric.md`：第 7 章评分标准
- `docs/rubrics/chapter-08-rubric.md`：第 8 章评分标准
- `docs/rubrics/chapter-09-rubric.md`：第 9 章评分标准
- `docs/rubrics/chapter-10-rubric.md`：第 10 章评分标准
- `templates/agent-submission.md`：AI Agent 考核请求模板

## 当前状态

当前仓库处于教程早期阶段，已经完成课程骨架、第 0 章、第 1 章、评分流程和前两章 Rubric。后续会继续按章节地图迭代。