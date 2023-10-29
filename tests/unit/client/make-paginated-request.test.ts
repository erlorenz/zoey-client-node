import { describe, test, assert } from "vitest";
import { mockHttpClient as client } from "../../../mocks/http-client.js";
import { mockAccountSchema, mockAccounts } from "../../../mocks/data.js";
import { ZoeyError } from "../../../src/index.js";
import { z } from "zod";
import { assertIsNotOk, assertisOk } from "../../helpers.js";

describe("makePaginatedRequestFunction (limit, maxPages, totalItems)", () => {
  test("returns a ZoeyError when response not ok", async () => {
    const result = await client.makePaginatedRequest({
      schema: z.array(mockAccountSchema),
      limit: 1,
      maxPages: 2,
      path: "/notjson",
    });

    assertIsNotOk(result);
  });

  test('returns a ZoeyError with type: "invalid_return_type" when schema does not match response', async () => {
    const result = await client.makePaginatedRequest({
      schema: z.array(mockAccountSchema),
      limit: 1,
      maxPages: 2,
      path: "/accounts/invalidaccount",
    });

    // Using assert to work with discrinated union
    assertIsNotOk(result);
    assert.strictEqual(result.error.type, "invalid_return_type");
    assert.exists(result.error.responseBody);
  });

  test("returns limit * maxPages items when less than total items (1, 3, 10)", async () => {
    const schema = z.array(mockAccountSchema);
    const limit = 1;
    const maxPages = 3;
    const totalItems = mockAccounts.length;

    const result = await client.makePaginatedRequest({
      schema,
      limit,
      maxPages,
      path: "/accounts/list",
    });

    assertisOk(result);
    assert.isArray(result.data);
    const length = result.data.length;
    assert.isBelow(length, totalItems);
    assert.strictEqual(length, 3);
  });

  test("returns the total list when limit * maxPages is greater than total items (1, 11, 10)", async () => {
    const schema = z.array(mockAccountSchema);
    const limit = 1;
    const maxPages = 11;
    const totalItems = mockAccounts.length; // 10

    const result = await client.makePaginatedRequest({
      schema,
      limit,
      maxPages,
      path: "/accounts/list",
    });

    // Using assert to work with discrinated union
    assertisOk(result);
    assert.isArray(result.data);
    assert.lengthOf(result.data, totalItems);
  });

  test("returns the total list when there are no maxPages (1, _, 10)", async () => {
    const schema = z.array(mockAccountSchema);
    const limit = 1;
    const totalItems = mockAccounts.length; // 10

    const result = await client.makePaginatedRequest({
      schema,
      limit,
      path: "/accounts/list",
    });

    assertisOk(result);
    assert.isArray(result.data);
    const length = result.data.length;
    assert.isAbove(length, limit);
    assert.strictEqual(length, totalItems);
  });
});
