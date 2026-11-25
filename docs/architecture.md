# 架构文档

## 1. 分层结构

```
Runtime (编排)
   ├── Agent            管理 Agent 行为
   ├── AgentLoop        LLM 与 Tool 循环
   ├── SessionManager / TurnManager / StepManager
   ├── ToolRegistry / ToolExecutor
   ├── Persistence      Repository，负责数据持久化
   └── RecoveryManager  异常恢复（V4）
```

规则来源：`AGENTS.md`。禁止把所有逻辑写进一个 Agent 类；Runtime 负责执行，Repository 负责持久化；AgentLoop 中禁止直接编写 SQL。

## 2. 当前阶段（初始化）已落地的模块

| 模块 | 路径 | 职责 |
| --- | --- | --- |
| 基础类型 | `src/types/index.ts` | ID 品牌类型、领域状态、ToolCall / ToolResult / RuntimeEvent |
| 错误类型 | `src/errors/index.ts` | `RuntimeError` 及各类具体错误，统一 `code` |
| 数据库初始化 | `src/db/database.ts` | 建目录、打开连接、设置 pragma（外键 / WAL / busy timeout） |
| Migration | `src/db/migration.ts` | 建迁移表、按版本事务执行、记录与幂等校验 |
| 迁移注册表 | `src/db/migrations/index.ts` | 迁移列表，初始化阶段为空 |
| 包入口 | `src/index.ts` | 统一导出 |

## 3. 状态模型（供 V1+ 使用）

- Session：`ACTIVE` | `ARCHIVED`
- Turn：`PENDING` | `RUNNING` | `WAITING` | `PAUSING` | `PAUSED` | `CANCELLING` | `CANCELLED` | `COMPLETED` | `FAILED` | `INTERRUPTED`
- Step：`PENDING` | `RUNNING` | `COMPLETED` | `FAILED` | `CANCELLED`
- ToolExecution：`PENDING` | `RUNNING` | `SUCCEEDED` | `FAILED` | `CANCELLED` | `UNKNOWN`

状态必须使用明确类型定义，禁止随意用字符串表示或绕过状态转换规则。

## 4. 持久化设计

- 使用参数化 SQL，复杂写操作使用事务。
- 不持久化 Promise、调用栈或 AbortController；持久化执行状态、消息历史、LLM Response、Tool Call / Result、运行时事件与 Snapshot。
- 进程重启后通过持久化数据重建执行现场。
- 数据库表结构参考套件 `mini-agent-runtime-ai-kit/examples/sql/schema.example.sql`，业务表将在 V1-01 添加。

## 5. 测试策略

- 每个核心模块必须有单元测试，当前覆盖：数据库 pragma、文件目录创建、非法路径报错、Migration 建表 / 顺序执行 / 幂等 / 重复版本校验、错误类型。
- 每次阶段完成后运行 `npm run typecheck` 与 `npm test`，通过后才进入下一阶段。
