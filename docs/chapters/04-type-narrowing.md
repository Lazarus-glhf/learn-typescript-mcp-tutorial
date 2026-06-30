# Chapter 04：类型收窄与常见错误阅读

## 本章目标

你将学习 TypeScript 如何在 `if`、`typeof`、`in` 和判别字段检查后，自动缩小一个值的类型范围。第 3 章你已经能定义联合类型；本章要学会安全地使用联合类型里的不同分支。

完成本章后，你应该能够回答：

- 什么是类型收窄
- `typeof` 能帮 TypeScript 判断哪些基础类型
- `in` 能帮你判断对象里是否存在某个字段
- 为什么 `result.success === true` 后可以读取 `result.message`
- 为什么读取可选字段前要先判断它是否存在
- `never` 穷尽检查用来发现什么问题

本章结束时，你的 `src/index.ts` 会包含：

- 一个使用 `typeof` 的输入格式化函数
- 一个使用可选字段判断的任务备注函数
- 一个使用判别联合的提交结果函数
- 一个使用 `never` 的状态穷尽检查函数
- 一次你主动制造并修复过的类型收窄错误

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| 类型收窄 | 在条件判断后，让 TypeScript 知道某个值更具体的类型 |
| `typeof` | 判断基础值类型，例如 `string`、`number`、`boolean` |
| `in` | 判断对象中是否存在某个字段 |
| 判别联合 | 用共同字段区分不同对象形状，例如 `success: true` / `success: false` |
| 可选字段检查 | 读取 `notes?: string` 前先确认它存在 |
| `never` 穷尽检查 | 让遗漏联合类型分支时出现编译错误 |

本章仍然不引入数组、泛型、Zod、模块拆分或测试。你会继续在一个 `src/index.ts` 里练习分支处理。

## 概念解释

### 什么是类型收窄

联合类型表示一个值可能是几种类型之一：

```ts
type DisplayValue = string | number;
```

在没有判断前，TypeScript 只知道 `value` 可能是 `string`，也可能是 `number`。

```ts
function formatDisplayValue(value: DisplayValue): string {
  return value.toUpperCase();
}
```

这会报错，因为 `number` 没有 `toUpperCase()`。

加入 `typeof` 判断后：

```ts
function formatDisplayValue(value: DisplayValue): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return value.toFixed(0);
}
```

在 `if` 分支里，TypeScript 知道 `value` 是 `string`。在后面的分支里，它知道 `value` 只能是 `number`。

这就是类型收窄。

### 用 `typeof` 收窄基础类型

`typeof` 常用于判断基础类型：

```ts
function formatInput(input: string | number | boolean): string {
  if (typeof input === "string") {
    return input.trim();
  }

  if (typeof input === "number") {
    return input.toFixed(1);
  }

  return input ? "yes" : "no";
}
```

这里三个分支分别处理字符串、数字和布尔值。

### 读取可选字段前先判断

第 2 章你学过可选字段：

```ts
type LearningTask = {
  title: string;
  notes?: string;
};
```

`notes?: string` 表示它可能不存在。所以直接写：

```ts
return task.notes.toUpperCase();
```

TypeScript 会提醒你：`task.notes` 可能是 `undefined`。

正确做法是先判断：

```ts
function formatTaskNotes(task: LearningTask): string {
  if (task.notes) {
    return task.notes.toUpperCase();
  }

  return "NO NOTES";
}
```

判断后，TypeScript 知道 `task.notes` 在这个分支里是 `string`。

### 用判别字段收窄对象联合

第 3 章里的 `SubmissionResult` 是对象联合：

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

两个分支都有 `success` 字段，但值不同。这个共同字段就可以作为判别字段。

```ts
function formatSubmissionResult(result: SubmissionResult): string {
  if (result.success) {
    return `Success: ${result.message}`;
  }

  return `Failed: ${result.error}`;
}
```

当 `result.success` 为 `true` 时，TypeScript 知道它是成功分支，可以读取 `message`。否则就是失败分支，可以读取 `error`。

### 用 `in` 判断对象字段

有时联合类型的对象没有共同判别字段，可以用 `in` 判断字段是否存在。

```ts
type TextNotice = {
  text: string;
};

type ErrorNotice = {
  error: string;
};

type Notice = TextNotice | ErrorNotice;

function formatNotice(notice: Notice): string {
  if ("error" in notice) {
    return `Error: ${notice.error}`;
  }

  return `Text: ${notice.text}`;
}
```

