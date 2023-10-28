import { HttpResponse, RequestHandler, delay, http } from "msw";
import { setupServer } from "msw/node";
import { mockAccounts } from "./data.js";

const BASE_URL = "https://www.test.com/api/rest";

const validErrorResponse = {
  messages: {
    error: [
      {
        code: 404,
        message: "error",
      },
    ],
  },
};

const invalidErrorResponse = {
  messages: {
    error: [
      {
        // code: 404,
        message: "error",
      },
    ],
  },
};

// TODO: update to HttpResponse when types for ResponseInit are working
const handlers: Array<RequestHandler> = [
  http.get(BASE_URL + "/ok", () => {
    return HttpResponse.json({ test: "json" });
  }),
  http.get(BASE_URL + "/nocontent", () => {
    return new Response(undefined, { status: 204 });
  }),
  http.get(BASE_URL + "/notjson", () => {
    return new Response("<html><h1>Hello</h1></html>");
  }),
  http.get(BASE_URL + "/validerror", () => {
    return new Response(JSON.stringify(validErrorResponse), { status: 404 });
  }),
  http.get(BASE_URL + "/invaliderror", () => {
    return new Response(JSON.stringify(invalidErrorResponse), { status: 404 });
  }),
  http.get(BASE_URL + "/badjson", () => {
    return HttpResponse.text("<<<<<");
  }),
  http.get(BASE_URL + "/networkerror", () => {
    return HttpResponse.error();
  }),
  http.get(BASE_URL + "/delay", async () => {
    await delay(10);
    return HttpResponse.json({ should: "delay" });
  }),
  http.get(BASE_URL + "/accounts/account", () => {
    const mockAccount = mockAccounts[0];
    return HttpResponse.json(mockAccount);
  }),
  http.get(BASE_URL + "/accounts/invalidaccount", () => {
    const mockAccount = mockAccounts[0];
    return HttpResponse.json({ ...mockAccount, id: 50 });
  }),
  http.get(BASE_URL + "/accounts/list", ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");
    if (!page) {
      return new Response(JSON.stringify({ error: "missing page!" }), {
        status: 400,
      });
    }
    const length = mockAccounts.length;
    const index = parseInt(page) - 1;
    if (index >= length) {
      return HttpResponse.json([]);
    }
    const mockAccount = mockAccounts[index];
    return HttpResponse.json([mockAccount]);
  }),
  // Default - return url if GET and URL and body if POST
  http.get(BASE_URL + "/*", ({ request }) => {
    return HttpResponse.json({ url: request.url });
  }),
  http.post(BASE_URL + "/*", async ({ request }) => {
    return HttpResponse.json({ url: request.url, body: await request.json() });
  }),
];

export const mockServer = setupServer(...handlers);
