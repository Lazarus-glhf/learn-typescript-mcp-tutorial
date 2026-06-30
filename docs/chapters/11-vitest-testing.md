# Chapter 11：Vitest 测试

## 本章目标

前面几章里，你已经有了可以读取 JSON、用 Zod 校验、并把错误整理成 `Result<T, E>` 的 typed core。现在需要把这些行为固定下来，避免后续改 CLI 或 MCP 时不小心破坏核心逻辑。

本章会引入 Vitest，给纯函数和边界流程写自动化测试：

- 用 `describe` / `it` / `expect` 组织测试
- 测试 Zod parser 的成功和失败路径
- 测试 `formatWorkspaceError` 的错误格式化
- 用临时 fixture 文件测试 `loadWorkspace`
- 在 `package.json` 中加入 `test` 脚本

完成本章后，你应该能够回答：

- 为什么测试应该优先覆盖稳定核心逻辑
- `describe`、`it`、`expect` 分别做什么
- 为什么纯函数比入口文件更容易测试
- 为什么测试失败信息比人工点运行更可靠
- 第 12 章进入 CLI 前，哪些行为应该先被测试锁住

本章结束时，你的项目会新增：

```text
typed-toolbox-lab/
  src/
    domain/
      task.test.ts
    app/
      formatWorkspaceError.test.ts
      loadWorkspace.test.ts
```

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| Vitest | TypeScript/JavaScript 测试框架 |
| `describe` | 给一组相关测试命名 |
| `it` | 定义一个具体测试用例 |
| `expect` | 断言实际结果符合预期 |
| fixture | 测试用的固定输入数据 |
| regression test | 防止已经修好的行为再次坏掉 |

本章仍然不引入 CLI 参数或 MCP。你只给已有核心逻辑补测试。

## 概念解释

### 测试不是为了证明代码完美

测试的价值是把重要行为固定下来。比如：

- 合法任务数据应该通过 Zod parser
- 坏任务数据应该被拒绝
- `file-read` 错误应该格式化成可读信息
- `loadWorkspace` 应该能读取两个 JSON 文件并返回成功结果

这些行为一旦写成测试，后面重构 CLI 或 MCP 时，测试会立刻提醒你有没有破坏核心逻辑。

### 测试纯函数优先

纯函数最容易测试：输入固定，输出也固定。

```ts
formatWorkspaceError({ kind: "invalid-json", message: "bad" });
```

这种函数不读文件、不依赖时间、不访问网络，所以测试稳定。

入口文件 `src/index.ts` 反而不适合一开始就测，因为它负责输出和退出码。第 12 章做 CLI 时再处理命令层测试会更合理。

### Vitest 的基本结构

```ts
import { describe, expect, it } from "vitest";

describe("formatWorkspaceError", () => {
  it("formats invalid-json errors", () => {
    expect(formatWorkspaceError({ kind: "invalid-json", message: "bad" })).toBe(
      "Invalid JSON syntax: bad",
    );
  });
});
```

`describe` 是分组，`it` 是具体案例，`expect` 是断言。

### 异步测试

测试异步函数时，让 `it` 的回调变成 `async`：

```ts
it("loads workspace", async () => {
  const result = await loadWorkspace(paths);
  expect(result.ok).toBe(true);
});
```

不要忘记 `await`，否则测试可能在 Promise 完成前就结束。

## 最小示例

先安装 Vitest：

```bash
pnpm add -D vitest
```

在 `package.json` 加脚本：

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

### 文件 1：`src/app/formatWorkspaceError.test.ts`

```ts
import { describe, expect, it } from "vitest";
import { formatWorkspaceError } from "./formatWorkspaceError.js";

describe("formatWorkspaceError", () => {
  it("formats invalid-json errors", () => {
    expect(formatWorkspaceError({ kind: "invalid-json", message: "bad syntax" })).toBe(
      "Invalid JSON syntax: bad syntax",
    );
  });

  it("formats invalid-data errors", () => {
    expect(formatWorkspaceError({ kind: "invalid-data", message: "bad data" })).toBe(
      "Invalid workspace data: bad data",
    );
  });
});
```

