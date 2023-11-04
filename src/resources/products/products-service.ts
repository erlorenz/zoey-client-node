import { z } from "zod";
import type { AsyncResult, HttpClient } from "../../http-client/types.js";
import type {
  ZoeyListOptions,
  ZoeyProduct,
  ZoeyResourceId,
} from "../../types.js";
import { productMapSchema, productSchema } from "../../models/product.js";
import type { ZoeyError } from "../../index.js";
import type { Z } from "vitest/dist/reporters-5f784f42.js";

export class ProductsService {
  #client: HttpClient;
  readonly resourcePath = "/products";

  constructor(client: HttpClient) {
    this.#client = client;
  }

  async list<Tschema extends z.ZodSchema>({
    queryParams,
    limit = 100,
    maxPages = 50,
    attributes,
  }: ZoeyListOptions & { attributes?: Tschema }): AsyncResult<
    (ZoeyProduct & z.infer<Tschema>)[],
    ZoeyError
  > {
    const products: (ZoeyProduct & z.infer<Tschema>)[] = [];

    const schema = z.record(
      z.intersection(attributes || z.object({}), productSchema)
    );

    for (let page = 1; page <= maxPages; page++) {
      const result = await this.#client.makeAndParseRequest({
        path: this.resourcePath,
        queryParams: {
          ...queryParams,
          limit: limit.toString(),
          page: page.toString(),
        },
        schema,
      });
      if (!result.ok) return result;

      const list = Object.values(result.data);
      products.push(...list);

      if (list.length < limit) break;
    }
    return { ok: true, data: products };
  }

  async retrieve(id: ZoeyResourceId) {
    return await this.#client.makeAndParseRequest({
      path: this.resourcePath + "/products/" + id,
      schema: productSchema,
    });
  }
}
