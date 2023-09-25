import { z } from "zod";
import {
  HttpClient,
  MakeAndParseRequestResult,
  MakeRequestOptions,
  MakeRequestResult,
} from "./types.js";
import OAuth from "oauth-1.0a";
import { createOAuth } from "./oauth.js";
import fetch, { Request } from "node-fetch";
import { ZoeyError } from "../errors/zoey-error.js";
import { ApiError, apiErrorResponseSchema } from "../errors/api-error.js";
import { ZoeyClientConfig } from "../zoey/types.js";

export class Client implements HttpClient {
  #auth: ZoeyClientConfig["auth"];
  #timeout: number;
  #baseUrl: string;
  #oauth: OAuth;

  constructor(config: ZoeyClientConfig) {
    this.#auth = config.auth;
    this.#timeout = config.timeout || 15000;
    this.#baseUrl = config.baseUrl;
    this.#oauth = createOAuth(
      config.auth.consumerKey,
      config.auth.consumerSecret
    );
  }

  async makeRequest(opts: MakeRequestOptions): Promise<MakeRequestResult> {
    const url = new URL(this.#baseUrl + "/api/rest" + opts.path);

    if (opts.queryParams) {
      const paramsString = new URLSearchParams(opts.queryParams).toString();
      url.search = paramsString;
    }

    const authHeader = this.#oauth.toHeader(
      this.#oauth.authorize(
        { url: url.toString(), method: opts.method ?? "GET", data: null },
        {
          key: this.#auth.accessToken,
          secret: this.#auth.tokenSecret,
        }
      )
    );

    const request = new Request(url.toString(), {
      method: opts.method ?? "GET",
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    });

    try {
      const res = await fetch(request);
      let json: unknown;

      try {
        json = await res.json();
      } catch (err) {
        return {
          ok: false,
          error: new ZoeyError({
            path: request.url,
            message: `Server responded with status ${res.status} but could not parse JSON.`,
            type: "unknown",
          }),
        };
      }

      if (!res.ok) {
        const parsed = apiErrorResponseSchema.safeParse(json);

        if (parsed.success) {
          return {
            ok: false,
            error: new ApiError({
              statusCode: res.status,
              path: request.url,
              message:
                "Zoey API error: " + parsed.data.messages.error[0].message,
              responseBody: parsed.data,
            }),
          };
        }

        const unknownJson = JSON.stringify(parsed.error);

        return {
          ok: false,
          error: new ZoeyError({
            path: request.url,
            message: `Zoey API returned error response with status ${res.status} but format was not correct: ${unknownJson}`,
            type: "invalid_return_type",
          }),
        };
      }

      // TODO: remove unknown when @types/node has fetch in it
      return { ok: true, data: json };
    } catch (err) {
      if (err instanceof Error) {
        return {
          ok: false,
          error: new ZoeyError({
            message: err.message,
            path: request.url,
            type: "network",
            cause: err,
          }),
        };
      }

      return {
        ok: false,
        error: new ZoeyError({
          message: "error: " + JSON.stringify(err),
          path: request.url,
          type: "unknown",
        }),
      };
    }
  }

  async makeAndParseRequest(
    opts: MakeRequestOptions & { schema: z.ZodSchema }
  ): Promise<MakeAndParseRequestResult<z.infer<typeof opts.schema>>> {
    const result = await this.makeRequest({
      path: opts.path,
      method: opts.method,
      body: opts.body,
      queryParams: opts.queryParams,
    });
    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const parseResult = opts.schema.safeParse(result.data);
    if (!parseResult.success) {
      return {
        ok: false,
        error: new ZoeyError({
          message: JSON.stringify(parseResult.error.flatten),
          path: opts.path,
          type: "invalid_return_type",
          cause: parseResult.error,
        }),
      };
    }

    return {
      ok: true,
      data: parseResult.data,
    };
  }

  async makePaginatedRequest(
    opts: MakeRequestOptions & {
      schema: z.ZodArray<z.ZodTypeAny>;
      limit: number;
      maxPages?: number;
    }
  ): Promise<MakeAndParseRequestResult<z.infer<typeof opts.schema>>> {
    const queryParams = { ...opts.queryParams };
    queryParams.limit = opts.limit.toString();

    let more = true;
    let page = 1;

    const list: z.infer<typeof opts.schema> = [];

    while (more) {
      queryParams.page = page.toString();

      const result = await this.makeAndParseRequest({
        path: opts.path,
        schema: opts.schema,
        queryParams,
      });

      if (!result.ok) {
        return {
          ok: false,
          error: result.error,
        };
      }

      list.push(...result.data);
      page++;

      if (result.data.length < opts.limit) {
        more = false;
      }

      if (opts.maxPages && page > opts.maxPages) {
        more = false;
      }
    }

    return {
      ok: true,
      data: list,
    };
  }
}
