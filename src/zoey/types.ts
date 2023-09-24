export type QueryParams = Record<string, string | string>;

export type ListOptions = {
  queryParams?: QueryParams;
  limit?: number;
  maxPages?: number;
};

export type ZoeyResourceId = string;
export type ZoeyBooleanNumber = 1 | 0;
