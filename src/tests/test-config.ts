import { ZoeyClientConfig } from "../http-client/types.js";

export const testConfig: ZoeyClientConfig = {
  basePath: process.env.SITE_URL!,
  auth: {
    consumerKey: process.env.CONSUMER_KEY!,
    consumerSecret: process.env.CONSUMER_SECRET!,
    accessToken: process.env.ACCESS_TOKEN!,
    tokenSecret: process.env.TOKEN_SECRET!,
  },
};
