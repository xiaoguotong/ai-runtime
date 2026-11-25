import type { Migration } from "../migration.js";

/**
 * 按版本升序排列的 migration 列表。
 * 业务表（sessions / turns / steps / messages 等）将在 V1-01 阶段添加，
 * 本次初始化阶段不包含业务 Schema。
 */
export const migrations: readonly Migration[] = [];
