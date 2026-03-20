// eslint-disable-next-line no-undef
module.exports = {
  include: ["src/**/*.{ts,tsx}"],
  exclude: [
    "node_modules/**",
    "**/*.test.*",
    "**/*.stories.*",
    "**/*.generated.ts",
    "**/*.fixture.*",
    "src/graphql/**",
  ],
  advanced: true,
  maxFiles: 0,
};
