import { z } from "zod";
import { QueryParams } from "../zoey/types";

export type HttpMethod = "GET" | "PATCH" | "POST" | "PUT" | "DELETE";

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export type Config = {
  auth: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    tokenSecret: string;
  };
  basePath: string;
};

export const zoeyErrorSchema = z.object({
  messages: z.object({
    error: z.array(z.object({ code: z.number(), message: z.string() })),
  }),
});

export type ErrorType = "api" | "network" | "unknown" | "invalid_return_type";

export class ZoeyError extends Error {
  code: number;
  path: string;
  type: ErrorType;

  constructor({
    code,
    message,
    path,
    type,
    cause,
  }: {
    code: number;
    message: string;
    path: string;
    type: ErrorType;
    cause?: Error;
  }) {
    super(message, { cause });
    this.code = code;
    this.path = path;
    this.type = type;
  }
}

export type ClientWithAuth = {
  makeRequest: MakeRequestFunction;
  makeAndParseRequest: MakeAndParseRequestFunction;
  makePaginatedRequest: MakePaginatedRequestFunction;
};

export type MakeRequestOptions = {
  path: string;
  method?: HttpMethod;
  body?: JSONValue;
  queryParams?: QueryParams;
};

export type MakeRequestResult =
  | { ok: true; data: unknown }
  | { ok: false; error: ZoeyError };

export type MakeAndParseRequestResult<Tdata> =
  | { ok: true; data: Tdata }
  | { ok: false; error: ZoeyError };

export type MakeRequestFunction = (
  options: MakeRequestOptions
) => Promise<MakeRequestResult>;

export type MakeAndParseRequestFunction = <Tschema extends z.ZodSchema>(
  options: MakeRequestOptions & { schema: Tschema }
) => Promise<MakeAndParseRequestResult<z.infer<Tschema>>>;

export type MakePaginatedRequestFunction = <Tschema extends z.ZodSchema>(
  options: MakeRequestOptions & {
    schema: Tschema;
    limit: number;
    maxPages?: number;
  }
) => Promise<MakeAndParseRequestResult<z.infer<Tschema>>>;
