# Chapter 11 Rubric：Vitest 测试

满分 100 分。

Agent 评分时应优先检查 `works/chapter11/typed-toolbox-lab`。如果学习者已经在该目录中发起请求，也可以直接检查当前目录。

## 评分明细

### 1. 正确性：40 分

- 5 分：通过包管理器安装真实 `vitest` 依赖
- 4 分：`package.json` 包含 `test: vitest run` 或等价脚本
- 3 分：`vitest.config.ts` 排除 `dist/`，避免构建后重复运行编译产物测试
- 6 分：`src/domain/task.test.ts` 覆盖合法任务、非数组输入、字段类型错误
- 6 分：`src/domain/config.test.ts` 覆盖合法配置和非法状态
- 7 分：`src/app/formatWorkspaceError.test.ts` 覆盖 `file-read`、`invalid-json`、`invalid-data`
- 7 分：`src/app/loadWorkspace.test.ts` 覆盖成功、坏 JSON、坏数据
- 4 分：测试使用稳定 fixture，不依赖当前业务数据文件

扣分点：

- 只有测试文件但没有断言：扣 8 分
- 异步测试没有 `await` 或返回 Promise：扣 6 分
- 测试只覆盖成功路径：扣 6 分
- 代码或测试无法运行：正确性最高 15 分

### 2. 类型使用：20 分

- 5 分：测试代码通过 TypeScript 类型检查
- 4 分：测试中没有使用 `any` 绕过类型
- 4 分：能正确收窄 `Result` 后断言成功值或错误 kind
- 3 分：理解 `never` 穷尽检查主要由编译器验证
- 2 分：测试 fixture 数据仍然经过 Zod parser
- 2 分：能解释单元测试和边界流程测试的区别

### 3. 项目结构：15 分

- 4 分：测试文件靠近被测模块，例如 `task.test.ts` 靠近 `task.ts`
- 4 分：domain 测试不依赖文件系统
- 4 分：app 层测试只在需要时创建临时文件 fixture
- 3 分：没有把测试辅助数据散落到入口文件或生产逻辑中

### 4. 可运行性：15 分

- 5 分：`pnpm test` 成功通过
- 5 分：`pnpm typecheck` 成功通过
- 5 分：`pnpm build` 成功通过

### 5. 代码清晰度：10 分

- 3 分：测试名称清楚描述行为
- 3 分：每个测试只验证一个主要行为
- 2 分：fixture 创建和清理逻辑简单可读
- 2 分：没有无关 console 输出或临时实验残留

## 快速判断题评分

### 题 1

测试优先覆盖稳定核心逻辑，因为 CLI 和 MCP 后续会复用这些逻辑；先锁住核心行为能降低重构风险。

### 题 2

`describe` 用于分组，`it` 定义具体测试用例，`expect` 表达断言。

### 题 3

纯函数容易测试，因为输入输出稳定，不依赖文件系统、时间、网络或进程退出码。

### 题 4

异步测试必须 `await` Promise 或返回 Promise，否则测试可能在异步逻辑完成前结束。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm test
pnpm typecheck
pnpm build
```

Agent 还要检查：

- `package.json` 是否包含真实 `vitest` 版本
- 测试是否有明确断言
- parser 是否覆盖成功和失败路径
- `formatWorkspaceError` 是否覆盖全部错误 kind
- `loadWorkspace` 是否用 fixture 覆盖成功、坏 JSON、坏数据
- 测试是否没有提前引入 CLI 或 MCP

## 通过标准

- 75 分以上：通过，可以进入第 12 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. 测试要锁定行为，不是只运行代码
2. 失败路径和成功路径一样重要
3. 纯函数测试应该简单直接
4. 文件读取流程可以用临时 fixture 测试
5. 后续 CLI/MCP 章节会依赖这些测试保护核心逻辑
