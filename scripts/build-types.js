/* eslint-disable @typescript-eslint/no-var-requires */
const { generate } = require("@graphql-codegen/cli");

// Feature flags names that will be used as suffix for generated files
const FEATURE_FLAGS = ["taxes"];

(async () => {
  const schemaSuffixes = ["default", ...FEATURE_FLAGS];

  for await (const rawSuffix of schemaSuffixes) {
    const suffix = prepareSuffix(rawSuffix);

    await generate(
      {
        schema: process.cwd() + "/introspection" + suffix + ".json",
        overwrite: true,
        generates: {
          [process.cwd() +
          "/src/graphql/fragmentTypes" +
          suffix +
          ".generated.ts"]: {
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
          [process.cwd() +
          "/src/graphql/typePolicies" +
          suffix +
          ".generated.ts"]: {
            plugins: [
              {
                add: {
                  content: "/* eslint-disable */",
                },
              },
              "typescript-apollo-client-helpers",
            ],
          },
          [process.cwd() + "/src/graphql/types" + suffix + ".generated.ts"]: {
            documents: [
              process.cwd() + "/src/**/queries" + suffix + ".ts",
              process.cwd() + "/src/**/mutations" + suffix + ".ts",
              process.cwd() + "/src/**/fragments/*" + suffix + ".ts",
              process.cwd() + "/src/searches/*" + suffix + ".ts",
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
            plugins: [
              {
                add: {
                  content: "/* eslint-disable */",
                },
              },
              "typescript",
              "typescript-operations",
            ],
          },
          [process.cwd() + "/src/graphql/hooks" + suffix + ".generated.ts"]: {
            documents: [
              process.cwd() + "/src/**/queries" + suffix + ".ts",
              process.cwd() + "/src/**/mutations" + suffix + ".ts",
              process.cwd() + "/src/**/fragments/*" + suffix + ".ts",
              process.cwd() + "/src/searches/*" + suffix + ".ts",
            ],
            preset: "import-types",
            presetConfig: {
              typesPath: "./types" + suffix + ".generated",
            },
            config: {
              withHooks: true,
              apolloReactHooksImportFrom: "@saleor/hooks/graphql",
            },
            plugins: [
              {
                add: {
                  content: "/* eslint-disable */",
                },
              },
              "typescript-react-apollo",
            ],
          },
        },
      },
      true,
    );
  }
})();

function prepareSuffix(suffix) {
  if (suffix === "default") {
    return "";
  }

  return "." + suffix;
}
