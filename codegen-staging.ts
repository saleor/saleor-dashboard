import { type CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // schema-directives declares @lockSchema, which the API does not know about
  schema: ["./schema-staging.graphql", "./schema-directives.graphql"],
  ignoreNoDocuments: true,
  documents: [
    // Shared fragments are deliberately not loaded here: they carry @lockSchema, and the
    // import-types preset drops `documentTransforms`, so codegen cannot resolve it before
    // validating. src/graphql/lockSchema.test.ts validates every document against 3.24 instead.
    "./src/**/queries.staging.ts",
    "./src/**/mutations.staging.ts",
    "./src/**/fragments/*.staging.ts",
    "./src/searches/*.staging.ts",
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
      },
      preset: "import-types",
      presetConfig: {
        typesPath: "./typesStaging.generated",
      },
    },
  },
};

export default config;
