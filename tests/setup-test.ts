import { beforeAll, afterAll, afterEach } from "vitest";
import { mockServer } from "../mocks/server.js";
import { setMaxListeners } from "events";

beforeAll(() => mockServer.listen({ onUnhandledRequest: "error" }));
afterAll(() => mockServer.close());
afterEach(() => mockServer.resetHandlers());
