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

### Step 3：安装开发依赖

运行：

```bash
pnpm add -D typescript tsx @types/node
```

这些依赖分别是：

| 依赖 | 作用 |
|---|---|
| `typescript` | TypeScript 编译器，提供 `tsc` |
| `tsx` | 直接运行 `.ts` 文件 |
| `@types/node` | Node.js API 的类型定义 |

### Step 4：创建 tsconfig.json

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

### Step 5：修改 package.json 脚本

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

### Step 6：创建入口文件

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

### 错误 1：`pnpm: command not found`

说明你还没有安装或启用 `pnpm`。

可以先检查：

```bash
node --version
corepack --version
```

如果 Node.js 较新，通常可以运行：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### 错误 2：`Cannot find module` 或找不到 `src/index.ts`

检查：

- 是否真的创建了 `src/index.ts`
- `package.json` 里的 `dev` 脚本是否是 `tsx src/index.ts`
- 当前终端是否在 `typed-toolbox-lab` 目录里

### 错误 3：`Type 'number' is not assignable to type 'string'`

这是正常的 TypeScript 类型错误。它表示你把 `number` 类型的值放到了要求 `string` 的变量里。

这类错误是 TypeScript 的核心价值：在程序运行前发现明显类型错误。

## 自检清单

完成本章后，你应该确认：

- [ ] 我创建了 `typed-toolbox-lab` 目录
- [ ] 我有 `package.json`
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

1. 项目目录结构
2. `package.json` 内容
3. `tsconfig.json` 内容
4. `src/index.ts` 内容
5. `pnpm dev` 输出
6. `pnpm typecheck` 输出
7. `pnpm build` 输出
8. `pnpm start` 输出
9. 你制造的类型错误信息
10. 你对本章还不理解的问题

你可以复制这个模板填写：

```text
templates/agent-submission.md
```

## 本章通过标准

AI Agent 评分达到 75 分或以上，就可以进入第 1 章。

如果低于 75 分，先根据反馈修正本章项目，再重新提交。
