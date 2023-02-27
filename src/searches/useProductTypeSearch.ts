import { gql } from "@apollo/client";
import {
  SearchProductTypesDocument,
  SearchProductTypesQuery,
  SearchProductTypesQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchProductTypes = gql`
  query SearchProductTypes($after: String, $first: Int!, $query: String!) {
    search: productTypes(after: $after, first: $first, filter: { search: $query }) {
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

export default makeTopLevelSearch<SearchProductTypesQuery, SearchProductTypesQueryVariables>(
  SearchProductTypesDocument,
);
