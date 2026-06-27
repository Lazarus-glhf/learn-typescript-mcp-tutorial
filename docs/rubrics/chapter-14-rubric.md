# Chapter 14 Rubric：最终整理与复盘

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 6 分：README 清楚说明项目目标、安装、测试、构建和运行方式
- 5 分：README 包含 CLI 成功示例
- 5 分：README 包含 MCP 启动或配置说明
- 5 分：最终项目结构层次清楚，domain/app/node/cli/mcp 职责分明
- 5 分：完整验证命令全部通过
- 4 分：CLI 失败路径返回非 0 退出码并输出清晰错误
- 4 分：MCP tool 可通过 Inspector、SDK client 或等价方式验证
- 3 分：最终复盘说明后续扩展方向
- 3 分：没有明显实验残留、无关临时文件或大段注释代码

扣分点：

- README 缺少运行命令：扣 8 分
- 没有验证失败路径：扣 6 分
- 项目结构混乱，MCP/CLI/domain 互相污染：扣 8 分
- 构建或测试无法通过：正确性最高 20 分

### 2. 类型使用：20 分

- 5 分：domain 类型和 Zod schema 仍然一致
- 4 分：app 层错误类型仍然清楚
- 4 分：CLI 和 MCP 没有使用 `any` 绕过核心类型
- 3 分：测试仍能保护 parser、错误格式化、workspace 加载和 CLI/MCP 外壳
- 2 分：能解释各层职责
- 2 分：能说明后续扩展应先改 domain/app 层还是外壳层

### 3. 项目结构：15 分

- 3 分：domain 层只包含类型、schema 和纯规则
- 3 分：app 层组织业务流程
- 3 分：node 层处理文件系统边界
- 3 分：cli 层处理参数、stdout、stderr、退出码
- 3 分：mcp 层只注册 tool 并复用 app 层

### 4. 可运行性：15 分

- 4 分：`pnpm test` 成功通过
- 4 分：`pnpm typecheck` 成功通过
- 4 分：`pnpm build` 成功通过
- 3 分：真实 CLI 和 MCP 验证至少各通过一个成功路径

### 5. 代码与文档清晰度：10 分

- 3 分：README 语言简洁、面向学习者
- 2 分：命令示例可以直接复制运行
- 2 分：复盘能说明真实学习收获和风险点
- 2 分：最终项目没有无关输出或实验残留
- 1 分：章节索引和 rubric 索引完整

## 快速判断题评分

### 题 1

domain/app/node/cli/mcp 是逐层包装关系，不应该让外壳层污染核心逻辑。

### 题 2

最终验证要包含测试、类型检查、构建、CLI 成功/失败路径和 MCP 调用。

### 题 3

README 是项目入口，必须让新读者知道如何运行和验证项目。

### 题 4

后续扩展时，应先明确核心逻辑属于 domain/app，确认测试，再包装成 CLI 或 MCP tool。

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
pnpm test
pnpm typecheck
pnpm build
node dist/index.js summary --config data/config.json --tasks data/tasks.json
node dist/index.js summary --config data/config.json
```

如果环境支持 MCP client，还应调用 `workspace_summary`。如果不支持，应至少确认 `dist/mcp-server.js` 存在，并说明未调用 MCP 的原因。

Agent 还要检查：

- README 是否包含安装、测试、构建、CLI、MCP 和教程索引
- 章节索引是否包含第 0-14 章
- rubric 索引是否包含第 0-14 章
- 项目结构是否符合分层原则
- 是否没有明显临时文件或实验残留

## 通过标准

- 85 分以上：最终项目通过
- 70-84 分：整体可用，但建议整理后再发布
- 0-69 分：建议修复关键问题后重新验收

## 推荐反馈重点

如果学习者出错，优先解释：

1. 最终项目的交付质量来自清晰结构和可重复验证
2. README 是别人能否使用项目的第一道门
3. CLI/MCP 都应该是薄外壳
4. 失败路径是正式工具体验的一部分
5. 测试和类型检查是后续扩展的护栏
