// Request options
export type ZoeyQueryParams = Record<string, string | string>;
export type ZoeyListOptions = {
  queryParams?: ZoeyQueryParams;
  limit?: number;
  maxPages?: number;
};

// Datatypes
export type ZoeyResourceId = string;
export type ZoeyDateTime = string;
export type {
  ZoeyBooleanString,
  ZoeyPaymentMethodCode,
  ZoeyBooleanNumber,
  ZoeyStringOrArray,
} from "./models/core.js";

// Models
export type { ZoeyAccount } from "./models/account.js";

// RequestBodies
export type * from "./resources/accounts/accounts-request.js";
