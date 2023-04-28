/* eslint-disable @typescript-eslint/no-var-requires */
const { generate } = require("@graphql-codegen/cli");

// Feature flags names that will be used as suffix for generated files
const FEATURE_FLAGS = [];

const schemaSuffixes = ["default", ...FEATURE_FLAGS];

for (const rawSuffix of schemaSuffixes) {
  const suffix = prepareSuffix(rawSuffix);

  generate(
    {
      schema: `./introspection${suffix}.json`,
      overwrite: true,
      generates: {
        [getOutputPath("fragmentTypes", suffix)]: {
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
        [getOutputPath("typePolicies", suffix)]: {
          plugins: [
            {
              add: {
                content: "/* eslint-disable */",
              },
            },
            "typescript-apollo-client-helpers",
          ],
        },
        [getOutputPath("types", suffix)]: {
          documents: getDocumentsPaths(suffix, rawSuffix),
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
        [getOutputPath("hooks", suffix)]: {
          documents: getDocumentsPaths(suffix, rawSuffix),
          preset: "import-types",
          presetConfig: {
            typesPath: "./types" + suffix + ".generated",
          },
          config: {
            withHooks: true,
            apolloReactHooksImportFrom: "@dashboard/hooks/graphql",
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

function getOutputPath(path, suffix) {
  return `./src/graphql/${path}${suffix}.generated.ts`;
}

function getDocumentsPaths(suffix, rawSuffix) {
  return [
    `./src/**/queries${suffix}.ts`,
    `./src/**/mutations${suffix}.ts`,
    `./src/**/fragments/*${suffix}.ts`,
    `./src/searches/*${suffix}.ts`,
    // Remove feature flag files from default suffix (matches glob)
    ...FEATURE_FLAGS.filter(flag => flag !== rawSuffix).map(
      flag => `!./src/**/*${prepareSuffix(flag)}.ts`,
    ),
    // Always add all fragments (e.g. Money)
    ...(rawSuffix !== "default" ? ["./src/**/fragments/*.ts"] : []),
  ];
}

function prepareSuffix(suffix) {
  if (suffix === "default") {
    return "";
  }

  return "." + suffix;
}
