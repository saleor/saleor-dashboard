import { gql } from "@apollo/client";
import {
  SearchPagesDocument,
  SearchPagesQuery,
  SearchPagesQueryVariables,
} from "@saleor/graphql";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

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

export default makeTopLevelSearch<SearchPagesQuery, SearchPagesQueryVariables>(
  SearchPagesDocument,
);
