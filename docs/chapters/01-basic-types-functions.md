# Chapter 01：基础类型、类型推断与函数

## 本章目标

你将把第 0 章创建的 `typed-toolbox-lab` 从一个简单输出程序，扩展成一个包含基础变量和函数的小练习项目。

完成本章后，你应该能够回答：

- `string`、`number`、`boolean` 分别描述什么值
- 什么是类型注解
- 什么是类型推断
- 为什么函数参数通常需要写类型
- 函数返回值类型有什么作用
- TypeScript 报错里“期望类型”和“实际类型”分别是什么意思

本章结束时，你的 `src/index.ts` 会包含：

- 一个任务标题
- 一个预计耗时
- 一个完成状态
- 两个带类型的函数
- 一次你主动制造并修复过的类型错误

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| `string` | 表示文本，例如任务标题、用户名、提示信息 |
| `number` | 表示数字，例如分钟数、价格、数量 |
| `boolean` | 表示真假值，例如是否完成、是否启用 |
| 类型注解 | 主动告诉 TypeScript 一个变量、参数或返回值应该是什么类型 |
| 类型推断 | TypeScript 根据初始值或函数实现自动判断类型 |
| 函数参数类型 | 约束调用函数时必须传入什么类型的值 |
| 函数返回值类型 | 约束函数最终必须返回什么类型的值 |

本章参考了多个教程的节奏，但做了取舍：

- 像 Handbook / Everyday Types 一样，先从最常见的值和函数开始。
- 像 Codecademy 一样，每个概念后立刻做小练习。
- 像 Total TypeScript 一样，故意制造类型错误并阅读报错。
- 像 Execute Program 一样，用短判断题巩固概念。
- 不像速查表那样一次列出所有类型；`unknown`、`never`、对象类型、联合类型和泛型会放到后续章节。

## 概念解释

### TypeScript 检查的是值如何被使用

JavaScript 允许你写出这样的代码：

```ts
function shout(text) {
  return text.toUpperCase();
}

console.log(shout(123));
```

这段代码看起来能写，但运行时会出错，因为数字 `123` 没有 `toUpperCase()` 方法。

TypeScript 的价值是让你在运行前看到问题：

```ts
function shout(text: string): string {
  return text.toUpperCase();
}

console.log(shout(123));
```

这里 `text: string` 表示：`shout` 只能接收字符串。传入 `123` 时，TypeScript 会指出参数类型不匹配。

### 基础类型

本章先掌握三个最常用类型。

```ts
const taskTitle: string = "Learn TypeScript basics";
const estimatedMinutes: number = 45;
const isCompleted: boolean = false;
```

含义分别是：

- `taskTitle` 必须是文本
- `estimatedMinutes` 必须是数字
- `isCompleted` 必须是真或假

注意：`"45"` 和 `45` 不是同一种值。

```ts
const minutesAsText: string = "45";
const minutesAsNumber: number = 45;
```

`"45"` 是文本，适合展示。`45` 是数字，适合计算。

### 类型推断

很多时候，你不必把变量类型写出来。

```ts
const taskTitle = "Learn TypeScript basics";
const estimatedMinutes = 45;
const isCompleted = false;
```

TypeScript 能根据初始值推断：

- `taskTitle` 是 `string`
- `estimatedMinutes` 是 `number`
- `isCompleted` 是 `boolean`

所以初学阶段可以记住一个简单规则：

```text
变量初始值很明显时，可以让 TypeScript 推断。
函数参数通常要写类型。
函数返回值可以推断，但本教程前期会经常显式写出，帮助你看清楚函数契约。
```

### 函数参数类型

函数参数通常应该写类型，因为 TypeScript 不能总是从函数声明中知道调用者会传什么。

```ts
function formatTaskTitle(title: string): string {
  return title.trim();
}
```

`title: string` 表示调用函数时必须传入字符串。

正确调用：

```ts
formatTaskTitle("  Learn TypeScript basics  ");
```

错误调用：

```ts
formatTaskTitle(45);
```

### 函数返回值类型

返回值类型写在参数列表后面：

```ts
function getRemainingMinutes(estimatedMinutes: number, completed: boolean): number {
  if (completed) {
    return 0;
  }

  return estimatedMinutes;
}
```

最后的 `: number` 表示这个函数必须返回数字。

如果你写成这样：

```ts
function getRemainingMinutes(estimatedMinutes: number, completed: boolean): number {
  if (completed) {
    return "done";
  }

  return estimatedMinutes;
}
```

TypeScript 会报错，因为 `"done"` 是字符串，不是数字。

## 最小示例

把下面代码放进 `src/index.ts`，替换第 0 章的简单输出：

```ts
const taskTitle = "Learn TypeScript basics";
const estimatedMinutes = 45;
const isCompleted = false;

function formatTaskTitle(title: string): string {
  return title.trim();
}

function getRemainingMinutes(estimatedMinutes: number, completed: boolean): number {
  if (completed) {
    return 0;
  }

  return estimatedMinutes;
}

const formattedTitle = formatTaskTitle(taskTitle);
const remainingMinutes = getRemainingMinutes(estimatedMinutes, isCompleted);

console.log(`Task: ${formattedTitle}`);
console.log(`Remaining minutes: ${remainingMinutes}`);
```

运行：

```bash
pnpm dev
```

期望输出：

```text
Task: Learn TypeScript basics
Remaining minutes: 45
```

再运行类型检查：

