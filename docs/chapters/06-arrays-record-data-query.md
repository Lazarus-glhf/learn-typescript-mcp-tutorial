# Chapter 06：数组、Record 与数据查询

## 本章目标

你将把前几章的单个任务对象扩展成任务列表，并学习用数组方法查询、过滤和统计数据。

完成本章后，你应该能够回答：

- `LearningTask[]` 表示什么
- `map`、`filter`、`find`、`reduce` 分别适合做什么
- 为什么 `find` 的结果可能是 `undefined`
- `Record<TaskStatus, number>` 表示什么
- 如何把任务列表按状态统计

本章结束时，你的项目会继续沿用第 5 章模块结构：

```text
src/
  index.ts
  domain/
    task.ts
    learner.ts
    index.ts
  app/
    formatters.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| 数组类型 | 表示一组同类型数据，例如 `LearningTask[]` |
| `map` | 把数组中的每一项转换成新数组 |
| `filter` | 只保留符合条件的项 |
| `find` | 找到第一个符合条件的项，可能返回 `undefined` |
| `reduce` | 把数组汇总成一个结果 |
| `Record<K, V>` | 描述“键到值”的对象映射 |

本章仍然不引入泛型自定义、JSON、Zod、测试、CLI 或 MCP。你会先用内存里的任务数组练习数据处理。

## 概念解释

### 数组类型

如果一个变量保存多个任务，可以写成：

```ts
const tasks: LearningTask[] = [
  {
    title: "Split code into modules",
    estimatedMinutes: 40,
    status: "done",
  },
  {
    title: "Practice array methods",
    estimatedMinutes: 50,
    status: "doing",
  },
];
```

`LearningTask[]` 表示：这是一个数组，数组里的每一项都必须是 `LearningTask`。

### `map`：转换每一项

`map` 适合把每个任务转换成一段文本：

```ts
const titles = tasks.map((task) => task.title);
```

结果是 `string[]`。

这里第一次出现了 `=>`。它叫箭头函数，常用来写一个很短的函数。

```ts
(task) => task.title
```

可以先按两段理解：

- `task` 是当前正在处理的数组项
- `task.title` 是这个小函数返回的结果

所以这段代码的意思是：对 `tasks` 里的每一个 `task`，取出它的 `title`。

如果写成普通函数，它大致等价于：

```ts
function getTitle(task: LearningTask): string {
  return task.title;
}
```

在 `map`、`filter`、`find`、`reduce` 这些数组方法里，箭头函数经常用来描述“对每一项要做什么”。

### `filter`：筛选一部分

`filter` 适合筛选出某种状态的任务：

```ts
const doingTasks = tasks.filter((task) => task.status === "doing");
```

结果仍然是 `LearningTask[]`。

### `find`：找到一个或没有

`find` 找到第一个符合条件的任务：

```ts
const task = tasks.find((task) => task.title === "Practice array methods");
```

注意：它可能找不到，所以结果类型是：

```ts
LearningTask | undefined
```

读取之前要先判断：

```ts
if (task) {
  console.log(task.title);
}
```

### `reduce`：汇总成一个结果

`reduce` 可以把任务列表汇总成总分钟数：

```ts
const totalMinutes = tasks.reduce((total, task) => total + task.estimatedMinutes, 0);
```

### `Record`：状态统计对象

如果你要统计每种状态有多少任务，可以用：

```ts
type TaskStatusCount = Record<TaskStatus, number>;
```

它表示：每一个 `TaskStatus` 都对应一个数字。

## 最小示例

本章会修改 `src/domain/task.ts` 和 `src/index.ts`。

### 文件 1：`src/domain/task.ts`

```ts
export type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";

export type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
};

export type TaskStatusCount = Record<TaskStatus, number>;

export function formatStatus(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "not started";
    case "doing":
      return "in progress";
    case "paused":
      return "paused";
    case "blocked":
      return "blocked";
    case "done":
      return "completed";
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
}

