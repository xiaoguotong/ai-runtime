# Prompt 4：V4 开发

你现在负责实现 Mini Agent Runtime 的 V4。

首先阅读 AGENTS.md，并完整检查 V1、V2、V3 的实现。

V4 目标：实现基于 Event Log 的执行状态追踪和 Recovery Manager。

## 任务一：Event Store

实现：
- append()
- getByTurn()
- getBySession()
- getAfterEvent()

## 任务二：Runtime Events

统一事件类型，至少包含：

- TURN_CREATED
- TURN_STARTED
- TURN_COMPLETED
- TURN_FAILED
- TURN_CANCEL_REQUESTED
- TURN_CANCELLED
- TURN_PAUSED
- TURN_RESUMED
- LLM_REQUEST_STARTED
- LLM_RESPONSE_COMPLETED
- TOOL_EXECUTION_STARTED
- TOOL_EXECUTION_COMPLETED
- TOOL_EXECUTION_FAILED
- TOOL_EXECUTION_UNKNOWN

## 任务三：状态与事件一致性

所有关键状态更新和事件追加必须尽可能放在同一个 SQLite Transaction 中。

## 任务四：Event Replay

实现从 Event Log 重建 Turn 状态的能力。

## 任务五：Snapshot

新增 Turn Snapshot，支持：
- 创建 Snapshot。
- 查询最新 Snapshot。
- 从 Snapshot 继续 Replay 后续事件。

## 任务六：Recovery Manager

实现：
- 扫描异常中断的 Turn。
- 查找未完成的 Step。
- 查找未完成的 Tool Execution。
- 核查 RUNNING 工具。
- 复用 SUCCEEDED 工具结果。
- 识别 UNKNOWN 工具。
- 决定任务是否可以自动恢复。

## 任务七：启动恢复

Runtime 初始化时执行 Recovery Manager。对于存在外部副作用风险的 UNKNOWN 工具，不要自动重试，应该等待核查或人工确认。

## 任务八：故障注入测试

必须模拟：

1. LLM 请求完成后进程崩溃。
2. Tool 执行前进程崩溃。
3. Tool 执行成功但数据库更新前进程崩溃。
4. Tool 执行中进程崩溃。
5. 用户 Stop 后进程崩溃。
6. Snapshot 创建后进程崩溃。

## 最终验收

程序重新启动后，能够根据持久化状态识别中断任务，并安全地恢复可恢复的任务。

禁止：
- 直接重新执行所有 RUNNING 工具。
- 忽略 UNKNOWN 状态。
- 仅靠内存变量恢复任务。
- 仅靠 Snapshot 忽略后续 Event。
- 在缺乏幂等保障时自动重试有副作用的操作。

完成后输出：
1. Event Log 架构。
2. Snapshot 机制。
3. Recovery 流程。
4. 故障测试结果。
5. 尚存的恢复边界。
