import { z } from "zod";
import { ClientWithAuth } from "../client/types";
import { ListOptions, QueryParams } from "../zoey/types";
import { accountListSchema, accountSchema } from "./types";

export class AccountsResource {
  #client: ClientWithAuth;
  resourcePath = "/companyAccounts";

  constructor(client: ClientWithAuth) {
    this.#client = client;
  }

  async list({ queryParams, limit = 10, maxPages }: ListOptions) {
    const path = this.resourcePath + "/list";

    const result = await this.#client.makePaginatedRequest({
      limit,
      path,
      queryParams,
      schema: accountListSchema,
      maxPages,
    });
    if (!result.ok) {
      throw new Error(
        `error code ${result.error.code}: ${result.error.message}`
      );
    }

    return result.data;
  }

  async retrieve(id: number) {
    const path = this.resourcePath + "/account";

    const result = await this.#client.makeAndParseRequest({
      path,
      queryParams: { id: id.toString() },
      schema: accountSchema,
    });

    if (!result.ok) {
      throw new Error(
        `error code ${result.error.code}: ${JSON.stringify(result.error)}`
      );
    }

    return result.data;
  }
}
