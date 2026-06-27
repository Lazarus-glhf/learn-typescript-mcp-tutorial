# Chapter 12：CLI 设计与命令参数

## 本章目标

第 11 章已经用测试锁住了核心逻辑。现在可以把 typed core 包装成命令行工具，让用户通过终端运行它。

本章会实现一个最小 CLI：

```bash
pnpm start -- summary --config data/config.json --tasks data/tasks.json
```

它会读取配置和任务文件，输出任务摘要。失败时输出到 stderr，并返回非 0 退出码。

完成本章后，你应该能够回答：

- CLI 和 domain/app/node 层分别负责什么
- `process.argv` 是什么
- 为什么 stdout 和 stderr 要区分
- 为什么失败时要设置非 0 退出码
- 为什么参数解析应该有明确错误，而不是静默使用错误默认值
- 第 13 章进入 MCP 前，CLI 能提供什么稳定边界

本章结束时，你的项目会新增：

```text
typed-toolbox-lab/
  src/
    cli/
      args.ts
      runCli.ts
    index.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| CLI | 命令行界面，让用户从终端调用程序 |
| `process.argv` | Node.js 提供的命令行参数数组 |
| stdout | 正常输出，适合给用户或管道读取 |
| stderr | 错误输出，适合诊断失败 |
| exit code | 进程成功或失败的状态码 |
| command | CLI 的子命令，例如 `summary` |

本章不引入复杂 CLI 框架。你会先手写一个小参数解析器，理解 CLI 边界。后续项目变大时再考虑 Commander、yargs 等库。

## 概念解释

### `process.argv`

Node.js 程序启动时，命令行参数会放在 `process.argv` 里。

例如运行：

```bash
node dist/index.js summary --config data/config.json --tasks data/tasks.json
```

`process.argv` 大致是：

```ts
[
  "/path/to/node",
  "/path/to/dist/index.js",
  "summary",
  "--config",
  "data/config.json",
  "--tasks",
  "data/tasks.json"
]
```

前两个元素是 Node 和脚本路径，真正的用户参数从第三个元素开始：

```ts
const args = process.argv.slice(2);
```

### stdout 和 stderr

CLI 有两类输出：

- stdout：正常结果，例如任务摘要
- stderr：错误信息，例如参数缺失、文件不存在、JSON 无效

这样用户可以把正常输出交给其他程序，同时仍然在终端看到错误。

### 退出码

进程退出码表示命令是否成功：

- `0` 表示成功
- 非 `0` 表示失败

在 Node.js 里可以设置：

```ts
process.exitCode = 1;
```

本教程优先使用 `process.exitCode`，避免在中间逻辑里直接 `process.exit()` 打断测试和清理流程。

### CLI 层不要承载业务逻辑

CLI 层负责：

- 解析参数
- 调用 app 层函数
- 输出结果或错误
- 设置退出码

它不应该直接解析 JSON、不应该直接调用 Zod schema，也不应该把业务规则写进参数解析函数里。

## 最小示例

### 文件 1：`src/cli/args.ts`

```ts
import { err, ok, type Result } from "../domain/index.js";

export type CliCommand = {
  name: "summary";
  configPath: string;
  tasksPath: string;
};

export function parseArgs(args: string[]): Result<CliCommand, string> {
  const [command, ...rest] = args;

  if (command !== "summary") {
    return err("Expected command: summary");
  }

  const configPath = readFlag(rest, "--config");
  const tasksPath = readFlag(rest, "--tasks");

  if (configPath === undefined) {
    return err("Missing required flag: --config");
  }

  if (tasksPath === undefined) {
    return err("Missing required flag: --tasks");
  }

  return ok({ name: "summary", configPath, tasksPath });
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}
```

### 文件 2：`src/cli/runCli.ts`

```ts
import { formatWorkspaceError } from "../app/formatWorkspaceError.js";
import { loadWorkspace } from "../app/loadWorkspace.js";
import { parseArgs } from "./args.js";

export type CliResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

export async function runCli(args: string[]): Promise<CliResult> {
  const command = parseArgs(args);

  if (!command.ok) {
    return { exitCode: 1, stdout: "", stderr: command.error };
  }

  const workspace = await loadWorkspace({
    configPath: command.value.configPath,
    tasksPath: command.value.tasksPath,
  });

  if (!workspace.ok) {
    return { exitCode: 1, stdout: "", stderr: formatWorkspaceError(workspace.error) };
  }

  return {
    exitCode: 0,
    stdout: `Project: ${workspace.value.config.projectName}\nTasks: ${workspace.value.tasks.length}`,
    stderr: "",
  };
}
```

### 文件 3：`src/index.ts`

```ts
import { runCli } from "./cli/runCli.js";

const result = await runCli(process.argv.slice(2));

