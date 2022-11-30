/* eslint-disable no-console */
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import viteSentry from "vite-plugin-sentry";
import { swcReactRefresh } from "vite-plugin-swc-react-refresh";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  /*
    Using explicit env variables, there is no need to expose all of them (security).
  */
  const {
    NODE_ENV,
    API_URI,
    SW_INTERVAL,
    IS_CLOUD_INSTANCE,
    MARKETPLACE_URL,
    SALEOR_APPS_ENDPOINT,
    APP_MOUNT_URI,
    SENTRY_ORG,
    SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN,
    SENTRY_DSN,
    ENVIRONMENT,
    STATIC_URL,
    SALEOR_APPS_PAGE_PATH,
    SALEOR_APPS_JSON_PATH,
    APP_TEMPLATE_GALLERY_PATH,
  } = env;

  const enableSentry =
    SENTRY_ORG && SENTRY_PROJECT && SENTRY_DSN && SENTRY_AUTH_TOKEN;

  const plugins = [
    swcReactRefresh(),
    createHtmlPlugin({
      entry: "/index.tsx",
      template: "index.html",
      inject: {
        data: {
          API_URL: API_URI,
          APP_MOUNT_URI,
          SALEOR_APPS_PAGE_PATH,
          SALEOR_APPS_JSON_PATH,
          APP_TEMPLATE_GALLERY_PATH,
          MARKETPLACE_URL,
        },
      },
    }),
  ];

  if (enableSentry) {
    console.log("Enabling sentry...");

    plugins.push(
      viteSentry({
        sourceMaps: {
          include: "./build/dashboard",
          urlPrefix: process.env.SENTRY_URL_PREFIX,
        },
      }),
    );
  }

  /*
   "qs" package uses 'get-intrinsic' whish refers to the global object, we need to recreate it.
   Issue presents only on development mode.
  */
  const globals = command !== "build" ? { global: {} } : {};

  return {
    root: "src",
    base: STATIC_URL ?? "/",
    envDir: "..",
    server: {
      port: 9000,
    },
    define: {
      ...globals,

      /*
        We still have references to process.env, we need to peserve them as workaround.
      */
      "process.env": {
        NODE_ENV,
        API_URI,
        SW_INTERVAL,
        IS_CLOUD_INSTANCE,
        MARKETPLACE_URL,
        SALEOR_APPS_ENDPOINT,
        APP_MOUNT_URI,
        SENTRY_DSN,
        ENVIRONMENT,
      },
    },
    build: {
      minify: false,
      sourcemap: true,
      emptyOutDir: true,
      outDir: "../build/dashboard",
      assetsDir: ".",
      commonjsOptions: {
        /*
          Fix dynamic imports by "require", Necessary for react-editor-js
          Ref: https://github.com/Jungwoo-An/react-editor-js/blob/e58b7ba5e66d07912bb78f65ac911e4018d363e1/packages/react-editor-js/src/factory.ts#L5
         */
        transformMixedEsModules: true,
      },
    },
    optimizeDeps: {
      include: ["esm-dep > cjs-dep"],
    },
    resolve: {
      alias: {
        /*
          Aliases from tsconfig, we need to preserve them.
          Since @saleor points to "src", we need to add aliases for macaw and sdk as first.
        */
        "@saleor/macaw-ui": path.resolve(
          __dirname,
          "node_modules/@saleor/macaw-ui",
        ),
        "@saleor/app-sdk": path.resolve(
          __dirname,
          "node_modules/@saleor/app-sdk",
        ),
        "@saleor/sdk": path.resolve(__dirname, "node_modules/@saleor/sdk"),
        "@saleor": path.resolve(__dirname, "./src"),
        "@assets": path.resolve(__dirname, "./assets"),
        "@locale": path.resolve(__dirname, "./locale"),
        src: path.resolve(__dirname, "./src"),

        /*
          Moment.js/react-moment does not fully suport ES modules.
          Vite resolves it by using jsnext:main https://github.com/moment/moment/blob/develop/package.json#L26.
          We enforce to use a different path, ignoring jsnext:main field.
        */
        moment: path.resolve(__dirname, "./node_modules/moment/moment.js"),
      },
    },
    plugins,
    esbuild: { jsx: "automatic" },
  };
});
