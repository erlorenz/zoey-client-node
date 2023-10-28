import { z } from "zod";

export const paymentMethodSchema = z.enum([
  "netterm",
  "free",
  "cryozonic_stripe",
  "cryozonic_ach",
]);

export const booleanStringSchema = z.enum(["1", "0"]);

export type ZoeyPaymentMethodCode = z.infer<typeof paymentMethodSchema>;
export type ZoeyBooleanString = z.infer<typeof booleanStringSchema>;