`"error" in notice` 后，TypeScript 知道当前对象有 `error` 字段。

### 用 `never` 做穷尽检查

第 3 章你定义过状态：

```ts
type TaskStatus = "todo" | "doing" | "paused" | "done";
```

你可以用 `switch` 处理所有状态：

```ts
function formatStatus(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "not started";
    case "doing":
      return "in progress";
    case "paused":
      return "paused";
    case "done":
      return "completed";
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
}
```

如果将来给 `TaskStatus` 新增 `"blocked"`，但忘了在 `switch` 里处理，`const unreachable: never = status` 会报错。

这能提醒你：状态分支没有处理完整。

## 最小示例

把下面代码放进 `src/index.ts`，替换第 3 章代码：

```ts
type TaskStatus = "todo" | "doing" | "paused" | "done";
type DisplayValue = string | number | boolean;

type LearningTask = {
  title: string;
  estimatedMinutes: number;
  status: TaskStatus;
  notes?: string;
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

type TextNotice = {
  text: string;
};

type ErrorNotice = {
  error: string;
};

type Notice = TextNotice | ErrorNotice;

const task: LearningTask = {
  title: "Learn type narrowing",
  estimatedMinutes: 50,
  status: "doing",
  notes: "Check before reading optional fields",
};

const result: SubmissionResult = {
  success: false,
  error: "Type narrowing question is not answered yet",
};

function formatDisplayValue(value: DisplayValue): string {
  if (typeof value === "string") {
    return value.trim().toUpperCase();
  }

  if (typeof value === "number") {
    return `${value.toFixed(1)} minutes`;
  }

  return value ? "enabled" : "disabled";
}

function formatTaskNotes(task: LearningTask): string {
  if (task.notes) {
    return `Notes: ${task.notes}`;
  }

  return "Notes: none";
}

function formatSubmissionResult(result: SubmissionResult): string {
  if (result.success) {
    return `Success: ${result.message}`;
  }

  return `Failed: ${result.error}`;
}

function formatNotice(notice: Notice): string {
  if ("error" in notice) {
    return `Notice error: ${notice.error}`;
  }

  return `Notice text: ${notice.text}`;
}

function formatStatus(status: TaskStatus): string {
  switch (status) {
    case "todo":
      return "not started";
    case "doing":
      return "in progress";
    case "paused":
      return "paused";
    case "done":
      return "completed";
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
}

console.log(formatDisplayValue(task.title));
console.log(formatDisplayValue(task.estimatedMinutes));
console.log(formatTaskNotes(task));
console.log(formatSubmissionResult(result));
console.log(formatNotice({ text: "Use checks before reading branch fields" }));
console.log(formatStatus(task.status));
```

运行：

```bash
pnpm dev
```

期望输出：

```text
LEARN TYPE NARROWING
50.0 minutes
Notes: Check before reading optional fields
Failed: Type narrowing question is not answered yet
Notice text: Use checks before reading branch fields
in progress
```

再运行类型检查：

```bash
pnpm typecheck
```

如果没有类型错误，命令会正常结束。

## 项目实践

### Step 1：确认你在项目目录中

本章使用独立作业目录。在教程仓库根目录运行下面命令，先从第 3 章作业复制一份到第 4 章：

```bash
mkdir -p works/chapter04
cp -R works/chapter03/typed-toolbox-lab works/chapter04/typed-toolbox-lab
cd works/chapter04/typed-toolbox-lab
```

Windows PowerShell 可以运行：

```powershell
New-Item -ItemType Directory -Force works/chapter04
Copy-Item -Recurse works/chapter03/typed-toolbox-lab works/chapter04/typed-toolbox-lab
Set-Location works/chapter04/typed-toolbox-lab
```

### Step 2：更新 `src/index.ts`

把 `src/index.ts` 改成“最小示例”里的代码。

### Step 3：运行项目

```bash
pnpm dev
```

确认输出包含标题、分钟数、备注、提交结果、通知和状态文本。

### Step 4：运行类型检查

```bash
pnpm typecheck
```

如果通过，说明你的收窄分支基本正确。

### Step 5：制造一个可选字段错误

临时把 `formatTaskNotes` 改成：

```ts
function formatTaskNotes(task: LearningTask): string {
  return `Notes: ${task.notes.toUpperCase()}`;
}
```

