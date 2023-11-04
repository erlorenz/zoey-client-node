import { z } from "zod";
import { ZoeyError } from "../errors/zoey-error.js";
import type { ZoeyQueryParams } from "../types.js";

export type HttpMethod = "GET" | "PATCH" | "POST" | "PUT" | "DELETE";

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export const zoeyErrorSchema = z.object({
  messages: z.object({
    error: z.array(z.object({ code: z.number(), message: z.string() })),
  }),
});

export type HttpClient = {
  makeRequest: MakeRequestFunction;
  makeAndParseRequest: MakeAndParseRequestFunction;
  makePaginatedRequest: MakePaginatedRequestFunction;
  getDefaultTimeout: () => number;
};

export type MakeRequestOptions = {
  path: string;
  method?: HttpMethod;
  body?: JSONValue;
  queryParams?: ZoeyQueryParams;
  timeout?: number;
};

export type MakeRequestResult =
  | { ok: true; data: unknown }
  | { ok: false; error: ZoeyError };

export type MakeAndParseRequestResult<Tdata> =
  | { ok: true; data: Tdata }
  | { ok: false; error: ZoeyError };

export type MakeRequestFunction = (
  options: MakeRequestOptions
) => AsyncResult<unknown, ZoeyError>;

export type MakeAndParseRequestFunction = <Tschema extends z.ZodSchema>(
  options: MakeRequestOptions & { schema: Tschema }
) => AsyncResult<z.infer<Tschema>, ZoeyError>;

export type MakePaginatedRequestFunction = <
  Tschema extends z.ZodArray<z.ZodSchema>
>(
  options: MakeRequestOptions & {
    schema: Tschema;
    limit?: number;
    maxPages?: number;
    isMap?: boolean;
  }
) => AsyncResult<z.infer<Tschema>, ZoeyError>;

export type AsyncResult<T, E extends Error> = Promise<Result<T, E>>;

export type Result<T, E extends Error> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: E;
    };
