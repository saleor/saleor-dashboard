import react from "@vitejs/plugin-react-swc";
import path from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";

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

  plugins: [react()],

  define: {
    "process.env": {
      NODE_ENV: JSON.stringify("development"),
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
