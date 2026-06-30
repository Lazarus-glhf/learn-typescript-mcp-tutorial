# Chapter 08：Node.js、JSON 与运行时边界

## 本章目标

你将第一次让项目读取真实文件：从 `data/tasks.json` 读取任务列表，并把 JSON 数据转换成 TypeScript 可以安全使用的 `LearningTask[]`。

完成本章后，你应该能够回答：

- `node:fs/promises` 用来做什么
- `readFile` 为什么是异步函数
- `JSON.parse` 的结果为什么不能直接信任
- 为什么外部输入应该先当成 `unknown`
- 什么是运行时边界
- 为什么 TypeScript 类型不能自动验证 JSON 文件内容

本章结束时，你的项目会包含：

```text
typed-toolbox-lab/
  data/
    tasks.json
  src/
    node/
      loadTasks.ts
    domain/
      task.ts
      index.ts
    index.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| `node:fs/promises` | Node.js 读取文件的 Promise API |
| `readFile` | 读取文本文件内容 |
| `JSON.parse` | 把 JSON 字符串转成 JavaScript 值 |
| `unknown` | 表示未知外部输入，必须检查后才能使用 |
| type guard | 返回 `value is SomeType` 的运行时检查函数 |
| 运行时边界 | 数据从文件、网络、用户输入进入程序的地方 |

本章暂时不使用 Zod。第 9 章会用 Zod 替代手写检查，让运行时校验更系统。

## 概念解释

### TypeScript 类型不能检查 JSON 文件

你可以在 TypeScript 里写：

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
};
```

但这不会自动保证 `data/tasks.json` 里的内容正确。

JSON 文件是在程序运行时读取的。TypeScript 编译器通常不会逐行检查外部 JSON 数据是否符合你的类型。

所以外部数据进入程序时，要先当作未知值：

```ts
const parsed: unknown = JSON.parse(text);
```

然后再检查它是不是你期望的形状。

### 运行时边界

运行时边界就是数据从程序外部进入程序的地方，例如：

- 读取 JSON 文件
- 读取环境变量
- 接收命令行参数
- 调用 HTTP API
- 接收 MCP tool 输入

这些地方的数据不能只靠 TypeScript 类型相信。你需要运行时检查。

### 读取文件

Node.js 里可以用 `readFile` 读取文本文件：

```ts
import { readFile } from "node:fs/promises";

const text = await readFile("data/tasks.json", "utf8");
```

`readFile` 是异步函数，所以要用 `await`。本章先只用最小的 `await`，第 10 章会系统学习异步和错误处理。

### 手写 type guard

type guard 是一种返回布尔值的函数，但返回类型会告诉 TypeScript：如果函数返回 `true`，这个值就可以视为某种类型。

```ts
function isLearningTask(value: unknown): value is LearningTask {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.title === "string" &&
    typeof task.estimatedMinutes === "number" &&
    isTaskStatus(task.status)
  );
}
```

这里的 `as Record<string, unknown>` 只是为了读取字段，不代表已经信任数据。真正的信任来自后面的字段检查。

## 最小示例

### 文件 1：`data/tasks.json`

```json
[
  {
    "title": "Read tasks from JSON",
    "estimatedMinutes": 45,
    "status": "doing"
  },
  {
    "title": "Review runtime boundaries",
    "estimatedMinutes": 30,
    "status": "todo"
  }
]
```

### 文件 2：`src/domain/task.ts`

```ts
export type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";

export type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
};

export function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    value === "todo" ||
    value === "doing" ||
    value === "paused" ||
    value === "blocked" ||
    value === "done"
  );
}

export function isLearningTask(value: unknown): value is LearningTask {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.title === "string" &&
    typeof task.estimatedMinutes === "number" &&
    isTaskStatus(task.status) &&
    (task.notes === undefined || typeof task.notes === "string")
  );
}

export function parseLearningTasks(value: unknown): LearningTask[] {
  if (!Array.isArray(value)) {
    throw new Error("Expected tasks JSON to be an array");
  }

  if (!value.every(isLearningTask)) {
    throw new Error("Expected every task to match LearningTask");
  }

  return value;
}
```

### 文件 3：`src/node/loadTasks.ts`

```ts
import { readFile } from "node:fs/promises";
import { parseLearningTasks, type LearningTask } from "../domain/index.js";

export async function loadTasksFromJson(filePath: string): Promise<LearningTask[]> {
  const text = await readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(text);
  return parseLearningTasks(parsed);
}
```

### 文件 4：`src/domain/index.ts`

```ts
export * from "./task.js";
```

### 文件 5：`src/index.ts`

```ts
import { loadTasksFromJson } from "./node/loadTasks.js";

const tasks = await loadTasksFromJson("data/tasks.json");

console.log(`Loaded tasks: ${tasks.length}`);

for (const task of tasks) {
  console.log(`${task.title}: ${task.status} (${task.estimatedMinutes} min)`);
}
```

运行：

```bash
pnpm dev
```

期望输出：

```text
Loaded tasks: 2
Read tasks from JSON: doing (45 min)
Review runtime boundaries: todo (30 min)
```

再运行：

```bash
pnpm typecheck
pnpm build
pnpm start
```

## 项目实践

本章使用独立作业目录。在教程仓库根目录运行下面命令，先从上一章作业复制一份到本章：

