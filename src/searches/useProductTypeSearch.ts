import { gql } from "@apollo/client";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";

import {
  SearchProductTypes,
  SearchProductTypesVariables
} from "./types/SearchProductTypes";

export const searchProductTypes = gql`
  ${pageInfoFragment}
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
        ...PageInfoFragment
      }
    }
  }
`;

export default makeTopLevelSearch<
  SearchProductTypes,
  SearchProductTypesVariables
>(searchProductTypes);
