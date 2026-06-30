# Chapter 07：泛型入门与可复用函数

## 本章目标

你将学习 TypeScript 泛型的最小实用用法：让函数在保持类型安全的前提下复用。第 6 章里你已经写过 `LearningTask[]` 查询函数；本章会把一部分“列表工具”和“结果类型”抽象成可复用写法。

完成本章后，你应该能够回答：

- 泛型里的 `T` 表示什么
- 为什么 `firstOrDefault<T>` 能保留数组元素类型
- `K extends keyof T` 约束解决什么问题
- `Result<T, E>` 如何表达成功或失败
- 为什么泛型不是“把所有类型写成 any”

本章结束时，你的项目会包含：

```text
src/
  domain/
    task.ts
    result.ts
    collection.ts
    index.ts
  index.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| 泛型函数 | 让函数在不同类型上复用，同时保留类型信息 |
| 泛型类型别名 | 让类型结构接收类型参数，例如 `Result<T, E>` |
| 类型约束 | 限制泛型参数必须满足某些条件 |
| `keyof` | 获取对象类型的字段名联合 |
| `K extends keyof T` | 限制字段名必须来自对象本身 |

本章仍然不引入 JSON、Zod、异步、测试、CLI 或 MCP。

## 概念解释

### 为什么需要泛型

如果你写一个获取数组第一项的函数，可能会先写成：

```ts
function firstTask(tasks: LearningTask[]): LearningTask | undefined {
  return tasks[0];
}
```

这个函数只能处理 `LearningTask[]`。如果以后要处理 `string[]`、`number[]` 或其它对象数组，就要重复写很多版本。

泛型可以写成：

```ts
function firstOrDefault<T>(items: T[]): T | undefined {
  return items[0];
}
```

这里 `T` 是类型参数。调用时，TypeScript 会根据传入数组推断 `T` 是什么。

```ts
const firstTitle = firstOrDefault(["a", "b"]);
// 类型是 string | undefined

const firstNumber = firstOrDefault([1, 2]);
// 类型是 number | undefined
```

### 泛型不是 `any`

`any` 会让 TypeScript 放弃检查：

```ts
function first(items: any[]): any {
  return items[0];
}
```

这个函数返回什么都不知道。你可以对结果做任何事，TypeScript 很难帮你发现错误。

泛型不同。泛型会记住输入和输出之间的关系：

```ts
function firstOrDefault<T>(items: T[]): T | undefined {
  return items[0];
}
```

如果输入是 `LearningTask[]`，输出就是 `LearningTask | undefined`。

### 泛型类型别名

泛型不只用于函数，也可以用于类型：

```ts
export type Result<T, E> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };
```

这表示：

- 成功时携带 `T` 类型的数据
- 失败时携带 `E` 类型的错误

例如：

```ts
type TaskLookupResult = Result<LearningTask, string>;
```

成功时 `data` 是 `LearningTask`，失败时 `error` 是 `string`。

### `keyof` 和字段名约束

假设你想写一个函数，从对象里读取某个字段：

```ts
function getProperty<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}
```

这段代码里的意思是：

- `T` 是对象类型
- `K` 必须是 `T` 的字段名之一
- 返回值类型是 `T[K]`，也就是该字段对应的类型

如果对象是：

```ts
const task = {
  title: "Learn generics",
  estimatedMinutes: 45,
};
```

那么：

```ts
getProperty(task, "title");
```

返回 `string`。

```ts
getProperty(task, "estimatedMinutes");
```

返回 `number`。

下面这个会报错：

```ts
getProperty(task, "missing");
```

因为 `"missing"` 不是任务对象的字段。

## 最小示例

本章新增两个文件：`src/domain/result.ts` 和 `src/domain/collection.ts`。

### 文件 1：`src/domain/result.ts`

```ts
export type Result<T, E> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

export function formatResult<T, E>(result: Result<T, E>): string {
  if (result.success) {
    return `Success: ${String(result.data)}`;
  }

  return `Failed: ${String(result.error)}`;
}
```

### 文件 2：`src/domain/collection.ts`

```ts
export function firstOrDefault<T>(items: T[]): T | undefined {
  return items[0];
}

export function getProperty<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}
```

### 更新 `src/domain/index.ts`

```ts
export * from "./task.js";
export * from "./collection.js";
export * from "./result.js";
```

### 更新 `src/index.ts`

```ts
import {
  firstOrDefault,
  formatResult,
  getProperty,
  type LearningTask,
  type Result,
} from "./domain/index.js";

const tasks: LearningTask[] = [
  {
    title: "Practice generics",
    estimatedMinutes: 45,
    status: "doing",
  },
  {
    title: "Review array helpers",
    estimatedMinutes: 30,
    status: "done",
  },
];

