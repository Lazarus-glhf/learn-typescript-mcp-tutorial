# Chapter 07 Rubric：泛型入门与可复用函数

满分 100 分。

Agent 评分时应优先检查 `works/chapter07/typed-toolbox-lab`。如果学习者已经在该目录中发起请求，也可以直接检查当前目录。

## 评分明细

### 1. 正确性：40 分

- 6 分：创建 `src/domain/collection.ts`，实现 `firstOrDefault<T>(items: T[]): T | undefined`
- 6 分：实现 `getProperty<T, K extends keyof T>(item: T, key: K): T[K]`
- 6 分：创建 `src/domain/result.ts`，定义 `Result<T, E>` 成功/失败联合类型
- 5 分：实现 `formatResult<T, E>(result: Result<T, E>): string`
- 5 分：完成 `lastOrDefault<T>` 并在不同数组类型上调用
- 5 分：完成 `makeSuccess<T, E>` 和 `makeFailure<T, E>`
- 4 分：完成 `pluck<T, K extends keyof T>` 并保留准确返回类型
- 3 分：完成 `findTaskTitleResult` 加分练习或等价 `Result<LearningTask, string>` 用法

扣分点：

- 用 `any` 替代泛型：每处扣 5-8 分
- `getProperty` 的 key 没有 `keyof` 约束：扣 6 分
- `Result` 成功/失败字段混用：每处扣 4-6 分
- 代码无法运行：正确性最高只能给 15 分

### 2. 类型使用：20 分

- 5 分：泛型函数能保留输入和输出类型关系
- 4 分：`Result<T, E>` 类型参数使用清晰
- 4 分：`K extends keyof T` 限制字段名有效
- 3 分：调用 `firstOrDefault` / `lastOrDefault` 后正确处理 `undefined`
- 2 分：模块导入导出仍然保持第 5 章规范
- 2 分：没有使用类型断言绕过非法字段名或 Result 形状错误

### 3. 项目结构：15 分

- 5 分：新增 `src/domain/collection.ts` 和 `src/domain/result.ts`
- 5 分：`src/domain/index.ts` 正确导出新模块
- 5 分：`src/index.ts` 只创建示例数据并调用泛型工具，不堆放主要函数

### 4. 可运行性：15 分

- 4 分：`pnpm dev` 成功运行并输出本章要求内容
- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功生成 `dist/`
- 3 分：`pnpm start` 成功运行编译后的 JavaScript

### 5. 代码清晰度：10 分

- 4 分：泛型函数命名清晰，例如 `firstOrDefault`、`getProperty`、`pluck`
- 3 分：输出文本能让人看懂泛型工具的结果
- 3 分：没有无关实验残留或被注释掉的大段错误代码

## 快速判断题评分

### 题 1

`firstOrDefault(["a", "b"])` 的返回值类型是 `string | undefined`，因为数组可能为空。

### 题 2

`getProperty(task, "missing")` 会报错，因为 `"missing"` 不属于 `keyof LearningTask`。

### 题 3

泛型会保留输入和输出之间的类型关系；`any` 会让 TypeScript 放弃检查。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

Agent 还要检查：

- `collection.ts` 是否实现泛型集合工具
- `result.ts` 是否实现 `Result<T, E>` 和辅助函数
- `getProperty` / `pluck` 是否使用 `K extends keyof T`
- 调用 `firstOrDefault` / `lastOrDefault` 后是否处理 `undefined`
- 是否存在 `any` 或不必要类型断言

## 通过标准

- 75 分以上：通过，可以进入第 8 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 泛型是复用类型关系，不是放弃类型检查
2. `T` 由调用时的参数推断出来
3. `keyof` 让字段名必须来自对象本身
4. `Result<T, E>` 让成功数据和失败错误都保留类型
5. `firstOrDefault` 和 `lastOrDefault` 对空数组必须返回 `undefined`
