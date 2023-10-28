import { z } from "zod";
import type { HttpClient } from "../../http-client/types.js";
import type { ZoeyListOptions, ZoeyResourceId } from "../../types.js";
import { accountListSchema, accountSchema } from "../../models/account.js";
import type { CreateAccountRequestBody } from "./accounts-request.js";

export class AccountsService {
  #client: HttpClient;
  readonly resourcePath = "/companyAccounts";

  constructor(client: HttpClient) {
    this.#client = client;
  }

  async list({ queryParams, limit, maxPages }: ZoeyListOptions) {
    return await this.#client.makePaginatedRequest({
      path: this.resourcePath + "/list",
      queryParams,
      schema: accountListSchema,
      limit,
      maxPages,
    });
  }

  async retrieve(id: ZoeyResourceId) {
    return await this.#client.makeAndParseRequest({
      path: this.resourcePath + "/account",
      queryParams: { id },
      schema: accountSchema,
    });
  }

  async create(body: CreateAccountRequestBody) {
    return await this.#client.makeAndParseRequest({
      path: this.resourcePath + "/account",
      method: "POST",
      schema: z.object({ id: z.string() }),
      body,
    });
  }
}
