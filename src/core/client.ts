export class Client {
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

export type Config = {
  auth: {
    consumerKey: string;
    consumerSecret: string;
    accessToken: string;
    tokenSecret: string;
  };
  siteUrl: string;
};
