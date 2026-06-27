# Chapter 09 Rubric：Zod 校验与 `unknown`

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 5 分：通过包管理器安装真实 `zod` 依赖，`package.json` 中存在有效版本
- 6 分：`src/domain/task.ts` 定义 `TaskStatusSchema`、`LearningTaskSchema`、`LearningTaskListSchema`
- 6 分：`LearningTask` 和 `TaskStatus` 使用 `z.infer` 从 schema 推导
- 5 分：`parseLearningTasks(value: unknown)` 调用 Zod schema 校验任务数组
- 5 分：练习中加入可选 `priority` 字段，并用 Zod schema 表达
- 5 分：`src/domain/config.ts` 定义 `AppConfigSchema` 和 `AppConfig`
- 4 分：`src/node/loadConfig.ts` 读取并校验 `data/config.json`
- 4 分：`src/index.ts` 能输出任务和配置结果

扣分点：

- 只手写 TypeScript type，没有真实 Zod schema：正确性最高 18 分
- 继续把 `JSON.parse` 结果断言为 `LearningTask[]`：扣 8 分
- schema 和手写 type 不一致：扣 6 分
- 代码无法运行：正确性最高 15 分

### 2. 类型与边界：20 分

- 5 分：外部 JSON 进入程序时仍然先作为 `unknown`
- 5 分：任务类型和配置类型都来自 `z.infer`
- 4 分：能解释 `parse` 与 `safeParse` 的区别
- 3 分：没有使用 `any` 或类型断言绕过 schema
- 3 分：能说明 Zod 是运行时校验，不替代 TypeScript 编译期检查

### 3. 项目结构：15 分

- 4 分：任务 schema 放在 `src/domain/task.ts`
- 4 分：配置 schema 放在 `src/domain/config.ts`
- 3 分：文件读取逻辑放在 `src/node/`
- 2 分：`src/domain/index.ts` 正确导出 domain 模块
- 2 分：入口文件只组织调用和输出，不堆放 schema

### 4. 可运行性：15 分

- 4 分：`pnpm dev` 成功读取合法任务和配置
- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功生成 `dist/`
- 3 分：`pnpm start` 成功运行编译后的 JavaScript

### 5. 代码清晰度：10 分

- 3 分：schema 命名清晰，例如 `LearningTaskSchema`、`AppConfigSchema`
- 3 分：`safeParse` 失败时错误信息可读，并包含 `Invalid tasks JSON:` 或等价上下文
- 2 分：可选字段只用于业务上确实可选的字段
- 2 分：没有无关实验残留或大段注释掉的错误代码

## 快速判断题评分

### 题 1

Zod schema 是运行时代码，可以检查 JSON 文件解析后的实际值；TypeScript type 只在编译期帮助检查源码。

### 题 2

`unknown` 仍然应该保留，因为外部数据在通过 Zod 校验前还不可信。

### 题 3

`z.infer` 从 schema 推导类型，能避免 schema 和手写 type 长期不同步。

### 题 4

`parse` 校验失败时抛错；`safeParse` 返回 `{ success: true, data }` 或 `{ success: false, error }`，适合手动整理错误信息。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

Agent 还要检查：

- `package.json` 是否包含真实 `zod` 版本，不是手写占位符
- `data/tasks.json` 和 `data/config.json` 是否存在
- `src/domain/task.ts` 是否用 Zod schema 表达任务数据
- `src/domain/config.ts` 是否用 Zod schema 表达配置数据
- TypeScript 类型是否来自 `z.infer`
- `JSON.parse` 结果是否显式进入 `unknown` 边界
- 坏任务数据是否会被 Zod 拒绝
- 坏配置数据是否会被 Zod 拒绝
- 是否没有提前引入测试框架、CLI 或 MCP

## 通过标准

- 75 分以上：通过，可以进入第 10 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. schema 应该是运行时校验的唯一事实来源
2. `z.infer` 让 TypeScript 类型跟随 schema
3. `unknown` 是边界处的安全默认值，不会因为引入 Zod 而消失
4. `safeParse` 适合把 Zod 错误转成更友好的应用错误
5. 读取文件属于 Node 层，数据含义和 schema 属于 domain 层
