export type QueryParams = Record<string, string>;

export type ListOptions = {
  queryParams?: QueryParams;
  limit?: number;
  maxPages?: number;
};
