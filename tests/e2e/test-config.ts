import type { ZoeyClientConfig } from "../../src/index.js";

export const testConfig: ZoeyClientConfig = {
  baseUrl: process.env.ZOEY_API_URL!,
  auth: {
    consumerKey: process.env.ZOEY_CONSUMER_KEY!,
    consumerSecret: process.env.ZOEY_CONSUMER_SECRET!,
    accessToken: process.env.ZOEY_ACCESS_TOKEN!,
    tokenSecret: process.env.ZOEY_TOKEN_SECRET!,
  },
};
