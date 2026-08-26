import { gql } from "@apollo/client";

/**
 * Storefront faceted navigation settings, removed from the `Attribute` type in 3.24.
 *
 * Kept out of the shared `Attribute` fragment so that only the attribute module's own documents
 * pay for it. Every document spreading this fragment has a twin in `*.staging.ts` that omits it;
 * see `src/attributes/schemaAwareOperations.ts` for how the two are selected.
 */
export const attributeFacetedNavigationFragment = gql`
  fragment AttributeFacetedNavigation on Attribute {
    availableInGrid
    filterableInStorefront
    storefrontSearchPosition
  }
`;
