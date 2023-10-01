export type ErrorType =
  | "bad_request"
  | "api_error"
  | "not_found"
  | "authentication"
  | "permission"
  | "connection"
  | "timeout"
  | "unknown"
  | "invalid_return_type"
  | "bad_json"
  | "too_many_requests"
  | "configuration";

export class ZoeyError extends Error {
  path?: string;
  type: ErrorType;
  statusCode?: number;
  responseBody?: unknown;

  constructor({
    type,
    message,
    path,
    cause,
    statusCode,
    responseBody,
  }: {
    type: ErrorType;
    message: string;
    path?: string;
    cause?: Error;
    statusCode?: number;
    responseBody?: unknown;
  }) {
    super(message, { cause });
    this.name = this.constructor.name;
    this.type = type;
    this.path = path;
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}
