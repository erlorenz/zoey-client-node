import { expect, it, describe } from "vitest";
import { buildRequest } from "../../src/http-client/build-request.js";
import { ZoeyClientConfig } from "../../src/index.js";
import { createOAuth } from "../../src/http-client/oauth.js";
import { MakeRequestOptions } from "../../src/http-client/types.js";
import { Request } from "node-fetch";

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

    it("returns a request", () => {
      expect(req).is.an.instanceOf(Request);
      expect(req)
        .to.have.property("url")
        .that.equals("https://www.test.com/api/rest/accounts");
    });

    it("combines the baseurl and path correctly", () => {
      expect(req)
        .to.have.property("url")
        .that.equals("https://www.test.com/api/rest/accounts");
    });

    it("defaults to a GET", () => {
      expect(req).to.have.property("method").that.equals("GET");
    });

    it("has auth header and no content type", () => {
      const headers = req.headers;

      expect(headers.get("Authorization")).to.exist.and.to.contain("OAuth");
      expect(headers.get("Content-Type")).to.not.exist;
    });

    it("has no body", () => {
      expect(req.body).to.not.exist;
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

    it("adds the query params correctly", () => {
      expect(req)
        .to.have.property("url")
        .that.equals(
          "https://www.test.com/api/rest/accounts?limit=15&created_at%5Bgt%5D=some+datetime"
        );

      const url = new URL(req.url);
      expect(url.host).to.equal("www.test.com");
      expect(url.pathname).to.equal("/api/rest/accounts");
      expect(url.searchParams.has("limit", "15")).to.be.true;
      expect(url.searchParams.has("created_at[gt]", "some datetime")).to.be
        .true;
      expect(url.searchParams.has("random_other_param")).to.be.false;
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

    it("uses POST method from the options", () => {
      expect(req.method).to.equal("POST");
    });

    it("has no query params", () => {
      const url = new URL(req.url);
      expect(url.pathname).to.equal("/api/rest/accounts");
      expect(url.search).to.be.empty;
    });

    it("added a content type header", () => {
      expect(req.headers.get("Content-Type")).to.exist.and.to.equal(
        "application/json"
      );
    });

    it("added a body", () => {
      expect(req.body).to.exist;
    });
  });
});
