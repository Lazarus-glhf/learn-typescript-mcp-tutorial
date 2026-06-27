# Chapter 12 Rubric：CLI 设计与命令参数

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 6 分：实现 `src/cli/args.ts`，能解析 `summary --config ... --tasks ...`
- 5 分：参数错误返回结构化失败，不直接 throw 或静默默认
- 6 分：实现 `src/cli/runCli.ts`，返回 `CliResult`
- 5 分：`runCli` 能处理 workspace 加载失败并返回 stderr
- 4 分：`src/index.ts` 只连接 `process.argv`、stdout、stderr 和退出码
- 4 分：成功命令输出项目名和任务数量
- 4 分：缺少参数时返回非 0 退出码和清晰错误
- 3 分：未知命令返回非 0 退出码和清晰错误
- 3 分：练习中支持 `list` 命令或等价扩展

扣分点：

- 在 `parseArgs` 中读文件或调用 Zod：扣 6 分
- 失败时仍然返回退出码 0：扣 8 分
- 错误输出混进 stdout：扣 4 分
- 代码无法运行：正确性最高 15 分

### 2. 类型使用：20 分

- 5 分：`CliCommand` 使用清晰类型或判别联合
- 4 分：`parseArgs` 返回 `Result<CliCommand, string>` 或等价结构
- 4 分：`CliResult` 明确包含 `exitCode`、`stdout`、`stderr`
- 3 分：测试中正确收窄 Result
- 2 分：没有使用 `any` 绕过参数解析类型
- 2 分：能解释 `process.argv.slice(2)` 的原因

### 3. 项目结构：15 分

- 5 分：CLI 参数解析放在 `src/cli/args.ts`
- 5 分：CLI 运行协调放在 `src/cli/runCli.ts`
- 3 分：入口文件保持很薄
- 2 分：domain/app/node 层没有反向依赖 CLI 层

### 4. 可运行性：15 分

- 4 分：`pnpm test` 成功通过
- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功通过
- 3 分：真实 `node dist/index.js summary ...` 命令成功运行

### 5. 代码清晰度：10 分

- 3 分：错误消息短而明确
- 3 分：stdout 输出稳定，适合复制或管道使用
- 2 分：参数解析函数小而可读
- 2 分：没有无关调试输出或实验残留

## 快速判断题评分

### 题 1

`process.argv` 前两个元素通常是 Node 可执行文件路径和脚本路径，用户参数从 `slice(2)` 开始。

### 题 2

stdout 用于正常结果，stderr 用于错误诊断。区分它们有利于脚本管道和自动化调用。

### 题 3

非 0 退出码表示命令失败，调用方或 CI 可以据此判断命令是否成功。

### 题 4

CLI 层负责参数、输出和退出码；domain/app/node 层负责核心逻辑和边界读取。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm test
pnpm typecheck
pnpm build
node dist/index.js summary --config data/config.json --tasks data/tasks.json
node dist/index.js summary --config data/config.json
```

Agent 还要检查：

- 成功命令是否输出到 stdout
- 失败命令是否输出到 stderr
- 失败命令是否产生非 0 退出码
- 参数解析是否有测试覆盖
- `src/index.ts` 是否保持很薄
- 是否没有提前引入 MCP Server

## 通过标准

- 75 分以上：通过，可以进入第 13 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. CLI 是应用外壳，不是业务逻辑仓库
2. 参数错误必须显式失败
3. stdout/stderr 和 exit code 是 CLI 合约的一部分
4. `runCli(args)` 比直接测试 `process.argv` 更容易验证
5. 第 13 章 MCP tool 会复用已经稳定的 app/domain 逻辑
