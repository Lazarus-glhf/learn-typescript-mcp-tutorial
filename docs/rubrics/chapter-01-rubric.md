# Chapter 01 Rubric：基础类型、类型推断与函数

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 8 分：`src/index.ts` 包含任务标题、预计分钟数和完成状态，并能正确输出任务信息
- 8 分：`formatTaskTitle(title: string): string` 实现正确，能清理标题空白
- 8 分：`getRemainingMinutes(estimatedMinutes: number, completed: boolean): number` 实现正确，完成时返回 0，未完成时返回预计分钟数
- 8 分：完成 `formatOwner(name: string): string` 并输出学习者信息
- 8 分：完成 `getEstimatedEndHour(startHour: number, durationHours: number): number` 并输出正确结果

扣分点：

- 输出内容缺失关键结果：每项扣 3-5 分
- 函数逻辑与题目要求不符：每处扣 5-8 分
- 代码无法运行：正确性最高只能给 15 分

### 2. 类型使用：20 分

- 5 分：正确使用或解释 `string`、`number`、`boolean`
- 5 分：函数参数类型完整，没有隐式 `any`
- 5 分：函数返回值类型与实际返回值一致
- 3 分：能解释哪些变量由 TypeScript 推断出类型
- 2 分：没有使用 `any` 绕过错误

扣分点：

- 使用 `any`：每处扣 5 分
- 参数缺少类型导致隐式 `any`：每处扣 4 分
- 把数字字符串当成数字使用：每处扣 4 分
- 为了通过检查使用不必要类型断言：每处扣 5 分

### 3. 项目结构：15 分

- 5 分：继续沿用第 0 章项目结构，代码放在 `src/index.ts`
- 5 分：没有提前引入对象类型、联合类型、泛型、Zod、CLI、MCP 等后续章节内容
- 5 分：代码组织清晰，变量、函数和输出顺序易读

### 4. 可运行性：15 分

- 7 分：`pnpm dev` 成功运行并输出本章要求内容
- 6 分：`pnpm typecheck` 成功通过
- 2 分：提交了制造类型错误后的真实 `pnpm typecheck` 报错信息

如果没有提交真实命令输出，可运行性最高只能给 5 分。

### 5. 代码清晰度：10 分

- 4 分：变量和函数命名清晰
- 3 分：输出文本能让人看懂结果含义
- 3 分：文件中没有无关实验残留或被注释掉的大段错误代码

## 快速判断题评分

快速判断题计入“类型使用”和“代码清晰度”的综合判断。参考答案：

### 题 1

```ts
const title = "Read docs";
const minutes: number = "30";
```

会报错。`minutes` 声明为 `number`，但 `"30"` 是 `string`。

### 题 2

```ts
function double(value: number): number {
  return value * 2;
}

double("4");
```

会报错。`double` 需要 `number` 参数，但调用时传入了字符串。

### 题 3

```ts
function isLongTask(minutes: number): ? {
  return minutes > 60;
}
```

返回值类型应该是 `boolean`，因为 `minutes > 60` 的结果是真或假。

## Agent 需要重点检查

Agent 必须确认学习者不是只贴了代码，而是确实运行过：

```bash
pnpm dev
pnpm typecheck
```

Agent 还要确认学习者提交了制造参数类型错误时的真实报错。重点看学习者是否能说明：

- TypeScript 期望的类型是什么
- 实际传入的类型是什么
- 为什么 `"20"` 和 `20` 不同

## 通过标准

- 75 分以上：通过，可以进入第 2 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 函数参数为什么要写类型
2. 类型推断适合用在哪些变量上
3. 数字字符串和数字的区别
4. 返回值类型为什么能约束函数实现
5. 不要用 `any` 或类型断言绕过本章练习目标
