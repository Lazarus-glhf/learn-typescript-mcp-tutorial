# Chapter 02 Rubric：对象类型、类型别名与接口

满分 100 分。

Agent 评分时应优先检查 `works/chapter02/typed-toolbox-lab`。如果学习者已经在该目录中发起请求，也可以直接检查当前目录。

## 评分明细

### 1. 正确性：40 分

- 8 分：`src/index.ts` 定义了 `LearnerProfile`，包含 `name`、`currentChapter`、`preferences`，并正确创建 `learner` 对象
- 8 分：定义了 `LearningTask`，包含 `title`、`estimatedMinutes`、`isCompleted`、可选 `notes`，并正确创建 `task` 对象
- 8 分：`formatLearnerProfile(profile: LearnerProfile): string` 能输出学习者姓名、昵称和章节信息
- 8 分：`formatTaskSummary(task: LearningTask): string` 能输出任务标题、预计分钟数、完成状态和负责人信息
- 8 分：定义并使用 `StudyPlan`，`formatStudyPlan(plan: StudyPlan): string` 能输出学习者和任务关系

扣分点：

- 对象缺少必填字段：每处扣 4-8 分
- 字段名拼写与类型定义不一致：每处扣 4-6 分
- 函数没有真正使用对象参数，而是回退到大量零散参数：每处扣 4 分
- 代码无法运行：正确性最高只能给 15 分

### 2. 类型使用：20 分

- 5 分：对象字段类型准确，`string`、`number`、`boolean` 没有混用
- 4 分：正确使用 `notes?: string` 或等价可选字段，不把可选字段理解成任意类型
- 4 分：正确使用嵌套对象类型，例如 `preferences` 和 `owner`
- 3 分：至少能看懂或使用一个 `interface` 对象类型
- 2 分：函数参数使用对象类型，例如 `LearningTask`、`LearnerProfile`、`StudyPlan`
- 2 分：没有使用 `any` 或不必要类型断言绕过对象类型错误

扣分点：

- 使用 `any`：每处扣 5 分
- 用 `as LearningTask` 强行压过缺字段或错字段：每处扣 6 分
- 可选字段写成 `string | undefined` 也可以接受，但如果学习者无法解释 `?`，扣 2-3 分
- 引入数组、泛型、Zod、类等后续章节概念导致代码复杂：扣 3-5 分

### 3. 项目结构：15 分

- 5 分：本章作业目录保留基础项目结构，代码放在 `src/index.ts`
- 5 分：类型定义、对象创建、函数和输出顺序清晰
- 5 分：没有提前拆模块或引入后续章节目录结构

### 4. 可运行性：15 分

- 7 分：`pnpm dev` 成功运行并输出本章要求内容
- 6 分：`pnpm typecheck` 成功通过
- 2 分：完成缺少字段或字段类型错误的制造与修复练习，并能说明报错含义

如果 Agent 无法运行命令且项目中也没有其他可信证据，可运行性最高只能给 5 分。

### 5. 代码清晰度：10 分

- 4 分：对象类型命名清晰，例如 `LearnerProfile`、`LearningTask`、`StudyPlan`
- 3 分：输出文本能让人看懂学习者、任务、负责人和计划关系
- 3 分：文件中没有无关实验残留或被注释掉的大段错误代码

## 快速判断题评分

快速判断题计入“类型使用”和“代码清晰度”的综合判断。它们不要求写进代码；如果学习者没有主动说明，Agent 应在考核时抽问这些题或等价问题。参考答案：

### 题 1

```ts
type Task = {
  title: string;
  minutes: number;
};

const task: Task = {
  title: "Read docs",
};
```

会报错。`minutes` 是必填字段，但对象里缺少它。

### 题 2

```ts
type Task = {
  title: string;
  notes?: string;
};

const task: Task = {
  title: "Read docs",
};
```

不会报错。`notes?: string` 是可选字段，可以不存在。

### 题 3

如果 `owner` 应该包含 `name: string` 和 `role: string`，可以写成嵌套对象：

```ts
type Task = {
  title: string;
  owner: {
    name: string;
    role: string;
  };
};
```

也可以先定义独立类型再引用：

```ts
type Owner = {
  name: string;
  role: string;
};

type Task = {
  title: string;
  owner: Owner;
};
```

本章两种写法都可以接受。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm dev
pnpm typecheck
```

Agent 还要检查 `src/index.ts` 是否体现了本章目标：

- 对象类型定义，而不是只保留第 1 章的零散变量
- 至少一个可选字段
- 至少一个嵌套对象
- 至少两个接收对象参数的函数
- 没有用 `any` 或类型断言绕过检查

制造并修复对象类型错误的过程通常无法从最终文件直接证明；如果缺少证据，应追问 1-3 个短问题。重点看学习者是否能说明：

- 缺少必填字段为什么会报错
- 字段类型不匹配时，期望类型和实际类型分别是什么
- `notes?: string` 中的 `?` 代表什么

## 通过标准

- 75 分以上：通过，可以进入第 3 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 对象类型描述的是对象的形状
2. 必填字段和可选字段的区别
3. 字段名必须完全匹配
4. 嵌套对象让相关数据保持在同一个模型里
5. 对象参数比一长串零散参数更清楚
6. 不要用 `any` 或类型断言绕过本章练习目标
