import gql from "graphql-tag";

import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import { pageInfoFragment } from "@saleor/queries";
import { SearchPages, SearchPagesVariables } from "./types/SearchPages";

export const searchPages = gql`
  ${pageInfoFragment}
  query SearchPages($after: String, $first: Int!, $query: String!) {
    search: pages(after: $after, first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export default makeTopLevelSearch<SearchPages, SearchPagesVariables>(
  searchPages
);
