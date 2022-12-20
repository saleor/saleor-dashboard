/* eslint-disable @typescript-eslint/no-var-requires */
const { generate } = require("@graphql-codegen/cli");
const Flagsmith = require("flagsmith-nodejs");

const ENVS_PREFIX = "FF_API_";
const FLAGSMISH_PREFIX = "api_";

(async () => {
  const flags = await getFeatureFlags();
  const graphqlSchemesSuffix = ["default", ...Object.keys(flags)];

  for await (const suffix of graphqlSchemesSuffix) {
    generateTypes(prepareSuffix(suffix));
  }
})();

async function generateTypes(suffix) {
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
            process.cwd() + "/src/**/fragments/*.ts",
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
            process.cwd() + "/src/**/fragments/*.ts",
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

async function getFeatureFlags() {
  const isFeatureFlagsEnabled = process.env.FLAGS_ENABLED;

  if (isFeatureFlagsEnabled === "true") {
    const flags = await getFlagsmishFeatureFlags();
    return flags;
  }

  return getEnvFeatureFlags();
}

async function getFlagsmishFeatureFlags() {
  const flagsmith = new Flagsmith({
    environmentKey: process.env.FLAGSMISH_ID,
  });

  const flags = await flagsmith.getEnvironmentFlags();

  return Object.entries(flags.flags).reduce((acc, [flagName, flagDetails]) => {
    if (flagDetails.enabled && flagName.startsWith(FLAGSMISH_PREFIX)) {
      acc[flagName] = flagDetails.value;
    }

    return acc;
  }, {});
}

function getEnvFeatureFlags() {
  return Object.fromEntries(
    Object.entries(process.env).filter(([keyName]) =>
      keyName.startsWith(ENVS_PREFIX),
    ),
  );
}

function prepareSuffix(suffix) {
  if (suffix === "default") {
    return "";
  }

  const prefixToSplit = suffix.startsWith(ENVS_PREFIX)
    ? ENVS_PREFIX
    : FLAGSMISH_PREFIX;

  const splted = suffix.split(prefixToSplit)[1];
  const formated = splted.toLowerCase().replace("_", "-");

  return "." + formated;
}
