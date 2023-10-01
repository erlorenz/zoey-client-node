import { rest } from "msw";
import { setupServer } from "msw/node";
import { mockAccounts } from "./data.js";

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

const handlers = [
  rest.get("https://www.test.com/api/rest/ok", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ test: "json" }));
  }),
  rest.get("https://www.test.com/api/rest/nocontent", (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.get("https://www.test.com/api/rest/notjson", (req, res, ctx) => {
    return res(ctx.status(200), ctx.text("<html><h1>Hello</h1></html>"));
  }),
  rest.get("https://www.test.com/api/rest/validerror", (req, res, ctx) => {
    return res(ctx.status(404), ctx.json(validErrorResponse));
  }),
  rest.get("https://www.test.com/api/rest/invaliderror", (req, res, ctx) => {
    return res(ctx.status(404), ctx.json(invalidErrorResponse));
  }),
  rest.get("https://www.test.com/api/rest/badjson", (req, res, ctx) => {
    return res(ctx.status(404), ctx.text("<<<<<"));
  }),
  rest.get("https://www.test.com/api/rest/networkerror", (req, res, ctx) => {
    return res.networkError("network error");
  }),
  rest.get("https://www.test.com/api/rest/delay", (req, res, ctx) => {
    return res(ctx.delay(10), ctx.status(200), ctx.json({ should: "delay" }));
  }),
  rest.get(
    "https://www.test.com/api/rest/accounts/account",
    (req, res, ctx) => {
      const mockAccount = mockAccounts[0];
      return res(ctx.status(200), ctx.json(mockAccount));
    }
  ),
  rest.get(
    "https://www.test.com/api/rest/accounts/invalidaccount",
    (req, res, ctx) => {
      const mockAccount = mockAccounts[0];
      return res(ctx.status(200), ctx.json({ ...mockAccount, id: 50 }));
    }
  ),
  rest.get("https://www.test.com/api/rest/accounts/list", (req, res, ctx) => {
    const page = req.url.searchParams.get("page");
    if (!page) {
      return res(ctx.status(400), ctx.json({ error: "missing page!" }));
    }
    const length = mockAccounts.length;
    const index = parseInt(page) - 1;
    if (index >= length) {
      return res(ctx.status(200), ctx.json([]));
    }
    const mockAccount = mockAccounts[index];
    return res(ctx.status(200), ctx.json([mockAccount]));
  }),
];

export const mockServer = setupServer(...handlers);