export function getTaskTitles(tasks: LearningTask[]): string[] {
  return tasks.map((task) => task.title);
}

export function filterTasksByStatus(tasks: LearningTask[], status: TaskStatus): LearningTask[] {
  return tasks.filter((task) => task.status === status);
}

export function findTaskByTitle(tasks: LearningTask[], title: string): LearningTask | undefined {
  return tasks.find((task) => task.title === title);
}

export function getTotalEstimatedMinutes(tasks: LearningTask[]): number {
  return tasks.reduce((total, task) => total + task.estimatedMinutes, 0);
}

export function countTasksByStatus(tasks: LearningTask[]): TaskStatusCount {
  const counts: TaskStatusCount = {
    todo: 0,
    doing: 0,
    paused: 0,
    blocked: 0,
    done: 0,
  };

  for (const task of tasks) {
    counts[task.status] += 1;
  }

  return counts;
}
```

### 文件 2：`src/index.ts`

```ts
import {
  countTasksByStatus,
  filterTasksByStatus,
  findTaskByTitle,
  getTaskTitles,
  getTotalEstimatedMinutes,
  type LearningTask,
} from "./domain/index.js";

const tasks: LearningTask[] = [
  {
    title: "Split code into modules",
    estimatedMinutes: 40,
    status: "done",
  },
  {
    title: "Practice array methods",
    estimatedMinutes: 50,
    status: "doing",
  },
  {
    title: "Review type narrowing",
    estimatedMinutes: 30,
    status: "todo",
  },
];

const foundTask = findTaskByTitle(tasks, "Practice array methods");

console.log(`Titles: ${getTaskTitles(tasks).join(", ")}`);
console.log(`Doing count: ${filterTasksByStatus(tasks, "doing").length}`);
console.log(`Total minutes: ${getTotalEstimatedMinutes(tasks)}`);

if (foundTask) {
  console.log(`Found: ${foundTask.title}`);
}

console.log(`Done count: ${countTasksByStatus(tasks).done}`);
```

运行：

```bash
pnpm dev
```

期望输出：

```text
Titles: Split code into modules, Practice array methods, Review type narrowing
Doing count: 1
Total minutes: 120
Found: Practice array methods
Done count: 1
```

再运行类型检查：

```bash
pnpm typecheck
```

如果没有类型错误，命令会正常结束。

## 项目实践

按 README 的统一作业规则准备本章目录：`works/chapter06/typed-toolbox-lab`。

### Step 1：确认第 5 章结构存在

项目中应该至少有：

```text
src/
  index.ts
  domain/
    task.ts
    index.ts
  app/
    formatters.ts
