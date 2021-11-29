module.exports = api => {
  const isExtract = api.env("extract");
  const isTest = api.env("test");
  const isStorybook = api.env("storybook");

  const ignore =
    isTest || isStorybook
      ? []
      : ["**/*.test.ts", "**/*.test.tsx", "src/storybook"];

  const presets = [
    "@babel/preset-typescript"
  ];

  const plugins = [
    [
      "formatjs",
      {
        "idInterpolationPattern": "[sha512:contenthash:base64:6]",
        "ast": true
      }
    ]
  ];

  if (isExtract) {
    plugins.push([
      "react-intl",
      {
        extractFromFormatMessageCall: true,
        messagesDir: "build/locale/",
      }
    ]);
  }

  return {
    ignore,
    plugins,
    presets
  };
};
