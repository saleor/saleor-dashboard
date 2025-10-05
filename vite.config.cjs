const { sentryVitePlugin } = require("@sentry/vite-plugin");
const react = require("@vitejs/plugin-react-swc");
const { CodeInspectorPlugin } = require("code-inspector-plugin");
const { copyFileSync, mkdirSync } = require("fs");
const path = require("path");
const nodePolyfills = require("rollup-plugin-polyfill-node");
const { defineConfig, loadEnv, searchForWorkspaceRoot } = require("vite");
const { createHtmlPlugin } = require("vite-plugin-html");

const copyNoopSW = () => ({
  name: "copy-noop-sw",
  apply: "build",
  writeBundle: () => {
    mkdirSync(path.resolve("build", "dashboard"), { recursive: true });
    copyFileSync(path.resolve("assets", "sw.js"), path.resolve("build", "dashboard", "sw.js"));
  },
});

const copyOgImage = () => ({
  name: "copy-og-image",
  apply: "build",
  writeBundle: () => {
    mkdirSync(path.resolve("build", "dashboard"), { recursive: true });
    copyFileSync(path.resolve("assets", "og.png"), path.resolve("build", "dashboard", "og.png"));
  },
});

module.exports = defineConfig(({ command, mode }) => {
  const isDev = command !== "build";
  const env = loadEnv(mode, process.cwd(), "");

  const {
    NODE_ENV,
    API_URL,
    SW_INTERVAL,
    IS_CLOUD_INSTANCE,
    APP_MOUNT_URI,
    SENTRY_DSN,
    SENTRY_RELEASE,
    ENVIRONMENT,
    STATIC_URL,
    APPS_MARKETPLACE_API_URL,
    EXTENSIONS_API_URL,
    APPS_TUNNEL_URL_KEYWORDS,
    SKIP_SOURCEMAPS,
    CUSTOM_VERSION,
    FLAGS_SERVICE_ENABLED,
    LOCALE_CODE,
    POSTHOG_KEY,
    POSTHOG_EXCLUDED_DOMAINS,
    POSTHOG_HOST,
    SENTRY_AUTH_TOKEN,
    SENTRY_ORG,
    SENTRY_PROJECT,
    ENABLED_SERVICE_NAME_HEADER,
    ONBOARDING_USER_JOINED_DATE_THRESHOLD,
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
          API_URL,
          APP_MOUNT_URI,
          APPS_MARKETPLACE_API_URL,
          EXTENSIONS_API_URL,
          APPS_TUNNEL_URL_KEYWORDS,
          IS_CLOUD_INSTANCE,
          LOCALE_CODE,
          POSTHOG_KEY,
          POSTHOG_EXCLUDED_DOMAINS,
          POSTHOG_HOST,
          ONBOARDING_USER_JOINED_DATE_THRESHOLD,
          ENABLED_SERVICE_NAME_HEADER,
        },
      },
    }),
    copyOgImage(),
    copyNoopSW(),
  ];

  if (!isDev) {
    console.log("Enabling service worker...");

    plugins.push(
      sentryVitePlugin({
        authToken: SENTRY_AUTH_TOKEN,
        org: SENTRY_ORG,
        project: SENTRY_PROJECT,
      }),
    );
  }

  const globals = {
    ...(isDev ? { global: {} } : {}),
    FLAGS_SERVICE_ENABLED: FLAGS_SERVICE_ENABLED === "true",
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
      "process.env": {
        NODE_ENV,
        API_URL,
        SW_INTERVAL,
        IS_CLOUD_INSTANCE,
        APP_MOUNT_URI,
        SENTRY_DSN,
        ENVIRONMENT,
        CUSTOM_VERSION,
        LOCALE_CODE,
        SENTRY_RELEASE,
        STATIC_URL,
        POSTHOG_KEY,
        POSTHOG_EXCLUDED_DOMAINS,
        POSTHOG_HOST,
        ENABLED_SERVICE_NAME_HEADER,
        ONBOARDING_USER_JOINED_DATE_THRESHOLD,
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
        transformMixedEsModules: true,
      },
      rollupOptions: {
        plugins: [nodePolyfills()],
        maxParallelFileOps: 2,
        cache: false,
        output: {
          manualChunks: (id) => {
            if (id && id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: ["esm-dep > cjs-dep", "@saleor/macaw-ui"],
    },
    resolve: {
      dedupe: ["react", "react-dom", "clsx", "@material-ui/styles"],
      alias: {
        "@assets": path.resolve(__dirname, "./assets"),
        "@locale": path.resolve(__dirname, "./locale"),
        "@dashboard": path.resolve(__dirname, "./src"),
        src: path.resolve(__dirname, "./src"),
        moment: path.resolve(__dirname, "./node_modules/moment/min/moment-with-locales.js"),
      },
    },
    plugins,
    esbuild: { jsx: "automatic" },
  };
});
