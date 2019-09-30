import gql from "graphql-tag";

import BaseSearch from "../BaseSearch";
import {
  SearchProductTypes,
  SearchProductTypesVariables
} from "./types/SearchProductTypes";

export const searchProductTypes = gql`
  query SearchProductTypes($after: String, $first: Int!, $query: String!) {
    productTypes(after: $after, first: $first, filter: { search: $query }) {
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
    }
  }
`;

export default BaseSearch<SearchProductTypes, SearchProductTypesVariables>(
  searchProductTypes
);
