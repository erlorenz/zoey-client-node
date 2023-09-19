import { Client } from "../client";
import { ClientWithAuth, Config } from "../client/types";
import { AccountsResource } from "../resources/accounts";

export class Zoey {
  client: ClientWithAuth;
  accounts: AccountsResource;
  // orders: OrdersResource;

  constructor(config: Config) {
    this.client = new Client(config);
    this.accounts = new AccountsResource(this.client);
    // this.orders = new OrdersResource(this.client)
  }
}
