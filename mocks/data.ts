import { z } from "zod";

export const mockAccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
});

export type MockAccount = z.infer<typeof mockAccountSchema>;

export const mockAccounts: MockAccount[] = [
  {
    id: "500",
    name: "Test Account 500",
    created_at: "2023-10-10 00:00:00Z",
  },
  {
    id: "501",
    name: "Test Account 501",
    created_at: "2023-10-11 00:00:00Z",
  },
  {
    id: "502",
    name: "Test Account 502",
    created_at: "2023-10-12 00:00:00Z",
  },
  {
    id: "503",
    name: "Test Account 503",
    created_at: "2023-10-13 00:00:00Z",
  },
];
