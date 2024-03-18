import { withoutVitePlugins } from "@storybook/builder-vite";
import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "path";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  features: {
    storyStoreV7: true,
  },

  async viteFinal(config) {
    config.plugins = await withoutVitePlugins(config.plugins, [
      "vite:html",
      "sentry-telemetry-plugin",
      "sentry-vite-release-injection-plugin",
      "sentry-debug-id-upload-plugin",
      "sentry-vite-debug-id-injection-plugin",
      "sentry-vite-debug-id-upload-plugin",
    ]);

    return mergeConfig(config, {
      build: {
        commonjsOptions: {
          transformMixedEsModules: true,
        },
      },
      resolve: {
        alias: {
          "@material-ui/lab": resolve("./node_modules/@material-ui/lab"),
        },
      },
    });
  },
};

export default config;
