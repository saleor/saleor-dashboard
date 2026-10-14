// @ts-check
// Most linting runs in oxlint (see .oxlintrc.json). ESLint only runs what oxlint cannot:
// React Compiler rules and GraphQL operation rules (which need the graphql-eslint processor).
import eslintGraphql from "@graphql-eslint/eslint-plugin";
import { globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
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
    plugins: { "react-hooks": reactHooks },
    // React Compiler rules, warn-only for gradual adoption
    rules: {
      "react-hooks/purity": "warn", // Side effects during render
      "react-hooks/refs": "warn", // Reading/writing refs during render
      "react-hooks/set-state-in-render": "warn", // setState during render
      "react-hooks/set-state-in-effect": "warn", // Synchronous setState in effects
      "react-hooks/immutability": "warn", // Mutation of props/state
      "react-hooks/static-components": "warn", // Dynamic component creation
      "react-hooks/use-memo": "warn", // useMemo violations
      "react-hooks/void-use-memo": "warn", // useMemo returning void
      "react-hooks/component-hook-factories": "warn", // Component/hook factory violations
      "react-hooks/preserve-manual-memoization": "warn", // Manual memoization issues
      "react-hooks/globals": "warn", // Global variable usage
      "react-hooks/error-boundaries": "warn", // Error boundary violations
      "react-hooks/config": "warn", // Config violations
      "react-hooks/gating": "warn", // Conditional rendering violations
      "react-hooks/incompatible-library": "warn", // Libraries incompatible with memoization
      "react-hooks/unsupported-syntax": "warn", // Syntax the compiler cannot handle
    },
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
