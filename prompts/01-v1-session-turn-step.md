# Prompt 1：V1 开发

你现在负责实现 Mini Agent Runtime 的 V1。

首先阅读：
- AGENTS.md
- docs/architecture.md

V1 目标：实现 Session / Turn / Step / Message 的基础管理，并完成最小 Agent Loop。

请严格按照以下任务顺序执行。

## 任务一：数据库模型

1. 创建 sessions 表。
2. 创建 turns 表。
3. 创建 steps 表。
4. 创建 messages 表。
5. 创建对应 Migration。

## 任务二：Repository

实现：
- SessionRepository
- TurnRepository
- StepRepository
- MessageRepository

Repository 只负责数据访问，不负责业务流程。

## 任务三：LLM Provider

实现统一 LLM Provider 接口。

要求：
- 支持 DeepSeek 兼容 API。
- 支持普通文本响应。
- 支持 Tool Calling。
- 支持错误处理。
- 支持超时。
- 不允许将 API Key 写入源码。

## 任务四：Tool Registry

实现 register()、get()、list()。

至少提供 read_file、write_file。文件操作必须限制在指定 Workspace 内，防止路径穿越。

## 任务五：AgentLoop

实现：
1. 加载消息历史。
2. 请求 LLM。
3. 保存 assistant message。
4. 判断是否有 Tool Calls。
5. 执行工具。
6. 保存 Tool Result。
7. 再次请求 LLM。
8. 返回最终回答。

要求：
- 不要直接在 AgentLoop 中编写 SQL。
- 不要把所有代码写在一个文件。
- 每次 LLM 请求和 Tool 执行都要创建 Step。
- 正确保存 assistant tool_calls 和对应 tool result。
- 为 AgentLoop 编写集成测试。

本次不实现：
- ToolExecution 独立持久化。
- Stop / Pause / Resume。
- Event Sourcing。
- Recovery Manager。

## 最终验收

执行一次读取 package.json 的任务，确认数据库中存在完整的 Session、Turn、Step、Message 数据。

执行：
- npm run typecheck
- npm test

只有通过测试才算完成。
