# Mini Agent Runtime

基于 TypeScript、Node.js 和 SQLite 的渐进式 Mini Agent Runtime。

项目按 V1 → V2 → V3 → V4 分阶段实现，当前处于 **项目初始化（Prompt 0）** 阶段，仅包含基础设施，不含业务功能。

## 技术栈

- Node.js / TypeScript（strict）
- SQLite + better-sqlite3
- OpenAI SDK / DeepSeek API
- Zod
- Vitest
- Pino

## 安装与运行

```bash
npm install
cp .env.example .env

npm run typecheck
npm test
npm run build
```

> Windows 下复制环境变量文件：`copy .env.example .env`

## 目录结构

```
ai-runtime/
├── AGENTS.md                 项目全局规则与架构约束
├── prompts/                  分阶段开发 Prompt（00 ~ 05）
├── docs/
│   ├── tasks.md              任务清单
│   └── architecture.md       架构文档
├── src/
│   ├── types/                基础类型定义
│   ├── errors/               统一错误类型
│   ├── db/
│   │   ├── database.ts       SQLite 初始化
│   │   ├── migration.ts      Migration 机制
│   │   └── migrations/       migration 注册表
│   └── index.ts              包入口
└── tests/                    基础单元测试
```

## 当前阶段内容

- TypeScript strict 配置
- Vitest 测试环境
- 基础领域类型与统一错误类型
- SQLite 连接初始化（外键、WAL、busy timeout）
- Migration 机制（版本记录、事务执行、幂等、重复版本校验）
- `.env.example`

## 开发路线

- V1：Session / Turn / Step / Message、SQLite Repository、LLM Provider、Tool Registry、Agent Loop
- V2：ToolExecution、ToolExecutor、幂等与 UNKNOWN 状态
- V3：停止 / 暂停 / 恢复、状态机与安全断点
- V4：Event Store、Snapshot、Recovery Manager

详细规则见 `AGENTS.md`，任务清单见 `docs/tasks.md`。
