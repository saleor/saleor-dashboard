import { gql } from "@apollo/client";
import {
  SearchCollectionsDocument,
  SearchCollectionsQuery,
  SearchCollectionsQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

export const searchCollections = gql`
  query SearchCollections($after: String, $first: Int!, $query: String!) {
    search: collections(
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
  SearchCollectionsQuery,
  SearchCollectionsQueryVariables
>(SearchCollectionsDocument);
