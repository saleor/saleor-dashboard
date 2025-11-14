import type { IGraphQLConfig } from "graphql-config";

/**
 * This is a centralized graphQL config. Once we update other packages like codegen,
 * they should use this file for common settings
 *
 * https://the-guild.dev/graphql/config
 *
 * Multi-schema support:
 * - production: Schema 3.22 (production API)
 * - staging: Schema 3.23 (staging API)
 */
const config: IGraphQLConfig = {
  projects: {
    production: {
      schema: "schema-3.22.graphql",
      documents: [
        "./src/**/queries.ts",
        "./src/**/mutations.ts",
        "./src/**/fragments/*.ts",
        "./src/searches/*.ts",
      ],
    },
    staging: {
      schema: "schema-3.23.graphql",
      documents: [
        "./src/**/queries.ts",
        "./src/**/mutations.ts",
        "./src/**/fragments/*.ts",
        "./src/searches/*.ts",
      ],
    },
  },
};

export default config;
