import { describe, it, expect } from "vitest";
import { ZoeyClient, ZoeyError, ApiError } from "../index.js";
import { ZoeyClientConfig } from "../zoey/types.js";

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
    tokenSecret: "string",
  },
  baseUrl: "",
};

describe("validate config", () => {
  it("should throw an error when missing params", () => {
    expect(() => new ZoeyClient(missingParamConfig)).toThrowError();
  });

  it("should throw a Zoey error when missing or empty params", () => {
    expect(() => new ZoeyClient(missingParamConfig)).toThrowError(ZoeyError);
  });

  it("should throw a Zoey error when baseUrl is not valid url", () => {
    const invalidbaseUrlConfig: ZoeyClientConfig = {
      auth: { ...missingParamConfig.auth },
      baseUrl: "hello.com",
    };
    expect(() => new ZoeyClient(invalidbaseUrlConfig)).toThrowError(ZoeyError);
  });

  it("should not throw an error when initializing with correct params", () => {
    expect(() => new ZoeyClient(goodConfig)).not.toThrowError();
  });
});
