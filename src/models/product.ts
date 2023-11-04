import { z } from "zod";

export const productSchema = z.object({
  entity_id: z.string(),
  type_id: z.string(),
  sku: z.string(),
  name: z.string(),
  status: z.enum(["0", "1", "2"]),
  tax_class_id: z.string(),
  price: z.string(),
  weight: z.string().optional(),
});

export const productMapSchema = z.record(productSchema);

export type ZoeyProduct = z.infer<typeof productSchema>;
