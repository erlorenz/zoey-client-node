import { describe, test, assert } from "vitest";
import { ZoeyClient } from "../../src/index.js";
import { testConfig } from "./test-config.js";
// import fs from "node:fs/promises";

const zoey = new ZoeyClient(testConfig);

describe("accounts service", () => {
  let accountId: string;

  test("lists accounts", async () => {
    const LIMIT = 3;
    const result = await zoey.accounts.list({ limit: LIMIT, maxPages: 1 });

    assert(result.ok, "expected result.ok to be true");
    assert.isAtMost(result.data.length, LIMIT);

    const first = result.data[0];
    assert.exists(first);

    accountId = result.data[0]!.id;
  });

  test("retrieves account by id", async () => {
    const result = await zoey.accounts.retrieve(accountId);

    assert(result.ok, "expected result.ok to be true");
  });

  // test("write to file", async () => {
  //   const result = await zoey.client.makeRequest({
  //     path: zoey.accounts.resourcePath + "/list",
  //     queryParams: { limit: "1", page: "1" },
  //   });
  //   assert(result.ok);
  // });
});
