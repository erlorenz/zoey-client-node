import { describe, it, expect, beforeAll, afterAll, assert } from "vitest";
import { mockHttpClient as client } from "../mocks/http-client.js";
import { mockServer as server } from "../mocks/server.js";
import { ZoeyError } from "../../src/index.js";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());

describe("makeRequest function", () => {
  it("successfully returns unknown json", async () => {
    const result = await client.makeRequest({ path: "/ok" });

    // assert lets typescript work with discriminated union
    assert(result.ok);
    expect(result).not.to.have.property("error");
    expect(result.data).to.exist;
  });

  it("successfully returns null if server status is 204", async () => {
    const result = await client.makeRequest({ path: "/nocontent" });

    // assert lets typescript work with discriminated union
    assert(result.ok);
    expect(result).not.to.have.property("error");
    expect(result.data).to.equal(null);
  });

  it("successfully returns ZoeyError with type: 'bad_json' when status 200 does not return json", async () => {
    const result = await client.makeRequest({ path: "/notjson" });

    assert(!result.ok);
    expect(result).not.to.have.property("data");
    expect(result.error).to.have.property("type").that.equals("bad_json");
    expect(result.error).to.have.property("responseBody").that.does.not.exist;
  });

  it("successfully returns ZoeyError with type: 'invalid_return_type' when error with invalid body", async () => {
    const result = await client.makeRequest({ path: "/invaliderror" });

    assert(!result.ok);
    expect(result).not.to.have.property("data");
    expect(result.error).to.be.an.instanceOf(ZoeyError);
    expect(result.error)
      .to.have.property("type")
      .that.equals("invalid_return_type");
    expect(result.error).to.have.property("responseBody").that.does.exist;
  });

  it("successfully returns ZoeyError with responseBody when error with valid body", async () => {
    const result = await client.makeRequest({ path: "/validerror" });

    assert(!result.ok);
    expect(result).not.to.have.property("data");
    expect(result.error).to.be.an.instanceOf(ZoeyError);
    expect(result.error).to.have.property("responseBody").that.does.exist;
  });

  it("successfully returns ZoeyError with type: 'connnection_error' when fetch throws Error", async () => {
    const result = await client.makeRequest({ path: "/networkerror" });

    assert(!result.ok);
    expect(result).not.to.have.property("data");
    expect(result.error).to.be.an.instanceOf(ZoeyError);
    expect(result.error).to.have.property("type").that.equals("connection");
  });
});
