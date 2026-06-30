# Chapter 13：MCP Server 入门

## 本章目标

第 12 章把 typed core 包装成了 CLI。本章会把同一套 app/domain 逻辑包装成 MCP Server tool，让 AI Agent 可以通过 Model Context Protocol 调用你的项目能力。

本章会实现一个最小 stdio MCP Server，暴露一个 tool：

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

输出：

```text
Project: typed-toolbox-lab
Tasks: 2
```

完成本章后，你应该能够回答：

- MCP Server 和 CLI 的相同点与不同点
- stdio transport 是什么
- MCP tool 的输入为什么仍然要校验
- 为什么 tool handler 应复用 app 层，而不是复制业务逻辑
- 为什么 MCP 层要把应用错误转成 tool 返回内容

本章结束时，你的项目会新增：

```text
typed-toolbox-lab/
  src/
    mcp/
      server.ts
    mcp-server.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| MCP Server | 向 AI Agent 暴露工具、资源或提示的服务 |
| tool | Agent 可以调用的一个能力 |
| stdio transport | 通过标准输入输出和宿主进程通信 |
| input schema | 描述 tool 参数，并在运行时校验输入 |
| handler | tool 被调用时执行的函数 |

本章只做最小 MCP Server，不讲资源、提示、多 transport、鉴权或远程部署。先让本地 stdio tool 跑通。

## 概念解释

### MCP Server 和 CLI 的关系

CLI 和 MCP Server 都是应用外壳：

- CLI 面向终端用户
- MCP Server 面向 AI Agent 或 MCP Client

它们都不应该重写业务逻辑。它们应该调用同一个 app 层函数，例如：

```ts
loadWorkspace({ configPath, tasksPath })
```

这样 CLI 和 MCP 得到一致行为，也能复用第 11 章的测试。

### stdio transport

stdio transport 表示 MCP Client 启动你的 server 进程，然后通过 stdin/stdout 交换 JSON-RPC 消息。

这就是为什么 MCP Server 里不要随便 `console.log` 调试信息。stdout 是协议通道，乱写普通文本可能破坏通信。

错误日志如果必须输出，应写 stderr，例如 `console.error`。

### tool input 仍然是外部输入

MCP tool 的参数来自 Agent 或 MCP Client，仍然是不可信外部输入。

SDK 会根据 input schema 帮你校验输入形状，但你仍然应该在 handler 边界保持清晰类型，不要把任意输入直接当业务对象。

### tool 返回内容

MCP tool 通常返回 content 数组：

```ts
return {
  content: [
    { type: "text", text: "Project: typed-toolbox-lab" }
  ]
};
```

本章只返回 text content。

## 最小示例

先安装 MCP SDK：

```bash
pnpm add @modelcontextprotocol/sdk
```

### 文件 1：`src/mcp/server.ts`

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { formatWorkspaceError } from "../app/formatWorkspaceError.js";
import { loadWorkspace } from "../app/loadWorkspace.js";

export function createMcpServer() {
  const server = new McpServer({
    name: "typed-toolbox-lab",
    version: "1.0.0",
  });

  server.registerTool(
    "workspace_summary",
    {
      title: "Workspace Summary",
      description: "Load typed-toolbox-lab config and tasks, then return a short summary.",
      inputSchema: {
        configPath: z.string().min(1),
        tasksPath: z.string().min(1),
      },
    },
    async ({ configPath, tasksPath }) => {
      const result = await loadWorkspace({ configPath, tasksPath });

      if (!result.ok) {
        return {
          content: [{ type: "text", text: formatWorkspaceError(result.error) }],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Project: ${result.value.config.projectName}\nTasks: ${result.value.tasks.length}`,
          },
        ],
      };
    },
  );

  return server;
}
```

### 文件 2：`src/mcp-server.ts`

```ts
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp/server.js";

const server = createMcpServer();
const transport = new StdioServerTransport();

