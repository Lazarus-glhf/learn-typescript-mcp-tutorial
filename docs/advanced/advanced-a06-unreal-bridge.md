# Advanced A06：Unreal Bridge 边界

## 本章目标

本章设计 TypeScript 和 Unreal C++ 插件之间的边界。你不会马上写真实 UE 插件，而是先定义 bridge interface、fake bridge 和未来 HTTP/WebSocket bridge 的协议形状。

## 本章会学到什么

| 概念 | 作用 |
|---|---|
| adapter interface | 让 app 层不依赖具体通信方式 |
| fake bridge | 没有 Unreal Editor 也能测试 |
| protocol schema | UE C++ 和 TS 之间的契约 |
| capability discovery | 让 TS 先知道 UE 插件支持哪些能力 |

## 概念解释

TypeScript MCP Server 不应该直接知道 Unreal 内部对象。它应该通过 bridge 请求稳定 JSON：

```ts
export interface UnrealBridge {
  getEditorStatus(): Promise<EditorStatus>;
  listGameplayAbilities(): Promise<GameplayAbilitySummary[]>;
  validateGameplayTags(): Promise<TagValidationReport>;
}
```

真实实现可以是 HTTP、WebSocket、TCP 或本地进程；测试实现可以是 fake object。

## 项目实践

新增：

```text
src/adapters/unreal-bridge/UnrealBridge.ts
src/adapters/unreal-bridge/FakeUnrealBridge.ts
src/app/getEditorStatus.ts
src/app/listGameplayAbilities.ts
```

要求：

- app 层只依赖 `UnrealBridge` interface。
- fake bridge 用 fixture 数据返回稳定结果。
- CLI 和 MCP 都能调用同一 app 函数。

## 练习题

必做：实现 `get_editor_status` MCP tool，返回 fake bridge 状态。

加分：设计一个 HTTP bridge 的 request/response schema，但不必实现真实网络。

思考：哪些数据应该由 C++ 插件提供，哪些可以由 TS 直接扫描文件得到？

## 常见错误

- TS 层假装能理解 `.uasset` 内部格式。
- bridge 返回自由文本，导致 agent 难以继续处理。
- app 层 new 具体 HTTP client，导致测试困难。

## AI Agent 考核指令

请检查 `works/advanced/chapter-a06/unreal-agent-toolchain`：确认 bridge interface 清晰，fake bridge 测试通过，CLI/MCP 没有依赖真实 Unreal Editor。
