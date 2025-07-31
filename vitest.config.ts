import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./assets"),
      "@locale": path.resolve(__dirname, "./locale"),
      "@dashboard": path.resolve(__dirname, "./src"),
      "@test": path.resolve(__dirname, "./testUtils"),
      src: path.resolve(__dirname, "./src"),
      moment: path.resolve(__dirname, "./node_modules/moment/min/moment-with-locales.js"),
    },
    dedupe: ["react", "react-dom", "clsx", "@material-ui/styles"],
  },
  define: {
    FLAGS_SERVICE_ENABLED: false,
    FLAGS: JSON.stringify({}),
    "process.env": {
      NODE_ENV: "test",
      DEMO_MODE: false,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./testUtils/setup.ts"],
    globalSetup: "./testUtils/globalSetup.ts",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
    },
  },
});
