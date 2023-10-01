import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "./"],
    setupFiles: "test/setup-test.ts",
  },
});
