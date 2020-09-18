/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CheckerPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

require("dotenv").config();

const resolve = path.resolve.bind(path, __dirname);

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
  APP_MOUNT_URI: "/",
  DEMO_MODE: false,
  GTM_ID: ""
});

const dashboardBuildPath = "build/dashboard/";

module.exports = (env, argv) => {
  const devMode = argv.mode !== "production";

  let fileLoaderPath;
  let output;

  if (!process.env.API_URI) {
    throw new Error("Environment variable API_URI not set");
  }

  if (!devMode) {
    const publicPath = process.env.STATIC_URL || "/";
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
      publicPath: "/"
    };
    fileLoaderPath = "file-loader?name=[name].[ext]";
  }

  return {
    devServer: {
      compress: true,
      contentBase: path.join(__dirname, dashboardBuildPath),
      historyApiFallback: true,
      hot: true,
      port: 9000
    },
    devtool: "sourceMap",
    entry: {
      dashboard: "./src/index.tsx"
    },
    module: {
      rules: [
        {
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            configFile: resolve("./babel.config.js")
          },
          test: /\.(jsx?|tsx?)$/
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
    plugins: [checkerPlugin, environmentPlugin, htmlWebpackPlugin],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      plugins: [pathsPlugin]
    }
  };
};
