export type ZoeyQueryParams = Record<string, string | string>;

export type ZoeyListOptions = {
  queryParams?: ZoeyQueryParams;
  limit?: number;
  maxPages?: number;
};

export type ZoeyResourceId = string;
export type ZoeyBooleanNumber = 1 | 0;
export type ZoeyBooleanString = "1" | "0";
export type ZoeyDateTime = string;

export type ZoeyPaymentMethodCode =
  | "netterm"
  | "cryozonic_stripe"
  | "cryozonic_ach";
