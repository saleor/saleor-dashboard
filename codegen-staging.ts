import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema-staging.graphql",
  documents: [
    "./src/**/queries.ts",
    "./src/**/mutations.ts",
    "./src/**/fragments/*.ts",
    "./src/searches/*.ts",
  ],
  generates: {
    "./src/graphql/fragmentTypesStaging.generated.ts": {
      plugins: ["fragment-matcher"],
      config: {
        minify: false,
        apolloClientVersion: 3,
      },
    },
    "./src/graphql/typePoliciesStaging.generated.ts": {
      plugins: ["typescript-apollo-client-helpers"],
    },
    "./src/graphql/typesStaging.generated.ts": {
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
        typeSuffix: "Staging",
      },
    },
    "./src/graphql/hooksStaging.generated.ts": {
      plugins: ["typescript-react-apollo"],
      config: {
        withHooks: true,
        apolloReactHooksImportFrom: "@dashboard/hooks/graphql",
        documentVariableSuffix: "Staging",
        reactApolloVersion: 3,
      },
      preset: "import-types",
      presetConfig: {
        typesPath: "./typesStaging.generated",
      },
    },
  },
};

export default config;
