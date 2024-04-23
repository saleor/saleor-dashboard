// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchProductsDocument,
  SearchProductsQuery,
  SearchProductsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchProducts = gql`
  query SearchProducts(
    $after: String
    $first: Int!
    $query: String!
    $channel: String
  ) {
    search: products(
      after: $after
      first: $first
      filter: { search: $query }
      channel: $channel
    ) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          channelListings {
            channel {
              id
              name
              currencyCode
            }
          }
          variants {
            id
            name
            sku
            channelListings {
              channel {
                id
                isActive
                name
                currencyCode
              }
              price {
                amount
                currency
              }
            }
          }
          collections {
            id
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchProductsQuery,
  SearchProductsQueryVariables
>(SearchProductsDocument);
