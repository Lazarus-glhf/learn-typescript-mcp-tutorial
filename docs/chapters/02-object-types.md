# Chapter 02：对象类型、类型别名与接口

## 本章目标

你将把第 1 章里的零散变量和函数，整理成更接近真实项目的数据模型：任务对象、学习者对象和任务摘要函数。

完成本章后，你应该能够回答：

- TypeScript 里的对象类型描述什么
- `type` 别名适合解决什么问题
- `interface` 和 `type` 在本章范围内有什么共同点
- 可选字段 `?` 表示什么
- 为什么函数参数可以直接接收一个对象
- 为什么对象字段名写错或缺失时会报错

本章结束时，你的 `src/index.ts` 会包含：

- 一个 `LearnerProfile` 对象类型
- 一个 `LearningTask` 对象类型
- 至少一个嵌套对象
- 至少一个可选字段
- 两个接收对象作为参数的函数
- 一次你主动制造并修复过的对象类型错误

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| 对象类型 | 描述对象里应该有哪些字段，以及字段分别是什么类型 |
| `type` 别名 | 给一段类型结构起名字，方便复用 |
| `interface` | 另一种描述对象结构的方式，本章先用于对象模型 |
| 可选字段 | 表示某个字段可以不存在，例如 `notes?: string` |
| 嵌套对象 | 对象的字段本身也是对象，例如 `profile.preferences.theme` |
| 对象参数 | 函数接收一个完整对象，而不是一长串零散参数 |

本章仍然不引入数组、联合类型、泛型、Zod 或类。它只解决一个问题：如何把相关数据组织成清晰的对象结构。

## 概念解释

### 为什么需要对象类型

第 1 章我们用几个独立变量表示任务：

```ts
const taskTitle = "Learn TypeScript basics";
const estimatedMinutes = 45;
const isCompleted = false;
```

这能运行，但当字段越来越多时，零散变量会很难维护。

更自然的写法是把相关数据放进一个对象：

```ts
const task = {
  title: "Learn TypeScript basics",
  estimatedMinutes: 45,
  isCompleted: false,
};
```

TypeScript 可以继续检查这个对象的字段类型。为了让结构可以复用，我们会给它起一个类型名字。

### 使用 `type` 描述对象

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
};
```

这段代码表示：`LearningTask` 类型的对象必须有三个字段：

- `title` 是字符串
- `estimatedMinutes` 是数字
- `isCompleted` 是布尔值

然后可以这样创建对象：

```ts
const task: LearningTask = {
  title: "Learn object types",
  estimatedMinutes: 60,
  isCompleted: false,
};
```

如果少写字段，TypeScript 会报错：

```ts
const task: LearningTask = {
  title: "Learn object types",
  estimatedMinutes: 60,
};
```

因为缺少 `isCompleted`。

### 可选字段

不是所有字段都必须一直存在。比如任务备注可以有，也可以没有。

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  notes?: string;
};
```

`notes?: string` 表示：

```text
notes 可以不存在。
如果存在，它必须是 string。
```

下面两个对象都合法：

```ts
const taskWithoutNotes: LearningTask = {
  title: "Learn object types",
  estimatedMinutes: 60,
  isCompleted: false,
};

const taskWithNotes: LearningTask = {
  title: "Learn object types",
  estimatedMinutes: 60,
  isCompleted: false,
  notes: "Focus on type aliases first",
};
```

### 嵌套对象

对象字段可以继续是对象。

```ts
type LearnerProfile = {
  name: string;
  currentChapter: number;
  preferences: {
    studyMinutesPerDay: number;
    wantsAgentFeedback: boolean;
  };
};
```

这里 `preferences` 本身也是一个对象，它有两个字段。

### 使用 `interface` 描述对象

`interface` 是 TypeScript 里专门用来描述对象结构的一种写法。它关心的是对象的“形状”：有哪些字段，每个字段是什么类型。

例如下面这个 `interface`：

```ts
interface LearningTask {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  notes?: string;
}
```

