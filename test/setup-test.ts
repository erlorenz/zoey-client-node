import { beforeAll, afterAll, afterEach } from "vitest";
import { mockServer } from "../mocks/server.js";

beforeAll(() => mockServer.listen({ onUnhandledRequest: "error" }));
afterAll(() => mockServer.close());
afterEach(() => mockServer.resetHandlers());
