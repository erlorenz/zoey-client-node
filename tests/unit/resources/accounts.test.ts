import { describe, test, assert, vi, afterEach } from "vitest";
import { mockZoey as zoey } from "../../../mocks/http-client.js";
import type { CreateAccountRequestBody } from "../../../src/index.js";

describe("accounts service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("has the correct resource path", async () => {
    const path = zoey.accounts.resourcePath;
    assert.strictEqual(path, "/companyAccounts");
  });

  test("list is calling correct path", async () => {
    const spy = vi.spyOn(zoey.client, "makeRequest");
    await zoey.accounts.list({});

    const arg1 = spy.mock.lastCall![0];
    const path = arg1.path;

    assert.strictEqual(path, "/companyAccounts/list");
  });

  test("list makes request with default limit of 10 if no limit", async () => {
    const spy = vi.spyOn(zoey.client, "makeRequest");

    await zoey.accounts.list({});

    const arg1 = spy.mock.lastCall![0];
    const params = arg1.queryParams!;
    assert.exists(params);
    assert.strictEqual(params.limit, "10");
  });

  test("list makes request with limit of 20", async () => {
    const spy = vi.spyOn(zoey.client, "makeRequest");

    await zoey.accounts.list({ limit: 20 });

    const arg1 = spy.mock.lastCall![0];
    const params = arg1.queryParams!;
    assert.exists(params);
    assert.strictEqual(params.limit, "20");
  });

  test("retrieve makes request with id in params", async () => {
    const spy = vi.spyOn(zoey.client, "makeRequest");

    await zoey.accounts.retrieve("testId");

    const arg1 = spy.mock.lastCall![0];
    const params = arg1.queryParams!;
    assert.exists(params);
    assert.strictEqual(params.id, "testId");
  });

  test("create makes POST request with body ", async () => {
    const spy = vi.spyOn(zoey.client, "makeRequest");
    const body = { companyData: {} } as CreateAccountRequestBody;

    await zoey.accounts.create(body);

    const arg1 = spy.mock.lastCall![0];
    assert.exists(arg1);
    assert.strictEqual(arg1.body, body);
    assert.strictEqual(arg1.method, "POST");
  });
});
