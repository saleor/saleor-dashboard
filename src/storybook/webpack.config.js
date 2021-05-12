/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CheckerPlugin = require("fork-ts-checker-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const resolve = resolvePath => path.resolve(__dirname, resolvePath);

module.exports = ({ config }) => {
  config.module.rules.push({
    exclude: /node_modules/,
    loader: "babel-loader",
    options: {
      configFile: resolve("../../babel.config.js"),
      envName: "storybook"
    },
    test: /\.(jsx?|tsx?)$/
  });
  config.optimization.removeAvailableModules = false;
  config.optimization.removeEmptyChunks = false;
  config.optimization.splitChunks = false;
  config.resolve.extensions.push(".ts", ".tsx");
  config.resolve.plugins = [
    new TsconfigPathsPlugin({
      configFile: "./tsconfig.json"
    })
  ];
  // Resolve macaw ui's peer dependencies to our own node_modules
  // to make it work with npm link
  config.resolve.alias = {
    react: path.resolve("./node_modules/react"),
    "react-dom": path.resolve("./node_modules/react-dom"),
    "@material-ui/core": path.resolve("./node_modules/@material-ui/core"),
    "@material-ui/icons": path.resolve("./node_modules/@material-ui/icons")
  };
  config.plugins.push(
    new CheckerPlugin({
      eslint: true
    })
  );
  return config;
};
