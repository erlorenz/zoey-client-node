import {
  describe,
  it,
  expect,
  expectTypeOf,
  beforeAll,
  afterAll,
  assert,
} from "vitest";
import { mockServer as server } from "../mocks/server.js";
import { mockHttpClient as client } from "../mocks/http-client.js";
import { MockAccount, mockAccountSchema } from "../mocks/data.js";
import { z } from "zod";
import { ZoeyError } from "../../src/index.js";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

describe("makeAndParseRequestFunction", () => {
  it('returns a ZoeyError with type: "invalid_return_type" when schema does not match response', async () => {
    const result = await client.makeAndParseRequest({
      schema: mockAccountSchema,
      path: "/accounts/invalidaccount",
    });

    // Using assert to work with discrinated union
    assert(!result.ok);
    expect(result).to.have.property("error").and.to.not.have.property("data");
    expect(result.error)
      .to.be.instanceOf(ZoeyError)
      .and.to.have.property("type")
      .that.equals("invalid_return_type");
    expect(result.error).to.have.property("responseBody").that.does.exist;
  });

  it("successfully returns type that matches schema", async () => {
    const result = await client.makeAndParseRequest({
      schema: mockAccountSchema,
      path: "/accounts/account",
    });

    // Using assert to work with discrinated union
    assert(result.ok);
    expect(result).to.have.property("data").and.to.not.have.property("error");
    expectTypeOf(result.data).toEqualTypeOf<MockAccount>();
  });

  it("returns a ZoeyError when response not ok", async () => {
    const result = await client.makeAndParseRequest({
      schema: mockAccountSchema,
      path: "/badrequest",
    });

    // Using assert to work with discrinated union
    assert(!result.ok);
    expect(result).to.have.property("error").and.to.not.have.property("data");
    expect(result.error).to.be.instanceOf(ZoeyError);
  });
});
