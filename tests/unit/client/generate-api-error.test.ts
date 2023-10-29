import { describe, assert, test } from "vitest";
import { generateApiError } from "../../../src/errors/generate-api-error.js";
import { ZoeyError } from "../../../src/index.js";

const badJSONResponse = new Response("<h1>NOT JSON</h1>", {
  status: 200,
});

const invalidReturnBodyResponse = new Response(
  JSON.stringify({
    error: "this is valid json but not the right format",
  }),
  {
    status: 401,
  }
);

const validBody = JSON.stringify({
  messages: {
    error: [{ message: "Bad request", code: 400 }],
  },
});

const errorMap: Map<number, string> = new Map([
  [400, "bad_request"],
  [401, "authentication"],
  [402, "api_error"],
  [403, "permission"],
  [404, "not_found"],
  [429, "too_many_requests"],
  [500, "api_error"],
  [505, "api_error"],
]);

describe("generate API error", () => {
  test("returns ZoeyError with type: 'bad_json' on unparseable JSON", async () => {
    const err = await generateApiError("/test", badJSONResponse);

    assert.instanceOf(err, ZoeyError);
    assert.strictEqual(err.type, "bad_json");
  });

  test("returns ZoeyError with type: 'invalid_return_type' when response does not match error schema", async () => {
    const err = await generateApiError("/test", invalidReturnBodyResponse);

    assert.instanceOf(err, ZoeyError);
    assert.strictEqual(err.type, "invalid_return_type");
  });

  testErrorMap();
});

// Test for the type by status code
function testErrorMap() {
  for (const [status, type] of errorMap) {
    test(`returns ZoeyError with type: '${type}' on status ${status}`, async () => {
      const response = new Response(validBody, { status });
      const err = await generateApiError("/test", response);

      assert.instanceOf(err, ZoeyError);
      assert.strictEqual(err.type, type);
    });
  }
}
