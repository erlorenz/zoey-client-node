import { assert } from "vitest";
import type { Result } from "../src/http-client/types.js";
import { ZoeyError } from "../src/index.js";

/**
 * Asserts that result.ok is true and result.data exists.
 *
 * @param result - {@link Result}
 *
 */
export function assertisOk<T, E extends ZoeyError>(
  result: Result<T, E>
): asserts result is { ok: true; data: T } {
  // only actual assert narrows discriminated union so this needs to be called
  assert(
    result.ok,
    // @ts-ignore
    "expected result.error to not exist: " + result.error
  );
  assert.property(result, "data");
  assert.notProperty(result, "error");
}

/**
 * Asserts that result.ok is false and result.error exists.
 *
 * @param result - {@link Result}
 *
 */
export function assertIsNotOk<T, E extends ZoeyError>(
  result: Result<T, E>
): asserts result is { ok: false; error: E } {
  assert(!result.ok);
  assert.notProperty(result, "data");
  assert.property(result, "error");
  assert.instanceOf(result.error, ZoeyError);
}