```

### Step 2：更新 `src/domain/task.ts`

把任务数组相关函数放到 `src/domain/task.ts`：

- `getTaskTitles`
- `filterTasksByStatus`
- `findTaskByTitle`
- `getTotalEstimatedMinutes`
- `countTasksByStatus`

这些函数都只处理数据，不负责 `console.log`。

### Step 3：确认 `src/domain/index.ts` 导出任务模块

如果你在第 5 章创建了 barrel 文件，确保它包含：

```ts
export * from "./task.js";
```

### Step 4：更新 `src/index.ts`

在入口文件里创建 `tasks: LearningTask[]`，然后调用查询和统计函数输出结果。

### Step 5：运行项目

```bash
pnpm dev
```

确认输出包含任务标题、进行中数量、总分钟数、找到的任务和完成数量。

### Step 6：运行类型检查

```bash
pnpm typecheck
```

### Step 7：运行编译和编译产物

```bash
pnpm build
pnpm start
```

本章继续要求编译后的 `dist/index.js` 也能运行。

### Step 8：制造一个 `find` 未判断错误

临时把代码改成：

```ts
const foundTask = findTaskByTitle(tasks, "Missing task");
console.log(foundTask.title);
```

运行：

```bash
pnpm typecheck
```

你应该看到类似错误：

```text
'foundTask' is possibly 'undefined'.
```

修复方式是先判断：

```ts
if (foundTask) {
  console.log(foundTask.title);
}
```

### Step 9：制造一个 `Record` 缺字段错误

临时把 `countTasksByStatus` 里的 `counts` 改成缺少 `blocked`：

```ts
const counts: TaskStatusCount = {
  todo: 0,
  doing: 0,
  paused: 0,
  done: 0,
};
```

运行：

```bash
pnpm typecheck
```

你应该看到 TypeScript 报错，因为 `Record<TaskStatus, number>` 要求每个状态都有对应数字。

## 练习题

### 必做练习 1：查询长任务

在 `src/domain/task.ts` 中新增：

```ts
export function filterLongTasks(tasks: LearningTask[], minimumMinutes: number): LearningTask[] {
  return tasks.filter((task) => task.estimatedMinutes >= minimumMinutes);
}
```

在 `src/index.ts` 中输出长任务数量。

### 必做练习 2：查找第一个 blocked 任务

新增：

```ts
export function findFirstBlockedTask(tasks: LearningTask[]): LearningTask | undefined {
  return tasks.find((task) => task.status === "blocked");
}
```

在 `src/index.ts` 中调用它，并用 `if` 判断后输出标题。

### 必做练习 3：格式化状态统计

新增：

```ts
export function formatStatusCount(counts: TaskStatusCount): string {
  return `todo=${counts.todo}, doing=${counts.doing}, paused=${counts.paused}, blocked=${counts.blocked}, done=${counts.done}`;
}
```

在入口文件里输出这个统计文本。

### 加分练习：按状态判断是否还有未完成任务

新增：

```ts
export function hasOpenTasks(tasks: LearningTask[]): boolean {
  return tasks.some((task) => task.status !== "done");
}
```

`some` 会在数组中只要找到一个符合条件的项就返回 `true`。

### 快速判断题

这些题不要求写进代码。Agent 考核时可能会抽问。

#### 题 1

为什么 `findTaskByTitle` 的返回值不是 `LearningTask`，而是 `LearningTask | undefined`？

#### 题 2

`filterTasksByStatus(tasks, "doing")` 的返回值为什么仍然是数组？

#### 题 3

`Record<TaskStatus, number>` 为什么要求 `todo`、`doing`、`paused`、`blocked`、`done` 都存在？

## 常见错误

### 错误 1：没有判断 `find` 的结果

`find` 可能找不到任务，所以不能直接读取：

```ts
const task = findTaskByTitle(tasks, "Missing task");
console.log(task.title);
```

要先判断：

```ts
if (task) {
  console.log(task.title);
}
```

### 错误 2：把 `map` 和 `filter` 搞混

`map` 用来转换每一项，结果数组长度通常不变。`filter` 用来筛选一部分，结果数组长度可能变短。

### 错误 3：`Record` 缺少某个状态

如果 `TaskStatus` 有 `"blocked"`，那么 `Record<TaskStatus, number>` 也必须有 `blocked`。

### 错误 4：在 domain 函数里直接输出

本章的 `src/domain/task.ts` 应该只返回数据，不直接 `console.log`。输出放在 `src/index.ts` 或 app 层。

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter06/typed-toolbox-lab`，然后在仓库根目录或该章节目录里对 AI Agent 说：

```text
考核第 6 章作业
```

或者：

```text
检查 chapter-06
```

Agent 应自行读取项目目录、检查 `src/domain/task.ts`、`src/index.ts`、运行必要命令，并根据本章 rubric 打分。你不需要把目录结构、源码和命令输出手动复制给 Agent。

Agent 可能会追问你 1-3 个短问题，确认你是否理解：

- 为什么 `find` 可能返回 `undefined`
- `map` / `filter` / `reduce` 的分工
- `Record<TaskStatus, number>` 为什么能约束所有状态

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 7 章。

如果低于 75 分，先根据反馈修正本章项目，再重新考核。
