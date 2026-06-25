import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      ".claude/**",
    ],
  },
});
