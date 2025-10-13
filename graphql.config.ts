import type { IGraphQLConfig } from "graphql-config";

/**
 * This is a centralized graphQL config. Once we update other packages like codegen,
 * they should use this file for common settings
 *
 * https://the-guild.dev/graphql/config
 */
const config: IGraphQLConfig = {
  schema: "schema.graphql",
  documents: [
    "./src/**/queries.ts",
    "./src/**/mutations.ts",
    "./src/**/fragments/*.ts",
    "./src/searches/*.ts",
  ],
};

export default config;
