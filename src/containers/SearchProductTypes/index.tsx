import gql from "graphql-tag";

import { pageInfoFragment } from "@saleor/queries";
import TopLevelSearch from "../TopLevelSearch";
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
          hasVariants
          productAttributes {
            id
            inputType
            slug
            name
            valueRequired
            values {
              id
              name
              slug
            }
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export default TopLevelSearch<SearchProductTypes, SearchProductTypesVariables>(
  searchProductTypes
);
