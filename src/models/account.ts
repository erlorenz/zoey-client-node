import { z } from "zod";
import { paymentMethodSchema } from "./core.js";

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  // payment_method: paymentMethodSchema,
});

export const accountListSchema = z.array(accountSchema);

export type ZoeyAccount = z.infer<typeof accountSchema>;
