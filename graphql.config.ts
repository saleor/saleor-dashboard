import type { IGraphQLConfig } from "graphql-config";

/**
 * This is a centralized graphQL config. Once we update other packages like codegen,
 * they should use this file for common settings
 *
 * https://the-guild.dev/graphql/config
 *
 * Multi-schema support:
 * - stable: Pinned Saleor release tag
 * - unstable: Latest from Saleor main branch
 */
const config: IGraphQLConfig = {
  projects: {
    stable: {
      schema: "schema-stable.graphql",
      documents: [
        "./src/**/queries.ts",
        "./src/**/mutations.ts",
        "./src/**/fragments/*.ts",
        "./src/searches/*.ts",
      ],
    },
    unstable: {
      schema: "schema-unstable.graphql",
      documents: [
        "./src/**/queries.unstable.ts",
        "./src/**/mutations.unstable.ts",
        "./src/**/fragments/*.unstable.ts",
        "./src/searches/*.unstable.ts",
      ],
    },
  },
};

export default config;
