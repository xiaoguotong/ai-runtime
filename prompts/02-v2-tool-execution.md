# Prompt 2：V2 开发

你现在负责实现 Mini Agent Runtime 的 V2。

首先阅读 AGENTS.md，并检查现有 V1 实现。不要重写 V1。

V2 目标：将 Tool Execution 从 AgentLoop 中独立出来，使每个 Tool Call 都拥有独立的持久化生命周期。

执行任务：

1. 新增 tool_executions 数据库表。
2. 实现 ToolExecution 类型。
3. 实现 ToolExecutionRepository。
4. 实现 ToolDispatcher。
5. 实现 ToolExecutor。
6. 实现 Tool 参数 Zod 校验。
7. 实现 Tool Execution 状态转换。
8. 实现 Tool Call 去重。
9. 实现基础幂等键。
10. 改造 AgentLoop，使其统一调用 ToolExecutor。

必须支持以下状态：
- PENDING
- RUNNING
- SUCCEEDED
- FAILED
- CANCELLED
- UNKNOWN

重点处理：

场景一：Tool 执行成功，数据库保存成功。预期：状态为 SUCCEEDED。

场景二：Tool 执行失败。预期：状态为 FAILED，并记录错误。

场景三：同一个 Tool Call 重复提交。预期：不能重复创建执行记录。

场景四：Tool 执行中程序异常退出。预期：恢复检查时不能将 RUNNING 简单当成 PENDING，必须考虑 UNKNOWN。

场景五：外部操作成功，但本地还没有保存执行结果。预期：不能盲目重试，应提供状态核查接口。

要求：
- Tool Executor 不负责管理 Session。
- AgentLoop 不直接调用具体 Tool。
- 所有工具调用必须经过 ToolDispatcher。
- 数据库状态变更尽可能使用事务。
- 为关键场景编写集成测试。

本次不实现 Stop、Pause、Resume 和 Event Sourcing。

最终输出：
1. 新增的模块。
2. 状态流转图。
3. 数据库结构变化。
4. 测试报告。
5. V2 验收结果。
