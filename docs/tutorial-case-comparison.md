# 教程案例对比与取舍

本文档用于约束本教程的案例选择和章节节奏，避免课程前期过早绑定 UE、GAS、MCP、CLI 或某个框架。

## 对比来源

| 来源 | 典型节奏 | 案例风格 | 本教程借鉴点 | 本教程避免点 |
|---|---|---|---|---|
| TypeScript Handbook / Everyday Types | 从 JS 值出发，讲基础类型、函数、对象、联合类型、类型别名和接口 | 极小代码片段，强调概念准确性 | 用它校准术语、概念边界和前期知识顺序 | 不照搬参考手册式密集章节 |
| TypeScript for JavaScript Programmers | 先解释 TS 是 JS 的类型化超集，再介绍推断、接口、联合、泛型 | 面向已有 JS 经验者的短示例 | 开篇建立“TS 不改变 JS 运行方式”的心智模型 | 不默认学习者已经熟悉大型 JS 项目 |
| Codecademy Learn TypeScript | 小步交互练习，逐步解锁变量、推断、函数、对象等 | 用户、商品、分数、简单计算等生活化任务 | 每小节后放短练习，降低入门门槛 | 不让案例过于碎片化，章节要有连续主线 |
| Total TypeScript | 错误驱动和挑战式练习，重视读报错和类型推断 | 修复类型错误、观察 IDE/编译器反馈 | 每章安排“制造并修复类型错误”的任务 | 前期不用复杂类型测试或类型体操 |
| Execute Program | 极短讲解、高频练习、间隔复习 | 机制题、判断题、改错题 | 用快速判断题强化概念 | 不把教程做成纯题库，仍保留项目感 |
| W3Schools / MDN 入门资料 | 速查式语法介绍，例子短而直接 | 变量、函数、时间、数字计算 | 为初学者提供直接可运行的小例子 | 不做类型清单，不早讲 `unknown`、`never`、tuple、enum |

## 总体取舍

本教程采用混合路线：

1. 用官方 Handbook 和 Everyday Types 决定概念边界。
2. 用 Codecademy 的小步任务控制章节粒度。
3. 用 Total TypeScript 的错误驱动练习训练读报错。
4. 用 Execute Program 的短反馈题做阶段巩固。
5. 用一个连续的通用项目承接章节，而不是每节换一个孤立案例。

## 主线案例：`typed-toolbox-lab`

前期主线采用“任务清单 / 学习计划 / 通用数据工具箱”组合，而不是游戏、UE、MCP 或前端页面。

选择理由：

- 通用，几乎所有学习者都能理解。
- 自然覆盖 `string`、`number`、`boolean`、对象、联合类型、数组、异步读取、校验和测试。
- 后续可平滑扩展为 CLI 工具。
- 最后也可以选择少量稳定函数暴露为 MCP tools，但这只是应用层，不是前期学习前提。

## 各阶段案例演进

| 阶段 | 章节 | 案例重点 | 不引入的内容 |
|---|---|---|---|
| 基础语言 | 00-04 | 学习者资料、任务标题、预计时间、完成状态、API 响应、表单结果 | UE、GAS、MCP、CLI、框架、数据库 |
| 类型化数据处理 | 05-11 | 任务列表、用户资料、订单、配置、JSON 数据、校验和测试 | 复杂产品架构、前端页面、类型体操 |
| 工具化应用 | 12-14 | CLI 命令、输入输出、MCP tools、最终整理 | 不把 CLI/MCP 反推到前期章节 |

## 第 1 章案例取舍

第 1 章只讲基础类型、类型推断和函数。参考其它教程后，本教程采用以下取舍：

- 借鉴 Handbook：先讲值的类型，再讲变量注解、推断、函数参数和返回值。
- 借鉴 Codecademy：每个概念后马上给一个短练习。
- 借鉴 Total TypeScript：安排一次有意制造的类型错误，并要求学习者解释错误。
- 借鉴 Execute Program：加入快速判断题，例如“这行是否会报错”。
- 避免 W3Schools 式类型清单：不在第 1 章展开 `unknown`、`never`、tuple、enum、对象类型细节、联合类型和泛型。

第 1 章连续案例是一个简单任务：

```ts
let taskTitle = "Learn TypeScript basics";
let estimatedMinutes = 45;
let isCompleted = false;

function formatTaskTitle(title: string): string {
  return title.trim();
}

function getRemainingMinutes(estimatedMinutes: number, completed: boolean): number {
  if (completed) {
    return 0;
  }

  return estimatedMinutes;
}
```

这个案例后续可以自然演进：

- 第 2 章：把散落变量合并为 `Task` 对象。
- 第 3 章：把 `boolean` 完成状态升级为 `"todo" | "doing" | "done"`。
- 第 4 章：根据不同状态做类型收窄。
- 第 6 章：扩展成任务数组和统计函数。
- 第 11 章：给任务统计函数写测试。
- 第 12 章：包装成 CLI 命令。
- 第 13 章：把稳定函数暴露为 MCP tools。

## 每章设计检查清单

写新章节时检查：

- [ ] 本章是否只引入章节地图规定的新概念。
- [ ] 案例是否通用，不依赖 UE/GAS/MCP 背景。
- [ ] 是否有最小示例、连续项目实践和练习题。
- [ ] 是否包含一次读报错或修复错误的训练。
- [ ] 是否要求真实命令输出，而不是口头描述。
- [ ] 是否避免提前使用下一章才会解释的概念。
