import { Client } from "../http-client/http-client.js";
import type { HttpClient } from "../http-client/types.js";
import { ZoeyError } from "../errors/zoey-error.js";
import { AccountsService } from "../resources/accounts/accounts-service.js";
import { z } from "zod";
import { CartsService } from "../resources/carts/carts-service.js";
import { ProductsService } from "../resources/products/products-service.js";

export class ZoeyClient {
  readonly client: HttpClient;
  readonly accounts: AccountsService;
  readonly carts: CartsService;
  readonly products: ProductsService;
  // orders: OrdersResource;

  constructor(config: ZoeyClientConfig) {
    const validConfig = ZoeyClient.validateConfig(config);
    this.client = new Client(validConfig);
    this.accounts = new AccountsService(this.client);
    this.carts = new CartsService(this.client);
    this.products = new ProductsService(this.client);
    // this.orders = new OrdersResource(this.client)
  }

  static validateConfig(config: ZoeyClientConfig) {
    const parsed = zoeyClientConfigSchema.safeParse(config);
    if (parsed.success) {
      return parsed.data;
    }
    const paths = parsed.error.errors.map((e) => e.path.join("."));
    throw new ZoeyError({
      type: "configuration",
      message: "Invalid config: [" + paths.join(", ") + "]",
    });
  }
}

export const zoeyClientConfigSchema = z.object({
  auth: z.object({
    consumerKey: z.string().nonempty("consumerKey cannot be empty."),
    consumerSecret: z.string().nonempty("consumerSecret cannot be empty."),
    accessToken: z.string().nonempty("accessToken cannot be empty."),
    tokenSecret: z.string().nonempty("tokenSecret cannot be empty."),
  }),
  baseUrl: z.string().url("baseUrl needs to be a valid url."),
  timeout: z.number().optional(),
});

export type ZoeyClientConfig = z.infer<typeof zoeyClientConfigSchema>;
