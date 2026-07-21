import { gql } from "@apollo/client";

/**
 * Next page of variants for a product in AssignVariantDialog.
 * Reuses SearchProductVariant (channelListings), not order pricing.
 */
export const searchProductVariantsForAssign = gql`
  query SearchProductVariantsForAssign($id: ID!, $first: Int!, $after: String, $channel: String) {
    product(id: $id, channel: $channel) {
      id
      productVariants(first: $first, after: $after) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            ...SearchProductVariant
          }
        }
      }
    }
  }
`;
