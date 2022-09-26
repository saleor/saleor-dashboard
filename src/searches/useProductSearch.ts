import { gql } from "@apollo/client";
import {
  SearchProductsDocument,
  SearchProductsQuery,
  SearchProductsQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

export const searchProducts = gql`
  query SearchProducts($after: String, $first: Int!, $query: String!) {
    search: products(after: $after, first: $first, filter: { search: $query }) {
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
