# Chapter 06 Rubric：数组、Record 与数据查询

满分 100 分。

Agent 评分时应优先检查 `works/chapter06/typed-toolbox-lab`。如果学习者已经在该目录中发起请求，也可以直接检查当前目录。

## 评分明细

### 1. 正确性：40 分

- 6 分：定义并使用 `LearningTask[]` 任务列表，数组项结构符合 `LearningTask`
- 5 分：`getTaskTitles(tasks): string[]` 使用 `map` 正确返回标题列表
- 5 分：`filterTasksByStatus(tasks, status): LearningTask[]` 使用 `filter` 正确筛选状态
- 5 分：`findTaskByTitle(tasks, title): LearningTask | undefined` 使用 `find`，并在调用处判断 `undefined`
- 5 分：`getTotalEstimatedMinutes(tasks): number` 使用 `reduce` 正确汇总分钟数
- 6 分：`countTasksByStatus(tasks): TaskStatusCount` 正确使用 `Record<TaskStatus, number>` 统计所有状态
- 4 分：完成长任务、blocked 任务查询和状态统计格式化练习
- 4 分：完成 `hasOpenTasks` 加分练习或等价数组查询；未做加分时可按核心输出质量给 0-2 分

扣分点：

- 直接读取 `find` 结果导致可能为 `undefined`：扣 5-8 分
- `Record<TaskStatus, number>` 缺少状态字段：扣 5-8 分
- 在 domain 函数里直接 `console.log`：每处扣 3 分
- 代码无法运行：正确性最高只能给 15 分

### 2. 类型使用：20 分

- 4 分：数组类型写法清晰，例如 `LearningTask[]`
- 4 分：`find` 返回值包含 `undefined`，调用处有判断
- 4 分：`Record<TaskStatus, number>` 键和值类型准确
- 3 分：`map`、`filter`、`find`、`reduce` 回调参数没有退回 `any`
- 3 分：模块导入导出仍然保持第 5 章规范
- 2 分：没有使用 `any` 或类型断言绕过数组与 Record 错误

### 3. 项目结构：15 分

- 5 分：本章作业目录继续沿用 `src/domain/`、`src/app/`、`src/index.ts` 结构
- 5 分：数组查询和统计逻辑放在 `src/domain/task.ts`
- 5 分：入口文件只创建示例数据并输出结果，没有堆放主要业务函数

### 4. 可运行性：15 分

- 4 分：`pnpm dev` 成功运行并输出本章要求内容
- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功生成 `dist/`
- 3 分：`pnpm start` 成功运行编译后的 JavaScript

### 5. 代码清晰度：10 分

- 4 分：函数命名清晰，例如 `filterTasksByStatus`、`countTasksByStatus`
- 3 分：输出文本能让人看懂查询和统计结果
- 3 分：没有无关实验残留或被注释掉的大段错误代码

## 快速判断题评分

快速判断题计入“类型使用”和“代码清晰度”的综合判断。参考答案：

### 题 1

`findTaskByTitle` 可能找不到符合条件的任务，所以返回值必须是 `LearningTask | undefined`。调用处需要先判断结果是否存在。

### 题 2

`filterTasksByStatus(tasks, "doing")` 可能找到多个任务，也可能一个都找不到，所以返回值仍然是数组。没有匹配项时返回空数组。

### 题 3

`Record<TaskStatus, number>` 表示每个 `TaskStatus` 都必须对应一个数字。只要 `TaskStatus` 包含 `blocked`，统计对象就必须有 `blocked` 字段。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

Agent 还要检查：

- `src/domain/task.ts` 是否包含数组查询和统计函数
- `src/index.ts` 是否创建 `LearningTask[]` 并调用这些函数
- `find` 结果是否先判断再读取字段
- `Record<TaskStatus, number>` 是否覆盖所有状态
- domain 函数是否只返回数据，不直接输出
- 没有用 `any` 或类型断言绕过检查

制造并修复错误的过程通常无法从最终文件直接证明；如果缺少证据，应追问 1-3 个短问题。重点看学习者是否能说明：

- 为什么 `find` 可能是 `undefined`
- `map` / `filter` / `reduce` 的分工
- `Record` 缺字段时 TypeScript 在保护什么

## 通过标准

- 75 分以上：通过，可以进入第 7 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 数组方法的返回值不同：`map` 转换，`filter` 筛选，`find` 找一个，`reduce` 汇总
2. `find` 失败是正常路径，必须在类型里体现
3. `Record<TaskStatus, number>` 能防止新增状态后漏统计
4. domain 层应该保持纯数据处理，不负责输出
5. 不要用 `any` 或类型断言绕过本章练习目标
