import { describe, test, assert } from "vitest";
import { ensureError } from "../../../src/errors/ensure-error.js";

const normalError = new Error("Test");
const string = "not an error";
const object = { not: "an error", message: "message" };
const array = ["not", "an", "error"];
const bigInt = BigInt(32432443244);

describe("ensure error function", () => {
  test("return err if err is an Error", () => {
    const err = ensureError(normalError);
    assert.instanceOf(err, Error);
  });

  test("return TypeError with string as message if err is a string", () => {
    const err = ensureError(string);
    assert.instanceOf(err, TypeError);
    assert.strictEqual(string, err.cause);
  });

  test("return TypeError with JSON object in message and original object cause if err is an object", () => {
    const err = ensureError(object);
    assert.instanceOf(err, TypeError);
    assert.strictEqual(err.message.includes(JSON.stringify(object)), true);
    assert.strictEqual(object, err.cause);
  });

  test("return TypeError with JSON array in message and original array cause if err is an array", () => {
    const err = ensureError(array);
    assert.instanceOf(err, TypeError);
    assert.strictEqual(err.message.includes(JSON.stringify(array)), true);
    assert.strictEqual(array, err.cause);
  });

  test("return TypeError with null cause if err is null", () => {
    const err = ensureError(null);
    assert.instanceOf(err, TypeError);
    assert.strictEqual(err.message, "error is null");
    assert.strictEqual(null, err.cause);
  });

  test("return TypeError with no cause if err is undefined", () => {
    const err = ensureError(undefined);
    assert.instanceOf(err, TypeError);
    assert.strictEqual(err.message, "error is undefined");
    assert.notExists(err.cause);
  });

  test("return TypeError if error is not JSON parseable", () => {
    const err = ensureError(bigInt);
    assert.instanceOf(err, TypeError);
  });
});
