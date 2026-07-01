# Advanced A05：MCP Tool 设计进阶

## 本章目标

本章不只是“让 MCP tool 能被调用”，而是学习如何设计 agent 真正用得好的 tool：稳定 schema、结构化错误、分页、可恢复失败和下一步提示。

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| tool granularity | 决定 agent 是否容易正确调用 |
| structured content | 让 agent 不靠解析自然语言继续工作 |
| error code | 让失败可恢复、可分支处理 |
| pagination | 避免一次返回过多内容 |
| tool description | 引导 agent 选择正确工具 |

## 概念解释

坏 tool：

```text
run_unreal_command(command: string)
```

好 tool：

```text
get_project_summary(cwd)
list_modules(cwd)
validate_gameplay_tags(cwd)
get_recent_build_errors(cwd, limit)
```

agent 更擅长调用边界清晰、参数少、返回稳定的工具。

## 项目实践

新增 MCP tools：

```text
get_project_summary
list_modules
validate_workspace
get_editor_status
```

每个 tool 都要：

- 复用 app 层函数。
- 用 Zod schema 校验输入。
- 返回 text summary 和结构化 JSON 数据。
- 错误返回包含 `errorCode`、`message`、`recoverable`。

## 练习题

必做：用 MCP SDK client 写一个集成测试，启动 server 并调用 `get_project_summary`。

加分：为 `list_modules` 增加 `limit` 和 `cursor`。

思考：哪些能力应该做成 MCP tool，哪些只应该留在 CLI？

## 常见错误

- tool description 太短，agent 不知道何时调用。
- 一次返回整个项目文件树，超过上下文或污染结果。
- MCP handler 里直接读文件和跑命令，绕过 app 层测试。

## AI Agent 考核指令

请检查 `works/advanced/chapter-a05/unreal-agent-toolchain`：运行 MCP 集成测试，确认成功和错误路径都能被 MCP client 调用，并审查 tool 描述是否足够明确。
