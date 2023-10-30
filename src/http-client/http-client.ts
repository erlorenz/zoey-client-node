import { z } from "zod";
import type {
  HttpClient,
  MakeAndParseRequestResult,
  MakeRequestOptions,
  MakeRequestResult,
} from "./types.js";
import OAuth from "oauth-1.0a";
import { createOAuth } from "./oauth.js";
import { ZoeyError } from "../errors/zoey-error.js";
import { generateApiError } from "../errors/generate-api-error.js";
import { buildRequest } from "./build-request.js";
import type { ZoeyClientConfig } from "../index.js";
import { ensureError } from "../errors/ensure-error.js";

export class Client implements HttpClient {
  #auth: ZoeyClientConfig["auth"];
  #baseUrl: string;
  #oauth: OAuth;
  #defaultTimeout: number;

  constructor(config: ZoeyClientConfig) {
    this.#auth = config.auth;
    this.#defaultTimeout = config.timeout || 15_000;
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
      defaultTimeout: this.#defaultTimeout,
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

      const isJson = !!res.headers
        .get("Content-Type")
        ?.includes("application/json");

      if (res.status === 204 || !isJson) {
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
    } catch (err) {
      const error = ensureError(err);
      if (error.name === "TimeoutError") {
        return {
          ok: false,
          error: new ZoeyError({
            type: "timeout",
            message: error.message,
            path: request.url,
            cause: error,
          }),
        };
      }

      // Connection error
      return {
        ok: false,
        error: new ZoeyError({
          type: "connection",
          message: error.message,
          path: request.url,
          cause: error,
        }),
      };
    }
  }

  async makeAndParseRequest(
    opts: MakeRequestOptions & { schema: z.ZodSchema }
  ): Promise<MakeAndParseRequestResult<z.infer<typeof opts.schema>>> {
    const { schema, ...rest } = opts;
    const result = await this.makeRequest(rest);
    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const parseResult = schema.safeParse(result.data);
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
      schema: z.ZodArray<z.ZodSchema>;
      limit?: number;
      maxPages?: number;
    }
  ): Promise<MakeAndParseRequestResult<z.infer<typeof opts.schema>>> {
    const { queryParams = {}, limit = 10, maxPages } = opts;
    queryParams.limit = limit.toString();

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

      if (result.data.length < limit) {
        more = false;
      }

      if (maxPages && page > maxPages) {
        more = false;
      }
    }

    return {
      ok: true,
      data: list,
    };
  }

  getDefaultTimeout() {
    return this.#defaultTimeout;
  }
}
