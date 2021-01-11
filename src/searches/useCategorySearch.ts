import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchCategories,
  SearchCategoriesVariables
} from "./types/SearchCategories";

export const searchCategories = gql`
  ${pageInfoFragment}
  query SearchCategories($after: String, $first: Int!, $query: String!) {
    search: categories(
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

export default makeTopLevelSearch<SearchCategories, SearchCategoriesVariables>(
  searchCategories
);
