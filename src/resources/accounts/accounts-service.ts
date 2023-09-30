import { z } from "zod";
import { HttpClient } from "../../http-client/types.js";
import { ZoeyListOptions, ZoeyResourceId } from "../../types.js";
import { accountListSchema, accountSchema } from "../../models/account.js";
import { CreateAccountRequestBody } from "./accounts-request.js";

export class AccountsService {
  #client: HttpClient;
  #resourcePath = "/companyAccounts";

  constructor(client: HttpClient) {
    this.#client = client;
  }

  async list({ queryParams, limit = 10, maxPages }: ZoeyListOptions) {
    return await this.#client.makePaginatedRequest({
      path: this.#resourcePath + "/list",
      limit,
      queryParams,
      schema: accountListSchema,
      maxPages,
    });
  }

  async retrieve(id: ZoeyResourceId) {
    return await this.#client.makeAndParseRequest({
      path: this.#resourcePath + "/account",
      queryParams: { id },
      schema: accountSchema,
    });
  }

  async create(body: CreateAccountRequestBody) {
    return await this.#client.makeAndParseRequest({
      path: this.#resourcePath + "/account",
      schema: z.object({ id: z.string() }),
      body,
    });
  }
}