await server.connect(transport);
```

### package 脚本

```json
{
  "scripts": {
    "mcp": "node dist/mcp-server.js"
  }
}
```

构建：

```bash
pnpm build
```

构建成功后，你的 MCP Server 入口就是：

```bash
node dist/mcp-server.js
```

## 项目实践

按 README 的统一作业规则准备本章目录：`works/chapter13/typed-toolbox-lab`。

### Step 1：安装 MCP SDK

运行：

```bash
pnpm add @modelcontextprotocol/sdk
```

安装后确认 `package.json` 里出现真实版本，例如 `1.29.0` 或更新版本。

### Step 2：创建 `createMcpServer`

新增 `src/mcp/server.ts`。

这个文件只负责 MCP server 和 tool 注册。它应该调用已有 app 层函数：

```ts
loadWorkspace({ configPath, tasksPath })
```

不要在 MCP handler 里重新读取文件、重新解析 JSON 或重新写 Zod schema。

### Step 3：创建 stdio 入口

新增 `src/mcp-server.ts`，连接 `StdioServerTransport`。

这个入口文件不要 `console.log` 启动成功。stdio 是 MCP 协议通道，普通日志可能破坏协议。

### Step 4：添加脚本

在 `package.json` scripts 中加入：

```json
{
  "mcp": "node dist/mcp-server.js"
}
```

运行：

```bash
pnpm build
```

确认 `dist/mcp-server.js` 存在。

### Step 5：用 MCP Inspector 或 Client 验证

如果你本机有 MCP Inspector，可以用类似命令启动：

```bash
npx @modelcontextprotocol/inspector node dist/mcp-server.js
```

然后调用 tool：

```text
workspace_summary
```

参数：

```json
{
  "configPath": "data/config.json",
  "tasksPath": "data/tasks.json"
}
```

如果当前环境不方便启动 Inspector，至少要做到：

```bash
pnpm typecheck
pnpm build
```

并给 `createMcpServer` 写一个轻量测试，确认 server 能被创建，且相关 app 函数仍然通过测试。

## 练习题

### 练习 1：添加 `workspace_list_tasks` tool

新增第二个 tool：

```text
workspace_list_tasks
```

输入仍然是 `configPath` 和 `tasksPath`。

输出每个任务标题，每行一个。

要求：

- 复用 `loadWorkspace`
- 失败时返回 `isError: true`
- 不复制 CLI 的字符串拼接逻辑，必要时抽成 app 层 helper

### 练习 2：给 MCP server 创建测试

新增 `src/mcp/server.test.ts`，至少测试：

- `createMcpServer()` 可以正常返回 server 实例
- app 层用于生成 summary 的 helper 能输出预期文本

不要在测试中启动长期运行的 stdio server。

### 练习 3：写一段 MCP 配置说明

在项目 README 中补一小段本地 MCP 使用说明：

```json
{
  "command": "node",
  "args": ["dist/mcp-server.js"]
}
```

说明使用前需要先运行 `pnpm build`。

## 常见错误

### 错误 1：在 stdio server 里 `console.log`

stdio 是协议通道。普通日志可能让 MCP Client 读到非法协议内容。

### 错误 2：MCP handler 复制业务逻辑

MCP handler 应该复用 app/domain 层。否则 CLI 和 MCP 很快会产生不一致行为。

### 错误 3：tool 输入不校验

即使调用方是 Agent，输入仍然可能缺字段或类型错误。tool 必须有 input schema。

### 错误 4：把 MCP 当成第一章内容

MCP 是应用外壳。前面 12 章先建立 TypeScript、JSON、Zod、错误处理、测试和 CLI，正是为了让 MCP 层足够薄。

### 错误 5：没有验证构建产物

MCP Client 通常运行构建后的 JavaScript。只检查源码不够，至少要确认 `pnpm build` 成功。

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter13/typed-toolbox-lab`，然后在仓库根目录或该章节目录里对 Agent 说：

```text
考核第 13 章作业
```

Agent 应自行读取 `src/mcp/server.ts`、`src/mcp-server.ts`、`package.json`、相关测试文件，运行 `pnpm test`、`pnpm typecheck`、`pnpm build`，并尽量用 MCP Inspector 或等价 MCP client 调用 `workspace_summary`。

如果当前环境不能运行 Inspector，Agent 应说明原因，并至少验证 server 代码能编译、入口产物存在、核心 app 层测试通过。

## 本章通过标准

你完成本章后，应该满足：

- 项目安装了真实 `@modelcontextprotocol/sdk` 依赖
- `createMcpServer` 创建 `McpServer`
- 至少注册 `workspace_summary` tool
- tool input schema 校验 `configPath` 和 `tasksPath`
- tool handler 复用 `loadWorkspace`
- app 错误会转换成 MCP tool 的错误返回
- `src/mcp-server.ts` 使用 `StdioServerTransport`
- `pnpm test` 通过
- `pnpm typecheck` 通过
- `pnpm build` 通过

下一章会做最终整理：README、脚本、学习路线复盘和完整项目验收。
