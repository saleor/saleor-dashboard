/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CheckerPlugin = require("fork-ts-checker-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");

module.exports = ({ config }) => {
  config.module.rules.push({
    exclude: /node_modules/,
    loader: "esbuild-loader",
    options: {
      loader: "tsx",
      target: "es2015",
    },
    test: /\.(jsx?|tsx?)$/,
  });
  config.optimization.removeAvailableModules = false;
  config.optimization.removeEmptyChunks = false;
  config.optimization.splitChunks = false;
  config.resolve.extensions.push(".ts", ".tsx");
  config.resolve.plugins = [
    new TsconfigPathsPlugin({
      configFile: "./tsconfig.json",
    }),
  ];
  // Resolve macaw ui's peer dependencies to our own node_modules
  // to make it work with npm link
  config.resolve.alias = {
    "@saleor/macaw-ui/next": path.resolve(
      "./node_modules/@saleor/macaw-ui/dist/macaw-ui.js",
    ),
    "@saleor/macaw-ui": path.resolve(
      "./node_modules/@saleor/macaw-ui/legacy/dist/esm/index.js",
    ),
    react: path.resolve("./node_modules/react"),
    "react-dom": path.resolve("./node_modules/react-dom"),
    "@material-ui/core": path.resolve("./node_modules/@material-ui/core"),
    "@material-ui/icons": path.resolve("./node_modules/@material-ui/icons"),
    "@material-ui/styles": path.resolve("./node_modules/@material-ui/styles"),
  };
  config.plugins.push(
    new CheckerPlugin({
      eslint: true,
    }),
    new webpack.DefinePlugin({
      FLAGS_SERVICE_ENABLED: false,
      FLAGS: {},
    }),
  );
  return config;
};