const firstTask = firstOrDefault(tasks);
const firstTitle = firstTask ? getProperty(firstTask, "title") : "No task";

const lookupResult: Result<string, string> = firstTask
  ? { success: true, data: firstTitle }
  : { success: false, error: "No tasks found" };

console.log(`First title: ${firstTitle}`);
console.log(formatResult(lookupResult));
console.log(`First number: ${firstOrDefault([10, 20, 30])}`);
```

运行：

```bash
pnpm dev
```

期望输出：

```text
First title: Practice generics
Success: Practice generics
First number: 10
```

再运行：

```bash
pnpm typecheck
```

## 项目实践

按 README 的统一作业规则准备本章目录：`works/chapter07/typed-toolbox-lab`。

### Step 1：创建 `src/domain/result.ts`

把 `Result<T, E>` 和 `formatResult` 放进去。

### Step 2：创建 `src/domain/collection.ts`

把 `firstOrDefault<T>` 和 `getProperty<T, K extends keyof T>` 放进去。

### Step 3：更新 `src/domain/index.ts`

导出新模块：

```ts
export * from "./collection.js";
export * from "./result.js";
```

### Step 4：更新 `src/index.ts`

创建任务数组，并调用 `firstOrDefault`、`getProperty`、`formatResult`。

### Step 5：运行完整验证

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

### Step 6：制造一个非法字段名错误

临时写：

```ts
getProperty(firstTask, "missing");
```

运行：

```bash
pnpm typecheck
```

你应该看到 TypeScript 报错，因为 `"missing"` 不是 `LearningTask` 的字段。

### Step 7：制造一个 Result 形状错误

临时写：

```ts
const badResult: Result<string, string> = {
  success: true,
  error: "Wrong field",
};
```

运行类型检查。你应该看到成功分支不能使用 `error` 字段。

## 练习题

### 必做练习 1：实现 `lastOrDefault`

在 `src/domain/collection.ts` 中新增：

```ts
export function lastOrDefault<T>(items: T[]): T | undefined {
  return items[items.length - 1];
}
```

在 `src/index.ts` 中对 `tasks` 和 `number[]` 各调用一次。

### 必做练习 2：实现 `makeSuccess` 和 `makeFailure`

在 `src/domain/result.ts` 中新增：

```ts
export function makeSuccess<T, E>(data: T): Result<T, E> {
  return { success: true, data };
}

export function makeFailure<T, E>(error: E): Result<T, E> {
  return { success: false, error };
}
```

用它们创建成功和失败结果。

### 必做练习 3：实现 `pluck`

在 `src/domain/collection.ts` 中新增：

```ts
export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}
```

用它获取任务标题数组。

### 加分练习：用泛型改写任务查找结果

新增函数：

```ts
export function findTaskTitleResult(tasks: LearningTask[], title: string): Result<LearningTask, string> {
  const task = tasks.find((item) => item.title === title);

  if (task) {
    return { success: true, data: task };
  }

  return { success: false, error: `Task not found: ${title}` };
}
```

### 快速判断题

#### 题 1

`firstOrDefault(["a", "b"])` 的返回值类型是什么？

#### 题 2

为什么 `getProperty(task, "missing")` 会报错？

#### 题 3

泛型和 `any` 的核心区别是什么？

## 常见错误

### 错误 1：把泛型写成 `any`

```ts
function first(items: any[]): any {
  return items[0];
}
```

这会丢掉类型关系。本章应使用：

```ts
function firstOrDefault<T>(items: T[]): T | undefined {
  return items[0];
}
```

### 错误 2：忘记处理 `undefined`

`firstOrDefault` 对空数组会返回 `undefined`，调用处仍然要判断。

### 错误 3：`getProperty` 的 key 没有约束

不要写：

```ts
function getProperty<T>(item: T, key: string) {
  return item[key];
}
```

`key` 应该被限制为 `K extends keyof T`。

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter07/typed-toolbox-lab`，然后在仓库根目录或该章节目录里对 AI Agent 说：

```text
考核第 7 章作业
```

或者：

```text
检查 chapter-07
```

Agent 应自行读取项目目录、检查 `src/domain/collection.ts`、`src/domain/result.ts`、`src/index.ts`、运行必要命令，并根据本章 rubric 打分。

Agent 可能会追问你 1-3 个短问题，确认你是否理解：

- 泛型如何保留输入和输出类型关系
- `K extends keyof T` 为什么能限制字段名
- 为什么泛型不是 `any`

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 8 章。

如果低于 75 分，先根据反馈修正本章项目，再重新考核。