if (result.stdout.length > 0) {
  console.log(result.stdout);
}

if (result.stderr.length > 0) {
  console.error(result.stderr);
}

process.exitCode = result.exitCode;
```

运行：

```bash
pnpm build
node dist/index.js summary --config data/config.json --tasks data/tasks.json
```

成功时应该输出项目名和任务数量。

## 项目实践

### Step 1：保留测试

本章不要删除第 11 章测试。CLI 是新外壳，核心逻辑仍然需要测试保护。

确认这些命令仍然通过：

```bash
pnpm test
pnpm typecheck
```

### Step 2：创建 `src/cli/args.ts`

这个文件只负责把字符串数组解析成结构化命令。

输入：

```ts
["summary", "--config", "data/config.json", "--tasks", "data/tasks.json"]
```

输出：

```ts
{ ok: true, value: { name: "summary", configPath: "data/config.json", tasksPath: "data/tasks.json" } }
```

错误输入应该返回 `ok: false`，不要 throw。

### Step 3：创建 `src/cli/runCli.ts`

`runCli` 负责连接 CLI 参数和 app 层：

- 参数错误：返回 `exitCode: 1` 和 stderr
- workspace 加载失败：返回 `exitCode: 1` 和 stderr
- 成功：返回 `exitCode: 0` 和 stdout

它返回 `CliResult`，这样第 11 章的测试方式也能继续用于 CLI。

### Step 4：改造入口文件

`src/index.ts` 应该变得很薄：

- 调用 `runCli(process.argv.slice(2))`
- 有 stdout 就 `console.log`
- 有 stderr 就 `console.error`
- 设置 `process.exitCode`

不要把参数解析细节写在入口文件里。

### Step 5：手动验证 CLI

运行成功路径：

```bash
pnpm build
node dist/index.js summary --config data/config.json --tasks data/tasks.json
```

验证缺少参数：

```bash
node dist/index.js summary --config data/config.json
```

验证未知命令：

```bash
node dist/index.js unknown --config data/config.json --tasks data/tasks.json
```

这些失败命令应该返回非 0 退出码，并输出清晰错误。

## 练习题

### 练习 1：添加 `list` 命令

新增命令：

```bash
node dist/index.js list --config data/config.json --tasks data/tasks.json
```

`summary` 只输出数量，`list` 输出每个任务标题。

要求：

- `CliCommand` 变成联合类型：`summary` 或 `list`
- `parseArgs` 能解析两个命令
- `runCli` 根据命令输出不同内容

### 练习 2：给 `parseArgs` 写测试

新增 `src/cli/args.test.ts`，测试：

- 合法 summary 命令
- 缺少 `--config`
- 缺少 `--tasks`
- 未知命令

### 练习 3：给 `runCli` 写最小测试

新增 `src/cli/runCli.test.ts`，用临时 fixture 测试成功命令和参数错误。

不要测试真实 `process.argv`。`runCli(args)` 已经把核心 CLI 行为隔离出来，更容易测试。

## 常见错误

### 错误 1：参数错误时继续运行

如果缺少 `--tasks`，不要偷偷使用默认任务文件。参数错误应该明确失败。

### 错误 2：把错误输出到 stdout

错误应该进入 stderr。stdout 保留给正常结果，这对脚本管道很重要。

### 错误 3：在 `parseArgs` 里读文件

参数解析只处理字符串，不读文件、不校验 JSON、不调用 Zod。

### 错误 4：用 `process.exit()` 藏在深层函数里

深层函数直接退出进程会让测试困难。让 `runCli` 返回 exit code，由入口文件设置 `process.exitCode`。

### 错误 5：忘记测试失败命令

CLI 最容易坏在错误路径。缺参数、未知命令、坏文件路径都应该能给出清晰反馈。

## AI Agent 考核指令

完成本章后，在你的项目根目录对 Agent 说：

```text
考核第 12 章作业
```

Agent 应自行读取 `src/cli/args.ts`、`src/cli/runCli.ts`、`src/index.ts`、相关测试文件，运行 `pnpm test`、`pnpm typecheck`、`pnpm build`，并实际执行至少一个成功 CLI 命令和一个失败 CLI 命令。

## 本章通过标准

你完成本章后，应该满足：

- `parseArgs` 能解析 `summary --config ... --tasks ...`
- 参数错误返回结构化失败，不直接 throw
- `runCli` 返回 `CliResult`
- `src/index.ts` 只负责连接真实进程输入输出
- 成功 CLI 输出到 stdout
- 失败 CLI 输出到 stderr，并设置非 0 退出码
- `parseArgs` 或 `runCli` 有测试覆盖
- `pnpm test` 通过
- `pnpm typecheck` 通过
- `pnpm build` 通过

下一章会把已经稳定的 CLI/app/domain 逻辑包装成 MCP Server tool。
