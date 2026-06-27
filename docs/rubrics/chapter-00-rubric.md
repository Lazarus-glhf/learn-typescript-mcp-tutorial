# Chapter 00 Rubric：准备环境与第一次运行 TypeScript

满分 100 分。

## 评分明细

### 1. 正确性：40 分

- 10 分：Agent 能在项目环境中确认 `node --version`、`npm --version`、`pnpm --version` 可运行，证明依赖环境可用
- 8 分：项目目录名和基础结构正确，至少包含 `package.json`、`tsconfig.json`、`src/index.ts`
- 8 分：`src/index.ts` 能正确输出项目名和学习者信息
- 7 分：完成学习目标输出练习
- 7 分：完成“制造并修复类型错误”练习，并能说明或保留足够线索证明理解了类型错误

### 2. 类型使用：20 分

- 8 分：`projectName` 使用 `string` 类型或能被清晰推导为字符串
- 8 分：`learnerName` 使用 `string` 类型或能被清晰推导为字符串
- 4 分：加分变量如果出现，`number` 和 `boolean` 使用正确

扣分点：

- 使用 `any`：每处扣 5 分
- 为了绕过错误使用类型断言，例如 `123 as unknown as string`：扣 10 分
- 没有理解类型错误，只是删除相关代码：扣 5-10 分

### 3. 项目结构：15 分

- 5 分：源码放在 `src/index.ts`
- 5 分：`package.json` scripts 清晰，包含 `dev`、`typecheck`、`build`、`start`；如果存在 `packageManager` 或 `devEngines.packageManager.version`，必须使用精确 pnpm 版本，不能带 `^`；`devDependencies` 里的 `typescript`、`tsx`、`@types/node` 必须是真实 npm 版本，不能是占位文字或不存在的版本
- 5 分：`tsconfig.json` 包含严格模式和合理的 `rootDir` / `outDir`

### 4. 可运行性：15 分

- 5 分：`pnpm dev` 成功运行
- 5 分：`pnpm typecheck` 成功通过
- 3 分：`pnpm build` 成功生成 `dist/`
- 2 分：`pnpm start` 成功运行编译后的 JS

如果 Agent 无法运行命令且项目中也没有其他可信证据，可运行性最高只能给 5 分。

### 5. 代码清晰度：10 分

- 5 分：变量命名清晰
- 3 分：输出文本清楚可读
- 2 分：文件内容没有无关实验残留

## 通过标准

- 75 分以上：通过，可以进入第 1 章
- 60-74 分：需要修改后重新提交
- 0-59 分：建议重做本章

## Agent 需要重点检查

Agent 必须自行运行或等价确认：

```bash
node --version
npm --version
pnpm --version
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

Agent 还要检查 `package.json` 里的 `packageManager` 或 `devEngines.packageManager.version`。如果存在，必须类似 `"pnpm@11.9.0"` 或 `"version": "11.9.0"`，不能是 `"pnpm@^11.9.0"` 或 `"version": "^11.9.0"`。

Agent 还要检查 `devDependencies` 里的 `typescript`、`tsx`、`@types/node`。这些值必须是真实 npm 版本，例如 `"tsx": "^4.22.4"`，不能是 `"tsx": "0.01"`、`"@types/node": "你安装后实际生成的版本"` 或其他教程占位文字。

如果遇到 `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@...`，Agent 要检查是否需要运行 `pnpm approve-builds` 或 `pnpm approve-builds --all`，或至少确认后续 `pnpm dev` / `pnpm typecheck` 已经能正常运行。

Agent 还要确认学习者完成过制造类型错误并修复的步骤。这个步骤用于证明学习者知道 `tsc` 的用途；如果项目最终状态无法直接证明，应在反馈中要求学习者口头说明当时看到的报错含义。

## 推荐反馈重点

如果学习者出错，优先解释：

1. `node` / `npm` / `pnpm` 是否已经安装并能输出版本号
2. `package.json` 的 `packageManager` 或 `devEngines.packageManager.version` 是否误写成带 `^` 的版本，应改成精确版本或删除该字段
3. `package.json` 的 `devDependencies` 是否把 `typescript`、`tsx`、`@types/node` 写成了占位文字或不存在的版本，应改成真实版本或重新运行 `pnpm add -D ...`
4. `ERR_PNPM_IGNORED_BUILDS` 是否需要通过 `pnpm approve-builds` 或 `pnpm approve-builds --all` 批准 `esbuild`
5. Windows PowerShell 是否需要重新打开以刷新 PATH
6. 当前终端是否在项目目录中
7. `package.json` scripts 是否写错
8. `tsconfig.json` 的 `module` / `moduleResolution` 是否匹配
9. `src/index.ts` 是否存在
10. 类型错误到底在说什么
