import { describe, test, assert } from "vitest";
import { ZoeyClient } from "../../src/index.js";
import { testConfig } from "./test-config.js";
import { assertisOk } from "../helpers.js";

const zoey = new ZoeyClient(testConfig);

describe("accounts service", (t) => {
  let accountIds: string[] = [];

  test("lists accounts", async () => {
    const LIMIT = 100;
    const MAX_PAGES = 1;
    const result = await zoey.accounts.list({
      limit: LIMIT,
      maxPages: MAX_PAGES,
    });

    assertisOk(result);
    assert.isAtMost(result.data.length, LIMIT * MAX_PAGES);

    const first = result.data[0];
    assert.exists(first);

    accountIds = result.data.map((a) => a.id);
  }, 30_000);

  test("retrieves account by id ", async () => {
    const id = accountIds[0]!;
    const result = await zoey.accounts.retrieve(id);

    assertisOk(result);
  });

  describe("accounts service - individual account retrieval", async () => {
    const result = await zoey.accounts.list({ limit: 100, maxPages: 1 });
    assertisOk(result);

    const accountIds = result.data.map((a) => a.id);
    const length = accountIds.length;

    let randomIdsToUse: string[] = [];

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * (length - 1));
      const id = accountIds[randomIndex];
      if (!id) throw new Error("Missing ID at index: " + randomIndex);
      randomIdsToUse.push(id);
    }

    for (const id of randomIdsToUse) {
      test("retrieve account by ID: " + id, async () => {
        const result = await zoey.accounts.retrieve(id);

        assertisOk(result);
      });
    }
  }, 30_000);
});
