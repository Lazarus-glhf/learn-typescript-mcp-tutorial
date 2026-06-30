# Chapter 03：联合类型、字面量类型与状态建模

## 本章目标

你将把第 2 章里的 `boolean` 完成状态，升级成更能表达真实业务含义的状态模型。任务不再只有 `true` / `false` 两种情况，而是可以明确表示 `"todo"`、`"doing"`、`"done"`。

完成本章后，你应该能够回答：

- 字符串字面量类型是什么
- 联合类型 `A | B` 表示什么
- 为什么很多状态不适合只用 `boolean`
- 如何用联合类型限制可选值
- 为什么 `"done"` 可以，`"finished"` 不一定可以
- 如何用对象类型组合一个简单的成功/失败结果

本章结束时，你的 `src/index.ts` 会包含：

- 一个 `TaskStatus` 字符串字面量联合类型
- 一个使用 `TaskStatus` 的 `LearningTask`
- 一个把状态转成显示文本的函数
- 一个简单的表单提交结果类型
- 一次你主动制造并修复过的联合类型错误

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| 字符串字面量类型 | 把值限制为某个具体字符串，例如只允许 `"todo"` |
| 联合类型 | 表示一个值可以是几种类型或几种具体值之一，例如 `"todo" | "doing" | "done"` |
| 状态建模 | 用类型表达业务状态，减少无效值 |
| 类型别名组合 | 用 `type` 给联合类型和对象类型起名字 |
| 简单结果类型 | 用联合类型描述成功或失败的结果 |

本章仍然不讲复杂类型收窄、`never` 穷尽检查、数组、泛型或 Zod。第 4 章会继续把状态分支处理讲清楚。

## 概念解释

### 为什么 `boolean` 不够表达任务状态

第 2 章里任务状态是这样的：

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
};
```

`boolean` 只有两个值：

```text
true
false
```

但真实任务经常不只是“完成 / 未完成”。它可能是：

```text
todo     还没开始
doing    正在进行
done     已完成
```

如果继续用 `boolean`，`false` 同时可能表示“没开始”和“正在做”，信息不够准确。

### 字符串字面量类型

普通 `string` 表示任意字符串：

```ts
const status: string = "anything";
```

字符串字面量类型表示只能是某个具体字符串：

```ts
const status: "todo" = "todo";
```

这时下面的代码会报错：

```ts
const status: "todo" = "done";
```

因为类型要求只能是 `"todo"`。

### 联合类型

联合类型用 `|` 表示“可以是其中之一”。

```ts
type TaskStatus = "todo" | "doing" | "done";
```

这表示 `TaskStatus` 只允许三个值：

- `"todo"`
- `"doing"`
- `"done"`

下面这些都合法：

```ts
const status1: TaskStatus = "todo";
const status2: TaskStatus = "doing";
const status3: TaskStatus = "done";
```

下面这个会报错：

```ts
const status: TaskStatus = "finished";
```

因为 `"finished"` 不在联合类型允许的值里。

### 用联合类型建模状态

把第 2 章的任务对象改成：

```ts
type TaskStatus = "todo" | "doing" | "done";

type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
};
```

这样状态就更明确了。

```ts
const task: LearningTask = {
  title: "Learn union types",
  estimatedMinutes: 45,
  status: "doing",
};
```

### 联合类型不只用于字符串

联合类型也可以组合基础类型：

```ts
type TaskId = string | number;
```

这表示任务 ID 可以是字符串，也可以是数字。

不过本教程前期更推荐你用联合类型表达一组固定状态，因为它最容易体会类型系统的价值。

### 简单成功/失败结果

联合类型也能表达简单结果。

```ts
type SubmissionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };
```

这表示提交结果只有两种形状：

- 成功时有 `message`
- 失败时有 `error`

本章先只用最简单的 `if (result.success)` 读取不同字段。第 4 章会正式讲这种写法背后的类型收窄。

## 最小示例

把下面代码放进 `src/index.ts`，替换第 2 章代码：

```ts
type TaskStatus = "todo" | "doing" | "done";

type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
};

type LearnerProfile = {
  name: string;
  currentChapter: number;
};

type SubmissionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: string;
    };

const learner: LearnerProfile = {
  name: "Lazarus",
  currentChapter: 3,
};

const task: LearningTask = {
  title: "Learn union types",
  estimatedMinutes: 45,
  status: "doing",
  notes: "Replace boolean status with explicit states",
};

const submission: SubmissionResult = {
  success: true,
  message: "Chapter 03 draft is ready for review",
};

function formatStatus(status: TaskStatus): string {
  if (status === "todo") {
    return "not started";
  }

  if (status === "doing") {
    return "in progress";
  }

  return "completed";
}

function formatTaskSummary(task: LearningTask): string {
  return `${task.title} - ${formatStatus(task.status)} - ${task.estimatedMinutes} min`;
}

function formatSubmissionResult(result: SubmissionResult): string {
  if (result.success) {
    return `Success: ${result.message}`;
  }

  return `Failed: ${result.error}`;
}

console.log(`${learner.name} is studying chapter ${learner.currentChapter}`);
console.log(formatTaskSummary(task));
console.log(formatSubmissionResult(submission));
```

运行：

```bash
pnpm dev
```

期望输出：

```text
Lazarus is studying chapter 3
Learn union types - in progress - 45 min
Success: Chapter 03 draft is ready for review
```

再运行类型检查：

```bash
pnpm typecheck
```

如果没有类型错误，命令会正常结束。

## 项目实践

### Step 1：确认你在项目目录中

本章使用独立作业目录。在教程仓库根目录运行下面命令，先从第 2 章作业复制一份到第 3 章：

```bash
mkdir -p works/chapter03
cp -R works/chapter02/typed-toolbox-lab works/chapter03/typed-toolbox-lab
cd works/chapter03/typed-toolbox-lab
```

Windows PowerShell 可以运行：

```powershell
New-Item -ItemType Directory -Force works/chapter03
Copy-Item -Recurse works/chapter02/typed-toolbox-lab works/chapter03/typed-toolbox-lab
Set-Location works/chapter03/typed-toolbox-lab
```

确认项目至少包含：

```text
works/chapter03/typed-toolbox-lab/
  package.json
  tsconfig.json
  src/
    index.ts
