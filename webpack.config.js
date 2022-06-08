/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CheckerPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

require("dotenv").config();

const resolve = path.resolve.bind(path, __dirname);

let bundleAnalyzerPlugin;
let speedMeasureWrapper = fn => fn;
const analyze = process.env.ANALYZE;
if (!!analyze) {
  const smp = new SpeedMeasurePlugin();
  speedMeasureWrapper = smp.wrap;
  bundleAnalyzerPlugin = new BundleAnalyzerPlugin();
}

const pathsPlugin = new TsconfigPathsPlugin({
  configFile: "./tsconfig.json"
});

const checkerPlugin = new CheckerPlugin({
  eslint: true,
  reportFiles: ["src/**/*.{ts,tsx}"]
});
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  filename: "index.html",
  hash: true,
  template: "./src/index.html"
});
const environmentPlugin = new webpack.EnvironmentPlugin({
  API_URI: "",
  MARKETPLACE_URL: "",
  APP_MOUNT_URI: "/",
  DEMO_MODE: false,
  ENVIRONMENT: "",
  GTM_ID: "",
  SENTRY_DSN: "",
  SW_INTERVAL: "300", // Fetch SW every 300 seconds
  IS_CLOUD_INSTANCE: false
});

const dashboardBuildPath = "build/dashboard/";

module.exports = speedMeasureWrapper((env, argv) => {
  const devMode = argv.mode !== "production";

  let fileLoaderPath;
  let output;

  if (!process.env.API_URI) {
    throw new Error("Environment variable API_URI not set");
  }

  const publicPath = process.env.STATIC_URL || "/";
  if (!devMode) {
    output = {
      chunkFilename: "[name].[chunkhash].js",
      filename: "[name].[chunkhash].js",
      path: resolve(dashboardBuildPath),
      publicPath
    };
    fileLoaderPath = "file-loader?name=[name].[hash].[ext]";
  } else {
    output = {
      chunkFilename: "[name].js",
      filename: "[name].js",
      path: resolve(dashboardBuildPath),
      publicPath
    };
    fileLoaderPath = "file-loader?name=[name].[ext]";
  }

  // Create release if sentry config is set
  let sentryPlugin;
  if (
    !devMode &&
    process.env.SENTRY_ORG &&
    process.env.SENTRY_PROJECT &&
    process.env.SENTRY_DSN &&
    process.env.SENTRY_AUTH_TOKEN
  ) {
    sentryPlugin = new SentryWebpackPlugin({
      include: "./build/dashboard/",
      urlPrefix: process.env.SENTRY_URL_PREFIX
    });
  }

  let manifestPlugin;
  if (!devMode) {
    manifestPlugin = new InjectManifest({
      swSrc: "./src/sw.js",
      swDest: "sw.js",
      maximumFileSizeToCacheInBytes: 5000000,
      webpackCompilationPlugins: [checkerPlugin]
    });
  }

  return {
    devServer: {
      compress: true,
      contentBase: path.join(__dirname, dashboardBuildPath),
      historyApiFallback: true,
      hot: true,
      port: 9000
    },
    devtool: devMode ? "cheap-module-source-map" : "source-map",
    entry: {
      dashboard: "./src/index.tsx"
    },
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          use: [
            {
              loader: "esbuild-loader",
              options: {
                loader: "tsx",
                target: "es2015"
              }
            }
          ]
        },
        {
          include: [
            resolve("node_modules"),
            resolve("assets/fonts"),
            resolve("assets/images"),
            resolve("assets/favicons")
          ],
          loader: fileLoaderPath,
          test: /\.(eot|otf|png|svg|jpg|ttf|woff|woff2)(\?v=[0-9.]+)?$/
        }
      ]
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
    },
    output,
    plugins: [
      checkerPlugin,
      environmentPlugin,
      htmlWebpackPlugin,
      sentryPlugin,
      manifestPlugin,
      bundleAnalyzerPlugin
    ].filter(Boolean),
    resolve: {
      // Resolve macaw ui's peer dependencies to our own node_modules
      // to make it work with npm link
      alias: {
        react: path.resolve("./node_modules/react"),
        "react-dom": path.resolve("./node_modules/react-dom"),
        "@material-ui/core": path.resolve("./node_modules/@material-ui/core"),
        "@material-ui/icons": path.resolve("./node_modules/@material-ui/icons"),
        "@material-ui/styles": path.resolve(
          "./node_modules/@material-ui/styles"
        )
      },
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      plugins: [pathsPlugin]
    }
  };
});
