import { describe, test, assert } from "vitest";
import { assertisOk } from "../helpers.js";
import { ZoeyClient } from "../../src/index.js";
import { testConfig } from "./test-config.js";
import { z } from "zod";

const zoey = new ZoeyClient(testConfig);

describe("products service", () => {
  test("lists products with no filters", async () => {
    const result = await zoey.products.list({});

    console.log(result);
    assertisOk(result);
    assert.isArray(result.data);
    assert.isAtLeast(result.data.length, 100);
  });

  test("lists products with limit and pages", async () => {
    const LIMIT = 10;
    const MAX_PAGES = 2;
    const result = await zoey.products.list({
      limit: LIMIT,
      maxPages: MAX_PAGES,
    });

    assertisOk(result);
    assert.isAtMost(result.data.length, LIMIT * MAX_PAGES);
  });

  test("lists products with attribute filter", async () => {
    const queryParams = {
      "filter[0][attribute]": "sample_approved",
      "filter[0][eq]": "1",
    };
    const attributes = z.object({ sample_approved: z.enum(["1", "0"]) });

    const result = await zoey.products.list({ queryParams, attributes });

    assertisOk(result);
    const first = result.data[0]!;

    assert.exists(first);
    assert.property(first, "sample_approved");
  });
});
