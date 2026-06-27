# Chapter 04 Rubric：类型收窄与常见错误阅读

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 7 分：`formatDisplayValue(value: DisplayValue): string` 正确使用 `value === null` 和 `typeof` 处理 `string`、`number`、`boolean`、`null`
- 6 分：`formatTaskNotes(task: LearningTask): string` 在读取 `notes?: string` 前先判断字段存在
- 7 分：`formatSubmissionResult(result: SubmissionResult): string` 正确使用 `result.success` 区分成功和失败分支
- 6 分：`formatNotice(notice: Notice): string` 使用 `in` 正确处理 `text`、`error`、`warning` 三种通知
- 8 分：`formatStatus(status: TaskStatus): string` 使用 `switch` 覆盖所有状态，包括 `"blocked"`
- 6 分：保留 `never` 穷尽检查，并能在新增未处理状态时触发类型错误

扣分点：

- 没有判断就读取可选字段或联合分支专属字段：每处扣 5-8 分
- 新增状态后没有更新 `formatStatus`：扣 6-8 分
- 删除 `never` 检查来绕过错误：扣 6 分
- 代码无法运行：正确性最高只能给 15 分

### 2. 类型使用：20 分

- 5 分：能正确使用 `typeof` 收窄基础类型
- 4 分：能正确使用 `result.success` 收窄判别联合
- 4 分：能正确使用 `in` 收窄无共同判别字段的对象联合
- 3 分：理解可选字段可能是 `undefined`
- 2 分：理解 `never` 表示不应该到达的分支
- 2 分：没有使用 `any`、宽泛类型断言或强转对象形状绕过错误

扣分点：

- 使用 `any`：每处扣 5 分
- 用类型断言读取 `result.message`、`task.notes` 等字段：每处扣 6 分
- 把联合类型改回普通 `string` 来避免分支处理：扣 8 分
- 为了消除 `never` 错误直接删除 `default` 分支：扣 4 分

### 3. 项目结构：15 分

- 5 分：继续沿用第 0 章项目结构，代码放在 `src/index.ts`
- 5 分：类型定义、对象创建、收窄函数和输出顺序清晰
- 5 分：没有提前引入数组、泛型、Zod、模块拆分或测试框架

### 4. 可运行性：15 分

- 7 分：`pnpm dev` 成功运行并输出本章要求内容
- 6 分：`pnpm typecheck` 成功通过
- 2 分：完成至少一个收窄错误和一个 `never` 遗漏分支错误的制造与修复练习，并能说明报错含义

如果 Agent 无法运行命令且项目中也没有其他可信证据，可运行性最高只能给 5 分。

### 5. 代码清晰度：10 分

- 4 分：函数命名清晰，例如 `formatDisplayValue`、`formatNotice`、`formatStatus`
- 3 分：输出文本能让人看懂不同分支的结果
- 3 分：文件中没有无关实验残留或被注释掉的大段错误代码

## 快速判断题评分

快速判断题计入“类型使用”和“代码清晰度”的综合判断。它们不要求写进代码；如果学习者没有主动说明，Agent 应在考核时抽问这些题或等价问题。参考答案：

### 题 1

```ts
function upper(value: string | number): string {
  return value.toUpperCase();
}
```

会报错。`value` 可能是 `number`，而 `number` 没有 `toUpperCase()`。需要先用 `typeof value === "string"` 收窄。

### 题 2

```ts
if (typeof value === "number") {
  return value.toFixed(1);
}
```

在这个 `if` 分支里，TypeScript 会把 `value` 收窄为 `number`。

### 题 3

`const unreachable: never = status;` 用来做穷尽检查。如果联合类型新增了状态，但 `switch` 没处理，`status` 就不再是 `never`，TypeScript 会报错提醒遗漏分支。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm dev
pnpm typecheck
```

Agent 还要检查 `src/index.ts` 是否体现了本章目标：

- `formatDisplayValue` 使用 `typeof` 处理不同基础类型
- 读取 `notes?: string` 前有存在性判断
- `SubmissionResult` 通过 `success` 字段安全读取 `message` 或 `error`
- `Notice` 通过 `in` 判断安全读取字段
- `formatStatus` 覆盖所有 `TaskStatus` 分支
- `switch` 中保留 `never` 穷尽检查
- 没有用 `any` 或类型断言绕过收窄

制造并修复错误的过程通常无法从最终文件直接证明；如果缺少证据，应追问 1-3 个短问题。重点看学习者是否能说明：

- 为什么 `task.notes` 可能是 `undefined`
- 为什么 `result.message` 不能在判断前直接读取
- `never` 报错说明遗漏了什么

## 通过标准

- 75 分以上：通过，可以进入第 5 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. TypeScript 不只看类型定义，也会跟随条件判断缩小类型
2. 可选字段读取前要先证明字段存在
3. 判别字段让对象联合更容易安全使用
4. `in` 适合判断某个字段是否存在于对象中
5. `never` 检查是在帮助你发现未来新增但未处理的状态
6. 不要用 `any` 或类型断言绕过本章练习目标
