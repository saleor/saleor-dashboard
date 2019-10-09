const CheckerPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require('dotenv').config();

const resolve = path.resolve.bind(path, __dirname);

const pathsPlugin = new TsconfigPathsPlugin({
  configFile: "./tsconfig.json"
});

const checkerPlugin = new CheckerPlugin({
  reportFiles: ["src/**/*.{ts,tsx}"],
  tslint: true
});
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  hash: true,
  filename: "index.html",
  template: "./src/index.html"
});
const environmentPlugin = new webpack.EnvironmentPlugin([
  "APP_MOUNT_URI",
  "API_URI"
]);

const dashboardBuildPath = "build/dashboard/";

module.exports = (env, argv) => {
  const devMode = argv.mode !== "production";

  let fileLoaderPath;
  let output;

  if (!devMode) {
    const publicPath = process.env.STATIC_URL || "/";
    output = {
      path: resolve(dashboardBuildPath),
      filename: "[name].[chunkhash].js",
      chunkFilename: "[name].[chunkhash].js",
      publicPath
    };
    fileLoaderPath = "file-loader?name=[name].[hash].[ext]";
  } else {
    output = {
      path: resolve(dashboardBuildPath),
      filename: "[name].js",
      chunkFilename: "[name].js",
      publicPath: "/"
    };
    fileLoaderPath = "file-loader?name=[name].[ext]";
  }

  return {
    devServer: {
      contentBase: path.join(__dirname, dashboardBuildPath),
      compress: true,
      historyApiFallback: true,
      hot: true,
      port: 9000
    },
    entry: {
      dashboard: "./src/index.tsx"
    },
    output,
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            configFile: resolve("./babel.config.js")
          }
        },
        {
          test: /\.(eot|otf|png|svg|jpg|ttf|woff|woff2)(\?v=[0-9.]+)?$/,
          loader: fileLoaderPath,
          include: [
            resolve("node_modules"),
            resolve("assets/fonts"),
            resolve("assets/images"),
            resolve("assets/favicons")
          ]
        }
      ]
    },
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
    },
    plugins: [checkerPlugin, environmentPlugin, htmlWebpackPlugin],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      plugins: [pathsPlugin]
    },
    devtool: "sourceMap"
  };
};
