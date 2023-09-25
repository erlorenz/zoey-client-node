import { Client } from "../http-client/http-client.js";
import { HttpClient } from "../http-client/types.js";
import { ZoeyError } from "../errors/errors.js";
import { AccountsService } from "../services/accounts.js";
import { ZoeyClientConfig, zoeyClientConfigSchema } from "./types.js";

export class ZoeyClient {
  readonly client: HttpClient;
  readonly accounts: AccountsService;
  // orders: OrdersResource;

  constructor(config: ZoeyClientConfig) {
    const validatedConfig = ZoeyClient.#validateConfig(config);
    this.client = new Client(validatedConfig);
    this.accounts = new AccountsService(this.client);
    // this.orders = new OrdersResource(this.client)
  }

  static #validateConfig(config: ZoeyClientConfig) {
    const parsed = zoeyClientConfigSchema.safeParse(config);
    if (parsed.success) {
      return parsed.data;
    }
    throw new ZoeyError({
      type: "config",
      message: "Config not valid: " + parsed.error.errors[0].message,
      cause: parsed.error,
      path: "",
    });
  }
}
