import { assert } from "vitest";
import type { Result } from "../src/http-client/types.js";
import type { ZoeyError } from "../src/index.js";

export function assertData<T>(result: Result<T, ZoeyError>) {
  // only actual assert narrows discriminated union so this needs to be called
  assert(
    result.ok,
    // @ts-ignore
    "expected result.error to not exist: " + result.error.message
  );
  return result.data;
}

export function assertError<T>(result: Result<T, ZoeyError>) {
  // fail with better assertion error that shows the error value
  assert.notProperty(result, "data");

  // only actual assert narrows discriminated union so this needs to be called
  assert(!result.ok);
  return result.error;
}