```

### Step 2：更新 `src/index.ts`

把 `src/index.ts` 改成“最小示例”里的代码。

### Step 3：运行项目

```bash
pnpm dev
```

你应该看到学习者信息、任务摘要和提交结果。

### Step 4：运行类型检查

```bash
pnpm typecheck
```

如果通过，说明你的状态值和联合类型匹配。

### Step 5：制造一个非法状态错误

临时把任务状态改成：

```ts
status: "finished",
```

运行：

```bash
pnpm typecheck
```

你应该看到类似错误：

```text
Type '"finished"' is not assignable to type 'TaskStatus'.
```

这说明 `TaskStatus` 只接受 `"todo" | "doing" | "done"`。

修复为：

```ts
status: "done",
```

再运行：

```bash
pnpm typecheck
```

### Step 6：制造一个结果对象错误

临时把成功结果写成下面这样：

```ts
const submission: SubmissionResult = {
  success: true,
  error: "Should not be here",
};
```

运行：

```bash
pnpm typecheck
```

你应该看到 TypeScript 报错，因为成功结果应该有 `message`，不是 `error`。

修复回：

```ts
const submission: SubmissionResult = {
  success: true,
  message: "Chapter 03 draft is ready for review",
};
```

## 练习题

### 必做练习 1：添加暂停状态

把 `TaskStatus` 扩展为：

```ts
type TaskStatus = "todo" | "doing" | "paused" | "done";
```

更新 `formatStatus`，让 `"paused"` 输出：

```text
paused
```

然后把 `task.status` 临时改成 `"paused"`，确认 `pnpm dev` 能输出对应状态。

### 必做练习 2：添加优先级类型

新增一个联合类型：

```ts
type TaskPriority = "low" | "medium" | "high";
```

给 `LearningTask` 增加字段：

```ts
priority: TaskPriority;
```

更新 `task` 对象，并让 `formatTaskSummary` 输出优先级。

期望输出包含：

```text
priority: high
```

### 必做练习 3：添加失败提交结果

创建一个失败结果：

```ts
const failedSubmission: SubmissionResult = {
  success: false,
  error: "Missing required task status",
};
```

输出：

```ts
console.log(formatSubmissionResult(failedSubmission));
```

期望输出：

```text
Failed: Missing required task status
```

### 加分练习：添加任务来源

新增一个联合类型：

```ts
type TaskSource = "manual" | "agent" | "imported";
```

给 `LearningTask` 增加：

```ts
source: TaskSource;
```

让输出包含任务来源，例如：

```text
source: agent
```

不要引入数组、泛型或 Zod。

### 快速判断题

这些题不要求写进代码。Agent 考核时可能会抽问。

#### 题 1

下面代码会不会报错？为什么？

```ts
type Status = "todo" | "done";

const status: Status = "doing";
```

#### 题 2

下面代码中，`status` 的类型更接近普通字符串还是具体值？

```ts
const status = "todo";
```

#### 题 3

为什么 `isCompleted: boolean` 不适合表达 `todo`、`doing`、`done` 三种状态？

## 常见错误

### 错误 1：把联合类型写成普通字符串

如果你写：

```ts
type LearningTask = {
  status: string;
};
```

那么下面这种无效状态也能通过：

```ts
const task: LearningTask = {
  status: "almost finished",
};
```

这就失去了状态建模的意义。本章应该写成：

```ts
type TaskStatus = "todo" | "doing" | "done";
```

### 错误 2：忘记给新状态更新函数

如果你把 `TaskStatus` 增加了 `"paused"`，也要同步更新 `formatStatus`。

否则代码可能还能运行，但输出语义会不完整。第 4 章会学习如何让 TypeScript 帮你更严格地检查这种遗漏。

### 错误 3：把成功结果和失败结果字段混在一起

这个对象不符合 `SubmissionResult`：

```ts
const result: SubmissionResult = {
  success: true,
  error: "Something failed",
};
```

如果 `success` 是 `true`，应该使用 `message`。如果 `success` 是 `false`，应该使用 `error`。

### 错误 4：过早使用 enum

TypeScript 有 `enum`，但本教程前期优先使用字符串字面量联合类型。

原因是：

- 写法更直接
- 输出值就是普通字符串
- 很多现代 TypeScript 项目更常用这种方式表达小型状态集合

暂时不要写：

```ts
enum TaskStatus {
  Todo,
  Doing,
  Done,
}
```

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter03/typed-toolbox-lab`，然后在仓库根目录或该章节目录里对 AI Agent 说：

```text
考核第 3 章作业
```

或者：

```text
检查 chapter-03
```

Agent 应自行读取项目目录、检查 `src/index.ts`、运行必要命令，并根据本章 rubric 打分。你不需要把目录结构、源码和命令输出手动复制给 Agent。

Agent 可能会追问你 1-3 个短问题，确认你是否理解：

- 字符串字面量类型和普通 `string` 的区别
- 为什么联合类型能限制状态值
- 为什么三种以上状态不适合用 `boolean`

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 4 章。

如果低于 75 分，先根据反馈修正本章项目，再重新考核。
