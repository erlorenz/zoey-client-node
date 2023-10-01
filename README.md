# Zoey Client for Node.js

### Features

- Minimal dependencies (`oauth-1.0a` and `zod`)
- Built as both CommonJS and ESM
- Fully type-safe
- Tested on MacOS and Ubuntu 20.04

### Coming Soon

- More resources
- Configuration for custom attribute type-safety
- Mock client for testing

## Requirements

Node 18+ (uses native Fetch API).

> **`@types/node` currently is missing the global Fetch type definition. In the meantime `node-fetch` is used as a workaround until this is resolved.**

## Installation

Install the package with:

```sh
npm install zoey-client-node
```

## Configuration

Pass the OAuth 1.0a credentials and site URL (see Zoey REST docs for instructions) as a `ZoeyClientConfig` object to the `ZoeyClient`.  
You can optionally set a timeout for the request, but be aware some requests (like converting cart to checkout) can take 10+ seconds.

```ts
import { ZoeyClient } from "zoey-client-node";
import type { ZoeyClientConfig } from "zoey-client-node/types";

const configOptions: ZoeyClientConfig = {
    baseUrl: "https://zoey-site-url.com/api/rest",
    // timeout: 15_000
    auth: {
        consumerKey: "key",
        consumerSecret: "secret"
        accessToken: "token",
        tokenSecret: "secret"
    }
}

const zoey = new ZoeyClient(configOptions); // Throws ZoeyError with type: 'configuration'
```

## Basic Usage

Resource methods return a `Result<Data, ZoeyError>`.  
This is a discriminated union with an `ok` boolean property and either the fully typed data or a `ZoeyError` (This is similar to Zod's `.safeParse` method).

```ts
zoey.acccount.retrieve("bad_account_id"); // => { ok: false; error: ZoeyError }
zoey.account.retrieve("good_account_id"); // => { ok: true; data: Account }
```

You can also access the embedded `HttpClient` that has 3 methods: `makeRequest`, `makeAndParseRequest`, `makePaginatedRequest`.  
Each takes a `MakeRequestOptions` object.  
`makeAndParseRequest` and `makePaginatedRequest` both also take a schema.  
`makePaginatedRequest` also takes `limit` and `maxPages` to control the amount of results.

```ts
const accountSchema = z.object({ id: z.string() });
type Account = z.infer<typeof accountSchema>;

const requestOptions: MakeRequestOptions = {
  path: "/accounts/account"
  queryParams: { id: "500" },
  timeout: 5_000, // override default/initialized timeout
  method: "GET", // defaults to GET
  // body: some_body_object
};

zoey.client.makeRequest(requestOptions); // => { ok: true, data: unknown }

zoey.client.makeAndParseRequest({
  ...requestOptions,
  schema: accountSchema,
}); // => { ok: true, data: Account }

zoey.client.makePaginatedRequest({
  ...requestOptions,
  path: "/accounts/list",
  schema: z.array(accountSchema),
  limit: 10,
  maxPages: 2,
}); // => { ok: true, data: Account[] }
```

## Errors

`ZoeyError` extends `Error` and always includes a `message` property and a `type` property.  
Based on the type code there may be other properties like the URL path, full response body, etc.

| Error Code            | Description                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `configuration`       | An invalid ZoeyClientConfig object passed to the client constructor.                      |
| `connection`          | There was an issue connecting to the Zoey API server. This is an error thrown by `fetch`. |
| `invalid_return_type` | The return type from the Zoey API did not match the schema.                               |
| `bad_json`            | The response body could not be parsed and threw a `SyntaxError`.                          |
| `timeout`             | The fetch request threw a `TimeoutError` due to AbortSignal.timeout()                     |
| `bad_request`         | The API returned a 400 status.                                                            |
| `authentication`      | The API returned a 401 status.                                                            |
| `permission`          | The API returned a 403 status.                                                            |
| `not_found`           | The API returned a 404 status.                                                            |
| `too_many_requests`   | The API returned a 429 status.                                                            |
| `api_error`           | The API returned 500 or any other not specified status.                                   |
| `unknown`             | The fetch request threw something that was not an instance of `Error`.                    |

## Todo:

- Remove node-fetch when @types/node finally adds native Fetch types
- Remove vitest when node test runner improves and loader with tsx is no longer experimental and can use watch
- Add live e2e tests that record data for msw
