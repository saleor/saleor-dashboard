import react from "@vitejs/plugin-react-swc";
import path from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";

// This is a minimal version of main vite.config.js for Storybook, so that it builds fast
export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "..", "./assets"),
      "@locale": path.resolve(__dirname, "..", "./locale"),
      "@dashboard": path.resolve(__dirname, "..", "./src"),
      src: path.resolve(__dirname, "..", "./src"),
      moment: path.resolve(__dirname, "..", "./node_modules/moment/min/moment-with-locales.js"),
    },
  },

  // Note: We don't need plugins for production (e.g. Sentry)
  plugins: [react()],

  define: {
    "process.env": {
      NODE_ENV: JSON.stringify("development"),
      DEMO_MODE: JSON.stringify(false),
    },
    FLAGS_SERVICE_ENABLED: false,
    FLAGS: JSON.stringify({}),
  },

  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
