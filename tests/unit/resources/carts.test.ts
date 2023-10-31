import { describe, test, assert, vi, afterEach } from "vitest";
import { mockZoey as zoey } from "../../../mocks/http-client.js";

describe("carts service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("has the correct resource path", async () => {
    const path = zoey.carts.resourcePath;
    assert.strictEqual(path, "/checkout2");
  });

  test("create makes POST request", async () => {
    const spy = vi.spyOn(zoey.client, "makeRequest");

    await zoey.carts.create();

    const arg1 = spy.mock.lastCall![0];
    assert.exists(arg1);
    assert.notExists(arg1.body);
    assert.strictEqual(arg1.method, "POST");
  });

  test("create makes POST request with body", async () => {
    const spy = vi.spyOn(zoey.client, "makeRequest");
    const cartId = 10;
    const products = [{ product_id: 100, qty: 100 }];

    await zoey.carts.addProducts(cartId, products);

    const arg1 = spy.mock.lastCall![0];
    assert.exists(arg1);
    assert.deepStrictEqual(arg1.body, { cartId, products });
    assert.strictEqual(arg1.method, "POST");
  });
});
