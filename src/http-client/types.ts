import { z } from "zod";
import { ZoeyError } from "../errors/zoey-error.js";
import { ZoeyQueryParams } from "../types.js";

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
};

export type MakeRequestOptions = {
  path: string;
  method?: HttpMethod;
  body?: JSONValue;
  queryParams?: ZoeyQueryParams;
};

export type MakeRequestResult =
  | { ok: true; data: unknown }
  | { ok: false; error: ZoeyError };

export type MakeAndParseRequestResult<Tdata> =
  | { ok: true; data: Tdata }
  | { ok: false; error: ZoeyError };

export type MakeRequestFunction = (
  options: MakeRequestOptions
) => Promise<Result<unknown, ZoeyError>>;

export type MakeAndParseRequestFunction = <Tschema extends z.ZodSchema>(
  options: MakeRequestOptions & { schema: Tschema }
) => Promise<Result<z.infer<Tschema>, ZoeyError>>;

export type MakePaginatedRequestFunction = <
  Tschema extends z.ZodArray<z.ZodTypeAny>
>(
  options: MakeRequestOptions & {
    schema: Tschema;
    limit: number;
    maxPages?: number;
  }
) => ReturnType<MakeAndParseRequestFunction>;

type Result<T, E extends Error> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: E;
    };
