# Chapter 00：准备环境与第一次运行 TypeScript

## 本章目标

你将从零创建一个 TypeScript 项目，并成功运行第一个 `.ts` 文件。

完成本章后，你应该能够回答：

- Node.js 是什么
- `pnpm` 是什么
- `package.json` 是什么
- `tsconfig.json` 是什么
- `tsx` 和 `tsc` 分别用来做什么
- 如何运行一个 TypeScript 文件
- 如何检查 TypeScript 类型错误

本章结束时，你会得到一个最小可运行项目：

```text
typed-toolbox-lab/
  package.json
  tsconfig.json
  src/
    index.ts
```

## 本章会学到什么

这一章不讲复杂语法，只建立项目环境。

你会接触这些概念：

| 概念 | 作用 |
|---|---|
| Node.js | 运行 JavaScript / TypeScript 编译后代码的运行时 |
| pnpm | 包管理器，用来安装依赖和运行脚本 |
| TypeScript | 给 JavaScript 加静态类型检查的语言 |
| tsx | 开发期直接运行 `.ts` 文件的工具 |
| tsc | TypeScript 官方编译器和类型检查器 |
| package.json | 项目配置、依赖、脚本入口 |
| tsconfig.json | TypeScript 编译和类型检查配置 |

## 环境准备：先安装 Node.js 和 pnpm

在运行 `pnpm init` 之前，必须先确认本机已经有 Node.js 和 pnpm。

本教程默认你使用 PowerShell、Windows Terminal、macOS Terminal 或 Linux shell。下面命令在 PowerShell 中也可以直接运行。

### Step 0.1：检查 Node.js

先运行：

```powershell
node --version
npm --version
```

如果能看到版本号，例如：

```text
v22.16.0
10.9.2
```

说明 Node.js 已经安装。

如果提示 `node` 不是可识别命令，先安装 Node.js LTS。

Windows 推荐二选一：

```powershell
winget install OpenJS.NodeJS.LTS
```

或者到官网下载安装包：

```text
https://nodejs.org/
```

安装完成后，重新打开 PowerShell，再运行：

```powershell
node --version
npm --version
```

### Step 0.2：启用 pnpm

Node.js 通常自带 Corepack。Corepack 可以帮你启用 pnpm。

先检查：

```powershell
corepack --version
```

如果能看到版本号，运行：

```powershell
corepack enable
corepack prepare pnpm@latest --activate
```

然后验证：

```powershell
pnpm --version
```

如果能看到 pnpm 版本号，就可以继续本章后面的 `pnpm init`。

如果你在 Linux / WSL 上看到类似下面的权限错误：

```text
EACCES: permission denied, symlink ... -> '/usr/bin/pnpm'
```

说明 `corepack enable` 正在尝试创建全局 `pnpm` 命令，但当前用户没有写入 `/usr/bin` 的权限。可以先运行：

```bash
corepack prepare pnpm@latest --activate
corepack pnpm --version
```

如果这样能看到版本号，后续命令可以把 `pnpm` 临时写成 `corepack pnpm`，例如：

```bash
corepack pnpm init
corepack pnpm add -D typescript tsx @types/node
```

Windows PowerShell 通常不需要这样写。

### Step 0.3：如果 Corepack 不可用

如果 `corepack` 也不是可识别命令，可以用 npm 安装 pnpm：

```powershell
npm install -g pnpm
```

然后重新打开 PowerShell，验证：

```powershell
pnpm --version
```

### Step 0.4：常见 Windows PATH 问题

如果安装后仍然提示 `pnpm` 不是可识别命令，通常是当前 PowerShell 没有刷新 PATH。

按顺序尝试：

1. 关闭当前 PowerShell，重新打开。
2. 运行 `node --version`，确认 Node.js 可用。
3. 运行 `corepack enable` 和 `corepack prepare pnpm@latest --activate`。
4. 再运行 `pnpm --version`。

只有 `pnpm --version` 能正常输出版本号后，才继续创建项目。

## 概念解释

### TypeScript 和 JavaScript 的关系

