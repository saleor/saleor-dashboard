import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema-3.23.graphql",
  documents: ["src/staging-operations/*.graphql"],
  generates: {
    "./src/graphql/fragmentTypesV323.generated.ts": {
      plugins: ["fragment-matcher"],
      config: {
        minify: false,
        apolloClientVersion: 3,
      },
    },
    "./src/graphql/typePoliciesV323.generated.ts": {
      plugins: ["typescript-apollo-client-helpers"],
    },
    "./src/graphql/typesV323.generated.ts": {
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
        typeSuffix: "V323",
      },
    },
    "./src/graphql/hooksV323.generated.ts": {
      plugins: ["typescript-react-apollo"],
      config: {
        withHooks: true,
        apolloReactHooksImportFrom: "@dashboard/hooks/graphql",
        documentVariableSuffix: "V323",
        reactApolloVersion: 3,
      },
      preset: "import-types",
      presetConfig: {
        typesPath: "./typesV323.generated",
      },
    },
  },
};

export default config;
