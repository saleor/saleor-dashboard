import { gql } from "@apollo/client";

/**
 * Storefront faceted navigation settings, removed from the `Attribute` type in 3.24.
 *
 * Kept out of the shared `Attribute` fragment so that only the attribute module's own documents
 * pay for it. `@lockSchema` drops the three fields from the document on staging builds — see
 * `src/graphql/lockSchema.ts` — which is why `id` is here: it keeps the fragment from collapsing
 * into an empty, unprintable selection set.
 *
 * Delete the fragment and its spreads once staging becomes main.
 */
export const attributeFacetedNavigationFragment = gql`
  fragment AttributeFacetedNavigation on Attribute {
    id
    availableInGrid @lockSchema(schema: "main")
    filterableInStorefront @lockSchema(schema: "main")
    storefrontSearchPosition @lockSchema(schema: "main")
  }
`;
