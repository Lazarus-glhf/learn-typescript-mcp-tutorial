# Chapter 03 Rubric：联合类型、字面量类型与状态建模

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 8 分：定义了 `TaskStatus` 字符串字面量联合类型，并用它替代第 2 章的 `isCompleted: boolean`
- 7 分：`LearningTask` 正确使用 `status: TaskStatus`，并创建合法任务对象
- 7 分：`formatStatus(status: TaskStatus): string` 能正确处理 `"todo"`、`"doing"`、`"paused"`、`"done"`
- 6 分：定义并使用 `TaskPriority = "low" | "medium" | "high"`，输出任务优先级
- 6 分：定义并使用 `SubmissionResult`，成功和失败结果都能正确输出
- 6 分：完成任务来源加分练习或等价扩展；如果未做加分练习，本项可按其它核心输出质量酌情给分，但最高 4 分

扣分点：

- 仍然只用 `isCompleted: boolean` 表达任务状态：扣 8-12 分
- `status` 写成普通 `string`，没有限制合法状态：扣 8 分
- `formatStatus` 输出与状态不匹配：每处扣 3-5 分
- 成功/失败结果字段混用：每处扣 4-6 分
- 代码无法运行：正确性最高只能给 15 分

### 2. 类型使用：20 分

- 5 分：正确使用字符串字面量联合类型限制 `TaskStatus`
- 4 分：正确使用 `TaskPriority` 或等价优先级联合类型
- 4 分：`SubmissionResult` 能表达成功和失败两种对象形状
- 3 分：函数参数使用具体联合类型，而不是全部退回 `string`
- 2 分：能解释 `"finished"` 为什么不是合法 `TaskStatus`
- 2 分：没有使用 `any`、宽泛类型断言或 `as TaskStatus` 绕过错误

扣分点：

- 使用 `any`：每处扣 5 分
- 用 `as TaskStatus` 强行压过非法字符串：每处扣 6 分
- 把所有状态类型都写成 `string`：扣 8-10 分
- 过早使用 `enum`，但不能解释与本章写法的差异：扣 3-5 分

### 3. 项目结构：15 分

- 5 分：继续沿用第 0 章项目结构，代码放在 `src/index.ts`
- 5 分：类型定义、对象创建、函数和输出顺序清晰
- 5 分：没有提前引入数组、泛型、Zod、模块拆分或复杂类型收窄

### 4. 可运行性：15 分

- 7 分：`pnpm dev` 成功运行并输出本章要求内容
- 6 分：`pnpm typecheck` 成功通过
- 2 分：完成非法状态或错误结果对象的制造与修复练习，并能说明报错含义

如果 Agent 无法运行命令且项目中也没有其他可信证据，可运行性最高只能给 5 分。

### 5. 代码清晰度：10 分

- 4 分：类型命名清晰，例如 `TaskStatus`、`TaskPriority`、`SubmissionResult`
- 3 分：输出文本能让人看懂任务状态、优先级和提交结果
- 3 分：文件中没有无关实验残留或被注释掉的大段错误代码

## 快速判断题评分

快速判断题计入“类型使用”和“代码清晰度”的综合判断。它们不要求写进代码；如果学习者没有主动说明，Agent 应在考核时抽问这些题或等价问题。参考答案：

### 题 1

```ts
type Status = "todo" | "done";

const status: Status = "doing";
```

会报错。`"doing"` 不在 `"todo" | "done"` 这个联合类型里。

### 题 2

```ts
const status = "todo";
```

这里 `status` 是 `const`，TypeScript 通常会把它推断成具体值类型 `"todo"`，而不是宽泛的 `string`。如果写成 `let status = "todo"`，更可能推断成 `string`，因为后续还能重新赋值。

### 题 3

`boolean` 只有 `true` 和 `false` 两种值，不能清楚表达 `todo`、`doing`、`done` 三种状态。用字符串字面量联合类型可以把合法状态直接写进类型里。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm dev
pnpm typecheck
```

Agent 还要检查 `src/index.ts` 是否体现了本章目标：

- `TaskStatus` 是字符串字面量联合类型，不是普通 `string`
- `LearningTask` 使用 `status: TaskStatus`
- 至少有一个函数接收 `TaskStatus` 或使用它输出状态文本
- 有 `TaskPriority` 或等价优先级联合类型
- 有成功/失败结果建模，例如 `SubmissionResult`
- 没有用 `any` 或类型断言绕过非法状态检查

制造并修复非法状态错误的过程通常无法从最终文件直接证明；如果缺少证据，应追问 1-3 个短问题。重点看学习者是否能说明：

- `"finished"` 为什么不属于 `TaskStatus`
- 普通 `string` 和 `"todo" | "doing" | "done"` 的差别
- 为什么 `boolean` 不适合表示三种以上状态

## 通过标准

- 75 分以上：通过，可以进入第 4 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 字符串字面量联合类型表达“只能选这些值”
2. 普通 `string` 太宽，不能防止无效状态
3. 状态数量超过两种时，不要硬塞进 `boolean`
4. 成功/失败结果的字段应该跟 `success` 值匹配
5. 不要用 `any` 或类型断言绕过本章练习目标
