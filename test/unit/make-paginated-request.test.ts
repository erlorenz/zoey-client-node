import { describe, it, expect, assert } from "vitest";
import { mockHttpClient as client } from "../../mocks/http-client.js";
import { mockAccountSchema, mockAccounts } from "../../mocks/data.js";
import { ZoeyError } from "../../src/index.js";
import { z } from "zod";

describe("makePaginatedRequestFunction (limit, maxPages, totalItems)", () => {
  it("returns a ZoeyError when response not ok", async () => {
    const result = await client.makePaginatedRequest({
      schema: z.array(mockAccountSchema),
      limit: 1,
      maxPages: 2,
      path: "/notjson",
    });

    // Using assert to work with discrinated union
    assert(!result.ok, "expected property ok to be false");
    expect(result).to.have.property("error").and.to.not.have.property("data");
    expect(result.error).to.be.instanceOf(ZoeyError);
  });

  it('returns a ZoeyError with type: "invalid_return_type" when schema does not match response', async () => {
    const result = await client.makePaginatedRequest({
      schema: z.array(mockAccountSchema),
      limit: 1,
      maxPages: 2,
      path: "/accounts/invalidaccount",
    });

    // Using assert to work with discrinated union
    assert(!result.ok, "expected property ok to be false");
    expect(result).to.have.property("error").and.to.not.have.property("data");
    expect(result.error)
      .to.be.instanceOf(ZoeyError)
      .and.to.have.property("type")
      .that.equals("invalid_return_type");
    expect(result.error).to.have.property("responseBody").that.does.exist;
  });

  it("returns limit * maxPages items when less than total items (1, 3, 10)", async () => {
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

    // Using assert to work with discrinated union
    assert(result.ok, "expected property ok to be true");
    expect(result).to.have.property("data").and.to.not.have.property("error");
    expect(result.data).to.have.length.that.is.lessThan(totalItems);
    expect(result.data).to.have.lengthOf(3);
  });

  it("returns the total list when limit * maxPages is greater than total items (1, 11, 10)", async () => {
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
    assert(result.ok, "expected property ok to be true");
    expect(result).to.have.property("data").and.to.not.have.property("error");
    expect(result.data).to.have.length(totalItems);
  });

  it("returns the total list when there are no maxPages (1, _, 10)", async () => {
    const schema = z.array(mockAccountSchema);
    const limit = 1;
    const totalItems = mockAccounts.length; // 10

    const result = await client.makePaginatedRequest({
      schema,
      limit,
      path: "/accounts/list",
    });

    // Using assert to work with discrinated union
    assert(result.ok, "expected property ok to be true");
    expect(result).to.have.property("data").and.to.not.have.property("error");
    expect(result.data).to.have.length.that.is.greaterThan(limit);
    expect(result.data).to.have.lengthOf(totalItems);
  });
});
