module.exports = api => {
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
    "@babel/plugin-proposal-class-properties",
    [
      "@babel/plugin-proposal-decorators",
      {
        decoratorsBeforeExport: true
      }
    ],
    "@babel/plugin-proposal-object-rest-spread",
    "react-intl-auto",
    [
      "react-intl",
      {
        extractFromFormatMessageCall: true,
        messagesDir: "build/locale/"
      }
    ],
    "macros"
  ];

  return {
    presets,
    plugins,
    ignore
  };
};
