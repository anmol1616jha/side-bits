import { defineConfig } from "vitest/config";

export default defineConfig({
  // `globals` lets Testing Library clean up after each test automatically.
  test: { environment: "jsdom", globals: true },
});