```bash
mkdir -p works/chapter08
cp -R works/chapter07/typed-toolbox-lab works/chapter08/typed-toolbox-lab
cd works/chapter08/typed-toolbox-lab
```

Windows PowerShell 可以运行：

```powershell
New-Item -ItemType Directory -Force works/chapter08
Copy-Item -Recurse works/chapter07/typed-toolbox-lab works/chapter08/typed-toolbox-lab
Set-Location works/chapter08/typed-toolbox-lab
```

### Step 1：确认 `tsconfig.json` 启用了 Node 类型

第 8 章会使用 `node:fs/promises`。确认 `tsconfig.json` 的 `compilerOptions` 中包含：

```json
"types": ["node"]
```

如果没有这一项，`pnpm typecheck` 可能会报：

```text
Cannot find name 'node:fs/promises'
```

### Step 2：创建 `data/tasks.json`

在本章作业目录 `works/chapter08/typed-toolbox-lab` 中创建 `data/tasks.json`，写入最小示例中的任务数组。

### Step 3：更新 `src/domain/task.ts`

添加：

- `isTaskStatus(value: unknown): value is TaskStatus`
- `isLearningTask(value: unknown): value is LearningTask`
- `parseLearningTasks(value: unknown): LearningTask[]`

### Step 4：创建 `src/node/loadTasks.ts`

用 `readFile` 读取文件，用 `JSON.parse` 解析，并把解析结果先标为 `unknown`。

### Step 5：更新 `src/index.ts`

使用顶层 `await` 加载任务并输出。

### Step 6：运行完整验证

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

### Step 7：制造一个坏 JSON 数据错误

临时把 `data/tasks.json` 中某个任务改成：

```json
{
  "title": "Broken task",
  "estimatedMinutes": "45",
  "status": "doing"
}
```

运行：

```bash
pnpm dev
```

你应该看到运行时报错：

```text
Expected every task to match LearningTask
```

把 `"45"` 改回数字 `45`。

### Step 8：制造一个 TypeScript 边界错误

临时把 `loadTasksFromJson` 改成：

```ts
const parsed = JSON.parse(text);
return parsed;
```

这可能不会立刻报错，因为 `JSON.parse` 在 TypeScript 标准库中返回 `any`。这正是危险点：`any` 会跳过类型检查。

修复方式是显式写成：

```ts
const parsed: unknown = JSON.parse(text);
return parseLearningTasks(parsed);
```

## 练习题

### 必做练习 1：支持可选 notes

给 `data/tasks.json` 的其中一个任务添加：

```json
"notes": "Loaded from JSON"
```

确认 `isLearningTask` 接受 `notes` 为字符串，也接受没有 `notes` 的任务。

### 必做练习 2：添加 `loadTasksSummary`

在 `src/node/loadTasks.ts` 中新增：

```ts
export async function loadTasksSummary(filePath: string): Promise<string> {
  const tasks = await loadTasksFromJson(filePath);
  return `Loaded ${tasks.length} tasks from ${filePath}`;
}
```

在 `src/index.ts` 中输出它。

### 必做练习 3：处理非数组 JSON

临时把 `data/tasks.json` 改成一个对象：

```json
{
  "title": "Not an array"
}
```

运行 `pnpm dev`，确认会报：

```text
Expected tasks JSON to be an array
```

然后恢复数组。

### 加分练习：添加 `data/config.json`

创建一个简单配置文件：

```json
{
  "projectName": "typed-toolbox-lab",
  "defaultTaskStatus": "todo"
}
```

手写 `isConfig` 和 `loadConfigFromJson`。不要引入 Zod，第 9 章会讲。

### 快速判断题

#### 题 1

为什么 `JSON.parse` 的结果不应该直接当成 `LearningTask[]`？

#### 题 2

`unknown` 和 `any` 的区别是什么？

#### 题 3

为什么 TypeScript 类型不能自动保证外部 JSON 文件内容正确？

## 常见错误

### 错误 1：直接相信 `JSON.parse`

不要写：

```ts
const tasks: LearningTask[] = JSON.parse(text);
```

这会让错误数据混进程序。

### 错误 2：把 `unknown` 强转成目标类型

不要写：

```ts
return parsed as LearningTask[];
```

类型断言不会检查运行时数据。应该用 `parseLearningTasks` 做字段检查。

### 错误 3：忘记 `readFile` 是异步的

`readFile` 返回 Promise，所以要写：

```ts
const text = await readFile(filePath, "utf8");
```

### 错误 4：在 domain 层读取文件

`src/domain/task.ts` 应该只处理任务类型和检查逻辑。读取文件放在 `src/node/loadTasks.ts`。

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter08/typed-toolbox-lab`，然后在仓库根目录或该章节目录里对 AI Agent 说：

```text
考核第 8 章作业
```

或者：

```text
检查 chapter-08
```

Agent 应自行读取项目目录、检查 `data/tasks.json`、`src/domain/task.ts`、`src/node/loadTasks.ts`、`src/index.ts`、运行必要命令，并根据本章 rubric 打分。

Agent 可能会追问你 1-3 个短问题，确认你是否理解：

- 为什么外部 JSON 是运行时边界
- 为什么 `unknown` 比 `any` 更安全
- 为什么第 9 章会引入 Zod

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 9 章。

如果低于 75 分，先根据反馈修正本章项目，再重新考核。
