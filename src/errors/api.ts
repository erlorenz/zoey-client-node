import { z } from "zod";
import { ZoeyError } from "./zoey-error";

export class ApiError extends ZoeyError {
  statusCode: number;
  errors?: ApiErrorList;

  constructor({
    statusCode,
    message,
    errors,
    path,
  }: {
    statusCode: number;
    message: string;
    errors?: ApiErrorList;
    path: string;
  }) {
    super({ type: "api", message, path });
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const apiErrorResponseSchema = z.object({
  messages: z.object({
    error: z.array(z.object({ code: z.number(), message: z.string() })),
  }),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
type ApiErrorList = ApiErrorResponse["messages"]["error"];
