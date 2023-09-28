import { z } from "zod";
import { Response } from "node-fetch";
import { ZoeyError } from "./zoey-error.js";
import {
  ApiError,
  AuthenticationError,
  BadJsonError,
  BadRequestError,
  InvalidReturnTypeError,
  NotFoundError,
  PermissionError,
  RateLimitError,
} from "./errors.js";

export const apiErrorResponseSchema = z.object({
  messages: z.object({
    error: z
      .array(z.object({ code: z.number(), message: z.string() }))
      .nonempty(),
  }),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export async function generateApiError(
  path: string,
  response: Response
): Promise<ZoeyError> {
  const statusCode = response.status;
  let unknownJson: unknown;

  try {
    unknownJson = await response.json();
  } catch (err: unknown) {
    return new BadJsonError("Could not parse json", path, statusCode);
  }

  const parsed = apiErrorResponseSchema.safeParse(unknownJson);

  if (!parsed.success) {
    return new InvalidReturnTypeError({
      message:
        "The error return type was not the expected format: " +
        JSON.stringify(unknownJson),
      path,
      responseBody: unknownJson,
      statusCode,
    });
  }

  const apiResponse = parsed.data;
  const message = apiResponse.messages.error[0]?.message;

  switch (statusCode) {
    case 400:
      return new BadRequestError(message, path, apiResponse);
    case 401:
      return new AuthenticationError(message, path, apiResponse);
    case 403:
      return new PermissionError(message, path, apiResponse);
    case 404:
      return new NotFoundError(message, path, apiResponse);
    case 429:
      return new RateLimitError(message, path, apiResponse);
    case 500:
      return new ApiError(message, path, apiResponse);
    default:
      return new ZoeyError({
        message,
        path,
        statusCode,
        type: "api_error",
        responseBody: apiResponse,
      });
  }
}
