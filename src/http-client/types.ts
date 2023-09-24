import { z } from "zod";
import { QueryParams } from "../zoey/types";
import { ZoeyError } from "../errors/zoey-error";

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
  timeout?: string;
};

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

export type MakePaginatedRequestFunction = <
  Tschema extends z.ZodArray<z.ZodTypeAny>
>(
  options: MakeRequestOptions & {
    schema: Tschema;
    limit: number;
    maxPages?: number;
  }
) => Promise<MakeAndParseRequestResult<z.infer<Tschema>>>;
