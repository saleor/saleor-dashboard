import gql from "graphql-tag";

import { pageInfoFragment } from "@saleor/queries";
import TopLevelSearch from "../TopLevelSearch";
import {
  SearchCustomers,
  SearchCustomersVariables
} from "./types/SearchCustomers";

export const searchCustomers = gql`
  ${pageInfoFragment}
  query SearchCustomers($after: String, $first: Int!, $query: String!) {
    search: customers(after: $after, first: $first, query: $query) {
      edges {
        node {
          id
          email
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export default TopLevelSearch<SearchCustomers, SearchCustomersVariables>(
  searchCustomers
);
