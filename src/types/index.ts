export type Newtype<T, Brand extends string> = T & { readonly __brand: Brand };

export type SessionId = Newtype<string, "SessionId">;
export type TurnId = Newtype<string, "TurnId">;
export type StepId = Newtype<string, "StepId">;
export type ToolExecutionId = Newtype<string, "ToolExecutionId">;
export type EventId = Newtype<string, "EventId">;

export type SessionStatus = "ACTIVE" | "ARCHIVED";

export type TurnStatus =
  | "PENDING"
  | "RUNNING"
  | "WAITING"
  | "PAUSING"
  | "PAUSED"
  | "CANCELLING"
  | "CANCELLED"
  | "COMPLETED"
  | "FAILED"
  | "INTERRUPTED";

export type StepType = "LLM_REQUEST" | "TOOL_BATCH";

export type StepStatus =
  | "PENDING"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type ToolExecutionStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "UNKNOWN";

export type MessageRole = "system" | "user" | "assistant" | "tool";

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  content: string;
  isError?: boolean;
}

export interface RuntimeEvent<T = Record<string, unknown>> {
  id: EventId;
  sessionId: SessionId;
  turnId: TurnId;
  type: string;
  payload: T;
  createdAt: number;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}
