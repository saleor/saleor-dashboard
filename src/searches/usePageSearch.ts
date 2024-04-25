// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchPagesDocument,
  SearchPagesQuery,
  SearchPagesQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchPages = gql`
  query SearchPages($after: String, $first: Int!, $query: String!) {
    search: pages(after: $after, first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<SearchPagesQuery, SearchPagesQueryVariables>(SearchPagesDocument);
