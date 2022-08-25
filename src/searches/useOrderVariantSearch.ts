import { gql } from "@apollo/client";
import {
  SearchOrderVariantDocument,
  SearchOrderVariantQuery,
  SearchOrderVariantQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

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
      filter: {
        search: $query
        isPublished: $isPublished
        stockAvailability: $stockAvailability
      }
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          variants {
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
