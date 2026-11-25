export type ErrorCode =
  | "CONFIG_ERROR"
  | "DATABASE_ERROR"
  | "MIGRATION_ERROR"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INVALID_STATE"
  | "LLM_ERROR"
  | "TOOL_ERROR"
  | "CANCELLED"
  | "INTERNAL_ERROR";

export class RuntimeError extends Error {
  readonly code: ErrorCode;
  readonly cause?: unknown;

  constructor(code: ErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    if (cause !== undefined) {
      this.cause = cause;
    }
    Error.captureStackTrace?.(this, new.target);
  }
}

export class ConfigurationError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("CONFIG_ERROR", message, cause);
  }
}

export class DatabaseError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("DATABASE_ERROR", message, cause);
  }
}

export class MigrationError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("MIGRATION_ERROR", message, cause);
  }
}

export class ValidationError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("VALIDATION_ERROR", message, cause);
  }
}

export class NotFoundError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("NOT_FOUND", message, cause);
  }
}

export class InvalidStateError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("INVALID_STATE", message, cause);
  }
}

export class LLMError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("LLM_ERROR", message, cause);
  }
}

export class ToolError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("TOOL_ERROR", message, cause);
  }
}

export class CancelledError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("CANCELLED", message, cause);
  }
}

export class InternalError extends RuntimeError {
  constructor(message: string, cause?: unknown) {
    super("INTERNAL_ERROR", message, cause);
  }
}
