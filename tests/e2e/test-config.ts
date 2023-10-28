import type { ZoeyClientConfig } from "../../src/index.js";

export const testConfig: ZoeyClientConfig = {
  baseUrl: process.env.ZOEY_BASE_URL!,
  auth: {
    consumerKey: process.env.CONSUMER_KEY!,
    consumerSecret: process.env.CONSUMER_SECRET!,
    accessToken: process.env.ACCESS_TOKEN!,
    tokenSecret: process.env.TOKEN_SECRET!,
  },
};
