# Chapter 09：Zod 校验与 `unknown`

## 本章目标

第 8 章里，你用手写 type guard 检查了 JSON 文件。那种方式能工作，但字段越多，手写检查越容易变长、遗漏、错误信息也不够具体。

本章会引入 Zod，把运行时校验写成 schema：

```ts
const LearningTaskSchema = z.object({
  title: z.string(),
  estimatedMinutes: z.number().positive(),
  status: TaskStatusSchema,
});
```

然后从 schema 推导 TypeScript 类型：

```ts
type LearningTask = z.infer<typeof LearningTaskSchema>;
```

完成本章后，你应该能够回答：

- Zod 解决了第 8 章手写校验的什么问题
- 为什么外部 JSON 仍然要先进入 `unknown`
- `z.object`、`z.array`、`z.enum` 分别适合描述什么
- `z.infer` 如何从 schema 得到 TypeScript 类型
- `parse` 和 `safeParse` 有什么区别
- 为什么 schema 应该靠近 domain 层，而不是散落在入口文件里

本章结束时，你的项目会包含：

```text
typed-toolbox-lab/
  data/
    tasks.json
  src/
    domain/
      task.ts
      index.ts
    node/
      loadTasks.ts
    index.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| Zod schema | 用运行时代码描述外部数据应该长什么样 |
| `z.object` | 校验对象字段 |
| `z.array` | 校验数组元素 |
| `z.enum` | 校验有限字符串集合 |
| `z.infer` | 从 Zod schema 推导 TypeScript 类型 |
| `parse` | 校验失败时直接抛出 Zod 错误 |
| `safeParse` | 返回成功或失败结果，不直接抛出 |

本章仍然不系统讲异步错误处理、测试框架、CLI 或 MCP。你只把第 8 章的手写校验换成 Zod，并让错误数据被更清晰地拒绝。

## 概念解释

### 为什么有了 TypeScript 还需要 Zod

TypeScript 类型在编译时工作。JSON 文件、环境变量、命令行参数、HTTP 响应和 MCP tool 输入，都是运行时才进入程序的数据。

这段类型定义不会自动检查 JSON 文件：

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: "todo" | "doing" | "paused" | "blocked" | "done";
};
```

第 8 章用手写函数补上了运行时检查。本章用 Zod schema 表达同一件事：

```ts
const TaskStatusSchema = z.enum(["todo", "doing", "paused", "blocked", "done"]);

const LearningTaskSchema = z.object({
  title: z.string(),
  estimatedMinutes: z.number().positive(),
  status: TaskStatusSchema,
});
```

schema 是运行时代码，所以它真的会检查外部数据。

### `unknown` 仍然是边界处的默认类型

Zod 不会改变边界原则。外部数据刚进来时，仍然应该先当成 `unknown`：

```ts
const parsed: unknown = JSON.parse(text);
```

然后交给 schema 校验：

```ts
const tasks = LearningTaskListSchema.parse(parsed);
```

这表示：在 Zod 通过校验之前，你不信任这份数据。

### `z.infer` 避免类型和校验重复维护

如果你同时手写 schema 和 type，很容易让两边不同步：

```ts
const LearningTaskSchema = z.object({
  title: z.string(),
  estimatedMinutes: z.number(),
});

type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
};
```

这里 type 里有 `status`，schema 却没有。程序会以 schema 为准，但 TypeScript 类型看起来又像有 `status`，这会制造误导。

更好的方式是从 schema 推导类型：

```ts
export type LearningTask = z.infer<typeof LearningTaskSchema>;
```

这样 schema 是唯一事实来源。

### `parse` 和 `safeParse`

`parse` 适合简单场景：校验失败就抛出错误。

```ts
const tasks = LearningTaskListSchema.parse(parsed);
```

`safeParse` 适合你想自己处理错误的场景：

```ts
const result = LearningTaskListSchema.safeParse(parsed);

if (!result.success) {
  throw new Error(result.error.message);
}

const tasks = result.data;
```

本章最小示例先用 `parse`。练习题会要求你改成 `safeParse`，把 Zod 错误整理成更适合命令行阅读的错误信息。

## 最小示例

先安装 Zod：

```bash
pnpm add zod
```

### 文件 1：`data/tasks.json`

