// @ts-check
// Linting, including React Compiler rules, runs in oxlint (see .oxlintrc.json).
// ESLint retains GraphQL operation rules, which need the graphql-eslint processor.
import eslintGraphql from "@graphql-eslint/eslint-plugin";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores([
    "node_modules/",
    "build/",
    "dist/",
    "dev-dist/",
    "coverage/",
    "**/types/**/*",
    "type-policies.ts",
    "e2e-legacy/auth.js",
    "**/*.generated.ts",
    ".github/**/*.js",
    ".featureFlags/",
  ]),
  {
    // Rules for oxlint-only plugins are not loaded here, so ESLint cannot tell whether
    // their disable directives are used. oxlint reports unused directives instead.
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    extends: [tseslint.configs.base],
  },
  {
    /**
     * Plugin first converts all ts(x) files to
     * temp .graphql files which are checked in the next step
     */
    files: ["**/*.ts", "**/*.tsx"],
    processor: eslintGraphql.processor,
  },
  {
    files: ["**/*.graphql"],
    languageOptions: {
      parser: eslintGraphql.parser,
    },
    plugins: {
      "@graphql-eslint": eslintGraphql,
    },
    rules: {
      ...eslintGraphql.configs["flat/operations-recommended"].rules,
      "@graphql-eslint/no-deprecated": "warn",
      "@graphql-eslint/naming-convention": "off",
      // TODO: These rules should be enabled later on
      "@graphql-eslint/selection-set-depth": ["warn", { maxDepth: 7 }], // some queries use hacks to do recursive fragments
      "@graphql-eslint/require-selections": "warn", // this is useful for Apollo caching
    },
  },
);
