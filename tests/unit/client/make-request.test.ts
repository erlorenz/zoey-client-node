import { describe, test, expect, assert } from "vitest";
import { mockHttpClient as client } from "../../../mocks/http-client.js";
import { assertIsNotOk, assertisOk } from "../../helpers.js";

describe("makeRequest function", () => {
  test("successfully returns unknown json", async () => {
    const result = await client.makeRequest({ path: "/ok" });

    assertisOk(result);
  });

  test("returns null if server status is 204", async () => {
    const result = await client.makeRequest({ path: "/nocontent" });

    assertisOk(result);
    assert.strictEqual(result.data, null);
  });

  test("returns ZoeyError with type: 'bad_json' when ok response does not return valid json", async () => {
    const result = await client.makeRequest({ path: "/notjson" });

    assertIsNotOk(result);
    assert.strictEqual(result.error.type, "bad_json");
    assert.notExists(result.error.responseBody);
  });

  test("returns ZoeyError with type: 'invalid_return_type' when error with invalid body", async () => {
    const result = await client.makeRequest({ path: "/invaliderror" });

    assertIsNotOk(result);
    assert.strictEqual(result.error.type, "invalid_return_type");
    assert.exists(result.error.responseBody);
  });

  test("returns ZoeyError with responseBody when error with valid body", async () => {
    const result = await client.makeRequest({
      path: "/validerror",
    });

    assertIsNotOk(result);
    assert.exists(result.error.responseBody);
  });

  test("returns ZoeyError with type: 'connnection_error' when fetch throws Error", async () => {
    const result = await client.makeRequest({ path: "/networkerror" });

    assertIsNotOk(result);
    assert.strictEqual(result.error.type, "connection");
  });

  test("does not return an error when timeout is longer than delay ", async () => {
    // mock client timeout is 100ms, path /delay has a 10ms delay
    const result = await client.makeRequest({ path: "/delay" });

    assertisOk(result);
  });

  test("returns ZoeyError with type: 'timeout' when fetch throws TimeoutError", async () => {
    // mock client timeout is 15ms, path /delay has a 10ms delay
    const result = await client.makeRequest({ path: "/delay", timeout: 5 });

    assertIsNotOk(result);
    assert.strictEqual(result.error.type, "timeout");
  });
});
