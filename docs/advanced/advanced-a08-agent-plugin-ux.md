# Advanced A08：Agent 插件体验

## 本章目标

最后一章把工具链包装成 agent 真正会用的体验：README、MCP 配置示例、Claude Code/Codex/OpenCode 使用说明、tool description 复审、权限边界和示例任务。

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| agent-facing docs | 让 AI 工具知道何时使用你的能力 |
| install recipe | 降低用户接入 MCP/CLI 的成本 |
| permission model | 明确读、写、执行边界 |
| examples | 用真实任务校准 tool 设计 |

## 概念解释

给人的 README 不等于给 agent 的说明。agent 需要清楚知道：

- 这个 server 有哪些 tools。
- 每个 tool 什么时候用。
- 哪些操作只读，哪些会修改文件或执行命令。
- 出错后下一步应该调用什么。

## 项目实践

新增或整理：

```text
README.md
AGENTS.md
examples/claude-code-mcp.json
examples/codex-mcp.md
examples/opencode-mcp.md
```

要求：

- README 说明安装、CLI 使用、MCP 使用。
- AGENTS.md 说明 agent 使用原则和安全边界。
- `examples/claude-code-mcp.json`、`examples/codex-mcp.md`、`examples/opencode-mcp.md` 给出接入示例。
- 每个 MCP tool 有明确 description。
- 提供 3 个真实任务示例：项目摘要、GAS 标签检查、编辑器状态查询。

## 练习题

必做：写一个从安装到调用 `get_project_summary` 的完整示例。

加分：写一个“agent 不应该做什么”的安全章节。

思考：一个 tool 返回什么信息，才能让 agent 下一步少猜？

## 常见错误

- README 只面向人类，没有 MCP client 配置示例。
- tool 描述含糊，导致 agent 错选工具。
- 没有说明危险操作边界。

## AI Agent 考核指令

请检查 `works/advanced/chapter-a08/unreal-agent-toolchain`：运行最终验证命令，审查 README/AGENTS/examples，模拟一个 agent 任务并判断工具说明是否足够可用。
