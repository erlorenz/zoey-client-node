import { z } from "zod";

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const accountListSchema = z.array(accountSchema);

export type Account = z.infer<typeof accountSchema>;
