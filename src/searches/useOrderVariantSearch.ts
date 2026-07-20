// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchOrderVariantDocument,
  type SearchOrderVariantQuery,
  type SearchOrderVariantQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

/**
 * Variants page size for the order add-line dialog (initial search embed and
 * Load more). Keep in sync with `productVariants(first: …)` below — codegen
 * cannot interpolate JS constants into the document.
 */
export const ORDER_PRODUCT_ADD_VARIANTS_PAGE_SIZE = 50;

/**
 * Caps variants per product in order add-line search. Further pages load via
 * OrderProductVariantsForAdd in the dialog.
 */
export const searchOrderVariant = gql`
  query SearchOrderVariant(
    $channel: String!
    $first: Int!
    $query: String!
    $after: String
    $address: AddressInput
    $isPublished: Boolean
    $stockAvailability: StockAvailability
  ) {
    search: products(
      first: $first
      after: $after
      filter: { search: $query, isPublished: $isPublished, stockAvailability: $stockAvailability }
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          productVariants(first: 50) {
            totalCount
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                name
                sku
                pricing(address: $address) {
                  priceUndiscounted {
                    gross {
                      ...Money
                    }
                  }
                  price {
                    gross {
                      ...Money
                    }
                  }
                  onSale
                }
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const useOrderVariantSearch = makeTopLevelSearch<
  SearchOrderVariantQuery,
  SearchOrderVariantQueryVariables
>(SearchOrderVariantDocument);
