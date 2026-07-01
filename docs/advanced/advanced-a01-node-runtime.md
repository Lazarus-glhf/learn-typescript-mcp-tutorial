# Advanced A01：Node 工具运行时

## 本章目标

本章把你从“能运行 TypeScript 文件”推进到“理解 CLI/MCP 工具运行时”。你会实现一个最小 `unreal-agent-toolchain`，能安全读取 cwd、环境变量、stdin/stdout/stderr，并用退出码表达成功或失败。

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| `process.cwd()` | 当前命令运行目录，通常是用户项目根附近 |
| `process.env` | 读取环境变量，例如配置路径、debug 开关 |
| stdout/stderr | stdout 给机器或用户结果，stderr 给日志和诊断 |
| exit code | CLI 自动化判断成功失败的契约 |
| path normalize | 跨 Windows/Linux 处理路径 |

## 概念解释

Agent 工具链里，CLI 和 MCP Server 都是进程。进程边界比函数边界更脏：cwd 可能不对，环境变量可能缺失，路径可能是 Windows 风格，stdout 可能被 MCP 协议占用。

本章只建立一个原则：工具入口可以脏，domain/app 层必须干净。

## 最小示例

```ts
import path from "node:path";

export type RuntimeInfo = {
  cwd: string;
  debug: boolean;
};

export function readRuntimeInfo(env: NodeJS.ProcessEnv, cwd: string): RuntimeInfo {
  return {
    cwd: path.resolve(cwd),
    debug: env.UNREAL_AGENT_DEBUG === "1",
  };
}
```

## 项目实践

在 `works/advanced/chapter-a01/unreal-agent-toolchain` 创建项目，实现：

```text
src/
  cli/main.ts
  cli/runCli.ts
  app/readRuntimeInfo.ts
  app/readRuntimeInfo.test.ts
pnpm-workspace.yaml
```

要求：

- `pnpm-workspace.yaml` 或等价配置允许 `esbuild` 构建脚本，避免 Vitest 依赖安装时出现 `ERR_PNPM_IGNORED_BUILDS`。
- `pnpm typecheck` 通过。
- `pnpm test` 通过。
- `pnpm cli doctor --cwd .` 能输出当前 cwd 或清晰错误。
- `pnpm cli doctor --json --cwd .` 的 stdout 只包含 JSON。
- debug 日志只能写 stderr，不能污染 JSON stdout。

## 练习题

必做：实现 `readRuntimeInfo`，并测试 `UNREAL_AGENT_DEBUG=1` 和未设置两种情况。

加分：增加 `--json` 参数，让 CLI 输出 JSON。

思考：为什么 MCP Server 不能随便 `console.log`？

## 常见错误

- 把 debug 信息写进 stdout，导致上游工具无法解析 JSON。
- 在 app 层直接读 `process.env`，导致测试困难。
- 直接拼接路径字符串，忽略 Windows 路径分隔符。

## AI Agent 考核指令

请检查 `works/advanced/chapter-a01/unreal-agent-toolchain`：读取源码，运行 `pnpm typecheck`、`pnpm test` 和 CLI 命令，确认 stdout/stderr/exit code 行为符合本章要求。
