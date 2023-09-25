import { z } from "zod";

export type QueryParams = Record<string, string | string>;

export type ListOptions = {
  queryParams?: QueryParams;
  limit?: number;
  maxPages?: number;
};

export type ZoeyResourceId = string;
export type ZoeyBooleanNumber = 1 | 0;

export const zoeyClientConfigSchema = z.object({
  auth: z.object({
    consumerKey: z.string().nonempty("consumerKey cannot be empty."),
    consumerSecret: z.string().nonempty("consumerSecret cannot be empty."),
    accessToken: z.string().nonempty("accessToken cannot be empty."),
    tokenSecret: z.string().nonempty("tokenSecret cannot be empty."),
  }),
  baseUrl: z.string().url("baseUrl needs to be a valid url."),
  timeout: z.number().optional(),
});

export type ZoeyClientConfig = z.infer<typeof zoeyClientConfigSchema>;
