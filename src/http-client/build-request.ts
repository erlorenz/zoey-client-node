import type { MakeRequestOptions } from "./types.js";
import OAuth from "oauth-1.0a";
import type { ZoeyClientConfig } from "../index.js";

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
      { url: url.toString(), method, data: null },
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

  body = JSON.stringify(body);
  const signal = AbortSignal.timeout(selectedTimeout);

  const options: RequestInit = {
    method,
    headers,
    body,
    signal,
  };

  return new Request(url.toString(), options);
}
