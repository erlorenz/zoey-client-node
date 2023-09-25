import { ZoeyClient } from "./index.js";
import dotenv from "dotenv";
dotenv.config();

const config = {
  basePath: process.env.ZOEY_SITE_URL!,
  auth: {
    consumerKey: process.env.ZOEY_CONSUMER_KEY!,
    consumerSecret: process.env.ZOEY_CONSUMER_SECRET!,
    accessToken: process.env.ZOEY_ACCESS_TOKEN!,
    tokenSecret: process.env.ZOEY_TOKEN_SECRET!,
  },
};

const zoey = new ZoeyClient(config);

zoey.accounts
  .list({ limit: 2, maxPages: 2 })
  .then((d) => console.log("DATA: ", d.ok ? d.data : d.error));
