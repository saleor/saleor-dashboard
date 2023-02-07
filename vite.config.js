/* eslint-disable no-console */
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import path from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig, loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";
import viteSentry from "vite-plugin-sentry";
import { swcReactRefresh } from "vite-plugin-swc-react-refresh";

export default defineConfig(({ command, mode }) => {
  const isDev = command !== "build";
  const env = loadEnv(mode, process.cwd(), "");
  /*
    Using explicit env variables, there is no need to expose all of them (security).
  */
  const {
    NODE_ENV,
    API_URI,
    SW_INTERVAL,
    IS_CLOUD_INSTANCE,
    /**
     * @deprecated
     */
    MARKETPLACE_URL, // To be removed
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
    APPS_MARKETPLACE_API_URI,
    APPS_TUNNEL_URL_KEYWORDS,
    SKIP_SOURCEMAPS,
    DEMO_MODE,
    FLAGS_SERVICE_ENABLED,
    FLAGSMITH_ID,
  } = env;

  const featureFlagsEnvs = Object.fromEntries(
    Object.entries(env).filter(([flagKey]) => flagKey.startsWith("FF_")),
  );

  const sourcemap = SKIP_SOURCEMAPS ? false : true;

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
          APPS_MARKETPLACE_API_URI,
          APPS_TUNNEL_URL_KEYWORDS,
        },
      },
    }),
  ];

  if (enableSentry) {
    console.log("Enabling sentry...");

    plugins.push(
      viteSentry({
        sourceMaps: {
          include: ["./build/dashboard"],
          urlPrefix: process.env.SENTRY_URL_PREFIX,
        },
      }),
    );
  }

  if (!isDev) {
    console.log("Enabling service worker...");

    plugins.push(
      VitePWA({
        /*
          We use 'register-service-worker' for registering sw.js.
         */
        injectRegister: null,
        strategies: "injectManifest",

        /*
          Since "src" is exposed as a root,
          sw.js has to be moved above, to preventing loading in a dev mode.
        */
        srcDir: "../",
        filename: "sw.js",
      }),
    );
  }

  const globals = {
    /*
      "qs" package uses 'get-intrinsic' whish refers to the global object, we need to recreate it.
      Issue presents only on development mode.
    */
    ...(isDev ? { global: {} } : {}),
    FLAGS_SERVICE_ENABLED: FLAGS_SERVICE_ENABLED === "true",
    FLAGSMITH_ID: JSON.stringify(FLAGSMITH_ID),
    // Keep all feature flags from env in global variable
    FLAGS: JSON.stringify(featureFlagsEnvs),
  };

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
        DEMO_MODE,
      },
    },
    build: {
      sourcemap,
      minify: false,
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
      rollupOptions: {
        plugins: [nodePolyfills()],
      },
    },
    optimizeDeps: {
      include: ["esm-dep > cjs-dep"],
      esbuildOptions: {
        plugins: [
          /*
            react-markdown and its dependency tried to call process.cwd().
            Since it's not present in the browser, we need to polyfill that.
           */
          NodeGlobalsPolyfillPlugin({ process: true }),
        ],
      },
    },
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, "./assets"),
        "@locale": path.resolve(__dirname, "./locale"),
        "@dashboard": path.resolve(__dirname, "./src"),
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
