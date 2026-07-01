# TypeScript Agent 工具链进阶篇

本进阶篇接在 00-14 章之后。基础篇目标是“能写 TypeScript、能做最小 CLI/MCP”；进阶篇目标是“能真正开发 agent 工具链”：可安装的 CLI、稳定的 MCP Server、可测试的协议边界、可替换的 Unreal bridge，以及面向 Claude Code / Codex / OpenCode 的工具体验。

## 最终项目

进阶篇会构建一个 `unreal-agent-toolchain`：

```text
unreal-agent-toolchain/
  src/
    cli/
    mcp/
    domain/
    app/
    adapters/
      filesystem/
      process/
      unreal-bridge/
  fixtures/
    basic-unreal-project/
```

它不是直接依赖真实 Unreal Editor，而是先用可替换 bridge 建模。这样你可以在 TypeScript 层完整验证 CLI/MCP 工程能力，后续再把 bridge 接到 Unreal C++ 插件、HTTP/WebSocket 或本地进程。

## 章节总览

| 章节 | 主题 | 项目增量 | 验收方式 |
|---|---|---|---|
| A01 | Node 工具运行时 | 路径、环境变量、stdio、退出码、配置目录 | typecheck/test/CLI 输出 |
| A02 | 子进程与外部工具 | 安全执行命令、超时、stderr/stdout、取消 | fixture 命令测试 |
| A03 | 产品级 CLI 设计 | commander、子命令、JSON 输出、doctor | CLI 集成测试 |
| A04 | 配置系统与工作区发现 | config 优先级、workspace root、Windows 路径 | fixture + snapshot |
| A05 | MCP Tool 设计进阶 | tool 粒度、结构化返回、错误码、分页 | SDK client 调 tool |
| A06 | Unreal Bridge 边界 | bridge interface、fake bridge、HTTP/WebSocket 预留 | fake bridge 测试 |
| A07 | 测试与发布工程 | vitest integration、tsc build、package bin、GitHub Actions | build/test/bin smoke |
| A08 | Agent 插件体验 | CLAUDE.md、Codex/OpenCode 使用说明、工具说明优化 | agent-facing review |

## 设计原则

- TypeScript 层负责 CLI/MCP/协议/分发，不抢 Unreal C++ 的领域职责。
- Unreal C++ 插件只作为能力提供者；TS bridge 通过明确协议调用它。
- 所有外部输入先进入 `unknown` 或 schema，再转成 domain 类型。
- 所有 shell 执行必须有 allowlist、timeout、cwd 和结构化错误。
- MCP tool 返回要适合 agent 继续推理，不只适合人类阅读。
- 每章都要能在没有真实 Unreal Editor 的环境下验证。

## 作业路径

进阶篇使用独立目录，避免和基础篇 `typed-toolbox-lab` 混在一起：

```text
works/advanced/chapter-a01/unreal-agent-toolchain
works/advanced/chapter-a02/unreal-agent-toolchain
...
```

每章开始时，从上一章复制一份到当前章；A01 从空项目开始。

仓库同时提供了 `works/advanced/chapter-a01` 到 `chapter-a08` 的可运行参考实现。学习者可以把它们当作“章节完成态”对照，但真正练习时仍建议自己从上一章复制并逐步实现。

进阶篇参考项目统一使用：

```bash
corepack pnpm install
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm smoke:cli
corepack pnpm smoke:mcp
```

如果本机已经有全局 `pnpm`，也可以把 `corepack pnpm` 简写成 `pnpm`。参考项目的 `pnpm-workspace.yaml` 已允许 `esbuild` 构建脚本，避免 `ERR_PNPM_IGNORED_BUILDS` 阻塞 Vitest/Vite 依赖安装。

## 前置能力

开始进阶篇前，建议已经完成基础篇 00-14 章，并能解释：

- TypeScript 的联合类型、类型收窄、泛型入门
- Node.js 文件读取和 JSON parse 边界
- Zod schema 和 `z.infer`
- Vitest 基础测试
- CLI stdout/stderr/exit code
- 最小 stdio MCP Server
