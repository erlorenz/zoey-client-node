import { describe, it, expectTypeOf, assert } from "vitest";
import { mockHttpClient as client } from "../../../mocks/http-client.js";
import { type MockAccount, mockAccountSchema } from "../../../mocks/data.js";
import { ZoeyError } from "../../../src/index.js";
import { assertIsNotOk, assertisOk } from "../../helpers.js";

describe("makeAndParseRequestFunction", () => {
  it('returns a ZoeyError with type: "invalid_return_type" when schema does not match response', async () => {
    const result = await client.makeAndParseRequest({
      schema: mockAccountSchema,
      path: "/accounts/invalidaccount",
    });

    assertIsNotOk(result);
    assert.strictEqual(result.error.type, "invalid_return_type");
    assert.exists(result.error.responseBody);
  });

  it("successfully returns type that matches schema", async () => {
    const result = await client.makeAndParseRequest({
      schema: mockAccountSchema,
      path: "/accounts/account",
    });

    assertisOk(result);
    assert.doesNotThrow(() => mockAccountSchema.parse(result.data));
  });

  it("returns a ZoeyError when response not ok", async () => {
    const result = await client.makeAndParseRequest({
      schema: mockAccountSchema,
      path: "/notjson",
    });

    assertIsNotOk(result);
  });
});
