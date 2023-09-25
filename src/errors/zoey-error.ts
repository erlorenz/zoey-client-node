export type ErrorType =
  | "api"
  | "network"
  | "unknown"
  | "invalid_return_type"
  | "config";

export class ZoeyError extends Error {
  path: string;
  type: ErrorType;

  constructor({
    type,
    message,
    path,
    cause,
  }: {
    type: ErrorType;
    message: string;
    path: string;
    cause?: Error;
  }) {
    super(message, { cause });
    this.type = type;
    this.path = path;
  }
}
