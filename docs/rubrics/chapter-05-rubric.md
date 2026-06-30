# Chapter 05 Rubric：模块系统与项目拆分

满分 100 分。

Agent 评分时应优先检查 `works/chapter05/typed-toolbox-lab`。如果学习者已经在该目录中发起请求，也可以直接检查当前目录。

## 评分明细

### 1. 正确性：40 分

- 7 分：创建 `src/domain/task.ts`，并正确导出 `TaskStatus`、`LearningTask`、`formatStatus`
- 6 分：创建 `src/app/formatters.ts`，并正确导出 `formatTaskSummary`、`formatTaskNotes`
- 6 分：`src/index.ts` 正确导入类型和函数，并能输出任务摘要与备注
- 6 分：完成 `isTaskDone(task: LearningTask): boolean` 和 `formatDoneLabel(task: LearningTask): string`
- 6 分：创建 `src/domain/learner.ts`，并正确导出 `LearnerProfile`、`formatLearner`
- 5 分：`src/index.ts` 被整理为入口文件，不再堆放主要类型定义和业务函数
- 4 分：完成 barrel 文件加分练习或等价导出整理；如果未做加分练习，本项可按模块清晰度酌情给分，但最高 2 分

扣分点：

- 只创建目录但没有真正拆分代码：扣 8-12 分
- 忘记 `export` 导致其它文件无法导入：每处扣 4-6 分
- 导入路径缺少 `.js` 导致 `NodeNext` 类型检查或编译产物失败：每处扣 5 分
- 代码无法运行：正确性最高只能给 15 分

### 2. 类型使用：20 分

- 5 分：正确使用 `export type` 或 `import type` 导出/导入类型
- 4 分：普通函数和值使用正常 `export` / `import`
- 4 分：模块间类型引用保持准确，没有退回 `any`
- 3 分：能解释为什么 NodeNext 相对导入推荐写 `.js`
- 2 分：理解类型导入和运行时值导入的区别
- 2 分：没有使用类型断言或 `any` 掩盖模块拆分错误

扣分点：

- 使用 `any`：每处扣 5 分
- 把类型当成运行时值使用并导致运行错误：扣 5-8 分
- 为了省事把 `module` / `moduleResolution` 改成其它模式逃避 `.js` 导入：扣 6 分

### 3. 项目结构：15 分

- 5 分：本章作业目录结构包含 `src/domain/`、`src/app/`、`src/index.ts`
- 5 分：`domain` 放类型和纯逻辑，`app` 放展示格式化，`index` 放入口组织
- 5 分：没有提前引入数组、泛型、Zod、测试框架、CLI 或 MCP

### 4. 可运行性：15 分

- 4 分：`pnpm dev` 成功运行并输出本章要求内容
- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功生成 `dist/`
- 3 分：`pnpm start` 成功运行编译后的 JavaScript

如果 Agent 无法运行命令且项目中也没有其他可信证据，可运行性最高只能给 5 分。

### 5. 代码清晰度：10 分

- 4 分：文件命名和目录命名清晰
- 3 分：导入导出语句简洁，没有循环依赖或无用导入
- 3 分：入口文件输出文本清楚，文件中没有无关实验残留

## 快速判断题评分

快速判断题计入“类型使用”和“代码清晰度”的综合判断。它们不要求写进代码；如果学习者没有主动说明，Agent 应在考核时抽问这些题或等价问题。参考答案：

### 题 1

在 `NodeNext` 配置下，TypeScript 要模拟 Node.js ESM 的真实运行方式。源码虽然是 `.ts`，但编译后运行的是 `.js`，所以相对导入推荐写编译后的扩展名：

```ts
import { formatStatus } from "./domain/task.js";
```

### 题 2

`import type` 表示导入的是 TypeScript 类型，只用于编译期检查，编译成 JavaScript 后不会作为运行时代码导入。

### 题 3

`src/index.ts` 是程序入口，适合组织数据和调用函数。如果长期把所有类型和业务函数都放在入口文件里，后续数组、JSON、测试、CLI 章节会变得难维护。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

Agent 还要检查项目结构：

```text
src/
  index.ts
  domain/
    task.ts
    learner.ts
  app/
    formatters.ts
```

如果学习者做了 barrel 文件加分练习，还应检查：

```text
src/domain/index.ts
```

Agent 还要检查：

- 相对导入路径是否写 `.js`
- 类型是否使用 `export type` / `import type` 或等价安全写法
- `src/index.ts` 是否仍然堆放主要类型和业务函数
- 多文件项目的编译产物是否能用 `pnpm start` 运行

制造并修复导入路径错误的过程通常无法从最终文件直接证明；如果缺少证据，应追问 1-3 个短问题。重点看学习者是否能说明：

- 为什么 `./app/formatters` 在 NodeNext 下可能报错
- 为什么应改成 `./app/formatters.js`
- 类型导入和函数导入有什么差别

## 通过标准

- 75 分以上：通过，可以进入第 6 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 模块拆分的目标是职责清晰，不是为了增加文件数量
2. `export` 让其它文件可以导入当前文件的函数和值
3. `export type` / `import type` 表示类型只用于编译期
4. `NodeNext` 下相对导入要面向编译后的 `.js` 文件
5. `index.ts` 应该逐渐变薄，domain 和 app 文件承担主要逻辑
