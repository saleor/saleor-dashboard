// @ts-check

import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import formatjs from "eslint-plugin-formatjs";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import localRules from "./lint/rules/index.mjs";
import unusedImports from "eslint-plugin-unused-imports";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintGraphql from "@graphql-eslint/eslint-plugin";
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect";

export default tseslint.config(
  globalIgnores([
    "node_modules/",
    "build/",
    "dist/",
    "dev-dist/",
    "coverage/",
    "**/types/**/*",
    "type-policies.ts",
    "playwright/auth.js",
    "**/*.generated.ts",
    ".github/**/*.js",
    ".featureFlags/",
  ]),

  eslint.configs.recommended,
  tseslint.configs.recommended, // Note: we can migrate to rules using TypeScript types
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat["recommended-latest"],
  reactRefresh.configs.vite,
  reactYouMightNotNeedAnEffect.configs.recommended,

  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Disable global rules:
  {
    rules: {
      "sort-imports": "off", // imports are handled by simple-import-sort/sort

      // Previously decided to turn-off, check if we can revisit them and enable:
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "warn",
      // Allow constant exports is thanks to Vite (see recommended config)
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // Override React Compiler rules to warnings (for gradual adoption)
      // The recommended config sets these as errors, we downgrade to warn
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

      // Migration in progress:
      // Tracked in https://github.com/saleor/saleor-dashboard/issues/3813
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "local",
          args: "after-used",
          caughtErrors: "none",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Disabled after migration to ESLint 9, we need to migrate code to enable these rules:
      "@typescript-eslint/no-empty-object-type": "off",
      "no-constant-binary-expression": "off",
      "no-case-declarations": "off",
      "prefer-const": "off",
    },
  },

  // Properly resolve Node.js globals in .cjs files
  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: {
        ...globals.node, // Use all Node.js globals
      },
    },
  },

  // Configure custom plugins and rules for React files
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals.browser,
        ...globals.es2015,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      // Note: This plugin has it's own "recommended" config, but we didn't use if (pre ESLint 9)
      import: importPlugin,
      formatjs: formatjs,
      "local-rules": { rules: localRules },
      "unused-imports": unusedImports,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unicorn/no-empty-file": "error",
      "import/no-default-export": "warn",
      "import/no-duplicates": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "lines-between-class-members": ["error", "always"],
      "padding-line-between-statements": [
        "error",
        // After directives (like 'use-strict'), except between directives
        {
          blankLine: "always",
          prev: "directive",
          next: "*",
        },
        {
          blankLine: "any",
          prev: "directive",
          next: "directive",
        },
        // After imports, except between imports
        {
          blankLine: "always",
          prev: "import",
          next: "*",
        },
        {
          blankLine: "any",
          prev: "import",
          next: "import",
        },
        // Before and after every sequence of variable declarations
        {
          blankLine: "always",
          prev: "*",
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        // Before and after class declaration, if, while, switch, try
        {
          blankLine: "always",
          prev: "*",
          next: ["class", "if", "while", "switch", "try"],
        },
        {
          blankLine: "always",
          prev: ["class", "if", "while", "switch", "try"],
          next: "*",
        },
        // Before return statements
        {
          blankLine: "always",
          prev: "*",
          next: "return",
        },
      ],
      "formatjs/enforce-id": ["error", { idInterpolationPattern: "[sha512:contenthash:base64:6]" }],
      "local-rules/named-styles": "error",
      "local-rules/no-deprecated-icons": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },

  // Disable rules for specific files
  {
    files: ["vite.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },

  {
    files: ["playwright/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },

  {
    files: ["src/**/*.stories.@(ts|tsx)"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    files: ["src/**/*.test.*", "src/**/*.stories.*"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["scripts/**.cjs"],
    rules: {
      // cjs doesn't work with ES Import
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  {
    rules: {
      /**
       * Reasoning: This allows to understand what function does without reading it's implementation.
       * It also protects it's input and output - chanigng function internal will show error in it's body, not in other files that consuming
       */
      "@typescript-eslint/explicit-function-return-type": "warn",
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["@material-ui/*"],
              message: "Material-UI is deprecated. Use @saleor/macaw-ui-next",
            },
          ],
          paths: [
            {
              name: "@saleor/macaw-ui",
              message: "Legacy Macaw UI is deprecated. Use @saleor/macaw-ui-next",
            },
            {
              name: "react-sortable-hoc",
              message: "Use @dnd-kit instead of react-sortable-hoc.",
            },
            {
              name: "moment",
              message: "Use react-intl formatDate instead of moment.",
            },
            {
              name: "moment-timezone",
              message: "Use react-intl formatDate instead of moment-timezone.",
            },

            // Note: these should be errors but we cannot use "warn" and "error" rules in ESLint together
            {
              name: "react",
              importNames: ["default", "React", "*"],
              message:
                "Import directly the needed functions, e.g. 'import {useState} from \"react\"'",
            },
            {
              name: "lodash",
              message:
                "Do not import lodash directly, import only needed functions, e.g. 'import debounce from \"lodash/debounce\"'",
            },
            {
              name: "classnames",
              message: "Do not import classnames, use clsx instead",
            },
          ],
        },
      ],
    },
  },

  // Graphql plugin
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
      // TODO Enable recommended ruleset incrementally
      // ...eslintGraphql.configs["flat/operations-recommended"].rules,
      "@graphql-eslint/no-anonymous-operations": "error",
      "@graphql-eslint/no-duplicate-fields": "error",
      "@graphql-eslint/no-deprecated": "warn",
    },
  },

  // Disable any rules that conflict with Prettier
  prettierConfig,
);
