# Prompt 0：项目初始化

你是本项目的高级 TypeScript 架构师。

请阅读项目根目录中的 AGENTS.md。

当前任务：初始化 Mini Agent Runtime 项目。

技术要求：

- Node.js
- TypeScript
- SQLite
- better-sqlite3
- OpenAI SDK
- Zod
- Vitest
- Pino

执行任务：

1. 初始化 package.json。
2. 配置 TypeScript strict 模式。
3. 配置 Vitest。
4. 创建项目目录。
5. 创建基础类型定义。
6. 创建统一错误类型。
7. 创建 SQLite 数据库初始化模块。
8. 创建 Migration 机制。
9. 创建 .env.example。
10. 创建 README.md。
11. 创建 docs/architecture.md。

本次不实现业务功能，不实现 Agent Loop、Session Manager 和 Tool Executor。

要求：

- 不要提前实现后续版本功能。
- 所有代码必须可以正常编译。
- 必须提供基础测试。
- 完成后执行 npm test 和 npm run typecheck。

最后输出：
1. 项目结构。
2. 安装和启动方法。
3. 实现内容。
4. 测试结果。
5. 下一阶段建议。
