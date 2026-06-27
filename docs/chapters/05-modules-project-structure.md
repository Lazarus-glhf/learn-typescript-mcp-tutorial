# Chapter 05：模块系统与项目拆分

## 本章目标

你将把前几章都写在 `src/index.ts` 里的代码，拆成几个小模块。模块系统的目标不是让项目看起来复杂，而是让类型、业务函数和入口文件各自有清楚的位置。

完成本章后，你应该能够回答：

- `export` 的作用是什么
- `import` 的作用是什么
- 为什么 NodeNext 配置下相对导入要写 `.js` 扩展名
- `export type` 和普通 `export` 有什么直观区别
- 为什么入口文件 `src/index.ts` 不应该塞满所有业务逻辑
- 如何从一个模块导入类型和函数

本章结束时，你的项目会从单文件变成多文件结构：

```text
typed-toolbox-lab/
  src/
    index.ts
    domain/
      task.ts
    app/
      formatters.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| 模块 | 每个 `.ts` 文件都可以是一个模块 |
| `export` | 从当前文件暴露值或函数，供其它文件使用 |
| `export type` | 从当前文件暴露类型，编译后不会变成运行时代码 |
| `import` | 从其它模块引入类型、函数或常量 |
| 相对路径导入 | 用 `./` 或 `../` 引入项目内文件 |
| 目录分层 | 把 domain 类型和 app 输出逻辑分开 |

本章仍然不引入数组、泛型、Zod、测试或 CLI。你只是把已经学过的类型和函数移动到更合理的位置。

## 概念解释

### 为什么要拆模块

前几章为了降低学习负担，所有代码都写在：

```text
src/index.ts
```

当代码只有几十行时，这没有问题。但随着类型、函数和输出越来越多，单文件会变得难读。

模块拆分可以让文件职责更清楚：

```text
src/domain/task.ts       任务相关类型和纯函数
src/app/formatters.ts    面向输出展示的格式化函数
src/index.ts             程序入口，组织数据并调用函数
```

### `export` 暴露函数和值

假设 `src/domain/task.ts` 里有函数：

```ts
export function formatStatus(status: TaskStatus): string {
  // ...
}
```

`export` 表示这个函数可以被其它文件导入。

### `export type` 暴露类型

类型只存在于 TypeScript 编译期，运行后的 JavaScript 里没有类型。

```ts
export type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";
```

这表示其它文件可以使用 `TaskStatus` 这个类型。

### `import` 引入类型和函数

在另一个文件中可以这样导入：

```ts
import { formatStatus, type LearningTask } from "../domain/task.js";
```

这里有两个细节：

- `formatStatus` 是运行时函数，用普通导入
- `LearningTask` 是类型，用 `type` 标记为类型导入

### 为什么导入路径写 `.js`

你的 `tsconfig.json` 使用的是：

```json
"module": "NodeNext",
"moduleResolution": "NodeNext"
```

这更接近真实 Node.js ESM 的运行方式。TypeScript 源文件是 `.ts`，但编译后 Node.js 实际运行的是 `.js`。

所以在 TypeScript 源码里写相对导入时，推荐写编译后的扩展名：

```ts
import { formatStatus } from "./domain/task.js";
```

不要写：

```ts
import { formatStatus } from "./domain/task";
```

在 `NodeNext` 配置下，这通常会导致类型检查或运行时出错。

## 最小示例

本章需要创建三个文件。

### 文件 1：`src/domain/task.ts`

```ts
export type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";

export type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
};

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
```

### 文件 2：`src/app/formatters.ts`

```ts
import { formatStatus, type LearningTask } from "../domain/task.js";

export function formatTaskSummary(task: LearningTask): string {
  return `${task.title} - ${formatStatus(task.status)} - ${task.estimatedMinutes} min`;
}

export function formatTaskNotes(task: LearningTask): string {
  if (task.notes) {
    return `Notes: ${task.notes}`;
  }

  return "Notes: none";
}
```

### 文件 3：`src/index.ts`

```ts
import { formatTaskNotes, formatTaskSummary } from "./app/formatters.js";
import type { LearningTask } from "./domain/task.js";

const task: LearningTask = {
  title: "Split code into modules",
  estimatedMinutes: 40,
  status: "doing",
  notes: "Move task types and formatters out of index.ts",
};