```json
[
  {
    "title": "Replace hand-written guards with Zod",
    "estimatedMinutes": 40,
    "status": "doing"
  },
  {
    "title": "Review schema inference",
    "estimatedMinutes": 25,
    "status": "todo",
    "notes": "z.infer keeps the TypeScript type aligned with the schema"
  }
]
```

### 文件 2：`src/domain/task.ts`

```ts
import { z } from "zod";

export const TaskStatusSchema = z.enum(["todo", "doing", "paused", "blocked", "done"]);

export const LearningTaskSchema = z.object({
  title: z.string().min(1),
  estimatedMinutes: z.number().positive(),
  status: TaskStatusSchema,
  notes: z.string().optional(),
});

export const LearningTaskListSchema = z.array(LearningTaskSchema);

export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type LearningTask = z.infer<typeof LearningTaskSchema>;

export function parseLearningTasks(value: unknown): LearningTask[] {
  return LearningTaskListSchema.parse(value);
}
```

### 文件 3：`src/domain/index.ts`

```ts
export * from "./task.js";
```

### 文件 4：`src/node/loadTasks.ts`

```ts
import { readFile } from "node:fs/promises";
import { parseLearningTasks, type LearningTask } from "../domain/index.js";

export async function loadTasksFromJson(filePath: string): Promise<LearningTask[]> {
  const text = await readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(text);
  return parseLearningTasks(parsed);
}
```

### 文件 5：`src/index.ts`

```ts
import { loadTasksFromJson } from "./node/loadTasks.js";

const tasks = await loadTasksFromJson("data/tasks.json");

console.log(`Loaded tasks: ${tasks.length}`);

for (const task of tasks) {
  const suffix = task.notes === undefined ? "" : ` - ${task.notes}`;
  console.log(`${task.title}: ${task.status} (${task.estimatedMinutes} min)${suffix}`);
}
```

运行：

```bash
pnpm dev
pnpm typecheck
```

你应该看到任务被读取并输出，类型检查也应该通过。

## 项目实践

### Step 1：确认 Node 类型配置仍然存在

第 8 章已经要求 `tsconfig.json` 包含 Node 类型：

```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

如果你是从旧草稿继续，先确认这一项存在。否则 `node:fs/promises` 可能在 `pnpm typecheck` 时无法找到类型。

### Step 2：安装 Zod

在项目根目录运行：

```bash
pnpm add zod
```

安装后，`package.json` 的 `dependencies` 里应该出现 `zod`。

不要手写一个假的 `"zod": "latest"` 依赖。让包管理器写入真实版本。

### Step 3：用 schema 替换手写 type guard

打开 `src/domain/task.ts`，删除第 8 章的 `isTaskStatus` 和 `isLearningTask`，改成 Zod schema。

最终保留这些导出：

```ts
export const TaskStatusSchema = z.enum(["todo", "doing", "paused", "blocked", "done"]);
export const LearningTaskSchema = z.object(...);
export const LearningTaskListSchema = z.array(LearningTaskSchema);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type LearningTask = z.infer<typeof LearningTaskSchema>;
export function parseLearningTasks(value: unknown): LearningTask[];
```

重点不是少写几行代码，而是让运行时校验和 TypeScript 类型来自同一个 schema。

### Step 4：保留 `unknown` 边界

`src/node/loadTasks.ts` 里仍然应该这样写：

```ts
const parsed: unknown = JSON.parse(text);
return parseLearningTasks(parsed);
```

不要写成：

```ts
const parsed = JSON.parse(text) as LearningTask[];
```

那会绕过运行时校验。

### Step 5：运行成功路径

确认 `data/tasks.json` 是合法任务数组，然后运行：

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

四个命令都应该成功。

### Step 6：验证 Zod 会拒绝坏数据

把 `data/tasks.json` 临时改成下面这样：

```json
[
  {
    "title": "Bad task",
    "estimatedMinutes": "thirty",
    "status": "finished"
  }
]
```

再运行：

```bash
pnpm dev
```

程序应该失败，并输出 Zod 的错误信息。你不需要长期保留坏数据；验证后把 JSON 改回合法状态。

这一步很重要：它证明你的程序不是只在好数据上看起来能跑，而是真的能拒绝外部坏数据。

## 练习题

### 练习 1：给任务增加优先级

给任务增加可选字段：

```ts
priority?: "low" | "normal" | "high";
```

要求：

- 用 Zod schema 表达优先级，不要只改 TypeScript type
- `priority` 是可选字段
- `data/tasks.json` 至少有一个任务包含 `priority`
- `src/index.ts` 输出优先级，没有优先级时显示 `normal`

提示：你可以写：

```ts
const TaskPrioritySchema = z.enum(["low", "normal", "high"]);
```

然后在对象 schema 里使用：

```ts
priority: TaskPrioritySchema.optional()
```

### 练习 2：用 `safeParse` 整理错误信息

把 `parseLearningTasks` 改成使用 `safeParse`：

```ts
export function parseLearningTasks(value: unknown): LearningTask[] {
  const result = LearningTaskListSchema.safeParse(value);

  if (!result.success) {
    throw new Error(`Invalid tasks JSON: ${result.error.message}`);
  }

  return result.data;
}
```

然后故意写一个坏 JSON，确认错误信息以 `Invalid tasks JSON:` 开头。

### 练习 3：配置文件 schema

新增一个文件：

```text
data/config.json
```

内容示例：

```json
{
  "projectName": "typed-toolbox-lab",
  "defaultStatus": "todo"
}
```

在 `src/domain/config.ts` 中创建：

```ts
export const AppConfigSchema = z.object({
  projectName: z.string().min(1),
  defaultStatus: TaskStatusSchema,
});

