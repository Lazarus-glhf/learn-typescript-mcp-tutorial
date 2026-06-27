# Chapter 14：最终整理与复盘

## 本章目标

你已经从最小 TypeScript 项目一路走到 CLI 和 MCP Server。本章不再引入大概念，而是把项目整理成一个可以长期维护、可以交给 Agent 检查、也可以继续扩展的小型 typed toolkit。

本章会完成：

- 整理最终项目结构
- 确认 README 说明清楚
- 跑完整验证命令
- 检查 CLI 和 MCP 入口
- 删除或归档临时实验残留
- 回顾每个阶段学到的能力
- 准备最终提交

完成本章后，你应该能够回答：

- 这个项目的核心能力是什么
- 哪些代码属于 domain、app、node、cli、mcp 层
- 如何用命令验证项目仍然健康
- 如何让 Agent 检查最终项目
- 后续扩展功能时应该先改哪一层

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| final verification | 发布或提交前的完整验证 |
| project hygiene | 清理实验残留，让仓库可维护 |
| maintenance checklist | 后续改动前后都能复用的检查清单 |
| learning review | 把章节知识串成整体能力 |

## 概念解释

### 最终项目不是代码越多越好

本教程的目标不是堆功能，而是建立一条清晰路线：

```text
domain -> app -> node -> cli -> mcp
```

每一层都有职责：

- domain：类型、schema、纯数据规则
- app：组织业务流程，返回 typed result
- node：文件系统等运行时边界
- cli：命令参数、stdout、stderr、退出码
- mcp：把 app 能力暴露给 Agent

最终整理时，要确认这些层没有互相污染。

### 完整验证命令

最终提交前至少运行：

```bash
pnpm test
pnpm typecheck
pnpm build
node dist/index.js summary --config data/config.json --tasks data/tasks.json
node dist/index.js list --config data/config.json --tasks data/tasks.json
```

如果项目包含 MCP 入口，还要确认：

```bash
node dist/mcp-server.js
```

这个命令本身会等待 MCP client 连接，不适合当普通前台命令长期运行。更好的验证方式是用 MCP Inspector 或一个 SDK client 调用 tool。

### README 是项目入口

README 应该让新读者知道：

- 这个项目是什么
- 如何安装依赖
- 如何运行测试和构建
- 如何运行 CLI
- 如何启动 MCP Server
- 教程章节在哪里
- Agent 如何评分

最终章不要求你写很长的 README，但不能只留下内部笔记。

## 最小示例

最终 README 可以包含这样的命令区：

```md
## Commands

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm build
node dist/index.js summary --config data/config.json --tasks data/tasks.json
node dist/index.js list --config data/config.json --tasks data/tasks.json
node dist/mcp-server.js
```
```

MCP 配置可以写成：

```json
{
  "command": "node",
  "args": ["dist/mcp-server.js"]
}
```

并说明使用前先运行：

```bash
pnpm build
```

## 项目实践

### Step 1：检查最终目录结构

一个完成后的练习项目大致应该是：

```text
typed-toolbox-lab/
  data/
    config.json
    tasks.json
  src/
    app/
      formatWorkspaceError.ts
      formatWorkspaceError.test.ts
      loadWorkspace.ts
      loadWorkspace.test.ts
    cli/
      args.ts
      args.test.ts
      runCli.ts
      runCli.test.ts
    domain/
      config.ts
      config.test.ts
      result.ts
      task.ts
      task.test.ts
    mcp/
      server.ts
      server.test.ts
    node/
      readJsonFile.ts
    index.ts
    mcp-server.ts
  package.json
  tsconfig.json
  vitest.config.ts
  README.md
```

不要求文件名完全一致，但职责应该接近。

### Step 2：跑完整验证

运行：

```bash
pnpm test
pnpm typecheck
pnpm build
node dist/index.js summary --config data/config.json --tasks data/tasks.json
node dist/index.js list --config data/config.json --tasks data/tasks.json
```

每个命令都应该通过。

### Step 3：验证失败路径仍然清楚

至少验证一个 CLI 失败命令：

```bash
node dist/index.js summary --config data/config.json
```

它应该：

- 输出缺少 `--tasks` 的错误
- 返回非 0 退出码
- 不输出未处理 stack trace

### Step 4：验证 MCP 入口

优先用 MCP Inspector 或 SDK client 调用：

```text
workspace_summary
```

输入：

```json
{
  "configPath": "data/config.json",
  "tasksPath": "data/tasks.json"
}
```

如果环境不方便启动 MCP client，至少确认：

- `pnpm build` 通过
- `dist/mcp-server.js` 存在
- `src/mcp/server.test.ts` 通过

### Step 5：整理 README

README 至少包含：

- 项目目标
- 安装命令
- 测试和构建命令
- CLI 示例
- MCP 启动方式
- 教程章节索引
- Agent 考核方式

### Step 6：做最终提交

最终提交前运行：

```bash
git status --short
git diff --stat
```

确认只包含你准备提交的文档或代码改动。

## 练习题

### 练习 1：写最终复盘

在项目 README 或 `docs/final-review.md` 中写 5-10 条复盘：

- 最难理解的一章是什么
- 哪个 TypeScript 概念最有用
- 哪个错误最容易再次犯
- 后续想扩展什么功能

### 练习 2：设计下一个 tool

基于现有结构，设计一个新 tool：

```text
workspace_filter_tasks
```

它可以按 `status` 过滤任务。

只需要写设计说明，不要求本章实现。

### 练习 3：让 Agent 做最终评分

在项目根目录对 Agent 说：

```text
考核最终项目
```

Agent 应根据最终 rubric 检查目录、命令、CLI、MCP 和 README。

## 常见错误

### 错误 1：最终章继续加大功能

最终章重点是整理、验证和复盘。不要在最后一章突然加入数据库、HTTP Server 或复杂 UI。

### 错误 2：只跑成功路径

最终项目必须验证失败路径，尤其是 CLI 参数错误和外部数据错误。

### 错误 3：README 没有运行说明

代码能跑但 README 不说明怎么跑，项目仍然不可交付。

### 错误 4：MCP 入口没有构建验证

MCP Client 通常运行 `dist/` 里的文件。源码存在不代表构建产物可用。

## AI Agent 考核指令

完成本章后，在你的项目根目录对 Agent 说：

```text
考核最终项目
```

Agent 应自行读取项目目录和 README，运行完整验证命令，检查 CLI 成功/失败路径，尽量调用 MCP tool，并根据最终 rubric 打分。

## 本章通过标准

你完成本章后，应该满足：

- README 能让新读者独立运行项目
- `pnpm test` 通过，且不会重复运行 `dist/` 里的编译产物测试
- `pnpm typecheck` 通过
- `pnpm build` 通过
- CLI 成功命令可运行
- CLI 失败命令返回非 0 退出码
- MCP server 可构建，且 tool 可被 Inspector 或 SDK client 调用
- 项目结构层次清楚
- 没有明显实验残留

到这里，整个教程完成。后续扩展时，优先保持这条原则：核心逻辑先在 domain/app 层稳定，再包装成 CLI、MCP 或其他外壳。
