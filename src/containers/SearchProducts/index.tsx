import gql from "graphql-tag";

import { pageInfoFragment } from "@saleor/queries";
import TopLevelSearch from "../TopLevelSearch";
import {
  SearchProducts,
  SearchProductsVariables
} from "./types/SearchProducts";

export const searchProducts = gql`
  ${pageInfoFragment}
  query SearchProducts($after: String, $first: Int!, $query: String!) {
    search: products(after: $after, first: $first, query: $query) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export default TopLevelSearch<SearchProducts, SearchProductsVariables>(
  searchProducts
);
