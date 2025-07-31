import globals from "globals";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
// Storybook plugin disabled - no Storybook files found in project
// import storybook from "eslint-plugin-storybook";
import importPlugin from "eslint-plugin-import";
import formatjs from "eslint-plugin-formatjs";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import localRules from "./lint/rules/named-styles.js";

export default [
  // Global ignores
  {
    ignores: ["node_modules/", "build/", "dist/", "dev-dist/", "coverage/"],
  },

  // Base configuration for all files
  {
    files: ["{src,playwright}/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // TypeScript configuration
  {
    files: ["{src,playwright}/**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      // Decided to turn off:
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      // Migration in progress:
      // Tracked in https://github.com/saleor/saleor-dashboard/issues/3813
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },

  // React configuration
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    plugins: {
      ...react.configs.flat.recommended.plugins,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      formatjs,
      "local-rules": {
        rules: {
          "named-styles": localRules,
        },
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off",
      "react-refresh/only-export-components": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "import/no-duplicates": "error",
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
      "formatjs/enforce-id": [
        "error",
        {
          idInterpolationPattern: "[sha512:contenthash:base64:6]",
        },
      ],
      "local-rules/named-styles": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: ["lodash", "@material-ui/icons/Delete", "classnames"],
        },
      ],
      "no-console": [
        "error",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },

  // Playwright specific configuration
  {
    files: ["playwright/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./playwright/tsconfig.json",
      },
    },
    rules: {
      "no-console": "off",
    },
  },

  // Test and story files configuration
  {
    files: ["src/**/*.test.*", "src/**/*.stories.*"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // Source files specific configuration
  {
    files: ["src/**/*"],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          paths: [
            {
              name: "react-sortable-hoc",
              message: "Use @dnd-kit instead of react-sortable-hoc.",
            },
          ],
        },
      ],
    },
  },

  // Storybook configuration disabled - no Storybook files found in project
  // ...storybook.configs["flat/recommended"],
];
