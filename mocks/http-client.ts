import { ZoeyClient, type ZoeyClientConfig } from "../src/index.js";

const mockConfig: ZoeyClientConfig = {
  baseUrl: "https://www.test.com/api/rest",
  auth: {
    consumerKey: "consumer_key",
    consumerSecret: "consumer_secret",
    accessToken: "access_token",
    tokenSecret: "token_secret",
  },
  timeout: 100, // Mock server delay is 10 so only the manual timeout will trigger AbortError
};

export const mockZoey = new ZoeyClient(mockConfig);
export const mockHttpClient = mockZoey.client;
