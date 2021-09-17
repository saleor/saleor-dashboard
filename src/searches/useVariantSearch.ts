import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchVariants,
  SearchVariantsVariables
} from "./types/SearchVariants";

export const searchVariants = gql`
  ${pageInfoFragment}
  query SearchVariants($after: String, $first: Int!, $query: String!) {
    search: productVariants(
      after: $after
      first: $first
      filter: { search: $query }
    ) {
      edges {
        node {
          id
          name
          product {
            name
            thumbnail {
              url
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

export default makeTopLevelSearch<SearchVariants, SearchVariantsVariables>(
  searchVariants
);
