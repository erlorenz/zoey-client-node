import { describe, test, assert } from "vitest";
import { ZoeyClient, type ZoeyClientConfig } from "../../../src/index.js";
import { goodConfig } from "../validate-config.test.js";

const testConfig = goodConfig;

describe("create client with defaults", () => {
  test("default timeout is 15_000 when no timeout specified in config", () => {
    const zoey = new ZoeyClient(testConfig);
    assert.strictEqual(zoey.client.getDefaultTimeout(), 15_000);
  });

  test("default timeout is 20_000 when timeout 20_000 specified in config", () => {
    const config = { ...testConfig, timeout: 20_000 };
    const zoey = new ZoeyClient(config);
    assert.strictEqual(zoey.client.getDefaultTimeout(), 20_000);
  });
});
