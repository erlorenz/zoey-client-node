import { describe, it, expect } from "vitest";
import { ApiError, ConfigurationError, ZoeyClient } from "../../src/index.js";
import type { ZoeyClientConfig } from "../../src/zoey/types.js";

const goodConfig: ZoeyClientConfig = {
  auth: {
    consumerKey: "string",
    consumerSecret: "string",
    accessToken: "string",
    tokenSecret: "string",
  },
  baseUrl: "https://www.test.com",
};

const missingParamConfig: ZoeyClientConfig = {
  auth: {
    consumerKey: "string",
    consumerSecret: "string",
    accessToken: "string",
    // tokenSecret: "string",
  },
  baseUrl: "https://www.test.com",
} as ZoeyClientConfig;

const emptyParamConfig: ZoeyClientConfig = {
  auth: {
    consumerKey: "string",
    consumerSecret: "string",
    accessToken: "string",
    tokenSecret: "",
  },
  baseUrl: "https://www.test.com",
};

describe("validate config", () => {
  it("should throw a ConfigurationError when param is empty", () => {
    expect(() => new ZoeyClient(emptyParamConfig)).to.throw(ConfigurationError);
  });

  it("should throw a ConfigurationError when param is empty TEST FAIL", () => {
    expect(() => new ZoeyClient(emptyParamConfig)).to.throw(ConfigurationError);
  });

  it("should throw a ConfigurationError when param is missing", () => {
    expect(() => new ZoeyClient(missingParamConfig)).to.throw(
      ConfigurationError
    );
  });

  it("should throw a ConfigurationError when baseUrl is not valid url", () => {
    const invalidbaseUrlConfig: ZoeyClientConfig = {
      auth: { ...missingParamConfig.auth },
      baseUrl: "hello.com",
    };
    expect(() => new ZoeyClient(invalidbaseUrlConfig)).to.throw(
      ConfigurationError
    );
  });

  it("should not throw an error when initializing with correct params", () => {
    expect(() => new ZoeyClient(goodConfig)).not.to.throw();
  });
});
