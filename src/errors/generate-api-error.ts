import { z } from "zod";
import { Response } from "node-fetch";
import { ZoeyError } from "./zoey-error.js";

const apiErrorResponseSchema = z.object({
  messages: z.object({
    error: z
      .array(z.object({ code: z.number(), message: z.string() }))
      .nonempty(),
  }),
});

export async function generateApiError(
  path: string,
  response: Response
): Promise<ZoeyError> {
  const statusCode = response.status;
  let unknownJson: unknown;

  try {
    unknownJson = await response.json();
  } catch (err: unknown) {
    return new ZoeyError({
      type: "bad_json",
      message: "Could not parse json",
      path,
      statusCode,
    });
  }

  const parsed = apiErrorResponseSchema.safeParse(unknownJson);

  if (!parsed.success) {
    return new ZoeyError({
      type: "invalid_return_type",
      message:
        "The error return type was not the expected format: " +
        JSON.stringify(unknownJson),
      path,
      responseBody: unknownJson,
      statusCode,
    });
  }

  const responseBody = parsed.data;
  const message = responseBody.messages.error[0]?.message;

  switch (statusCode) {
    case 400:
      return new ZoeyError({
        type: "bad_request",
        statusCode,
        message,
        path,
        responseBody,
      });
    case 401:
      return new ZoeyError({
        type: "authentication",
        statusCode,
        message,
        path,
        responseBody,
      });
    case 403:
      return new ZoeyError({
        type: "permission",
        statusCode,
        message,
        path,
        responseBody,
      });
    case 404:
      return new ZoeyError({
        type: "not_found",
        statusCode,
        message,
        path,
        responseBody,
      });
    case 429:
      return new ZoeyError({
        type: "too_many_requests",
        statusCode,
        message,
        path,
        responseBody,
      });
    case 500:
      return new ZoeyError({
        type: "api_error",
        statusCode,
        message,
        path,
        responseBody,
      });
    default:
      return new ZoeyError({
        message,
        path,
        statusCode,
        type: "api_error",
        responseBody,
      });
  }
}
