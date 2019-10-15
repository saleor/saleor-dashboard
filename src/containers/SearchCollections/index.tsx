import gql from "graphql-tag";

import { pageInfoFragment } from "@saleor/queries";
import TopLevelSearch from "../TopLevelSearch";
import {
  SearchCollections,
  SearchCollectionsVariables
} from "./types/SearchCollections";

export const searchCollections = gql`
  ${pageInfoFragment}
  query SearchCollections($after: String, $first: Int!, $query: String!) {
    search: collections(after: $after, first: $first, query: $query) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export default TopLevelSearch<SearchCollections, SearchCollectionsVariables>(
  searchCollections
);
