# Advanced A07：测试、构建与发布工程

## 本章目标

本章把项目从“本机能跑”推进到“可以交给别人安装和验证”。你会补集成测试、打包、`bin` 入口、构建产物检查和 GitHub Actions。

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| integration test | 验证 CLI/MCP 真实入口 |
| fixture/golden | 固定输入输出，防止回归 |
| package `bin` | npm 安装后提供命令 |
| `tsc` build | 生成可被 Node 直接运行的 `dist` 产物 |
| CI | 每次提交自动验证 |

## 概念解释

库测试只证明函数对；CLI/MCP 工具还要证明入口对：命令名、参数、stdout/stderr、exit code、构建后的 `dist` 是否能运行。

## 项目实践

新增：

```text
.github/workflows/ci.yml
src/test-client/mcp-smoke.ts
```

要求：

- `pnpm test` 通过。
- `pnpm build` 通过。
- `node dist/cli/main.js doctor --json --cwd fixtures/basic-unreal-project` 可运行。
- `node dist/test-client/mcp-smoke.js` 能通过 SDK client 调用 MCP tool。
- package.json 配置 `bin`。
- CI 运行 typecheck/test/build/smoke。

## 练习题

必做：写一个构建后 smoke test。

加分：为 JSON 输出增加 snapshot/golden 文件。

思考：为什么测试要覆盖构建后的文件，而不只覆盖 TS 源码？

## 常见错误

- `vitest` 同时发现 `src` 和 `dist` 里的测试，重复运行。
- package `bin` 指向 TS 源码，发布后无法运行。
- CI 没跑 build，导致类型和打包路径问题漏掉。

## AI Agent 考核指令

请检查 `works/advanced/chapter-a07/unreal-agent-toolchain`：运行 typecheck/test/build 和构建后 CLI smoke test，检查 package `bin` 与 CI 配置。
