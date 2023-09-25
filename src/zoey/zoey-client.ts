import { Client } from "../http-client/http-client.js";
import { HttpClient, Config } from "../http-client/types.js";
import { AccountsService } from "../services/accounts.js";

export class ZoeyClient {
  readonly client: HttpClient;
  readonly accounts: AccountsService;
  // orders: OrdersResource;

  constructor(config: Config) {
    this.client = new Client(config);
    this.accounts = new AccountsService(this.client);
    // this.orders = new OrdersResource(this.client)
  }
}
