import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
    setupFiles: "tests/setup-test.ts",
    coverage: {
      include: ["src"],
    },
  },
});
