import { describe, test, assert } from "vitest";
import {
  ZoeyClient,
  type ZoeyClientConfig,
  ZoeyError,
} from "../../src/index.js";

export const goodConfig: ZoeyClientConfig = {
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
  test("throws a configuration error when param is empty", () => {
    const config = emptyParamConfig;
    assert.throws(() => ZoeyClient.validateConfig(config), ZoeyError);

    let type = "";
    try {
      ZoeyClient.validateConfig(config);
    } catch (err: any) {
      type = err.type;
    }

    assert.strictEqual(type, "configuration");
  });

  // it("should throw a ConfigurationError when param is empty TEST FAIL", () => {
  //   expect(() => ZoeyClient.validateConfig(goodConfig))
  //     .to.throw(ZoeyError)
  //     .that.has.property("type")
  //     .that.equals("configuration");
  // });

  test("should throw a configuration error when param is missing", () => {
    assert.throws(
      () => ZoeyClient.validateConfig(missingParamConfig),
      ZoeyError
    );
  });

  test("should throw a configuration error when baseUrl is not valid url", () => {
    const invalidbaseUrlConfig: ZoeyClientConfig = {
      auth: { ...missingParamConfig.auth },
      baseUrl: "hello.com",
    };
    assert.throws(
      () => ZoeyClient.validateConfig(invalidbaseUrlConfig),
      ZoeyError
    );
  });

  test("should not throw an error when initializing with correct params", () => {
    assert.doesNotThrow(() => ZoeyClient.validateConfig(goodConfig));
  });
});
