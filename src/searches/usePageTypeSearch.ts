import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchPageTypes,
  SearchPageTypesVariables
} from "./types/SearchPageTypes";

export const searchPageTypes = gql`
  ${pageInfoFragment}
  query SearchPageTypes($after: String, $first: Int!, $query: String!) {
    search: pageTypes(
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
        ...PageInfoFragment
      }
    }
  }
`;

export default makeTopLevelSearch<SearchPageTypes, SearchPageTypesVariables>(
  searchPageTypes
);