console.log(formatTaskSummary(task));
console.log(formatTaskNotes(task));
```

运行：

```bash
pnpm dev
```

期望输出：

```text
Split code into modules - in progress - 40 min
Notes: Move task types and formatters out of index.ts
```

再运行类型检查：

```bash
pnpm typecheck
```

如果没有类型错误，命令会正常结束。

## 项目实践

### Step 1：创建目录

在 `typed-toolbox-lab` 项目中创建目录：

```bash
mkdir -p src/domain src/app
```

Windows PowerShell 可以运行：

```powershell
New-Item -ItemType Directory -Force src/domain, src/app
```

### Step 2：创建 `src/domain/task.ts`

把任务状态、任务对象类型和 `formatStatus` 放进 `src/domain/task.ts`。

这个文件只关心任务领域本身，不负责 `console.log`。

### Step 3：创建 `src/app/formatters.ts`

把面向输出的格式化函数放进 `src/app/formatters.ts`。

这个文件从 `../domain/task.js` 导入 `LearningTask` 和 `formatStatus`。

### Step 4：简化 `src/index.ts`

让 `src/index.ts` 只做三件事：

1. 导入函数和类型
2. 创建示例任务对象
3. 输出结果

### Step 5：运行项目

```bash
pnpm dev
```

你应该看到任务摘要和备注。

### Step 6：运行类型检查

```bash
pnpm typecheck
```

如果通过，说明模块导入导出关系正确。

### Step 7：运行编译和编译产物

```bash
pnpm build
pnpm start
```

这一步很重要，因为模块路径写错时，开发期和编译产物可能表现不同。本章需要确认编译后的 `dist/index.js` 也能运行。

### Step 8：制造一个导入路径错误

临时把 `src/index.ts` 里的导入改成：

```ts
import { formatTaskNotes, formatTaskSummary } from "./app/formatters";
```

也就是去掉 `.js`。

运行：

```bash
pnpm typecheck
```

在 `NodeNext` 配置下，你应该看到类似错误：

```text
Relative import paths need explicit file extensions
```

修复方式是改回：

```ts
import { formatTaskNotes, formatTaskSummary } from "./app/formatters.js";
```

## 练习题

### 必做练习 1：增加任务判断函数

在 `src/domain/task.ts` 中新增：

```ts
export function isTaskDone(task: LearningTask): boolean {
  return task.status === "done";
}
```

然后在 `src/app/formatters.ts` 中导入它，并新增：

```ts
export function formatDoneLabel(task: LearningTask): string {
  return isTaskDone(task) ? "Done: yes" : "Done: no";
}
```

最后在 `src/index.ts` 中输出 `formatDoneLabel(task)`。

### 必做练习 2：增加学习者模块

创建新文件：

```text
src/domain/learner.ts
```

写入：

```ts
export type LearnerProfile = {
  name: string;
  currentChapter: number;
};

export function formatLearner(profile: LearnerProfile): string {
  return `${profile.name} is studying chapter ${profile.currentChapter}`;
}
```

在 `src/index.ts` 中导入并输出学习者信息。

### 必做练习 3：整理入口文件

完成前两个练习后，`src/index.ts` 应该只保留：

- `import` 语句
- 示例对象
- `console.log` 调用

不要把类型定义和业务函数继续写在 `src/index.ts` 里。

### 加分练习：新增 barrel 文件

创建：

```text
src/domain/index.ts
```

写入：

```ts
export * from "./task.js";
export * from "./learner.js";
```

然后让 `src/index.ts` 从 `./domain/index.js` 导入类型和函数。

要求：

- `pnpm typecheck` 通过
- `pnpm build` 通过
- `pnpm start` 能运行

### 快速判断题

这些题不要求写进代码。Agent 考核时可能会抽问。

#### 题 1

在 `NodeNext` 配置下，为什么推荐写：

```ts
import { formatStatus } from "./domain/task.js";
```

而不是：

```ts
import { formatStatus } from "./domain/task";
```

#### 题 2

`import type { LearningTask } from "./domain/task.js";` 中的 `type` 表示什么？

#### 题 3

为什么 `src/index.ts` 适合做入口文件，而不适合长期放所有类型和业务函数？

## 常见错误

### 错误 1：相对导入忘记 `.js`

在 `NodeNext` 配置下，这样写通常会出错：

```ts
import { formatTaskSummary } from "./app/formatters";
```

应该写：

```ts
import { formatTaskSummary } from "./app/formatters.js";
```

### 错误 2：忘记 export

如果 `src/domain/task.ts` 里写了函数但没有 `export`：

```ts
function formatStatus(status: TaskStatus): string {
  return status;
}
```

其它文件就不能导入它。需要写成：

```ts
export function formatStatus(status: TaskStatus): string {
  return status;
}
```

### 错误 3：把类型当成运行时值使用

类型在编译后会消失。你可以这样导入类型：

```ts
import type { LearningTask } from "./domain/task.js";
```

但不要期待 `LearningTask` 在运行时存在。

### 错误 4：拆模块后入口文件还是很重

如果所有类型和函数都还在 `src/index.ts`，只是多创建了空文件，那不算完成本章目标。

本章要达成的是职责分离：

```text
domain：类型和纯逻辑
app：展示格式化
index：入口组织
```

## AI Agent 考核指令

完成本章后，在你的练习项目目录里对 AI Agent 说：

```text
考核第 5 章作业
```

或者：

```text
检查 chapter-05
```

Agent 应自行读取项目目录、检查 `src/domain/`、`src/app/`、`src/index.ts`、运行必要命令，并根据本章 rubric 打分。你不需要把目录结构、源码和命令输出手动复制给 Agent。

Agent 可能会追问你 1-3 个短问题，确认你是否理解：

- 为什么相对导入路径要写 `.js`
- `export type` / `import type` 的用途
- 为什么要把入口文件和领域逻辑分开

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 6 章。

如果低于 75 分，先根据反馈修正本章项目，再重新考核。
