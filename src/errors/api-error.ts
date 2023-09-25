import { z } from "zod";
import { ZoeyError } from "./zoey-error.js";

export class ApiError extends ZoeyError {
  statusCode: number;
  responseBody?: ApiErrorResponse;

  constructor({
    statusCode,
    message,
    responseBody,
    path,
  }: {
    statusCode: number;
    message: string;
    responseBody?: ApiErrorResponse;
    path: string;
  }) {
    super({ type: "api", message, path });
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}

export const apiErrorResponseSchema = z.object({
  messages: z.object({
    error: z.array(z.object({ code: z.number(), message: z.string() })),
  }),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