```bash
pnpm typecheck
```

如果没有类型错误，命令会正常结束。

## 项目实践

### Step 1：确认你在项目目录中

按 README 的统一作业规则准备本章目录：`works/chapter01/typed-toolbox-lab`。

确认项目至少包含：

```text
works/chapter01/typed-toolbox-lab/
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

你应该看到任务标题和剩余分钟数。

### Step 4：运行类型检查

```bash
pnpm typecheck
```

如果成功，说明当前代码通过了 TypeScript 检查。

### Step 5：观察类型推断

把这三行：

```ts
const taskTitle = "Learn TypeScript basics";
const estimatedMinutes = 45;
const isCompleted = false;
```

临时改成显式类型注解：

```ts
const taskTitle: string = "Learn TypeScript basics";
const estimatedMinutes: number = 45;
const isCompleted: boolean = false;
```

再次运行：

```bash
pnpm typecheck
```

它应该仍然通过。然后你可以把显式类型删掉，回到推断版本。

这个练习的重点是：两种写法都对，但当初始值很清楚时，推断版本更简洁。

## 必做练习

### 练习 1：添加学习者名称

添加一个变量：

```ts
const learnerName = "Lazarus";
```

然后新增函数：

```ts
function formatOwner(name: string): string {
  return `Owner: ${name.trim()}`;
}
```

输出它：

```ts
console.log(formatOwner(learnerName));
```

要求：

- `formatOwner` 的参数必须写 `string`
- `formatOwner` 的返回值必须写 `string`
- `pnpm dev` 输出中包含 `Owner: Lazarus`
- `pnpm typecheck` 通过

### 练习 2：添加预计结束时间

新增函数：

```ts
function getEstimatedEndHour(startHour: number, durationHours: number): number {
  return startHour + durationHours;
}
```

调用它并输出：

```ts
const endHour = getEstimatedEndHour(20, 2);
console.log(`Estimated end hour: ${endHour}`);
```

要求：

- 两个参数必须是 `number`
- 返回值必须是 `number`
- 输出里包含 `Estimated end hour: 22`

### 练习 3：制造并修复参数类型错误

临时把这一行：

```ts
const endHour = getEstimatedEndHour(20, 2);
```

改成：

```ts
const endHour = getEstimatedEndHour("20", 2);
```

运行：

```bash
pnpm typecheck
```

你应该看到类型错误。确认看到错误后，把 `"20"` 改回 `20`，再次运行：

```bash
pnpm typecheck
```

直到类型检查通过。

你不需要把错误信息整理成提交材料。考核时，如果 Agent 无法从最终项目状态判断你是否理解这次错误，它会直接追问你这条报错是什么意思；如果你对报错还有疑问，可以在考核请求里补充说明。

## 加分练习

### 加分 1：添加完成状态描述

新增函数：

```ts
function describeCompletion(completed: boolean): string {
  if (completed) {
    return "Status: completed";
  }

  return "Status: in progress";
}
```

输出：

```ts
console.log(describeCompletion(isCompleted));
```

### 加分 2：解释推断

准备好用自己的话解释下面这行为什么会被推断为 `number`：

```ts
const estimatedMinutes = 45;
```

为什么 TypeScript 能知道 `estimatedMinutes` 是 `number`。

## 快速判断题

不用写进代码。考核时，Agent 可以抽问这些题或等价问题，用来判断你是否理解本章概念。

### 题 1

下面代码会不会报错？为什么？

```ts
const title = "Read docs";
const minutes: number = "30";
```

### 题 2

下面代码会不会报错？为什么？

```ts
function double(value: number): number {
  return value * 2;
}

double("4");
```

### 题 3

下面代码中，返回值类型应该写什么？

```ts
function isLongTask(minutes: number): ? {
  return minutes > 60;
}
```

## 常见错误

### 错误 1：把数字字符串当成数字

```ts
getEstimatedEndHour("20", 2);
```

`"20"` 是字符串，不是数字。正确写法是：

```ts
getEstimatedEndHour(20, 2);
```

### 错误 2：函数参数没有写类型

如果你的 `tsconfig.json` 开启了 `strict: true`，下面代码会报隐式 `any` 错误：

```ts
function formatTaskTitle(title) {
  return title.trim();
}
```

应该写成：

```ts
function formatTaskTitle(title: string): string {
  return title.trim();
}
```

### 错误 3：返回值类型和实际返回值不一致

```ts
function getRemainingMinutes(estimatedMinutes: number, completed: boolean): number {
  if (completed) {
    return "done";
  }

  return estimatedMinutes;
}
```

函数声明说返回 `number`，但 `"done"` 是 `string`，所以会报错。

### 错误 4：用 `any` 绕过错误

```ts
function formatTaskTitle(title: any): string {
  return title.trim();
}
```

这会让 TypeScript 放弃检查 `title`。本教程前期不建议使用 `any`。你应该写出更准确的类型。

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter01/typed-toolbox-lab`，然后在仓库根目录或该章节目录里直接对 AI Agent 说：

```text
考核第 1 章作业
```

Agent 应自行检查项目目录、读取 `src/index.ts`、运行 `pnpm dev` 和 `pnpm typecheck`，并根据第 1 章 rubric 打分。你不需要复制粘贴目录结构、代码或命令输出；如果有还不理解的问题，可以在这句话后面补充说明。

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 2 章。

如果低于 75 分，先根据反馈修正本章项目，再重新提交。