export type AppConfig = z.infer<typeof AppConfigSchema>;
```

在 `src/node/loadConfig.ts` 中读取并校验配置。入口文件不用做复杂功能，只需要能输出项目名即可。

## 常见错误

### 错误 1：写了 schema，但继续手写不一致的 type

不要这样：

```ts
export const LearningTaskSchema = z.object({
  title: z.string(),
});

export type LearningTask = {
  title: string;
  estimatedMinutes: number;
};
```

这样 schema 和 type 会分裂。应该用 `z.infer`。

### 错误 2：绕过 schema

不要这样：

```ts
const parsed = JSON.parse(text) as LearningTask[];
return parsed;
```

这和没有 Zod 差不多。Zod 必须处在外部数据进入程序的边界上。

### 错误 3：把 schema 写在 `src/index.ts`

入口文件应该负责组织程序运行，不应该堆满 domain schema。任务相关 schema 应该放在 `src/domain/task.ts`，配置相关 schema 应该放在 `src/domain/config.ts`。

### 错误 4：把所有字段都写成可选

不要为了让坏 JSON 通过而把字段都写成 `.optional()`。可选字段表示业务上真的可以没有，不是为了逃避校验。

### 错误 5：以为 Zod 会自动读取文件

Zod 只校验 JavaScript 值。读取文件仍然是 Node.js 的工作：

```ts
const text = await readFile(filePath, "utf8");
const parsed: unknown = JSON.parse(text);
const tasks = LearningTaskListSchema.parse(parsed);
```

## AI Agent 考核指令

完成本章后，在你的项目根目录对 Agent 说：

```text
考核第 9 章作业
```

Agent 应自行读取项目目录、检查 `package.json`、`data/tasks.json`、`data/config.json`、`src/domain/task.ts`、`src/domain/config.ts`、`src/node/loadTasks.ts`、`src/node/loadConfig.ts`、`src/index.ts`、运行必要命令，并根据本章 rubric 打分。

你不需要把目录结构、源码和命令输出复制给 Agent。

Agent 可能会口头追问：

- 为什么 `unknown` 仍然应该保留
- 为什么 `z.infer` 比手写 type 更稳
- `parse` 和 `safeParse` 的区别是什么
- 哪些数据应该用 Zod 校验，哪些不需要

## 本章通过标准

你完成本章后，应该满足：

- 项目安装了真实的 `zod` 依赖
- `LearningTask` 和 `AppConfig` 类型都来自 `z.infer`
- JSON 文件读取后先进入 `unknown`
- `parseLearningTasks` 或等价函数确实调用 Zod schema
- 坏任务数据会被 Zod 拒绝
- 坏配置数据会被 Zod 拒绝
- `pnpm dev` 能输出任务和配置
- `pnpm typecheck` 通过
- `pnpm build` 通过
- `pnpm start` 通过

下一章会进入 `async` / `await` 与错误处理，把文件读取、JSON 解析失败和 Zod 校验失败的错误边界拆得更清楚。
