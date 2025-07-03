/* eslint-disable no-undef */
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: [
    "./src/**/queries.ts",
    "./src/**/mutations.ts",
    "./src/**/fragments/*.ts",
    "./src/searches/*.ts",
  ],
  generates: {
    "./src/graphql/fragmentTypes.generated.ts": {
      plugins: [
        {
          add: {
            content: "/* eslint-disable */",
          },
        },
        "fragment-matcher",
      ],
      config: {
        minify: false,
        apolloClientVersion: 3,
      },
    },
    "./src/graphql/typePolicies.generated.ts": {
      plugins: [
        {
          add: {
            content: "/* eslint-disable */",
          },
        },
        "typescript-apollo-client-helpers",
      ],
    },
    "./src/graphql/types.generated.ts": {
      plugins: [
        {
          add: {
            content: "/* eslint-disable */",
          },
        },
        "typescript",
        "typescript-operations",
      ],
      config: {
        nonOptionalTypename: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
          defaultValue: false,
        },
        namingConvention: {
          enumValues: "change-case-all#upperCase",
        },
        onlyOperationTypes: true,
      },
    },
    "./src/graphql/hooks.generated.ts": {
      plugins: [
        {
          add: {
            content: "/* eslint-disable */",
          },
        },
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        apolloReactHooksImportFrom: "@dashboard/hooks/graphql",
      },
      preset: "import-types",
      presetConfig: {
        typesPath: "./types.generated",
      },
    },
  },
};

export default config;
