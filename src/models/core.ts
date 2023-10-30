import { z } from "zod";

export const paymentMethodSchema = z.enum([
  "netterm",
  "free",
  "cryozonic_stripe",
  "cryozonic_ach",
]);

export const booleanStringSchema = z.enum(["1", "0"]);
export const booleanNumberSchema = z.union([z.literal(1), z.literal(0)]);

// Insane things below
// Can be a list of nulls
export const stringOrArraySchema = z.union([
  z.string(),
  z.array(z.string().nullable()),
]);

export type ZoeyBooleanNumber = z.infer<typeof booleanNumberSchema>;
export type ZoeyPaymentMethodCode = z.infer<typeof paymentMethodSchema>;
export type ZoeyBooleanString = z.infer<typeof booleanStringSchema>;
export type ZoeyStringOrArray = z.infer<typeof stringOrArraySchema>;
