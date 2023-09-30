import { z } from "zod";
import {
  HttpClient,
  MakeAndParseRequestResult,
  MakeRequestOptions,
  MakeRequestResult,
} from "./types.js";
import OAuth from "oauth-1.0a";
import { createOAuth } from "./oauth.js";
import fetch from "node-fetch";
import { ZoeyError } from "../errors/zoey-error.js";
import { generateApiError } from "../errors/generate-api-error.js";
import { buildRequest } from "./build-request.js";
import { ZoeyClientConfig } from "../index.js";

export class Client implements HttpClient {
  #auth: ZoeyClientConfig["auth"];
  #timeout: number;
  #baseUrl: string;
  #oauth: OAuth;

  constructor(config: ZoeyClientConfig) {
    this.#auth = config.auth;
    this.#timeout = config.timeout || 15_000;
    this.#baseUrl = config.baseUrl;
    this.#oauth = createOAuth(
      config.auth.consumerKey,
      config.auth.consumerSecret
    );
  }

  async makeRequest(opts: MakeRequestOptions): Promise<MakeRequestResult> {
    const request = buildRequest({
      opts: opts,
      baseUrl: this.#baseUrl,
      oauth: this.#oauth,
      auth: this.#auth,
      timeout: this.#timeout,
    });

    try {
      const res = await fetch(request);

      if (!res.ok) {
        const error = await generateApiError(request.url, res);
        return {
          ok: false,
          error,
        };
      }

      if (res.status === 204) {
        return { ok: true, data: null };
      }

      try {
        const json = await res.json();
        return { ok: true, data: json };
      } catch (err) {
        return {
          ok: false,
          error: new ZoeyError({
            path: request.url,
            message: `Server responded with status ${res.status} but could not parse JSON.`,
            type: "bad_json",
          }),
        };
      }

      // TODO: remove unknown when @types/node has fetch in it
    } catch (err) {
      if (err instanceof Error) {
        return {
          ok: false,
          error: new ZoeyError({
            type: "connection",
            message: err.message,
            path: request.url,
            cause: err,
          }),
        };
      }

      return {
        ok: false,
        error: new ZoeyError({
          type: "unknown",
          message: "Not instance of Error in catch: " + JSON.stringify(err),
          path: request.url,
          cause: new Error(JSON.stringify(err)),
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
          type: "invalid_return_type",
          message: parseResult.error.message,
          path: opts.path,
          responseBody: result.data,
          statusCode: 200,
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
