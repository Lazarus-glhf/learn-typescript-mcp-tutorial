# Advanced A02：子进程与外部工具

## 本章目标

Unreal agent 工具最终一定会调用外部命令：`git`、`rg`、Unreal Build Tool、RunUAT、Python 脚本或自定义 bridge。本章学习如何在 TypeScript 中安全执行子进程，并把结果转成稳定类型。

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| `node:child_process` | 启动外部命令 |
| timeout | 防止工具永久卡住 |
| stdout/stderr | 分离结果与诊断 |
| allowlist | 避免任意 shell 执行 |
| structured error | 给 CLI/MCP 复用的错误模型 |

## 概念解释

不要把用户输入拼成 shell 字符串：

```ts
// 不推荐
exec(`git ${userInput}`);
```

优先使用命令和参数数组：

```ts
spawn("git", ["status", "--short"], { cwd });
```

agent 工具尤其要小心，因为 agent 可能生成危险参数。TypeScript 层应该限制能执行的命令和参数形状。

## 最小示例

```ts
export type CommandResult =
  | { ok: true; stdout: string; stderr: string; exitCode: 0 }
  | { ok: false; stdout: string; stderr: string; exitCode: number | null; reason: "failed" | "timeout" };
```

## 项目实践

新增：

```text
src/adapters/process/runCommand.ts
src/adapters/process/runCommand.test.ts
src/app/runDoctor.ts
```

实现一个 `doctor` app 函数：

- 检查 `git --version` 是否可运行。
- 超时后返回结构化错误。
- CLI 输出人类可读结果；`--json` 输出机器可读结果。
- 测试覆盖成功、命令不在 allowlist、超时或启动失败路径。

## 练习题

必做：用 `spawn` 实现 `runCommand`，不要用 shell 拼接。

加分：支持 `AbortController` 或 timeout kill。

思考：为什么 `stderr` 有内容不一定代表命令失败？

## 常见错误

- 用 `exec` 拼接字符串导致 shell injection。
- 超时后没有清理子进程。
- 把非 0 exit code 直接 throw，导致 CLI/MCP 无法统一格式化错误。

## AI Agent 考核指令

请检查 `works/advanced/chapter-a02/unreal-agent-toolchain`：重点审查是否存在 shell 字符串拼接，运行测试，验证成功、失败、超时路径都有覆盖。
