# Chapter 10 Rubric：`async` / `await` 与错误处理

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 5 分：实现 `src/domain/result.ts`，包含 `Result<T, E>`、`ok`、`err`
- 6 分：实现 `readJsonFile(filePath): Promise<Result<unknown, ReadJsonError>>`
- 5 分：`readJsonFile` 能区分 `file-read` 和 `invalid-json`
- 6 分：实现 `loadWorkspace`，组合配置和任务加载
- 5 分：`loadWorkspace` 使用 `Promise.all` 读取互不依赖的文件
- 5 分：Zod 校验失败被转换成 `invalid-data`
- 4 分：实现 `formatWorkspaceError`，输出清晰错误信息
- 4 分：入口文件根据 `result.ok` 处理成功和失败，并设置失败退出码

扣分点：

- `loadWorkspace` 返回裸数据并让错误直接冒泡：扣 10 分
- 把所有错误都吞掉并返回空数组或默认配置：扣 10 分
- 没有实际验证失败路径：扣 6 分
- 代码无法运行：正确性最高 15 分

### 2. 类型使用：20 分

- 5 分：`Result<T, E>` 判别联合使用准确
- 4 分：错误类型使用 `kind` 字段区分失败原因
- 4 分：`formatWorkspaceError` 使用 `switch` 或等价收窄处理所有错误分支
- 3 分：加入 `never` 穷尽检查
- 2 分：没有用 `any` 绕过错误类型
- 2 分：能解释 `async` 函数为什么返回 Promise

### 3. 项目结构：15 分

- 4 分：`src/domain/result.ts` 只放通用结果类型
- 4 分：`src/node/readJsonFile.ts` 只处理文件读取和 JSON 语法
- 4 分：`src/app/loadWorkspace.ts` 组合 node 层和 domain 层
- 3 分：`src/index.ts` 只负责调用、输出和退出码

### 4. 可运行性：15 分

- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功生成 `dist/`
- 3 分：`pnpm start` 成功运行合法数据
- 2 分：坏 JSON 会输出清晰 `invalid-json` 错误
- 2 分：坏数据会输出清晰 `invalid-data` 错误

### 5. 代码清晰度：10 分

- 3 分：错误信息适合人阅读，不只是原始 stack trace
- 3 分：函数职责清楚，命名贴合边界和层次
- 2 分：没有重复的 try/catch 和错误格式化代码
- 2 分：没有无关实验残留或注释掉的大段失败代码

## 快速判断题评分

### 题 1

`async` 函数总是返回 Promise；普通返回值会被包装成 resolved Promise。

### 题 2

`await` 等待 Promise。如果 Promise rejected，`await` 会在当前 async 函数中抛出错误，可被 `try/catch` 捕获。

### 题 3

`Promise.all` 适合并行执行互不依赖的异步任务；如果后一个任务依赖前一个结果，就应该顺序 `await`。

### 题 4

`Result<T, E>` 让失败成为返回值的一部分，调用方必须检查 `ok` 后才能使用成功值。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm typecheck
pnpm build
pnpm start
```

Agent 还要检查：

- `readJsonFile` 是否返回 `Promise<Result<unknown, ReadJsonError>>`
- `loadWorkspace` 是否返回 `Promise<Result<Workspace, WorkspaceError>>`
- 是否使用 `Promise.all` 读取配置和任务
- 文件不存在是否被归类为 `file-read`
- JSON 语法错误是否被归类为 `invalid-json`
- Zod 校验错误是否被归类为 `invalid-data`
- `src/index.ts` 是否设置失败退出码
- 是否没有提前引入 Vitest、CLI 参数或 MCP

## 通过标准

- 75 分以上：通过，可以进入第 11 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 异步失败不是特殊情况，而是文件边界的正常分支
2. `try/catch` 应该放在边界附近，不要散落到每个业务函数
3. `Result<T, E>` 让失败路径在类型上可见
4. `kind` 字段让错误分支可以被 TypeScript 收窄
5. `Promise.all` 只适合互不依赖的异步任务
