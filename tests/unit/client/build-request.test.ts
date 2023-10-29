import { assert, test, describe } from "vitest";
import { buildRequest } from "../../../src/http-client/build-request.js";
import type { ZoeyClientConfig } from "../../../src/index.js";
import { createOAuth } from "../../../src/http-client/oauth.js";
import type { MakeRequestOptions } from "../../../src/http-client/types.js";

const auth: ZoeyClientConfig["auth"] = {
  accessToken: "sfdsafa",
  tokenSecret: "sfdafffa",
  consumerKey: "sdffasdaf",
  consumerSecret: "sdfaf",
};

const oauth = createOAuth(auth.consumerKey, auth.consumerSecret);

const baseUrl = "https://www.test.com/api/rest";

const defaultTimeout = 15_000;

describe("the build-request function", () => {
  describe("a simple GET", () => {
    const opts: MakeRequestOptions = {
      path: "/accounts",
    };

    const req = buildRequest({
      opts,
      auth,
      oauth,
      baseUrl,
      defaultTimeout,
    });

    test("returns a request", () => {
      assert.instanceOf(req, Request);
    });

    test("combines the baseurl and path correctly", () => {
      assert.strictEqual(req.url, "https://www.test.com/api/rest/accounts");
    });

    test("defaults to a GET", () => {
      assert.strictEqual(req.method, "GET");
    });

    test("has auth header and no content type", () => {
      const headers = req.headers;
      assert.notExists(headers.get("Content-Type"));
      assert.exists(headers.get("Authorization"));
      assert.include(headers.get("Authorization"), "OAuth");
    });

    test("has no body", () => {
      assert.notExists(req.body);
    });
  });

  describe("a GET with params", () => {
    const opts: MakeRequestOptions = {
      path: "/accounts",
      queryParams: {
        limit: "15",
        "created_at[gt]": "some datetime",
      },
    };

    const req = buildRequest({
      opts,
      auth,
      oauth,
      baseUrl,
      defaultTimeout,
    });

    test("adds the query params correctly", () => {
      assert.strictEqual(
        req.url,
        "https://www.test.com/api/rest/accounts?limit=15&created_at%5Bgt%5D=some+datetime"
      );

      const url = new URL(req.url);
      assert.strictEqual(url.host, "www.test.com");
      assert.strictEqual(url.pathname, "/api/rest/accounts");
      assert.isTrue(url.searchParams.has("limit", "15"));
      assert.isTrue(url.searchParams.has("created_at[gt]", "some datetime"));
      assert.isFalse(url.searchParams.has("random_other_param"));
    });
  });

  describe("a POST with a body", () => {
    const opts: MakeRequestOptions = {
      path: "/accounts",
      method: "POST",
      body: "Hello",
    };

    const req = buildRequest({
      opts,
      auth,
      oauth,
      baseUrl,
      defaultTimeout,
    });

    test("uses POST method from the options", () => {
      assert.strictEqual(req.method, "POST");
    });

    test("has no query params", () => {
      const url = new URL(req.url);
      assert.strictEqual(url.pathname, "/api/rest/accounts");
      assert.isEmpty(url.search);
    });

    test("contains a content type header", () => {
      assert.strictEqual(req.headers.get("Content-Type"), "application/json");
    });

    test("contains a body", () => {
      assert.exists(req.body);
    });
  });
});
