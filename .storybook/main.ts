import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {
      builder: {
        viteConfigPath: "vite.storybook.config.js",
      }
    }
  }
};
export default config;
