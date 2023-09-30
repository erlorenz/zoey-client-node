import { describe, it, expect } from "vitest";
import { ZoeyClient, ZoeyClientConfig } from "../../src/index.js";
import { ConfigurationError } from "../../src/errors/errors.js";

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
    // accessToken: "string",
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
    expect(() => ZoeyClient.validateConfig(emptyParamConfig)).to.throw(
      ConfigurationError
    );
  });

  it("should throw a ConfigurationError when param is empty TEST FAIL", () => {
    expect(() => ZoeyClient.validateConfig(emptyParamConfig)).to.throw(
      ConfigurationError
    );
  });

  it("should throw a ConfigurationError when param is missing", () => {
    expect(() => ZoeyClient.validateConfig(missingParamConfig)).to.throw(
      ConfigurationError
    );
  });

  it("should throw a ConfigurationError when baseUrl is not valid url", () => {
    const invalidbaseUrlConfig: ZoeyClientConfig = {
      auth: { ...missingParamConfig.auth },
      baseUrl: "hello.com",
    };
    expect(() => ZoeyClient.validateConfig(invalidbaseUrlConfig)).to.throw(
      ConfigurationError
    );
  });

  it("should not throw an error when initializing with correct params", () => {
    expect(() => ZoeyClient.validateConfig(goodConfig)).not.to.throw();
  });
});
