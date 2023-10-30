import { z } from "zod";
import type { AsyncResult, HttpClient } from "../../http-client/types.js";
import type { ZoeyPaymentMethodCode } from "../../types.js";
import type { ZoeyError } from "../../index.js";

export class CartsService {
  #client: HttpClient;
  readonly resourcePath = "/checkout2";

  constructor(client: HttpClient) {
    this.#client = client;
  }

  async create(): AsyncResult<number, ZoeyError> {
    return await this.#client.makeAndParseRequest({
      path: this.resourcePath + "/cart",
      method: "POST",
      schema: z.number(),
    });
  }

  async addProducts(
    cartId: number,
    products: { product_id: number; qty: number }[]
  ): AsyncResult<null, ZoeyError> {
    const result = await this.#client.makeAndParseRequest({
      path: this.resourcePath + "/cart_product/add",
      method: "POST",
      schema: z.literal(true),
      body: { cartId, products },
    });
    if (!result.ok) return result;

    return { ok: true, data: null };
  }

  async setContact(
    cartId: number,
    customerData: { customer_id: number; company_location_id: number }
  ): AsyncResult<null, ZoeyError> {
    const result = await this.#client.makeRequest({
      path: this.resourcePath + "/cart_customer",
      method: "PUT",
      body: {
        cartId,
        customerData: { ...customerData, mode: "customer" },
      },
    });
    if (!result.ok) return result;
    return { ok: true, data: null };
  }

  async setAddress(
    cartId: number,
    addresses: {
      billing: { company_address_id: number };
      shipping: {
        firstname: string;
        lastname: string;
        company: string;
        street: string;
        city: string;
        region: string;
        postcode: string;
        country_id: string;
      };
    }
  ): AsyncResult<null, ZoeyError> {
    const result = await this.#client.makeRequest({
      path: this.resourcePath + "/cart_addresses",
      method: "PUT",
      body: {
        cartId,
        customerAddressData: [
          {
            mode: "billing",
            ...addresses.billing,
          },
          {
            mode: "shipping",
            ...addresses.shipping,
          },
        ],
      },
    });
    if (!result.ok) return result;
    return { ok: true, data: null };
  }

  async setPaymentMethod(
    cartId: number,
    method: ZoeyPaymentMethodCode
  ): AsyncResult<null, ZoeyError> {
    const result = await this.#client.makeRequest({
      path: this.resourcePath + "/cart_payment",
      method: "PUT",
      body: {
        cartId,
        method: { method },
      },
    });
    if (!result.ok) return result;
    return { ok: true, data: null };
  }

  async setShippingMethod(
    cartId: number,
    method: string
  ): AsyncResult<null, ZoeyError> {
    const result = await this.#client.makeRequest({
      path: this.resourcePath + "/cart_shipping",
      method: "PUT",
      body: {
        cartId,
        method,
      },
    });
    if (!result.ok) return result;
    return { ok: true, data: null };
  }

  async setPoNumber(
    cartId: number,
    po_number: string
  ): AsyncResult<null, ZoeyError> {
    const result = await this.#client.makeRequest({
      path: this.resourcePath + "/cart_attributes",
      method: "PUT",
      body: {
        cartId,
        attributeData: {
          po_number,
        },
      },
    });
    if (!result.ok) return result;
    return { ok: true, data: null };
  }

  async convertToOrder(cartId: number): AsyncResult<null, ZoeyError> {
    const result = await this.#client.makeRequest({
      path: this.resourcePath + "/cart_order",
      method: "POST",
      body: { id: cartId },
    });
    if (!result.ok) return result;
    return { ok: true, data: null };
  }
}
