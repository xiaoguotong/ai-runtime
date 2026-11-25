import { describe, it, expect } from "vitest";
import {
  RuntimeError,
  ConfigurationError,
  DatabaseError,
  MigrationError,
  ValidationError,
} from "../src/errors/index.js";

describe("error types", () => {
  it("sets code and name for base and derived errors", () => {
    const base = new RuntimeError("INTERNAL_ERROR", "boom");
    expect(base.code).toBe("INTERNAL_ERROR");
    expect(base.name).toBe("RuntimeError");

    expect(new ConfigurationError("bad config").code).toBe("CONFIG_ERROR");
    expect(new DatabaseError("db down").code).toBe("DATABASE_ERROR");
    expect(new MigrationError("bad migration").code).toBe("MIGRATION_ERROR");
    expect(new ValidationError("bad input").code).toBe("VALIDATION_ERROR");
  });

  it("preserves the cause", () => {
    const cause = new Error("original");
    const error = new DatabaseError("wrapped", cause);
    expect(error.cause).toBe(cause);
  });
});