意思和下面这个 `type` 对象类型非常接近：

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  notes?: string;
};
```

把 `type` 写法重写成 `interface` 时，通常只需要做三件事：

1. 把开头的 `type LearningTask = {` 改成 `interface LearningTask {`
2. 保留 `{ ... }` 里面的字段定义
3. 删除最后 `}` 后面的分号

也就是说，从：

```ts
type LearnerProfile = {
  name: string;
  currentChapter: number;
  preferences: {
    studyMinutesPerDay: number;
    wantsAgentFeedback: boolean;
  };
};
```

可以改成：

```ts
interface LearnerProfile {
  name: string;
  currentChapter: number;
  preferences: {
    studyMinutesPerDay: number;
    wantsAgentFeedback: boolean;
  };
}
```

改完以后，使用方式不变：

```ts
const learner: LearnerProfile = {
  name: "Lazarus",
  currentChapter: 2,
  preferences: {
    studyMinutesPerDay: 60,
    wantsAgentFeedback: true,
  },
};

function formatLearnerProfile(profile: LearnerProfile): string {
  return `${profile.name} is studying chapter ${profile.currentChapter}`;
}
```

在本章范围内，你可以先记住：

```text
type 和 interface 都能描述对象形状。
interface 更常见于“对象模型”和“库暴露出来的对象约定”。
type 除了能描述对象，后续还会用来描述联合类型等更多类型组合。
```

所以本教程前期优先用 `type` 保持写法统一；遇到库或团队代码里的 `interface` 时，你要能看懂，并能把简单对象类型互相改写。

后续章节会继续说明它们更细的差异。现在不要把重点放在争论哪一个更好，而是先掌握对象结构本身。

### 对象作为函数参数

对象类型最常见的用途之一，是让函数接收一个完整对象。

```ts
function formatTaskSummary(task: LearningTask): string {
  return `${task.title} (${task.estimatedMinutes} min)`;
}
```

这样函数参数更清楚：它要的是一个任务，而不是一串顺序容易写错的参数。

## 最小示例

把下面代码放进 `src/index.ts`，替换第 1 章代码：

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  notes?: string;
};

type LearnerProfile = {
  name: string;
  currentChapter: number;
  preferences: {
    studyMinutesPerDay: number;
    wantsAgentFeedback: boolean;
  };
};

const learner: LearnerProfile = {
  name: "Lazarus",
  currentChapter: 2,
  preferences: {
    studyMinutesPerDay: 60,
    wantsAgentFeedback: true,
  },
};

const task: LearningTask = {
  title: "Learn object types",
  estimatedMinutes: 60,
  isCompleted: false,
  notes: "Group related values into one model",
};

function formatLearnerProfile(profile: LearnerProfile): string {
  return `${profile.name} is studying chapter ${profile.currentChapter}`;
}

function formatTaskSummary(task: LearningTask): string {
  const statusText = task.isCompleted ? "completed" : "in progress";
  return `${task.title} - ${task.estimatedMinutes} min - ${statusText}`;
}

console.log(formatLearnerProfile(learner));
console.log(formatTaskSummary(task));
console.log(`Daily study target: ${learner.preferences.studyMinutesPerDay} minutes`);
```

运行：

```bash
pnpm dev
```

期望输出：

```text
Lazarus is studying chapter 2
Learn object types - 60 min - in progress
Daily study target: 60 minutes
```

再运行类型检查：

```bash
pnpm typecheck
```

如果没有类型错误，命令会正常结束。

## 项目实践

### Step 1：确认你在项目目录中

按 README 的统一作业规则准备本章目录：`works/chapter02/typed-toolbox-lab`。

确认项目至少包含：

```text
works/chapter02/typed-toolbox-lab/
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

你应该看到学习者信息、任务摘要和每日学习时长。

### Step 4：运行类型检查

```bash
pnpm typecheck
```

如果通过，说明对象字段和函数参数类型匹配。

### Step 5：制造一个缺少字段的错误

临时把 `task` 改成下面这样，删除 `isCompleted` 字段：

```ts
const task: LearningTask = {
  title: "Learn object types",
  estimatedMinutes: 60,
  notes: "Group related values into one model",
};
```

运行：

```bash
pnpm typecheck
```

你应该看到类似错误：

```text
Property 'isCompleted' is missing in type ... but required in type 'LearningTask'.
```

这说明 TypeScript 知道 `LearningTask` 必须有 `isCompleted`。

把 `isCompleted: false` 加回去，再次运行：

```bash
pnpm typecheck
```

直到类型检查通过。

### Step 6：制造一个字段类型错误

临时把 `estimatedMinutes` 改成字符串：

```ts
estimatedMinutes: "60",
```

运行：

```bash
pnpm typecheck
```

你应该看到类似错误：

```text
Type 'string' is not assignable to type 'number'.
```

修复为：

```ts
estimatedMinutes: 60,
```

再运行：

```bash
pnpm typecheck
```

## 练习题

### 必做练习 1：扩展学习者对象

给 `LearnerProfile` 增加一个可选字段：

```ts
nickname?: string;
```

然后在 `learner` 对象里设置它，例如：

```ts
nickname: "Laz"
```

更新 `formatLearnerProfile`，让输出包含昵称：

```text
Lazarus (Laz) is studying chapter 2
```

如果没有昵称，函数也应该能输出正常文本。

提示：本章还没有学习联合类型和复杂收窄，不需要写得很花。可以用简单的 `if (profile.nickname)` 判断。

### 必做练习 2：添加任务负责人

给 `LearningTask` 的类型定义增加一个嵌套对象字段：

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  notes?: string;
  owner: {
    name: string;
    role: string;
  };
};
```

然后更新 `task` 对象，补上同样结构的 `owner` 值：

```ts
const task: LearningTask = {
  title: "Learn object types",
  estimatedMinutes: 60,
  isCompleted: false,
  notes: "Group related values into one model",
  owner: {
    name: "Lazarus",
    role: "learner",
  },
};
```

最后让 `formatTaskSummary` 输出负责人信息。

期望输出包含：

```text
Owner: Lazarus (learner)
```

### 必做练习 3：添加学习计划对象

新增一个类型：

```ts
type StudyPlan = {
  learner: LearnerProfile;
  task: LearningTask;
  createdByAgent: boolean;
};
```

创建一个 `studyPlan` 对象，并新增函数：

```ts
function formatStudyPlan(plan: StudyPlan): string {
  return `${plan.learner.name} will work on: ${plan.task.title}`;
}
```

运行时输出 `formatStudyPlan(studyPlan)` 的结果。

### 加分练习：使用 `interface` 重写一个对象类型

参考前面“使用 `interface` 描述对象”的改写规则，把 `LearnerProfile` 或 `LearningTask` 其中一个从 `type` 写法改成 `interface` 写法。

例如：

```ts
type LearningTask = {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
};
```

可以重写为：

```ts
interface LearningTask {
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
}
```

要求：

- 项目仍然能运行
- `pnpm typecheck` 仍然通过
- 不要同时引入类、继承或泛型

### 快速判断题

这些题不要求写进代码。Agent 考核时可能会抽问。

#### 题 1

下面代码会不会报错？为什么？

```ts
type Task = {
  title: string;
  minutes: number;
};

const task: Task = {
  title: "Read docs",
};
```

#### 题 2

下面代码会不会报错？为什么？

```ts
type Task = {
  title: string;
  notes?: string;
};

const task: Task = {
  title: "Read docs",
};
```

#### 题 3

下面 `owner` 字段的类型应该怎么写？

```ts
type Task = {
  title: string;
  owner: ?;
};
```

如果 `owner` 应该包含 `name: string` 和 `role: string`。

## 常见错误

### 错误 1：把对象字段名写错

例如类型里写的是：

```ts
type LearningTask = {
  estimatedMinutes: number;
};
```

对象里却写成：

```ts
const task: LearningTask = {
  estimateMinutes: 60,
};
```

`estimatedMinutes` 和 `estimateMinutes` 不是同一个字段。字段名必须完全一致。

### 错误 2：忘记必填字段

如果类型中没有 `?`，字段就是必填的。

```ts
type LearningTask = {
  title: string;
  isCompleted: boolean;
};
```

这时对象必须包含 `title` 和 `isCompleted`。

### 错误 3：把可选字段理解成“任何类型都可以”

`notes?: string` 不是说 `notes` 可以是任何值。

它的意思是：

```text
notes 可以不存在。
如果 notes 存在，它必须是 string。
```

所以这仍然会报错：

```ts
const task: LearningTask = {
  title: "Learn object types",
  estimatedMinutes: 60,
  isCompleted: false,
  notes: 123,
};
```

### 错误 4：过早引入类

本章目标是学习对象类型，不是学习面向对象写法。

暂时不要写：

```ts
class LearningTask {
  // ...
}
```

对象类型已经足够表达本章需求。类会带来构造函数、实例、方法、`this` 等新概念，后面需要时再讲。

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter02/typed-toolbox-lab`，然后在仓库根目录或该章节目录里对 AI Agent 说：

```text
考核第 2 章作业
```

或者：

```text
检查 chapter-02
```

Agent 应自行读取项目目录、检查 `src/index.ts`、运行必要命令，并根据本章 rubric 打分。你不需要把目录结构、源码和命令输出手动复制给 Agent。

Agent 可能会追问你 1-3 个短问题，确认你是否理解：

- 必填字段和可选字段的区别
- `type` 和 `interface` 在本章对象建模中的共同点
- 缺少对象字段或字段类型错误时，TypeScript 报错在说什么

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 3 章。

如果低于 75 分，先根据反馈修正本章项目，再重新考核。
