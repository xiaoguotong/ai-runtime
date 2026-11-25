# AGENTS.md

## 1. Project Overview

本项目是一个基于 TypeScript、Node.js 和 SQLite 的 Mini Agent Runtime。

项目目标是实现一个具备以下能力的 Agent Runtime：

1. LLM 调用。
2. Tool Calling。
3. Skill 加载。
4. Session / Turn / Step 管理。
5. Tool Execution 生命周期管理。
6. SQLite 持久化。
7. Stop / Pause / Resume。
8. Event Log。
9. Snapshot。
10. Recovery Manager。

项目采用渐进式开发方式，分为 V1、V2、V3、V4 四个阶段。不要一次性实现所有功能。

## 2. Technology Stack

- Node.js
- TypeScript
- SQLite
- better-sqlite3
- OpenAI SDK
- DeepSeek API
- Zod
- Vitest
- Pino

除非确实存在技术问题，否则不要随意替换技术栈。

## 3. Architecture Principles

### 3.1 Separation of Concerns

必须区分以下职责：

- Agent：管理 Agent 行为。
- AgentLoop：负责 LLM 和 Tool 的循环调用。
- SessionManager：管理 Session。
- TurnManager：管理 Turn。
- StepManager：管理 Step。
- ToolRegistry：注册和查询工具。
- ToolExecutor：执行工具。
- Persistence：负责数据持久化。
- Runtime：管理整个运行环境。
- RecoveryManager：负责异常恢复。

禁止把所有逻辑写进一个 Agent 类。

### 3.2 Runtime and Persistence Separation

Runtime 负责执行，Repository 负责持久化。禁止在 AgentLoop 中直接编写 SQL。

### 3.3 Explicit State Machine

Session、Turn、Step、ToolExecution 必须使用明确的状态定义。禁止随意使用字符串表示状态，禁止绕过状态转换规则直接修改状态。

### 3.4 Durable Execution

不要试图持久化 JavaScript Promise、函数调用栈或者 AbortController。

持久化以下内容：

- 执行状态。
- 消息历史。
- LLM Response。
- Tool Call。
- Tool Execution Result。
- Runtime Events。
- Snapshot。

进程重启后通过这些数据重建执行现场。

### 3.5 Tool Safety

每个 Tool 都必须有明确的 Name、Description、Parameters Schema、Execute Function。

涉及外部副作用的 Tool 必须考虑幂等性。不确定工具是否执行成功时，不允许盲目重试。

## 4. Coding Standards

- 使用 TypeScript strict 模式。
- 避免 any。
- 使用明确的接口和类型。
- 使用 async/await。
- 所有异步错误必须处理。
- 数据库操作必须使用参数化 SQL。
- 复杂数据库写操作必须使用事务。
- 所有 Tool 参数必须经过 Zod 校验。
- 不允许在业务代码中随意操作全局状态。
- 不允许在 AgentLoop 中直接访问数据库。
- 所有核心模块必须有单元测试。

## 5. Development Workflow

每次开发必须遵循：

1. 阅读当前项目结构。
2. 阅读相关架构文档。
3. 明确当前任务范围。
4. 分析需要修改的模块。
5. 实现代码。
6. 编写测试。
7. 执行测试。
8. 检查类型错误。
9. 更新文档。
10. 输出开发总结。

不要在没有必要的情况下重构无关模块。

## 6. Version Constraints

### V1

只实现：

- Session
- Turn
- Step
- Message
- SQLite Repository
- LLM Provider
- Tool Registry
- AgentLoop

不实现 Tool Execution Recovery、AbortController、Pause / Resume、Event Sourcing、Snapshot。

### V2

新增：

- ToolExecution
- ToolExecutionRepository
- ToolExecutor
- ToolDispatcher
- Idempotency
- UNKNOWN 状态

不要提前实现 V3、V4。

### V3

新增：

- CancellationManager
- AbortController
- Stop
- Pause
- Resume
- 安全断点

### V4

新增：

- EventStore
- RuntimeEvent
- Snapshot
- Event Replay
- RecoveryManager
- Startup Recovery

## 7. Testing Requirements

每个功能必须有对应测试。重点测试：

- 正常执行。
- LLM 请求失败。
- Tool 执行失败。
- 数据库写入失败。
- 重复 Tool Call。
- 用户主动取消。
- 用户暂停任务。
- 用户恢复任务。
- Node.js 进程异常退出。
- Tool 执行成功但结果未保存。
- LLM Response 已保存但 Tool 尚未执行。

## 8. Important Restrictions

不要：

- 一次性实现全部四个版本。
- 引入不必要的框架。
- 为了架构完整性提前抽象。
- 把所有模块塞进 Agent 类。
- 使用内存状态代替持久化状态。
- 对 UNKNOWN 工具直接重试。
- 在没有测试的情况下声称任务完成。
- 随意修改数据库 Schema。
- 删除已有测试来规避失败。
- 将 TODO 当作已完成功能。

## 9. Task Completion Report

每次任务完成后，必须输出：

1. 本次实现的功能。
2. 修改的文件。
3. 核心设计说明。
4. 数据库变更。
5. 测试结果。
6. 尚未解决的问题。
7. 是否满足当前版本验收标准。

没有通过测试的功能不得标记为完成。
