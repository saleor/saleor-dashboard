module.exports = api => {
  const isExtract = api.env("extract");
  const isTest = api.env("test");
  const isStorybook = api.env("storybook");

  const ignore =
    isTest || isStorybook
      ? []
      : ["**/*.test.ts", "**/*.test.tsx", "src/storybook"];

  const presets = [
    [
      "@babel/preset-env",
      {
        corejs: "3.2.1",
        modules: isTest ? "auto" : false,
        useBuiltIns: "usage"
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ];

  const plugins = [
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-class-properties",
    [
      "@babel/plugin-proposal-decorators",
      {
        decoratorsBeforeExport: true
      }
    ],
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "react-intl-auto"
  ];

  if (isExtract) {
    plugins.push([
      "react-intl",
      {
        extractFromFormatMessageCall: true,
        messagesDir: "build/locale/"
      }
    ]);
  }

  plugins.push("macros");

  return {
    ignore,
    plugins,
    presets
  };
};
