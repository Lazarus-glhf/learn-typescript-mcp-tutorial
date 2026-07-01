# Advanced A04：配置系统与工作区发现

## 本章目标

真实 CLI/MCP 不能假设用户总在项目根目录运行命令。本章实现工作区发现和配置加载：从 `--cwd` 出发找到 `.uproject`、读取 `unreal-agent.config.json`，并处理 Windows 路径。

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| workspace discovery | 从任意目录定位项目根 |
| config precedence | CLI 参数、环境变量、配置文件的优先级 |
| fixture project | 用假 Unreal 项目做可重复测试 |
| path normalization | 输出稳定路径，减少跨平台差异 |

## 概念解释

配置系统应该明确优先级，例如：

```text
CLI 参数 > 环境变量 > 项目配置文件 > 默认值
```

不要让 app 层到处读取不同来源。应该先汇总成一个 typed config，再传给业务函数。

## 项目实践

新增：

```text
fixtures/basic-unreal-project/BasicGame.uproject
src/adapters/filesystem/findWorkspaceRoot.ts
src/app/loadToolchainConfig.ts
```

实现：

- 从 `--cwd` 向上寻找 `.uproject`。
- 读取可选 `unreal-agent.config.json`。
- 支持 `UNREAL_AGENT_CONFIG` 覆盖配置路径。
- 用 Zod 校验配置。
- `doctor --json` 输出 workspace root、uproject path、config。

## 练习题

必做：支持从子目录发现项目根。

加分：支持 `UNREAL_AGENT_CONFIG` 环境变量覆盖配置路径。

思考：为什么配置文件 schema 需要 version 字段？

## 常见错误

- 找不到项目根时直接抛异常，而不是返回结构化错误。
- 测试依赖真实本机 Unreal 项目，导致别人无法复现。
- 输出绝对路径导致 snapshot 在不同机器上不稳定。

## AI Agent 考核指令

请检查 `works/advanced/chapter-a04/unreal-agent-toolchain`：确认 fixture 存在，运行测试，验证从项目根和子目录都能发现 `.uproject`，并检查配置优先级。
