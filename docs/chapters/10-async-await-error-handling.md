# Chapter 10：`async` / `await` 与错误处理

## 本章目标

前两章你已经能从 JSON 文件读取任务和配置，并用 Zod 拒绝坏数据。但现在还有一个问题：读取文件、解析 JSON、Zod 校验都可能失败。如果错误直接冒泡到入口文件，输出会变成长 stack trace，学习者和未来的 CLI 用户都很难判断发生了什么。

本章会把异步读取和错误处理整理成清晰的应用边界：

- 用 `async` / `await` 理解 Promise 流程
- 用 `try/catch` 捕获文件读取、JSON 解析和 Zod 校验错误
- 用 `Result<T, E>` 表达成功或失败
- 用 `Promise.all` 并行读取任务和配置
- 在入口文件根据错误类型输出清晰信息

完成本章后，你应该能够回答：

- `async` 函数为什么总是返回 Promise
- `await` 等待的是什么
- 为什么边界层适合捕获未知错误
- 为什么 domain 层不应该直接 `console.log` 错误
- `Promise.all` 什么时候适合使用
- `throw`、`try/catch` 和 `Result<T, E>` 各自适合放在哪里

本章结束时，你的项目会包含：

```text
typed-toolbox-lab/
  data/
    tasks.json
    config.json
  src/
    app/
      loadWorkspace.ts
    domain/
      config.ts
      result.ts
      task.ts
      index.ts
    node/
      readJsonFile.ts
    index.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| `async` function | 返回 Promise 的异步函数 |
| `await` | 等待 Promise 完成并取得结果 |
| `try/catch` | 捕获同步 throw 和 rejected Promise |
| `Promise.all` | 并行等待多个 Promise |
| `Result<T, E>` | 用数据表达成功或失败 |
| error boundary | 把未知错误转换成应用能理解的错误 |

本章仍然不引入测试框架、CLI 参数或 MCP。你只把文件读取流程变得更稳，为第 11 章测试和第 12 章 CLI 做准备。

## 概念解释

### `async` 函数返回 Promise

只要函数前面有 `async`，它返回的就不是普通值，而是 Promise：

```ts
async function loadNumber(): Promise<number> {
  return 42;
}
```

即使你写的是 `return 42`，调用者拿到的也是 `Promise<number>`。所以调用方要么 `await`，要么继续返回这个 Promise。

### `await` 会等待 Promise

```ts
const text = await readFile("data/tasks.json", "utf8");
```

这行代码的意思是：等 `readFile` 完成后，再把读取到的文本放进 `text`。

如果 Promise 失败，`await` 会把失败变成当前函数里的 throw。因此它可以被 `try/catch` 捕获。

### `try/catch` 捕获边界错误

读取 JSON 文件可能出现三类错误：

- 文件不存在或没有权限读取
- 文件不是合法 JSON
- JSON 内容不符合 Zod schema

这些错误都发生在外部数据进入程序的边界。边界层适合捕获错误，并把未知错误转成应用自己的错误类型。

### `Result<T, E>` 让调用方显式处理失败

第 7 章已经见过 `Result<T, E>` 的思想。本章把它用于异步加载：

```ts
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

读取成功返回：

```ts
{ ok: true, value: workspace }
```

读取失败返回：

```ts
{ ok: false, error: { kind: "invalid-json", message: "..." } }
```

这样入口文件就必须判断 `ok`，不会假装失败不存在。

### `Promise.all` 适合并行读取互不依赖的数据

任务文件和配置文件互不依赖，可以并行读取：

```ts
const [tasksJson, configJson] = await Promise.all([
  readJsonFile(tasksPath),
  readJsonFile(configPath),
]);
```

如果第二个操作依赖第一个操作的结果，就不要用 `Promise.all`，按顺序 `await` 更清楚。

## 最小示例

### 文件 1：`src/domain/result.ts`

```ts
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}
```

### 文件 2：`src/node/readJsonFile.ts`

