# 进阶篇评分标准

适用于 `docs/advanced/advanced-a01` 到 `advanced-a08`。Agent 考核时应优先读取对应章节文档，再使用本评分标准。

每章满分 100 分：

| 维度 | 分值 | 说明 |
|---|---:|---|
| 正确性 | 30 | 完成本章要求的功能，成功和失败路径行为符合章节说明 |
| 工程边界 | 20 | CLI/MCP/app/domain/adapter 分层清晰，外部输入和副作用集中在边界层 |
| 类型与 schema | 15 | 使用 TypeScript 类型、Zod schema、结构化错误，而不是 `any` 和自由文本乱传 |
| 可运行性 | 15 | `pnpm typecheck`、`pnpm test`、章节指定 CLI/MCP 命令可运行 |
| 测试质量 | 10 | 覆盖关键成功、失败、边界路径，使用 fixture 而不是依赖本机真实项目 |
| Agent 可用性 | 10 | 输出、错误、tool description、文档适合 agent 继续调用和推理 |

## 通用通过线

- 80 分及以上：通过，可进入下一章。
- 60-79 分：基本方向正确，但应修复关键问题后再继续。
- 60 分以下：需要重做本章核心实践。

## 必须扣分项

出现以下问题应显著扣分：

- shell 命令通过字符串拼接用户输入。
- MCP Server 在 stdout 输出调试文本，破坏 stdio 协议。
- app/domain 层直接读取 `process.env`、`process.cwd()` 或真实文件系统，导致测试困难。
- 测试依赖学习者本机真实 Unreal 项目，而不是 fixture/fake bridge。
- JSON 输出混入彩色文本、日志或非结构化说明。
- tool 设计过度泛化，例如只提供 `run_command(command: string)`。
- 没有失败路径、超时、找不到项目根等错误处理。

## Agent 考核流程

1. 定位作业目录，例如 `works/advanced/chapter-a05/unreal-agent-toolchain`。
2. 读取对应章节文档和本评分标准。
3. 检查项目结构和关键源码。
4. 运行章节要求的命令，至少包括 `pnpm typecheck`、`pnpm test`、`pnpm build`，以及章节指定的 CLI/MCP smoke test。
5. 如果学习环境没有全局 `pnpm`，使用 `corepack pnpm ...` 执行同一命令。
6. 给出总分、分项分数、具体问题、修复建议和是否建议进入下一章。

## 进阶篇特殊关注

A01-A04 重点看 CLI/runtime/config 是否稳。

A05-A06 重点看 MCP tool 与 Unreal bridge 边界是否清晰。

A07-A08 重点看发布、文档、agent 使用体验是否达到真实工具链标准。
