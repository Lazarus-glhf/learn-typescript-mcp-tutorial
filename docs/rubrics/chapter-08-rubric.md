# Chapter 08 Rubric：Node.js、JSON 与运行时边界

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 6 分：创建 `data/tasks.json`，内容是任务数组且字段符合本章要求
- 6 分：`src/domain/task.ts` 实现 `isTaskStatus(value: unknown): value is TaskStatus`
- 8 分：实现 `isLearningTask(value: unknown): value is LearningTask`，检查对象、字段类型、状态和可选 `notes`
- 6 分：实现 `parseLearningTasks(value: unknown): LearningTask[]`，能拒绝非数组和坏任务数据
- 6 分：创建 `src/node/loadTasks.ts`，用 `readFile` 读取 JSON，并把 `JSON.parse` 结果标为 `unknown`
- 4 分：`src/index.ts` 使用顶层 `await` 加载任务并输出结果
- 4 分：完成 `loadTasksSummary` 和非数组 JSON 错误验证练习

扣分点：

- 直接把 `JSON.parse` 结果断言为 `LearningTask[]`：扣 8 分
- 没有运行时字段检查：扣 8-12 分
- 把文件读取逻辑放进 domain 层：扣 4 分
- 代码无法运行：正确性最高只能给 15 分

### 2. 类型使用：20 分

- 5 分：外部 JSON 进入程序时先作为 `unknown`
- 5 分：type guard 返回类型使用 `value is ...`
- 4 分：`parseLearningTasks` 返回可靠的 `LearningTask[]`
- 3 分：没有使用 `any` 或类型断言绕过边界检查
- 3 分：能解释 `unknown` 和 `any` 的区别

### 3. 项目结构：15 分

- 5 分：数据文件放在 `data/tasks.json`
- 5 分：文件读取放在 `src/node/loadTasks.ts`
- 5 分：类型与检查逻辑留在 `src/domain/task.ts`

### 4. 可运行性：15 分

- 4 分：`pnpm dev` 成功读取 JSON 并输出任务
- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功生成 `dist/`
- 3 分：`pnpm start` 成功运行编译后的 JavaScript

### 5. 代码清晰度：10 分

- 4 分：type guard 函数命名清晰
- 3 分：错误信息能说明 JSON 数据哪里不符合预期
- 3 分：没有无关实验残留或被注释掉的大段错误代码

## 快速判断题评分

### 题 1

`JSON.parse` 读取的是运行时数据，文件内容可能不符合 `LearningTask[]`，所以不能直接相信。

### 题 2

`unknown` 要求先检查再使用；`any` 会跳过类型检查，容易让坏数据混进程序。

### 题 3

TypeScript 类型主要在编译期生效，外部 JSON 文件是在运行时读进来的，因此需要运行时校验。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

Agent 还要检查：

- `data/tasks.json` 是否存在且能被读取
- `tsconfig.json` 是否启用 `"types": ["node"]`，从而支持 `node:fs/promises` 类型
- `JSON.parse` 结果是否显式进入 `unknown` 边界
- 是否通过 `parseLearningTasks` 校验后才返回 `LearningTask[]`
- 坏 JSON 数据是否会在运行时报清晰错误
- 是否没有提前引入 Zod

## 通过标准

- 75 分以上：通过，可以进入第 9 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 外部文件内容不是 TypeScript 编译器能直接信任的东西
2. `unknown` 是边界处的安全默认值
3. type guard 是手写运行时校验
4. 类型断言不会检查 JSON 内容
5. 第 9 章会用 Zod 减少手写校验负担
