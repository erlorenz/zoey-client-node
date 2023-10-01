import { describe, it, expect, assert } from "vitest";
import { mockHttpClient as client } from "../../mocks/http-client.js";
import { mockAccountSchema, mockAccounts } from "../../mocks/data.js";
import { ZoeyError } from "../../src/index.js";
import { z } from "zod";

describe("makePaginatedRequestFunction", () => {
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

  it("successfully returns type that matches schema and length of max pages", async () => {
    const schema = z.array(mockAccountSchema);
    const result = await client.makePaginatedRequest({
      schema,
      limit: 1,
      maxPages: 2,
      path: "/accounts/list",
    });

    // Using assert to work with discrinated union
    assert(result.ok, "expected property ok to be true");
    expect(result).to.have.property("data").and.to.not.have.property("error");
    expect(result.data).to.have.lengthOf(2);
  });

  it("successfully returns type that matches schema and length of full when no max pages", async () => {
    const schema = z.array(mockAccountSchema);
    const result = await client.makePaginatedRequest({
      schema,
      limit: 1,
      maxPages: 10,
      path: "/accounts/list",
    });

    const lengthOfList = mockAccounts.length;

    // Using assert to work with discrinated union
    assert(result.ok, "expected property ok to be true");
    expect(result).to.have.property("data").and.to.not.have.property("error");
    expect(result.data).to.have.lengthOf(lengthOfList);
  });

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
});
