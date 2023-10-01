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
  {
    id: "504",
    name: "Test Account 504",
    created_at: "2023-10-14 00:00:00Z",
  },
  {
    id: "505",
    name: "Test Account 505",
    created_at: "2023-10-15 00:00:00Z",
  },
  {
    id: "506",
    name: "Test Account 506",
    created_at: "2023-10-16 00:00:00Z",
  },
  {
    id: "507",
    name: "Test Account 507",
    created_at: "2023-10-17 00:00:00Z",
  },
  {
    id: "508",
    name: "Test Account 508",
    created_at: "2023-10-18 00:00:00Z",
  },
  {
    id: "509",
    name: "Test Account 509",
    created_at: "2023-10-19 00:00:00Z",
  },
];