TypeScript 不是一个完全独立的运行时语言。通常情况下：

```text
TypeScript 源码 -> TypeScript 编译器检查/转换 -> JavaScript -> Node.js 运行
```

你写的是 `.ts` 文件，但 Node.js 最终理解的是 JavaScript。

`tsx` 这个工具可以让你在开发时直接运行 `.ts` 文件，省掉手动编译步骤。

### `tsx` 和 `tsc` 的区别

先记住这个简单区别：

```text
tsx：运行 TypeScript 文件
tsc：检查类型，或者把 TypeScript 编译成 JavaScript
```

本教程早期会这样用：

```bash
pnpm dev
```

用于运行项目。

```bash
pnpm typecheck
```

用于检查类型错误。

### 为什么用 `pnpm`

`pnpm` 是 Node 生态里的包管理器，作用类似 C++ 项目里的依赖管理工具。它负责：

- 安装 TypeScript、tsx 等开发工具
- 管理 `node_modules`
- 运行 `package.json` 里的脚本

## 实践：创建项目

从这里开始，默认你已经确认以下命令都能正常输出版本号：

```powershell
node --version
npm --version
pnpm --version
```

如果 `pnpm --version` 仍然报错，先回到“环境准备：先安装 Node.js 和 pnpm”修好环境，不要继续执行 `pnpm init`。

### Step 1：创建目录

在你准备放学习项目的位置运行：

```bash
mkdir typed-toolbox-lab
cd typed-toolbox-lab
```

### Step 2：初始化 package.json

运行：

```bash
pnpm init
```

它会创建一个 `package.json` 文件。

### Step 3：检查 packageManager / devEngines 字段

`pnpm init` 可能会在 `package.json` 里生成 `packageManager` 字段，也可能生成 `devEngines.packageManager` 对象。

先打开 `package.json`，如果看到类似下面这种写法：

```json
"packageManager": "pnpm@^11.9.0"
```

需要改成精确版本，去掉 `^`：

```json
"packageManager": "pnpm@11.9.0"
```

如果你看到的是这种结构：

```json
"devEngines": {
  "packageManager": {
    "name": "pnpm",
    "version": "^11.9.0",
    "onFail": "download"
  }
}
```

同样要把 `version` 改成精确版本：

```json
"devEngines": {
  "packageManager": {
    "name": "pnpm",
    "version": "11.9.0",
    "onFail": "download"
  }
}
```

原因是 Corepack 要求 package manager 版本使用精确版本号，不能使用 `^11.9.0` 这种 semver range。否则后续运行 `pnpm add` 时可能报错：

```text
Invalid package manager specification in package.json (pnpm@^11.9.0); expected a semver version
```

如果你不确定该写哪个版本，可以运行：

```powershell
pnpm --version
```

假设输出是：

```text
11.9.0
```

那么 `packageManager` 就写：

```json
"packageManager": "pnpm@11.9.0"
```

如果是 `devEngines.packageManager.version`，就写：

```json
"version": "11.9.0"
```

如果你暂时不想处理这些字段，也可以删除整行 `packageManager`，或者删除整个 `devEngines` 对象，本章后续步骤仍然可以继续。

### Step 4：安装开发依赖

运行：

```bash
pnpm add -D typescript tsx @types/node
```

如果看到类似下面的下载慢警告：

```text
[WARN] Tarball download average speed ... is below 50 KiB/s
```

这只是网络下载速度警告。只要最后显示依赖已经加入，就可以继续。

如果看到：

```text
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@...
```

说明 pnpm 出于安全考虑拦截了依赖的安装后脚本。`tsx` 会间接依赖 `esbuild`，本教程可以批准它。

运行：

```powershell
pnpm approve-builds
```

然后在交互列表里选中 `esbuild`，确认批准。批准后再运行：

```powershell
pnpm install
```

如果 `pnpm approve-builds` 显示没有待批准项目，说明已经处理过，可以继续后面的步骤。

如果你想一次性批准所有待批准的 build script，也可以运行：

```powershell
pnpm approve-builds --all
pnpm install
```

这些依赖分别是：

