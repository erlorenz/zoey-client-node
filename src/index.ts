import dotenv from "dotenv";
dotenv.config();

type Config = {
  auth: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    tokenSecret: string;
  };
  siteUrl: string;
};

class Client {
  #auth: Config["auth"];
  #siteUrl: string;

  constructor(config: Config) {
    this.#validateConfig(config);
    this.#auth = config.auth;
    this.#siteUrl = config.siteUrl;
  }

  #validateConfig(cfg: Config) {
    const missing: string[] = [];
    for (let [k, v] of Object.entries(cfg)) {
      if (!v) missing.push(k);
    }

    if (missing.length)
      throw new Error(`empty config values: ${missing.join(", ")}`);
  }
}

const config: Config = {
  siteUrl: process.env.ZOEY_SITE_URL!,
  auth: {
    consumerKey: process.env.ZOEY_CONSUMER_KEY!,
    consumerSecret: process.env.ZOEY_CONSUMER_SECRET!,
    accessToken: process.env.ZOEY_ACCESS_TOKEN!,
    tokenSecret: process.env.ZOEY_TOKEN_SECRET!,
  },
};

new Client(config);
