# Chapter 13 Rubric：MCP Server 入门

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 5 分：通过包管理器安装真实 `@modelcontextprotocol/sdk` 依赖
- 6 分：实现 `createMcpServer()` 并创建 `McpServer`
- 6 分：注册 `workspace_summary` tool
- 5 分：tool input schema 校验 `configPath` 和 `tasksPath`
- 6 分：tool handler 复用 `loadWorkspace`，不复制读取和校验逻辑
- 5 分：app 错误转换成 MCP tool 错误返回，包含 `isError: true` 或等价标记
- 4 分：实现 `src/mcp-server.ts` 并使用 `StdioServerTransport`
- 3 分：练习中添加 `workspace_list_tasks` 或等价第二个 tool

扣分点：

- MCP handler 直接重写业务逻辑：扣 8 分
- stdio server 向 stdout 打普通日志：扣 6 分
- 没有 input schema：扣 8 分
- 代码无法构建：正确性最高 15 分

### 2. 类型使用：20 分

- 5 分：tool 输入类型由 schema 支持，handler 参数类型清晰
- 4 分：MCP 返回内容结构符合 SDK 要求
- 4 分：错误分支和成功分支返回结构清晰
- 3 分：没有用 `any` 绕过 SDK 或 Zod 类型
- 2 分：能解释 MCP tool 参数仍然是外部输入
- 2 分：能解释 CLI 和 MCP 共享 app 层的原因

### 3. 项目结构：15 分

- 5 分：MCP server 创建逻辑放在 `src/mcp/server.ts`
- 4 分：stdio 入口放在 `src/mcp-server.ts`
- 4 分：app/domain/node 层没有反向依赖 MCP 层
- 2 分：package scripts 包含 `mcp` 或等价入口

### 4. 可运行性：15 分

- 4 分：`pnpm test` 成功通过
- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功通过
- 3 分：能用 MCP Inspector 或等价 client 调用 `workspace_summary`；如环境不支持，应至少验证入口产物存在并说明限制

### 5. 代码清晰度：10 分

- 3 分：tool 名称和描述清晰
- 3 分：返回文本稳定可读
- 2 分：没有无关日志或实验代码
- 2 分：README 或文档中说明本地 MCP 启动方式

## 快速判断题评分

### 题 1

CLI 面向终端用户，MCP Server 面向 AI Agent 或 MCP Client；两者都应复用 app/domain 层。

### 题 2

stdio transport 使用标准输入输出交换协议消息，所以 server 不能向 stdout 打普通日志。

### 题 3

MCP tool 输入仍然是外部输入，需要 schema 校验。

### 题 4

MCP handler 不应该复制业务逻辑，否则 CLI 和 MCP 行为会分裂。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm test
pnpm typecheck
pnpm build
```

Agent 还要检查：

- `package.json` 是否包含真实 `@modelcontextprotocol/sdk` 版本
- `src/mcp/server.ts` 是否注册 `workspace_summary`
- tool 是否有 input schema
- tool handler 是否复用 `loadWorkspace`
- `src/mcp-server.ts` 是否使用 `StdioServerTransport`
- stdout 是否没有普通启动日志
- 是否没有把 CLI 参数解析逻辑复制到 MCP handler

## 通过标准

- 75 分以上：通过，可以进入第 14 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## 推荐反馈重点

如果学习者出错，优先解释：

1. MCP 是外壳，不是重写核心逻辑的地方
2. stdio stdout 是协议通道
3. tool 输入和 JSON 文件一样属于外部输入
4. thin wrapper 能让 CLI 和 MCP 共用测试过的 app 层
5. 最终章会整理 README、脚本和完整验收流程