```ts
import { readFile } from "node:fs/promises";
import { err, ok, type Result } from "../domain/index.js";

export type ReadJsonError =
  | { kind: "file-read"; message: string }
  | { kind: "invalid-json"; message: string };

export async function readJsonFile(filePath: string): Promise<Result<unknown, ReadJsonError>> {
  try {
    const text = await readFile(filePath, "utf8");
    return ok(JSON.parse(text) as unknown);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return err({ kind: "invalid-json", message: error.message });
    }

    return err({ kind: "file-read", message: getErrorMessage(error) });
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
```

### 文件 3：`src/app/loadWorkspace.ts`

```ts
import { err, ok, parseAppConfig, parseLearningTasks, type AppConfig, type LearningTask, type Result } from "../domain/index.js";
import { readJsonFile, type ReadJsonError } from "../node/readJsonFile.js";

export type Workspace = {
  config: AppConfig;
  tasks: LearningTask[];
};

export type WorkspaceError =
  | ReadJsonError
  | { kind: "invalid-data"; message: string };

export async function loadWorkspace(paths: {
  configPath: string;
  tasksPath: string;
}): Promise<Result<Workspace, WorkspaceError>> {
  const [configResult, tasksResult] = await Promise.all([
    readJsonFile(paths.configPath),
    readJsonFile(paths.tasksPath),
  ]);

  if (!configResult.ok) {
    return err(configResult.error);
  }

  if (!tasksResult.ok) {
    return err(tasksResult.error);
  }

  try {
    return ok({
      config: parseAppConfig(configResult.value),
      tasks: parseLearningTasks(tasksResult.value),
    });
  } catch (error) {
    return err({ kind: "invalid-data", message: getErrorMessage(error) });
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
```

### 文件 4：`src/index.ts`

```ts
import { loadWorkspace } from "./app/loadWorkspace.js";

const result = await loadWorkspace({
  configPath: "data/config.json",
  tasksPath: "data/tasks.json",
});

if (!result.ok) {
  console.error(`Failed to load workspace: [${result.error.kind}] ${result.error.message}`);
  process.exitCode = 1;
} else {
  console.log(`Project: ${result.value.config.projectName}`);
  console.log(`Loaded tasks: ${result.value.tasks.length}`);
}
```

运行：

```bash
pnpm typecheck
pnpm build
pnpm start
```

成功时应该输出项目名和任务数量。失败时不应该出现一大段未处理 stack trace，而应该输出清晰的一行错误。

## 项目实践

### Step 1：保留第 9 章的 schema

本章不重写 Zod schema。`src/domain/task.ts` 和 `src/domain/config.ts` 应继续负责数据含义和运行时校验。

确认这些导出仍然存在：

```ts
parseLearningTasks(value: unknown): LearningTask[];
parseAppConfig(value: unknown): AppConfig;
```

### Step 2：创建 `Result<T, E>`

新增 `src/domain/result.ts`，写入：

