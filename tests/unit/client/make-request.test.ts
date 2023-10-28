import { describe, test, expect, assert, expectTypeOf } from "vitest";
import { mockHttpClient as client } from "../../../mocks/http-client.js";
import { ZoeyError } from "../../../src/index.js";

describe("makeRequest function", () => {
  test("successfully returns unknown json", async () => {
    const result = await client.makeRequest({ path: "/ok" });

    // assert lets typescript work with discriminated union
    assert(result.ok, "expected property ok to be true");
    expect(result).not.to.have.property("error");
    expect(result.data).to.exist;
    expectTypeOf(result.data).toEqualTypeOf<unknown>();
  });

  test("returns null if server status is 204", async () => {
    const result = await client.makeRequest({ path: "/nocontent" });

    // assert lets typescript work with discriminated union
    assert(result.ok, "expected property ok to be true");
    expect(result).not.to.have.property("error");
    expect(result.data).to.equal(null);
  });

  test("returns ZoeyError with type: 'bad_json' when ok response does not return valid json", async () => {
    const result = await client.makeRequest({ path: "/notjson" });

    assert(!result.ok, "expected property ok to be false");
    expect(result).not.to.have.property("data");
    expect(result.error).to.have.property("type").that.equals("bad_json");
    expect(result.error).to.have.property("responseBody").that.does.not.exist;
  });

  test("returns ZoeyError with type: 'invalid_return_type' when error with invalid body", async () => {
    const result = await client.makeRequest({ path: "/invaliderror" });

    assert(!result.ok, "expected property ok to be false");
    expect(result).not.to.have.property("data");
    expect(result.error).to.be.an.instanceOf(ZoeyError);
    expect(result.error)
      .to.have.property("type")
      .that.equals("invalid_return_type");
    expect(result.error).to.have.property("responseBody").that.does.exist;
  });

  test("returns ZoeyError with responseBody when error with valid body", async () => {
    const result = await client.makeRequest({
      path: "/validerror",
    });

    assert(!result.ok, "expected property ok to be false");
    expect(result).not.to.have.property("data");
    expect(result.error).to.be.an.instanceOf(ZoeyError);
    expect(result.error).to.have.property("responseBody").that.does.exist;
  });

  test("returns ZoeyError with type: 'connnection_error' when fetch throws Error", async () => {
    const result = await client.makeRequest({ path: "/networkerror" });

    assert(!result.ok, "expected property ok to be false");
    expect(result).not.to.have.property("data");
    expect(result.error).to.be.an.instanceOf(ZoeyError);
    expect(result.error).to.have.property("type").that.equals("connection");
  });

  test("does not return an error when timeout is longer than delay ", async () => {
    // mock client timeout is 100ms, path /delay has a 10ms delay
    const result = await client.makeRequest({ path: "/delay" });

    assert(result.ok, "expected property ok to be true");
    expect(result).not.to.have.property("error");
  });

  test("returns ZoeyError with type: 'timeout' when fetch throws AbortError", async () => {
    // mock client timeout is 15ms, path /delay has a 10ms delay
    const result = await client.makeRequest({ path: "/delay", timeout: 5 });

    assert(!result.ok, "expected property ok to be false");
    expect(result).not.to.have.property("data");
    expect(result.error).to.be.an.instanceOf(ZoeyError);
    expect(result.error).to.have.property("type").that.equals("timeout");
  });
});
