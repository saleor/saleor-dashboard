import { gql } from "@apollo/client";
import {
  SearchProductTypesDocument,
  SearchProductTypesQuery,
  SearchProductTypesQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

export const searchProductTypes = gql`
  query SearchProductTypes($after: String, $first: Int!, $query: String!) {
    search: productTypes(
      after: $after
      first: $first
      filter: { search: $query }
    ) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchProductTypesQuery,
  SearchProductTypesQueryVariables
>(SearchProductTypesDocument);
