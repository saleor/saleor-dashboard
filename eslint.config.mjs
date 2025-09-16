// @ts-check

import { globalIgnores } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";
import formatjs from "eslint-plugin-formatjs";
import globals from "globals";
import localRules from "./lint/rules/index.mjs";

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
  ]),

  eslint.configs.recommended,
  tseslint.configs.recommended, // Note: we can migrate to rules using TypeScript types
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,

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

      // Migration in progress:
      // Tracked in https://github.com/saleor/saleor-dashboard/issues/3813
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // Disabled after migration to ESLint 9, we need to migrate code to enable these rules:
      "@typescript-eslint/no-empty-object-type": "off",
      "no-constant-binary-expression": "off",
      "no-case-declarations": "off",
      "prefer-const": "off",
    },
  },

  // Configure custom plugins and rules for React files
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
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
    },
    rules: {
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
      "no-restricted-imports": [
        "error",
        {
          paths: ["lodash", "classnames",
            {
              name: "react",
              importNames: ["default", "React"],
              message: "Import directly the needed functions, e.g. 'import {useState} from \"react\"'",
            }
          ],
        },
      ],
    },
  },

  // Disable rules for specific dfiles
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

  // Additional rules (needs to be here, because other imports have "error", not "warn")
  {
    rules: {
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
            }
          ],
        },
      ],
    },
  },

  // Disable any rules that conflict with Prettier
  prettierConfig,
);