运行：

```bash
pnpm typecheck
```

你应该看到类似错误：

```text
'task.notes' is possibly 'undefined'.
```

修复方式是恢复 `if (task.notes)` 判断。

### Step 6：制造一个对象分支错误

临时把 `formatSubmissionResult` 改成：

```ts
function formatSubmissionResult(result: SubmissionResult): string {
  return `Result: ${result.message}`;
}
```

运行：

```bash
pnpm typecheck
```

你应该看到类似错误：

```text
Property 'message' does not exist on type 'SubmissionResult'.
```

修复方式是先判断 `result.success`。

### Step 7：制造一个遗漏状态错误

临时给 `TaskStatus` 增加一个新状态：

```ts
type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";
```

但不要更新 `formatStatus` 的 `switch`。

运行：

```bash
pnpm typecheck
```

你应该看到 `never` 相关错误。它表示 `blocked` 状态没有被处理。

修复方式是在 `switch` 中增加：

```ts
case "blocked":
  return "blocked";
```

## 练习题

### 必做练习 1：支持 blocked 状态

正式把 `TaskStatus` 扩展为：

```ts
type TaskStatus = "todo" | "doing" | "paused" | "blocked" | "done";
```

更新 `formatStatus`，让 `"blocked"` 输出：

```text
blocked
```

把 `task.status` 改成 `"blocked"`，确认运行输出正确。

### 必做练习 2：扩展 `DisplayValue`

把 `DisplayValue` 扩展为：

```ts
type DisplayValue = string | number | boolean | null;
```

更新 `formatDisplayValue`，让 `null` 输出：

```text
empty
```

提示：先判断 `value === null`，再使用 `typeof`。

### 必做练习 3：添加 WarningNotice

新增一种通知类型：

```ts
type WarningNotice = {
  warning: string;
};
```

把 `Notice` 改成：

```ts
type Notice = TextNotice | ErrorNotice | WarningNotice;
```

更新 `formatNotice`，用 `in` 判断并输出：

```text
Notice warning: ...
```

### 加分练习：说明 `never` 报错

在代码旁边写一行短注释，解释 `const unreachable: never = status;` 的作用。

要求：

- 注释必须是你自己的理解
- 不要写长段落
- 不要删除 `never` 检查

### 快速判断题

这些题不要求写进代码。Agent 考核时可能会抽问。

#### 题 1

为什么下面代码会报错？

```ts
function upper(value: string | number): string {
  return value.toUpperCase();
}
```

#### 题 2

下面判断之后，`value` 在 `if` 分支里是什么类型？

```ts
if (typeof value === "number") {
  return value.toFixed(1);
}
```

#### 题 3

`const unreachable: never = status;` 的目的是什么？

## 常见错误

### 错误 1：没有判断就读取联合类型专属字段

失败结果没有 `message`，成功结果没有 `error`。

```ts
function formatSubmissionResult(result: SubmissionResult): string {
  return result.message;
}
```

这会报错。你必须先判断 `result.success`。

### 错误 2：读取可选字段前没有判断

`notes?: string` 可能不存在。

```ts
return task.notes.toUpperCase();
```

应该先判断：

```ts
if (task.notes) {
  return task.notes.toUpperCase();
}
```

### 错误 3：新增状态后忘记更新 `switch`

如果 `TaskStatus` 增加了 `"blocked"`，但 `formatStatus` 没有处理它，`never` 检查会报错。

这不是坏事。它是在提醒你分支没有覆盖完整。

### 错误 4：用类型断言绕过收窄

不要写：

```ts
return (result as { message: string }).message;
```

这只是骗过 TypeScript，没有真正证明当前分支有 `message`。

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter04/typed-toolbox-lab`，然后在仓库根目录或该章节目录里对 AI Agent 说：

```text
考核第 4 章作业
```

或者：

```text
检查 chapter-04
```

Agent 应自行读取项目目录、检查 `src/index.ts`、运行必要命令，并根据本章 rubric 打分。你不需要把目录结构、源码和命令输出手动复制给 Agent。

Agent 可能会追问你 1-3 个短问题，确认你是否理解：

- 为什么 `typeof` 判断后能调用某些方法
- 为什么可选字段需要先判断
- `never` 穷尽检查在防什么问题

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 5 章。

如果低于 75 分，先根据反馈修正本章项目，再重新考核。
