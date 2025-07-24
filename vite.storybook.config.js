import react from "@vitejs/plugin-react-swc";
import path from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";

// This is a minimal version of your main vite.config.js for Storybook
export default defineConfig({
  // We don't need to define `root` or `envDir`, Storybook handles this.

  // 1. ALIASES: Keep your path aliases
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./assets"),
      "@locale": path.resolve(__dirname, "./locale"),
      "@dashboard": path.resolve(__dirname, "./src"),
      src: path.resolve(__dirname, "./src"),
      moment: path.resolve(__dirname, "./node_modules/moment/min/moment-with-locales.js"),
    },
  },

  // 2. PLUGINS: Only include plugins needed for component rendering
  plugins: [
    react(),
    // We removed:
    // - sentryVitePlugin (not needed for component isolation)
    // - createHtmlPlugin (Storybook has its own HTML)
    // - custom copy plugins (not relevant to stories)
  ],

  // 3. DEFINE: Provide a minimal set of global variables
  // Only include variables that your components *actually use*.
  // Remove backend URLs, Sentry keys, etc., unless a component needs them.
  define: {
    "process.env": {
      // Example: You might only need a few variables for your UI components
      NODE_ENV: JSON.stringify("development"),
      DEMO_MODE: JSON.stringify(false),
      // Add other essential env variables your components depend on
    },
    // Keep feature flags if your components use them
    FLAGS_SERVICE_ENABLED: false,
    FLAGS: JSON.stringify({}),
  },

  // 4. BUILD: Keep necessary build options
  build: {
    // Polyfills might be needed by some of your dependencies
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
    // commonjsOptions might be needed for certain libraries
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
