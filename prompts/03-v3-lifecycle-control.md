# Prompt 3：V3 开发

你现在负责实现 Mini Agent Runtime 的 V3。

首先阅读：
- AGENTS.md
- docs/architecture.md
- 当前 V1 和 V2 实现

V3 目标：实现 Agent Turn 的生命周期控制，支持 Stop、Pause、Resume、AbortController 和安全断点。

执行任务：

1. 扩展 Turn 状态机。
2. 实现 CancellationManager。
3. 让 LLM Provider 支持 AbortSignal。
4. 让 Tool Executor 支持 AbortSignal。
5. 实现 stopTurn()。
6. 实现 pauseTurn()。
7. 实现 resumeTurn()。
8. 实现执行退出等待机制。
9. 实现未完成 Tool Execution 的状态核查。
10. 编写生命周期集成测试。

重要规则：

1. AbortController 只负责通知取消，不代表所有工具都能立即停止。
2. Stop 不应该立即将 Turn 标记为 CANCELLED。
3. 必须等待正在执行的操作退出或进入可核查状态。
4. Pause 必须在安全断点执行。
5. Resume 必须重建消息历史和执行上下文。
6. 已经成功的 Tool 不允许重复执行。
7. UNKNOWN 工具不能直接自动重试。
8. 对外部副作用工具必须考虑幂等性。

重点测试：

- LLM 请求期间 Stop。
- Tool 执行期间 Stop。
- 多个 Tool 并发时 Stop。
- Step 完成后 Pause。
- Pause 后 Resume。
- CANCELLED 后 Resume。
- Resume 时存在 UNKNOWN Tool。

本次不实现 Event Sourcing 和 Snapshot。

最终执行全部测试，并输出状态流转说明。
