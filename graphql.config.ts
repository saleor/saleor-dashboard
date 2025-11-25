import type { IGraphQLConfig } from "graphql-config";

/**
 * This is a centralized graphQL config. Once we update other packages like codegen,
 * they should use this file for common settings
 *
 * https://the-guild.dev/graphql/config
 *
 * Multi-schema support:
 * - main: Main/production schema
 * - staging: Staging/preview schema
 */
const config: IGraphQLConfig = {
  projects: {
    main: {
      schema: "schema-main.graphql",
      documents: [
        "./src/**/queries.ts",
        "./src/**/mutations.ts",
        "./src/**/fragments/*.ts",
        "./src/searches/*.ts",
      ],
    },
    staging: {
      schema: "schema-staging.graphql",
      documents: [
        "./src/**/queries.staging.ts",
        "./src/**/mutations.staging.ts",
        "./src/**/fragments/*.staging.ts",
        "./src/searches/*.staging.ts",
      ],
    },
  },
};

export default config;
