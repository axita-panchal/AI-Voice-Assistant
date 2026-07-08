import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "out"],
    css: false,
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:3001",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "node_modules",
        ".next",
        "tests/**",
        "**/*.d.ts",
        "**/*.config.*",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
