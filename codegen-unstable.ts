import { type CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema-unstable.graphql",
  ignoreNoDocuments: true,
  documents: [
    "./src/**/queries.unstable.ts",
    "./src/**/mutations.unstable.ts",
    "./src/**/fragments/*.unstable.ts",
    "./src/searches/*.unstable.ts",
  ],
  generates: {
    "./src/graphql/fragmentTypesUnstable.generated.ts": {
      plugins: ["fragment-matcher"],
      config: {
        minify: false,
        apolloClientVersion: 3,
      },
    },
    "./src/graphql/typePoliciesUnstable.generated.ts": {
      plugins: ["typescript-apollo-client-helpers"],
    },
    "./src/graphql/typesUnstable.generated.ts": {
      plugins: ["typescript", "typescript-operations"],
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
        typeSuffix: "Unstable",
      },
    },
    "./src/graphql/hooksUnstable.generated.ts": {
      plugins: ["typescript-react-apollo"],
      config: {
        withHooks: true,
        apolloReactHooksImportFrom: "@dashboard/hooks/graphql",
        documentVariableSuffix: "Unstable",
      },
      preset: "import-types",
      presetConfig: {
        typesPath: "./typesUnstable.generated",
      },
    },
  },
};

export default config;
