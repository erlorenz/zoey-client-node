import { z } from "zod";

export const mockAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
});

export type MockAccount = z.infer<typeof mockAccountSchema>;

export const mockAccount: MockAccount = {
  id: "3234",
  name: "Test Account",
  created_at: "2023-10-10 00:00:00Z",
};
