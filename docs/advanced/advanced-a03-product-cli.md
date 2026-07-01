# Advanced A03：产品级 CLI 设计

## 本章目标

本章把上一章的能力包装成真正的 CLI：子命令、选项、JSON 输出、错误格式、`doctor` 命令和未来 `mcp serve` 命令入口。

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| commander/cac/yargs | CLI 命令框架 |
| subcommand | 把能力拆成可发现的命令 |
| `--json` | 给脚本和 agent 稳定读取 |
| `--cwd` | 明确工作区根目录 |
| `doctor` | 诊断环境，减少用户卡点 |

## 概念解释

好 CLI 的目标不是“能调用函数”，而是让用户和 agent 都知道下一步能做什么。`doctor` 是 agent 工具链里非常值得做的命令，因为它能提前发现 Node、git、Unreal 路径、配置文件、bridge 连接状态等问题。

## 最小示例

```bash
unreal-agent doctor --cwd ./MyGame
unreal-agent doctor --cwd ./MyGame --json
unreal-agent mcp serve
```

## 项目实践

新增：

```text
src/cli/createCli.ts
src/cli/formatCliError.ts
src/cli/commands/doctor.ts
```

要求：

- `doctor` 默认输出人类可读文本。
- `doctor --json` 输出稳定 JSON。
- 失败时 stderr 给人类错误，exit code 非 0。
- `--cwd` 会传入 app 层，而不是 app 层自己读取 process。
- `modules`、`validate` 等后续命令也应复用同一套 app 层结果和错误格式。

## 练习题

必做：实现 `doctor` 子命令。

加分：增加 `--verbose`，把诊断细节写 stderr。

思考：CLI 输出里哪些内容适合 stdout，哪些适合 stderr？

## 常见错误

- CLI handler 里塞满业务逻辑，导致 MCP 不能复用。
- JSON 输出混入颜色、emoji 或 debug 文本。
- 所有失败都返回同一个错误消息。

## AI Agent 考核指令

请检查 `works/advanced/chapter-a03/unreal-agent-toolchain`：运行 `doctor` 的文本和 JSON 模式，检查 exit code、stdout/stderr 分离，并确认 CLI 层没有复制 app 层业务逻辑。
