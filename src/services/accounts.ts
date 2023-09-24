import { z } from "zod";
import { HttpClient } from "../http-client/types";
import { ListOptions, QueryParams, ZoeyResourceId } from "../zoey/types";
import {
  AccountId,
  accountListSchema,
  accountSchema,
} from "../models/accounts";
import { CreateAccountRequestBody } from "../requests.ts/accounts";

export class AccountsService {
  #client: HttpClient;
  #resourcePath = "/companyAccounts";

  constructor(client: HttpClient) {
    this.#client = client;
  }

  async list({ queryParams, limit = 10, maxPages }: ListOptions) {
    const path = this.#resourcePath + "/list";

    const result = await this.#client.makePaginatedRequest({
      limit,
      path,
      queryParams,
      schema: accountListSchema,
      maxPages,
    });

    return result;
  }

  async retrieve(id: ZoeyResourceId) {
    const path = this.#resourcePath + "/account";

    const result = await this.#client.makeAndParseRequest({
      path,
      queryParams: { id },
      schema: accountSchema,
    });

    return result;
  }

  async create(body: CreateAccountRequestBody) {
    const path = this.#resourcePath + "/account";

    const result = await this.#client.makeAndParseRequest({
      path,
      schema: z.object({ id: z.string() }),
      body,
    });

    return result;
  }
}
