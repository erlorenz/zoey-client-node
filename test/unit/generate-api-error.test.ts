import { Response } from "node-fetch";
import { describe, expect, it } from "vitest";
import { generateApiError } from "../../src/errors/generate-api-error.js";
import {
  AuthenticationError,
  BadJsonError,
  BadRequestError,
  InvalidReturnTypeError,
  NotFoundError,
  PermissionError,
  RateLimitError,
  ApiError,
} from "../../src/errors/errors.js";
import { ZoeyError } from "../../src/errors/zoey-error.js";

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
  it("returns BadJsonError on unparseable JSON", async () => {
    const err = await generateApiError("/test", badJSONResponse);
    expect(err).to.be.instanceOf(BadJsonError);
    expect(err).to.have.property("type").that.equals("bad_json");
  });

  it("returns InvalidReturnTypeError on unparseable JSON", async () => {
    const err = await generateApiError("/test", invalidReturnBodyResponse);
    expect(err).to.be.instanceOf(InvalidReturnTypeError);
    expect(err).to.have.property("type").that.equals("invalid_return_type");
  });

  it("returns BadRequestError on status 400", async () => {
    const response = new Response(validBody, { status: 400 });
    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(BadRequestError);
    expect(err).to.have.property("type").that.equals("bad_request");
  });

  it("returns AuthenticationError on status 401", async () => {
    const response = new Response(validBody, { status: 401 });
    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(AuthenticationError);
    expect(err).to.have.property("type").that.equals("authentication");
  });

  it("returns PermissionError on status 403", async () => {
    const response = new Response(validBody, { status: 403 });
    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(PermissionError);
    expect(err).to.have.property("type").that.equals("permission");
  });

  it("returns NotFoundError on status 404", async () => {
    const response = new Response(validBody, { status: 404 });
    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(NotFoundError);
    expect(err).to.have.property("type").that.equals("not_found");
  });

  it("returns RateLimitError on status 429", async () => {
    const response = new Response(validBody, { status: 429 });
    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(RateLimitError);
    expect(err).to.have.property("type").that.equals("too_many_requests");
  });

  it("returns ApiError on status 500", async () => {
    const response = new Response(validBody, { status: 500 });
    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(ApiError);
    expect(err).to.have.property("type").that.equals("api_error");
  });

  it("returns ZoeyError with api_error type on other status", async () => {
    const response = new Response(validBody, { status: 402 });
    const err = await generateApiError("/test", response);

    expect(err).to.be.instanceOf(ZoeyError);
    expect(err).to.have.property("type").that.equals("api_error");
  });
});