| 依赖 | 作用 |
|---|---|
| `typescript` | TypeScript 编译器，提供 `tsc` |
| `tsx` | 直接运行 `.ts` 文件 |
| `@types/node` | Node.js API 的类型定义 |

### Step 5：创建 tsconfig.json

运行：

```bash
pnpm tsc --init
```

然后把生成的 `tsconfig.json` 改成下面这个版本：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

先不用完全理解每一项。现在只需要知道：

- `strict: true` 表示开启严格类型检查
- `rootDir: "src"` 表示源码放在 `src/`
- `outDir: "dist"` 表示编译输出放在 `dist/`
- `include` 表示只检查 `src` 目录里的 `.ts` 文件

### Step 6：修改 package.json 脚本

把 `package.json` 改成类似这样：

```json
{
  "name": "typed-toolbox-lab",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "tsx src/index.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "devDependencies": {
    "@types/node": "你安装后实际生成的版本",
    "tsx": "你安装后实际生成的版本",
    "typescript": "你安装后实际生成的版本"
  }
}
```

注意：不要手写 `devDependencies` 的版本号。安装依赖后，`pnpm` 会自动写入真实版本。

你需要手动确认的是：

```json
"type": "module"
```

以及：

```json
"scripts": {
  "dev": "tsx src/index.ts",
  "typecheck": "tsc --noEmit",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### Step 7：创建入口文件

创建目录：

```bash
mkdir src
```

创建文件：

```text
src/index.ts
```

写入：

```ts
const projectName: string = "typed-toolbox-lab";
const learnerName: string = "Lazarus";