运行：

```bash
pnpm test
```

测试应该通过。

## 项目实践

本章使用独立作业目录。在教程仓库根目录运行下面命令，先从上一章作业复制一份到本章：

```bash
mkdir -p works/chapter11
cp -R works/chapter10/typed-toolbox-lab works/chapter11/typed-toolbox-lab
cd works/chapter11/typed-toolbox-lab
```

Windows PowerShell 可以运行：

```powershell
New-Item -ItemType Directory -Force works/chapter11
Copy-Item -Recurse works/chapter10/typed-toolbox-lab works/chapter11/typed-toolbox-lab
Set-Location works/chapter11/typed-toolbox-lab
```

### Step 1：安装 Vitest

运行：

```bash
pnpm add -D vitest
```

然后确认 `package.json` 使用真实版本，不要手写占位符。

### Step 2：添加测试脚本

把 scripts 改成包含：

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

保留已有的 `dev`、`typecheck`、`build`、`start`。

再新增 `vitest.config.ts`，避免 `pnpm build` 后 Vitest 扫描 `dist/` 里的已编译测试文件，造成同一批测试运行两次：

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
});
```

### Step 3：测试任务 parser

新增 `src/domain/task.test.ts`，测试：

- 合法任务数组能通过 `parseLearningTasks`
- 非数组输入会抛错
- 字段类型错误会抛错

### Step 4：测试错误格式化

新增 `src/app/formatWorkspaceError.test.ts`，覆盖三个错误 kind：

- `file-read`
- `invalid-json`
- `invalid-data`

### Step 5：测试 `loadWorkspace`

新增 `src/app/loadWorkspace.test.ts`。

用 `node:fs/promises` 创建临时 fixture 目录，写入合法 `config.json` 和 `tasks.json`，然后调用 `loadWorkspace`。

测试至少覆盖：

- 合法文件返回 `ok: true`
- 坏 JSON 返回 `invalid-json`
- 坏数据返回 `invalid-data`

## 练习题

### 练习 1：测试配置 parser

新增 `src/domain/config.test.ts`，测试合法配置和非法 `defaultStatus`。

### 练习 2：测试 `never` 穷尽检查不需要运行时案例

解释为什么 `formatWorkspaceError` 的 `never` 检查主要由 TypeScript 编译器验证，而不是靠运行时测试验证。

### 练习 3：给多任务文件加载写测试

如果第 10 章练习实现了多个任务文件加载，为成功合并和单个文件失败各写一个测试。

## 常见错误

### 错误 1：测试没有断言

只调用函数但不 `expect`，测试价值很低。

### 错误 2：异步测试忘记 `await`

异步函数测试要么 `await`，要么返回 Promise。不要让测试提前结束。

### 错误 3：测试入口文件而不是核心逻辑

本章优先测 domain 和 app 层。入口文件输出和退出码留到 CLI 章节再处理。

### 错误 4：测试依赖真实项目数据

测试应尽量用 fixture，而不是直接依赖当前 `data/tasks.json`。真实数据会变，fixture 更稳定。

## AI Agent 考核指令

完成本章后，确认作业位于 `works/chapter11/typed-toolbox-lab`，然后在仓库根目录或该章节目录里对 Agent 说：

```text
考核第 11 章作业
```

Agent 应自行读取测试文件、运行 `pnpm test`、`pnpm typecheck`、`pnpm build`，并根据本章 rubric 打分。

## 本章通过标准

你完成本章后，应该满足：

- 项目安装了真实 `vitest` 依赖
- `package.json` 有 `test` 脚本
- `vitest.config.ts` 排除 `dist/`，避免构建后重复运行编译产物里的测试
- `parseLearningTasks` 有成功和失败测试
- `formatWorkspaceError` 三种错误都有测试
- `loadWorkspace` 有成功、坏 JSON、坏数据测试
- `pnpm test` 通过
- `pnpm typecheck` 通过
- `pnpm build` 通过

下一章会进入 CLI 设计，把已经测试过的核心逻辑包装成命令行工具。
