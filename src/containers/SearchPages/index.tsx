import gql from "graphql-tag";

import { pageInfoFragment } from "@saleor/queries";
import TopLevelSearch from "../TopLevelSearch";
import { SearchPages, SearchPagesVariables } from "./types/SearchPages";

export const searchPages = gql`
  ${pageInfoFragment}
  query SearchPages($after: String, $first: Int!, $query: String!) {
    search: pages(after: $after, first: $first, query: $query) {
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

export default TopLevelSearch<SearchPages, SearchPagesVariables>(searchPages);
