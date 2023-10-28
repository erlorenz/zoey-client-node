import { describe, expect, it } from "vitest";
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

describe("generate API error", () => {
  it("returns ZoeyError with type: 'bad_json' on unparseable JSON", async () => {
    const err = await generateApiError("/test", badJSONResponse);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("bad_json");
  });

  it("returns ZoeyError with type: 'invalid_return_type' when response does not match error schema", async () => {
    const err = await generateApiError("/test", invalidReturnBodyResponse);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("invalid_return_type");
  });

  it("returns ZoeyError with type: 'bad_request' on status 400", async () => {
    const response = new Response(validBody, { status: 400 });

    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("bad_request");
  });

  it("returns ZoeyError with type: 'authentication' on status 401", async () => {
    const response = new Response(validBody, { status: 401 });

    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("authentication");
  });

  it("returns ZoeyError with type: 'permission' on status 403", async () => {
    const response = new Response(validBody, { status: 403 });

    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("permission");
  });

  it("returns ZoeyError with type: 'not_found' on status 404", async () => {
    const response = new Response(validBody, { status: 404 });

    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("not_found");
  });

  it("returns ZoeyError with type: 'too_many_requests' on status 429", async () => {
    const response = new Response(validBody, { status: 429 });

    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("too_many_requests");
  });

  it("returns ZoeyError with type: 'api_error' on status 500", async () => {
    const response = new Response(validBody, { status: 500 });

    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("api_error");
  });

  it("returns ZoeyError with type: 'api_error' on other statuses", async () => {
    const response402 = new Response(validBody, { status: 402 });
    const response505 = new Response(validBody, { status: 505 });

    const err402 = await generateApiError("/test", response402);
    const err505 = await generateApiError("/test", response505);

    expect(err402).to.be.instanceOf(ZoeyError);
    expect(err402).to.have.property("type").that.equals("api_error");

    expect(err505).to.be.instanceOf(ZoeyError);
    expect(err505).to.have.property("type").that.equals("api_error");
  });
});