```ts
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

再加入 `ok` 和 `err` helper。这样后续函数不用每次手写对象字面量。

### Step 3：把文件读取集中到 `readJsonFile`

新增 `src/node/readJsonFile.ts`。

这个文件只做三件事：

- 用 `readFile` 读取文本
- 用 `JSON.parse` 把文本转成 `unknown`
- 捕获文件读取错误和 JSON 语法错误

它不应该知道什么是任务、配置或业务规则。

### Step 4：创建应用层 `loadWorkspace`

新增 `src/app/loadWorkspace.ts`。

这个文件负责组合：

- 并行读取 `config.json` 和 `tasks.json`
- 如果读取或 JSON 解析失败，返回对应错误
- 如果读取成功，再调用 Zod parser 校验数据
- 如果校验失败，返回 `invalid-data`

这是 app 层，因为它把 node 层和 domain 层组织成一个工作流。

### Step 5：入口文件只处理结果

`src/index.ts` 不应该直接 `try/catch` 所有细节，也不应该知道 Zod 错误怎么解析。它只关心：

```ts
if (!result.ok) {
  console.error(...);
  process.exitCode = 1;
}
```

成功就输出摘要，失败就输出清晰错误。

### Step 6：验证三种失败路径

你需要故意验证三类失败：

1. 文件不存在，例如把 `tasksPath` 改成 `data/missing.json`
2. JSON 语法错误，例如把 `data/tasks.json` 改成 `{ bad json`
3. 数据校验错误，例如把 `estimatedMinutes` 改成字符串

每次验证后，把文件恢复到合法状态。

## 练习题

### 练习 1：格式化错误信息

新增 `src/app/formatWorkspaceError.ts`：

```ts
import type { WorkspaceError } from "./loadWorkspace.js";

export function formatWorkspaceError(error: WorkspaceError): string {
  switch (error.kind) {
    case "file-read":
      return `Could not read file: ${error.message}`;
    case "invalid-json":
      return `Invalid JSON syntax: ${error.message}`;
    case "invalid-data":
      return `Invalid workspace data: ${error.message}`;
  }
}
```

然后让 `src/index.ts` 使用这个函数。

### 练习 2：加入 `never` 穷尽检查

把 `formatWorkspaceError` 的 `switch` 改成带 `never` 检查：

```ts
const exhaustive: never = error;
return exhaustive;
```

如果未来给 `WorkspaceError` 增加新 `kind`，TypeScript 应该提醒你更新格式化逻辑。

### 练习 3：加载多个任务文件

让 `loadWorkspace` 支持多个任务文件：

```ts
tasksPaths: string[];
```

要求：

- 用 `Promise.all` 并行读取所有任务文件
- 每个任务文件都用 `parseLearningTasks` 校验
- 最终把多个数组合并成一个 `tasks` 数组
- 任意一个文件失败时返回清晰错误

不要为了这个练习引入测试框架。第 11 章会专门讲测试。

## 常见错误

### 错误 1：忘记 `await`

不要这样：

```ts
const result = loadWorkspace(paths);

if (!result.ok) {
  // result 其实是 Promise，不是 Result
}
```

`loadWorkspace` 是 async 函数，调用时需要：

```ts
const result = await loadWorkspace(paths);
```

### 错误 2：在 domain 层读文件

`src/domain/` 不应该依赖 `node:fs/promises`。domain 层应该描述数据和规则，文件读取属于 node 层。

### 错误 3：吞掉错误

不要这样：

```ts
catch {
  return [];
}
```

这会让程序看起来成功，但数据其实丢了。失败应该显式返回错误。

### 错误 4：把所有错误都变成一个字符串

直接返回字符串虽然简单，但会丢掉错误种类。保留 `kind` 字段可以让入口文件、CLI 或未来测试精确判断失败原因。

### 错误 5：不必要地串行读取

如果配置文件和任务文件互不依赖，可以用 `Promise.all` 并行读取。串行读取不是类型错误，但会让异步流程不够清晰。

## AI Agent 考核指令

完成本章后，在你的项目根目录对 Agent 说：

```text
考核第 10 章作业
```

Agent 应自行读取项目目录、检查 `src/domain/result.ts`、`src/node/readJsonFile.ts`、`src/app/loadWorkspace.ts`、`src/app/formatWorkspaceError.ts`、`src/index.ts`、运行必要命令，并根据本章 rubric 打分。

Agent 还应验证至少一种失败路径，例如坏 JSON 或坏任务数据，确认程序返回清晰错误而不是未处理 stack trace。

## 本章通过标准

你完成本章后，应该满足：

- `readJsonFile` 返回 `Promise<Result<unknown, ReadJsonError>>`
- `loadWorkspace` 返回 `Promise<Result<Workspace, WorkspaceError>>`
- `loadWorkspace` 使用 `Promise.all` 读取互不依赖的文件
- Zod 校验失败会转换成 `invalid-data`
- 文件读取失败会转换成 `file-read`
- JSON 语法错误会转换成 `invalid-json`
- 入口文件根据 `result.ok` 处理成功和失败
- `pnpm typecheck` 通过
- `pnpm build` 通过
- `pnpm start` 通过

下一章会进入 Vitest 测试，把 `formatWorkspaceError`、Zod parser 和核心数据处理逻辑放到自动化测试里。