console.log(`${projectName} started`);
console.log(`Learner: ${learnerName}`);
```

这是你运行的第一个 TypeScript 文件。

## 运行项目

运行：

```bash
pnpm dev
```

期望看到类似输出：

```text
typed-toolbox-lab started
Learner: Lazarus
```

然后运行类型检查：

```bash
pnpm typecheck
```

如果没有类型错误，它通常不会输出太多内容，只会正常结束。

再试一次编译：

```bash
pnpm build
```

编译成功后，应该出现：

```text
dist/index.js
```

最后运行编译后的 JavaScript：

```bash
pnpm start
```

期望输出仍然是：

```text
typed-toolbox-lab started
Learner: Lazarus
```

## 必做练习

### 练习 1：修改学习者信息

把 `learnerName` 改成你自己的名字或昵称。

要求：

- 类型必须是 `string`
- `pnpm dev` 能正确输出

### 练习 2：添加学习目标

在 `src/index.ts` 中添加一个变量：

```ts
const learningGoal: string = "Build a solid TypeScript foundation";
```

然后输出它。

期望输出包含：

```text
Goal: Build a solid TypeScript foundation
```

### 练习 3：制造并修复一个类型错误

临时把：

```ts
const learnerName: string = "Lazarus";
```

改成：

```ts
const learnerName: string = 123;
```

然后运行：

```bash
pnpm typecheck
```

你应该看到 TypeScript 报错。

记录错误后，把代码改回正确版本，再次运行：

```bash
pnpm typecheck
```

直到没有类型错误。

## 加分练习

添加两个变量：

```ts
const currentChapter: number = 0;
const isProjectRunnable: boolean = true;
```

然后输出：

```text
Chapter: 0
Runnable: true
```

## 常见错误

### 错误 1：`pnpm: The term 'pnpm' is not recognized` 或 `pnpm: command not found`

说明你还没有安装或启用 `pnpm`，或者当前终端还没有刷新 PATH。

先检查：

```powershell
node --version
npm --version
corepack --version
```

如果 `node` 不可用，先安装 Node.js LTS。

如果 `node` 可用但 `pnpm` 不可用，优先运行：

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

如果 `corepack` 不可用，再使用：

```powershell
npm install -g pnpm
pnpm --version
```

Windows 上安装后仍然不可用时，关闭当前 PowerShell，重新打开，再运行 `pnpm --version`。

### 错误 2：`Invalid package manager specification in package.json`

如果运行 `pnpm add -D typescript tsx @types/node` 时看到：

```text
Invalid package manager specification in package.json (pnpm@^11.9.0); expected a semver version
```

打开 `package.json`，找到：

```json
"packageManager": "pnpm@^11.9.0"
```

或者：

```json
"devEngines": {
  "packageManager": {
    "name": "pnpm",
    "version": "^11.9.0",
    "onFail": "download"
  }
}
```

改成精确版本：

```json
"packageManager": "pnpm@11.9.0"
```

或者把 `devEngines.packageManager.version` 改成：

```json
"version": "11.9.0"
```

也就是去掉 `^`。版本号以你本机 `pnpm --version` 输出为准。

如果你不确定，也可以先删除 `packageManager` 这一整行，或者删除整个 `devEngines` 对象，然后重新运行：

```powershell
pnpm add -D typescript tsx @types/node
```

### 错误 3：`ERR_PNPM_IGNORED_BUILDS`

如果安装依赖后看到：

```text
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@...
```

这表示 pnpm 阻止了依赖的安装后脚本。它不是 TypeScript 编译错误，也不代表 `typescript`、`tsx`、`@types/node` 没装上。

本章使用的 `tsx` 会依赖 `esbuild`，可以批准它：

```powershell
pnpm approve-builds
```

在出现的交互界面里选中 `esbuild` 并确认。然后运行：

```powershell
pnpm install
```

如果你不想进入交互界面，可以运行：

```powershell
pnpm approve-builds --all
pnpm install
```

如果你不确定是否处理成功，可以继续运行后面的：

```powershell
pnpm dev
pnpm typecheck
```

只要这两个命令能正常运行，本章就可以继续。

### 错误 4：`Cannot find module` 或找不到 `src/index.ts`

检查：

- 是否真的创建了 `src/index.ts`
- `package.json` 里的 `dev` 脚本是否是 `tsx src/index.ts`
- 当前终端是否在 `typed-toolbox-lab` 目录里

### 错误 5：`Type 'number' is not assignable to type 'string'`

这是正常的 TypeScript 类型错误。它表示你把 `number` 类型的值放到了要求 `string` 的变量里。

这类错误是 TypeScript 的核心价值：在程序运行前发现明显类型错误。

## 自检清单

完成本章后，你应该确认：

- [ ] 我能运行 `node --version`
- [ ] 我能运行 `npm --version`
- [ ] 我能运行 `pnpm --version`
- [ ] 我创建了 `typed-toolbox-lab` 目录
- [ ] 我有 `package.json`
- [ ] 如果 `package.json` 有 `packageManager` 或 `devEngines.packageManager.version`，它使用的是精确 pnpm 版本，没有 `^`
- [ ] 如果安装依赖时出现 `ERR_PNPM_IGNORED_BUILDS`，我已经运行过 `pnpm approve-builds` / `pnpm approve-builds --all`，或确认 `pnpm dev` / `pnpm typecheck` 能正常运行
- [ ] 我有 `tsconfig.json`
- [ ] 我有 `src/index.ts`
- [ ] 我能运行 `pnpm dev`
- [ ] 我能运行 `pnpm typecheck`
- [ ] 我能运行 `pnpm build`
- [ ] 我能运行 `pnpm start`
- [ ] 我制造过一次类型错误，并看懂了基本报错
- [ ] 我修复了类型错误

## 提交给 AI Agent 的要求

完成后，把以下内容提交给 AI Agent：

1. `node --version`、`npm --version`、`pnpm --version` 输出
2. 项目目录结构
3. `package.json` 内容，并说明 `packageManager` 或 `devEngines.packageManager.version` 是否为精确版本
4. `tsconfig.json` 内容
5. `src/index.ts` 内容
6. `pnpm dev` 输出
7. `pnpm typecheck` 输出
8. `pnpm build` 输出
9. `pnpm start` 输出
10. 你制造的类型错误信息
11. 你对本章还不理解的问题

你可以复制这个模板填写：

```text
templates/agent-submission.md
```

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 1 章。

如果低于 75 分，先根据反馈修正本章项目，再重新提交。
