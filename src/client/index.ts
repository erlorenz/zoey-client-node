import { z } from "zod";
import {
  ClientWithAuth,
  ErrorType,
  MakeAndParseRequestResult,
  MakeRequestOptions,
  MakeRequestResult,
  ZoeyError,
  zoeyErrorSchema,
} from "./types";
import { Config } from "../../dist";
import OAuth from "oauth-1.0a";
import { createOAuth } from "./oauth";
import fetch, { Request } from "node-fetch";

export class Client implements ClientWithAuth {
  #config: Config;
  #basePath: string;
  #oauth: OAuth;

  constructor(config: Config) {
    this.#validateConfig(config);
    this.#config = config;
    this.#basePath = config.basePath;
    this.#oauth = createOAuth(
      config.auth.consumerKey,
      config.auth.consumerSecret
    );
  }

  #validateConfig(cfg: Config) {
    const missing: string[] = [];
    for (let [k, v] of Object.entries(cfg)) {
      if (!v) missing.push(k);
    }

    if (missing.length)
      throw new Error(`empty config values: ${missing.join(", ")}`);
  }

  async makeRequest(opts: MakeRequestOptions): Promise<MakeRequestResult> {
    const url = new URL(this.#basePath + "/api/rest" + opts.path);

    if (opts.queryParams) {
      for (let [k, v] of Object.entries(opts.queryParams)) {
        url.searchParams.append(k, v);
      }
    }

    const authHeader = this.#oauth.toHeader(
      this.#oauth.authorize(
        { url: url.toString(), method: opts.method ?? "GET", data: null },
        {
          key: this.#config.auth.accessToken,
          secret: this.#config.auth.tokenSecret,
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

    console.log(`Making request: ${JSON.stringify(request)}`);
    try {
      const res = await fetch(request);

      if (!res.ok) {
        let errorMessage: string;
        let errorType: ErrorType;

        const data = await res.json();
        const parsed = zoeyErrorSchema.safeParse(data);

        if (!parsed.success) {
          errorMessage = "error: " + JSON.stringify(data);
          errorType = "unknown";
        } else {
          errorMessage = parsed.data.messages.error[0].message;
          errorType = "api";
        }

        return {
          ok: false,
          error: new ZoeyError({
            code: res.status,
            message: errorMessage,
            path: request.url,
            type: errorType,
          }),
        };
      }

      const data: unknown = await res.json();
      return { ok: true, data };
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);

        return {
          ok: false,
          error: new ZoeyError({
            code: 500,
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
          code: 500,
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
          code: 500,
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
      schema: z.ZodSchema;
      limit: number;
      maxPages?: number;
    }
  ): Promise<MakeAndParseRequestResult<z.infer<typeof opts.schema>>> {
    const queryParams = { ...opts.queryParams };
    queryParams.limit = opts.limit.toString();

    let more = true;
    let page = 1;

    const list: z.infer<typeof opts.schema>[] = [];

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
