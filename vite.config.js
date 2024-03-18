/* eslint-disable no-console */
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { CodeInspectorPlugin } from "code-inspector-plugin";
import { copyFileSync, mkdirSync } from "fs";
import path from "path";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig, loadEnv, searchForWorkspaceRoot } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

const copyOgImage = () => ({
  name: "copy-og-image",
  apply: "build",
  writeBundle: () => {
    mkdirSync(path.resolve("build", "dashboard"), { recursive: true });
    copyFileSync(
      path.resolve("assets", "og.png"),
      path.resolve("build", "dashboard", "og.png"),
    );
  },
});

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
    APP_MOUNT_URI,
    SENTRY_DSN,
    SENTRY_RELEASE,
    ENVIRONMENT,
    STATIC_URL,
    APPS_MARKETPLACE_API_URI,
    APPS_TUNNEL_URL_KEYWORDS,
    SKIP_SOURCEMAPS,
    DEMO_MODE,
    CUSTOM_VERSION,
    FLAGS_SERVICE_ENABLED,
    LOCALE_CODE,
    POSTHOG_KEY,
    POSTHOG_HOST,
    SENTRY_AUTH_TOKEN,
    SENTRY_ORG,
    SENTRY_PROJECT,
    // eslint-disable-next-line camelcase
    npm_package_version,
  } = env;

  const base = STATIC_URL ?? "/";
  const featureFlagsEnvs = Object.fromEntries(
    Object.entries(env).filter(([flagKey]) => flagKey.startsWith("FF_")),
  );

  const sourcemap = !SKIP_SOURCEMAPS;

  const plugins = [
    react(),
    CodeInspectorPlugin({
      bundler: "vite",
    }),
    createHtmlPlugin({
      entry: path.resolve(__dirname, "src", "index.tsx"),
      template: "index.html",
      inject: {
        data: {
          API_URL: API_URI,
          APP_MOUNT_URI,
          APPS_MARKETPLACE_API_URI,
          APPS_TUNNEL_URL_KEYWORDS,
          IS_CLOUD_INSTANCE,
          LOCALE_CODE,
          POSTHOG_KEY,
          POSTHOG_HOST,
          injectOgTags:
            DEMO_MODE &&
            `
            <meta property="og:type" content="website">
            <meta property="og:title" content="Sign in to the Saleor Dashboard">
            <meta property="og:description" content="Sign in to the Saleor Dashboard to manage your orders, payments, products and more.">
            <meta property="og:image" content="${base}og.png">
            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:title" content="Sign in to the Saleor Dashboard">
            <meta name="twitter:description" content="Sign in to the Saleor Dashboard to manage your orders, payments, products and more.">
            <meta name="twitter:image" content="${base}og.png">
            <meta property="og:url" content="https://demo.saleor.io/dashboard/">
            <meta property="twitter:domain" content="demo.saleor.io">
            <meta property="twitter:url" content="https://demo.saleor.io/dashboard/">
          `,
        },
      },
    }),
    copyOgImage(),
  ];

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
        srcDir: path.resolve(__dirname),
        filename: "sw.js",
      }),
      sentryVitePlugin({
        authToken: SENTRY_AUTH_TOKEN,
        org: SENTRY_ORG,
        project: SENTRY_PROJECT,
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
    // Keep all feature flags from env in global variable
    FLAGS: JSON.stringify(featureFlagsEnvs),
  };

  return {
    root: "src",
    base,
    envDir: "..",
    server: {
      port: 9000,
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd()), "../.."],
      },
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
        APP_MOUNT_URI,
        SENTRY_DSN,
        ENVIRONMENT,
        DEMO_MODE,
        CUSTOM_VERSION,
        LOCALE_CODE,
        SENTRY_RELEASE,
        STATIC_URL,
        POSTHOG_KEY,
        POSTHOG_HOST,
        // eslint-disable-next-line camelcase
        RELEASE_NAME: npm_package_version,
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
        maxParallelFileOps: 2,
        cache: false,
        output: {
          sourcemap,
          manualChunks: id => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ["esm-dep > cjs-dep", "@saleor/macaw-ui"],
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
      dedupe: ["react", "react-dom", "clsx", "@material-ui/styles"],
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
        moment: path.resolve(
          __dirname,
          "./node_modules/moment/min/moment-with-locales.js",
        ),
      },
    },
    plugins,
    esbuild: { jsx: "automatic" },
  };
});
