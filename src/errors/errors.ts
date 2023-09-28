import { ZoeyError } from "./zoey-error.js";

export class ConfigurationError extends ZoeyError {
  constructor(message: string) {
    super({ message, type: "configuration" });
  }
}

export class ConnectionError extends ZoeyError {
  constructor(message: string, path: string, cause: Error) {
    super({ message, type: "connection", path, cause });
  }
}

export class BadJsonError extends ZoeyError {
  constructor(message: string, path: string, statusCode: number) {
    super({ message, type: "bad_json", path, statusCode });
  }
}

export class InvalidReturnTypeError extends ZoeyError {
  constructor({
    message,
    path,
    responseBody,
    statusCode,
  }: {
    message: string;
    path: string;
    responseBody: unknown;
    statusCode: number;
  }) {
    super({
      message,
      type: "invalid_return_type",
      path,
      responseBody,
      statusCode,
    });
  }
}

export class UnknownError extends ZoeyError {
  constructor({
    message,
    path,
    cause,
  }: {
    message: string;
    path?: string;
    cause?: Error;
  }) {
    super({ message, type: "unknown", path, cause });
  }
}

export class BadRequestError extends ZoeyError {
  constructor(message: string, path: string, responseBody: unknown) {
    super({
      message,
      responseBody,
      statusCode: 400,
      type: "bad_request",
      path,
    });
  }
}

export class AuthenticationError extends ZoeyError {
  constructor(message: string, path: string, responseBody: unknown) {
    super({
      message,
      responseBody,
      statusCode: 401,
      type: "authentication",
      path,
    });
  }
}

export class PermissionError extends ZoeyError {
  constructor(message: string, path: string, responseBody: unknown) {
    super({
      message,
      responseBody,
      statusCode: 403,
      type: "permission",
      path,
    });
  }
}

export class NotFoundError extends ZoeyError {
  constructor(message: string, path: string, responseBody: unknown) {
    super({ message, responseBody, statusCode: 404, type: "not_found", path });
  }
}

export class RateLimitError extends ZoeyError {
  constructor(message: string, path: string, responseBody: unknown) {
    super({
      message,
      responseBody,
      statusCode: 429,
      type: "too_many_requests",
      path,
    });
  }
}

export class ApiError extends ZoeyError {
  constructor(message: string, path: string, responseBody: unknown) {
    super({
      message,
      responseBody,
      statusCode: 500,
      type: "api_error",
      path,
    });
  }
}
