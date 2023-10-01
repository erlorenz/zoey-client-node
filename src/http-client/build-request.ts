import { Request, RequestInit } from "node-fetch";
import { MakeRequestOptions } from "./types.js";
import OAuth from "oauth-1.0a";
import { ZoeyClientConfig } from "../index.js";

export function buildRequest({
  opts: { path, method = "GET", queryParams, body, timeout },
  baseUrl,
  oauth,
  auth,
  defaultTimeout,
}: {
  opts: MakeRequestOptions;
  baseUrl: string;
  oauth: OAuth;
  auth: ZoeyClientConfig["auth"];
  defaultTimeout: number;
}): Request {
  const url = new URL(baseUrl + path);
  const selectedTimeout = timeout || defaultTimeout;

  if (queryParams) {
    const paramsString = new URLSearchParams(queryParams).toString();
    url.search = paramsString;
  }

  const { Authorization } = oauth.toHeader(
    oauth.authorize(
      { url: url.toString(), method: method ?? "GET", data: null },
      {
        key: auth.accessToken,
        secret: auth.tokenSecret,
      }
    )
  );

  const headers: RequestInit["headers"] = {
    Authorization,
  };

  const hasBody =
    (method === "PUT" || method === "PATCH" || method === "POST") &&
    body !== undefined;

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  const options: RequestInit = {
    method,
    headers,
    body: hasBody ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(selectedTimeout),
  };

  return new Request(url.toString(), options);
}
