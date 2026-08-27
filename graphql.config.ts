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
      schema: ["schema-main.graphql", "schema-directives.graphql"],
      documents: [
        "./src/**/queries.ts",
        "./src/**/mutations.ts",
        "./src/**/fragments/!(*staging).ts",
        "./src/**/fragments.ts",
        "./src/searches/*.ts",
      ],
    },
    staging: {
      schema: ["schema-staging.graphql", "schema-directives.graphql"],
      documents: [
        // Shared fragments are validated against 3.24 by codegen-staging, which can resolve
        // @lockSchema first; graphql-eslint has no such hook, so it only sees them as main.
        "./src/**/queries.staging.ts",
        "./src/**/mutations.staging.ts",
        "./src/**/fragments/*.staging.ts",
        "./src/searches/*.staging.ts",
      ],
    },
  },
};

export default config;
